---
task: "D. Building the assistant by hand"
thread_id: "343f149d-375d-4122-9df1-e541550238b6"
agent: "Claude Code (Fable 5.1)"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 343f149d-375d-4122-9df1-e541550238b6  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "about 10:55–12:05 UTC (6:55–8:05 a.m. EDT), 2026-10-20; resumed 12:05–12:30 UTC for the toggle and the layout fix"
status: "done, with the 12:30 UTC update (presenter toggle, default the 2,000-token cap; no sideways scroll at any width); tested in a headless Chromium on the shared dev server, with the key; not yet tried in Marlon's own Chrome"
---

# Task D: building the assistant by hand (`/by-hand`)

**Short answer:** `/by-hand` works. One question box sends to four columns: SmolLM2-135M raw, the same base model behind the exact HHH prompt from Askell et al. 2021 (or a sardonic assistant, a medieval monk, or an edit), SmolLM2-135M-Instruct with its chat template shown, and Claude through `/api/chat`. GPT-2 is available in columns 1 and 2; when the prompt doesn't fit, the page keeps the introduction and the last exchanges that do, and says what it cut and why. All of it ran in a browser on Marlon's dev server, cold and warm, with Claude answering live. The catch for class is time: with the whole 6,500-token prompt, column 2 answers about 40 s after the others on WebGPU, and would take 15 minutes on a machine without WebGPU, so the page caps the preamble there and offers a cap everywhere.

## Update, 12:30 UTC: the presenter toggle and the layout fix

Two follow-ups from the orchestrator (quoted under Marlon's words).

**The toggle.** Column 2's "Use at most" menu is gone. In its place, under the preset, a two-way choice titled "How much of the preamble to send": **The last 2,000 tokens** ("The introduction and the final conversations. First token in about 15 s on WebGPU. The default, for speed.") and **The whole prompt** ("All 6,500 tokens, faithful to the paper. The model reads it all before its first token: about 40 s on WebGPU. On the CPU path (WASM) the page caps it at 800 tokens, about half a minute, because the whole prompt took 15 minutes there."). The default is the cap. Both go through the same planner, so the note under the output still says what was kept and cut; with the cap it reads "Kept the introduction, conversations 12 to 14 whole and the last 4 of conversation 11's 11 exchanges: the last 14 of 57 exchanges, 1,753 tokens with the question. Cut conversations 1 to 10 and the start of conversation 11, about 4,768 tokens, because the preamble is capped at 2,000 tokens here…". The "whole prompt even on the CPU path" override is gone with the menu; on WASM the whole-prompt choice is capped at 800 and the note says so.

**The layout.** The review's diagnosis was right: `.bh-col` was a grid with one `auto` track, which grew to the preset select's intrinsic width. When I came back, the brief's suggested fix was already in the working tree, uncommitted (the `minmax(0, 1fr)` track, selects at `width: 100%; max-width: 100%`, `minmax(0, 1fr)` in the 700 px query, and the page title set to "Building the assistant by hand"); I kept it and added, in `by-hand.css`: `.bh-col > * { min-width: 0; max-width: 100% }`, `overflow-wrap: anywhere` on the column's headings, blurbs, stats and notes, `.bh-lab select { max-width: 100%; min-width: 0 }`, the toggle's styles (`.bh-toggle`), a 240 px flex basis for the question box, and under 700 px the question box and "Ask all four" at full width. The model selects' option labels are shorter ("SmolLM2-135M: base, 135M, 8,192-token window"). I did not touch `/gpt-2` or `ChatShell`.

**Re-checked in the headless Chromium**, empty and after a run, measuring the document's scroll width against the viewport and every element's right edge against its column's:

| Viewport | Columns | Sideways scroll | Spill out of a column |
| --- | --- | --- | --- |
| 1440 | 4 × 319 px | none | 0 px |
| 1280 | 4 × 282 px | none | 0 px |
| 1024 | 2 × 463 px | none | 0 px |
| 390 (phone) | 1 × 354 px | none | 0 px |
| 1152 (1440 at 125 % zoom) | 2 × 522 px | none | 0 px |
| 960 (1440 at 150 % zoom) | 2 × 434 px | none | 0 px |

The zoom rows are viewport-width equivalents (browser zoom shrinks the CSS viewport the same way). Tab title: "Building the assistant by hand · Chatbot Experiments". Console: 0 errors, 0 warnings.

**Re-tested both toggle states, "Ask all four", WebGPU, warm cache:** with the default (the last 2,000 tokens) column 2 sent 1,753 tokens, first token after 21.0 s, done in 24.1 s (the machine was busier than in the morning, when the same cap gave 13.3 s; the other columns were slower too). With the whole prompt (rerun at 12:21 UTC): 6,534 tokens, first token after 72.2 s, done in 80.7 s, "That's just a quote from the screen."; the cap in the same rerun: 21.1 s to the first token, done in 29.0 s. On the quiet machine this morning the same two were 40 s and 13 s, so the labels now say "15 to 20 s" and "40 s or more". The first whole-prompt run came back with every column empty and "Not loaded" after 30 s: the page had fully reloaded mid-run, which happens when another agent's edit makes the dev server reload (several were committing at the time), so I reran it.

## What I built

All under `nextjs/` in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`.

- **`app/by-hand/hhh-prompt.txt`**: the paper's prompt, byte for byte, under a five-line `# ` header that names the source, the fetch date, and how it was verified. Source: the gist the paper's footnote 2 points to, https://gist.github.com/jareddk/2509330f8ef3d787fc5aaac67aab5f11 (file `HHH_prompt.txt`), fetched 2026-10-20 from the raw URL pinned to the gist's current revision. Verification: (1) the ar5iv HTML of arXiv 2112.00861 contains that gist URL in footnote 2 ("Prompt text and contractor instructions are at…"); (2) cloning the gist shows `HHH_prompt.txt` was added in one revision, 747dfea, by Jared Kaplan on 2021-11-29, two days before the paper's arXiv date, and never changed (the gist's only later revision, the same day, added `contractor_instructions.html`); (3) the paper's section 2 calls it "a long prompt (4600 words from 14 fictional conversations)" and the file has 4,622 words and 14 conversations between its `-----` separators, 57 `Human:` turns and 55 `Assistant:` turns; (4) SHA-256 of the body after the header is `51dd74e1c2ba9bc14173b20db4d9c3a6b6196b0c477da11811dd42cfe585cfba`, checked by the test. The original mixes one and two spaces after `Human:` and `Assistant:` (28 double, 29 single for Human); the page appends the question with two, as the file's first turn has.
- **`app/by-hand/preamble.mjs`**: the logic, with no React, so the tests run it in Node. `splitHeader`, `parsePreamble` (introduction, conversations split on `-----` lines, exchanges split before `Human:`), `assemblePreamble` (round-trips the original exactly), `questionTurn` and `buildPrompt` (the question as one more `Human:` turn, then `Assistant:`), `unitsOf` and `planPreamble` (given per-unit token counts and a budget, keep the introduction and whole exchanges from the end), `cutText`, `describePlan` (the sentence the student reads), and the two other presets (`PRESETS`: sardonic, monk; each three short conversations in the same shape, about 365 and 444 SmolLM2 tokens, so they fit GPT-2 whole).
- **`app/by-hand/ByHandLab.jsx`** and **`by-hand.css`** (classes prefixed `.bh-`): the client component (as of 12:30 UTC, column 2's cap is the two-way toggle described in the update above, not a menu). One question input with three example questions and "Ask all four"; shared settings (device for loading, temperature, max new tokens); "Load the three browser models" (sequentially, so columns 1 and 2 share the cached SmolLM2 download) plus per-column load buttons; four columns, each with status and progress, its own Ask and Stop, a streaming output with special tokens and `Human:`/`Assistant:` markers highlighted, a stats line (prompt tokens, time to first token, tokens/s, why it stopped), and "Exactly what was sent". Column 2 adds the preset select, the editable text, "Read the original prompt and where it came from" (the whole file, the source links, the caveat that this is our experiment on small models, not Anthropic's results on their 52B model), "Use at most" (a cap on the preamble), the "Let it write both sides" switch (no stop strings and EOS ignored, 240-token budget), the note on what was kept and cut, and "What was cut". Column 3 shows the templated string (SmolLM2-Instruct's template adds `<|im_start|>system\nYou are a helpful AI assistant named SmolLM, trained by Hugging Face<|im_end|>`). Column 4 sends `{ text }` with no system prompt through `useChat` and `DefaultChatTransport`, shows the route's `data-request` (model and messages), the reply, and times; if the key is missing it shows the route's 503 message and says columns 1 to 3 work without it.
- **`app/by-hand/page.jsx`**: reads `hhh-prompt.txt` on the server and passes it to the lab inside `ExperimentPage`.
- **`tests/by-hand.test.mjs`**: 5 tests, in `pnpm test` (now 25 tests, all pass): the hash and header of the saved prompt; the paper's description (word count, 14 conversations, 57 exchanges); round-tripping and question formatting; the planner on a synthetic preamble (fits all, keeps whole conversations, keeps part of one, intro too long, the cut text, the wording); the planner on the real prompt at a GPT-2 budget.
- **`content/experiments/by-hand.md`**: `status: working`; what it shows, the four columns, the two catches (context length, time) with the measured table, what students saw in testing, exercises, what it is not, readings.
- **Shared engine, small additive change (rule 1):** `lib/browser-lm/worker.js`, `client.js`, `useBrowserLM.js`, `README.md` (+33/−7 lines). A `count` command: `lm.count(texts)` returns `{ counts, contextLimit }` using the loaded tokenizer, so the page fits the preamble with each model's own tokenization; `load()` now also reports `contextLimit` on `model` (the smallest of `max_position_embeddings`, `n_positions`, and `model_max_length`). Nothing existing changed behavior; A's five sampling tests still pass.

## Fitting the prompt to the window

Checked in each model's `config.json` and `tokenizer_config.json` on Hugging Face on 2026-10-20: `Xenova/gpt2` 1,024 (`n_positions`, `n_ctx`, `model_max_length`); `onnx-community/SmolLM2-135M-ONNX` and `-Instruct-ONNX` 8,192 (`max_position_embeddings`, `model_max_length`), the same as the HuggingFaceTB originals. The whole prompt is 6,832 GPT-2 tokens and 6,520 SmolLM2 tokens (counted with the tokenizers in Node); with the question it reaches SmolLM2 as 6,534 to 6,541 tokens and fits. For GPT-2 the budget is 1,024 minus the reserve for the answer (120, or 240 with both sides) minus the question; the planner keeps the introduction (123 GPT-2 tokens), conversation 14 whole and the last two exchanges of conversation 13 (793 tokens with the question), and the note reads: "Kept the introduction, conversation 14 whole and the last 2 of conversation 13's 4 exchanges: the last 5 of 57 exchanges, 793 tokens with the question. Cut conversations 1 to 12 and the start of conversation 13, about 6,036 tokens, because GPT-2's window is 1,024 tokens and 120 are reserved for the answer." Per-unit counts are an estimate (they leave out the separators), so the page counts the assembled prompt and trims again if it is over. The "Use at most" control reuses the same planner with a smaller budget (3,000 / 2,000 / 1,000 / 500 tokens), and on the WASM path the page applies 800 automatically unless "the whole preamble even on the CPU path" is chosen.

## How to try it

http://localhost:3000/by-hand (Marlon's dev server, which was running when I tested). Click **Load the three browser models** (about 410 MB the first time, then cached), pick a question or type one, **Ask all four**. Then: tick **Let it write both sides** and **Ask column 2**; switch the preamble to the sardonic assistant or the monk; switch column 2's model to GPT-2, **Load GPT-2**, ask again and open **What was cut**; open **Read the original prompt and where it came from**. The document is at `/experiments/by-hand`, which redirects to the route.

## What I tested, and what students will see

Headless Chromium ("Chrome for Testing" from the Playwright cache, driven by a script in my scratchpad, not the shared Playwright profile, which another agent held, and not Marlon's Chrome) against Marlon's dev server on port 3000, with `OPENROUTER_API_KEY` present. Headless Chromium reported WebGPU available, so the default device was WebGPU. Three browser models generate at once when you ask all four, so single-model rates would be higher. Temperature 0.7, top-k 40, 120 new tokens. Console: 0 errors, 0 warnings across all runs.

**Cold cache, WebGPU** (fresh profile, 11:28 UTC): the three models loaded in 16.0 s (140 + 140 + 139 MB; the second SmolLM2 read the cache). Then the three questions through all four columns:

| Question | Column 1, SmolLM2 raw | Column 2, SmolLM2 + whole HHH prompt | Column 3, Instruct | Column 4, Claude |
| --- | --- | --- | --- | --- |
| Who wrote Frankenstein? | first token 0.9 s; 120 tokens in 19.0 s (6.3/s); "Frankenstein is a novella by Mary Shelley. The novel Frankenstein is considered…" | 6,534 prompt tokens; first token after 42.9 s; 35 tokens in 50.1 s; stopped at `\nHuman:`; "Well, I'm not sure that's the right way to ask, but if you want to try this out, just try it out." | first token 1.3 s; 120 tokens in 21.4 s (5.6/s); "Mmmmm...I'm sorry for the confusion, but as a chatbot, I'm unable to provide general information on famous works of literature. But if you're looking for a book… I recommend… The Da Vinci Code" | first text 1.0 s, done 2.0 s; Mary Shelley, 1818, anonymous, Lake Geneva, the 1831 edition |
| Why is the sky blue? | 0.2 s; 120 in 16.6 s (7.2/s); "Our eyes see blue because the light from the sun is reflected off the water and land surfaces…" | 6,536 tokens; 40.2 s; 79 tokens in 56.8 s; stopped at `\nHuman:`; "It's not just because the light from the sun is refracts through the atmosphere. The reason is that it's a combination of the amount of sunlight reflected by the atmosphere…" | 0.6 s; 120 in 18.5 s; "The sky blue is a result of a combination of atmospheric conditions… filtered by clouds…" | 0.8 s, done 4.9 s; Rayleigh scattering, in sections |
| Write me a two-line poem about a robot. | 0.3 s; 120 in 16.7 s; a worksheet: "Your poem must be at least 100 words long, and it must be about a robot… (4.5 points)" | 6,541 tokens; 40.3 s; 20 tokens in 44.2 s; "I'll try that, just so you can see what I mean." | 0.5 s; 120 in 18.6 s; "<<AI's Voice>>" and an eight-line poem | 0.9 s, done 1.4 s; "Beneath the stars, a robot stands alone, / Dreaming in circuits of a heart of its own." |

Whole wall time per "Ask all four": 50, 57, and 44 s, set by column 2.

**Both sides** (SmolLM2, whole prompt, 240 tokens, 88 s): after its answer ("It's because of the sun's rays that are being reflected back out into space.") the model wrote `-----`, then `Human:  A lightbulb, a pole, a suction cup, a lightbulb, and a lightbulb lightbulb lightbulb?`, then an `Assistant:` turn, and degenerated into "lightbulb lightbulb lightbulb…". The switch does what the brief asks: it invents the human's next turn, on the subject of the prompt's last conversation.

**Presets** (SmolLM2): sardonic, 365 prompt tokens, first token 1.9 s, "Because it's a mixture of blue, red, and violet."; monk, 444 tokens, 2.6 s, "It is the sky, not the sky is blue. The sky is a cloud of air, held in by the winds… I do not know the answer, I cannot tell you; I copy books, I do not tell them."

**GPT-2** (loaded in column 2 in 7.4 s): with the trimmed HHH prompt, 793 tokens, first token 3.5 s, "Well. I think. I think."; both sides, 699 tokens (240 reserved), 240 tokens in 26 s at 9.2/s, an answer, then invented `Human:` and `Assistant:` turns and separators; raw in column 1, "Was it a classic film? Was it a different version? Was it a good film?… Was it a remake?" repeated.

**Warm cache, WASM** (11:35 UTC): the three models loaded from cache in 1.9 s. Columns 1 and 3 were faster than on WebGPU (17.5 and 13.6 tokens/s, first token in 0.2 to 0.4 s; the Instruct model stopped at `<|im_end|>` after 33 tokens, with a wrong answer about "Percy Valentine Shelley"). Column 2 with the whole prompt: **first token after 893.9 s**, 20 tokens in 896.9 s. That is why the WASM path is capped.

**Warm cache, WebGPU, cap 2,000** (11:51 UTC): the three models loaded from cache in 2.4 s; column 2 sent 1,753 tokens (the introduction, conversations 12 to 14 whole and the last 4 exchanges of conversation 11, as its note said), first token after 13.3 s, 43 tokens in 20.9 s, "I can't really answer that one. The only language people have used to describe the creation of Frankenstein is 'Kafkaesque'…"; the whole "Ask all four" took 22 s. Column 4's panel showed `"model": "anthropic/claude-sonnet-5.5"`, `"system": ""`, and the one user message.

**Warm cache, WASM with the automatic cap** (11:52 UTC, when the cap was still 1,500): column 2 sent 1,411 tokens, first token after 48.5 s, and the note explained the CPU-path cap and how to override it. Columns 1 and 3 again ran at 18.5 and 13.7 tokens/s. Because 1,411 tokens still cost 48 s there, I lowered the CPU-path cap to 800 tokens (about half a minute by that rate) before committing; that final value was not re-run in the browser, only in the tests.

Screenshots and the JSON of every run are in my scratchpad (`/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/343f149d-375d-4122-9df1-e541550238b6/scratchpad/runs/`), outside the repo.

## Commits

- `889a286` "/by-hand: the assistant written into the prompt…" (2026-10-20 07:54 -0400, authored mkuzmick): the eleven files above (the five in `app/by-hand/`, the test, the document, and the four engine files); 1,103 insertions, 19 deletions. Committed by path; not pushed; the Notebook's pointer not bumped (rule 7).
- This report, committed by path after it (`d98441b`).
- `3d7a6ae` "/by-hand: a presenter toggle on column 2 … no sideways scroll at any width … the tab title" (12:30 UTC): `by-hand.css`, `ByHandLab.jsx`, `preamble.mjs`, `page.jsx` (the title line another agent had left uncommitted in the working tree, committed here with mine), and the document. Then this report again, by path.

## What I couldn't do or didn't check

- **Not tried in Marlon's own Chrome**, or on any laptop a student will bring. The shared Playwright profile was in use by another agent and I didn't want to open tabs in Marlon's browser while he prepares; the headless Chromium had WebGPU, but the Mac's WebGPU in headed Chrome may differ, and A measured WebGPU decoding slower than WASM on this Mac. V should click through once in the real browser before class, especially column 2's first-token wait.
- **The final CPU-path cap (800) was set after the last browser run** and is covered by the tests, not by a run; the 1,500 version ran once (above).
- **One device for all three models.** WASM is faster for the short prompts (columns 1 and 3) and WebGPU is essential for the long one (column 2). A per-column device choice would get the best of both; I kept one setting to keep the page simple today.
- **Sampling quality at 135M is low.** With the whole HHH prompt, SmolLM2's answers were short and evasive in all three runs; the point lands (it speaks as the assistant, in the register of the prompt, and stops at the end of its turn) but it doesn't answer well. Temperature 0 was not tried in the browser.
- **The "cold" download measured 16 s** for about 410 MB, which depends on the connection; classroom wifi will be slower. The first click on "Load" is the moment to watch.
- **The missing-key path** of column 4 was reasoned from the route's 503 and the transport's error text, not exercised, because the key is present. Column 3 and column 4's "Exactly what was sent" panels were verified from the DOM; column 1's and column 4's were captured closed in the cold run's JSON (the second run opens them).
- **Phone width** was not checked beyond the CSS (four columns collapse to two under 1200 px and one under 700 px).
- **`/print/by-hand`** and the home card were not looked at.
- The tokenizer-based counts of the presets, and the 6,520 / 6,832 figures, come from Node, with the same tokenizer files as the browser.

## For other tasks

- **V (session path and QA):** `/by-hand` is ready for the path. Tell students the models take about 16 s to load on a good connection, and that column 2 with the whole prompt answers about 40 s after the others on WebGPU. If a laptop reports "wasm" in the column status, the page caps the preamble at 800 tokens by itself (still about half a minute to the first token there); don't override it in class. The three example questions are good; "Who wrote Frankenstein?" shows the four stages most clearly.
- **C (spiral):** `lm.count()` and `model.contextLimit` exist now in the engine if the room wants to show how much of the window is used.
- **A (engine):** the `count` command and `contextLimit` are documented in the README under "Counting tokens". Both additive.
- **R (cleanup):** `tests/by-hand.test.mjs` is already in `pnpm test`. The repo `README.md` route table still says `/by-hand` is unbuilt; I didn't edit the README (not in my files).
- **E (persona dial):** the sardonic and monk presets in `preamble.mjs` are base-model preambles in the HHH shape, if E wants matching characters.
- **Orchestrator:** the brief's older sentence ("write our own preamble rather than pasting theirs at length") is superseded as it says; the page uses the original, with the source and verification on the page and in the file header.

## Marlon's words

- The task prompt (the only message before work started): "D, the assistant written into the prompt (the original Askell prompt): High. Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/D-by-hand.md, including its "For today's workshop" section, which supersedes the older note about the preamble. This is for today's class: make it work and test it well. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9)."
- Mid-task, when I had found port 3000 down: "server is running". I used it from then on and started no server of my own.
- The 12:05 UTC follow-up, from the orchestrator (not Marlon's own words except where it says so): "Two things on /by-hand, then update your report and commit by path. (1) Marlon wants a toggle on column 2 so the presenter can choose the whole HHH prompt (faithful, ~40 s to first token) or the 2,000-token cap (~22 s); default to the cap, label both clearly, re-test both in a browser. (2) Read the new section at the bottom of your brief … the columns overflow at 1440/1280 and the page scrolls sideways at 1024 and on phones; fix it in by-hand.css and re-check at 1440, 1280, 1024, 390 and at 125-150% zoom. Don't edit the spiral/gpt-2 route (AE) or ChatShell (AF)."

## Decisions and open questions

- **Models:** columns 1 and 2 default to SmolLM2-135M base, the matched pair with column 3; GPT-2 is in both selects, as the brief requires. Switching a column's model disposes that worker and loads the other (cached after the first time).
- **Units of the cut:** exchanges (a `Human:` turn and its `Assistant:` reply), kept whole from the end, rather than whole conversations. With GPT-2 that gives the introduction plus about one and a half conversations; by whole conversations it would have been one. The note names both.
- **Stop strings in one-sided mode:** `\nHuman:` and `\n-----`, so the model stops at the end of its turn even when it writes the separator first; both-sides mode has none and ignores EOS.
- **Device default:** "auto" (WebGPU if available, else WASM), as the engine does, because of the 40 s vs 15 min prefill; A's measurement that WASM decodes faster still holds for the short columns.
- **Decided 12:05 UTC:** column 2 defaults to the 2,000-token cap, with the whole prompt one click away. **Open for Marlon:** whether to add a per-column device choice; whether `/by-hand` should show the token-by-token candidates like C's room (the engine provides them; I left them out to keep four columns readable).

## Resumed 2026-10-20, about 12:10 UTC: the overflow fix from the visual review

The review (`_context/orchestration/reviews/20261020-layout-visual.md`, fix 1) found column 2 spilling under column 3 at 1440 and 1280 and the page scrolling sideways at 1024 and 390, because `.bh-col` was a grid with an implicit `auto` track that grew to a select's width. Fixed in `by-hand.css`: `.bh-col { grid-template-columns: minmax(0, 1fr) }`, the column selects `width: 100%; max-width: 100%`, and `minmax(0, 1fr)` in the 700 px query; the tab title is now "Building the assistant by hand". Measured afterwards in headless Chromium at 1440, 1280, 1024 and 390: `scrollWidth` equals the viewport at every width and no element extends past its column. Not re-checked at 125 to 150 % zoom. The "column-2 toggle" the board mentions beside this is not something I have a description of; if it means the preamble cap, that shipped in `889a286`.

**Thread:** `343f149d-375d-4122-9df1-e541550238b6`, Claude Code, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `claude --resume 343f149d-375d-4122-9df1-e541550238b6` from that directory.
