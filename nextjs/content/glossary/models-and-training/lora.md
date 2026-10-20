---
term: "LoRA"
slug: lora
short: "A cheap way to fine-tune: freeze the model's weights and train a small set of added numbers that adjust them."
aliases: [low-rank adaptation, adapter]
category: models-and-training
see_also: [fine-tuning, parameters, weights]
experiments: [fine-tune]
updated: 2026-10-19
---

# LoRA

**A cheap way to fine-tune: freeze the model's weights and train a small set of added numbers that adjust them.**

## In plain terms

Fine-tuning every weight of a large model needs as much memory as training it. LoRA (Hu and colleagues at Microsoft, 2021) leaves the original weights untouched and adds small matrices beside some layers, training only those. The paper reports that for GPT-3 this cut the trainable parameters by 10,000 times and the memory needed by three times, with quality on par with full fine-tuning.

The result is a small "adapter" file that can be added to the original model or merged into it. That is what makes fine-tuning possible on a free Colab GPU, as in the fine-tune notebook.

## Try it

[The fine-tune notebook](/fine-tune) trains a LoRA adapter for SmolLM2-135M.

## See also

[Fine-tuning](fine-tuning.md) · [Parameters](parameters.md) · [Weights](weights.md)

## Sources

- Hu et al., ["LoRA: Low-Rank Adaptation of Large Language Models"](https://arxiv.org/abs/2106.09685) (2021); in the course's AI papers as [`2106.09685v2`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2106.09685v2--lora-low-rank-adaptation-of-large-language-models.md).
