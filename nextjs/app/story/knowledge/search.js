import "server-only";
// The server half of the Knowledge demo: the Gem's own Frankenstein pack, keyword search and vectors.
// The novel is ~440KB of text, so it never goes to the browser; only the three passages a search picks do.

import { packChunks, packStats, packText } from "@/lib/poetry-gem/content";
import { bm25, tokenize } from "@/lib/poetry-gem/search";
import { fromBase64 } from "@/lib/poetry-gem/embeddings";
import { nearest, readMap } from "@/lib/poetry-gem/vectors";

const PACK = "frankenstein";
const LEVEL = "whole";
const K = 3;
const SNIPPET = 300;

// Rough, like the Gem: ~3.5 characters per token of English prose.
export const tokensOf = (s) => Math.round(s.length / 3.5);

function body(text) {
  return text.replace(/^## .*\n+/, "").replace(/[*_]/g, "").replace(/\s+/g, " ").trim();
}

/** A window of the passage around its first matched word (or its opening, if none). */
function snippet(text, terms = []) {
  const t = body(text);
  let at = 0;
  if (terms.length) {
    const re = new RegExp(`\\b(${terms.join("|")})\\b`, "i");
    const m = re.exec(t);
    if (m) at = Math.max(0, m.index - 90);
  }
  if (at > 0) {
    const space = t.indexOf(" ", at);
    at = space > -1 ? space + 1 : at;
  }
  const end = Math.min(t.length, at + SNIPPET);
  const cut = t.slice(at, end).replace(/\s\S*$/, end < t.length ? "" : "$&");
  return `${at > 0 ? "… " : ""}${cut}${end < t.length ? " …" : ""}`;
}

const shape = (hits, terms) => ({
  terms,
  hits: hits.map((h) => ({ title: h.title.replace(/ \(part \d+\)$/, ""), score: h.score, snippet: snippet(h.text, terms) })),
  // What gets sent is the whole of each retrieved passage, not the snippet shown here.
  tokens: hits.reduce((n, h) => n + tokensOf(h.text), 0),
});

export function keywordSearch(q) {
  const terms = [...new Set(tokenize(q))];
  return shape(bm25(packChunks(PACK, LEVEL), q, K), terms);
}

let words;
/** Single words whose embeddings were precomputed with the Gem's model (vectors/map.json, "words" layer). */
function wordVectors() {
  if (!words) {
    const w = readMap().words;
    const vecs = fromBase64(w.vectors);
    words = new Map(w.points.map((p, j) => [p.word, vecs[j]]));
  }
  return words;
}

export function semanticWords() {
  return [...wordVectors().keys()];
}

/** Meaning-based search, for a query whose embedding is already on disk. Returns null otherwise. */
export function meaningSearch(q) {
  const v = wordVectors().get(q.trim().toLowerCase());
  if (!v) return null;
  const passages = nearest(PACK, LEVEL, v, K);
  const r = shape(passages, []);
  const word = q.trim().toLowerCase();
  // Does the passage even contain the query word? Often it does not: that is the point.
  r.hits.forEach((h, i) => (h.sharesWord = new RegExp(`\\b${word}`, "i").test(passages[i].text)));
  return r;
}

export function wholeText() {
  const s = packStats(PACK, LEVEL);
  const opening = body(packText(PACK, LEVEL)).slice(0, 360).replace(/\s\S*$/, "") + " …";
  return { tokens: s.approxTokens, chars: s.chars, passages: s.passages, opening };
}
