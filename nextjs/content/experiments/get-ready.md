---
title: Get ready for the workshop
description: "Download the classroom’s browser models, check their cache, and choose a device before the session starts."
route: /get-ready
status: working
group: Today
group: "Today"
order: 1
---

## What this prepares

GPT-2 small, SmolLM2-135M base, SmolLM2-135M Instruct, and the MiniLM sentence embedder: about 435 MB of model files, plus application code and runtime. These are the defaults used by [GPT-2](/gpt-2), [By hand](/by-hand), and [retrieval](/retrieval). Optional larger models are not downloaded.

## How to use it

Press **Download models and check speed** before class, ideally before everyone shares the same wifi. Nothing downloads automatically. The page loads each model through the same workers the experiments use, then releases that worker before loading the next. Each checked model gets a tick only when its weights are also found in the shared browser cache. A partial or failed download does not count as ready. Retry preparation after fixing a connection or storage problem; completed cached files are reused. **Stop preparation** terminates the active worker and leaves completed cached files intact.

After all four models are checked, GPT-2 runs a short generation on WASM and on WebGPU if an adapter is available. Four warmup tokens precede a timed 32-token continuation. The faster device is recommended, with WASM chosen if the scores are within 10%. Failure of one backend is reported and the other may still be recommended. The choice is saved in local storage and restored by the GPT-2 and By hand device selectors. Students can override those selectors.

**You’re ready** means all four models loaded, their weights were found in the cache, and a speed check finished. It does not mean the entire site works offline: page code and the ONNX runtime may still need internet. Use the same browser, site address, and port in class. Browser storage can be cleared or evicted; reopening this page checks again rather than trusting an old readiness tick.

## What still needs a key

Browser preparation, GPT-2 generation, and embeddings need no API key. Claude answers use the server’s configured key and credit. This page makes no paid calls and does not check that key. If downloading fails, GPT-2’s recorded runs remain an option without downloading a model.

## Tested on October 20

In Chromium on the workshop Mac, all four models loaded and their weights were confirmed in the shared cache. The first speed check measured 14.7 tokens/s on WASM and 8.9 on WebGPU, recommending WASM. A repeat preparation made no requests for ONNX weight files; worker initialization and speed testing still took time (93 seconds for that repeat on the shared development setup). These timings are observations, not promises for another laptop or the classroom network. The page was also inspected at desktop width and 390 pixels, with no horizontal overflow at 390 pixels.

## Limits and open questions

- Sizes are approximate, not promised transfer totals. Runtime and app downloads add to them.
- The speed check uses one short GPT-2 prompt. It does not predict the cost of a long By hand preamble or every model’s fastest backend.
- A room of students downloading simultaneously and browsers beyond Chromium need testing.

## How this was made

Codex, October 20, 2026, task AE. Thread `01a158f2-d011-7c53-a5de-f43a5bfa592b`, started in `/Users/mk/Development/mk-27/apps/the-notebook`. Marlon requested the GPT-2 rename first, followed by this optional preparation page. The rename was committed separately as `e822a2e`. The page reuses the existing language-model and embedding workers; an additive helper stores the device preference. Classroom-scale and cross-browser testing are unfinished.
