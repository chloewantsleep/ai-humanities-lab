---
term: "Model card"
slug: model-card
short: "A short document published with a model saying what it is, how it was trained, what it is for, and where it falls short."
aliases: [model documentation, system card]
category: models-and-training
see_also: [open-weights, training-data, weights]
updated: 2026-10-19
---

# Model card

**A short document published with a model saying what it is, how it was trained, what it is for, and where it falls short.**

## In plain terms

Mitchell and colleagues proposed model cards in 2018 as a standard way to report a model's intended uses, evaluation, and limitations. On Hugging Face every model repository has one, its README, and it is the first place to check a model's size, training data, license, and chat template. Big labs publish longer "system cards" for their hosted models.

Model cards are where the facts in this glossary about GPT-2 and SmolLM2 come from. Like any self-description, they say what the maker chose to say.

## See also

[Open weights](open-weights.md) · [Training data](training-data.md) · [Weights](weights.md)

## Sources

- Mitchell et al., ["Model Cards for Model Reporting"](https://arxiv.org/abs/1810.03993) (2018).
- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
