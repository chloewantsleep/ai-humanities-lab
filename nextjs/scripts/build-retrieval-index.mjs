// Builds the /retrieval corpus: splits the public-domain course readings (from the sibling eng-298ai-context
// repo) into passages and embeds each with the same model the page uses for queries. Vectors are normalized
// and stored as base64 int8 (value × 127), one JSON file per text in public/retrieval/.
// Run from nextjs/: node scripts/build-retrieval-index.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { pipeline } from "@huggingface/transformers";
import { MODEL, TARGET, chunk } from "../lib/retrieval/core.mjs";

const SOURCE = "../../eng-298ai-context/_context/course-readings/course-readings-md";
const OUT = "public/retrieval";

// Only Project Gutenberg texts: these files are served publicly by the app.
const TEXTS = [
  ["phaedrus", "plato-phaedrus.md"],
  ["rur", "capek-rur.md"],
  ["frankenstein", "shelley-frankenstein-1818.md"],
  ["laughter", "bergson-laughter.md"],
  ["dorian-gray", "wilde-picture-of-dorian-gray-1891.md"],
  ["intentions", "wilde-intentions.md"],
];

const embed = await pipeline("feature-extraction", MODEL, { dtype: "q8" });
const manifest = [];
for (const [id, file] of TEXTS) {
  const { data, content } = matter(await readFile(path.join(SOURCE, file), "utf8"));
  const passages = chunk(content);
  const bytes = new Int8Array(passages.length * 384);
  for (let i = 0; i < passages.length; i += 32) {
    const batch = passages.slice(i, i + 32).map(p => p.text);
    const out = await embed(batch, { pooling: "mean", normalize: true });
    const values = out.data;
    for (let j = 0; j < values.length; j++) bytes[i * 384 + j] = Math.round(values[j] * 127);
  }
  const entry = { id, title: data.title, author: data.author, translator: data.translator ?? null, source: data.source, passages: passages.length };
  await writeFile(path.join(OUT, `${id}.json`), JSON.stringify({ ...entry, model: MODEL, dims: 384, passages, vectors: Buffer.from(bytes.buffer).toString("base64") }));
  manifest.push(entry);
  console.log(id, passages.length, "passages");
}
await writeFile(path.join(OUT, "manifest.json"), JSON.stringify({ model: MODEL, dims: 384, target: TARGET, texts: manifest }, null, 2) + "\n");
