---
task: "Y"
thread_id: "01a158f2-d011-7c53-a5de-f43a5bfa592b"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158f2-d011-7c53-a5de-f43a5bfa592b"
status: "working prototype; live five-cell comparison tested"
date: 2026-10-20
---

## What I built

The `/knowledge-voice` experiment, entirely within the task's owned route folder and experiment document:

- `nextjs/app/knowledge-voice/page.jsx`: shared `ExperimentPage` wrapper and server-side key-presence check; passes a boolean, never the key.
- `nextjs/app/knowledge-voice/KnowledgeVoice.jsx`: one question, selectable course text, plain/persona × no files/files grid, exact prompt toggles, independent streamed answers, server-confirmed prompt/model metadata, cancellation, error messages, and a student reflection field.
- `nextjs/app/knowledge-voice/comparison.mjs`: the prompt conditions and BM25 retrieval, importing `bm25`, `keywordIndex`, `topK`, and `buildSystem` from the shared retrieval library.
- `nextjs/app/knowledge-voice/comparison.test.mjs`: four tests covering condition isolation, shared evidence, absent keyword matches, the fifth condition, and retrieval against the existing Frankenstein corpus.
- `nextjs/app/knowledge-voice/knowledge-voice.css`: scoped route styles, with a two-column desktop comparison and a single column on narrow screens.
- `nextjs/content/experiments/knowledge-voice.md`: `route: /knowledge-voice`, `status: working`, `order: 24`, instructions, limitations, and the required final “How this was made” section.

The presets are agent-written rehearsal directions for the creature, Lord Henry, and Socrates, explicitly labeled as interpretations. Students can write a fourth voice. Both files conditions receive exactly the same up-to-three passages and numbered references. Voice directions are identical across the persona row. Shared length/evidence instructions remain the same across all four cells.

The optional fifth condition pastes those same passages into a voice-examples block, with no retrieved evidence or named persona. It asks for diction, syntax, rhythm, and stance rather than factual support. The page explicitly says this instruction cannot guarantee the text's facts have no influence, and that passages may contain a narrator or multiple speakers. If retrieval finds no matching words, the fifth condition is omitted.

Setup edits do not silently change a prepared run. Repeated requests replace the answers and send only that run's single question; previous assistant replies never become history. The reflection remains in memory only and is cleared when preparing a new comparison.

No shared application file, retrieval library, retrieval index, dependency, environment file, or orchestration board was edited. No push or Notebook submodule-pointer change was made. Commits use mkuzmick's configured author name and noreply email and name only task-owned paths.

## How to try it

http://localhost:3000/knowledge-voice

1. Keep the default Frankenstein question and creature voice, or choose another course text and voice.
2. Optionally enable the fifth-answer checkbox.
3. Click **Prepare the comparison**. Inspect the shared evidence and each card's **Show the prompt**.
4. Click **Ask Claude in all four cells** (or **all five cells**). Compare files across a row and voices down a column. After a request, the prompt toggle includes the model confirmed by the server.
5. Use **Stop all** to cancel; stopped text is labeled partial. Write a comparison in **What changed?**

No key is required to prepare prompts or inspect passages. If the server has no `OPENROUTER_API_KEY`, a notice explains the required `nextjs/.env.local` setup and server restart, and the answer button is disabled. No model fallback was added.

## Commits

- `2118f59` — Build first knowledge and voice four-cell comparison. Early working version, with actual-corpus retrieval/prompt smoke check; the route returned HTTP 200.
- `ab44711` — Add voice-example condition and validate comparison controls. Fifth condition, server prompt receipt, completion/cancellation labels, comparison tests, and working-status experiment notes.

This report is committed separately by its own path after those implementation commits.

## What I couldn't do or didn't check

**Checked:** a live five-cell comparison through the existing `/api/chat` route completed with five answers. The two files answers cited the supplied passage numbers; the persona answers changed the manner of speaking; the fifth returned an answer with passages assigned the role of voice examples. These are observations from one run, not a finding that the two axes separate cleanly.

**Automated checks:** `pnpm test` passed all 25 tests present at the final check (other agents added tests during this session). `node --test app/knowledge-voice/comparison.test.mjs` passed all four task-specific tests. `git diff --check` passed for the owned paths.

**Browser checks:** Playwright verified five prepared cards, exact displayed/submitted system prompts, the prepared question remaining fixed after an unsent edit, two five-request batches with one user message each and no prior history, empty retrieval producing four cards, custom voice placement, and Stop all returning all four cards to stopped status. HTTP 503 errors were simulated in the browser to verify readable missing-key errors in every card; delayed responses were simulated to verify cancellation. These simulations did not alter the shared endpoint or environment. Desktop and 390×844 screenshots were inspected, and a browser assertion found no horizontal overflow at 390px. Local captures are in gitignored `nextjs/output/playwright/knowledge-voice-desktop.png` and `knowledge-voice-mobile.png`; the desktop capture shows the simulated-error state rather than the live run.

The dev server was initially down; Marlon started it, and all browser tests used the shared server on port 3000. No additional server was started. A production build was not run against the shared active `.next` directory. I did not restart the server without its key, evaluate every corpus/persona combination against the live model, run a controlled sampling study, or test classroom use. Reflection export and persistence are not built. Retrieval is keyword BM25, not vector search.

The shared skip-to-content link appears over controls in full-page screenshots; this may be a focus/capture artifact. It was left unchanged because shared Chrome/styles are outside task Y's scope.

## For other tasks

- **T:** Imports the existing retrieval core and fetches the existing `public/retrieval/manifest.json` plus one selected corpus JSON. Retrieval files were not edited. No embedding worker or model download is needed for this version.
- **B:** Uses `useChat` and `DefaultChatTransport` with independent instances per cell, `body.system`, and a single fresh UIMessage. Consumes the existing transient `data-request` receipt for prompt/model confirmation. The live five-request batch worked.
- **R:** The four comparison tests are colocated under `app/knowledge-voice/`, so the current `pnpm test` glob does not pick them up; run the explicit command above. No shared package-script edit was made. Consider reviewing the shared skip-link behavior during visual QA.
- **V:** This is a working prototype at order 24, below the MVP experiments. The four-cell run makes four paid requests, or five with the extra condition. One live default comparison was checked; no classroom-ready claim is made.
- **Orchestrator:** The experiment document is `working`; update the board from this report. There is no missing-key blocker in the server configuration used for the successful live run.

## Marlon's words

Direct task instruction in this thread:

> Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/Y-knowledge-voice.md. Import from nextjs/lib/retrieval/ but don't edit it. Get a working first version committed early, then improve it. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9).

When the shared server was initially unreachable:

> it's running

The brief and workshop planning note supplied the content/form direction; the voice instructions and interface wording are Codex's implementation choices, not additional quotations from Marlon.

## Decisions and open questions

Use BM25 for a dependable first prototype with no embedding-model download, and link to `/retrieval` for the semantic-search comparison. Keep voice and file controls independent: selecting a persona never silently changes the corpus. Avoid unrelated zero-score passages. Preserve the prepared prompt and question until an explicit new preparation.

The fifth condition changes how the same text is labeled, not whether its content is present. The experiment cannot prove that facts are excluded from a style-only block. Literary presets are interpretations; selecting voice examples does not isolate a character's dialogue automatically. Model sampling and the absence of seed/temperature controls also limit causal claims. Possible follow-up work is semantic retrieval, student-selected voice excerpts, exportable comparisons, and repeated trials; these are proposals, not work requested or completed in this thread.

Resume from `/Users/mk/Development/mk-27/apps/the-notebook` with `codex resume 01a158f2-d011-7c53-a5de-f43a5bfa592b`. The implementation repository is its nested `apps/mk-chatbot-experiments/` checkout.
