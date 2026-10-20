---
term: "Training"
slug: training
short: "Adjusting a model's weights, over many examples, so its predictions get better; the expensive part that happens once, before anyone uses it."
aliases: [learning, gradient descent, backpropagation]
category: models-and-training
see_also: [pretraining, fine-tuning, loss, training-data, inference]
updated: 2026-10-19
---

# Training

**Adjusting a model's weights, over many examples, so its predictions get better; the expensive part that happens once, before anyone uses it.**

## In plain terms

Training shows the model text, measures how wrong its next-token predictions were (the [loss](loss.md)), and nudges every weight slightly in the direction that would have made it less wrong. Repeat over billions of examples and the weights come to encode a great deal about the text.

After training, the weights are frozen. When you chat with a model it isn't learning from you in this sense; using a model is [inference](inference.md). Training happens in stages: [pretraining](pretraining.md) first, then [post-training](post-training.md).

## See also

[Pretraining](pretraining.md) · [Fine-tuning](fine-tuning.md) · [Loss](loss.md) · [Training data](training-data.md) · [Inference](inference.md)
