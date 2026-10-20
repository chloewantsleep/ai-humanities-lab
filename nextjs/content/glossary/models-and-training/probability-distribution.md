---
term: "Probability distribution"
slug: probability-distribution
short: "The model's spread of likelihood over every possible next token, adding up to 100 percent."
aliases: [next-token distribution, softmax output]
category: models-and-training
see_also: [logits, sampling, temperature, top-k, top-p]
experiments: [spiral]
updated: 2026-10-19
---

# Probability distribution

**The model's spread of likelihood over every possible next token, adding up to 100 percent.**

## In plain terms

After "Men are all", a model might give " alike" 40 percent, " the" 8 percent, " equal" 5 percent, and thousands of other tokens tiny slivers (figures invented for illustration). That spread is the distribution. A peaked distribution means the model is confident about what comes next; a flat one means many continuations are about equally plausible.

The distribution is the most honest view of a language model: it isn't one answer but a weighted crowd of possible answers, and every reply you have read was one draw from a series of such crowds.

## Try it

The bar chart in [the GPT-2 experiment](/gpt-2) is this distribution, redrawn at every step.

## See also

[Logits](logits.md) · [Sampling](sampling.md) · [Temperature](temperature.md) · [Top-k sampling](top-k.md) · [Top-p sampling](top-p.md)
