import { pipeline, env } from "@huggingface/transformers";
import { MODEL } from "./core.mjs";

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;

// One job: turn strings into normalized 384-number vectors with the model the corpus was embedded with.
let extractor;
self.onmessage = async ({ data: { id, texts } }) => {
  try {
    extractor ??= await pipeline("feature-extraction", MODEL, {
      dtype: "q8",
      progress_callback: e => e.status === "progress" && self.postMessage({ id, type: "progress", file: e.file, percent: e.progress }),
    });
    const out = [];
    for (let i = 0; i < texts.length; i += 16) {
      const result = await extractor(texts.slice(i, i + 16), { pooling: "mean", normalize: true });
      for (let j = 0; j < result.dims[0]; j++) out.push(Array.from(result.data.subarray(j * 384, (j + 1) * 384)));
      self.postMessage({ id, type: "progress", done: Math.min(i + 16, texts.length), total: texts.length });
    }
    self.postMessage({ id, type: "done", vectors: out });
  } catch (error) {
    self.postMessage({ id, type: "error", message: String(error?.message ?? error) });
  }
};
