---
term: "Language model"
slug: language-model
short: "A program that, given some text, assigns a probability to every possible next piece of text, and can write by repeatedly picking one."
aliases: [LM, large language model, LLM]
category: models-and-training
see_also: [next-token-prediction, token, base-model, transformer, post-training]
readings: [shanahan-2023]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Language model

**A program that, given some text, assigns a probability to every possible next piece of text, and can write by repeatedly picking one.**

## In plain terms

A language model is a very large table of guesses, computed rather than stored: show it "Men are all alike" and it gives a probability for every token that could come next ("." quite likely, "in" possible, "banana" very unlikely). Writing is that step run over and over: pick a token, add it to the text, ask again.

"Large" language models are the same idea at enormous scale: billions of [parameters](parameters.md), trained on a large share of the public internet. Every chatbot after about 2020 in the [history](../../history/README.md) has one of these at its center; what changes from product to product is mostly what is trained and wrapped around it. ELIZA is not a language model: it matches keywords against a hand-written script and computes no probabilities.

## In the readings

[Shanahan, McDonell, and Reynolds 2023](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md) (abstract) insists on keeping the model and the character it plays apart: describing a dialogue agent "in terms of role-play" lets us use folk-psychological words "without ascribing human characteristics to language models they in fact lack." The language model is the thing doing the playing.

## Try it

[The GPT-2 experiment](/gpt-2) shows a language model with nothing around it. [Building the assistant by hand](/by-hand) puts the same kind of model in four different settings.

## See also

[Next-token prediction](next-token-prediction.md) · [Token](token.md) · [Base model](base-model.md) · [Transformer](transformer.md) · [Post-training](post-training.md)

## Sources

- Brown et al., ["Language Models are Few-Shot Learners"](https://arxiv.org/abs/2005.14165) (2020), the GPT-3 paper (175 billion parameters); in the course's AI papers as [`2005.14165v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md).
- Shanahan, McDonell, and Reynolds, ["Role-Play with Large Language Models"](https://arxiv.org/abs/2305.16367) (2023), abstract.
