---
term: "Tool call"
slug: "tool-call"
short: "One specific request to run a tool with particular inputs."
aliases: ["tool invocation"]
category: "interfaces-and-agents"
see_also: ["function-calling", "tool-result", "trace"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Tool call

**One specific request to run a tool with particular inputs.**

## In plain terms

A call is an event, not just an available capability. Tool calling supports structured inputs; whether a call executes depends on the host and its checks.

In an invented mini-claw trace, distinguish “read_note exists” from “read_note was requested with path memory.md.” The second gives you something concrete to inspect.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Function calling](function-calling.md) · [Tool result](tool-result.md) · [Trace](trace.md)

## Sources

- [Anthropic: advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
