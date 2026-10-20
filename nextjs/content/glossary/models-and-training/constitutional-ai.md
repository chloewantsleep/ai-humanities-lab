---
term: "Constitutional AI"
slug: constitutional-ai
short: "Anthropic's method of training a model against a written list of principles, using the model's own critiques and judgments instead of human labels for harmful outputs."
aliases: [CAI, RLAIF, reinforcement learning from AI feedback]
category: models-and-training
see_also: [rlhf, reward-model, preference-data, post-training, hhh]
readings: [askell-2021]
updated: 2026-10-19
---

# Constitutional AI

**Anthropic's method of training a model against a written list of principles, using the model's own critiques and judgments instead of human labels for harmful outputs.**

## In plain terms

In Constitutional AI (Bai and colleagues, Anthropic, 2022), the human input is a short list of principles, the "constitution". The model drafts a reply, critiques it against a principle, and revises it; the revisions become fine-tuning data. Then the model compares pairs of replies against the principles, and those AI judgments train the reward model in place of human ones. The paper's abstract: "The only human oversight is provided through a list of rules or principles."

It moves part of the work of judgment from raters to text, which makes the values more legible: you can read the constitution.

## In the readings

It builds on [Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md)'s helpful, honest, and harmless framing (see [HHH](../persona-and-dialogue/hhh.md)).

## See also

[RLHF](rlhf.md) · [Reward model](reward-model.md) · [Preference data](preference-data.md) · [Post-training](post-training.md) · [HHH](../persona-and-dialogue/hhh.md)

## Sources

- Bai et al., ["Constitutional AI: Harmlessness from AI Feedback"](https://arxiv.org/abs/2212.08073) (2022); in the course's AI papers as [`2212.08073v1`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2212.08073v1--constitutional-ai-harmlessness-from-ai-feedback.md).
- Anthropic, ["Claude's Constitution"](https://www.anthropic.com/news/claudes-constitution), May 2023.
