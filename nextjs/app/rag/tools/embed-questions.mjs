// Embeds the example questions on /rag ahead of time, with the model the corpus was embedded with, so the page
// can show steps 4 to 7 before (or without) downloading the model. Run from nextjs/:
//
//   node app/rag/tools/embed-questions.mjs        (writes app/rag/questions.json)
import { writeFile } from "node:fs/promises";
import { pipeline } from "@huggingface/transformers";
import { MODEL } from "../../../lib/retrieval/core.mjs";
import { QUESTIONS } from "../questions.mjs";

const embed = await pipeline("feature-extraction", MODEL, { dtype: "q8" });
const vectors = {};
for (const q of [...new Set(Object.values(QUESTIONS).flat())]) {
  const out = await embed([q], { pooling: "mean", normalize: true });
  vectors[q] = Array.from(out.data, v => Number(v.toFixed(6)));
}
const file = { model: MODEL, dtype: "q8", embedded: new Date().toISOString().slice(0, 10), vectors };
await writeFile(new URL("../questions.json", import.meta.url), JSON.stringify(file));
console.log(`wrote questions.json (${Object.keys(vectors).length} questions)`);
