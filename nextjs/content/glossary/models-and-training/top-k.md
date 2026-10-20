---
term: "Top-k sampling"
slug: top-k
short: "Sampling only from the k most likely tokens, ignoring everything else."
aliases: [top-k]
category: models-and-training
see_also: [sampling, top-p, temperature, probability-distribution]
experiments: [spiral]
updated: 2026-10-19
---

# Top-k sampling

**Sampling only from the k most likely tokens, ignoring everything else.**

## In plain terms

With top-k set to 40, the model's 40 favorite next tokens stay in play and the other 50,000-odd are dropped before the die is rolled. It cuts off the strangest continuations without making the text fully predictable. With k = 1, top-k is [greedy decoding](greedy-decoding.md).

Its weakness is that k is fixed: when the model is confident, 40 options is too many, and when many words fit, 40 may be too few. [Top-p](top-p.md) was proposed to fix that.

## Try it

The top-k slider in [the GPT-2 experiment](/gpt-2); set it to 1 to see greedy decoding.

## See also

[Sampling](sampling.md) · [Top-p sampling](top-p.md) · [Temperature](temperature.md) · [Probability distribution](probability-distribution.md)

## Sources

- Fan, Lewis, and Dauphin, ["Hierarchical Neural Story Generation"](https://arxiv.org/abs/1805.04833) (2018), an early use of top-k sampling.
- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
