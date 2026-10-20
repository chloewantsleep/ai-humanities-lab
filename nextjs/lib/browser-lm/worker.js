import {
  AutoTokenizer, AutoModelForCausalLM, LogitsProcessor,
  StoppingCriteria, env,
} from "@huggingface/transformers";
import { distribution, normalizeOptions, findStop } from "./sampling.js";

env.allowLocalModels = false;
env.useBrowserCache = true;
// A worker keeps inference off the UI thread; one WASM thread also works without
// COOP/COEP headers. Disable the nested proxy worker (unsupported with WebGPU).
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;

let model, tokenizer, loaded, busy = false, interrupted = false;
const send = (requestId, type, data = {}) => self.postMessage({ requestId, type, ...data });

async function load(requestId, { modelId, device = "auto", dtype = "q8" }) {
  if (!modelId || typeof modelId !== "string") throw new Error("Provide a Hugging Face model id.");
  if (!["auto", "webgpu", "wasm"].includes(device)) throw new Error("device must be auto, webgpu, or wasm.");
  if (loaded?.modelId === modelId && loaded.requestedDevice === device && loaded.dtype === dtype) {
    send(requestId, "ready", { ...loaded, reused: true });
    return loaded;
  }
  await model?.dispose();
  model = tokenizer = loaded = null;
  const files = {};
  const progress_callback = event => {
    if (event.file) {
      const previous = files[event.file] ?? {};
      files[event.file] = { ...previous, ...event };
    }
    const values = Object.values(files);
    const loadedBytes = values.reduce((sum, x) => sum + (x.loaded ?? 0), 0);
    const totalBytes = values.reduce((sum, x) => sum + (x.total ?? 0), 0);
    send(requestId, "progress", {
      event, files, loadedBytes, totalBytes,
      percent: totalBytes ? 100 * loadedBytes / totalBytes : null,
    });
  };
  tokenizer = await AutoTokenizer.from_pretrained(modelId, { progress_callback });
  // Xenova/gpt2 predates v4's default "model_quantized.onnx" naming. Its q8
  // KV-cache graph is the published decoder_model_merged_quantized.onnx.
  const modelOptions = {
    dtype, progress_callback,
    ...(modelId === "Xenova/gpt2" && dtype === "q8" ? { model_file_name: "decoder_model_merged" } : {}),
  };
  let selectedDevice = device === "wasm" ? "wasm" : "webgpu";
  let fallbackReason = null;
  if (device === "auto") {
    try {
      if (!await self.navigator.gpu?.requestAdapter()) {
        selectedDevice = "wasm";
        fallbackReason = "No WebGPU adapter is available in this browser.";
      }
    } catch (error) {
      selectedDevice = "wasm";
      fallbackReason = String(error.message ?? error);
    }
  }
  try {
    model = await AutoModelForCausalLM.from_pretrained(modelId, { ...modelOptions, device: selectedDevice });
  } catch (error) {
    if (selectedDevice !== "webgpu" || device !== "auto") throw error;
    fallbackReason = `WebGPU load failed: ${error.message ?? error}`;
    selectedDevice = "wasm";
    send(requestId, "fallback", { fallbackReason });
    model = await AutoModelForCausalLM.from_pretrained(modelId, { ...modelOptions, device: "wasm" });
  }
  loaded = {
    modelId, device: selectedDevice, requestedDevice: device, dtype, fallbackReason,
    files, totalBytes: Object.values(files).reduce((sum, x) => sum + (x.total ?? x.loaded ?? 0), 0),
    contextLimit: contextLimitOf(),
  };
  send(requestId, "ready", loaded);
  return loaded;
}

// The model's window: the smallest of the config's limits and the tokenizer's.
function contextLimitOf() {
  return Math.min(
    model.config.max_position_embeddings ?? Infinity,
    model.config.n_positions ?? Infinity,
    tokenizer.model_max_length ?? Infinity,
  );
}

// Token counts for strings, with the loaded tokenizer; the same tokenization as raw-prompt generation by default.
// (Added for task D, which fits its preamble to the window.)
function countTokens({ texts, addSpecialTokens = true }) {
  if (!tokenizer) throw new Error("Load a model first.");
  if (!Array.isArray(texts) || texts.some(t => typeof t !== "string")) throw new Error("Provide an array of strings to count.");
  return texts.map(t => (t.length ? tokenizer(t, { add_special_tokens: addSpecialTokens }).input_ids.dims.at(-1) : 0));
}

function applyTemplate({ messages, templateOptions = {} }) {
  if (!tokenizer) throw new Error("Load a model first.");
  if (!Array.isArray(messages) || !messages.length) throw new Error("Provide at least one chat message.");
  // tokenize:false is deliberately last: callers cannot turn this into token IDs.
  return tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true, ...templateOptions, tokenize: false,
  });
}

async function generate(requestId, request) {
  if (!model || !tokenizer) throw new Error("Load a model first.");
  const options = normalizeOptions(request);
  const templatedPrompt = request.messages ? applyTemplate(request) : null;
  const prompt = templatedPrompt ?? request.prompt;
  if (typeof prompt !== "string" || !prompt.length) throw new Error("Provide a nonempty prompt or chat messages.");
  const inputs = tokenizer(prompt, { add_special_tokens: templatedPrompt === null });
  const promptTokens = inputs.input_ids.dims.at(-1);
  const contextLimit = contextLimitOf();
  const maxNewTokens = Math.min(options.maxNewTokens, contextLimit - promptTokens);
  if (maxNewTokens < 1) throw new Error(`Prompt fills the model's ${contextLimit}-token context window.`);
  send(requestId, "start", { prompt, templatedPrompt, promptTokens, maxNewTokens, contextLimit });
  interrupted = false;
  let candidates = [], rawText = "", text = "", stopMatch = null, first = true;
  let lastTokenId = null;
  const ids = [];
  const started = performance.now();
  class ObserveLogits extends LogitsProcessor {
    _call(_inputIds, logits) {
      candidates = distribution(logits.data, options.topK, options.temperature === 0)
        .map(x => ({ ...x, text: tokenizer.decode([x.id], { skip_special_tokens: false }) }));
      return logits;
    }
  }
  class Stop extends StoppingCriteria {
    _call() { return [interrupted || !!stopMatch]; }
  }
  const streamer = {
    put(batch) {
      if (first) { first = false; return; } // .generate streams the prompt first.
      lastTokenId = Number(batch[0][0]);
      ids.push(lastTokenId);
      rawText = tokenizer.decode(ids, { skip_special_tokens: false });
      stopMatch = findStop(rawText, options.stopStrings);
      text = stopMatch ? rawText.slice(0, stopMatch.index) : rawText;
      const elapsedMs = performance.now() - started;
      send(requestId, "step", {
        index: ids.length - 1, tokenId: lastTokenId,
        tokenText: tokenizer.decode([lastTokenId], { skip_special_tokens: false }),
        text, rawText, candidates, elapsedMs, generatedTokens: ids.length,
        tokensPerSecond: ids.length / (elapsedMs / 1000),
      });
    },
    end() {},
  };
  // Use the library's KV-cached loop, observing processed logits immediately before
  // its sampler and correlating them with the token delivered by the streamer.
  // WASM can otherwise monopolize the worker's microtask queue for the entire
  // generation. Yield before each forward pass so posted abort commands run.
  const forward = model.forward;
  model.forward = async function (...args) {
    await new Promise(resolve => setTimeout(resolve, 0));
    return forward.apply(this, args);
  };
  try {
    await model.generate({
      ...inputs, max_new_tokens: maxNewTokens,
      do_sample: options.temperature !== 0, temperature: options.temperature || 1,
      top_k: options.topK, top_p: 1, num_beams: 1, num_return_sequences: 1,
      repetition_penalty: 1, no_repeat_ngram_size: 0,
      forced_eos_token_id: null,
      ...(options.neverStop ? { eos_token_id: null } : {}),
      logits_processor: [new ObserveLogits()], stopping_criteria: [new Stop()], streamer,
    });
  } finally { model.forward = forward; }
  const eos = model.generation_config?.eos_token_id ?? model.config.eos_token_id ?? tokenizer.eos_token_id;
  const endedOnEos = (Array.isArray(eos) ? eos : [eos]).includes(lastTokenId);
  const elapsedMs = performance.now() - started;
  send(requestId, "result", {
    text, rawText, tokenIds: ids, prompt, templatedPrompt, promptTokens,
    generatedTokens: ids.length, elapsedMs, tokensPerSecond: ids.length / (elapsedMs / 1000),
    finishReason: interrupted ? "abort" : stopMatch ? "stop" : endedOnEos && !options.neverStop ? "eos" :
      maxNewTokens < options.maxNewTokens ? "context" : "length",
    stopString: stopMatch?.stop ?? null,
  });
}

self.onmessage = async ({ data: { requestId, type, ...data } }) => {
  if (type === "abort") { interrupted = true; return; }
  if (busy) { send(requestId, "error", { message: "The engine is busy; await the current request or abort it first." }); return; }
  busy = true;
  try {
    if (type === "load") await load(requestId, data);
    else if (type === "generate") await generate(requestId, data);
    else if (type === "template") send(requestId, "template", { templatedPrompt: applyTemplate(data) });
    else if (type === "count") send(requestId, "count", { counts: countTokens(data), contextLimit: contextLimitOf() });
    else throw new Error(`Unknown engine command: ${type}`);
  } catch (error) {
    send(requestId, "error", { message: error.message ?? String(error) });
  } finally { busy = false; }
};
