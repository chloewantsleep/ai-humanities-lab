---
term: "Quantization"
slug: quantization
short: "Storing a model's weights with fewer bits each, so it is smaller and faster, at some cost in quality."
aliases: [q4, q8, int8, 4-bit]
category: models-and-training
see_also: [parameters, weights, onnx, inference]
updated: 2026-10-19
---

# Quantization

**Storing a model's weights with fewer bits each, so it is smaller and faster, at some cost in quality.**

## In plain terms

Weights are usually trained as 16- or 32-bit numbers. Quantization rounds them to 8 or 4 bits, so a model shrinks to a half or a quarter of its size and runs faster, especially on modest hardware. Small models lose more from it than large ones.

Browser models are usually quantized; transformers.js lets a page choose among versions such as `fp32`, `fp16`, `q8`, and `q4` where the model repository provides them (see the library's documentation). The download sizes the experiments report depend on this choice.

## See also

[Parameters](parameters.md) · [Weights](weights.md) · [ONNX](onnx.md) · [Inference](inference.md)

## Sources

- Hugging Face, [Transformers.js documentation](https://huggingface.co/docs/transformers.js).
