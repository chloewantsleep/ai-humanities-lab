---
term: "Tool result"
slug: "tool-result"
short: "The output returned to the agent after a tool runs."
aliases: ["tool output", "observation"]
category: "interfaces-and-agents"
see_also: ["tool-call", "agent-loop", "prompt-injection", "trace"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Tool result

**The output returned to the agent after a tool runs.**

## In plain terms

A tool result feeds observations back into the next model step. It may contain useful evidence, an error, or untrusted text.

Imagine Claude Code asking to read an assignment. The result is the file’s contents or an error, rather than the agent’s intention to read it. Mini-claw’s trace should let students distinguish all three.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Tool call](tool-call.md) · [Agent loop](agent-loop.md) · [Prompt injection](prompt-injection.md) · [Trace](trace.md)

## Sources

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
