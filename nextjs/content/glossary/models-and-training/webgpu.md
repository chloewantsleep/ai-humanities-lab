---
term: "WebGPU"
slug: webgpu
short: "A web standard that lets a page use the computer's graphics processor for general computation, making in-browser models much faster."
aliases: [GPU, WebAssembly, WASM]
category: models-and-training
see_also: [transformers-js, onnx, inference, tokens-per-second]
updated: 2026-10-19
---

# WebGPU

**A web standard that lets a page use the computer's graphics processor for general computation, making in-browser models much faster.**

## In plain terms

Neural networks are mostly large multiplications, which graphics processors do in parallel. WebGPU exposes the GPU to web pages; where it isn't available, a model runs on the CPU through WebAssembly (WASM), which works everywhere and is slower. The browser engine prefers WebGPU and reports which one it is using.

Support varies by browser and system; Chrome turned it on by default in 2023 (verify), and others followed later.

## See also

[Transformers.js](transformers-js.md) · [ONNX](onnx.md) · [Inference](inference.md) · [Tokens per second](tokens-per-second.md)

## Sources

- W3C, [WebGPU](https://www.w3.org/TR/webgpu/) specification.
- MDN, [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) (browser compatibility).
- Hugging Face, [Transformers.js documentation](https://huggingface.co/docs/transformers.js).
