import { BrowserLM } from "../../lib/browser-lm/client.js";
import { cacheInventory } from "./preparation.mjs";

function deadline(promise, ms, message) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), ms); })]).finally(() => clearTimeout(timer));
}

async function withEngine(signal, operation, ms = 300000) {
  signal.throwIfAborted();
  const engine = new BrowserLM();
  const abort = () => engine.dispose();
  signal.addEventListener("abort", abort, { once: true });
  try { return await deadline(operation(engine), ms, "The model took too long. Check the connection and try again."); }
  finally { signal.removeEventListener("abort", abort); engine.dispose(); }
}

async function loadEmbedder(signal, progress) {
  signal.throwIfAborted();
  const worker = new Worker(new URL("../../lib/retrieval/embed-worker.js", import.meta.url), { type: "module" });
  let abort;
  try {
    await deadline(new Promise((resolve, reject) => {
      abort = () => reject(new DOMException("Preparation stopped", "AbortError"));
      signal.addEventListener("abort", abort, { once: true });
      worker.onerror = event => reject(new Error(event.message || "The embedding worker failed."));
      worker.onmessage = ({ data }) => {
        if (data.type === "progress") progress(data);
        if (data.type === "error") reject(new Error(data.message));
        if (data.type === "done") {
          if (data.vectors?.[0]?.length !== 384) reject(new Error("The embedding check returned an unexpected vector."));
          else resolve();
        }
      };
      worker.postMessage({ id: "get-ready", texts: ["Ready for the workshop."] });
    }), 300000, "The embedding model took too long. Check the connection and try again.");
  } finally { signal.removeEventListener("abort", abort); worker.terminate(); }
}

export async function loadWorkshopModel(model, signal, progress) {
  if (model.kind === "embedding") await loadEmbedder(signal, progress);
  else await withEngine(signal, engine => engine.load(model.id, { device: "wasm", dtype: "q8" }, event => { if (event.type === "progress") progress(event); }));
  signal.throwIfAborted();
  let cached = false;
  try { cached = (await cacheInventory())[model.id]; } catch { /* Loading can work even when the browser blocks persistent caching. */ }
  return { cached };
}

export async function measureDevice(device, signal) {
  return withEngine(signal, async engine => {
    await engine.load("Xenova/gpt2", { device, dtype: "q8" });
    const options = { prompt: "The quick brown fox jumps over the lazy dog.", temperature: 0, topK: 1, neverStop: true };
    await engine.generate({ ...options, maxNewTokens: 4 }); // Warm up; don't time compilation.
    const result = await engine.generate({ ...options, maxNewTokens: 32 });
    return { device, tps: result.tokensPerSecond, tokens: result.generatedTokens, ms: result.elapsedMs };
  }, 45000);
}
