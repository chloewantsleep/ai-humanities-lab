---
term: "Base model"
slug: base-model
short: "A language model trained only to continue text, before any training to act as an assistant."
aliases: [pretrained model, foundation model, pt model]
category: models-and-training
see_also: [pretraining, instruct-model, post-training, end-of-sequence-token, simulator, preamble]
readings: [askell-2021, shanahan-2023]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# Base model

**A language model trained only to continue text, before any training to act as an assistant.**

## In plain terms

A base model is what pretraining leaves: a machine for continuing documents. Give it "Who are you?" and it might continue with more questions, as if the text were a quiz, or write the rest of a forum post, or sign off with a copyright notice. It is not dodging; it is answering a different question, "what text comes next?", and it doesn't stop when an answer would.

A base model can still be made to behave like an assistant: write the beginning of a transcript in which an assistant answers helpfully, and it plays the assistant (see [preamble](../persona-and-dialogue/preamble.md)). GPT-2 and SmolLM2-135M are base models; Gemma 3 270M's base version is labeled "pt" (pretrained).

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) (section 2) begins with base models and a prompt of "fourteen human-assistant conversations, where the assistant is always polite, helpful, and accurate" and finds that alignment of this kind improves with model size. [Shanahan, McDonell, and Reynolds 2023](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md) treats the base model as capable of playing many characters, the assistant being one.

## Try it

[The GPT-2 experiment](/gpt-2) is a base model with nothing around it; column 1 of [building the assistant by hand](/by-hand) puts it beside its post-trained sibling.

## See also

[Pretraining](pretraining.md) · [Instruct model](instruct-model.md) · [Post-training](post-training.md) · [End-of-sequence token](end-of-sequence-token.md) · [Simulator](../persona-and-dialogue/simulator.md) · [Preamble](../persona-and-dialogue/preamble.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
- Allal et al., ["SmolLM2: When Smol Goes Big"](https://arxiv.org/abs/2502.02737) (2025), and the [HuggingFaceTB/SmolLM2-135M model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M).
- Hugging Face, [onnx-community/gemma-3-270m-ONNX](https://huggingface.co/onnx-community/gemma-3-270m-ONNX).
