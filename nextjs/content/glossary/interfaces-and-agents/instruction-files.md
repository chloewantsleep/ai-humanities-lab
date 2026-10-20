---
term: "CLAUDE.md / AGENTS.md"
slug: "instruction-files"
short: "Repository files that give a coding agent written project instructions."
aliases: ["CLAUDE.md", "AGENTS.md", "repository instructions"]
category: "interfaces-and-agents"
see_also: ["custom-instructions", "skills", "permissions", "claude-code"]
readings: ["plato-phaedrus"]
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# CLAUDE.md / AGENTS.md

**Repository files that give a coding agent written project instructions.**

## In plain terms

CLAUDE.md is Claude Code’s project-instruction file; AGENTS.md is a convention used by coding agents. Exact discovery and precedence depend on the tool and version, so check the tool’s documentation.

In this app, nextjs/CLAUDE.md begins with @AGENTS.md. A student can inspect that explicit connection rather than assume every agent discovers both names identically. A written rule guides behavior; enforced permissions determine access.

## In the readings

[*Phaedrus*, 275d–e](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md) asks what happens when writing travels beyond its author and audience. A repository instruction file gives the course a concrete comparison: who is addressed, who interprets it, and who can correct a misreading?

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Custom instructions](custom-instructions.md) · [Skills](skills.md) · [Permissions](permissions.md) · [Claude Code](claude-code.md)

## Sources

- [Claude Code: project instructions and memory](https://code.claude.com/docs/en/memory)
- [AGENTS.md specification and examples](https://agents.md/)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
