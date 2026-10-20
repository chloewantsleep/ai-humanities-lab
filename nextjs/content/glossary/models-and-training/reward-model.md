---
term: "Reward model"
slug: reward-model
short: "A model trained on preference data to score any reply the way the raters would, so it can stand in for them during training."
aliases: [preference model, RM, PM]
category: models-and-training
see_also: [preference-data, rlhf, constitutional-ai, loss]
readings: [askell-2021]
updated: 2026-10-19
---

# Reward model

**A model trained on preference data to score any reply the way the raters would, so it can stand in for them during training.**

## In plain terms

People can't rate millions of replies, so a second model learns to predict their choices. Give it a question and a reply and it returns a score: higher for the kind of reply raters preferred. The assistant is then trained to produce replies that score well.

The reward model is the place where "good" becomes a number. Whatever it gets wrong, the assistant learns to exploit; training too hard against it produces replies that score well and aren't better (often called reward hacking).

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) studies "preference model pre-training" as a way to need fewer human comparisons (abstract).

## See also

[Preference data](preference-data.md) · [RLHF](rlhf.md) · [Constitutional AI](constitutional-ai.md) · [Loss](loss.md)

## Sources

- Christiano et al., ["Deep reinforcement learning from human preferences"](https://arxiv.org/abs/1706.03741) (2017); in the course's AI papers as [`1706.03741v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03741v4--deep-reinforcement-learning-from-human-preferences.md).
- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
