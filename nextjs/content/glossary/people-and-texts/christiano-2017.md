---
term: "Deep Reinforcement Learning from Human Preferences (2017)"
slug: christiano-2017
short: "Christiano and colleagues' 2017 paper showing that people's choices between two outputs can train a system toward goals no one wrote down: the root of RLHF."
aliases: [Christiano et al. 2017, learning from human preferences]
category: people-and-texts
see_also: [instructgpt, askell-2021, constitutional-ai-paper, ../models-and-training/rlhf, ../models-and-training/reward-model, ../models-and-training/preference-data]
readings: []
experiments: [by-hand]
updated: 2026-10-19
---

# Deep Reinforcement Learning from Human Preferences (2017)

**Christiano and colleagues' 2017 paper showing that people's choices between two outputs can train a system toward goals no one wrote down: the root of RLHF.**

## Why it matters here

Before it was used on language, the method taught simulated robots and Atari players from non-experts clicking which of two short clips looked better, with feedback "on less than one percent" of the agent's interactions and, for some behaviors, "about an hour of human time." The idea that matters for the course is that a goal can be learned from judgments rather than specified as rules. That is how the assistant's manner was later trained: not by writing down what a good assistant is, but by having people (and later models) pick the better reply, over and over.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03741v4--deep-reinforcement-learning-from-human-preferences.md)).

## Try it

Column 4 of [building the assistant by hand](/by-hand) is a model shaped by preference training; columns 1 and 2 are not.

## See also

[InstructGPT](instructgpt.md) · [Askell et al. 2021](askell-2021.md) · [Constitutional AI](constitutional-ai-paper.md) · [RLHF](../models-and-training/rlhf.md) · [Reward model](../models-and-training/reward-model.md) · [Preference data](../models-and-training/preference-data.md)

## Sources

- Paul Christiano, Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, and Dario Amodei, "Deep Reinforcement Learning from Human Preferences," NIPS 2017 ([proceedings](https://proceedings.neurips.cc/paper/2017/hash/d5e2c0adad503c91f91df240d0cd4e49-Abstract.html)); [arXiv:1706.03741](https://arxiv.org/abs/1706.03741), abstract quoted.
