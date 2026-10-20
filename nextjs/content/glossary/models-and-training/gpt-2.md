---
term: "GPT-2"
slug: gpt-2
short: "OpenAI's 2019 language model, released in stages over safety concerns; a base model of the pre-assistant internet and the default in the GPT-2 experiment."
aliases: [GPT2, gpt2]
category: models-and-training
see_also: [base-model, training-data, parameters, smollm2]
experiments: [spiral]
updated: 2026-10-19
---

# GPT-2

**OpenAI's 2019 language model, released in stages over safety concerns; a base model of the pre-assistant internet and the default in the GPT-2 experiment.**

## In plain terms

OpenAI announced GPT-2 on February 14, 2019, saying it would not release the full 1.5-billion-parameter model at first for fear of misuse, and released it in stages over that year. The smallest version, about 124 million parameters, is the one the GPT-2 experiment loads (`Xenova/gpt2`, a browser-ready conversion).

It was trained on WebText, web pages linked from Reddit, and it predates the chat assistants, so its training text holds almost no transcripts of a polite AI. That makes it the cleanest view of a base model: it has never read anyone being an assistant.

## Try it

The default model in [the GPT-2 experiment](/gpt-2).

## See also

[Base model](base-model.md) · [Training data](training-data.md) · [Parameters](parameters.md) · [SmolLM2](smollm2.md)

## Sources

- OpenAI, ["Better language models and their implications"](https://openai.com/index/better-language-models/), February 14, 2019.
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- OpenAI, ["GPT-2: 1.5B release"](https://openai.com/index/gpt-2-1-5b-release/), November 5, 2019.
