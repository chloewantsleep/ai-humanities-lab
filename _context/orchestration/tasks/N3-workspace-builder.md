---
task: "N3"
title: "The workspace builder"
status: "not started"
owns: "`nextjs/app/claw/build/`, `nextjs/content/claws/`"
depends_on: "N1 (a draft can start from the brief)"
report: "../reports/N3-workspace-builder.md"
---
# N3. The workspace builder

Read [the workbench's shared brief (what a claw is, the material in hand, and the safety rules)](N-claw-workbench.md) first: it applies to this task.

At `/claw/build`: a form that writes a claw's workspace as Markdown files into `nextjs/content/claws/<name>/` (so every file is also readable as a page at `/claws/<name>/...`, and the agent's own edits show up there later). One editor per file, matching N1's file set, with a short note beside each on what that file does; a live preview of the context the model would receive, assembled in the real order, with a size count per file; and presets: OpenClaw's defaults (from N1), Frankenstein's creature, the dramaturg (one hard question about your project), a Socratic interlocutor, and the "Course TF Assistant" from the history screenshots. Duplicating and renaming a workspace should be easy. A draft can start from this brief before N1 lands; match N1's file set once it does. Writes stay inside `nextjs/content/claws/`.

## When you finish

Write or update [`../reports/N3-workspace-builder.md`](../reports/N3-workspace-builder.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
