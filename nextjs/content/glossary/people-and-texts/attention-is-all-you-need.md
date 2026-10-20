---
term: "Attention Is All You Need (2017)"
slug: attention-is-all-you-need
short: "The 2017 Google paper by Vaswani and colleagues that introduced the Transformer, the architecture behind nearly every model in these experiments."
aliases: [Vaswani et al. 2017, the Transformer paper]
category: people-and-texts
see_also: [gpt-2-paper, gpt-3-paper, ../models-and-training/transformer, ../models-and-training/attention, ../models-and-training/neural-network]
readings: []
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Attention Is All You Need (2017)

**The 2017 Google paper by Vaswani and colleagues that introduced the Transformer, the architecture behind nearly every model in these experiments.**

## Why it matters here

It was a paper about machine translation, and its claim was architectural: a network "based solely on attention mechanisms, dispensing with recurrence and convolutions entirely" trains faster and translates better. The design scaled, and GPT-2, SmolLM2, Gemma, and Claude all descend from it. For the course it is the one technical landmark worth knowing by name, and a reminder that the chatbot was not the goal: the Transformer was built to translate, and conversation came later.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03762v7--attention-is-all-you-need.md)); the collection's notes call it "the central architectural landmark."

## Try it

Every model in the [GPT-2 experiment](/gpt-2) and [building the assistant by hand](/by-hand) is a Transformer.

## See also

[GPT-2 paper](gpt-2-paper.md) · [GPT-3 paper](gpt-3-paper.md) · [Transformer](../models-and-training/transformer.md) · [Attention](../models-and-training/attention.md) · [Neural network](../models-and-training/neural-network.md)

## Sources

- Ashish Vaswani et al., "Attention Is All You Need," *Advances in Neural Information Processing Systems 30* (NIPS 2017) ([proceedings](https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html)); [arXiv:1706.03762](https://arxiv.org/abs/1706.03762), abstract quoted.
- [Course collection notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-notes.md).
