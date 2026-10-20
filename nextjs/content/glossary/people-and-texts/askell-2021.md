---
term: "A General Language Assistant as a Laboratory for Alignment (2021)"
slug: askell-2021
short: "Anthropic's 2021 paper by Askell and colleagues that defined the assistant as helpful, honest, and harmless, and first made one by putting fourteen invented conversations in front of a base model."
aliases: [Askell et al. 2021, the HHH prompt, Amanda Askell, A General Language Assistant]
category: people-and-texts
see_also: [gpt-3-paper, instructgpt, constitutional-ai-paper, the-void, ../persona-and-dialogue/hhh, ../persona-and-dialogue/preamble, ../persona-and-dialogue/assistant, ../models-and-training/preference-data, ../models-and-training/context-distillation]
readings: [askell-2021]
experiments: [by-hand]
updated: 2026-10-19
---

# A General Language Assistant as a Laboratory for Alignment (2021)

**Anthropic's 2021 paper by Askell and colleagues that defined the assistant as helpful, honest, and harmless, and first made one by putting fourteen invented conversations in front of a base model.**

## Why it matters here

The October 20 workshop description singles it out, because it shows the assistant being made. The paper sets the target in three words: "We will define an AI as 'aligned' if it is, in three words, helpful, honest, and harmless or 'HHH'." Then, before any fine-tuning, it gets that behavior from a base model with a prompt: "fourteen human-assistant conversations, where the assistant is always polite, helpful, and accurate," about 4,600 words, which the authors call the "HHH prompt." The assistant begins as a character in a written script that a model learns to continue. Later the paper compares training methods and finds that learning from ranked preferences beats imitation.

That is the move column 2 of [building the assistant by hand](/by-hand) repeats with a much smaller model, and the starting point for nostalgebraist's ["the void"](the-void.md), which asks what happens when models are trained on a character first sketched this way.

## In the readings

The course copy is an abstract and notes ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md)). In the full paper: the HHH definition is in §1.1; the prompt in §1.2 and §2; "context distillation" (training the model to behave as if the prompt were there) in §2.1; prompt details in Appendix B and the full HHH criteria in Appendix E. The prompt itself was published as a [gist](https://gist.github.com/jareddk/2509330f8ef3d787fc5aaac67aab5f11).

## Try it

[Building the assistant by hand](/by-hand), column 2: edit the preamble (an HHH-style script, a sardonic assistant, a medieval monk) and the same base model plays the new part.

## See also

[GPT-3 paper](gpt-3-paper.md) · [InstructGPT](instructgpt.md) · [Constitutional AI](constitutional-ai-paper.md) · ["the void"](the-void.md) · [HHH](../persona-and-dialogue/hhh.md) · [Preamble](../persona-and-dialogue/preamble.md) · [Assistant](../persona-and-dialogue/assistant.md) · [Preference data](../models-and-training/preference-data.md) · [Context distillation](../models-and-training/context-distillation.md)

## Sources

- Amanda Askell, Yuntao Bai, Anna Chen, et al., "A General Language Assistant as a Laboratory for Alignment," [arXiv:2112.00861](https://arxiv.org/abs/2112.00861) (December 2021), quotations from §1.1, §1.2, and §2.
- [ENG 298AI syllabus](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/syllabus.md), Seminar 7.
