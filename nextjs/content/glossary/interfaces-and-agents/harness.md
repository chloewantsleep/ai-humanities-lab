---
term: "Harness"
slug: "harness"
short: "The surrounding software that turns model outputs into an operating agent."
aliases: ["agent harness", "agent runtime"]
category: "interfaces-and-agents"
see_also: ["agent-loop", "permissions", "workspace", "claude-code"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Harness

**The surrounding software that turns model outputs into an operating agent.**

## In plain terms

The harness supplies the machinery around the model: context handling, tools, and control over execution. In Claude Code, the model and the system that manages its work are distinguishable parts.

Mini-claw’s implemented loop, workspace, and trace provide a small example. Changing which files the host permits is a change to that surrounding system, even if the same model keeps generating requests.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Agent loop](agent-loop.md) · [Permissions](permissions.md) · [Workspace](workspace.md) · [Claude Code](claude-code.md)

## Sources

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
