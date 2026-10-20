---
term: "Scaling laws"
slug: scaling-laws
short: "Measured regularities showing that a language model's loss falls predictably as its parameters, data, and computing budget grow."
aliases: [scaling, compute-optimal training, Chinchilla]
category: models-and-training
see_also: [parameters, pretraining, training-data, loss]
updated: 2026-10-19
---

# Scaling laws

**Measured regularities showing that a language model's loss falls predictably as its parameters, data, and computing budget grow.**

## In plain terms

In 2020 Kaplan and colleagues at OpenAI showed that loss fell along smooth curves as models got bigger and trained longer, which made it possible to predict how good a much larger model would be before building it. In 2022 Hoffmann and colleagues at DeepMind (the "Chinchilla" paper) revised the recipe: for a fixed budget, train smaller models on more data than had been usual.

Scaling laws explain the investment behind the chatbots of 2022 onward. They describe the loss; what capabilities appear at a given loss is a separate and more argued question.

## See also

[Parameters](parameters.md) · [Pretraining](pretraining.md) · [Training data](training-data.md) · [Loss](loss.md)

## Sources

- Kaplan et al., ["Scaling Laws for Neural Language Models"](https://arxiv.org/abs/2001.08361) (2020); Hoffmann et al., ["Training Compute-Optimal Large Language Models"](https://arxiv.org/abs/2203.15556) (2022). Both are in the course's AI papers.
