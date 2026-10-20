---
term: "Transformers.js"
slug: transformers-js
short: "Hugging Face's JavaScript library for running models in the browser or Node, the engine under the in-browser experiments."
aliases: [transformers.js, "@huggingface/transformers"]
category: models-and-training
see_also: [onnx, webgpu, inference, quantization]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Transformers.js

**Hugging Face's JavaScript library for running models in the browser or Node, the engine under the in-browser experiments.**

## In plain terms

Transformers.js runs ONNX models in JavaScript, on the CPU through WebAssembly or on the GPU through [WebGPU](webgpu.md). A page names a model, the library downloads its files once (the browser caches them), and generation runs on the visitor's own machine: no server, no key, no account. The experiments use version 4 (`@huggingface/transformers`), inside a Web Worker so the page stays responsive.

Running locally makes the base model something students can poke at directly, at the cost of only small models being practical.

## Try it

[The GPT-2 experiment](/gpt-2). [Building the assistant by hand](/by-hand).

## See also

[ONNX](onnx.md) · [WebGPU](webgpu.md) · [Inference](inference.md) · [Quantization](quantization.md)

## Sources

- Hugging Face, [Transformers.js documentation](https://huggingface.co/docs/transformers.js).
