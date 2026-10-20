---
term: "ONNX"
slug: onnx
short: "An open file format for neural networks, so a model trained in one framework can run in another, including a web browser."
aliases: [Open Neural Network Exchange]
category: models-and-training
see_also: [weights, transformers-js, webgpu, quantization]
updated: 2026-10-19
---

# ONNX

**An open file format for neural networks, so a model trained in one framework can run in another, including a web browser.**

## In plain terms

Models are mostly trained in PyTorch, which doesn't run in a browser. ONNX describes the model's computation and weights in a neutral format that other runtimes, among them ONNX Runtime Web, can execute. Facebook and Microsoft introduced it in 2017 (verify).

On Hugging Face, the `onnx-community` and `Xenova` repositories hold ONNX conversions of popular models; that is why the experiments' model list names repositories like `onnx-community/SmolLM2-135M-ONNX` rather than the original ones. A model without an ONNX conversion can't load in the browser engine.

## See also

[Weights](weights.md) · [Transformers.js](transformers-js.md) · [WebGPU](webgpu.md) · [Quantization](quantization.md)

## Sources

- ONNX, [onnx.ai](https://onnx.ai/).
- Hugging Face, [Transformers.js documentation](https://huggingface.co/docs/transformers.js).
