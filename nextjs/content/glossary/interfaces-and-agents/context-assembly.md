---
term: "Context assembly"
slug: "context-assembly"
short: "Selecting and arranging what the model receives for a particular step."
aliases: ["context engineering"]
category: "interfaces-and-agents"
see_also: ["conversation-history", "knowledge-files", "compaction", "context-window"]
readings: []
experiments: ["layers", "mini-claw"]
updated: "2026-10-19"
---

# Context assembly

**Selecting and arranging what the model receives for a particular step.**

## In plain terms

Context engineering involves managing instructions, messages, tool descriptions, and retrieved information within limited space. A file elsewhere on disk is useful only if the system brings relevant information into the model’s input.

For a student using Claude Code, ask: did the agent read the assignment file, or merely see its name? Mini-claw’s trace is a way to make that question inspectable.

## Try it

[the layers](/layers) · [mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Conversation history](conversation-history.md) · [Knowledge (files)](knowledge-files.md) · [Compaction](compaction.md) · [Context window](../models-and-training/context-window.md)

## Sources

- [Anthropic: context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
- [The layers experiment brief](../../experiments/layers.md)
