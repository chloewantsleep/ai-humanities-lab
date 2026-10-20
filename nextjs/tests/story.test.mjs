import test from "node:test";
import assert from "node:assert/strict";
import { getStory } from "../app/story/story.mjs";

test("the timeline's chapters and steps reference each other correctly", async () => {
  const { chapters, steps, milestones } = await getStory();
  assert.equal(chapters.length, 11);
  assert.equal(new Set(steps.map((step) => step.id)).size, steps.length);
  for (const [index, chapter] of chapters.entries()) {
    assert.equal(chapter.index, index);
    assert.equal(steps[chapter.firstStep].id, chapter.slug);
    assert.equal(steps[chapter.firstStep].chapter, index);
  }
  for (const step of steps) {
    assert.ok(chapters[step.chapter]);
    assert.notEqual(step.panel.type, "error");
  }
  for (const milestone of milestones) assert.ok(steps[milestone.step]);
});

test("Plato first, then ELIZA, GPT-2, and GPT-2 with the HHH prompt, building to the Gem and the fork", async () => {
  const { chapters, steps } = await getStory();
  assert.equal(chapters[0].slug, "writing-cannot-answer"); // TimelineZoom's "Begin" link points here
  assert.deepEqual(steps.filter((s) => s.panel.type === "demo").map((s) => s.panel.demo), ["eliza", "spiral", "spiral", "hhh"]); // the second spiral is the few-shot prompt
  const at = (slug) => chapters.findIndex((c) => c.slug === slug);
  assert.ok(at("eliza") < at("the-spiral") && at("the-spiral") < at("written-into-a-document") && at("written-into-a-document") < at("configuration"));
  assert.equal(chapters.at(-1).slug, "epilogue");
  // No paper doll in the timeline: the configuration era links out to the Poetry Gem (Activity C) instead.
  assert.equal(steps.filter((s) => s.panel.type === "gem").length, 0);
  assert.ok(steps.some((s) => s.panel.type === "link" && s.panel.href === "/poetry-gem" && chapters[s.chapter].slug === "configuration"));
  assert.ok(steps.some((s) => s.panel.type === "knowledge" && chapters[s.chapter].slug === "configuration"));
  const hhh = steps.find((s) => s.panel.demo === "hhh");
  assert.ok(hhh.panel.preambleFile.includes("Below are a series of dialogues"));
  assert.ok(hhh.panel.recorded.length > 0);
  const words = steps.map((step) => step.prose).join(" ").split(/\s+/).filter(Boolean).length;
  assert.ok(words > 3000 && words < 6500, `Timeline has ${words} words`);
});
