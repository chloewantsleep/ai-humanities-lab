import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { makeComparison, PERSONAS, retrieve } from "./comparison.mjs";

const corpus = { title: "Test text", passages: [
  { heading: "One", text: "The robots work in a factory." },
  { heading: "Two", text: "The lonely creature asks its creator for kindness." },
  { heading: "Three", text: "A garden blooms in spring." },
] };
const question = "What does a creator owe the creature?";
const persona = PERSONAS[0].instructions;

test("evidence stays identical across voices and out of both no-file prompts", () => {
  const results = retrieve(corpus, question);
  const { cells } = makeComparison({ question, corpus: corpus.title, persona, results });
  const evidence = system => system.split("<retrieved_passages>")[1];
  assert.equal(evidence(cells[1].system), evidence(cells[3].system));
  for (const cell of [cells[0], cells[2]]) for (const r of results) assert.ok(!cell.system.includes(r.text));
  assert.equal(cells[0].voice, cells[1].voice);
  assert.equal(cells[2].voice, cells[3].voice);
  assert.equal(cells[2].voice, persona);
});

test("a question without keyword matches doesn't inject unrelated passages", () => {
  const results = retrieve(corpus, "xyzzy quux");
  assert.deepEqual(results, []);
  const { cells } = makeComparison({ question: "xyzzy quux", corpus: corpus.title, persona, results, includeExamples: true });
  assert.equal(cells.length, 4);
  assert.ok(cells.every(c => c.system.includes("(none retrieved)")));
});

test("fifth condition labels the same text as voice examples and has no retrieved evidence", () => {
  const results = retrieve(corpus, question);
  const { cells } = makeComparison({ question, corpus: corpus.title, persona, results, includeExamples: true });
  assert.equal(cells.length, 5);
  const fifth = cells[4];
  assert.ok(fifth.system.includes("<voice_examples>"));
  for (const result of results) assert.ok(fifth.system.includes(result.text));
  assert.match(fifth.system, /style only, not as evidence/);
  assert.match(fifth.system, /<retrieved_passages>\n\(none retrieved\)/);
  assert.ok(!fifth.system.includes(persona));
});

test("retrieval uses the shared corpus and supplies passage numbers for inspection", async () => {
  const source = JSON.parse(await readFile(new URL("../../public/retrieval/frankenstein.json", import.meta.url), "utf8"));
  const results = retrieve(source, question);
  assert.ok(results.length > 0 && results.length <= 3);
  for (const result of results) {
    assert.equal(result.text, source.passages[result.index].text);
    assert.equal(result.title, source.title);
    assert.ok(result.score > 0);
  }
});
