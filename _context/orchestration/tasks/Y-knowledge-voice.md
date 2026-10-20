---
task: "Y"
title: "/knowledge-voice: what the files give a bot, and what the instructions give it"
status: "not started"
track: "prototype"
owns: "`nextjs/app/knowledge-voice/`, `nextjs/content/experiments/knowledge-voice.md`"
depends_on: "T (/retrieval, done; import from `lib/retrieval/`, don't edit it), B (`/api/chat`)"
report: "../reports/Y-knowledge-voice.md"
---
# Y. Knowledge and voice

Marlon wants to "play up content versus form": what a source corpus gives a custom chatbot to know or retrieve, compared with the style, manner, or persona of its answers. His point is that the corpus-upload custom GPT mostly handles **knowledge**, and that constructing a **voice** is different. Read "Knowledge, style, and form" in `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261020-workshop-planning.md`. The note warns: investigate the distinction, don't claim files affect only content or instructions only style. Retrieved passages carry a voice too (ask a Frankenstein-loaded bot anything and see).

**Build** `/knowledge-voice`: one question, a 2×2 grid of answers: no files / files (retrieval over a course text, using `lib/retrieval/core.mjs` and the index in `public/retrieval/`) × plain assistant / a persona (presets: a few from the readings, e.g. the creature, Lord Henry, Socrates, plus a student-written one). Each cell shows the exact prompt it sent (a "show the prompt" toggle) and the answer. Then a small "what changed?" prompt for the student. Add a fifth option if it's quick: the persona written *from* the files (style examples pasted as voice, not as facts).

Answers come from Claude through the shared `/api/chat` route, which needs `OPENROUTER_API_KEY` in `nextjs/.env.local`. If there's no key when you test, build and test everything up to the call, make the page say plainly that answers need the key, and say so in your report. Optionally, a tiny browser instruct model (from task A's engine) as a no-key fallback, labeled as much weaker.

**Prototype track.** Marlon (2026-10-20): "continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." So: get a working first version up early and commit it, then improve. The experiment document is part of the deliverable: students will read it to see what was asked, what was built, and what is still rough. End it with a short "How this was made" section (agent, date, thread ID, what Marlon asked for, what is unfinished).

**Shared rules:** the board's rules apply. A new experiment is a document `nextjs/content/experiments/<name>.md` with `route:`, `status:`, `order:` (use 20 or above so the MVP experiments list first) plus a route folder `nextjs/app/<name>/` that wraps itself in `ExperimentPage` (copy the pattern in `app/retrieval/page.jsx`). Test against the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/`.

## When you finish

Write [`../reports/Y-knowledge-voice.md`](../reports/Y-knowledge-voice.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
