---
term: "Preference data"
slug: preference-data
short: "Records of people (or models) choosing which of two or more replies is better; the raw material for RLHF."
aliases: [comparison data, human feedback, rankings]
category: models-and-training
see_also: [reward-model, rlhf, constitutional-ai, sycophancy]
readings: [askell-2021]
updated: 2026-10-19
---

# Preference data

**Records of people (or models) choosing which of two or more replies is better; the raw material for RLHF.**

## In plain terms

Show a rater two replies to the same question and ask which is more helpful. Collect enough of those choices and you have a record of taste: not what a good answer is, but which of two was preferred. Judging is easier than writing, so preference data can cover cases no one could demonstrate well.

Its weakness is that people prefer things for reasons beyond quality: confidence, length, flattery, agreement with their own view. A model trained to win these choices learns those preferences too, which is one source of [sycophancy](../persona-and-dialogue/sycophancy.md).

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) built an interface where people chat with models and choose between two responses; "we typically request that users pick the most helpful and honest response."

## See also

[Reward model](reward-model.md) · [RLHF](rlhf.md) · [Constitutional AI](constitutional-ai.md) · [Sycophancy](../persona-and-dialogue/sycophancy.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
