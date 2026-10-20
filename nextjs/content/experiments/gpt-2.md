---
title: "GPT-2, before the assistant"
description: "You type; GPT-2 continues the document instead of answering."
route: /gpt-2
status: working
group: "Before the assistant"
order: 3
---

## What it shows

A base model has only been trained to continue text. Ask it a question and it may continue with five more questions, a forum signature, a recipe, or a copyright notice. There is no one answering yet.

## What's built

GPT-2 small (OpenAI, 2019; 124M parameters; trained on WebText, pages linked from Reddit) runs in the browser with transformers.js, through the shared engine in `lib/browser-lm/`. Nothing is installed and nothing typed leaves the laptop.

- **Loading.** Nothing downloads until you click **Download GPT-2 (130 MB)**. The panel says the size first, shows progress, speed and time left, and says so if the model is already cached. If the download is slow (over 20 seconds with more than a minute to go) it says so and offers the recorded runs. If it fails, it says why and offers to try again or watch the recorded runs.
- **The text.** A plain text box, no chat bubbles. **Continue the text** (or ⌘↩) and the model writes after your words, in a different color, token by token. **Stop** halts it. Afterwards: **Keep going** (continue from the end), **Run again**, **Edit the text**, **Start over**.
- **Starters:** a question ("What is the capital of France?"), "Who are you?", the start of a forum post, and the start of a letter. Once the model is loaded, clicking a starter runs it.
- **The meter** counts tokens and marks the first line break, where an answer could have ended ("answer could have ended here" in the text), then counts how far past it the model went. The model's end-of-text token is ignored by default, so it shows as a marked "end of text" and the model starts a new document.
- **The controls:** temperature, top-k, length, and the end-of-text switch, with three presets: **Default** (0.9, top-k 40), **Greedy** (temperature 0, which makes GPT-2 loop: "I'm a man. I'm a man. …"), and **Hot** (1.6, top-k 100).
- **The odds:** the ten likeliest next tokens with bars, and the one picked highlighted. Click any word in the output to pin its odds.
- **Recorded runs:** a tab that replays six recorded GPT-2 takes (the four starters at the defaults, and two at temperature 0), labeled as recorded with the date and settings, odds included. They need no download. Recorded with `app/gpt-2/tools/record.mjs`.
- **Other models:** SmolLM2-135M base (2024, 140 MB) and Gemma 3 270M pt (440 MB, about a quarter of the speed). Both run, but they are extras: GPT-2 is the one for class.
- **Device:** CPU (WASM) by default, GPU (WebGPU) as an option. On Marlon's M3, WASM was about twice as fast (23 tokens/s against 10–11).

## Tested on 2026-10-20

On Marlon's Mac against the dev server, with `app/gpt-2/tools/browser-test.mjs`:

- A cold download moved 135 MB (128 MB of weights from Hugging Face's CDN, 5.6 MB of ONNX runtime from jsdelivr) in 8 seconds on this Mac's connection (whatever network it was on that morning). A warm reload took 1.3 seconds. A room of twenty on one access point will be much slower; the page shows the time left.
- Every starter at the defaults: 150 tokens in about 6.5 seconds (18–24 tokens/s on WASM), first token in under a quarter of a second. Each one runs past its first line break and keeps going.
- Stop takes effect within a tenth of a second. Recorded runs, a blocked download, and a slow download behave as described above. No horizontal scrolling at 1024 pixels.
- Only Chrome and Chromium were tried, not Safari or Firefox.

## A discussion prompt

Modern base models were pretrained on an internet already full of chatbot transcripts, so asking one "who are you?" may get a claim to be ChatGPT (verify: in two tries with SmolLM2-135M base on 2026-10-20, it didn't happen). GPT-2 gives the pure spiral; a recent base model may show the assistant persona leaking back into the text it learns from.

## Open questions

- The first load needs internet access for the ONNX runtime (jsdelivr) as well as the weights; it is not offline-capable.
- Should the page pre-load GPT-2 on a "get ready" page before class, so the room downloads in a staggered way?
