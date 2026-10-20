---
term: "Retrieval (RAG)"
slug: "retrieval-rag"
short: "Finding relevant material and supplying it to a model before it answers."
aliases: ["RAG", "retrieval-augmented generation"]
category: "interfaces-and-agents"
see_also: ["knowledge-files", "context-assembly", "tool-result"]
readings: []
experiments: []
updated: "2026-10-19"
---

# Retrieval (RAG)

**Finding relevant material and supplying it to a model before it answers.**

## In plain terms

Retrieval-augmented generation brings selected source passages into the input. Search can combine semantic similarity with keyword matching; the model then generates an answer from the supplied material.

Imagine the Course TF Assistant searching a syllabus for the late-work policy. Inspect the returned passage: a fluent answer cannot repair a search that found the wrong policy. The layers brief includes files, but does not require a retrieval system.

## See also

[Knowledge (files)](knowledge-files.md) · [Context assembly](context-assembly.md) · [Tool result](tool-result.md)

## Sources

- [Anthropic: contextual retrieval](https://www.anthropic.com/engineering/contextual-retrieval)
