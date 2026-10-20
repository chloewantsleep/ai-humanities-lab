# mk-chatbot-experiments — instructions for agents

## If a student forked this repo to redesign "Build a bot" (ENG 298AI, Oct 2026)

Most sessions in a fork are a student's. Their task: give `/build-a-bot` a new interface and submit their bot from it.

- **Edit only `nextjs/app/build-a-bot/BotPage.jsx`** (and new files beside it, such as a CSS file or components). It is the plain page shown after the Reset button. Don't change `contract.js`, `Watcher.jsx`, `watch.mjs`, `page.jsx`, `ResetShell.jsx`, or anything outside that folder; if the student asks for that, explain why not first.
- **The contract:** the page must call `submitBot(choices, catalog)` from `contract.js` with the keys `botName, studentName, prompt, pack, material, delivery` (and optional `extras`, long text, for anything else the design collects), and must keep `<Watcher choices={choices} catalog={catalog} />` on the page. A hook (`.claude/settings.json`) runs `watch.mjs` after each edit and reports drift; when it does, fix it and tell the student plainly what the Airtable table needs.
- **Setup:** Node 22+, pnpm. `cd nextjs && pnpm install && pnpm dev`, then open http://localhost:3000/build-a-bot and press Reset. The student pastes the instructor's three `AIRTABLE_*` lines into `nextjs/.env.local` (copy `.env.example` first). Never print, echo, or commit `.env.local`.
- For interface ideas, the site's `/history` page ("Interfaces") has screenshots of chat interfaces from 1966 to 2026.
- Everything below this section is for the course staff's own agents; a student can ignore it.


Read `README.md`, then the task board, `_context/orchestration/README.md`, before starting work; the app's own notes are in `nextjs/CLAUDE.md`. Use pnpm only. Keys live in the gitignored `nextjs/.env.local`; never print or commit them.

## How work is organized: one orchestrator, many task agents

Marlon runs several agents at once on this repo (Claude Code and Codex), directed by **one orchestrating agent** at a time (Marlon's convention, 2026-10-19). Everything they share is in `_context/orchestration/`:

- `README.md`: the board. The state of the app, the rules every agent follows (commit by path, report as a file, thread ID), the table of tasks with their status, and the to-dos.
- `tasks/<letter>-<name>.md`: one brief per task.
- `reports/<letter>-<name>.md`: one report per task, written by the agent that did it.
- `ORCHESTRATOR.md`: how to orchestrate, and the log of who has held the role, with each one's handoff.
- `tools/`: scripts for listing the day's agent sessions and condensing a transcript.

**If you were given a task** (Marlon pasted a prompt naming one): read the board, then your brief, do the task within the files it names, and write your report with your thread ID before you stop. Don't edit the board; the orchestrator updates it from your report.

**If Marlon asks you to orchestrate**, or to take over from the previous orchestrator: read `_context/orchestration/ORCHESTRATOR.md` first and follow "Taking over". Add yourself to its log, and before you're shut down, write your handoff there for the next one.

**If you're doing something else in this repo**, keep out of files a task owns (the board's table says which) unless Marlon says otherwise, and commit by path.
