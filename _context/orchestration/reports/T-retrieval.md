---
task: "T. /retrieval"
thread_id: "af8e0f99-ed1c-4614-8f71-9c311a99669f"
agent: "Claude Code (claude-opus-5-5)"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume af8e0f99-ed1c-4614-8f71-9c311a99669f  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "10:39–10:50 UTC (6:39–6:50 a.m. EDT), 2026-10-20; the retrieval work itself was 10:42–10:47 UTC"
status: "done; one search-to-answer path tested live in a browser, most other paths untested (see section 4)"
written_by: "a Claude Code subagent, from the thread's transcript and the repo, on 2026-10-20; not written by the thread itself"
---

# Task T: /retrieval

**Short answer:** `/retrieval` runs. A student picks from six public-domain course texts (or pastes their own), asks a question, and sees the passages ranked two ways, by embedding and by BM25 keywords, each with its score, a histogram of every passage's score, the exact prompt the bot would be sent, and, through the shared `/api/chat` route, a cited answer from Claude. The thread saw all of that work once, in a headless-driven browser, with a real Claude answer. It was built in about five minutes before the thread had a brief; the brief `tasks/T-retrieval.md` was written afterward as the record.

## 1. What I built

All paths are under `nextjs/` in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`.

- **`lib/retrieval/core.mjs`**, the retrieval logic as plain `.mjs`, shared by the page, the build script, and the tests (and, per the brief, meant to be imported read-only by task Y): `MODEL` (`Xenova/all-MiniLM-L6-v2`), `DIMS` (384), `TARGET` (700 characters); `chunk` (keeps paragraphs whole, merges up to about 700 characters, cuts a paragraph over twice that at sentence ends, remembers the last heading above each passage); `decodeVectors` and `cosine` (vectors are stored normalized as base64 int8, value times 127, so the dot product is the cosine); `words`, `keywordIndex`, `bm25` (keyword search with a short stop list); `topK`; `buildSystem` (the instructions, then the passages numbered `[1]`, `[2]` inside `<retrieved_passages>`).
- **`lib/retrieval/embed-worker.js`**: a module Web Worker that loads the same embedding model in the browser (`dtype: "q8"`, single-threaded WASM, with a progress callback) and turns strings into normalized 384-number vectors, 16 at a time.
- **`scripts/build-retrieval-index.mjs`**: splits six texts from the sibling `eng-298ai-context` repo (`../../eng-298ai-context/_context/course-readings/course-readings-md/`), embeds every passage, and writes `public/retrieval/<id>.json` plus `manifest.json`. Run from `nextjs/` with `node scripts/build-retrieval-index.mjs`. The six texts, with passage counts checked against the manifest: Phaedrus (352), R.U.R. (216), Frankenstein (651), Bergson's *Laughter* (362), *The Picture of Dorian Gray* (716), Wilde's *Intentions* (551), 2,848 passages in all and about 3.3 MB of JSON. Only Project Gutenberg texts, because the files are served publicly; the thread left out Grice, Sacks et al., and the Chin *Analects* for that reason. The thread's build run took about 36 seconds.
- **`public/retrieval/`**: the six `<id>.json` files and `manifest.json` (title, author, translator, Gutenberg number, passage count).
- **`app/retrieval/`**: `page.jsx` (server page, `<ExperimentPage name="retrieval"><RetrievalLab /></ExperimentPage>`, `force-dynamic`), `RetrievalLab.jsx` (client), `retrieval.css` (49 lines, all classes prefixed `.rag-`). The lab has five numbered steps: **01 Knowledge files** (checkboxes; Phaedrus and R.U.R. are on by default; an "Add your own text" box that splits and embeds pasted text in the tab); **02 Ask** (a question box, five example-question buttons, a "keep the top" slider from 1 to 8, default 4, and a "Search by" menu: meaning and keywords side by side, meaning only, keywords only); **03 What the search found** (a 48-bin histogram of every chosen passage's similarity with the kept ones marked, then the ranked lists with score bars, passage numbers, expandable text, matched keywords highlighted, and a "both" tag on passages found by both methods); **04 What the bot is sent** (editable instructions and the exact assembled prompt, with a rough token count of length divided by 4); **05 The answer** ("Ask Claude with these passages" sends the prompt through `/api/chat` as the `system` body field via `useChat` and `DefaultChatTransport`; the reply is rendered with `react-markdown`).
- **`content/experiments/retrieval.md`**: `status: working`, `order: 8` (no clash: orders 1 to 7 belong to the other experiments), `route: /retrieval`. Sections: What it shows, What was built, What it is not, Things to try.
- **`tests/retrieval.test.mjs`**: 4 tests (chunking and headings; BM25 ranks the passage with the rare word; the built corpus has one vector per passage for every text; the system prompt numbers its passages).

No shared file was changed (`git show --stat 0782e89` lists only the 15 files above). `react-markdown` was already in `package.json` from the scaffold commit, so no dependency was added.

## 2. How to try it

Open http://localhost:3000/retrieval (Marlon's dev server; the thread used its own, below). Click "Does writing destroy memory?", wait for the results, and read the histogram caption and the two lists. The first search downloads the embedding model (the page says about 23 MB, once; see section 4). Then press "Ask Claude with these passages", which needs `OPENROUTER_API_KEY` in `nextjs/.env.local` (the file now has a non-empty value on that line; I checked only that it is non-empty and did not print it). Without it the answer panel shows the route's error. Searching needs no key. The document is at `/experiments/retrieval`, which redirects to the route.

I reran `node --test tests/retrieval.test.mjs` from `nextjs/` on 2026-10-20: 4 pass, 0 fail. I did not start a server.

## 3. Commits

Verified in `git log`:

- `0782e89` "/retrieval: knowledge files, the first-generation custom GPT's RAG made visible (six Gutenberg course texts, embedding vs keyword search, the score histogram, the exact prompt, an answer through /api/chat)" (2026-10-20 06:47:24 -0400), 15 files, 601 insertions, committed by path by the thread and already on `origin/main` (`git log origin/main` contains it).
- `c8baff6` in The Notebook (`ll-26-27/the-notebook`), "mk-chatbot-experiments: the /retrieval experiment" (06:47:26 -0400): the Notebook's pointer to the new commit, committed by the thread and contained in the Notebook's `origin/main`.

The thread's first commit of the session was a separate Notebook commit, `652213b`, "humanities-ai-lab: Oct 20 workshop planning, phone-voice handoff, the Oct 19 canvas, readings, and the gathered 298AI material; mk-chatbot-experiments pointer and planning notes; week 7 doc" (this was "do 1", the tidy-and-push, not part of T).

## 4. What I couldn't do or didn't check

What the thread tested, from the transcript:

- Before the page existed, it ran four questions against the new index from a Node script and read the top three hits for each (writing and memory, why the robots rebel, the creature asks for a companion, what makes something funny). The results looked sensible to it.
- `pnpm test` before the page was finished (the existing 10 tests pass), then 14 passing after adding the retrieval tests (10 plus the 4).
- In a browser driven through Playwright, on a dev server it started itself on port 3017: loaded `/retrieval`, clicked the first example question ("Does writing destroy memory?", with the default two texts, top 4, "both" mode, 568 passages), waited for "What the search found", clicked "Ask Claude with these passages", waited 12 seconds, took a full-page screenshot, and read it. The screenshot (`/Users/mk/.claude/playwright-output/retrieval.png`, still on disk when I checked) shows a real Claude answer that cites passages [1], [3], and [4] and ends with the claim that writing "weakens memory and breeds a false appearance of wisdom, not that it literally destroys memory." The browser console had 0 errors and 0 warnings when it was checked, but that check ran about a second after the click on the Claude button, before the answer had finished.

What it did not test, and I did not either:

- **The Markdown fix was never looked at.** The screenshot showed the answer as raw Markdown (literal `**` marks and hyphen lists). The thread then swapped the answer's `<p>` for `react-markdown` and changed `.rag-reply` styles, ran `pnpm test`, and committed. It did not reload the page or take another screenshot, so whether the answer now renders correctly is unverified.
- **Only one question and one Claude answer.** None of the other four example questions was run in the browser, nor any with Frankenstein, *Laughter*, *Dorian Gray*, or *Intentions* checked (only the Node-side check above touched them).
- **Not exercised in the browser:** the "keep the top" slider, the keywords-only and meaning-only modes, editing the instructions, a stop during streaming, "Add your own text" (so the in-browser embedding of pasted text, the `scale: 1` path for Float32 vectors, and the "Embedding passage N of M" progress line have never run), and the error path when there is no key or the route fails.
- **First-load behavior was not measured.** The "about 23 MB, once" figure for the embedding model, and the page's download-progress message, are the thread's statement in the page and doc; I found no measurement in the transcript, and on a cold cache or a slow machine the first search will wait for that download. The board already lists the slow-computer question as open for Marlon.
- **No other browsers or small screens.** Chromium only; the module Worker path was not tried elsewhere, and the layout was not checked at phone width (the CSS has a grid, but the thread did not look).
- **The facts in the document were not checked.** The doc says custom GPTs, Gems, and Claude Projects got "knowledge files" "from late 2023", cites Lewis et al. 2020 as "in the course's AI papers", and gives the 384-number embedding size. The 384 matches `DIMS`; the date and the paper placement have no "(verify)" mark, although rule 6 asks for one on facts nobody checked. Likewise the Gutenberg provenance in the manifest is copied from the course repo's frontmatter and the public-domain status of each text was not independently checked. The doc's "What it is not" paragraph, that OpenAI's, Google's, and Anthropic's retrieval systems use their own models, passage sizes, and re-ranking "which they have not fully documented", is a claim about those vendors the thread did not look up.
- **A small overstatement in the thread's summary.** It told Marlon "the keyword search mostly pulls up stage directions from R.U.R." In the screenshot all four keyword hits are from R.U.R. Act Two and Act Three (BM25 4.97, 4.75, 4.61, 4.53), but only the fourth is essentially all stage direction; the others are dialogue with stage directions inside. The meaning-search claim does hold: the screenshot shows two Jowett introduction passages (0.400, 0.367) above Plato's own "father of letters" passage (0.348), with the cut-off at 0.345 and the next passage at 0.335.
- **Housekeeping left open:** the repo `README.md` route table does not list `/retrieval` (grep finds no mention), and the thread did not touch the board; the orchestrator has since added the board row and the brief.
- The thread's dev server on port 3017 was started in the background and, per its final message, was still running when it finished. I did not check whether it still is.

## 5. For other tasks

- **Y (`/knowledge-voice`):** import from `lib/retrieval/core.mjs` and read `public/retrieval/*.json`; do not edit them. `chunk(text)` gives `[{heading, text}]`; stored vectors decode with `decodeVectors` and score with `cosine(queryVector, vectors, passageIndex, 127)`; vectors for pasted text are Float32 and use scale 1. The query vector must come from the same model, which `lib/retrieval/embed-worker.js` provides (`postMessage({ id, texts })`, replies `progress`, `done` with `vectors`, or `error`). `buildSystem(instructions, results)` takes results with `title`, `heading`, `text`.
- **B (`/api/chat`):** `/retrieval` sends `{ system }` as the extra body field on `sendMessage` (AI SDK `useChat` with `DefaultChatTransport({ api: "/api/chat" })`), and it worked against Claude on 2026-10-20 in the one run above. That is the first live confirmation of that path in this repo's records (earlier reports said no key had been tried).
- **V (QA of everything built) and the MVP path:** the page is a candidate for today's session. The things the thread did not test (section 4) are what V should check, in particular the Markdown rendering of the answer, "Add your own text", and the first-load model download on a classroom laptop.
- **R (cleanup):** the new tests are in `pnpm test` already (14 pass in the thread's run).
- **Course repo:** `build-retrieval-index.mjs` reads `../../eng-298ai-context/...` and works only where that repo sits as a sibling of this one, as in The Notebook's `apps/`. The thread's attempt to push `eng-298ai-context` failed (GitHub answered "Repository not found" for the `mkuzmick` account; the thread suspected a pending invitation or no write access) and it left `mk/czech-rur` merged into local `main` but unpushed; The Notebook's pointer to that repo is still uncommitted.

## 6. Marlon's words

Two messages in the thread, quoted exactly (the second answers the thread's own list of four options: 1 tidy and push, 2 prepare the session, 3 build the retrieval explainer, 4 start the public student repo):

> help me on the repos (and in the planning folder) for English 298

> let's do 1 for sure. and then give 3 a shot.

The request for a retrieval explainer with the retrieved passages and similarity scores comes from `20261020-workshop-planning.md` in The Notebook (see the brief), not from words Marlon said in this thread.

## 7. Decisions and open questions

Decisions the thread made that someone might revisit:

- **It pushed and bumped the pointer without a separate instruction.** Rule 7 says not to push or bump the Notebook's pointer unless Marlon says. Marlon asked for item 1, which covered pushing the 38 waiting commits; the thread also pushed the new `/retrieval` commit and committed and pushed the pointer `c8baff6` as part of the same session. It did not discuss this with Marlon beforehand.
- **Corpus:** six Gutenberg texts only, so the corpus can be served from `public/`. Grice, Sacks, and the Chin *Analects* are left out; the thread said to rerun the build script to change the list.
- **Small embedding model** (MiniLM, 384 dimensions, q8) in the browser rather than a hosted embedding API, so searching needs no key and the thread's scores are cosine similarity in that one model. The page says a score is not a judgment of relevance, and not a calibrated probability.
- **Retrieval defaults:** about 700-character passages, top 4, the two texts Phaedrus and R.U.R. on by default.
- **Instructions in the prompt** tell Claude to use only the retrieved passages, cite by number, and say so if the passages do not contain the answer. Whether that holds when the passages are irrelevant has not been tried (the doc lists it as something for students to try).

Questions for Marlon: does the first-load model download need a "get ready" step before class (see the slow-computer to-do on the board)? Should the doc's two unmarked facts (the late-2023 date, the Lewis et al. placement) get a "(verify)" or be checked? Should `/retrieval` be in the repo README's route table?

**Thread:** `af8e0f99-ed1c-4614-8f71-9c311a99669f`, Claude Code, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `claude --resume af8e0f99-ed1c-4614-8f71-9c311a99669f` from that directory. The thread's own final message said the same and did not write a report file; its raw session is `~/.claude/projects/-Users-mk-Development-mk-27-apps-the-notebook/af8e0f99-ed1c-4614-8f71-9c311a99669f.jsonl`.
