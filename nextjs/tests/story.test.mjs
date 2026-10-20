import test from "node:test";
import assert from "node:assert/strict";
import { getStory } from "../app/story/story.mjs";

test("the short timeline has valid chapter and step references after hidden chapters are removed", async () => {
  const { chapters, steps, milestones } = await getStory();
  assert.equal(chapters.length, 6);
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

test("ELIZA and GPT-2 remain interactive, followed by the 2023 builder and later systems", async () => {
  const { chapters, steps } = await getStory();
  assert.deepEqual(
    steps.filter((step) => step.panel.type === "demo").map((step) => step.panel.demo),
    ["eliza", "spiral"],
  );
  const configuration = chapters.find((chapter) => chapter.slug === "configuration");
  assert.ok(configuration);
  assert.equal(steps[configuration.firstStep].year.value, 2023);
  assert.ok(chapters.findIndex((chapter) => chapter.slug === "eliza") < configuration.index);
  assert.ok(chapters.findIndex((chapter) => chapter.slug === "the-spiral") < configuration.index);
  for (const step of steps.slice(chapters[configuration.index + 1].firstStep)) {
    assert.ok(step.year.value > 2023);
  }
  const words = steps.map((step) => step.prose).join(" ").split(/\s+/).filter(Boolean).length;
  assert.ok(words < 1200, `Timeline has ${words} words`);
});
