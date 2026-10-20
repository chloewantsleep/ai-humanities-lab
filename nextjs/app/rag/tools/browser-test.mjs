// A check of /rag in a real browser: every step on a course text with a pre-embedded question, a typed question
// embedded live (the model download, timed), your own pasted text, step 8 against a canned answer, the layout at
// 1024px and 390px, and, with --ask, one paid call to Claude. Playwright isn't a dependency of the app; point PLAYWRIGHT at an install:
//
//   PLAYWRIGHT=/path/to/package.json node app/rag/tools/browser-test.mjs http://localhost:3000 [out-dir] [--ask]
//
// Prints a JSON summary and saves a screenshot of each step to out-dir.
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";

const { chromium } = createRequire(process.env.PLAYWRIGHT ?? `${process.cwd()}/package.json`)("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "rag-test";
const ask = process.argv.includes("--ask");
await mkdir(out, { recursive: true });
const executablePath = process.env.CHROME ?? `${os.homedir()}/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ executablePath });
const summary = { base, when: new Date().toISOString(), steps: {} };
const text = async (page, sel) => (await page.textContent(sel)).replace(/\s+/g, " ").trim();
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
async function section(name, fn) {
  try { await fn(); } catch (e) { summary[`${name}Failed`] = e.message.split("\n")[0]; console.error(name, "failed:", e.message.split("\n")[0]); }
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
// The shared dev server compiles on first visit and rebuilds as other agents save, so allow it time.
context.setDefaultTimeout(60_000);
context.setDefaultNavigationTimeout(180_000);
const page = await context.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });

await section("steps", async () => {
  await page.goto(`${base}/rag`, { waitUntil: "load" });
  await page.waitForSelector(".pipe-cut");
  const next = async id => { await page.click(".pipe-nav .pipe-primary"); await page.waitForURL(new RegExp(`#${id}$`)); };
  summary.steps.chunk = (await text(page, ".pipe-stage")).slice(0, 300);
  await page.screenshot({ path: `${out}/1-chunk.png`, fullPage: true });
  await next("embed");
  summary.steps.embed = (await text(page, ".pipe-stage")).slice(0, 300);
  await page.screenshot({ path: `${out}/2-embed.png`, fullPage: true });
  await next("store");
  summary.steps.store = (await text(page, ".pipe-json")).slice(0, 300);
  await page.screenshot({ path: `${out}/3-store.png`, fullPage: true });
  await next("question");
  await page.click('.pipe-chips button:has-text("Does writing destroy memory?")');
  await page.waitForSelector(".pipe-strip");
  await page.screenshot({ path: `${out}/4-question.png`, fullPage: true });
  await next("compare");
  summary.steps.compare = await text(page, ".pipe-dot tfoot");
  summary.steps.compareTime = (await text(page, ".pipe-stage")).match(/which took this browser ([^.]+)/)?.[1];
  await page.click('.pipe-link:has-text("show all")');
  summary.steps.dotRows = await page.locator(".pipe-dot tbody tr").count();
  await page.screenshot({ path: `${out}/5-compare.png`, fullPage: true });
  await next("top-k");
  summary.steps.topK = await text(page, ".pipe-sorted figcaption");
  await page.screenshot({ path: `${out}/6-top-k.png`, fullPage: true });
  await next("prompt");
  summary.steps.prompt = (await text(page, ".pipe-prompt")).slice(0, 200);
  await page.screenshot({ path: `${out}/7-prompt.png`, fullPage: true });
  await next("answer");
  if (ask) {
    await page.click(".pipe-stage .pipe-row .pipe-primary");
    await page.waitForSelector(".pipe-cited", { timeout: 90_000 });
    summary.steps.answer = await text(page, ".pipe-reply");
    summary.steps.cited = await text(page, ".pipe-cited");
  }
  await page.screenshot({ path: `${out}/8-answer.png`, fullPage: true });
});

// A typed question needs the model: in a fresh context (an empty cache) the first one downloads it.
await section("live", async () => {
  const cold = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  cold.setDefaultTimeout(60_000);
  cold.setDefaultNavigationTimeout(180_000);
  let bytes = 0;
  cold.on("requestfinished", async r => { try { if (/huggingface|hf\.co|jsdelivr/.test(r.url())) bytes += (await r.sizes()).responseBodySize; } catch {} });
  const page = await cold.newPage();
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(`${base}/rag#question`, { waitUntil: "load" });
  await page.waitForSelector(".pipe-ask input");
  await page.fill(".pipe-ask input", "Why did the god Thamus distrust letters?");
  const started = Date.now();
  await page.click('.pipe-ask button[type="submit"]');
  await page.waitForSelector('.pipe-strip figcaption:has-text("Thamus")', { timeout: 180_000 });
  summary.liveColdMs = Date.now() - started;
  summary.liveColdMB = +(bytes / 1e6).toFixed(1);
  await page.fill(".pipe-ask input", "What did Thamus say writing would do to memory?");
  const warm = Date.now();
  await page.click('.pipe-ask button[type="submit"]');
  await page.waitForSelector('.pipe-strip figcaption:has-text("memory?")');
  summary.liveWarmMs = Date.now() - warm;
  summary.liveNote = await text(page, ".pipe-stage .pipe-muted:last-of-type");
  await page.click(".pipe-nav .pipe-primary");
  summary.liveTop = await text(page, ".pipe-dot tfoot");
  summary.liveWorked = (await text(page, ".pipe-stage .pipe-row")).slice(0, 160);
  await page.goto(`${base}/rag#embed`, { waitUntil: "load" });
  await page.click('button:has-text("Embed this passage again")');
  await page.waitForSelector('text=The fresh vector and the stored one agree', { timeout: 60_000 });
  summary.reembed = await text(page, ".pipe-stage .pipe-row");
  await cold.close();
});

await section("own", async () => {
  await page.goto(`${base}/rag`, { waitUntil: "load" });
  await page.waitForSelector(".pipe-corpus select option[value=phaedrus]", { state: "attached" });
  await page.selectOption(".pipe-corpus select", "own");
  await page.fill('.pipe-own input', "Test notes");
  const notes = [
    "Grice says a conversation is a cooperative effort: each participant recognizes a common purpose, or at least a mutually accepted direction, and makes contributions such as are required, at the stage at which they occur, by that purpose. He calls this the Cooperative Principle.",
    "The maxim of quantity: make your contribution as informative as is required for the current purposes of the exchange, and do not make it more informative than is required. A reference letter that praises only the candidate's handwriting says something by saying too little.",
    "The maxim of quality: try to make your contribution one that is true. Do not say what you believe to be false, and do not say that for which you lack adequate evidence. A chatbot that answers confidently without evidence breaks this one.",
    "The maxim of relation is simply: be relevant. Grice admits that the questions it raises, about what kinds of relevance there are and how they shift during a conversation, are exceedingly difficult, and he leaves them for later work.",
    "The maxim of manner: be perspicuous. Avoid obscurity of expression, avoid ambiguity, be brief, and be orderly. Unlike the others, it concerns how something is said rather than what is said.",
    "When a speaker flouts a maxim openly, on purpose, the hearer assumes the speaker is still cooperating and works out what else must have been meant. That extra meaning is a conversational implicature, and irony, metaphor, and understatement all work this way.",
  ];
  await page.fill('.pipe-own textarea', notes.join("\n\n"));
  await page.click('.pipe-own button');
  await page.waitForSelector(".pipe-cut", { timeout: 60_000 });
  summary.own = await text(page, ".pipe-corpus .pipe-muted");
  await page.click('.pipe-steps button:has-text("Store")');
  summary.ownStore = (await text(page, ".pipe-json")).slice(0, 200);
  await page.click('.pipe-steps button:has-text("Embed the question")');
  await page.fill(".pipe-ask input", "What should you do when you don't know something?");
  await page.click('.pipe-ask button[type="submit"]');
  await page.waitForSelector(".pipe-strip", { timeout: 60_000 });
  await page.click('.pipe-steps button:has-text("Top k")');
  summary.ownTop = (await page.locator(".pipe-kept .pipe-score").allTextContents()).join(" | ");
});

// Step 8 without a paid call: /api/chat answered by a canned stream: one real quotation cited to the wrong passage, one invented.
await section("mocked", async () => {
  const p = await context.newPage();
  const answer = 'Thamus says writing "will create forgetfulness in the learners\' souls" [2], and Socrates adds that "writing is the death of all wisdom" [1].';
  const events = [{ type: "start" }, { type: "text-start", id: "t" }, { type: "text-delta", id: "t", delta: answer }, { type: "text-end", id: "t" }, { type: "finish" }];
  await p.route("**/api/chat", route => route.fulfill({
    status: 200, headers: { "content-type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1" },
    body: events.map(e => `data: ${JSON.stringify(e)}\n\n`).join("") + "data: [DONE]\n\n",
  }));
  await p.goto(`${base}/rag#question`, { waitUntil: "load" });
  await p.click('.pipe-chips button:has-text("Does writing destroy memory?")');
  await p.click('.pipe-steps button:has-text("The answer")');
  await p.click(".pipe-stage .pipe-row .pipe-primary");
  await p.waitForSelector(".pipe-quotes");
  summary.mockedQuotes = (await p.locator(".pipe-quotes li").allTextContents()).map(t => t.replace(/\s+/g, " "));
  summary.mockedCited = await text(p, ".pipe-cited > p");
  await p.screenshot({ path: `${out}/8-answer-mocked.png`, fullPage: true });
  await p.close();
});

for (const width of [1024, 390]) {
  await section(`w${width}`, async () => {
    const p = await context.newPage();
    await p.setViewportSize({ width, height: 900 });
    await p.goto(`${base}/rag#compare`, { waitUntil: "load" });
    await p.waitForSelector(".pipe-corpus .pipe-muted"); // only after hydration: the store has loaded
    summary[`w${width}Hash`] = await text(p, ".pipe-stage h2");
    summary[`overflow${width}`] = await overflow(p);
    await p.goto(`${base}/rag#question`, { waitUntil: "load" });
    await p.click('.pipe-chips button >> nth=0');
    await p.click('.pipe-steps button:has-text("Compare")');
    await p.waitForSelector(".pipe-dot");
    summary[`overflow${width}Compare`] = await overflow(p);
    await p.screenshot({ path: `${out}/w${width}-compare.png`, fullPage: true });
    await p.close();
  });
}

summary.errors = errors;
await browser.close();
await writeFile(`${out}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
