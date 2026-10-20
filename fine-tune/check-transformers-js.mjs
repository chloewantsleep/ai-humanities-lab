// Local ONNX integration check with the same installed library as engine A.
// This is a Node CPU check; use /engine + serve-model.py for browser verification.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { AutoTokenizer, AutoModelForCausalLM, env } from "../nextjs/node_modules/@huggingface/transformers/dist/transformers.node.mjs";

env.allowRemoteModels = false;
env.useBrowserCache = false;
const modelPath = fileURLToPath(new URL("./outputs/browser-model/", import.meta.url));
const cases = JSON.parse(await readFile(new URL("./outputs/comparison.json", import.meta.url), "utf8"));
const dtype = process.argv[2] ?? "fp32";
const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
const started = performance.now();
const model = await AutoModelForCausalLM.from_pretrained(modelPath, { dtype, device: "cpu", session_options: { intraOpNumThreads: 4 } });
const rows = [];
for (const item of cases) {
  const prompt = tokenizer.apply_chat_template([{ role: "user", content: item.prompt }], { tokenize: false, add_generation_prompt: true });
  if (prompt !== `User: ${item.prompt}\nAssistant:`) throw new Error("Chat template changed the training prefix");
  const inputs = tokenizer(prompt, { add_special_tokens: false });
  const start = performance.now();
  const output = await model.generate({ ...inputs, max_new_tokens: 64, do_sample: false });
  const continuation = tokenizer.decode(output.tolist()[0].slice(inputs.input_ids.dims.at(-1)), { skip_special_tokens: true });
  rows.push({ prompt: item.prompt, continuation, matchesPyTorch: continuation === item.fine_tuned, seconds: (performance.now() - start) / 1000 });
}
await model.dispose();
const report = { dtype, elapsedSeconds: (performance.now() - started) / 1000, rows };
await writeFile(new URL(`./outputs/transformers-js-${dtype}.json`, import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (dtype === "fp32" && rows.some(row => !row.matchesPyTorch)) process.exitCode = 1;
