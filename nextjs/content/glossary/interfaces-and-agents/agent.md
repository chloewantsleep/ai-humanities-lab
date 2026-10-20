---
term: "Agent"
slug: "agent"
short: "A system that lets a model choose steps and use tools toward a task."
aliases: ["AI agent"]
category: "interfaces-and-agents"
see_also: ["agent-loop", "workflow", "harness", "claude-code"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Agent

**A system that lets a model choose steps and use tools toward a task.**

## In plain terms

Anthropic distinguishes agents, which direct their own process, from workflows with predetermined paths. Usage varies, so ask what choices a particular system delegates to the model.

“Explain this bug” can end with prose. “Find and fix this bug” might require Claude Code to inspect files, edit, and check the result. Mini-claw isolates that structure in a small implemented loop.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Agent loop](agent-loop.md) · [Workflow](workflow.md) · [Harness](harness.md) · [Claude Code](claude-code.md)

## Sources

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
