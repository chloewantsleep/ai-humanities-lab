import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { bm25, buildSystem, chunk, decodeVectors, DIMS, keywordIndex, topK } from "../lib/retrieval/core.mjs";

test("chunk keeps paragraphs whole, merges short ones, and remembers the heading", () => {
  const passages = chunk("# Act One\n\nShort.\n\nAlso short.\n\n# Act Two\n\n" + "A long sentence here. ".repeat(80));
  assert.equal(passages[0].heading, "Act One");
  assert.equal(passages[0].text, "Short.\n\nAlso short.");
  assert.ok(passages.slice(1).every(p => p.heading === "Act Two" && p.text.length <= 760));
});

test("keyword search ranks the passage that shares the rare word", () => {
  const passages = [{ text: "The robots revolt." }, { text: "The garden is quiet." }, { text: "The robots work." }];
  const index = keywordIndex(passages);
  const [best] = topK(passages.map((_, i) => bm25(index, "why do robots revolt", i)), 1);
  assert.equal(best.i, 0);
});

test("the built corpus has one vector per passage", async () => {
  const manifest = JSON.parse(await readFile("public/retrieval/manifest.json", "utf8"));
  for (const t of manifest.texts) {
    const d = JSON.parse(await readFile(`public/retrieval/${t.id}.json`, "utf8"));
    assert.equal(decodeVectors(d.vectors).length, d.passages.length * DIMS, t.id);
  }
});

test("the system prompt numbers the passages it was given", () => {
  const system = buildSystem("Answer.", [{ title: "Phaedrus", heading: "Phaedrus", text: "Theuth" }]);
  assert.match(system, /\[1\] Phaedrus — Phaedrus\nTheuth/);
});
