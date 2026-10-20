---
task: "V"
thread_id: "9257f40b-ab2a-447c-b59e-4e1c6388bf29"
agent: "Claude Code (claude-opus-5-5)"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 9257f40b-ab2a-447c-b59e-4e1c6388bf29  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
status: "parts 1, 2 and 3 done"
tested: "2026-10-20, parts 1 and 2 about 11:00–11:45 UTC, part 3 about 12:15–12:40 UTC (8:15–8:40 a.m. EDT); headless Chromium (Chrome for Testing 1208) driven by Playwright, against Marlon's dev server on http://localhost:3000"
---

# V. The session path and classroom QA

## The readiness sheet (read this before class)

| Route | Grade | Why |
|---|---|---|
| `/workshop` | 🟢 | The path page; all 14 links resolve; prints cleanly (6 sheets with U's pages). |
| `/eliza` | 🟢 | Replies and rule cards correct; the 1966 playback, Start over, and the script all work; fine at 1024 px and 390 px. |
| `/retrieval` | 🟢 | Everything T left untested now tested, including a live Claude answer; three small bugs fixed (see Commits). |
| `/layers` | 🟢 | Works with the local adapter and with live Claude, and the contrast teaches well. The raw Markdown I found is fixed in the shared shell by `3afba49`; not re-run with Claude since (to save credit). |
| `/chat-demo` | 🟢 | Live Claude works (first live test of B's shell); Markdown fixed by `3afba49` as above; an offline failure says only "Failed to fetch". |
| `/mini-claw` | 🟡 | The Claude path ran for the first time in this repo's records and works; every run appends to the tracked `mini-claw/memory.md`, and "Try to escape" with Claude ends at the model, not the sandbox (see below). |
| `/engine` | 🟢 | GPT-2 cold download 130 MB in 12 s here; WASM is 2.3× faster than WebGPU. A test bench, not a student page. |
| `/glossary` | 🟢 | Loads; sampled entries load. |
| `/history` | 🟡 | All 43 images load; the index lists the working notes (`shot-list`, `fact-check`) first, and the screenshots are unredacted until K. Fine to project; don't hand out. |
| `/story` | 🟢 | Loads and scrolls without errors (103 sections). Still a first draft. |
| `/print/...` | 🟡 | Every page prints, but only by its document address: `/print/experiments/eliza` works, while `/print/eliza` is a 404. |
| `/gpt-2` (was `/spiral`) | 🟢 | Cold download 135 MB in 7.4 s; every starter, Greedy's loops, Stop (127 ms), Keep going, warm reload (2.3 s), the recorded runs and the blocked-download message all work. `/spiral` and `/experiments/spiral` redirect to it. One scripted Keep going timed out once and didn't reproduce (below). |
| `/by-hand` | 🟡 | Works cold and warm, with Claude live and with the key missing. Two catches: **after `/get-ready`, it loads on WASM, and column 2 then waits about 100 s for its first token** (fallback below); and column 4 shows Claude's Markdown raw (`**Mary Shelley**`). |
| `/get-ready` | 🟢 | Caches all four models (27 s here with them already cached) and recommends a device (WASM on this Mac: 16.7 against 9.4 tokens/s). Its recommendation causes the `/by-hand` catch above. |
| `/markov`, `/tics`, `/rosie-roomba`, `/reading-rooms` (and its three rooms), `/knowledge-voice` | 🟢 | Smoke-tested: each loads, its main controls respond, no console errors, no sideways scroll at 1024 or 390. `/knowledge-voice` prepared its comparison; I didn't ask Claude there. |

No route threw a page error or logged a console error during these tests (the only console errors were the deliberate `/print/eliza` 404s and the simulated no-key 503 on `/by-hand`). No route scrolls sideways at 1024 px or at 390 px.

**Before class (from part 3):**

1. **Stop the building agents, then restart the dev server and open each stop once.** During part 3, with about eight agents editing files, every page took 5–24 s to come back from the dev server (`/eliza` 10 s, the home page 21–24 s; a `next build` was also running for a while). In part 2 the same pages took 1–2 s. It's the dev server recompiling, not the pages.
2. **On the presenting machine, open `/get-ready`** and press the button, so GPT-2, both SmolLM2 models and MiniLM come from the cache.
3. **Then, on `/by-hand`, set "Run on" to "WebGPU if available, else WASM" before loading** (see the first fallback below).

**The biggest open question is not on any page: how do students reach the site?** It runs only on Marlon's laptop (`localhost:3000`) and isn't deployed. If students are meant to try the stops on their own machines, it needs a deploy or a shared address on the room's network; otherwise the path is a demo Marlon projects, and students work in Claude Desktop (stop 6). I didn't deploy anything (rule 7).

## If X fails in class, do Y

- **`/by-hand` column 2 sits on "Reading 1,753 tokens of prompt…" for a minute or more:** it's on WASM. `/get-ready` saved WASM as this browser's device (it's faster for short GPT-2 runs), and `/by-hand` restores it. The default 2,000-token preamble then took 101 s to the first token here (18 s on WebGPU). Set **Run on** to "WebGPU if available, else WASM", reload the page and load again (the models come from cache in 2–4 s). Or pick **The whole prompt**: on WASM that option caps itself at 800 tokens, about half a minute.
- **`/gpt-2` won't download or is crawling:** the **Recorded runs** tab (six real GPT-2 takes, labelled as recorded) needs no download. A blocked download shows "The model didn't load: Failed to fetch. Check the wifi and try again, or watch recorded runs."
- **`/by-hand` column 4 fails:** with no key it says "OPENROUTER_API_KEY is missing… Column 4 needs that key; columns 1 to 3 work without it" (tested by simulating the 503), and columns 1–3 keep going.

- **The dev server stops or a page hangs:** in `nextjs/`, `pnpm dev`. The first load of each route after a restart compiles for 1–2 s (up to 24 s for `/print/history` the first time); open the stops once before class to warm them.
- **A Claude answer never comes** (`/retrieval`, `/layers`, `/chat-demo`, `/mini-claw`): the page shows the route's error (the no-key message reads "OPENROUTER_API_KEY is missing. Set it in nextjs/.env.local and restart the dev server."). Fall back to what runs without a key: `/retrieval` steps 01–04 (search, scores, the exact prompt), `/layers` with **Local inspection adapter**, `/mini-claw` with **Scripted stand-in**.
- **The Wi-Fi is slow and a model won't download:** the `/retrieval` embedding model is 23 MB, GPT-2 is 130 MB. Here they took 2.4 s and 12 s; at 10 Mbit/s, GPT-2 would take about 2 minutes, and much longer with a room downloading at once. Open `/get-ready` once on the presenting machine before class, so they come from the browser cache (a warm GPT-2 load took 1.3–2.3 s).
- **GPT-2 is slow to generate:** choose WASM. On this Mac it ran 22 tokens/s on WASM against 9.7 on WebGPU (A measured the same).
- **`/mini-claw` "Try to escape" doesn't show the sandbox:** with Claude, the model declines on its own ("I can't read that file…") and never calls the tool, so the harness's path check never runs. Switch to **Scripted stand-in** to show the harness refusing.
- **After demoing `/mini-claw`:** `git checkout -- mini-claw/memory.md` (from the repo root) puts the memory back; notes it wrote are in the gitignored `mini-claw/notes/`.
- **A printed handout:** use `/print/workshop` (the path plus U's five Claude Desktop pages, 6 sheets) or `/print/experiments/<name>`, not `/print/<route>`.

## What I built

- **Part 1:** `nextjs/content/workshop/README.md`, rendered at `/workshop`: "Today's path: build and test a chatbot", marked "Draft: proposed path, 2026-10-20", seven stops in the order the brief proposed (`/eliza` → `/spiral` → `/by-hand` → `/retrieval` → `/layers` → `/workshop/claude-desktop`, then the glossary, history, story, and `/mini-claw` for later), each with a "Try" line (with the route) and a "Notice" line, linking five glossary entries. Read against Marlon's planning note; nothing on it is presented as Marlon's decision.
- **Fixes, all in `/retrieval`** (in T's route, which no running task owns):
  - The "keep the top" slider re-cuts the last search instead of doing nothing until the next one (the page tells students to "lower the number kept to 1").
  - Keywords-only mode no longer shows the meaning-score histogram, whose caption said the bot was given passages it wasn't.
  - "1 passages" → "1 passage".
- **Tab titles** for `/eliza`, `/retrieval`, `/layers`, `/mini-claw`: "ELIZA", "Knowledge files", "The layers around the model", "Mini-claw" instead of the lowercase route name.

- **Part 3:** no code changes. Testing only; findings for D and AE are below.

## How to try it

http://localhost:3000/workshop, then follow the stops. For the fixes: on `/retrieval`, search, then move the slider (the lists and the histogram change at once), then choose "keywords (BM25)" (the histogram goes away).

## What I tested, with figures

All on this Mac and network, Chromium, 1280 px unless noted.

- **Every route** (`/`, `/eliza`, `/engine`, `/retrieval`, `/chat-demo`, `/layers`, `/mini-claw`, `/glossary`, `/history`, `/story`, `/workshop`) and `/print` of `experiments/eliza`, `experiments/retrieval`, `experiments/layers`, `experiments/mini-claw`, `glossary`, `history`, `story`, `workshop`: all 200 at 1024 px and 390 px, no sideways scroll, no console errors. Warm loads of pages are about 1–2 s in dev; `/print/glossary` about 4 s.
- **`/eliza`:** five typed lines (MY, I, MY with memory, COMPUTER, the NONE rule) gave correct replies and rule cards; Play the 1966 exchange; Start over during playback stops it. Enter pressed before the page has hydrated (in the first second) does nothing and leaves the text in the box, so the student presses it again; harmless.
- **`/retrieval`,** covering T's untested list:
  - Cold cache (Cache Storage empty, checked): the first search, including the 23.0 MB model (`model_quantized.onnx`, 22,972,370 bytes on Hugging Face), took 2.4 s; the progress line counted up ("2%", "82%"). After a reload the first search is about 1 s; later searches 70–90 ms.
  - All six texts on (2,848 passages) with the other four example questions: meaning search found the right text for each (R.U.R. for the robots, *Laughter* for "funny", *The Decay of Lying* for art and life; "a made thing… a soul" found *Dorian Gray* and *Phaedrus*). Keyword search missed Bergson entirely for "What makes something funny?" (its hits were *Dorian Gray*, *Frankenstein*, *Intentions*): a good contrast to show, not a bug.
  - Slider (1 and 8) and all three modes, after the fixes.
  - A live Claude answer with 8 passages: first text at 5.9 s, finished at 7.7 s; the Markdown renders (bold, lists, citations [1]–[8]).
  - An off-corpus question ("What is the capital of Australia?"): Claude said the passages don't say, and named the two *Dorian Gray* passages that mention Australia.
  - "Add your own text": five short Grice paragraphs embedded in 2.1 s and searched alone. Under about 700 characters, pasted text becomes **one passage**, so retrieval over it is trivial; tell students to paste something longer.
  - Errors: a 503 with the server's no-key message shows that message; a dropped connection shows "Failed to fetch". Neither crashes. (Simulated by intercepting `/api/chat` in the browser, since the key is set and I didn't restart Marlon's server.)
  - 390 px: one column, usable.
- **`/chat-demo`:** a live Claude reply in about 4 s; "Pull back the curtain" shows the request (model `anthropic/claude-sonnet-5.5`, which exists on OpenRouter).
- **`/layers`:** local adapter with the invented syllabus (824 characters of system context); then Claude, which answered "The weekly response is due **Thursday at 5 pm**" (raw asterisks); then with Configuration off, "I don't have any information about which weekly response you're asking about…". The trace showed each send.
- **`/mini-claw`:** "Remember something" with Claude (4.5 s, one line appended to memory), "Try to escape" with Claude (declined without a tool call), "Use the memory" with the scripted stand-in (0.6 s). I restored `mini-claw/memory.md` with `git checkout` and deleted `notes/scripted-run.md` afterward.
- **`/engine`:** GPT-2 cold (no GPT-2 files in Cache Storage) loaded 130.42 MB in 12 s on WebGPU; 64 tokens at 9.7 tokens/s ("Who are you?" → "I am. … Please, please. Please, please."). WASM: ready in 1.1 s from cache, 22.3 tokens/s.
- **`/history`:** all 43 image files on its section pages return 200; the 6 of 10 loaded at first were lazy loading.
- **`pnpm test`:** 14 of 14 pass (before my changes); `tests/retrieval.test.mjs` 4 of 4 after them.

### Part 3 (about 12:15–12:40 UTC)

Headless Chromium from the Playwright cache, my own profiles in the scratchpad (deleted for cold runs), 1440 px unless noted. Load averages were 7–16 throughout, with many agents and a `next build` running, so the speeds below are on a busy machine and lower than C's and D's.

- **`/gpt-2`** (C's own `tools/browser-test.mjs`, pointed at the cached Chromium, plus two short scripts of mine):
  - The tab title is "GPT-2, before the assistant"; `/spiral` answers 308 → `/gpt-2`, and `/experiments/spiral` lands on `/gpt-2` too (the smoke test followed both). `/print/experiments/gpt-2` is 200.
  - Cold, WASM: click to ready in 7.4 s for 134.9 MB (128.4 MB weights from `us.aws.cdn.hf.co`, 5.6 MB ONNX runtime from `cdn.jsdelivr.net`, 0.6 MB from `huggingface.co`, 1.3 MB app). A second cold run took 14.8 s.
  - The four starters at the defaults: 150 tokens each in 7.8–8.5 s (17.6–19.2 tokens/s), first token 85–282 ms, every run "It was still going at the 150-token limit" and 116–139 tokens past the first line break. "Who are you?" gave "Your name! Your name! …".
  - Greedy: "I'm a man." ×n and "The capital of France is the capital of France." ×n, as C reported.
  - Stop: 127 ms from click to "You stopped it."
  - Keep going after a Stop: in C's script the wait for it timed out at 120 s once, while the dev server was slow; the warm section of that run was skipped as a result. In a separate run of the same steps it worked: 400 tokens in 23 s, the buttons back. Not reproduced, so I count it as the server's slowness during the test, but watch the first Keep going in class.
  - Warm (same profile): ready in 2.3 s; "A question" 9.4 s and "Who are you?" 7.8 s for 150 tokens.
  - Recorded runs at 1024 px: replays "Who are you?" at temperature 0 with its label; no overflow. Blocked Hugging Face: the message above. The slow-download section didn't run (the page load hit C's 30 s limit on the busy server).
  - Console: no errors in any section.
- **`/by-hand`:**
  - Cold, device "WebGPU if available" (headless reports WebGPU): the three models loaded in 18.0 s (273.8 MB from the HF CDN). "Who wrote Frankenstein?", Ask all four: everything finished in 42 s.
    - Column 1 (raw): first token 0.7 s, 120 tokens in 25.5 s (4.7/s), an invented Mary Shelley quotation.
    - Column 2 (the HHH prompt, now defaulting to its last 2,000 tokens): 1,753 prompt tokens, first token 18.3 s, 120 tokens in 41.7 s. "I'm not really sure of that, but I've been thinking about it…". The cut note is clear.
    - Column 3 (Instruct): first token 1.0 s, 58 tokens, stopped at `<|im_end|>`, "as a psychiatric-related AI, I don't have the capability…". A good bad answer for class.
    - Column 4 (Claude): first text 2.5 s, done 3.7 s, Mary Shelley, 1818. The reply shows `*Frankenstein…*` and `**Mary Shelley**` raw: column 4 is a `<pre>` of its own, not B's shell.
  - Warm, WASM, key missing (I intercepted `/api/chat` with the server's 503): models from cache in 3.7 s. Columns 1 and 3 ran at 13.0 and 12.4 tokens/s, 9–10 s each. **Column 2: 1,753 tokens, first token after 101.5 s**, 51 tokens at 108.5 s. Column 4 showed the no-key message and the note that columns 1–3 work without it.
  - Then `/get-ready` in the same profile: 4 of 4 models "Cached and checked" in 27 s, speed check WASM 16.7 against WebGPU 9.4 tokens/s, "Recommended: WASM (CPU). Saved for this browser." Afterwards `/by-hand`'s device select read `wasm`, and `/gpt-2`'s too. That's the trap: the default `/by-hand` flow after `/get-ready` is the 101 s one. (The page's 800-token CPU-path cap applies only to "The whole prompt", not to the 2,000-token default.)
  - 1024 px and 390 px: no sideways scroll, before and after answers.
- **Smoke tests:**
  - **`/markov`:** ready in 0.2 s; Step ×5 and Run/Pause produce text with "longest verbatim run 11 words · 71% inside a copied run".
  - **`/tics`:** two passages (Bergson, the *Frankenstein* preface) plus two slots for students' own text. Switching passage re-highlights: 5 candidate matches, with per-1,000-word rates.
  - **`/rosie-roomba`:** the → step buttons advance the piece. I didn't test Present (fullscreen).
  - **`/reading-rooms`:** the index and its three rooms, Phaedrus, Shanahan and Turn-taking. In Phaedrus I picked questions, but "Ask the inscription" was skipped by my clicker. Shanahan: "Reveal an authored role cue" responds; I didn't press "Load GPT-2". Turn-taking: Overlap, Meet at boundary and Leave a gap all change the room.
  - **`/knowledge-voice`:** Prepare the comparison makes four cells with 3 BM25 passages from *Frankenstein*, each prompt viewable, and sends no request until "Ask Claude in all four cells" (enabled, since the key is set). I didn't press it, to save credit; Y's report covers the answers.
  - Every one of these: 200, no console errors, no overflow at 1024 or 390, no `/api/` call.

## Commits

- `557311f` /workshop: today's proposed path through the site (draft for the Oct 20 class)
- `5044a26` /retrieval: the slider re-cuts the last search, keywords-only mode hides the meaning histogram, and "1 passage" is singular (three fixes in one file, so one commit)
- `49b488b` Experiment tab titles: ELIZA, Knowledge files, The layers around the model, Mini-claw
- `29916f0` /workshop: routes move from the headings to the Try lines, since /print uppercases headings and `/BY-HAND` 404s
- `1c5489e` this report (parts 1 and 2); part 3 is a later commit of this file only. Part 3 changed no code.

## What I couldn't do or didn't check

- **Part 3 ran on a loaded machine and a recompiling dev server**, so its speeds are lower than a quiet classroom laptop's (compare C's and D's figures). Headless Chromium reports WebGPU; Marlon's real Chrome may differ, so one click-through of `/by-hand` in it before class is still worth doing.
- **Not pressed:** Claude on `/knowledge-voice` (four paid calls), Present on `/rosie-roomba`, GPT-2 inside `/reading-rooms/shanahan`, the "Let it write both sides" switch and GPT-2 in `/by-hand` (D covered both).
- **Only Chromium on this Mac.** No Safari or Firefox, no real phone (390 px was a window size), no slow or old laptop, no throttled network: the download times above are this network's, and a room of students downloading at once will be slower.
- **The real no-key case** on the server: the key is set, so I simulated the server's 503 in the browser rather than restart Marlon's server without it. The server code returns exactly the message I simulated (`app/api/chat/route.js`).
- **The dev server:** port 3000 was down when I started; T's leftover server on 3017 was up and then stopped (not by me); I waited until Marlon started 3000. Nothing is tested against a production build (`pnpm build`).
- **U's pages** I only loaded and printed; their content is U's to report.
- Other agents had uncommitted changes in `lib/browser-lm/` while I tested `/engine`, so the engine results reflect the working tree at about 11:30 UTC.

## For other tasks

- **B (or the orchestrator), proposed small fix:** `ChatShell` renders replies as plain text with `white-space: pre-wrap`, so Claude's Markdown shows raw asterisks on `/layers` and `/chat-demo` (and anything else on the shell). The fix is a Markdown text component passed to `MessagePrimitive.Parts` (`components={{ Text: … }}`, using `react-markdown`, already a dependency, as `/retrieval` does), plus dropping `pre-wrap` for that case. It's a shared file and more than one line, so I left it. Check the `components` prop in `@assistant-ui/core` before writing it.
- **C and D** (part 2): default GPT-2 and SmolLM to WASM (22 vs 9.7 tokens/s here). Since done for `/gpt-2`; the tab titles are fixed on both. For `/by-hand`, see the WASM trap below: WASM is right for short prompts and wrong for column 2.
- **H (mini-claw):** consider resetting memory or keeping a classroom copy, since each Claude run appends to a tracked file; and consider a note on "Try to escape" that Claude refuses before the sandbox can.
- **R (cleanup):** `/print/<route>` 404s for experiment routes; the print route could map an experiment route to its document (`/print/eliza` → `experiments/eliza`). `/history`'s index lists `shot-list` and `fact-check` before the sections.
- **T / Y:** short pasted text becomes a single passage (target 700 characters), so "Add your own text" needs longer text to show retrieval doing anything.
- **K:** the history screenshots are unredacted; projecting them is fine, handing out the link isn't.

- **D and AE, together (the `/by-hand` WASM trap):** `/get-ready` saves WASM (faster for a short GPT-2 run), `/by-hand` restores it, and column 2's 2,000-token default then takes about 100 s to the first token on WASM. Possible fixes: have `/by-hand` ignore the saved preference (its long-prompt column needs WebGPU), or apply the CPU-path cap (800) to the default as well as to "The whole prompt". Either is in D's file; I didn't touch it, since it was being edited while I tested.
- **D:** column 4's reply is a `<pre>`, so Claude's Markdown shows raw; the shared shell's fix (`3afba49`) doesn't reach it.
- **AE:** the redirects work; the slow-download check in `tools/browser-test.mjs` uses a 30 s page load, too short for the dev server when it's busy.
- **The orchestrator / AG:** a `next build` was running in `nextjs/` beside the dev server at about 12:24 UTC (both share `.next/`); the dev server kept serving, but pages were slow throughout.

## Marlon's words

> server is running

Part 3: "C and D have reported. Do part 3 of your brief: test the GPT-2 page (task AE is renaming /spiral to /gpt-2 right now; test whichever exists, and the redirect) and /by-hand, cold and warm. Also smoke-test /markov, /tics, /rosie-roomba, /reading-rooms and /knowledge-voice. Don't edit content/workshop/README.md: task AD is rewriting it to Marlon's new arc. Update your readiness sheet and commit by path."

## Decisions and open questions

- **How do students reach the site today?** (above). If it should be on their machines, it needs a deploy decision from Marlon.
- I left the stop order as the brief's draft and marked the page as a proposal; Marlon may want to move `/layers` before `/retrieval` (the general frame before one layer), or drop `/by-hand` if D isn't ready.
- I tested against Claude with the key Marlon added, which spends a little OpenRouter credit (about eight short requests in parts 1 and 2, one in part 3).
- `/workshop` still links `/spiral` (the redirect covers it); AD is rewriting that page, so I left it.
