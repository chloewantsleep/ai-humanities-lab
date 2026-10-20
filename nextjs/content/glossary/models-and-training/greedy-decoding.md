---
term: "Greedy decoding"
slug: greedy-decoding
short: "Always choosing the single most likely next token. Deterministic: the same prompt gives the same text every time."
aliases: [argmax decoding, temperature zero]
category: models-and-training
see_also: [sampling, temperature, top-k, repetition]
readings: [plato-phaedrus]
experiments: [spiral]
updated: 2026-10-19
---

# Greedy decoding

**Always choosing the single most likely next token. Deterministic: the same prompt gives the same text every time.**

## In plain terms

Greedy decoding skips the die and takes the favorite every time. It sounds like the safest choice but often produces worse text: small models in particular fall into loops ("I don't know. I don't know. I don't know.") because once a phrase repeats, repeating it again becomes the most likely continuation.

It is useful in experiments precisely because it is repeatable: with greedy decoding, any difference between two runs comes from the input, not the dice.

## In the readings

[Plato, *Phaedrus*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md) (275d) complains that a written speech "always gives one unvarying answer." A model under greedy decoding is exactly that: ask the same question, get the same words.

## Try it

Set temperature to 0 or top-k to 1 in [the GPT-2 experiment](/gpt-2).

## See also

[Sampling](sampling.md) · [Temperature](temperature.md) · [Top-k sampling](top-k.md) · [Repetition loop](repetition.md)

## Sources

- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
