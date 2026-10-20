---
term: "Repetition loop"
slug: repetition
short: "A model's tendency to fall into repeating the same phrase or sentence, especially small models under low-randomness decoding."
aliases: [degeneration, text degeneration, looping]
category: models-and-training
see_also: [greedy-decoding, temperature, base-model, end-of-sequence-token]
readings: [bergson-laughter]
experiments: [spiral]
updated: 2026-10-19
---

# Repetition loop

**A model's tendency to fall into repeating the same phrase or sentence, especially small models under low-randomness decoding.**

## In plain terms

Repetition is the most common way a base model's text goes wrong. Each repeat makes the next repeat more likely, so a loop, once started, reinforces itself. Holtzman and colleagues called the wider problem "neural text degeneration" and showed that taking the most likely tokens produces text unlike what people write.

Products guard against it with sampling settings and penalties on recently used tokens (a "repetition penalty"). In the GPT-2 experiment, a loop is one of the two shapes the spiral takes; the other is wandering off into a new document.

## In the readings

[Bergson, *Laughter*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/bergson-laughter.md) on repetition and rigidity as the source of the comic, the mechanical showing through where we expect the living. A looping model is often funny for exactly that reason.

## Try it

Low temperature on GPT-2 in [the GPT-2 experiment](/gpt-2) usually produces a loop within a few lines.

## See also

[Greedy decoding](greedy-decoding.md) · [Temperature](temperature.md) · [Base model](base-model.md) · [End-of-sequence token](end-of-sequence-token.md)

## Sources

- Holtzman et al., ["The Curious Case of Neural Text Degeneration"](https://arxiv.org/abs/1904.09751) (2019), which names the repetition problem and proposes nucleus (top-p) sampling.
