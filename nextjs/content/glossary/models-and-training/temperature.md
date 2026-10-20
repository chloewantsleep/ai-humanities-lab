---
term: "Temperature"
slug: temperature
short: "A dial that sharpens or flattens the model's probabilities before sampling: low is cautious and repetitive, high is surprising and eventually incoherent."
aliases: [sampling temperature]
category: models-and-training
see_also: [sampling, logits, top-k, top-p, greedy-decoding]
readings: [bergson-laughter]
experiments: [spiral]
updated: 2026-10-19
---

# Temperature

**A dial that sharpens or flattens the model's probabilities before sampling: low is cautious and repetitive, high is surprising and eventually incoherent.**

## In plain terms

Temperature divides the [logits](logits.md) before they become probabilities. Below 1, the favorite tokens get more of the probability; at 0 it is the same as always taking the top token. Above 1, the long tail of unlikely tokens gets more chances. At 0.2 GPT-2 tends to repeat itself; around 1 it writes plausible forum text; at 2 it produces word salad.

Temperature is not creativity or randomness inside the model. It is a reading setting, applied afterward, and every chatbot product chooses one (or lets you choose) on your behalf.

## In the readings

[Bergson, *Laughter*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/bergson-laughter.md): the comic is "something mechanical encrusted on the living." Turn the temperature down and a model falls into that rigidity, the same phrase again and again; turn it up and the reply loses the thread. The fluent middle is a setting.

## Try it

The temperature slider in [the GPT-2 experiment](/gpt-2).

## See also

[Sampling](sampling.md) · [Logits](logits.md) · [Top-k sampling](top-k.md) · [Top-p sampling](top-p.md) · [Greedy decoding](greedy-decoding.md)

## Sources

- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
