---
task: "Z"
title: "/tics: the writing habits of language models, and Bergson's mechanical"
status: "not started"
track: "prototype"
owns: "`nextjs/app/tics/`, `nextjs/content/experiments/tics.md`"
depends_on: "start now"
report: "../reports/Z-tics.md"
---
# Z. Tics

Marlon's observation (Oct 19 canvas, `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/canvas-20261019-opus-for-english-298-bots.md`, his additions): LLMs overuse antithesis and binary oppositions ("It's not X, it's Y"), moves he once taught as effective writing. Mechanical repetition connects to Bergson's *Laughter*: the comic as "something mechanical encrusted on the living." Read the canvas first, and keep his observation, the Bergson link, and any explanation separate: the claim that reward optimization *causes* these tics is an interpretation to investigate, not a fact to put on the page.

**Build** `/tics`, no key needed for the core:
- Paste any text; the page highlights candidate tics with a legend and counts per 1,000 words: "not X but Y" / "it's not just X, it's Y" antithesis, triads ("A, B, and C" in a row), em-dash pivots, "delve"-type vocabulary, rhetorical questions answered at once, closing summaries ("In short, …"). Pattern matching is crude: say so on the page and show each match so students can judge false positives.
- Built-in samples to compare: a passage from Bergson's *Laughter* itself (public domain, in `public/retrieval/laughter.json`) and one or two other public-domain passages; and slots for model-written text that a student pastes. If you include model-written samples you generate, label them with the model and date.
- A Bergson panel: one or two short quotations from *Laughter* (from the Gutenberg text, cited) on repetition and the mechanical, and a question for students rather than a conclusion.

Optional, if `OPENROUTER_API_KEY` is present: a "write me one" button that asks Claude for a short essay on a course topic and runs the detector on it.

**Prototype track.** Marlon (2026-10-20): "continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." So: get a working first version up early and commit it, then improve. The experiment document is part of the deliverable: students will read it to see what was asked, what was built, and what is still rough. End it with a short "How this was made" section (agent, date, thread ID, what Marlon asked for, what is unfinished).

**Shared rules:** the board's rules apply. A new experiment is a document `nextjs/content/experiments/<name>.md` with `route:`, `status:`, `order:` (use 20 or above so the MVP experiments list first) plus a route folder `nextjs/app/<name>/` that wraps itself in `ExperimentPage` (copy the pattern in `app/retrieval/page.jsx`). Test against the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/`.

## When you finish

Write [`../reports/Z-tics.md`](../reports/Z-tics.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
