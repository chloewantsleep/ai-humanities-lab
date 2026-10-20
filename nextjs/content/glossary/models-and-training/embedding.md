---
term: "Embedding"
slug: embedding
short: "The list of numbers a model uses to represent a token, so that tokens used in similar ways end up with similar numbers."
aliases: [vector, word vector, token embedding]
category: models-and-training
see_also: [token, transformer, parameters, attention]
updated: 2026-10-19
---

# Embedding

**The list of numbers a model uses to represent a token, so that tokens used in similar ways end up with similar numbers.**

## In plain terms

After the tokenizer turns text into token numbers, the model's first step is to look each one up in a table and replace it with a long list of numbers: 768 of them per token in GPT-2 small (verify). These lists are learned in training. Tokens that appear in similar contexts drift toward similar lists, so "king" and "queen" sit near each other, and the differences between lists can carry meaning.

The idea predates chatbots: Mikolov and colleagues' word2vec (2013) made word vectors famous. Embeddings are also how [retrieval](../interfaces-and-agents/retrieval-rag.md) works: documents and questions are turned into lists of numbers and matched by closeness.

## See also

[Token](token.md) · [Transformer](transformer.md) · [Parameters](parameters.md) · [Attention](attention.md)

## Sources

- Mikolov et al., ["Efficient Estimation of Word Representations in Vector Space"](https://arxiv.org/abs/1301.3781) (2013); in the course's AI papers as [`1301.3781v3`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1301.3781v3--efficient-estimation-of-word-representations-in-vector-space.md).
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
