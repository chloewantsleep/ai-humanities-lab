---
task: "R"
title: "Cleanup after the first wave"
status: "not started"
track: "MVP for the October 20 workshop (small fixes students would trip on)"
owns: "glossary entries, READMEs, `nextjs/package.json` test script"
depends_on: "start now"
report: "../reports/R-cleanup.md"
---
# R. Cleanup after the first wave

Added 2026-10-19 from the reports in `_context/orchestration/reports/`. Small fixes, one commit each kind:

- **Missing glossary entries** that others already link to: `persona-and-dialogue/parasocial-relationship.md` (linked from the Replika, Pi, and Character.AI entries), `persona-and-dialogue/shoggoth.md` (from `simulators.md` and `the-picture-of-dorian-gray.md`), and `interfaces-and-agents/voice-assistant.md` (from `dr-sbaitso.md`). Write them in the glossary format and add them to their folder READMEs.
- **A wrong link:** `models-and-training/embedding.md` links to `interfaces-and-agents/retrieval.md`; the entry is `retrieval-rag.md`.
- **Stale labels:** about 20 entries in `interfaces-and-agents/` and its README call `/layers` and `/mini-claw` "proposed"; the repo README's route table says `/eliza` is "not built yet". Update them to what's built, using the reports.
- **A stale status:** `chatbots/character-ai.md` says `status: active` while citing the 13 October 2026 Chapter 11 filing; decide from the source what status is honest and say why.
- **Tests:** add H's mini-claw test to `pnpm test` (the script in `nextjs/package.json` only globs `tests/*.test.mjs`), and add a test that every relative link in `content/glossary/` resolves, so the next dangling link is caught.
- Leave the readings page and readings ids to P, and the screenshots to K.

Write `_context/orchestration/reports/R-cleanup.md` when done.

## When you finish

Write or update [`../reports/R-cleanup.md`](../reports/R-cleanup.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
