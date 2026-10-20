---
term: "GPT-2 and \"Language Models are Unsupervised Multitask Learners\" (2019)"
slug: gpt-2-paper
short: "OpenAI's 2019 paper and model: a 1.5-billion-parameter base model trained on web pages linked from Reddit, first withheld as too risky to release, now the GPT-2 experiment's default."
aliases: [GPT-2, Radford et al. 2019, WebText, the unicorn story]
category: people-and-texts
see_also: [shannon-1948, gpt-3-paper, attention-is-all-you-need, ../models-and-training/base-model, ../models-and-training/training-data, ../models-and-training/pretraining, ../models-and-training/gpt-2]
readings: []
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# GPT-2 and "Language Models are Unsupervised Multitask Learners" (2019)

**OpenAI's 2019 paper and model: a 1.5-billion-parameter base model trained on web pages linked from Reddit, first withheld as too risky to release, now the GPT-2 experiment's default.**

## Why it matters here

GPT-2 is the purest base model the experiments use: trained only to continue internet text, before chat transcripts filled the internet. Ask it "Who are you?" and it doesn't answer; it continues, often as a forum post. That is why it opens the [GPT-2 experiment](/gpt-2).

Its release is also part of the story. OpenAI's February 2019 announcement led with a continuation about scientists finding "a herd of unicorns living in a remote, previously unexplored valley, in the Andes Mountains" who "spoke perfect English," and said that "due to our concerns about malicious applications of the technology, we are not releasing the trained model." Smaller versions came out over the year, and the full 1.5B model on 5 November 2019. The model now loads in a browser tab in seconds.

## Try it

The [GPT-2 experiment](/gpt-2) runs GPT-2 small (`Xenova/gpt2`) in the browser; try the unicorn prompt. Column 1 of [building the assistant by hand](/by-hand) shows a base model's non-answer.

## See also

[Shannon 1948](shannon-1948.md) · [GPT-3 paper](gpt-3-paper.md) · [Attention Is All You Need](attention-is-all-you-need.md) · [Base model](../models-and-training/base-model.md) · [Training data](../models-and-training/training-data.md) · [Pretraining](../models-and-training/pretraining.md) · [GPT-2 (the model)](../models-and-training/gpt-2.md)

## Sources

- Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, and Ilya Sutskever, ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (OpenAI, 2019): "Our largest model, GPT-2, is a 1.5B parameter Transformer"; WebText was scraped from "all outbound links from Reddit ... which received at least 3 karma," "slightly over 8 million documents for a total of 40 GB of text"; the unicorn prompt is in Table 13 (the original reads "scientist discovered").
- OpenAI, ["Better language models and their implications"](https://openai.com/index/better-language-models/) (14 February 2019); ["GPT-2: 1.5B release"](https://openai.com/index/gpt-2-1-5b-release/) (5 November 2019).
