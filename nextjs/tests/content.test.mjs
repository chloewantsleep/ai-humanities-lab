import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { getEntry, getExperiments, resolveMarkdownHref } from "../lib/content.mjs";

// Run from nextjs/ (`pnpm test`): lib/content.mjs reads content/ under the current directory.

test("every experiment names a route that exists in app/", async () => {
  const experiments = await getExperiments();
  assert.ok(experiments.length >= 6);
  for (const experiment of experiments) {
    assert.match(experiment.route, /^\/[a-z0-9-]+$/, `${experiment.slug} has a route`);
    await access(`app${experiment.route}/page.jsx`);
  }
});

test("relative links between Markdown files become routes", () => {
  assert.equal(resolveMarkdownHref("eliza.md", "experiments"), "/experiments/eliza");
  assert.equal(resolveMarkdownHref("../readings/README.md", "experiments"), "/readings");
});

test("the history pages embed images that exist", async () => {
  const history = (await getEntry(["history"]))?.entry;
  assert.ok(history?.docs.length >= 8);
  for (const doc of history.docs) {
    for (const [, file] of doc.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) await access(`content/history/${file}`);
  }
});
