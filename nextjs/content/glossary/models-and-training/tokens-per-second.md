---
term: "Tokens per second"
slug: tokens-per-second
short: "How fast a model writes, the common measure of inference speed."
aliases: [throughput, generation speed, tok/s]
category: models-and-training
see_also: [inference, token, webgpu, quantization, parameters]
experiments: [spiral]
updated: 2026-10-19
---

# Tokens per second

**How fast a model writes, the common measure of inference speed.**

## In plain terms

A model writes one token per step, so its speed is counted in tokens per second. Speed depends on the model's size, the hardware, the numeric precision, and whether the GPU is used. Reading speed is a few tokens per second; a hosted assistant often writes much faster than that.

The chat interface's [streaming](../interfaces-and-agents/streaming.md), with words appearing one by one, is this rate made visible. In the GPT-2 experiment it is slow enough to watch each choice.

## Try it

[The GPT-2 experiment](/gpt-2).

## See also

[Inference](inference.md) · [Token](token.md) · [WebGPU](webgpu.md) · [Quantization](quantization.md) · [Parameters](parameters.md)
