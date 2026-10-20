import "server-only";
import fs from "node:fs";
import path from "node:path";
import { allChunks, type Chunk } from "./content";
import { dot, fromBase64, hashText } from "./embeddings";
import type { Material, Passage, PackId } from "./options";

const DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "_poetry-gem", "vectors");

type Index = { vecs: Float32Array[]; passages: Chunk[] };
const cache = new Map<PackId, Index>();

/** Load a pack's "vector database": one embedding per passage, aligned with allChunks(pack). */
export function loadIndex(pack: PackId): Index {
  let idx = cache.get(pack);
  if (idx) return idx;
  const file = path.join(DIR, `${pack}.json`);
  if (!fs.existsSync(file)) throw new Error(`No embeddings for ${pack}. Run: npm run embeddings`);
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { items: { hash: string }[]; vectors: string };
  const passages = allChunks(pack);
  if (data.items.length !== passages.length || data.items.some((it, i) => it.hash !== hashText(passages[i].text))) {
    throw new Error(`The ${pack} pack changed since its embeddings were built. Run: npm run embeddings`);
  }
  idx = { vecs: fromBase64(data.vectors), passages };
  cache.set(pack, idx);
  return idx;
}

export type VectorHit = Passage & { pack: PackId; i: number };

/** Nearest passages among those available at `material` (voice prompt, or a level of the text). */

export function nearest(pack: PackId, material: Material, q: Float32Array, k = 5, skip?: number): VectorHit[] {
  const { vecs, passages } = loadIndex(pack);
  return passages
    .map((c, i) => ({ c, i, score: Math.round(dot(q, vecs[i]) * 1000) / 1000 }))
    .filter(({ c, i }) => i !== skip && c.levels.includes(material))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ c, i, score }) => ({ title: c.title, source: c.source, text: c.text, pack, i, score }));
}

type Basis = { mean: number[]; components: number[][]; scale: number };
let map: { passages: { basis: Basis }; words: { basis: Basis } } | null = null;

/** Place a new vector (e.g. a query) on the same 3D map as the passages or words. */
export function project(v: Float32Array, layer: "passages" | "words"): [number, number, number] {
  map ??= JSON.parse(fs.readFileSync(path.join(DIR, "map.json"), "utf8"));
  const b = map![layer].basis;
  return b.components.map((c) => {
    let s = 0;
    for (let j = 0; j < c.length; j++) s += (v[j] - b.mean[j]) * c[j];
    return Math.round((s / b.scale) * 1e5) / 1e5;
  }) as [number, number, number];
}

export function readMap() {
  return JSON.parse(fs.readFileSync(path.join(DIR, "map.json"), "utf8"));
}
