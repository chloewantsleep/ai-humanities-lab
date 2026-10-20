---
task: "N1"
title: "Research: how OpenClaw and Hermes Agent work"
status: "not started"
owns: "`nextjs/content/agents/research/`"
depends_on: "start now"
report: "../reports/N1-claw-research.md"
---
# N1. Research: how OpenClaw and Hermes Agent work

Read [the workbench's shared brief (what a claw is, the material in hand, and the safety rules)](N-claw-workbench.md) first: it applies to this task.

Read the source repositories and official docs (not secondary coverage) and write up the anatomy precisely, with links to the exact files and commits you read. For each project: what files make up an agent's workspace (for OpenClaw, check for `AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`, `MEMORY.md`, dated memory logs, `BOOTSTRAP.md`, and skills; for Hermes, whatever its equivalents are); what each file is for and what the default template says (quote short passages with the project's license noted); the order and way they are assembled into the model's context on each turn, and any size limits or truncation; which files the agent is told to edit itself, and how; how memory is written, summarized, and recalled; the heartbeat or scheduled-task mechanism; channels and the gateway; skills, including Hermes's self-written ones; sessions and compaction; and how the security record (from J's fact-check) relates to that design. Add a comparison table: OpenClaw, Hermes, Claude Code (CLAUDE.md / AGENTS.md, skills, memory, hooks), and H's mini-claw. Output to `nextjs/content/agents/research/`, one file per project plus the comparison; commit early and update as you go, because N2, N3, N7, and N8 build on it. Mark anything you couldn't confirm in the source "(verify)".

## When you finish

Write or update [`../reports/N1-claw-research.md`](../reports/N1-claw-research.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
