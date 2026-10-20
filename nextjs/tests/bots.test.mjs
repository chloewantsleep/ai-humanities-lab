import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { KNOWLEDGE_MARKER, buildMessages, buildRequest, buildSystemPrompt, listBots, listKnowledge, loadBot, parseBotFile, saveBot, saveKnowledge, serializeBotFile, slugify, validateBot } from "../lib/bots.mjs";

// Run from nextjs/ (`pnpm test`). The format is bots/README.md; the example files are bots/_examples/.

const creature = `---
name: "The Creature"            # shown in the chat app and as the Slack display name
slug: "the-creature"            # same as the file name
author: "Ada Lovelace"
model: "anthropic/claude-sonnet-5.5"   # an OpenRouter model id
emoji: ":zombie:"
description: "Frankenstein's creature, in the years after the De Laceys."
knowledge: "knowledge/the-creature.md"
---

You are the creature. Speak as he does to Walton.
`;

test("the README's example parses, with comments stripped and the body kept as written", () => {
  const { ok, bot, errors } = parseBotFile(creature, { slug: "the-creature" });
  assert.deepEqual(errors, []);
  assert.ok(ok);
  assert.equal(bot.name, "The Creature");
  assert.equal(bot.model, "anthropic/claude-sonnet-5.5");
  assert.equal(bot.emoji, ":zombie:");
  assert.equal(bot.knowledge, "knowledge/the-creature.md");
  assert.equal(bot.body, "You are the creature. Speak as he does to Walton.");
});

test("a bot with no name or an empty body is invalid, and the error says why", () => {
  const noName = parseBotFile(`---\nslug: "x"\n---\nHello.`);
  assert.ok(!noName.ok);
  assert.match(noName.errors.join("\n"), /no name/);
  const noBody = parseBotFile(`---\nname: "X"\n---\n\n`);
  assert.match(noBody.errors.join("\n"), /system prompt is empty/);
  const noFrontmatter = parseBotFile(`Just a prompt.`);
  assert.match(noFrontmatter.errors.join("\n"), /No frontmatter/);
  const badSlug = parseBotFile(`---\nname: "X"\nslug: "Not Slug"\n---\nHi.`);
  assert.match(badSlug.errors.join("\n"), /lowercase/);
  const mismatch = parseBotFile(`---\nname: "X"\nslug: "a"\n---\nHi.`, { slug: "b" });
  assert.match(mismatch.errors.join("\n"), /doesn't match the file name/);
  const badModel = parseBotFile(`---\nname: "X"\nmodel: "claude"\n---\nHi.`);
  assert.match(badModel.errors.join("\n"), /OpenRouter id/);
  const escape = parseBotFile(`---\nname: "X"\nknowledge: "../secrets.md"\n---\nHi.`);
  assert.match(escape.errors.join("\n"), /inside bots/);
});

test("unknown fields are kept (and reported as a warning), not errors; a missing slug comes from the name", () => {
  const { ok, bot, warnings } = parseBotFile(`---\nname: "Dorian Gray"\ntemperature: 0.9\n---\nYou are Dorian.`);
  assert.ok(ok);
  assert.equal(bot.slug, "dorian-gray");
  assert.deepEqual(bot.extra, { temperature: "0.9" });
  assert.match(warnings.join("\n"), /temperature/);
  assert.equal(slugify("  Socrates, on Writing!  "), "socrates-on-writing");
});

test("serialize then parse round-trips, including quotes and unknown fields", () => {
  const bot = { name: 'The "Creature"', slug: "the-creature", author: "", model: "openai/gpt-5-mini", emoji: ":zombie:", description: "A line: with punctuation # not a comment", knowledge: "", body: "Line one.\n\nLine two, with  spacing.", extra: { temperature: "0.9" } };
  const text = serializeBotFile(bot);
  assert.ok(text.startsWith("---\nname: "));
  assert.ok(!text.includes("author:"), "empty fields are left out");
  const back = parseBotFile(text, { slug: "the-creature" });
  assert.deepEqual(back.errors, []);
  assert.equal(back.bot.name, bot.name);
  assert.equal(back.bot.description, bot.description);
  assert.equal(back.bot.body, bot.body);
  assert.deepEqual(back.bot.extra, bot.extra);
  assert.ok(validateBot(bot).ok);
});

test("the system prompt is the body, then the reference text under the marker; messages carry only user/assistant turns", () => {
  const bot = parseBotFile(creature, { slug: "the-creature" }).bot;
  assert.equal(buildSystemPrompt(bot), bot.body);
  const withText = buildSystemPrompt(bot, "Chapter 24. ...");
  assert.equal(withText, `${bot.body}\n\n${KNOWLEDGE_MARKER}\n\nChapter 24. ...`);
  const messages = buildMessages(bot, [{ role: "user", content: "Who are you?" }, { role: "system", content: "ignored" }, { role: "assistant", content: "" }, { role: "assistant", content: "A wretch." }], { knowledgeText: "Chapter 24." });
  assert.deepEqual(messages.map((m) => m.role), ["system", "user", "assistant"]);
  assert.ok(messages[0].content.endsWith("Chapter 24."));
  assert.equal(buildRequest(bot, []).model, "anthropic/claude-sonnet-5.5");
  assert.equal(buildRequest({ ...bot, model: "" }, [], { defaultModel: "x/y" }).model, "x/y");
  assert.equal(buildRequest(bot, [], { model: "openai/gpt-5-mini" }).model, "openai/gpt-5-mini");
});

test("the examples in bots/_examples/ are valid and listed, and loadBot finds them by slug", async () => {
  const bots = await listBots();
  const socrates = bots.find((b) => b.slug === "socrates-on-writing");
  assert.ok(socrates, "the Socrates example is listed");
  assert.ok(socrates.example);
  for (const bot of bots.filter((b) => b.example)) assert.deepEqual(bot.errors, [], `${bot.source}: ${bot.errors.join("; ")}`);
  const loaded = await loadBot("socrates-on-writing");
  assert.equal(loaded.name, "Socrates, on writing");
  assert.equal(loaded.source, "_examples/socrates-on-writing.md");
  assert.equal(await loadBot("no-such-bot"), null);
  assert.equal(await loadBot("../README"), null);
  for (const bot of bots) if (bot.knowledge && bot.ok) assert.ok(bot.knowledgeText, `${bot.source} loads its knowledge text`);
});

test("saveBot writes bots/<slug>.md in a temp root, refuses invalid bots, and the saved file reads back", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "bots-"));
  try {
    const bad = await saveBot({ name: "", slug: "x", body: "hi" }, { root });
    assert.ok(!bad.ok);
    const text = await readFile("bots/_examples/socrates-on-writing.md", "utf8");
    const saved = await saveBot(text.replace('slug: "socrates-on-writing"', 'slug: "my-socrates"'), { root });
    assert.ok(saved.ok, saved.errors.join("; "));
    assert.equal(saved.file, "my-socrates.md");
    const again = await saveBot(saved.text, { root, overwrite: false });
    assert.ok(!again.ok && /already/.test(again.errors[0]));
    const listed = await listBots({ root, examples: false });
    assert.deepEqual(listed.map((b) => b.slug), ["my-socrates"]);
    assert.ok(!listed[0].example);

    const k = await saveKnowledge("Walton's letters.md", "Chapter 24.\n\nI am the wretch.", { root });
    assert.equal(k.path, "knowledge/Walton-s-letters.md");
    const withKnowledge = await saveBot({ name: "The Creature", slug: "the-creature", body: "You are the creature.", knowledge: k.path }, { root });
    assert.ok(withKnowledge.ok);
    const creatureBot = await loadBot("the-creature", { root });
    assert.equal(creatureBot.knowledgeFile, "knowledge/Walton-s-letters.md");
    assert.match(buildSystemPrompt(creatureBot), /Reference text ---\n\nChapter 24\./);
    assert.equal((await listKnowledge({ root }))[0].words, 6);

    await mkdir(path.join(root, "_examples"), { recursive: true });
    await writeFile(path.join(root, "_examples", "broken.md"), "no frontmatter");
    const all = await listBots({ root });
    const broken = all.find((b) => b.slug === "broken");
    assert.ok(broken && !broken.ok && broken.errors.length, "invalid files are listed with their errors, not skipped");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
