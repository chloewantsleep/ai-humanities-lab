import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkBot, formatBot, parseFrontmatter, slugify, systemPrompt } from "../lib/bot-file.mjs";
import { loadBots } from "../lib/bots.mjs";

const README_EXAMPLE = `---
name: "The Creature"            # shown in the chat app and as the Slack display name
slug: "the-creature"            # same as the file name
author: "Ada Lovelace"          # the student
model: "anthropic/claude-sonnet-5.5"   # an OpenRouter model id
emoji: ":zombie:"               # optional
description: "Frankenstein's creature, in the years after the De Laceys."   # one line
knowledge: "knowledge/the-creature.md"   # optional
---

The system prompt: everything below the frontmatter, as written.
`;

test("parses the README's example, comments and all", () => {
  const { ok, bot, problems } = checkBot(README_EXAMPLE, { fileSlug: "the-creature" });
  assert.deepEqual(problems, []);
  assert.equal(ok, true);
  assert.equal(bot.name, "The Creature");
  assert.equal(bot.slug, "the-creature");
  assert.equal(bot.model, "anthropic/claude-sonnet-5.5");
  assert.equal(bot.emoji, ":zombie:");
  assert.equal(bot.description, "Frankenstein's creature, in the years after the De Laceys.");
  assert.equal(bot.knowledge, "knowledge/the-creature.md");
  assert.equal(bot.prompt, "The system prompt: everything below the frontmatter, as written.");
});

test("the example bot in nextjs/bots/_examples is valid", () => {
  const file = new URL("../../nextjs/bots/_examples/socrates-on-writing.md", import.meta.url);
  const { ok, bot } = checkBot(fs.readFileSync(file, "utf8"), { fileSlug: "socrates-on-writing" });
  assert.equal(ok, true);
  assert.equal(bot.name, "Socrates, on writing");
});

test("bare values, single quotes, a # inside quotes, Windows line endings", () => {
  const { data } = parseFrontmatter("---\r\nname: Ada's Bot  # note\r\nauthor: 'O''Brien'\r\ndescription: \"one # two\"\r\n---\r\nHi");
  assert.deepEqual(data, { name: "Ada's Bot", author: "O'Brien", description: "one # two" });
});

test("a file with no name or an empty prompt is invalid, with reasons a student can act on", () => {
  const noName = checkBot("---\nauthor: x\n---\nYou are a bot.");
  assert.equal(noName.ok, false);
  assert.match(noName.problems.join(" "), /name:/);
  const noBody = checkBot("---\nname: X\n---\n\n");
  assert.equal(noBody.ok, false);
  assert.match(noBody.problems.join(" "), /no prompt/);
  const noDashes = checkBot("name: X\nYou are a bot.");
  assert.equal(noDashes.ok, false);
  assert.match(noDashes.problems.join(" "), /three dashes/);
});

test("bad slug, model, emoji, icon, and knowledge path are caught", () => {
  const { problems } = checkBot(`---\nname: X\nslug: The X\nmodel: claude\nemoji: 🧟\nicon_url: http://x\nknowledge: ../../.env\n---\nHi`);
  assert.equal(problems.length, 5);
});

test("a missing slug comes from the name, with a warning", () => {
  const { ok, bot, warnings } = checkBot("---\nname: Élodie, the Critic!\n---\nHi");
  assert.equal(ok, true);
  assert.equal(bot.slug, "elodie-the-critic");
  assert.match(warnings.join(" "), /slug/);
  assert.equal(slugify("  --A  b--  "), "a-b");
});

test("unknown fields are kept and ignored", () => {
  const { ok, bot } = checkBot("---\nname: X\ntemperature: 0.2\n---\nHi");
  assert.equal(ok, true);
  assert.equal(bot.temperature, "0.2");
});

test("the system prompt is the body, plus the knowledge text under the marker line", () => {
  const { bot } = checkBot("---\nname: X\n---\nBe brief.");
  assert.equal(systemPrompt(bot, ""), "Be brief.");
  assert.equal(systemPrompt(bot, "Text.\n"), "Be brief.\n\n--- Reference text ---\n\nText.");
});

test("formatBot writes a file that checks out the same", () => {
  const { bot } = checkBot(README_EXAMPLE);
  const again = checkBot(formatBot(bot));
  assert.equal(again.ok, true);
  for (const k of ["name", "slug", "author", "model", "emoji", "description", "knowledge", "prompt"]) assert.equal(again.bot[k], bot[k]);
});

test("loadBots reads a folder: knowledge appended, invalid files listed, duplicates refused", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ensemble-"));
  fs.mkdirSync(path.join(dir, "knowledge"));
  fs.writeFileSync(path.join(dir, "knowledge", "a.md"), "Some text.");
  fs.writeFileSync(path.join(dir, "a.md"), "---\nname: A\nknowledge: knowledge/a.md\n---\nBe A.");
  fs.writeFileSync(path.join(dir, "b.md"), "---\nname: B\n---\n");
  fs.writeFileSync(path.join(dir, "c.md"), "---\nname: C\nslug: a\n---\nBe C.");
  fs.writeFileSync(path.join(dir, "d.md"), "---\nname: D\nknowledge: knowledge/missing.md\n---\nBe D.");
  fs.writeFileSync(path.join(dir, "README.md"), "# not a bot");
  fs.mkdirSync(path.join(dir, "_examples"));
  fs.writeFileSync(path.join(dir, "_examples", "a.md"), "---\nname: Example A\n---\nAn example that a room bot overrides.");
  fs.writeFileSync(path.join(dir, "_examples", "e.md"), "---\nname: E\n---\nAn example.");
  const { bots, invalid } = loadBots(dir);
  assert.deepEqual([...bots.keys()], ["a", "e"]);
  assert.equal(bots.get("a").name, "A");
  assert.equal(bots.get("e").example, true);
  assert.deepEqual([...loadBots(dir, { examples: false }).bots.keys()], ["a"]);
  assert.equal(bots.get("a").system, "Be A.\n\n--- Reference text ---\n\nSome text.");
  assert.deepEqual(invalid.map(i => i.file), ["b.md", "c.md", "d.md"]);
});
