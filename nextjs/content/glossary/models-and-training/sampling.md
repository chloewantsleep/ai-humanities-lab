---
term: "Sampling"
slug: sampling
short: "Choosing the next token at random, weighted by the model's probabilities, so likely tokens come up often and unlikely ones sometimes."
aliases: [decoding, random sampling]
category: models-and-training
see_also: [probability-distribution, temperature, top-k, top-p, greedy-decoding, seed]
experiments: [spiral]
updated: 2026-10-19
---

# Sampling

**Choosing the next token at random, weighted by the model's probabilities, so likely tokens come up often and unlikely ones sometimes.**

## In plain terms

Sampling is rolling a weighted die. If " alike" has 40 percent, it is picked about four times in ten. This is why the same question can get different replies: each run makes different draws, and an early difference sends the text down a different path.

The ways of turning a distribution into a choice are called decoding strategies. [Greedy decoding](greedy-decoding.md) always takes the top token; sampling with [temperature](temperature.md), [top-k](top-k.md), or [top-p](top-p.md) reshapes the die first. None of these change the model; they change how its predictions are read.

## Try it

Run the same prompt twice in [the GPT-2 experiment](/gpt-2) and watch the paths split.

## See also

[Probability distribution](probability-distribution.md) · [Temperature](temperature.md) · [Top-k sampling](top-k.md) · [Top-p sampling](top-p.md) · [Greedy decoding](greedy-decoding.md) · [Seed](seed.md)

## Sources

- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
