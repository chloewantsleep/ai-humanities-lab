---
term: "Tool use"
slug: "tool-use"
short: "Letting a model request an operation that software can carry out."
aliases: ["tools"]
category: "interfaces-and-agents"
see_also: ["function-calling", "tool-call", "tool-result", "permissions"]
readings: []
experiments: ["layers", "mini-claw"]
updated: "2026-10-19"
---

# Tool use

**Letting a model request an operation that software can carry out.**

## In plain terms

Tools extend an assistant beyond producing text: a host can execute a requested file read, search, or calculation and return the result. The model’s request and the software’s execution are separate steps.

In mini-claw, follow the single file tool from its description to the request to the returned result. In Claude Code, use a file-reading task as the same running example.

## Try it

[the layers](/layers) · [mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Function calling](function-calling.md) · [Tool call](tool-call.md) · [Tool result](tool-result.md) · [Permissions](permissions.md)

## Sources

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
- [The layers experiment brief](../../experiments/layers.md)
