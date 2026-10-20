---
term: "Claude Code"
slug: "claude-code"
short: "Anthropic’s coding agent, used here as a running example of an agent around a model."
aliases: ["Claude coding agent"]
category: "interfaces-and-agents"
see_also: ["instruction-files", "skills", "tool-use", "permissions", "agent-loop"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Claude Code

**Anthropic’s coding agent, used here as a running example of an agent around a model.**

## In plain terms

Claude Code can inspect files, use tools, and work through a task in a loop. Its context includes instructions and conversation material.

For a student’s repo, locate five parts: project instructions, a skill, a tool request, the permission governing execution, and the next step after a result. Mini-claw implements the same anatomy in a smaller form. See the product-specific documentation before assuming a feature is available in a particular installation.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[CLAUDE.md / AGENTS.md](instruction-files.md) · [Skills](skills.md) · [Tool use](tool-use.md) · [Permissions](permissions.md) · [Agent loop](agent-loop.md)

## Sources

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
