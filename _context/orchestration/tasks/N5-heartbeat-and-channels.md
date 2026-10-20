---
task: "N5"
title: "Heartbeat and channels"
status: "not started"
owns: "`nextjs/lib/claw/heartbeat/`, `nextjs/app/claw/channels/`"
depends_on: "N4"
report: "../reports/N5-heartbeat-and-channels.md"
---
# N5. Heartbeat and channels

Read [the workbench's shared brief (what a claw is, the material in hand, and the safety rules)](N-claw-workbench.md) first: it applies to this task.

The two things that make a claw feel alive when you're not talking to it. **Heartbeat:** a "tick" button and an optional timer (off by default, and only while the page is open) that runs the workspace's `HEARTBEAT.md` checklist the way N1 found the real one does, and logs what the agent did on its own. **Channels:** a mock messaging surface in the browser, two or three fake "apps" or contacts whose messages reach the same agent, to show the gateway idea; no real accounts. Depends on N4.

## When you finish

Write or update [`../reports/N5-heartbeat-and-channels.md`](../reports/N5-heartbeat-and-channels.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
