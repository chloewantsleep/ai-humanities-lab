---
task: "H"
title: "Mini-claw"
status: "partly done (the Claude path has never run: no key yet)"
owns: "`nextjs/app/mini-claw/`, `nextjs/app/api/mini-claw/`, `mini-claw/` at the repo root"
depends_on: "B (for the model call)"
report: "../reports/H-mini-claw.md"
---
# H. Mini-claw

Brief: `content/experiments/mini-claw.md`. A server-side agent loop (AI SDK tool calling through OpenRouter) with a workspace at the repo root: `mini-claw/memory.md` (read at the start, appended to by the agent), `mini-claw/skills/*.md` (instructions it can choose to load), and **one** tool. The tool must be safe on Marlon's laptop: no shell, no network, writes only inside `mini-claw/`. A trace view on `/mini-claw` shows every step (what the model received, the tool call, the result). Finish with a short side-by-side in the doc: mini-claw's parts and Claude Code's (CLAUDE.md, skills, tools, the loop).

## When you finish

Write or update [`../reports/H-mini-claw.md`](../reports/H-mini-claw.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
