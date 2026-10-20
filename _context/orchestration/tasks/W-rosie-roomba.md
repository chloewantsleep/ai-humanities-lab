---
task: "W"
title: "Rosie and Roomba: a page and a reusable presentation component"
status: "not started"
track: "prototype"
owns: "`nextjs/app/rosie-roomba/`, `nextjs/app/components/RosieRoomba.jsx` (and its CSS beside it), `nextjs/content/experiments/rosie-roomba.md`"
depends_on: "start now"
report: "../reports/W-rosie-roomba.md"
---
# W. Rosie and Roomba

Marlon's to-do from today's planning: "make the Rosie/Roomba comparison a page and an always-available, reusable React component that Marlon can add to any presentation." It belongs in the part of the session on where agents are going.

**The idea, in Marlon's words.** Read his October 2 dictation: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261019-gathered/from-other-repos/dictation-20261002-week-2-black-box.md` and the "Where agents are going" section of `.../humanities-ai-lab/20261020-workshop-planning.md`. Rosie is the humanlike robot maid holding a vacuum: the machine imagined as a person doing a person's job. The Roomba is a machine organized around the task, shaped by the floor, with no face. For agents working on text, the documents are the working ground, as the floor is the Roomba's. The chat persona is Rosie; the agent working through a folder of files is the Roomba. Also skim the August dictation on agents as flat characters: `.../humanities-ai-lab/dramaturgy-of-ai-dialogue/sources/dictation-20260808/1612-15-agents-as-flat-characters.md`.

**Build:**
- `app/components/RosieRoomba.jsx`: a self-contained component (its own CSS file beside it, no new dependencies) that presents the comparison visually and can animate: e.g. two panels, the humanoid figure walking the room with a vacuum vs. the disc tracing its coverage path across the floor; then the same split for text: a chat bubble persona vs. an agent's path through a grid of documents. Props for which beats to show, a compact mode for slides, and step-through (click or arrow keys) so Marlon can present it. Draw the figures yourself in SVG; don't use images of the Jetsons character or any brand's artwork.
- `/rosie-roomba`: the page that shows the component full size, with its document, and a short "use it in your own presentation" note (the import line and props).
- Keep Marlon's framing as his; label any extension you add as yours.

**Prototype track.** Marlon (2026-10-20): "continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." So: get a working first version up early and commit it, then improve. The experiment document is part of the deliverable: students will read it to see what was asked, what was built, and what is still rough. End it with a short "How this was made" section (agent, date, thread ID, what Marlon asked for, what is unfinished).

**Shared rules:** the board's rules apply. A new experiment is a document `nextjs/content/experiments/<name>.md` with `route:`, `status:`, `order:` (use 20 or above so the MVP experiments list first) plus a route folder `nextjs/app/<name>/` that wraps itself in `ExperimentPage` (copy the pattern in `app/retrieval/page.jsx`). Test against the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/`.

## When you finish

Write [`../reports/W-rosie-roomba.md`](../reports/W-rosie-roomba.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
