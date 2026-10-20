---
task: "M"
title: "A scrollytelling essay: the history of the chatbot"
status: "done: a full first draft at /story"
owns: "nextjs/app/story/, nextjs/content/story/"
depends_on: "start now (writing and scroll mechanics); J, L1, F, A for the finished version"
report: "../reports/M-story.md"
---
# M. A scrollytelling essay: the history of the chatbot

A long essay at `/story` that tells the history of the chatbot as the argument of the whole project: from imagined artificial speakers (Plato's worry in the *Phaedrus* that writing can't answer back, Frankenstein's creature asking to be heard, Čapek's robots) through ELIZA, the base model that spirals, the assistant written into a document, post-training, ChatGPT, Sydney, the configuration era, and the agents of 2026. Marlon's own framing comes first: read his planning in The Notebook at `_context/projects/50-in-focus/humanities-ai-lab/` (especially `generation-of-person-essay.md`, `mk-ideas.md`, and `dramaturgy-of-ai-dialogue/`) and the planning note `_context/projects/50-in-focus/mk-chatbot-experiments/20261019-base-to-assistant-ideas.md`.

- **Text:** Markdown in `nextjs/content/story/`, one file per chapter, so Marlon can edit the prose without touching code. Each chapter is a series of steps; each step's frontmatter or a simple marker names what the sticky panel shows (a screenshot, a quotation, a live demo, a timeline position). Write the prose for a humanities reader, in the course's terms, and cite both sets of readings: Martin's course texts (`../eng-298ai-context/_context/course-readings/`) and the 22 AI papers Marlon selected (`../eng-298ai-context/_context/LL-readings/`).
- **Mechanics:** a sticky visual panel beside scrolling text (IntersectionObserver, no heavy library; plain CSS in `app/story/story.css`), a running timeline that advances with the reader, and a single-column layout on phones. Respect `prefers-reduced-motion`. `/print/story` should still give a readable printed essay.
- **Reuse, don't rebuild:** screenshots from `content/history/_images/`; dates and sources from J's `content/history/fact-check.md` and the chatbot entries in `content/glossary/chatbots/` (L1); glossary links for terms; and, as they land, live embeds: ELIZA (F, `lib/eliza/`) and a small base-model spiral (A, `lib/browser-lm/`). Until a live piece exists, show a screenshot or a placeholder in its place.
- Draft the prose first and commit it early so Marlon can read and react; mark claims not yet confirmed "(verify)".

## When you finish

Write or update [`../reports/M-story.md`](../reports/M-story.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
