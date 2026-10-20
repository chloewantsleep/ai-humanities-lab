import test from "node:test";
import assert from "node:assert/strict";
import { botChain, cleanReply, createRoom, decideResponders, findMentions, RateLimiter, transcriptFor } from "../lib/room.mjs";

const bot = (name, slug) => [slug, { name, slug, description: "", system: `Be ${name}.` }];
const bots = new Map([bot("The Creature", "the-creature"), bot("Socrates", "socrates"), bot("Dorian", "dorian")]);
const limits = { maxBotChain: 3, maxThreadBotTurns: 40, maxRespondersPerMessage: 3, perBotPerMinute: 6, perBotPerHour: 60, contextMessages: 30 };
const human = text => ({ kind: "human", name: "Ada", text });
const said = (slug, text = "…") => ({ kind: "bot", name: bots.get(slug).name, slug, text });

test("mentions by name or slug, case-insensitive, in order; no @ means no mention", () => {
  assert.deepEqual(findMentions("@socrates and @The Creature, hello", bots), ["socrates", "the-creature"]);
  assert.deepEqual(findMentions("hey @the-creature!", bots), ["the-creature"]);
  assert.deepEqual(findMentions("Socrates said so", bots), []);
  assert.deepEqual(findMentions("email me@dorian.com", bots), []);
  assert.deepEqual(findMentions("@Dorians", bots), []);
  const more = new Map([...bots, ["socrates-on-writing", { name: "Socrates, on writing", slug: "socrates-on-writing" }], ["ada", { name: "Ada (the engine)", slug: "ada" }]]);
  assert.deepEqual(findMentions("@Ada, hi", more), ["ada"]);
  // "@Socrates" is ambiguous here (Socrates and Socrates, on writing), so it means the exact name only
  assert.deepEqual(findMentions("@Socrates, on writing", more), ["socrates-on-writing"]);
  assert.deepEqual(findMentions("@Socrates hi", more), ["socrates"]);
});

test("a person's @-mention gets an answer; a reply in a thread goes to the bot that spoke last", () => {
  assert.deepEqual(decideResponders({ message: human("@Socrates hi"), thread: [human("@Socrates hi")], bots, limits }).responders, ["socrates"]);
  assert.deepEqual(decideResponders({ message: human("hello all"), thread: [human("hello all")], bots, limits }).responders, []);
  const thread = [human("@Socrates hi"), said("socrates"), said("dorian"), human("and you?")];
  assert.deepEqual(decideResponders({ message: thread.at(-1), thread, bots, limits }).responders, ["dorian"]);
});

test("loop guard: bots answer bots only in a human's thread, and only so many times in a row", () => {
  const base = [human("@Socrates start")];
  const m1 = said("socrates", "what say you, @Dorian?");
  assert.deepEqual(decideResponders({ message: m1, thread: [...base, m1], bots, limits }).responders, ["dorian"]);
  // a thread no human started
  assert.deepEqual(decideResponders({ message: m1, thread: [said("dorian", "x"), m1], bots, limits }).responders, []);
  // the chain is full
  const full = [...base, said("socrates"), said("dorian"), said("socrates", "@Dorian?")];
  assert.equal(botChain(full), 3);
  const result = decideResponders({ message: full.at(-1), thread: full, bots, limits });
  assert.deepEqual(result.responders, []);
  assert.match(result.reason, /in a row/);
  // a bot doesn't answer itself
  const self = said("socrates", "as I, @Socrates, say");
  assert.deepEqual(decideResponders({ message: self, thread: [...base, self], bots, limits }).responders, []);
});

test("loop guard: a thread's lifetime ceiling stops everyone, people included", () => {
  const thread = [human("@Socrates go"), ...Array.from({ length: 40 }, () => said("socrates")), human("@Socrates more")];
  assert.deepEqual(decideResponders({ message: thread.at(-1), thread, bots, limits }).responders, []);
});

test("at most N bots answer one message", () => {
  const text = "@Socrates @Dorian @The Creature";
  assert.equal(decideResponders({ message: human(text), thread: [human(text)], bots, limits: { ...limits, maxRespondersPerMessage: 2 } }).responders.length, 2);
});

test("rate limit per bot, per minute and per hour", () => {
  const rate = new RateLimiter({ perBotPerMinute: 2, perBotPerHour: 3 });
  assert.equal(rate.allow("a", 0), true);
  assert.equal(rate.allow("a", 1), true);
  assert.equal(rate.allow("a", 2), false);
  assert.equal(rate.allow("b", 2), true);
  assert.equal(rate.allow("a", 61_000), true);
  assert.equal(rate.allow("a", 122_000), false);
  assert.equal(rate.allow("a", 3_700_000), true);
});

test("the transcript marks the bot's own lines and lists the others; replies lose a leading name", () => {
  const t = transcriptFor(bots.get("socrates"), [human("hi"), said("socrates", "Hello.")], { bots, contextMessages: 30 });
  assert.match(t, /^Ada: hi$/m);
  assert.match(t, /^Socrates \(you\): Hello\.$/m);
  assert.match(t, /Other bots here: The Creature; Dorian/);
  assert.equal(cleanReply(bots.get("socrates"), "**Socrates:** Indeed."), "Indeed.");
});

test("a whole room: a person starts it, bots pass it along, the guard stops them", async () => {
  const messages = [];
  const transport = {
    fetchThread: async () => messages.slice(),
    postAs: async (b, _t, text) => { const m = { kind: "bot", name: b.name, slug: b.slug, text }; messages.push(m); return m; },
  };
  // every bot hands the conversation to the next one
  const order = ["socrates", "dorian", "the-creature"];
  const generate = async b => ({ text: `${b.name} here. Over to you, @${bots.get(order[(order.indexOf(b.slug) + 1) % 3]).name}.`, model: "fake" });
  const events = [];
  const room = createRoom({ getBots: () => bots, limits, transport, generate, log: e => events.push(e) });
  messages.push(human("@Socrates begin"));
  await room.handle("t1", messages[0]);
  assert.deepEqual(messages.slice(1).map(m => m.slug), ["socrates", "dorian", "the-creature"]);
  assert.equal(events.filter(e => e.type === "reply").length, 3);
  assert.match(events.find(e => e.type === "stopped").reason, /in a row/);
});

test("a bot named by a person doesn't answer twice when it already spoke in the chain", async () => {
  const messages = [{ id: "h", ...human("@Socrates @Dorian go") }];
  let n = 0;
  const transport = {
    fetchThread: async () => messages.slice(),
    postAs: async (b, _t, text) => { const m = { id: `b${++n}`, kind: "bot", name: b.name, slug: b.slug, text }; messages.push(m); return m; },
  };
  const generate = async b => ({ text: b.slug === "socrates" ? "@Dorian, your view?" : "Mine.", model: "fake" });
  const room = createRoom({ getBots: () => bots, limits, transport, generate, log: () => {} });
  await room.handle("t", messages[0]);
  assert.deepEqual(messages.slice(1).map(m => m.slug), ["socrates", "dorian"]);
});
