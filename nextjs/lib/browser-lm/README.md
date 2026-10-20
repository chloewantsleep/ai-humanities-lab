---
status: working
---

# Browser language-model engine (task A)

Shared engine for tasks C and D. The model and tokenizer run entirely in a module Web Worker using the installed `@huggingface/transformers` 4.3.1. No API key or server inference. `/engine` is the bare test bench.

## React API

```jsx
"use client";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";

const lm = useBrowserLM("onnx-community/SmolLM2-135M-ONNX");
await lm.load(); // Explicit user action; mounting does not download weights.
const result = await lm.generate({
  prompt: "Who are you?\n",
  temperature: 0.8, topK: 20, maxNewTokens: 100,
  stopStrings: ["\nHuman:"], neverStop: false,
}, step => console.log(step.candidates));
lm.abort(); // Keep the partial output; result.finishReason === "abort".
```

`status`: `idle`, `loading`, `ready`, `generating`, or `error`. Also exposes `model`, `progress`, `text`, `step`, `result`, `error`, `templatedPrompt`. Methods return promises and reject on errors; catch them in event handlers. `load({ device: "auto", dtype: "q8" })` prefers WebGPU and retries with WASM if adapter acquisition or model initialization fails. Explicit `device: "wasm"` and `"webgpu"` are available for diagnostics. Quantization must exist in the selected model repo; there is no silent dtype substitution. Default q8 keeps the same assets across devices. `model.device` reports the device that loaded, and `model.fallbackReason` explains a fallback. A generation-time GPU error is surfaced for explicit WASM reload rather than silently repeating partial output.

Each hook owns one worker and one loaded model. Changing `modelId` or unmounting terminates the worker, releases the model, and rejects pending requests. Loads/generations on one worker are serial: await a result before submitting another. For task D's columns, use independent hooks (or independent `BrowserLM` clients). Identical model assets use the browser cache, though each worker has its own inference session and memory cost.

## Tokens and distributions

`generate` returns `{ text, rawText, tokenIds, prompt, templatedPrompt, promptTokens, generatedTokens, elapsedMs, tokensPerSecond, finishReason, stopString }`. `step` has `{ index, tokenId, tokenText, candidates, text, rawText, elapsedMs, generatedTokens, tokensPerSecond }`; every candidate has `{ id, text, probability, vocabularyProbability }`.

The library's KV-cached generation loop applies temperature before our logits observer. `probability` is normalized over the retained top-k tokens and matches the support sampled by 4.3.1's multinomial sampler; `vocabularyProbability` is normalized over all finite vocabulary logits after temperature. At temperature 0, sampling is greedy, so `probability` is 1 for the winner and 0 otherwise; `vocabularyProbability` then describes unscaled model scores. `topK: 0` returns the entire finite vocabulary (large messages; use a modest k for live views). Token text decodes an individual token with special tokens visible; it can contain a replacement character for partial UTF-8 bytes. Use cumulative `text` for correct reconstruction, not concatenated `tokenText`.

Stop strings match only the continuation, including strings split across tokens. `text` excludes the first matched stop string and everything after it; `rawText` and `tokenIds` retain sampled data. Intermediate prefixes of a stop string can briefly appear while streaming. EOS remains visible as a special token. `neverStop: true` ignores EOS, while explicit stop strings, max new tokens, the model's context limit, and Abort still apply. There is no unbounded allocation past the context window. `finishReason` is `eos`, `stop`, `length`, `context`, or `abort`. Abort takes effect at a token boundary, so an in-flight forward pass may finish first. A task-queue yield before each forward pass lets the worker receive Abort even under single-threaded WASM.

## Instruct models / task D

```js
const messages = [{ role: "user", content: "Who are you?" }];
const exact = await lm.applyChatTemplate(messages); // String, special tokens intact
const result = await lm.generate({ messages, maxNewTokens: 64 });
// result.templatedPrompt === exact; available before generation in lm.templatedPrompt
```

The tokenizer's own `apply_chat_template` supplies the template, with `add_generation_prompt: true`, `tokenize: false`. `templateOptions` on `generate` (or the second argument to `applyChatTemplate`) can override template settings such as `add_generation_prompt` or `enable_thinking`, but not `tokenize`. The exact string is then tokenized with `add_special_tokens: false`, avoiding duplicated BOS/EOS. Raw `prompt` mode does not apply a chat template. A model without a chat template reports the library error instead of inventing one. Task C should use raw mode. Task D column 2 should send its editable preamble as raw text, and toggle its own `stopStrings` when enabling both sides of the conversation. Column 3 should send `messages` to the instruct model.

## Counting tokens (added for task D, 2026-10-20)

```js
const { counts, contextLimit } = await lm.count(["Human:  Hello", "Assistant:  Hi"]);
```

`count(texts, { addSpecialTokens = true })` tokenizes each string with the loaded tokenizer, as raw-prompt generation does, and returns one count per string plus the model's `contextLimit` (the smallest of `max_position_embeddings`, `n_positions`, and the tokenizer's `model_max_length`). `load()` now also reports `contextLimit` on `model`. `/by-hand` uses this to fit its preamble into GPT-2's 1,024 tokens.

## Downloads, cache and measurements

Progress contains per-file events, byte counts, and percent for discovered files. Totals can increase as more files are discovered. `model.totalBytes` counts model/tokenizer/config assets loaded, including cached reads; it is not a claim about network transfer on a repeat load. The ONNX runtime and JS worker are separate downloads, excluded from that total. Browser Cache Storage is managed by Transformers.js and persists across workers/reloads when permitted by browser policy; eviction is possible. No cache is cleared by this engine.

Observed on Marlon's Mac on October 19, 2026, in headed Chrome 155.0.0.0 at the existing Next dev server. q8 weights, prompt `Who are you?\n` (5 tokens), temperature 0.8, top-k 20, budget 64 new tokens. Times include prefill, token decoding, distribution calculation, worker reporting, and the cooperative yield; exclude loading/downloads. These are individual observations in a shared development session, not hardware-independent benchmarks.

| Model | Model weights | Total assets loaded | WebGPU tokens/s | WASM tokens/s |
| --- | ---: | ---: | ---: | ---: |
| `Xenova/gpt2` | 128,315,766 bytes | 130,424,661 bytes (130.42 MB) | 9.97 first run; 10.80 warm | 23.67 |
| `onnx-community/SmolLM2-135M-ONNX` | 137,970,292 bytes | 140,028,656 bytes (140.03 MB) | 8.03 first run; 7.75 warm | 23.11 |

GPT-2 WebGPU: 64 tokens / 6.4189 s first, 64 / 5.9238 s warm. SmolLM2 WebGPU: first run stopped on EOS after 48 tokens / 5.9764 s; after reloading the GPU session, 64 / 7.5881 s (8.43 tokens/s); warm run with EOS ignored, 64 / 8.2604 s. WASM: GPT-2 64 / 2.7043 s, SmolLM2 64 / 2.7694 s. WASM happened to be faster here; C/D may expose explicit device choice while keeping the requested automatic WebGPU preference as default.

GPT-2 q8 uses the legacy filename `onnx/decoder_model_merged_quantized.onnx`, handled internally for this id/dtype; v4's default `model_quantized.onnx` does not exist in that repo. SmolLM2 q8 has a 1,252,724-byte ONNX graph plus a 136,717,568-byte external data file, both counted above. File names/sizes were checked through Hugging Face's model API ([GPT-2 files](https://huggingface.co/Xenova/gpt2/tree/main/onnx), [SmolLM2 files](https://huggingface.co/onnx-community/SmolLM2-135M-ONNX/tree/main/onnx)) and byte progress observed in the browser. Subsequent WASM/GPU reloads used the same cached model assets; the browser exposed `transformers-cache` in Cache Storage.

Verified in the browser: live distributions sum to 1 and include the sampled token; raw generation; automatic WASM selection with a deliberately unavailable GPU adapter; explicit WASM for both models; abort on GPU and WASM (partial results); greedy decoding; stop-string removal; and chat templates using `onnx-community/SmolLM2-135M-Instruct-ONNX`. The standalone template command exactly matched the prompt used for generation. With `Reply with just OK.` and temperature 0, the instruct model stopped after 37 tokens at `<|im_end|>`; never-stop continued past that same EOS to the 64-token budget and began writing another user turn. The test page was also visually inspected. Other models in the picker have not been runtime-tested in this task. WebGPU initialization-error fallback is implemented; only the no-adapter fallback was induced in this session.

Run the focused numerical/stop-control checks from `nextjs/`:

```sh
node --test lib/browser-lm/sampling.test.mjs
```

Five checks cover normalized top-k versus vocabulary probabilities, stable softmax and greedy support, temperature flattening, split-token stop matches, and invalid controls. The engine route compiled and ran on the existing dev server; no production build was run against its active `.next` directory.

## Sources checked during implementation

- Installed 4.3.1 `README.md`, `types/tokenization_utils.d.ts`, generation types, `src/models/modeling_utils.js`, `src/generation/logits_sampler.js`, `src/utils/hub.js`, and ONNX backend source.
- [Hugging Face WebGPU guide](https://huggingface.co/docs/transformers.js/guides/webgpu). Installed source takes precedence where the online guide lags this release.
- Installed Next 16.3.6 `dist/docs/01-app/03-api-reference/01-directives/use-client.md`.

## Open questions

- Larger model/quantization combinations and browsers beyond those measured below still need testing. Browser memory and performance vary; a repository having ONNX weights does not guarantee every dtype/device combination works.
