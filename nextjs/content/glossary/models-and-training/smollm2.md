---
term: "SmolLM2"
slug: smollm2
short: "A family of small open-weights models from Hugging Face (2024), each released as a base model and an instruct version; the 135M pair carries the four columns."
aliases: [SmolLM2-135M, SmolLM2-135M-Instruct]
category: models-and-training
see_also: [base-model, instruct-model, gpt-2, open-weights, chat-template]
experiments: [by-hand, spiral]
updated: 2026-10-19
---

# SmolLM2

**A family of small open-weights models from Hugging Face (2024), each released as a base model and an instruct version; the 135M pair carries the four columns.**

## In plain terms

SmolLM2 comes in three sizes (135M, 360M, and 1.7B parameters), and each size comes in a base and an instruct version. That makes it a matched pair: the same tokenizer, the same pretraining, differing only in post-training. The four columns use the 135M pair so the difference between columns 1 and 3 is post-training and nothing else.

Because it was pretrained in 2024 on text that already contained many chatbot conversations, the base model can sound assistant-like on its own, which is itself something to notice beside GPT-2.

## Try it

Columns 1 to 3 of [building the assistant by hand](/by-hand); one of the models in [the GPT-2 experiment](/gpt-2).

## See also

[Base model](base-model.md) · [Instruct model](instruct-model.md) · [GPT-2](gpt-2.md) · [Open weights](open-weights.md) · [Chat template](chat-template.md)

## Sources

- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
- Hugging Face, [HuggingFaceTB/SmolLM2-135M-Instruct model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct).
- Hugging Face, [onnx-community/SmolLM2-135M-ONNX](https://huggingface.co/onnx-community/SmolLM2-135M-ONNX) (the browser-ready base model).
