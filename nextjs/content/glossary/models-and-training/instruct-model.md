---
term: "Instruct model"
slug: instruct-model
short: "A model that has been post-trained to follow instructions and answer in turns, as opposed to the base model it started from."
aliases: [chat model, instruction-tuned model, it model, assistant model]
category: models-and-training
see_also: [base-model, post-training, instruction-tuning, chat-template, smollm2]
experiments: [by-hand]
updated: 2026-10-19
---

# Instruct model

**A model that has been post-trained to follow instructions and answer in turns, as opposed to the base model it started from.**

## In plain terms

Model releases often come in pairs: the base model and the instruct (or "chat", or "it", for instruction-tuned) version. SmolLM2-135M and SmolLM2-135M-Instruct; Gemma 3 270M "pt" and "it". The instruct model expects its [chat template](chat-template.md), answers the question, and emits the end token when done.

A small instruct model is a useful thing to see: it has the assistant's manners without much knowledge behind them, so it will confidently answer in the right format and get the facts wrong. The manner and the knowledge come from different stages.

## Try it

Column 3 of [building the assistant by hand](/by-hand).

## See also

[Base model](base-model.md) · [Post-training](post-training.md) · [Instruction tuning](instruction-tuning.md) · [Chat template](chat-template.md) · [SmolLM2](smollm2.md)

## Sources

- Hugging Face, [HuggingFaceTB/SmolLM2-135M-Instruct model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct).
- Hugging Face, [onnx-community/gemma-3-270m-it-ONNX](https://huggingface.co/onnx-community/gemma-3-270m-it-ONNX).
