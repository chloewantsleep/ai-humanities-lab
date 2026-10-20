---
task: "X"
title: "Reading rooms: one interaction for each reading so far"
status: "not started"
track: "prototype (design first, then build two)"
owns: "`nextjs/app/reading-rooms/`, `nextjs/content/experiments/reading-rooms.md`, `_context/reading-rooms/` (new)"
depends_on: "start now"
report: "../reports/X-reading-rooms.md"
---
# X. Reading rooms

Marlon (today's planning): he wants "an appropriate interaction for every reading so far," each usable on its own, apart from the larger history. "A custom chatbot for each reading is one possible form, not a settled design for every reading."

**Readings through today** (from the syllabus, `/Users/mk/Development/mk-27/apps/the-notebook/apps/eng-298ai-context/_context/course-readings/syllabus.md`): Shelley, *Frankenstein* (ch. 10–15 required); Wilde, *Dorian Gray* (*The Critic as Artist* recommended); Čapek, *R.U.R.* (Bergson's *Laughter* recommended; Beguš, *Artificial Humanities*); Plato, *Phaedrus* (257c on; Confucius, *Analects*); Sacks, Schegloff and Jefferson on turn-taking, and Grice, "Logic and Conversation"; Shanahan, McDonell and Reynolds, "Role Play with Large Language Models" (today). Texts are in that repo's `course-readings-md/`. Also read the Oct 19 canvas and Marlon's ideas: `.../humanities-ai-lab/canvas-20261019-opus-for-english-298-bots.md` and `.../humanities-ai-lab/mk-ideas.md` (skim for reading-specific ideas).

**Step 1, design** (`_context/reading-rooms/design.md`): for each reading, two or three candidate interactions, each grounded in something specific in the text (a scene, an argument, a form), and one recommendation. Think beyond "chat with the character": e.g. the creature learning language by overhearing the De Laceys (a model that only knows what it overheard); the portrait that records what the conversation hides; Theuth offering writing to Thamus (a tool that answers but cannot defend itself); a turn-taking room where overlap and gaps are visible; a Gricean maxim breaker; role play vs. simulation from Shanahan. Say what each would need (no model, a browser model, Claude through `/api/chat`).

**Step 2, build two** at `/reading-rooms` (an index) and `/reading-rooms/<slug>`: pick the two that are most specific to their texts and buildable in an hour or two, prefer ones that work without a key, and commit each when it works. Quote only public-domain texts on the page; for Grice, Sacks et al., and Shanahan (in copyright), paraphrase and cite.

**Prototype track.** Marlon (2026-10-20): "continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." So: get a working first version up early and commit it, then improve. The experiment document is part of the deliverable: students will read it to see what was asked, what was built, and what is still rough. End it with a short "How this was made" section (agent, date, thread ID, what Marlon asked for, what is unfinished).

**Shared rules:** the board's rules apply. A new experiment is a document `nextjs/content/experiments/<name>.md` with `route:`, `status:`, `order:` (use 20 or above so the MVP experiments list first) plus a route folder `nextjs/app/<name>/` that wraps itself in `ExperimentPage` (copy the pattern in `app/retrieval/page.jsx`). Test against the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/`.

## When you finish

Write [`../reports/X-reading-rooms.md`](../reports/X-reading-rooms.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
