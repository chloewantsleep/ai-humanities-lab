---
term: "Conversation history"
slug: "conversation-history"
short: "The record of earlier messages in an exchange."
aliases: ["chat history", "transcript"]
category: "interfaces-and-agents"
see_also: ["memory", "context-assembly", "compaction", "context-window"]
readings: []
experiments: ["layers"]
updated: "2026-10-19"
---

# Conversation history

**The record of earlier messages in an exchange.**

## In plain terms

Claude Code includes conversation history in its working context. Saving a transcript does not mean every line will remain in every later model call: the available context is limited, and older material can be summarized.

In the Course TF Assistant example, compare asking a follow-up in the same conversation with starting a new one. Which earlier details are supplied this time?

## Try it

[the layers](/layers). Inspect the built configuration panels and assembled prompt; live replies require the configured Claude connection.

## See also

[Memory](memory.md) · [Context assembly](context-assembly.md) · [Compaction](compaction.md) · [Context window](../models-and-training/context-window.md)

## Sources

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [The layers experiment brief](../../experiments/layers.md)
