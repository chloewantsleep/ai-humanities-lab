---
term: "Pretraining"
slug: pretraining
short: "The first and largest stage of training: next-token prediction on an enormous body of text, producing a base model."
aliases: [pre-training, self-supervised learning]
category: models-and-training
see_also: [training-data, base-model, next-token-prediction, post-training, scaling-laws]
readings: [shanahan-2023]
experiments: [spiral]
updated: 2026-10-19
---

# Pretraining

**The first and largest stage of training: next-token prediction on an enormous body of text, producing a base model.**

## In plain terms

In pretraining, nobody labels anything. The text is its own answer key: every next token is a test question. This is what made language models scale: the internet supplies endless practice.

Pretraining is where nearly all the cost and nearly all the knowledge go. It produces a [base model](base-model.md) that can continue any kind of text in the style of its source, and that has no stable sense of being anyone. Everything after it is called [post-training](post-training.md), much smaller and much later, and it is what turns the result into a chatbot.

## In the readings

[Shanahan, McDonell, and Reynolds 2023](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md) describe the dialogue agent as playing a role (abstract); that a base model can play many roles because pretraining exposed it to many kinds of text is the paper's broader argument (verify the section).

## Try it

[The GPT-2 experiment](/gpt-2).

## See also

[Training data](training-data.md) · [Base model](base-model.md) · [Next-token prediction](next-token-prediction.md) · [Post-training](post-training.md) · [Scaling laws](scaling-laws.md)

## Sources

- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
- Brown et al., ["Language Models are Few-Shot Learners"](https://arxiv.org/abs/2005.14165) (2020), the GPT-3 paper (175 billion parameters); in the course's AI papers as [`2005.14165v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md).
