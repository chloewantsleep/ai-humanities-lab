---
task: "AE"
thread_id: "01a158f2-d011-7c53-a5de-f43a5bfa592b"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158f2-d011-7c53-a5de-f43a5bfa592b"
status: "done: rename committed first; get-ready working and tested with real browser models"
date: 2026-10-20
---

## What I built

**The rename was completed and committed before building `/get-ready`.** `nextjs/app/spiral/` moved with `git mv` to `nextjs/app/gpt-2/`, and `nextjs/content/experiments/spiral.md` moved to `gpt-2.md`. The title and browser metadata are **GPT-2, before the assistant**, and the description says: “You type; GPT-2 continues the document instead of answering.” The former component name, stylesheet names, CSS classes, test IDs, and recorded-data format remain internal implementation names. Recorded data and generation behavior were preserved. The recorder and classroom browser script now point to the new directory/route.

`nextjs/app/spiral/page.jsx` and `nextjs/app/experiments/spiral/page.jsx` use Next 16's `permanentRedirect` from `next/navigation` to send both old addresses directly to `/gpt-2`. Both returned HTTP 308 in browser/API checks. Next's installed redirecting documentation was read first. There was no shared `next.config.mjs` change or server restart for the redirects.

Links and labels in `nextjs/app/` and `nextjs/content/` were updated, including the fine-tune document's relative `spiral.md` link, the story link, glossary entries, and the content print set. I left `nextjs/content/workshop/README.md` to AD, as directed. Historical task briefs and reports were preserved. `nextjs/tests/content.test.mjs` needed a one-character-class expansion from `[a-z-]` to `[a-z0-9-]`, because its old route validator rejected the requested `/gpt-2` spelling. The tests passed after that correction.

**`/get-ready`** is a working preparation page. Its document is `nextjs/content/experiments/get-ready.md`, with `status: working`, `group: Today`, and `order: 0`. New route files are:

- `nextjs/app/get-ready/page.jsx`, `GetReady.jsx`, and `get-ready.css`: the shared experiment frame, model cards with estimated sizes and progress, Stop/retry, speed results, saved choice, final readiness state, and links to the experiments.
- `nextjs/app/get-ready/preparation.mjs`: the four-model manifest, exact quantized-weight cache checks, sequential preparation logic, and device recommendation.
- `nextjs/app/get-ready/loaders.js`: uses the existing `BrowserLM` client and the existing retrieval embedding worker. Workers are disposed one at a time, so the preload does not keep all models in memory. Download/check operations time out after five minutes; each device benchmark has a 45-second timeout. Stop terminates the active worker.
- `nextjs/app/get-ready/preparation.test.mjs`: six tests for serial work, individual failure, cancellation, cache verification, device comparison, and storage restrictions.
- `nextjs/app/get-ready/tools/browser-check.mjs`: a standalone Playwright check for permanent redirects, blocked downloads, and cancellation. Run from a directory with Playwright installed; an optional `PLAYWRIGHT_EXECUTABLE_PATH` selects an existing Chromium binary. No test dependency was added.

Models: `Xenova/gpt2`, `onnx-community/SmolLM2-135M-ONNX`, `onnx-community/SmolLM2-135M-Instruct-ONNX`, and the retrieval core's `MODEL` (`Xenova/all-MiniLM-L6-v2`). All use the same q8 files and `transformers-cache` as the experiment pages. Model sizes are estimates, about 435 MB total, plus runtime and app code. Nothing downloads until the student clicks. MiniLM is checked by embedding a sentence and confirming its 384 dimensions.

The benchmark warms GPT-2 with four tokens, then measures a 32-token continuation on WASM and, if an adapter exists, WebGPU. WASM wins results within 10%. A failed backend is reported; a working other backend can still provide a recommendation. The final ready state requires four successful loads, four confirmed cached weight files, and a usable benchmark result. Seeing cached weights on a later visit is only a hint, not a restored readiness tick.

**Small shared additions:** `nextjs/lib/browser-lm/device-preference.mjs` is an additive helper for validated, storage-safe reads/writes of `workshop-browser-device-v1`. `/gpt-2/SpiralRoom.jsx` and `/by-hand/ByHandLab.jsx` each gained only an import and an effect to restore the preference into their existing device selectors. Without a preference, their previous defaults remain WASM and auto, respectively. Manual selector choices remain available. Existing language-model loaders, hook, worker, and retrieval library were not changed.

## How to try it

http://localhost:3000/get-ready

Click **Download models and check speed** before class. Watch each model's progress and **✓ Cached and checked** label. Once the speed checks finish, the page shows **✓ You’re ready**, its recommendation, and whether saving succeeded. Continue to GPT-2, By hand, or retrieval in the same browser and at the same site address/port.

**Stop preparation** cancels the active worker. **Download models and check speed** retries after a stopped/failed run, reusing completed cached files. **Check again** reruns preparation after a successful run. Browser initialization and speed checks still take time even with cached weights.

http://localhost:3000/gpt-2

The existing GPT-2 experiment, under its new name. Its **Recorded runs** option remains available when downloading is impractical. `/spiral` and `/experiments/spiral` redirect here permanently.

## Commits

- `e822a2e` — Rename the spiral experiment to GPT-2 before the assistant. Committed before any get-ready implementation.
- `4704a0b` — Prepare classroom browser models and remember measured device choice. Includes the preparation page, experiment document, helper, two selector integrations, and tests.

This report is committed separately by its own path. All commits are authored as mkuzmick with the configured noreply email. No push, deployment, or Notebook submodule-pointer change was made.

## What I couldn't do or didn't check

**Passed:** the rename-stage `pnpm test` passed 42 tests. After implementing get-ready, the shared `pnpm test` command passed all 62 tests present then, including the six new readiness tests. AF changed test discovery during this session; I did not edit `package.json`. `git diff --check` passed for the task paths. Existing GPT-2 pieces tests also passed after moving them.

**Real browser preparation:** Chromium loaded all four models, confirmed all four weight files in `transformers-cache`, ran CPU and GPU generation, and reached the final ready state. The first benchmark measured WASM **14.7 tokens/s**, WebGPU **8.9 tokens/s**, saving `wasm`. A repeat measured **20.5** and **11.1 tokens/s**, again choosing WASM. These are observations on this Mac, not predictions for other machines. The warm repeat made **zero ONNX weight-file requests**, but the complete check still took **93,040 ms**, including initialization and both device tests. A page with cached weights is not instantaneously ready to infer.

**Reuse by the experiment pages:** in that same browser context, `/by-hand` restored WASM and loaded all three browser-model workers; `/retrieval` completed a semantic search; `/gpt-2` restored WASM and loaded GPT-2. A request observer counted **zero ONNX weight-file requests across those three pages**. This verifies that preparation filled the cache the pages consume, rather than a separate cache. No Claude answer buttons were pressed and no paid model calls were made for AE.

**Failure and cancellation:** the standalone browser check passed against the shared server. In a fresh context with ONNX requests blocked, all four cards showed failures and the page never said ready. In another fresh context, Stop interrupted the active model, left later models unmarked, and enabled retry. Both legacy URLs returned 308 to `/gpt-2`. Early test attempts hit 30-second navigation timeouts on the shared server; the final check uses 120 seconds for page navigation and passed. The existing Playwright installation's default headless binary was missing, so the check used the existing Chromium executable named in the brief, without installing anything.

**Visual QA:** desktop and 390×844 screenshots were inspected; the narrow layout has no horizontal overflow. Captures are local and gitignored: `nextjs/output/playwright/get-ready-cold.png`, `get-ready-warm.png`, and `get-ready-mobile.png`. The screenshots were taken before the experiment document changed from building to working; the route now has working status.

Not checked: Safari, Firefox, the slowest student laptop, a full classroom downloading at once, performance with long preambles, model cache eviction during an active session, or a production build. No second dev server was started. A production build was avoided while Marlon's shared dev server used the same `.next` directory. This is preparation for the browser models, not an offline installation; runtime/page resources can still need internet. The optional Gemma model is intentionally not preloaded.

## For other tasks

- **AD:** `/gpt-2` is canonical, and `/get-ready` is working with `group: Today`, order 0. I left your workshop README untouched; please link to these routes in the current setup/path structure. Internal `spiral` identifiers and old historical reports are deliberately preserved.
- **AF:** the route validator accepts digits now. Your expanded test glob discovered the six readiness checks; the package script was not changed by AE.
- **C / V:** the original GPT-2 interaction and recorded runs moved intact. Tools now live under `app/gpt-2/tools/`. Both old addresses redirect. The recorded-run/data/test IDs still say spiral internally to avoid unnecessary risk.
- **D:** the only AE change to `ByHandLab.jsx` is a device-preference import and a mount effect. I waited for your preamble/presenter changes to be committed before applying/committing those two lines, so none of your pending edits rode along. The short GPT-2 benchmark does not predict the fastest device for the HHH prompt; the page says so, and students can override the selector.
- **T / AH:** no retrieval library was changed. The existing embedding worker loads the same MiniLM files as `/retrieval`; an embedding search after preparation made no new ONNX requests.
- **AG:** no deploy/config/environment change, paid call, or key inspection. Downloads come from the same existing Hugging Face and runtime paths as the experiments. The browser cache and saved preference are origin-specific, so localhost and the deployed address must prepare separately.
- **Orchestrator:** update the board from this file. Both required implementation stages are committed; full classroom and cross-browser testing remain open.

## Marlon's words

The direct instruction for AE:

> Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/AE-gpt-2-rename-and-get-ready.md. Do the rename first and commit it, then build /get-ready. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9).

This thread previously completed Y; those earlier instructions and Marlon's server update are preserved in `Y-knowledge-voice.md`. The rename rationale and “sure as an option” language came from the AE brief, not additional direct user messages in this task.

## Decisions and open questions

Use route-local permanent redirects rather than modifying shared Next configuration. Keep the proven interaction's internal names, recorded data, and sampling behavior. Load/cache/check one model at a time, dispose it, then move on. A model being loadable without persistence is reported as uncached rather than ready. The readiness state is recomputed each visit; only the validated device choice persists.

The quick benchmark measures short GPT-2 decoding, excludes weight download time, and includes a warmup. It does not measure long-prompt ingestion or choose the fastest backend for every model. A room-scale test, cross-browser checks, and a shorter warm verification path could be useful follow-ups; no broader performance claim is made.

Resume from `/Users/mk/Development/mk-27/apps/the-notebook` with `codex resume 01a158f2-d011-7c53-a5de-f43a5bfa592b`. Work for this task is in its nested `apps/mk-chatbot-experiments/` repository.
