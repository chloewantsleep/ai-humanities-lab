import "server-only";
import type { Passage } from "./options";

// Plain BM25 keyword search. No stemming, no synonyms, no spelling normalization:
// "parents" will not match "filial", and "creator" will not match "maker".
// That brittleness is the point of the comparison with the other delivery modes.

const STOP = new Set(
  "a an and are as at be but by for from has have he her his i in is it its me my of on or our she so that the their them they this to was we were what when which who will with you your thy thee thou not no do does did can could would should shall all any into than then there these those upon".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [])
    .map((w) => w.replace(/'s$/, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
}

const K1 = 1.2;
const B = 0.75;

export function bm25(passages: Passage[], query: string, k = 5): Passage[] {
  const q = [...new Set(tokenize(query))];
  if (!q.length || !passages.length) return [];
  const docs = passages.map((p) => tokenize(p.text));
  const avgLen = docs.reduce((n, d) => n + d.length, 0) / docs.length;
  const df = new Map<string, number>();
  for (const d of docs) for (const w of new Set(d)) df.set(w, (df.get(w) ?? 0) + 1);

  return passages
    .map((p, i) => {
      const tf = new Map<string, number>();
      for (const w of docs[i]) tf.set(w, (tf.get(w) ?? 0) + 1);
      let score = 0;
      for (const w of q) {
        const f = tf.get(w);
        if (!f) continue;
        const n = df.get(w)!;
        const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
        score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * docs[i].length) / avgLen)));
      }
      return { ...p, score: Math.round(score * 100) / 100 };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
