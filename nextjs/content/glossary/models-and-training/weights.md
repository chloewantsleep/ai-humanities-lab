---
term: "Weights"
slug: weights
short: "The learned numbers that make a model what it is; the file you download when you download a model."
aliases: [model weights, checkpoint]
category: models-and-training
see_also: [parameters, open-weights, fine-tuning, onnx]
experiments: [by-hand]
updated: 2026-10-19
---

# Weights

**The learned numbers that make a model what it is; the file you download when you download a model.**

## In plain terms

The architecture is the recipe; the weights are the cooked dish. Two models with the same architecture and different weights behave completely differently: SmolLM2-135M and SmolLM2-135M-Instruct have the same shape and differ only in their weights, which is why one spirals and the other answers.

A "checkpoint" is the weights saved at some point in training. When a company releases a model's weights, anyone can run it; when it doesn't, you can only reach it through the company's service (see [open weights](open-weights.md)).

## Try it

Columns 1 and 3 of [building the assistant by hand](/by-hand) are the same architecture with different weights.

## See also

[Parameters](parameters.md) · [Open weights](open-weights.md) · [Fine-tuning](fine-tuning.md) · [ONNX](onnx.md)

## Sources

- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
- Hugging Face, [HuggingFaceTB/SmolLM2-135M-Instruct model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct).
