---
task: "R — Cleanup after the first wave"
thread_id: "01a158ec-ed11-7b20-a21f-ac0e942d771a"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158ec-ed11-7b20-a21f-ac0e942d771a"
status: "complete"
---

# R: Cleanup after the first wave

## What I built

- Added glossary entries for parasocial relationship, shoggoth, and voice assistant, with sources, cross-links, try-it exercises, and category README rows.
- Fixed embedding’s relative link to `interfaces-and-agents/retrieval-rag.md`.
- Updated the interfaces-and-agents README and glossary labels for the built `/layers` and `/mini-claw` interfaces, while preserving the distinction between implemented software and verified live-model behavior. Corrected the stale sandbox and lethal-trifecta descriptions using H’s implementation/report.
- Changed Character.AI’s status to “operating during Chapter 11 sale; future uncertain.” Its own 12 October announcement confirms continued service and a possible wind-down. Added that primary source and removed the short definition’s implication of a completed Disney sale. The original Verge URL was inaccessible in this session.
- Added H’s four mini-claw tests to `nextjs/package.json`’s test script. Added `nextjs/tests/glossary-links.test.mjs`, which uses the app’s Markdown parser to check relative links and images throughout the glossary, including reference-style links. A regression fixture confirms missing destinations are caught and inline code/external URLs/site routes are excluded.
- The repo README already listed ELIZA as built when I read it; no change was needed there.

## How to try it

Use the existing server at http://localhost:3000:

- `/glossary/persona-and-dialogue/parasocial-relationship`
- `/glossary/persona-and-dialogue/shoggoth`
- `/glossary/interfaces-and-agents/voice-assistant`
- `/glossary/interfaces-and-agents`
- `/glossary/chatbots/character-ai`

From `nextjs/`, run `pnpm test`: 20 pass, 0 fail, including the four mini-claw tests and two new link checks. All five URLs above returned HTTP 200 from the existing server. All relative glossary link/image destinations resolve on disk. `git diff --check` passed at verification time.

## Commits

All authored as mkuzmick with Marlon’s noreply email; committed by path. No push or Notebook submodule-pointer update.

- `024bd8a` — Fill missing glossary entries and repair retrieval link.
- `738e74f` — Refresh built experiment labels and qualify Character.AI status.
- `31b59d7` — Run mini-claw tests and validate relative glossary links.
- This report is committed separately under a documentation commit.

## What I couldn't do or didn't check

No live Claude calls, screenshot changes, readings changes, production build, or browser visual QA. The tests do not validate external URLs, root-relative app routes, fragment IDs, or glossary frontmatter’s semantic IDs; they validate relative Markdown destinations on disk. The shoggoth entry cites secondary meme documentation and makes no exact-origin claim. Existing unrelated Character.AI historical claims were not comprehensively re-audited.

## For other tasks

- **H/N4:** mini-claw’s test now runs with `pnpm test`; keep its path in the script if moving it.
- **L/P:** new relative glossary links and images must resolve on disk. Readings IDs and the readings page remain P’s responsibility.
- **K:** screenshots were untouched.
- **V/orchestrator:** built-interface labels are current; live-model testing remains a separate check. Other agents’ retrieval, spiral, Rosie/Roomba, and workshop changes were left out of these commits. Board unchanged.

## Marlon's words

> Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/R-cleanup.md. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9).

> server is running

## Decisions and open questions

The Character.AI status follows its [primary announcement](https://blog.character.ai/an-update-on-character-ai/), checked 2026-10-20: operating during a conditional sale process, rather than closed or unqualified active. No decision from Marlon is needed for this cleanup.

Resume from the starting directory `/Users/mk/Development/mk-27/apps/the-notebook` with `codex resume 01a158ec-ed11-7b20-a21f-ac0e942d771a`; the task repository is its `apps/mk-chatbot-experiments` submodule.
