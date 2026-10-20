---
term: "Next-token prediction"
slug: next-token-prediction
short: "The one task a language model is trained on: given the text so far, predict the token that comes next."
aliases: [autoregressive generation, causal language modeling, text continuation]
category: models-and-training
see_also: [language-model, pretraining, logits, sampling, base-model]
readings: [plato-phaedrus, shanahan-2023]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Next-token prediction

**The one task a language model is trained on: given the text so far, predict the token that comes next.**

## In plain terms

Everything a chatbot does is built from this one move. In training, the model sees billions of pieces of text and, at each position, is scored on how much probability it gave the token that actually came next. In use, the same move writes: predict, pick a token, append it, predict again. That loop is called autoregressive generation: each new token becomes part of the input for the next.

Nothing in the task mentions questions, answers, truth, or a speaker. A model asked "Who are you?" predicts whatever text tends to follow those words in its training data. Getting an *answer* takes a [preamble](../persona-and-dialogue/preamble.md) or [post-training](post-training.md).

## In the readings

[Plato, *Phaedrus*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md) (275d): Socrates says written speeches seem to have intelligence, "but if you want to know anything and put a question to one of them, the speaker always gives one unvarying answer." A model trained only on writing answers a question the way writing does: with more writing. [*Analects*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/confucius-analects-chin.md) 7.8 is the other side: the teacher shows "one corner of a square" and expects the student to come back with the other three. Next-token prediction is extending the pattern you were shown.

## Try it

[The GPT-2 experiment](/gpt-2) runs the loop one token at a time, with the predictions drawn live.

## See also

[Language model](language-model.md) · [Pretraining](pretraining.md) · [Logits](logits.md) · [Sampling](sampling.md) · [Base model](base-model.md)

## Sources

- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
- Brown et al., ["Language Models are Few-Shot Learners"](https://arxiv.org/abs/2005.14165) (2020), the GPT-3 paper (175 billion parameters); in the course's AI papers as [`2005.14165v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md).
