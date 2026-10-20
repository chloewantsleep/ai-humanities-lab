---
term: "Neural network"
slug: neural-network
short: "A computation built from many layers of simple arithmetic on lists of numbers, whose behavior is set by adjustable weights learned from examples."
aliases: [neural net, deep learning]
category: models-and-training
see_also: [parameters, weights, transformer, training]
updated: 2026-10-19
---

# Neural network

**A computation built from many layers of simple arithmetic on lists of numbers, whose behavior is set by adjustable weights learned from examples.**

## In plain terms

A neural network takes numbers in, multiplies and adds them through a series of layers, and puts numbers out. Each multiplication uses a [weight](weights.md), and training adjusts the weights until the outputs are good. The name comes from a loose analogy with neurons; the working parts are matrices of numbers.

A language model is a neural network whose input is tokens (as [embeddings](embedding.md)) and whose output is [logits](logits.md) for the next token. Since 2017 nearly all of them are [transformers](transformer.md).

## See also

[Parameters](parameters.md) · [Weights](weights.md) · [Transformer](transformer.md) · [Training](training.md)

## Sources

- Jurafsky and Martin, [*Speech and Language Processing*](https://web.stanford.edu/~jurafsky/slp3/), 3rd ed. draft, chapter on neural networks.
