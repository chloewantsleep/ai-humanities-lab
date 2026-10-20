import { MODEL } from "../../lib/retrieval/core.mjs";

export const MODELS = [
  { id: "Xenova/gpt2", label: "GPT-2 small", mb: 130, kind: "language", file: "decoder_model_merged_quantized.onnx", use: "/gpt-2", role: "Continues the document" },
  { id: "onnx-community/SmolLM2-135M-ONNX", label: "SmolLM2-135M base", mb: 140, kind: "language", file: "model_quantized.onnx", use: "/by-hand", role: "The base model, with and without a preamble" },
  { id: "onnx-community/SmolLM2-135M-Instruct-ONNX", label: "SmolLM2-135M Instruct", mb: 140, kind: "language", file: "model_quantized.onnx", use: "/by-hand", role: "The post-trained sibling" },
  { id: MODEL, label: "MiniLM sentence embedder", mb: 23, kind: "embedding", file: "model_quantized.onnx", use: "/retrieval", role: "Turns questions into vectors" },
];

export function hasWeights(urls, model) {
  return urls.some(url => url.includes(`/${model.id}/`) && url.endsWith(`/onnx/${model.file}`));
}

export async function cacheInventory() {
  const cache = await globalThis.caches.open("transformers-cache");
  const urls = (await cache.keys()).map(request => request.url);
  return Object.fromEntries(MODELS.map(model => [model.id, hasWeights(urls, model)]));
}

// One small GPT-2 continuation is a device hint, not a benchmark of long preambles.
export function chooseDevice(measurements) {
  const usable = measurements.filter(m => Number.isFinite(m.tps) && m.tps > 0);
  const cpu = usable.find(m => m.device === "wasm");
  const gpu = usable.find(m => m.device === "webgpu");
  if (!cpu && !gpu) return null;
  if (!cpu) return "webgpu";
  return gpu && gpu.tps > cpu.tps * 1.1 ? "webgpu" : "wasm";
}

// Continue after an individual download failure, but never after cancellation.
export async function prepareModels({ load, signal, onState }) {
  let complete = true;
  for (const model of MODELS) {
    signal.throwIfAborted();
    onState(model.id, { status: "loading", error: "", progress: null });
    try {
      const result = await load(model, progress => onState(model.id, { progress }));
      signal.throwIfAborted();
      onState(model.id, { status: result.cached ? "ready" : "uncached", progress: null });
      if (!result.cached) complete = false;
    } catch (error) {
      signal.throwIfAborted();
      complete = false;
      onState(model.id, { status: "error", error: error.message, progress: null });
    }
  }
  return complete;
}
