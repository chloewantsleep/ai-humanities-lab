import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { findBotText, saveSubmission, slackToPlain } from "../lib/submit.mjs";

test("a bot pasted into Slack (code block, entities, links, smart quotes) comes back as typed", () => {
  const slack = "here's mine:\n```---\nname: “The Creature”\nicon_url: <https://example.org/c.png>\ndescription: \"Me &amp; my maker &lt;3\"\n---\nYou are the creature.```";
  const text = findBotText(slack);
  assert.equal(text, "---\nname: \"The Creature\"\nicon_url: https://example.org/c.png\ndescription: \"Me & my maker <3\"\n---\nYou are the creature.\n");
  assert.equal(findBotText("just saying hi"), null);
  assert.equal(slackToPlain("<https://a.b|a.b>"), "https://a.b");
});

test("submissions are saved; another student can't take the slug; the same student can resubmit", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ensemble-submit-"));
  const bot = "---\nname: The Creature\n---\nYou are the creature.\n";
  assert.equal(saveSubmission(dir, bot, { submitter: "U1" }).ok, true);
  assert.equal(fs.readFileSync(path.join(dir, "the-creature.md"), "utf8"), bot);
  const theft = saveSubmission(dir, bot, { submitter: "U2" });
  assert.equal(theft.ok, false);
  assert.match(theft.problems[0], /slug/);
  assert.equal(saveSubmission(dir, bot.replace("creature.", "creature, revised."), { submitter: "U1" }).ok, true);
  const invalid = saveSubmission(dir, "---\nauthor: x\n---\n", { submitter: "U3" });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.problems.length >= 2);
  assert.equal(saveSubmission(dir, "---\nname: K\nknowledge: knowledge/k.md\n---\nHi", { submitter: "U4" }).ok, false);
});
