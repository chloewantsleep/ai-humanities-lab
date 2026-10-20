---
term: "Inference"
slug: inference
short: "Running a trained model to get output, as opposed to training it. Every chat reply is inference."
aliases: [generation, serving]
category: models-and-training
see_also: [training, webgpu, quantization, tokens-per-second]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Inference

**Running a trained model to get output, as opposed to training it. Every chat reply is inference.**

## In plain terms

Training sets the weights; inference uses them. Inference is much cheaper per use than training but happens far more often, so for a popular chatbot most of the total cost is inference. It can run in a data center (Claude), on a laptop, or, for small models, in a browser tab (the GPT-2 experiment).

The model doesn't change during inference. What feels like learning within a conversation is the conversation itself being sent back each turn (see [context window](context-window.md)).

## Try it

[The GPT-2 experiment](/gpt-2). [Building the assistant by hand](/by-hand).

## See also

[Training](training.md) · [WebGPU](webgpu.md) · [Quantization](quantization.md) · [Tokens per second](tokens-per-second.md)
