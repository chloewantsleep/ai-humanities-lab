---
term: "Top-p sampling"
slug: top-p
short: "Sampling from the smallest set of top tokens whose probabilities add up to p (for example 90 percent), so the choice widens and narrows with the model's confidence."
aliases: [nucleus sampling]
category: models-and-training
see_also: [top-k, sampling, temperature, probability-distribution]
updated: 2026-10-19
---

# Top-p sampling

**Sampling from the smallest set of top tokens whose probabilities add up to p (for example 90 percent), so the choice widens and narrows with the model's confidence.**

## In plain terms

With p = 0.9, the tokens are sorted by probability and added up until they reach 90 percent; only those are kept. After "Men are all", that might be three tokens; after "My favorite food is", a few hundred. Holtzman and colleagues named it nucleus sampling in 2019, as a way to avoid both dull repetition and the nonsense of the long tail.

Many chat APIs expose top-p alongside temperature; most guides suggest changing one or the other, not both (verify for a given API).

## See also

[Top-k sampling](top-k.md) · [Sampling](sampling.md) · [Temperature](temperature.md) · [Probability distribution](probability-distribution.md)

## Sources

- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
