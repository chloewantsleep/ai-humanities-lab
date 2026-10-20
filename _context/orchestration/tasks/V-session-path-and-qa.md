---
task: "V"
title: "Today's path through the site, and a classroom test of everything already built"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/content/workshop/README.md` (new), small fixes in routes no running task owns (see below)"
depends_on: "start now; a second pass after C and D land"
report: "../reports/V-session-path-and-qa.md"
---
# V. The session path and classroom QA

**Why.** Class is today. Marlon wants an MVP "prepped and tested well." Built is not the same as classroom-ready.

**Part 1: the path page.** Write `nextjs/content/workshop/README.md` (renders at `/workshop`): a short page that walks a student through today's site in order, one line of "what to try" and one of "what to notice" per stop, linking each route. A draft order to start from (an agent proposal Marlon liked, not his decision): ELIZA (`/eliza`) → a base model that just continues (`/spiral`) → the assistant written into the prompt (`/by-hand`) → knowledge files (`/retrieval`) → the layers around a modern model (`/layers`) → build your own in Claude Desktop (`/workshop/claude-desktop`, task U) → the glossary and history for later. Read Marlon's planning note first: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261020-workshop-planning.md`. Mark the page a draft at the top ("proposed path, 2026-10-20"). Link routes that don't exist yet; they'll land during the morning.

**Part 2: test everything already built,** as a student would, in a real browser against the shared dev server at http://localhost:3000 (don't start a second dev server in `nextjs/`; if 3000 is down, say so and wait). Routes: `/` (home), `/eliza`, `/engine`, `/retrieval`, `/chat-demo`, `/layers`, `/mini-claw`, `/glossary`, `/history`, `/story`, and `/print` of one page from each. For each: does it load, do the first three things a student would click work, what breaks with a cold cache, how long are model downloads (measure), what happens at 1024px wide and on a phone-width window, console errors. Without `OPENROUTER_API_KEY`, the Claude paths should fail with a clear message, not a crash: check that, and check them for real if the key has appeared.

**For `/retrieval` specifically,** read [T's report](../reports/T-retrieval.md): only one question on two texts was tested live. Cover what it lists as untested (the other texts and questions, the slider, keyword-only and meaning-only modes, "Add your own text", the answer's Markdown rendering, the no-key error, first-load download time, phone width).

**Fixes:** fix small, clear bugs yourself in routes no running task owns (`eliza`, `engine`, `retrieval`, `chat-demo`, `layers`, `mini-claw`, `history`, the home page), one commit per fix, listed in the report. Don't touch `spiral` or `by-hand` (C and D own them), `glossary` (R), or shared files beyond a one-line fix. Anything bigger: write it up in the report as a proposed task.

**Part 3, when C and D have reported** (the orchestrator will tell Marlon to resume you): test `/spiral` and `/by-hand` the same way and update the report.

**The report** is the classroom-readiness sheet Marlon reads before class: each route green / yellow / red, with the one-line reason, and a list of "if X fails in class, do Y" fallbacks.

## When you finish

Write [`../reports/V-session-path-and-qa.md`](../reports/V-session-path-and-qa.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
