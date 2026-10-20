---
task: "S"
title: "/markov: a Markov chain over the course readings"
status: "not started"
track: "prototype"
owns: "`nextjs/app/markov/`, `nextjs/content/experiments/markov.md`"
depends_on: "start now"
report: "../reports/S-markov.md"
---
# S. The Markov chain

Marlon's planning for today lists the interactive history: ELIZA, GPT-2, and "Markov chains could be there. A full Markov-chain demonstration." The point is the step before neural language models: text generated purely from counts of what followed what.

**Build** `/markov`, entirely in the browser, no model download:
- Pick a corpus: one or more of the six course texts. Reuse the passages already served in `nextjs/public/retrieval/<id>.json` (read `lib/retrieval/core.mjs` and the build script to see the format) rather than copying texts again; or let the student paste their own text.
- Word-level and character-level modes; an order slider (1–5 words, or 1–10 characters).
- Generate step by step and run continuously. At each step show the current state (the last n words), the table of what followed it in the corpus with counts, and which one was drawn. Clicking a word in the output shows where in the source that sequence came from.
- At higher orders the chain starts copying the source verbatim: show that (highlight runs copied word for word from one passage). That is the discovery for students.
- A short paragraph linking the page to the history (Shannon 1948 used letter and word n-grams to approximate English; mark dates and claims "(verify)" unless you check them) and to the spiral room and GPT-2.

**Prototype track.** Marlon (2026-10-20): "continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." So: get a working first version up early and commit it, then improve. The experiment document is part of the deliverable: students will read it to see what was asked, what was built, and what is still rough. End it with a short "How this was made" section (agent, date, thread ID, what Marlon asked for, what is unfinished).

**Shared rules:** the board's rules apply. A new experiment is a document `nextjs/content/experiments/<name>.md` with `route:`, `status:`, `order:` (use 20 or above so the MVP experiments list first) plus a route folder `nextjs/app/<name>/` that wraps itself in `ExperimentPage` (copy the pattern in `app/retrieval/page.jsx`). Test against the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/`.

## When you finish

Write [`../reports/S-markov.md`](../reports/S-markov.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
