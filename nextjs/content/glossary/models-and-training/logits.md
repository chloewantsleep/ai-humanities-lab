---
term: "Logits"
slug: logits
short: "The raw scores a model gives every token in its vocabulary at each step, before they are turned into probabilities."
aliases: [scores, raw outputs]
category: models-and-training
see_also: [probability-distribution, temperature, vocabulary, next-token-prediction]
updated: 2026-10-19
---

# Logits

**The raw scores a model gives every token in its vocabulary at each step, before they are turned into probabilities.**

## In plain terms

The model's final layer outputs one number per vocabulary entry, 50,257 numbers for GPT-2. Bigger means more likely, but the numbers aren't probabilities yet: they can be negative and don't add up to anything. A function called softmax turns them into a [probability distribution](probability-distribution.md).

Logits are where the dials act. [Temperature](temperature.md) divides them before softmax; banning the [end-of-sequence token](end-of-sequence-token.md) sets its logit to negative infinity so it can never be picked.

## See also

[Probability distribution](probability-distribution.md) · [Temperature](temperature.md) · [Vocabulary](vocabulary.md) · [Next-token prediction](next-token-prediction.md)

## Sources

- Jurafsky and Martin, [*Speech and Language Processing*](https://web.stanford.edu/~jurafsky/slp3/), 3rd ed. draft, chapters on neural language models and transformers (logits and softmax).
