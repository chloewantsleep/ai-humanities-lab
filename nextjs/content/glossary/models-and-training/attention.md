---
term: "Attention"
slug: attention
short: "The step inside a transformer where each token weighs every earlier token to decide which ones matter for predicting what comes next."
aliases: [self-attention, attention mechanism]
category: models-and-training
see_also: [transformer, context-window, embedding]
updated: 2026-10-19
---

# Attention

**The step inside a transformer where each token weighs every earlier token to decide which ones matter for predicting what comes next.**

## In plain terms

In "The patient said men are all alike, and then *she*...", predicting what follows "she" means looking back at "the patient". Attention lets the model learn where to look: for each position it scores every earlier position for relevance and mixes in information from the high scorers. Many such attention "heads" run in parallel, each learning a different kind of looking.

Attention is also why the [context window](context-window.md) is limited and costly: every token is compared with every other, so doubling the text roughly quadruples the work in the basic design. The idea came from machine translation (Bahdanau and colleagues, 2014) before the transformer made it central.

## See also

[Transformer](transformer.md) · [Context window](context-window.md) · [Embedding](embedding.md)

## Sources

- Vaswani et al., ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762) (2017); in the course's AI papers as [`1706.03762v7`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03762v7--attention-is-all-you-need.md).
- Bahdanau, Cho, and Bengio, ["Neural Machine Translation by Jointly Learning to Align and Translate"](https://arxiv.org/abs/1409.0473) (2014); in the course's AI papers.
