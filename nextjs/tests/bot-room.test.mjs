import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { parseBotFile, serializeBotFile } from "../lib/bots-format.mjs";
import { HOST, MODELS, costOf, directorPrompt, estimateRun, extractDraft, messagesFor, nextRoundRobin, parseDirector, roomNote, stripSelfLabel } from "../app/bot-room/room.mjs";

// Run from nextjs/ (`pnpm test`). No model is called.

const creature = { name: "The Creature", slug: "the-creature", system: "You are the creature.", description: "Shelley's creature" };
const victor = { name: "Victor Frankenstein", slug: "victor-frankenstein", system: "You are Victor.", description: "the scientist" };
const editor = { name: "The Editor", slug: "the-editor", system: "You edit.", description: "an editor" };
const cast = [creature, victor, editor];

test("the room's example bots parse in the shared format (AA's parser) with no errors", async () => {
  const dir = "app/bot-room/examples";
  const files = (await readdir(dir)).filter(f => f.endsWith(".md"));
  assert.ok(files.length >= 4, dir);
  for (const file of files) {
    const { bot, errors } = parseBotFile(await readFile(`${dir}/${file}`, "utf8"), { slug: file.replace(/\.md$/, ""), example: true });
    assert.deepEqual(errors, [], `${dir}/${file}`);
    assert.equal(bot.slug, file.replace(/\.md$/, ""), `${file}: the slug matches the file name`);
    assert.ok(bot.name && bot.body.length > 40, file);
  }
});

test("a bot written on the spot round-trips through the shared format's serializer", () => {
  const bot = { name: "Brother Anselm", slug: "brother-anselm", model: "anthropic/claude-haiku-5.5", description: "a monk", body: "You are a monk.\n\nBe brief." };
  const { bot: back, errors } = parseBotFile(serializeBotFile(bot));
  assert.deepEqual(errors, []);
  assert.equal(back.name, bot.name);
  assert.equal(back.slug, bot.slug);
  assert.equal(back.model, bot.model);
  assert.equal(back.body.trim(), bot.body);
});

test("each bot receives its own prompt plus the room note, and the transcript with the right roles", () => {
  const transcript = [
    { slug: "host", name: HOST, text: "Victor, the creature is here." },
    { slug: "the-creature", name: "The Creature", text: "Hear me, Frankenstein." },
    { slug: "victor-frankenstein", name: "Victor Frankenstein", text: "Begone, wretch." },
    { slug: "the-creature", name: "The Creature", text: "I will not." },
  ];
  const forVictor = messagesFor(victor, cast, transcript, { mode: "conversation" });
  assert.ok(forVictor.system.startsWith("You are Victor."));
  assert.match(forVictor.system, /The other speakers are The Creature and The Editor/);
  assert.deepEqual(forVictor.messages, [
    { role: "user", content: "Host: Victor, the creature is here.\n\nThe Creature: Hear me, Frankenstein." },
    { role: "assistant", content: "Begone, wretch." },
    { role: "user", content: "The Creature: I will not." },
  ]);
  const forCreature = messagesFor(creature, cast, transcript, { mode: "conversation" });
  assert.equal(forCreature.messages.at(-1).role, "user", "a bot whose turn was last still gets a user message to answer");
  assert.match(forCreature.messages.at(-1).content, /your turn again/);
  const first = messagesFor(creature, cast, [], { mode: "conversation" });
  assert.equal(first.messages.length, 1);
  assert.match(first.messages[0].content, /The room is open/);
  assert.doesNotMatch(roomNote(creature, cast, { mode: "conversation" }), /draft/);
});

test("working together sends the task and the latest draft, and a reply's draft is extracted", () => {
  const opts = { mode: "together", task: "One paragraph on Socrates.", draft: "Socrates distrusted writing." };
  const { system, messages } = messagesFor(editor, cast, [{ slug: "host", name: HOST, text: "Begin." }], opts);
  assert.match(system, /working together on one task: One paragraph on Socrates\./);
  assert.match(messages[0].content, /<draft>\nSocrates distrusted writing\.\n<\/draft>/);
  assert.equal(extractDraft("Here you go.\n<draft>\nA better paragraph.\n</draft>\nThoughts?"), "A better paragraph.");
  assert.equal(extractDraft("No draft from me."), null);
  assert.equal(extractDraft("<draft>\nCut off by the token limit, so no closing"), "Cut off by the token limit, so no closing");
  assert.equal(stripSelfLabel("Victor Frankenstein: Do not speak to me of Adam.", "Victor Frankenstein"), "Do not speak to me of Adam.");
  assert.equal(stripSelfLabel("**The Editor:** Here.", "The Editor"), "Here.");
  assert.equal(stripSelfLabel("The Creature: hear me.", "Victor Frankenstein"), "The Creature: hear me.");
});

test("round-robin follows the cast order and the director's answer is read leniently", () => {
  assert.equal(nextRoundRobin(cast, []).slug, "the-creature");
  assert.equal(nextRoundRobin(cast, [{ slug: "host" }, { slug: "the-creature" }]).slug, "victor-frankenstein");
  assert.equal(nextRoundRobin(cast, [{ slug: "the-editor" }]).slug, "the-creature");
  const { system, prompt } = directorPrompt(cast, [{ name: HOST, text: "Go." }], { mode: "conversation" });
  assert.match(system, /- the-creature: The Creature, Shelley's creature/);
  assert.match(prompt, /Host: Go\./);
  assert.equal(parseDirector('{"next":"the-editor","why":"Quiet so far."}', cast).bot.slug, "the-editor");
  assert.equal(parseDirector('Sure! {"next": "Victor Frankenstein", "why": "addressed"}', cast).bot.slug, "victor-frankenstein");
  assert.equal(parseDirector("I think the creature.", cast), null);
  assert.equal(parseDirector('{"next":"nobody"}', cast), null);
});

test("costs come from the price table and the estimate grows with the transcript", () => {
  const haiku = MODELS.find(m => m.id === "anthropic/claude-haiku-5.5");
  assert.equal(costOf(haiku.id, { inputTokens: 1_000_000, outputTokens: 0 }), haiku.input);
  assert.equal(costOf("unknown/model", { inputTokens: 10 }), null);
  const two = [{ ...creature, model: haiku.id }, { ...victor, model: haiku.id }];
  const short = estimateRun(two, 2), long = estimateRun(two, 10);
  assert.ok(short.dollars > 0 && long.dollars > short.dollars * 4);
  assert.deepEqual(estimateRun([], 6), { dollars: 0, unknown: false });
  assert.equal(estimateRun([{ ...creature, model: "unknown/model" }], 1).unknown, true);
});
