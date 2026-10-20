---
term: "Open weights"
slug: open-weights
short: "A model whose trained weights are published for anyone to download and run, as opposed to one reachable only through its maker's service."
aliases: [open model, open-source model, downloadable model]
category: models-and-training
see_also: [weights, model-card, smollm2, gpt-2]
updated: 2026-10-19
---

# Open weights

**A model whose trained weights are published for anyone to download and run, as opposed to one reachable only through its maker's service.**

## In plain terms

GPT-2, SmolLM2, and Gemma publish their weights; the models behind ChatGPT and Claude do not. Open weights let anyone run, study, or fine-tune a model, which is what makes the in-browser experiments possible. "Open weights" is more precise than "open source": often the weights are released while the training data and code are not, and licenses vary.

The difference shapes what a class can do. With open weights you can see the base model; with a hosted assistant you only meet the finished character.

## See also

[Weights](weights.md) · [Model card](model-card.md) · [SmolLM2](smollm2.md) · [GPT-2](gpt-2.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
- Open Source Initiative, [The Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition) (on why releasing weights alone may not count as open source).
