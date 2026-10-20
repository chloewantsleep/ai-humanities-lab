---
term: "Seed"
slug: seed
short: "The starting number for a program's random choices. The same seed with the same settings gives the same \"random\" text."
aliases: [random seed]
category: models-and-training
see_also: [sampling, greedy-decoding]
updated: 2026-10-19
---

# Seed

**The starting number for a program's random choices. The same seed with the same settings gives the same "random" text.**

## In plain terms

Computers don't roll real dice; they generate a fixed sequence of pseudo-random numbers from a starting value. Fix the seed and a sampled reply becomes repeatable, which matters for comparing settings fairly: change the temperature, keep the seed, and the difference is the temperature's.

Hosted chatbots generally don't expose a seed, and even with one, results can differ across hardware (verify for a given API).

## See also

[Sampling](sampling.md) · [Greedy decoding](greedy-decoding.md)
