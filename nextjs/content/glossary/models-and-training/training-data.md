---
term: "Training data"
slug: training-data
short: "The text a model learns from. For pretraining, a large share of the public internet, books, and code."
aliases: [corpus, dataset, pretraining data]
category: models-and-training
see_also: [pretraining, base-model, vocabulary, model-card]
readings: [shelley-1818]
experiments: [spiral]
updated: 2026-10-19
---

# Training data

**The text a model learns from. For pretraining, a large share of the public internet, books, and code.**

## In plain terms

GPT-2 was trained on WebText, about 8 million web pages (40 GB of text) linked from Reddit posts with at least three upvotes. Later models train on far more, measured in trillions of tokens, and the exact mix is often not disclosed. Whatever is in the data, from encyclopedias and novels to spam, flame wars, and fan fiction, is what the model learns to continue.

Training data now includes the transcripts of earlier chatbots. A 2024 base model has read many conversations with ChatGPT, so asked "Who are you?" it may claim to be one; GPT-2, trained in 2019, cannot.

## In the readings

[Shelley, *Frankenstein*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/shelley-frankenstein-1818.md): the creature learns language by overhearing the De Lacey family through a chink in the wall (volume 2; chapter boundaries verify against the assigned edition), discovering "a godlike science" in "articulate sounds," from lessons meant for someone else. Pretraining is learning language from a record not made for the learner.

## Try it

Compare GPT-2 and SmolLM2 on "Who are you?" in [the GPT-2 experiment](/gpt-2).

## See also

[Pretraining](pretraining.md) · [Base model](base-model.md) · [Vocabulary](vocabulary.md) · [Model card](model-card.md)

## Sources

- OpenAI, ["Better language models and their implications"](https://openai.com/index/better-language-models/), February 14, 2019.
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
