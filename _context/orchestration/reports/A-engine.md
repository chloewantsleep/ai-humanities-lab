---
task: "A. Browser language-model engine"
thread_id: "01a15550-1711-7c23-a666-68d4ce25c984"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15550-1711-7c23-a666-68d4ce25c984"
ran: "18:38–18:58 UTC, 2026-10-19"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# Task A: the browser language-model engine

## What I built

A shared engine in `nextjs/lib/browser-lm/` that runs `@huggingface/transformers` 4.3.1 inside a module Web Worker, plus a bare test page.

- `worker.js`: loads a model by id with per-file progress, prefers WebGPU and retries on WASM (reports `model.device` and `model.fallbackReason`), generates step by step, and reports at every step the chosen token and the top-k candidates. Controls: temperature, top-k (0 = whole vocabulary), max new tokens, stop strings (matched across token boundaries), `neverStop` (ignores EOS), and abort (takes effect at a token boundary, with a task-queue yield before each forward pass so a single-threaded WASM worker can receive it). It also applies a model's chat template and returns the exact templated string.
- `sampling.js`: the numerics (stable softmax, top-k normalization, stop-string matching, option checks). `sampling.test.mjs`: five `node:test` checks.
- `client.js`: `BrowserLM`, a class that owns one worker and one model (`load`, `generate`, `applyChatTemplate`, `abort`, `dispose`).
- `useBrowserLM.js`: the React hook, `useBrowserLM(modelId)`. `index.js` re-exports both.
- `README.md`: the API, the shapes of results and steps, measurements, and notes for C and D. This is the canonical reference; read it before using the engine.
- `nextjs/app/engine/page.jsx` and `engine.css`: the `/engine` test bench (model id with a datalist of the seven checked ids, device, weights dtype, prompt, temperature, top-k, max tokens, stop strings, never-stop, Generate/Abort, a progress bar, and the live candidate list).

Each candidate has `{ id, text, probability, vocabularyProbability }`. `probability` is normalized over the retained top-k and matches the support the library's sampler actually draws from; `vocabularyProbability` is over the whole finite vocabulary after temperature. At temperature 0 sampling is greedy.

## How to try it

http://localhost:3000/engine. Click **Load model** (nothing downloads on mount), then **Generate**. No `OPENROUTER_API_KEY` is needed: everything runs in the browser. There is no `nextjs/.env.local` yet, and that doesn't matter here.

Checked on 2026-10-19: `/engine` returns 200 on the running dev server.

## Measurements (as the thread recorded them)

Headed Chrome 155 on Marlon's Mac, q8 weights, prompt `Who are you?\n` (5 tokens), temperature 0.8, top-k 20, 64 new tokens. Times include prefill, decoding, distribution calculation, and worker messaging; they exclude downloading. The README says these are single observations in a shared dev session, not benchmarks.

| Model | Model weights | Total assets loaded (model, tokenizer, config) | WebGPU tokens/s | WASM tokens/s |
| --- | ---: | ---: | ---: | ---: |
| `Xenova/gpt2` | 128,315,766 bytes | 130,424,661 bytes (130.42 MB) | 9.97 first run, 10.80 warm | 23.67 |
| `onnx-community/SmolLM2-135M-ONNX` (base) | 137,970,292 bytes | 140,028,656 bytes (140.03 MB) | 8.03 first run, 7.75 warm (8.43 on one rerun) | 23.11 |

The totals exclude the JS worker and the ONNX runtime. SmolLM2's q8 is a 1,252,724-byte graph plus a 136,717,568-byte external data file; both are counted. The totals count the bytes loaded, including cache reads, so they are not a claim about network transfer on a repeat load. WASM was about twice as fast as WebGPU on this Mac for both models. No download size was recorded for the Instruct model, which the thread loaded for the template test.

## Commits

- `1bcbae6` "Build shared browser language-model engine and test bench" (authored mkuzmick, 2026-10-19 14:49 -04:00; not pushed). Nine files: the eight under `nextjs/lib/browser-lm/` and the two under `nextjs/app/engine/` (listed above).

Checked on 2026-10-19: `git status` shows nothing uncommitted under these paths. The thread changed no shared files (no `package.json`, `globals.css`, or the experiment documents).

## What I couldn't do or didn't check

- Only GPT-2 and SmolLM2-135M (base and Instruct) were run. Gemma 3 270M pt (which C wants), Gemma 3 270M it, Qwen3-0.6B, and the other q4/fp16 dtype options in the picker were not run. Having ONNX files on Hugging Face doesn't guarantee that every dtype and device combination works.
- WebGPU fallback was tested only by making the test worker report no GPU adapter. A real WebGPU initialization error was not induced; that path is implemented but unexercised.
- No production build was run (to avoid disturbing the dev server's `.next`).
- Only Chrome was used. Safari and Firefox were not tried.
- The test page was inspected visually via a screenshot at `/private/tmp/browser-lm-engine.png`, which is outside the repo.
- Nothing was said about offline use. Checked on 2026-10-19 in the transcript: the library fetches its ONNX runtime from `cdn.jsdelivr.net` by default, and the worker sets no local `wasmPaths`, so a first load needs internet access even though the model files are cached afterward. This matters for classroom wifi.
- The WASM backend is pinned to one thread (`numThreads = 1`, no proxy) in `worker.js`.

## For other tasks

- **C (spiral room):** use raw mode: `generate({ prompt, temperature, topK, maxNewTokens, stopStrings, neverStop }, onStep)`. `step.candidates` is ready to draw as bars. Use the cumulative `step.text`, not concatenated `tokenText` (partial UTF-8 bytes can show a replacement character). The "never stops" indicator should read `finishReason` (`eos`, `stop`, `length`, `context`, `abort`). With the Instruct model and greedy decoding, never-stop ran past `<|im_end|>` and started writing another user turn. That is the spiral effect, and it was observed. Mounting a hook doesn't download; call `load()` from a user action. Gemma 3 270M pt is untested, so test it before promising it in the picker. Expect the default "auto" device to be slower than WASM on this Mac, so consider exposing a device choice.
- **D (by hand):** columns 1 to 3 each need an independent hook (one worker and one model each; separate workers share cached assets but not memory). Loads and generations on one worker are serial, so await one before sending another. Column 2's preamble goes as raw `prompt` text; for "let it write both sides", leave off the `\nHuman:` stop string. Column 3 sends `messages` to the Instruct model, and `lm.applyChatTemplate(messages)` or `lm.templatedPrompt` gives the exact string to display. Special tokens are intact, and tokenizing uses `add_special_tokens: false`, so BOS/EOS aren't duplicated.
- **M (story):** a small live base-model spiral can embed the hook; same load-on-click rule.

## Marlon's words

- 18:38:16 UTC, the task prompt: "Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, README.md, nextjs/CLAUDE.md, and _context/orchestration.md … then do task A: the browser language-model engine in nextjs/lib/browser-lm/." (The remaining task text restated the board.)
- 18:58:19 UTC: "are you still working?" The thread answered that it was finished.

## Decisions and open questions

- The GPT-2 q8 graph lives under a legacy filename in its repo (`decoder_model_merged_quantized.onnx`); the library's default `model_quantized.onnx` doesn't exist there. The worker special-cases `Xenova/gpt2` with q8 (`model_file_name: "decoder_model_merged"`). Any other GPT-2-family id needs the same check.
- No silent dtype substitution: a requested dtype that the repo lacks fails loudly. The default is q8 so the assets are the same on both devices.
- The probabilities reported are those of the support the sampler actually draws from (top-k, after temperature), with the whole-vocabulary figures kept beside them. Revisit if a page wants raw model probabilities at temperature 1 with no top-k: use `topK: 0` and `vocabularyProbability`, but messages get large.
- Open for Marlon: whether `/engine` stays (the brief says it is removable); whether the default device should be WASM given the measurements; and the larger-model question (Qwen3-0.6B and the like) was left untested.
- Thread's own remaining item: broader models and dtypes need testing (stated in the README's open questions).
