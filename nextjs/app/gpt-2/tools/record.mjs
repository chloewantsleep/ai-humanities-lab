// Records the GPT-2 experiment's fallback runs (../recorded.json): GPT-2 continuing each starter prompt, with the top
// next-token odds at every step, for when the classroom can't download the model. Runs in Node with the same
// transformers.js, the same q8 weights, and the engine's own sampling code (lib/browser-lm/), mirroring its worker.
//
//   cd nextjs && node app/gpt-2/tools/record.mjs            (writes app/gpt-2/recorded.json)
//
// Each take is the first one sampled: nothing is cherry-picked.
import { writeFile } from "node:fs/promises";
import { AutoModelForCausalLM, AutoTokenizer, LogitsProcessor, env } from "@huggingface/transformers";
import { distribution } from "../../../lib/browser-lm/sampling.js";
import { addPiece } from "../pieces.mjs";
import { DEFAULTS, STARTERS } from "../starters.mjs";

if (process.env.HF_CACHE_DIR) env.cacheDir = process.env.HF_CACHE_DIR; // otherwise transformers.js caches in node_modules
const MODEL = "Xenova/gpt2";
const TOP = 8;
const takes = [
  ...STARTERS.map(s => ({ id: s.id, label: s.label, prompt: s.prompt, settings: DEFAULTS })),
  { id: "who-greedy", label: "Who are you? at temperature 0", prompt: STARTERS[1].prompt, settings: { ...DEFAULTS, temperature: 0 } },
  { id: "question-greedy", label: "A question at temperature 0", prompt: STARTERS[0].prompt, settings: { ...DEFAULTS, temperature: 0 } },
];

const tokenizer = await AutoTokenizer.from_pretrained(MODEL);
const model = await AutoModelForCausalLM.from_pretrained(MODEL, { dtype: "q8", model_file_name: "decoder_model_merged" });

async function record({ prompt, settings }) {
  const inputs = tokenizer(prompt);
  const ids = [], steps = [];
  let candidates = [], pieces = [], first = true;
  class Observe extends LogitsProcessor {
    _call(_ids, logits) {
      candidates = distribution(logits.data, settings.topK, settings.temperature === 0);
      return logits;
    }
  }
  const streamer = {
    put(batch) {
      if (first) { first = false; return; }
      const id = Number(batch[0][0]);
      ids.push(id);
      pieces = addPiece(pieces, tokenizer.decode(ids, { skip_special_tokens: false }));
      const top = candidates.slice(0, TOP);
      if (!top.some(c => c.id === id)) top.push(candidates.find(c => c.id === id));
      steps.push({
        id, tok: tokenizer.decode([id], { skip_special_tokens: false }),
        // At temperature 0 the sampler's odds are 1 and 0, so keep the model's own odds instead.
        c: top.map(c => [tokenizer.decode([c.id], { skip_special_tokens: false }), Number((settings.temperature === 0 ? c.vocabularyProbability : c.probability).toFixed(4)), c.id]),
      });
    },
    end() {},
  };
  const started = performance.now();
  await model.generate({
    ...inputs, max_new_tokens: settings.maxNewTokens,
    do_sample: settings.temperature !== 0, temperature: settings.temperature || 1,
    top_k: settings.topK, top_p: 1, repetition_penalty: 1, no_repeat_ngram_size: 0,
    ...(settings.neverStop ? { eos_token_id: null } : {}),
    logits_processor: [new Observe()], streamer,
  });
  // Pieces can be trimmed after the fact (partial UTF-8), so attach them at the end.
  steps.forEach((s, i) => { s.t = pieces[i] ?? ""; });
  return { steps, finishReason: "length", ms: Math.round(performance.now() - started) };
}

const runs = [];
for (const take of takes) {
  const { steps, finishReason, ms } = await record(take);
  runs.push({ ...take, finishReason, steps });
  console.log(`${take.id}: ${steps.length} tokens in ${ms} ms\n${take.prompt}${steps.map(s => s.t).join("")}\n`);
}
const out = {
  recorded: new Date().toISOString().slice(0, 10),
  source: "GPT-2 small (Xenova/gpt2, q8), recorded in Node with this page's engine code (transformers.js 4.3.1), the first take of each",
  model: { id: MODEL, name: "GPT-2 small", dtype: "q8" },
  runs,
};
await writeFile(new URL("../recorded.json", import.meta.url), JSON.stringify(out));
console.log(`wrote recorded.json (${runs.length} takes)`);
