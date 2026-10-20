---
term: "Function calling"
slug: "function-calling"
short: "Expressing a tool request as a named operation with structured arguments."
aliases: ["structured tool calling"]
category: "interfaces-and-agents"
see_also: ["tool-use", "tool-call", "tool-result", "permissions"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Function calling

**Expressing a tool request as a named operation with structured arguments.**

## In plain terms

A tool definition tells the model what operation exists and which inputs it accepts. The surrounding application handles execution. This makes a request easier for software to interpret than a sentence saying “please read that file.”

For an invented read_note tool, the arguments might be {"path":"memory.md"}. Check the requested path before treating the call as authorized.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Tool use](tool-use.md) · [Tool call](tool-call.md) · [Tool result](tool-result.md) · [Permissions](permissions.md)

## Sources

- [Anthropic: advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
