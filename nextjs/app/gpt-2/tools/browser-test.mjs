// A classroom check of /gpt-2 in a real browser: cold download, every starter, greedy, Stop, warm reload, recorded
// mode, a blocked download, a slow download, and the layout at 1024px. Playwright isn't a dependency of the app, so
// run this from a folder that has it installed, passing the dev server's address:
//
//   node /path/to/nextjs/app/gpt-2/tools/browser-test.mjs http://localhost:3000 [out-dir] [--headed] [--webgpu]
//
// Prints a JSON summary (times, tokens/s, the text students would see) and saves screenshots to out-dir.
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const { chromium } = createRequire(`${process.cwd()}/`)("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "spiral-test";
const headed = process.argv.includes("--headed");
const webgpu = process.argv.includes("--webgpu");
await mkdir(out, { recursive: true });

const summary = { base, when: new Date().toISOString(), headed, webgpu, runs: [] };
const log = (...a) => console.error(...a);
const browser = await chromium.launch({ headless: !headed, ...(webgpu ? { args: ["--enable-unsafe-webgpu", "--enable-features=Vulkan"] } : {}) });

async function freshPage(width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  return { context, page, errors };
}

async function section(name, fn) {
  try { await fn(); } catch (e) { summary[`${name}Failed`] = e.message.split("\n")[0]; log(name, "failed:", e.message.split("\n")[0]); }
}

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

async function load(page, device) {
  if (device) await page.selectOption(".spiral-device select", device);
  const started = Date.now();
  await page.click('[data-testid="spiral-load-button"]');
  await page.waitForSelector('[data-testid="spiral-textarea"]', { timeout: 600_000 });
  return Date.now() - started;
}

async function runStarter(page, label, preset) {
  if (preset) await page.click(`.spiral-presets button:has-text("${preset}")`);
  const started = Date.now();
  await page.click(`.spiral-starters button:has-text("${label}")`);
  await page.waitForSelector('[data-testid="spiral-finish"]', { timeout: 120_000 });
  const wallMs = Date.now() - started;
  const last = await page.evaluate(() => {
    const r = window.spiralLastRun;
    return r && { device: r.device, tokens: r.result.generatedTokens, elapsedMs: Math.round(r.result.elapsedMs), tps: +r.result.tokensPerSecond.toFixed(1), finish: r.result.finishReason, firstTokenMs: Math.round(r.steps[0]?.elapsedMs ?? 0), text: r.result.text };
  });
  const meter = await page.textContent('[data-testid="spiral-meter"]');
  return { label, preset: preset ?? "Default", wallMs, ...last, meter: meter.replace(/\s+/g, " ").trim() };
}

// 1. Cold: a fresh context has an empty cache.
await section("cold", async () => {
  const { context, page, errors } = await freshPage();
  let bytes = 0;
  const hosts = {};
  context.on("requestfinished", async request => {
    try {
      const sizes = await request.sizes();
      const host = new URL(request.url()).host;
      hosts[host] = (hosts[host] ?? 0) + sizes.responseBodySize;
      bytes += sizes.responseBodySize;
    } catch {}
  });
  await page.goto(`${base}/gpt-2`);
  await page.waitForSelector('[data-testid="spiral-load"]');
  summary.notice = (await page.textContent('[data-testid="spiral-load"]')).replace(/\s+/g, " ").trim();
  await page.screenshot({ path: `${out}/1-first-visit.png`, fullPage: true });
  const before = bytes;
  summary.coldLoadMs = await load(page, webgpu ? "auto" : "wasm");
  summary.coldBytes = bytes - before;
  summary.coldBytesByHost = hosts;
  summary.device = await page.evaluate(() => document.querySelector(".spiral-controls p")?.textContent);
  for (const s of ["A question", "Who are you?", "A forum post", "A letter"]) {
    const r = await runStarter(page, s);
    summary.runs.push({ cache: "cold", ...r });
    log(r.label, r.tps, "tok/s");
  }
  await page.screenshot({ path: `${out}/2-after-letter.png`, fullPage: true });
  summary.runs.push({ cache: "cold", ...await runStarter(page, "Who are you?", "Greedy") });
  summary.runs.push({ cache: "cold", ...await runStarter(page, "A question", "Greedy") });
  await page.click('.spiral-presets button:has-text("Default")');

  // Stop: a long run, stopped after two seconds.
  await page.fill('.spiral-controls input[type="range"] >> nth=2', "400").catch(() => {});
  await page.evaluate(() => {
    const el = document.querySelectorAll('.spiral-controls input[type="range"]')[2];
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(el, "400"); el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click('.spiral-starters button:has-text("A forum post")');
  await page.waitForTimeout(2000);
  const stopAt = Date.now();
  await page.click('[data-testid="spiral-stop"]');
  await page.waitForSelector('[data-testid="spiral-finish"]', { timeout: 30_000 });
  summary.stop = { ms: Date.now() - stopAt, finish: await page.textContent('[data-testid="spiral-finish"]'), tokens: await page.evaluate(() => window.spiralLastRun?.result.generatedTokens) };

  // Keep going, and pinning a token's odds.
  await page.click('button:has-text("Keep going")');
  await page.waitForSelector('[data-testid="spiral-finish"]', { timeout: 120_000 });
  summary.keepGoing = await page.evaluate(() => ({ finish: window.spiralLastRun.result.finishReason, promptLength: window.spiralLastRun.prompt.length }));
  await page.click(".spiral-token >> nth=5");
  summary.pinned = (await page.textContent('[data-testid="spiral-dist"]')).replace(/\s+/g, " ").slice(0, 200);
  await page.screenshot({ path: `${out}/3-pinned.png`, fullPage: true });
  summary.coldErrors = errors;
  await page.close();

  // 2. Warm: a new page in the same context reuses the browser cache.
  const warm = await context.newPage();
  await warm.goto(`${base}/gpt-2`);
  await warm.waitForSelector('[data-testid="spiral-load"]');
  summary.warmNotice = (await warm.textContent('[data-testid="spiral-load"]')).replace(/\s+/g, " ").trim().slice(0, 160);
  summary.warmLoadMs = await load(warm, webgpu ? "auto" : "wasm");
  for (const s of ["A question", "Who are you?", "A forum post", "A letter"]) summary.runs.push({ cache: "warm", ...await runStarter(warm, s) });
  await context.close();
});

// 3. Recorded mode, at 1024px, with no model at all.
await section("recorded", async () => {
  const { context, page, errors } = await freshPage(1024);
  await page.goto(`${base}/gpt-2`);
  await page.waitForSelector('[data-testid="spiral-load"]');
  summary.overflow1024 = await overflow(page);
  await page.screenshot({ path: `${out}/4-first-visit-1024.png`, fullPage: true });
  await page.click('button[role="tab"]:has-text("Recorded runs")');
  await page.click('.spiral-starters button:has-text("Who are you? at temperature 0")');
  await page.waitForSelector('[data-testid="spiral-finish"]', { timeout: 60_000 });
  summary.recorded = {
    label: await page.textContent('[data-testid="spiral-recorded-label"]'),
    text: (await page.textContent('[data-testid="spiral-doc"]')).slice(0, 200),
    meter: (await page.textContent('[data-testid="spiral-meter"]')).replace(/\s+/g, " "),
    overflow1024: await overflow(page),
  };
  await page.screenshot({ path: `${out}/5-recorded-1024.png`, fullPage: true });
  summary.recordedErrors = errors;
  await context.close();
});

// 4. A blocked download (no Hugging Face): a clear message and the way to the recorded runs.
await section("blocked", async () => {
  const { context, page } = await freshPage(1024);
  await context.route(/huggingface\.co|hf\.co/, route => route.abort());
  await page.goto(`${base}/gpt-2`);
  await page.click('[data-testid="spiral-load-button"]');
  await page.waitForSelector('.spiral-error[role="alert"]', { timeout: 60_000 });
  summary.blocked = (await page.textContent('.spiral-error[role="alert"]')).replace(/\s+/g, " ");
  await page.screenshot({ path: `${out}/6-blocked.png`, fullPage: true });
  await context.close();
});

// 5. A slow download: hold the model file back and wait for the "slow" notice.
await section("slow", async () => {
  const { context, page } = await freshPage(1024);
  await context.route(/\.onnx/, async route => { await new Promise(r => setTimeout(r, 40_000)); await route.abort(); });
  await page.goto(`${base}/gpt-2`);
  await page.click('[data-testid="spiral-load-button"]');
  await page.waitForSelector(".spiral-warn", { timeout: 40_000 }).catch(() => {});
  summary.slow = (await page.textContent(".spiral-progress").catch(() => "(no progress panel)")).replace(/\s+/g, " ");
  await page.screenshot({ path: `${out}/7-slow.png`, fullPage: true });
  await context.close();
});

await browser.close();
await writeFile(`${out}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
