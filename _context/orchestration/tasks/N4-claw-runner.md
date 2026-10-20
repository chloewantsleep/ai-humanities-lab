---
task: "N4"
title: "The runner"
status: "not started"
owns: "`nextjs/app/claw/run/`, `nextjs/app/api/claw/`, `nextjs/lib/claw/`"
depends_on: "H, N3"
report: "../reports/N4-claw-runner.md"
---
# N4. The runner

Read [the workbench's shared brief (what a claw is, the material in hand, and the safety rules)](N-claw-workbench.md) first: it applies to this task.

At `/claw/run/<name>`: run a workspace in a loop that mimics a claw. Assemble the context from the workspace files the way N1 found the real one does; chat with it; give it file tools scoped to its own folder only (read, write, edit, append to today's memory log), so it can update its own `MEMORY.md`, `USER.md`, or `SOUL.md` when its instructions say to; load skills on demand; and show a trace of every step with a diff view of any file it changed. Build on H's loop (`nextjs/app/api/mini-claw/` and whatever it factors out) and B's chat route conventions; the server code goes in `nextjs/lib/claw/` and `nextjs/app/api/claw/`. Resolve and check every path so nothing escapes the workspace; test that. Depends on H and N3.

## When you finish

Write or update [`../reports/N4-claw-runner.md`](../reports/N4-claw-runner.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
