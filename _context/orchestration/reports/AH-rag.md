---
task: "AH. /rag"
thread_id: "5bf7a8c6-9ba2-484d-a582-a59d83cc1356"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 5bf7a8c6-9ba2-484d-a582-a59d83cc1356"
ran: "about 12:05–12:45 UTC, 2026-10-20"
status: "working (prototype); every step tested in a browser, one live Claude answer"
---

# Task AH: /rag

## What I built

`/rag`, "RAG, step by step": the retrieval pipeline as eight steps you move through with Next and Back or the numbered tabs, on one course text or your own. Each step has its own address (`/rag#chunk`, `#embed`, `#store`, `#question`, `#compare`, `#top-k`, `#prompt`, `#answer`), so the talk can point at one as a footnote.

1. **Chunk:** the passages laid end to end with a ✂ mark at each cut, the rule that made them (T's `chunk`), and the shortest, longest, and average length. Click a passage to follow it through steps 2 and 3.
2. **Embed:** that passage's 384 numbers, as a strip of colour (red positive, blue negative) and as numbers, with its length (1). "Embed this passage again, here in the browser" re-embeds it live and shows the fresh and stored vectors agree (dot product 0.995; the gap is the int8 rounding). It notes the model's 256-word-piece limit.
3. **Store:** a slice of the JSON file that is the whole store (the passages, then the base64 vectors), its size, a link to it, and how to find one passage's 384 bytes in it, decoded. For pasted text, the same format built in the tab, downloadable.
4. **Embed the question:** the question's strip next to the passage's. Example questions (one to three per text) were embedded ahead of time with the same model, so steps 4 to 7 work before the model downloads; a typed question is embedded in the browser.
5. **Compare:** the dot product worked out for the top passage (or the step-2 passage, or any passage clicked): three aligned strips (question, passage, product), a table of all 384 multiplications with a running total, the sum, and its angle. Then every passage's score in text order, with the time the browser took.
6. **Top k:** the best 40 scores sorted, the cut-off line, a k slider (1–10), and the kept passages.
7. **The prompt:** the exact system prompt and user message, and a bar showing how the prompt divides between instructions, passages, and question (Madeleine's context-window frame).
8. **The answer:** Claude through `/api/chat` (one paid call per click), the cited passages traced back, and every quotation in the answer checked word for word against the passages given: ✓ in the passage it cites, ≠ in a different passage, ✗ in none.

Footnotes under the steps: the industrial version (pgvector, exact vs approximate search), skipping retrieval by pasting the whole text (the text's size in tokens, roughly), and a link to `/retrieval`.

Files (all mine, all new):

- `nextjs/app/rag/page.jsx`, `RagPipeline.jsx` (client), `rag.css` (classes prefixed `.pipe-`, because T's `/retrieval` already uses `.rag-`).
- `nextjs/app/rag/questions.mjs` (the example questions) and `questions.json` (their vectors, 10 questions × 384; 33 KB), written by `tools/embed-questions.mjs` (`cd nextjs && node app/rag/tools/embed-questions.mjs`).
- `nextjs/app/rag/tools/browser-test.mjs`: the browser check (below).
- `nextjs/content/experiments/rag.md`: `status: working`, `order: 26`.

It imports `lib/retrieval/core.mjs` and uses `lib/retrieval/embed-worker.js` and `public/retrieval/*.json` unchanged. No shared file and no dependency changed.

## How to try it

http://localhost:3000/rag. Phaedrus is chosen. Click through 1 to 3, then in step 4 click **Does writing destroy memory?** and go on to **5 Compare**: the sum of 384 products is 0.4003 for Jowett's introduction, which outranks Plato's own Theuth passage. Then try **Why did Thamus distrust letters?**, which puts Plato first (0.66). Step 8 needs the key and costs a call.

## What students will see (tested 2026-10-20)

Headless Chromium 1208 (the ai-lab-team Playwright) against the shared dev server on :3000, with `nextjs/app/rag/tools/browser-test.mjs` (run as `PLAYWRIGHT=/Users/mk/Development/_sort/ai-lab-team/package.json node app/rag/tools/browser-test.mjs http://localhost:3000 <out-dir> [--ask]` from `nextjs/`; about 2 minutes):

| | Result |
|---|---|
| All eight steps, Phaedrus, "Does writing destroy memory?" (pre-embedded) | Top passage 33 (Jowett), 0.4003, angle 66.4°; matches `/retrieval`'s 0.400. Kept 0.400 to 0.345 at k = 4; the next scored 0.335. Scoring 352 passages: "under a millisecond" to 1.0 ms. All 384 table rows render. |
| A typed question in a fresh browser (cold cache) | Model download plus first embedding: 2.3–3.9 s on this connection, about 29 MB of traffic to Hugging Face and jsdelivr. The next question: 64–116 ms. |
| Re-embedding a passage live | Dot product with the stored vector 0.9952. |
| Pasted text (six paragraphs of notes on Grice) | Cut into 3 passages, embedded, a 3 KB store in the same format, searched. |
| One live Claude answer (`--ask`, one paid call) | Cited [1], [3], [4]; I checked its six quotations against the kept passages with a scratch script: all six are word for word in the passage the answer attributes them to. |
| Step 8 against a canned answer (the test answers `/api/chat` itself, no paid call) | Flags "will create forgetfulness in the learners' souls" as ≠ (in [3], cited as [2]) and an invented quotation as ✗. |
| Layout | No horizontal scroll at 1024 or 390 px. No console errors in the last four runs. |

One console error ("An unknown Component is an async Client Component…") appeared once, in the first run, while other agents' edits were rebuilding the dev server; it did not recur in any later run or on clean loads, and nothing in `/rag` is async on the client.

## Commits

- `88891a1` "/rag (task AH, first version): …" (8 files).
- `1f5c605` "/rag (task AH): the answer's quotations checked word for word …".
- `442a5ef` "Report AH: /rag", and a follow-up that records this hash.

All authored mkuzmick, committed by path, not pushed.

## What I couldn't do or didn't check

- Only Chromium; not Safari or Firefox (the module Worker is the riskiest part).
- One live Claude answer, one question. The "say so if the passages don't contain the answer" behaviour wasn't tried.
- The 29 MB cold figure counts all traffic to Hugging Face and jsdelivr in that context, which may include the ONNX runtime as well as the 23 MB model; I didn't separate them. T's "about 23 MB" label is kept.
- The quotation check is a plain substring match (ignoring case, curly quotes, `_`/`*` emphasis, line breaks, and a final comma or full stop). A quotation with an ellipsis, or one Claude lightly paraphrased inside quotation marks, will show ✗; that is arguably the point, but the page doesn't explain ellipses. It has no unit test in `pnpm test` (the function lives in the component); I checked it with a scratch script.
- I didn't run `pnpm test` or a production build (the dev server shares `.next/`).

## For other tasks

- **AD (site sections):** `/rag` is `order: 26`, status `working`; it belongs beside `/retrieval` in the experiments list.
- **V (QA) / the MVP path:** the step anchors (`/rag#compare`) are for pointing at one step. The example questions need no download; typing one downloads the model once.
- **AE (get-ready page):** to preload what `/rag` needs, fetch `Xenova/all-MiniLM-L6-v2` (q8) via `lib/retrieval/embed-worker.js` and `/retrieval/phaedrus.json`.
- **T / Y:** `/rag` imports `lib/retrieval/` read-only. If the corpus is rebuilt, rerun `node app/rag/tools/embed-questions.mjs` only if the model changes.
- **AF (shared fixes):** a `checkQuotes` helper could move to `lib/retrieval/` and get a test if other pages want the grounding check.

## Marlon's words

- The task prompt: "Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/AH-rag.md. Get a working first version committed early, then improve it. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9)."

## Decisions and open questions

- **One text at a time** (or your own), not several: the point is following one passage through. `/retrieval` covers several texts and keyword search.
- **Pre-embedded example questions**, labelled as such, so the demo works before (or without) the model download, as the spiral room's recorded runs do. Typed questions and "Embed it here instead" use the live model.
- **The worked passage defaults to the top one**, because that is the score that matters; buttons switch to the step-2 passage, and any bar in the score map can be clicked.
- **Facts checked:** all-MiniLM-L6-v2's 384 dimensions and 256-word-piece truncation (its Hugging Face model card); pgvector's description, HNSW and IVFFlat, exact search by default, and "trade some recall for speed" (its GitHub README). The context-window footnote names no model's limit and says to verify it. Every other figure on the page is computed in the page.
- **Open, for Marlon:** should step 8's quotation check be the thing to point at in the talk (grounding made visible), and does the Frankenstein example "What does the creature ask Victor to make?" (which retrieves letters *to* Victor, a retrieval failure) belong as a deliberate bad case, labelled as one?
