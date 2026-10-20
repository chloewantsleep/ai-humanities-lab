---
term: "Transformer"
slug: transformer
short: "The neural-network design behind nearly every language model since 2017, built around attention: each token can draw on every earlier token at once."
aliases: [transformer architecture, decoder-only transformer]
category: models-and-training
see_also: [attention, neural-network, embedding, language-model]
updated: 2026-10-19
---

# Transformer

**The neural-network design behind nearly every language model since 2017, built around attention: each token can draw on every earlier token at once.**

## In plain terms

The transformer was introduced by Vaswani and colleagues at Google in 2017, for translation, in a paper titled "Attention Is All You Need". Earlier language models read text one word at a time and struggled to keep track of anything far back. A transformer processes the whole passage together, through a stack of layers that each mix information between positions with [attention](attention.md).

The "T" in GPT ("generative pre-trained transformer") is this. GPT-2, SmolLM2, Gemma, and Claude are all transformers, though modern ones differ in many details.

## See also

[Attention](attention.md) · [Neural network](neural-network.md) · [Embedding](embedding.md) · [Language model](language-model.md)

## Sources

- Vaswani et al., ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762) (2017); in the course's AI papers as [`1706.03762v7`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03762v7--attention-is-all-you-need.md).
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
