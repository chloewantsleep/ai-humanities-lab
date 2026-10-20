---
task: "C. The spiral room"
thread_id: "5bf7a8c6-9ba2-484d-a582-a59d83cc1356"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 5bf7a8c6-9ba2-484d-a582-a59d83cc1356"
ran: "about 10:40–11:20 UTC, 2026-10-20"
status: "done: working and tested for today's class (MVP)"
---

# Task C: the spiral room

## What I built

`/spiral`: GPT-2 small running in the browser (through A's engine, `lib/browser-lm/`), with no chat interface. Students type, or pick a starter, and watch GPT-2 continue the document instead of answering.

Files, all in `nextjs/app/spiral/` except the document:

- `page.jsx`: the route, in the shared `ExperimentPage` frame.
- `SpiralRoom.jsx`: the client component. It has:
  - a load panel that states the download (130 MB, cached afterwards, nothing typed leaves the laptop) before anything downloads, and shows progress, MB/s and time left;
  - a slow-download warning (after 20 s with more than a minute to go) and a failed-download message, both linking to the recorded runs;
  - a plain text box; output in a different color, token by token; **Stop**, then **Keep going** / **Run again** / **Edit the text** / **Start over**; four starters;
  - the meter: a token count, and an "answer could have ended here" mark at the first line break, with how far past it the model went. End-of-text is ignored by default and shown as a marked "end of text";
  - temperature, top-k, and length sliders, the end-of-text switch, and presets (Default 0.9/40, Greedy 0, Hot 1.6/100);
  - the top ten next-token odds with bars. Click any token in the output to pin its odds;
  - a model picker (GPT-2 default; SmolLM2-135M base and Gemma 3 270M pt as extras) and a device choice (CPU/WASM default, WebGPU option);
  - a **Recorded runs** tab.
- `spiral.css`: the route's styles (no change to `globals.css`).
- `starters.mjs`: the starter prompts and defaults, shared with the recorder.
- `pieces.mjs`: splits cumulative engine text into per-token pieces (handling partial UTF-8 bytes), and finds the first line break. `pieces.test.mjs` has three `node:test` checks; all pass when run directly (`node --test app/spiral/pieces.test.mjs`). They aren't in `pnpm test` (see R below).
- `recorded.json` (186 KB): six GPT-2 takes with the top-8 odds at every step. They are the four starters at the defaults, plus "Who are you?" and the question at temperature 0. Each is the first take, not cherry-picked. They were recorded 2026-10-20 in Node with the same transformers.js 4.3.1, the same q8 weights, and the engine's own `sampling.js`, and the page labels them that way.
- `tools/record.mjs`: re-records `recorded.json` (`cd nextjs && node app/spiral/tools/record.mjs`; set `HF_CACHE_DIR` to keep the weights out of `node_modules`).
- `tools/browser-test.mjs`: the classroom check in Playwright. It runs:
  - a cold download, every starter, greedy, Stop, Keep going, pinning, and a warm reload;
  - recorded mode at 1024px;
  - a blocked download and a slow download.

  Playwright isn't an app dependency, so run it from a folder that has it installed (instructions at the top of the file).
- `nextjs/content/experiments/spiral.md`: `status: working`. "What to build" became "What's built", plus "Tested on 2026-10-20" and open questions.

## How to try it

http://localhost:3000/spiral. Click **Download GPT-2 (130 MB)**, then a starter: **Who are you?** is the clearest. Then press **Greedy** and run it again to see the loop ("I'm a man." over and over). Click any word in the output to see its odds. If the wifi fails, use the **Recorded runs** tab.

## What students will see (tested 2026-10-20)

All on Marlon's M3 against the shared dev server. Headless Chromium 1208 (Playwright 1.58.2) unless noted; WASM unless noted.

| | Result |
|---|---|
| Cold download (fresh browser context) | 134.6–134.9 MB transferred: 128.4 MB weights from `us.aws.cdn.hf.co`, 0.6 MB config/tokenizer from `huggingface.co`, 5.6 MB ONNX runtime from `cdn.jsdelivr.net`, 1.3 MB app. Click to ready: 7.9 s and 8.4 s on two runs, on whatever network this Mac was on. A room downloading at once will be far slower; the panel shows the time left. |
| Warm reload (same browser) | 1.3 s; the panel says GPT-2 is already cached. |
| Each starter, defaults (0.9, top-k 40, 150 tokens) | 6.4–7.9 s for 150 tokens, 18–24 tokens/s, first token in 70–260 ms. Every run reached the 150-token limit ("It never chose to stop") and ran 38–144 tokens past its first line break. |
| Greedy | Deterministic loops: "I'm a man." ×n for "Who are you?", "The capital of France is the capital of France." ×n for the question. |
| Stop | Takes effect at the next token (117 ms and about 1 s from click to the "You stopped it" message in two runs). |
| Keep going | Continued from a 333–447-character document to the length limit. |
| Recorded tab, 1024px | Replays at 20 tokens/s with the odds, labeled "Recorded, not live" with source, date and settings. No horizontal scroll at 1024px (checked on the first visit and in recorded mode). Switching modes mid-replay clears the page. Stop works on a replay. |
| Hugging Face blocked | "The model didn't load: Failed to fetch. Check the wifi and try again, or watch recorded runs." |
| Model file held back 40 s | At 20 s: "2 MB of about 130 MB · 0.1 MB/s · about 1214 s to go", plus the slow warning and the link to the recorded runs. |
| WebGPU (headed Chrome, device "GPU if available") | Loads (9 s cold); 9.5–11.1 tokens/s, so about half WASM's speed. That's why the page defaults to CPU (WASM). |
| SmolLM2-135M base (WASM) | 7.9 s load, 22–23 tokens/s; spirals too (a phone-call script; a contact form, then end-of-text and a 2009 BBC radio listing). It did **not** claim to be ChatGPT in two tries. |
| Gemma 3 270M pt (WASM) | 437 MB q8; 30 s cold load; 6.1–6.7 tokens/s (about 24 s per 150 tokens). Spirals and repeats ("Is Paris the capital of France?" ×n). Labeled "try it at home, not on classroom wifi." |

Sample live outputs (cold, defaults), to show what the starters do:
- "What is the capital of France?": "The capital of France / In French, when I am not around, I am just saying, 'We're all French.' But, in the U.S. we're all French. …"
- "Who are you?": "Acknowledge my work. Speak with words—be the person who says that. / I am sure you understand and respect his words. …"

In an earlier Node trial, the question drifted into new quiz questions ("What the capital of the United States is? / The capital of France is the city of New York."). That's the best illustration of the spiral, but sampling varies.

## Commits

- `cafa2e6` "Spiral room (task C): …": everything in `nextjs/app/spiral/`, the experiment document, and this report (authored mkuzmick; not pushed).
- The follow-up commit that adds this hash to the report.

## What I couldn't do or didn't check

- **Safari and Firefox** were not tried. Only Chromium and Chrome were.
- **A room of laptops** was not simulated beyond the held-back-file test. The CDN speed seen here (about 16 MB/s) says nothing about twenty students on one access point.
- **Offline:** the first load also needs `cdn.jsdelivr.net` for the ONNX runtime (A's note). If the room blocks it, the live mode fails with a fetch error and the recorded runs still work.
- **The hydration warning:** in the second full test run, React logged a mismatch on the range inputs' `style={{caret-color: transparent}}`. Playwright injects that style when it takes a screenshot before hydration finishes, so it's a test artifact rather than a page bug; the first full run had no console errors. Not checked in a plain browser by hand.
- **Another agent's engine changes:** the engine files in `lib/browser-lm/` (worker, client, hook, README) had uncommitted changes from another agent (D, by the look of them: a `count` command and `contextLimit` on load) during my second and third test runs. The changes are additive, and the spiral page uses none of them. I didn't touch or commit them.
- I didn't run `pnpm test` or a production build (the dev server shares `.next/`).

## For other tasks

- **R (cleanup/tests):** `nextjs/app/spiral/pieces.test.mjs` (three checks) could join `pnpm test`; the script globs only `tests/*.test.mjs`. I left `package.json` alone.
- **V (session path and QA):** the classroom script: download first (or have students start it while you talk), then **Who are you?**, then **Greedy**. Fall back to the **Recorded runs** tab if the download stalls. `tools/browser-test.mjs` is a ready QA pass: `node …/browser-test.mjs http://localhost:3000 <out-dir>` from a folder with Playwright, about 3 minutes. Note that the dev server was on :3017 from 06:46 until it went down at about 10:50, and Marlon's restarted one is on :3000.
- **D (by hand):** the engine's default device "auto" picks WebGPU, which ran at half the speed of WASM on Marlon's M3. The spiral page passes `device: "wasm"` explicitly. `pieces.mjs`'s `addPiece` is reusable if D needs per-token spans.
- **A / the engine:** GPT-2, SmolLM2-135M base, and Gemma 3 270M pt (q8; `model_quantized.onnx`, 437 MB) all load and run on WASM, and GPT-2 on WebGPU in headed Chrome. Gemma had been untested before this.
- **M (story):** `recorded.json` holds six real GPT-2 takes with per-token odds, usable for a no-download embed.
- **Orchestrator:** the board says the dev server is on :3000. It was on :3017 at the start of this thread, then down, then back on :3000.

## Marlon's words

- The task prompt: "Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/C-spiral.md, including its "For today's workshop" section. This is for today's class: make it work and test it well. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9)."
- Mid-thread, after I said the server was down: "server is running"

## Decisions and open questions

- **WASM by default**, with WebGPU offered. This choice is the page's own, made on the measurements above; the engine's default is unchanged.
- **End-of-text ignored by default**, because the page is about the model not stopping. The switch turns it back on.
- **The "answer could have ended here" mark** is a heuristic: the first line break after the continuation has said something. It's labeled as a point where an answer *could* have ended, not a claim about the model.
- **The recorded runs come from Node, not a browser.** They use the same library, weights and sampling code; the label says so.
- **The page's facts**, checked 2026-10-20:
  - GPT-2 small: 124M parameters, WebText (pages from outbound Reddit links with at least 3 karma), 1,024-token window, 2019. Checked against the Hugging Face model card (`openai-community/gpt2`).
  - The *Frankenstein* quotation, "a small and almost imperceptible chink": checked in the course text in `public/retrieval/frankenstein.json`.
  - SmolLM2 "2024" and Gemma 3 270M "2025": checked against Hugging Face's model API (`HuggingFaceTB/SmolLM2-135M` created 2024-10-31, `google/gemma-3-270m` created 2025-08-05).
- **Open, for Marlon:**
  - Should there be a "get ready" page that preloads GPT-2 before class, so the room's downloads are staggered?
  - Should the discussion prompt about modern base models claiming to be ChatGPT stay? SmolLM2 didn't do it in two tries.
