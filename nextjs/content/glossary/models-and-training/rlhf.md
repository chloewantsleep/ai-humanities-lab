---
term: "RLHF"
slug: rlhf
short: "Reinforcement learning from human feedback: training a model to produce replies that a reward model, trained on human preferences, scores highly."
aliases: [reinforcement learning from human feedback, RL from human preferences]
category: models-and-training
see_also: [reward-model, preference-data, supervised-fine-tuning, constitutional-ai, post-training, sycophancy]
readings: [askell-2021, grice-1975]
experiments: [by-hand]
updated: 2026-10-19
---

# RLHF

**Reinforcement learning from human feedback: training a model to produce replies that a reward model, trained on human preferences, scores highly.**

## In plain terms

The method comes from Christiano and colleagues (2017), who used human comparisons to teach simulated robots tasks that were hard to specify. OpenAI's InstructGPT (2022) applied it to language: demonstrations first, then human rankings of outputs, then reinforcement learning against a reward model trained on those rankings. In the paper's evaluations, people preferred the 1.3-billion-parameter InstructGPT's outputs to those of the 175-billion-parameter GPT-3. ChatGPT, released later in 2022, used the same approach (verify).

RLHF is the step most responsible for the assistant's familiar manner: complete answers, polite hedges, a tidy stop.

## In the readings

[Grice, "Logic and Conversation"](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md)'s maxims (be as informative as required, true, relevant, and clear) read like a rater's checklist. RLHF trains a model toward replies that look cooperative to a rater, which is close to Grice's principle and not the same thing. [Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) compares preference modeling with imitation and finds it "performs much better."

## Try it

Column 4 of [building the assistant by hand](/by-hand) shows a model shaped by this kind of training.

## See also

[Reward model](reward-model.md) · [Preference data](preference-data.md) · [Supervised fine-tuning](supervised-fine-tuning.md) · [Constitutional AI](constitutional-ai.md) · [Post-training](post-training.md) · [Sycophancy](../persona-and-dialogue/sycophancy.md)

## Sources

- Christiano et al., ["Deep reinforcement learning from human preferences"](https://arxiv.org/abs/1706.03741) (2017); in the course's AI papers as [`1706.03741v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/1706.03741v4--deep-reinforcement-learning-from-human-preferences.md).
- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
- OpenAI, ["Introducing ChatGPT"](https://openai.com/index/chatgpt/), November 30, 2022.
