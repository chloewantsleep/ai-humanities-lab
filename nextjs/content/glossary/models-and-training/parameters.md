---
term: "Parameters"
slug: parameters
short: "The adjustable numbers inside a model, learned in training. Their count is the usual measure of a model's size."
aliases: [parameter count, model size]
category: models-and-training
see_also: [weights, neural-network, scaling-laws, quantization]
updated: 2026-10-19
---

# Parameters

**The adjustable numbers inside a model, learned in training. Their count is the usual measure of a model's size.**

## In plain terms

"135M" in SmolLM2-135M means about 135 million parameters; GPT-2 small has about 124 million, the full GPT-2 1.5 billion, GPT-3 175 billion. More parameters give the model more room to store patterns from its training text, which is why size and capability rose together for several years.

Parameters and [weights](weights.md) are used almost interchangeably. Size also sets the practical cost: each parameter takes two bytes at common precision (less after [quantization](quantization.md)), so a 135M-parameter model is a download of a few hundred megabytes and runs in a browser, and a 175-billion-parameter one does not.

## See also

[Weights](weights.md) · [Neural network](neural-network.md) · [Scaling laws](scaling-laws.md) · [Quantization](quantization.md)

## Sources

- OpenAI, ["Better language models and their implications"](https://openai.com/index/better-language-models/), February 14, 2019.
- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- Brown et al., ["Language Models are Few-Shot Learners"](https://arxiv.org/abs/2005.14165) (2020), the GPT-3 paper (175 billion parameters); in the course's AI papers as [`2005.14165v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md).
- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
