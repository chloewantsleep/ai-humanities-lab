---
term: "Generative Agents (Park et al., 2023)"
slug: generative-agents
short: "A 2023 Stanford and Google paper populating a Sims-like town with twenty-five language-model characters who remember, reflect, and plan, and so seem to persist as people."
aliases: [Park et al. 2023, Smallville, Generative Agents: Interactive Simulacra of Human Behavior]
category: people-and-texts
see_also: [react-paper, role-play-with-large-language-models, ../interfaces-and-agents/memory, ../interfaces-and-agents/agent, ../interfaces-and-agents/retrieval-rag, ../interfaces-and-agents/compaction]
readings: []
experiments: [layers, mini-claw]
updated: 2026-10-19
---

# Generative Agents (Park et al., 2023)

**A 2023 Stanford and Google paper populating a Sims-like town with twenty-five language-model characters who remember, reflect, and plan, and so seem to persist as people.**

## Why it matters here

The paper shows how much of a believable person comes from the architecture around the model rather than the model. Each agent keeps "a complete record of the agent's experiences using natural language," periodically writes higher-level "reflections" on them, and retrieves what's relevant to plan its day. Given only the idea that one agent wants to throw a Valentine's Day party, the town spreads invitations, makes dates, and shows up "together at the right time." Turn off memory or reflection and the believability drops, which is the paper's ablation and the course's point: character persists because someone built a place for it to be remembered.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2304.03442v2--generative-agents-interactive-simulacra-of-human-behavior.md)).

## Try it

[The layers](/layers) adds persistent memory to one engine; [mini-claw](/mini-claw) gives an agent a `memory.md`.

## See also

[ReAct](react-paper.md) · [Role Play with Large Language Models](role-play-with-large-language-models.md) · [Memory](../interfaces-and-agents/memory.md) · [Agent](../interfaces-and-agents/agent.md) · [Retrieval](../interfaces-and-agents/retrieval-rag.md) · [Compaction](../interfaces-and-agents/compaction.md)

## Sources

- Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang, and Michael S. Bernstein, "Generative Agents: Interactive Simulacra of Human Behavior," *UIST '23*, [doi:10.1145/3586183.3606763](https://doi.org/10.1145/3586183.3606763); [arXiv:2304.03442](https://arxiv.org/abs/2304.03442), abstract quoted; "a small town of twenty-five agents" called Smallville.
