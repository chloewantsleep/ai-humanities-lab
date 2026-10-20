---
term: "Progressive disclosure"
slug: "progressive-disclosure"
short: "Showing a little information first and loading more when it becomes relevant."
aliases: ["on-demand context"]
category: "interfaces-and-agents"
see_also: ["skills", "context-assembly", "context-window"]
readings: []
experiments: []
updated: "2026-10-19"
---

# Progressive disclosure

**Showing a little information first and loading more when it becomes relevant.**

## In plain terms

Claude Code skills use this pattern: a description supports discovery, while the full instructions are loaded when the skill is used. This helps avoid filling the working context with every possible procedure.

For an invented course skill library, the agent could see “essay review” in a list, then load that procedure only when asked to review an essay.

## See also

[Skills](skills.md) · [Context assembly](context-assembly.md) · [Context window](../models-and-training/context-window.md)

## Sources

- [Claude Code: skills](https://code.claude.com/docs/en/skills)
