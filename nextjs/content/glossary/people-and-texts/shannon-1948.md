---
term: "A Mathematical Theory of Communication (Shannon, 1948)"
slug: shannon-1948
short: "Claude Shannon's founding paper of information theory, which generated fake English from letter and word statistics: the first printed outputs of a language model."
aliases: [Claude Shannon, Shannon 1948, approximations to English, information theory]
category: people-and-texts
see_also: [markov-1913, gpt-2-paper, ../models-and-training/language-model, ../models-and-training/next-token-prediction, ../models-and-training/sampling]
readings: []
experiments: [spiral]
updated: 2026-10-19
---

# A Mathematical Theory of Communication (Shannon, 1948)

**Claude Shannon's founding paper of information theory, which generated fake English from letter and word statistics: the first printed outputs of a language model.**

## Why it matters here

In section 3, "The Series of Approximations to English," Shannon builds text by sampling each letter or word from statistics of what tends to follow what, and prints the results in order of increasing context. The best one, a "second-order word approximation," reads: "THE HEAD AND IN FRONTAL ATTACK ON AN ENGLISH WRITER THAT THE CHARACTER OF THIS POINT IS THEREFORE ANOTHER METHOD FOR THE LETTERS THAT THE TIME OF WHO EVER TOLD THE PROBLEM FOR AN UNEXPECTED." Shannon notes that a stretch like "attack on an English writer that the character of this" is "not at all unreasonable." That is the GPT-2 experiment's GPT-2 in miniature: locally fluent, globally nowhere, and never stopping on its own. The difference over seventy years is mostly how much context the prediction can use.

In a 1951 follow-up, "Prediction and Entropy of Printed English," he had people guess the next letter of a text to estimate how predictable English is.

## Try it

The [GPT-2 experiment](/gpt-2): lower the context a model can use in your head, and you get Shannon's samples.

## See also

[Markov's Eugene Onegin](markov-1913.md) · [GPT-2 paper](gpt-2-paper.md) · [Language model](../models-and-training/language-model.md) · [Next-token prediction](../models-and-training/next-token-prediction.md) · [Sampling](../models-and-training/sampling.md)

## Sources

- C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal* 27 (July and October 1948): 379–423, 623–656, §3 ([PDF, Harvard mathematics course copy](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)).
- C. E. Shannon, "Prediction and Entropy of Printed English," *Bell System Technical Journal* 30 (1951): 50–64 ([Nokia Bell Labs](https://www.nokia.com/bell-labs/publications-and-media/publications/prediction-and-entropy-of-printed-english/)).
