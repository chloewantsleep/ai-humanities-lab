---
task: "E"
title: "The persona dial"
status: "not started"
owns: "`nextjs/app/persona-dial/`"
depends_on: "B, F"
report: "../reports/E-persona-dial.md"
---
# E. The persona dial

Brief: `content/experiments/persona-dial.md`. Uses B's shell, and F's engine as the alternative to Claude. Switches for name and avatar, typing indicator, first-person feelings language, and callbacks to earlier remarks; each switch changes only presentation or the system prompt, never the model. A 1–5 "how alive does this feel?" rating per configuration, kept in the browser for the session. A "pull back the curtain" button showing the raw text the model received.

## When you finish

Write or update [`../reports/E-persona-dial.md`](../reports/E-persona-dial.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
