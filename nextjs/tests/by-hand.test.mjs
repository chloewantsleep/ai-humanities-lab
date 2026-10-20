import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { HHH_SOURCE, PRESETS, assemblePreamble, buildPrompt, cutText, describePlan, parsePreamble, planPreamble, questionTurn, splitHeader, unitsOf } from "../app/by-hand/preamble.mjs";

// Run from nextjs/ (`pnpm test`). These checks need no model: they cover the saved HHH prompt and the fitting logic.

const file = await readFile("app/by-hand/hhh-prompt.txt", "utf8");
const { header, text } = splitHeader(file);
const hhh = parsePreamble(text);

test("hhh-prompt.txt is the gist's file, byte for byte, under a provenance header", () => {
  assert.ok(header.length >= 3 && header[0].includes("Askell et al. 2021"));
  assert.ok(header.some(line => line.includes(HHH_SOURCE.gist)));
  assert.equal(createHash("sha256").update(text).digest("hex"), HHH_SOURCE.sha256);
  assert.ok(text.startsWith("Below are a series of dialogues between various people and an AI assistant."));
  assert.ok(text.endsWith("-----"));
});

test("the saved prompt matches the paper's description: about 4,600 words in 14 conversations", () => {
  const words = text.split(/\s+/).filter(Boolean).length; // wc -w
  assert.ok(words >= 4550 && words <= 4700, `${words} words`);
  assert.equal(hhh.conversations.length, 14);
  assert.equal(hhh.conversations.reduce((n, c) => n + c.exchanges.length, 0), 57);
  for (const c of hhh.conversations) for (const e of c.exchanges) assert.ok(e.startsWith("Human:"), e.slice(0, 30)); // the original mixes one and two spaces after the colon
});

test("parsing and assembling a preamble round-trips, and the question is appended as one more exchange", () => {
  assert.equal(assemblePreamble(hhh), text);
  for (const preset of PRESETS.filter(p => p.text)) {
    const parsed = parsePreamble(preset.text);
    assert.equal(parsed.conversations.length, 3, preset.id);
    assert.equal(assemblePreamble(parsed), preset.text.trim(), preset.id);
  }
  assert.equal(questionTurn(" Why is the sky blue? "), "Human:  Why is the sky blue?\n\nAssistant:");
  assert.ok(buildPrompt(hhh, "Why is the sky blue?").endsWith("-----\n\nHuman:  Why is the sky blue?\n\nAssistant:"));
  assert.equal(buildPrompt(parsePreamble("Just an introduction."), "Hi"), "Just an introduction.\n\nHuman:  Hi\n\nAssistant:");
});

test("planPreamble keeps the introduction and the last exchanges that fit the budget", () => {
  const preamble = parsePreamble(["Intro.", "-----", "Human:  a1\n\nAssistant:  b1\n\nHuman:  a2\n\nAssistant:  b2", "-----", "Human:  c1\n\nAssistant:  d1", "-----", "Human:  e1\n\nAssistant:  f1\n\nHuman:  e2\n\nAssistant:  f2\n\nHuman:  e3\n\nAssistant:  f3", "-----"].join("\n\n"));
  const units = unitsOf(preamble);
  assert.equal(units.length, 1 + 2 + 1 + 3);
  const counts = units.map(() => 10); // 10 tokens each; every exchange costs 11 and each conversation's last one 6 more

  const all = planPreamble(preamble, counts, 10_000);
  assert.equal(all.fits, true);
  assert.equal(all.cutExchanges, 0);
  assert.equal(assemblePreamble(all.preamble), assemblePreamble(preamble));

  const some = planPreamble(preamble, counts, 10 + 17 + 11 + 11 + 17 + 5); // intro, conversation 3 whole, conversation 2 whole, nothing of 1
  assert.equal(some.keptExchanges, 4);
  assert.equal(some.keptConversations, 2);
  assert.equal(some.cutConversations, 1);
  assert.equal(some.partialConversation, null);
  assert.equal(assemblePreamble(some.preamble), "Intro.\n\n-----\n\nHuman:  c1\n\nAssistant:  d1\n\n-----\n\nHuman:  e1\n\nAssistant:  f1\n\nHuman:  e2\n\nAssistant:  f2\n\nHuman:  e3\n\nAssistant:  f3\n\n-----");
  assert.equal(cutText(preamble, some), "Human:  a1\n\nAssistant:  b1\n\nHuman:  a2\n\nAssistant:  b2");

  const partial = planPreamble(preamble, counts, 10 + 17 + 11); // intro and the last two exchanges of conversation 3
  assert.equal(partial.keptExchanges, 2);
  assert.equal(partial.keptConversations, 0);
  assert.deepEqual(partial.partialConversation, { index: 2, kept: 2, of: 3 });
  assert.equal(cutText(preamble, partial), "Human:  a1\n\nAssistant:  b1\n\nHuman:  a2\n\nAssistant:  b2\n\n-----\n\nHuman:  c1\n\nAssistant:  d1\n\n-----\n\nHuman:  e1\n\nAssistant:  f1");
  assert.match(describePlan(partial, { modelLabel: "GPT-2", contextLimit: 1024, reserved: 120, promptTokens: 60 }), /Kept the introduction, no whole conversation and the last 2 of conversation 3's 3 exchanges.*Cut conversations 1 to 2 and the start of conversation 3/);

  const none = planPreamble(preamble, counts, 9);
  assert.equal(none.fits, false);
  assert.match(describePlan(none, { modelLabel: "GPT-2", contextLimit: 1024, reserved: 120 }), /introduction alone/);
});

test("with GPT-2-sized counts the HHH prompt keeps its end and reports the cut", () => {
  const counts = unitsOf(hhh).map(u => Math.ceil(u.length / 4));
  const plan = planPreamble(hhh, counts, 800);
  assert.equal(plan.fits, true);
  assert.ok(plan.keptExchanges > 0 && plan.keptExchanges < plan.totalExchanges);
  assert.ok(plan.used <= 800);
  const last = hhh.conversations.at(-1).exchanges;
  assert.deepEqual(plan.preamble.conversations.at(-1).exchanges, last, "the last conversation is kept whole");
  assert.match(describePlan(plan, { modelLabel: "GPT-2", contextLimit: 1024, reserved: 120, promptTokens: 790 }), /Cut conversations 1 to \d+.*because GPT-2's window is 1,024 tokens/);
  assert.match(describePlan(plan, { modelLabel: "SmolLM2-135M", contextLimit: 8192, reserved: 120, promptTokens: 790, cap: 1000 }), /because the preamble is capped at 1,000 tokens here/);
  assert.match(describePlan(plan, { modelLabel: "SmolLM2-135M", contextLimit: 8192, reserved: 120, promptTokens: 790, cap: 800, autoCapped: true }), /running on the CPU path \(WASM\), where the page caps the preamble at 800 tokens/);
});
