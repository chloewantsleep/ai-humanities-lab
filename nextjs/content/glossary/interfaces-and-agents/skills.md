---
term: "Skills"
slug: "skills"
short: "Reusable instructions an agent can load for a particular kind of task."
aliases: ["agent skills", "SKILL.md"]
category: "interfaces-and-agents"
see_also: ["instruction-files", "progressive-disclosure", "tool-use", "plugins"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Skills

**Reusable instructions an agent can load for a particular kind of task.**

## In plain terms

In Claude Code, a skill is organized around a SKILL.md file and may include supporting resources. Skill descriptions help select relevant instructions without loading every procedure in full.

An invented “review an essay” skill might tell the agent to identify the thesis before proposing edits. It guides tool use; it does not itself grant file access. Mini-claw implements the smaller equivalent: a folder of Markdown procedures.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[CLAUDE.md / AGENTS.md](instruction-files.md) · [Progressive disclosure](progressive-disclosure.md) · [Tool use](tool-use.md) · [Plugins](plugins.md)

## Sources

- [Claude Code: skills](https://code.claude.com/docs/en/skills)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
