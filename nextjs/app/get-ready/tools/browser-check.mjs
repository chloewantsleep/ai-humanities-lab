// Run from a directory with Playwright installed:
// node /path/to/nextjs/app/get-ready/tools/browser-check.mjs http://localhost:3000
// Optional PLAYWRIGHT_EXECUTABLE_PATH selects an existing Chromium installation.
// Tests failure and cancellation in fresh contexts without downloading model weights.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { chromium } = createRequire(`${process.cwd()}/`)("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const summary = {};
try {
  for (const route of ["/spiral", "/experiments/spiral"]) {
    const response = await browser.newContext().then(async context => {
      try { return await context.request.get(`${base}${route}`, { maxRedirects: 0 }); }
      finally { await context.close(); }
    });
    assert.equal(response.status(), 308, route);
    assert.equal(response.headers().location, "/gpt-2", route);
  }
  summary.redirects = "Both old routes return 308 to /gpt-2";

  const blocked = await browser.newContext();
  await blocked.route(/\.onnx(?:$|\?)/, route => route.abort("blockedbyclient"));
  const page = await blocked.newPage();
  page.setDefaultNavigationTimeout(120000);
  await page.goto(`${base}/get-ready`, { waitUntil: "load" });
  assert.equal(await page.locator(".ready-finish.is-ready").count(), 0);
  await page.getByRole("button", { name: "Download models and check speed", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('[data-state="error"]').length === 4, null, { timeout: 90000 });
  assert.equal(await page.locator(".ready-finish.is-ready").count(), 0);
  assert.equal(await page.locator(".ready-model [role=alert]").count(), 4);
  summary.blocked = "All four failures visible; no ready state";
  await blocked.close();

  const cancelled = await browser.newContext();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await cancelled.route(/\.onnx(?:$|\?)/, async route => { await gate; await route.abort().catch(() => {}); });
  const stopping = await cancelled.newPage();
  stopping.setDefaultNavigationTimeout(120000);
  await stopping.goto(`${base}/get-ready`, { waitUntil: "load" });
  await stopping.getByRole("button", { name: "Download models and check speed", exact: true }).click();
  await stopping.waitForSelector('[data-state="loading"]');
  await stopping.getByRole("button", { name: "Stop preparation", exact: true }).click();
  await stopping.waitForSelector('[data-state="stopped"]');
  assert.equal(await stopping.locator('[data-state="ready"]').count(), 0);
  assert.equal(await stopping.locator(".ready-finish.is-ready").count(), 0);
  assert.equal(await stopping.getByRole("button", { name: "Download models and check speed", exact: true }).isEnabled(), true);
  release();
  await cancelled.close();
  summary.cancelled = "Active model stops; no later model is marked ready; retry enabled";
  console.log(JSON.stringify(summary, null, 2));
} finally { await browser.close(); }
