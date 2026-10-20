---
term: "InstructGPT (Ouyang et al., 2022)"
slug: instructgpt
short: "OpenAI's 2022 paper that turned GPT-3 into a model that follows instructions, using people's demonstrations and rankings; ChatGPT was announced as its sibling."
aliases: [InstructGPT, Ouyang et al. 2022, Training language models to follow instructions with human feedback]
category: people-and-texts
see_also: [christiano-2017, askell-2021, gpt-3-paper, ../chatbots/chatgpt, ../models-and-training/rlhf, ../models-and-training/supervised-fine-tuning, ../models-and-training/instruction-tuning]
readings: [ouyang-2022]
experiments: [by-hand, fine-tune]
updated: 2026-10-19
---

# InstructGPT (Ouyang et al., 2022)

**OpenAI's 2022 paper that turned GPT-3 into a model that follows instructions, using people's demonstrations and rankings; ChatGPT was announced as its sibling.**

## Why it matters here

It documents the recipe that made the assistant ordinary. Hired labelers wrote example responses to prompts, and the model was fine-tuned on them; then labelers ranked the model's outputs, and those rankings trained it further with reinforcement learning from human feedback (RLHF). The headline result is the one that matters for the course: people preferred a 1.3-billion-parameter InstructGPT over the 175-billion-parameter GPT-3, "despite having 100x fewer parameters." What people experience as the model's helpfulness came mostly from this post-training, not from size. When OpenAI launched ChatGPT on 30 November 2022, it called it "a sibling model to InstructGPT, which is trained to follow an instruction in a prompt and provide a detailed response."

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md)), whose notes say it "documents the technical construction of the cooperative assistant behavior that users now tend to mistake for the natural behavior of an LLM."

## Try it

Column 3 of [building the assistant by hand](/by-hand) is an instruction-tuned model beside its base model. [Fine-tune your own assistant](/fine-tune) does the first step of the recipe on fifty dialogues.

## See also

[Christiano et al. 2017](christiano-2017.md) · [Askell et al. 2021](askell-2021.md) · [GPT-3 paper](gpt-3-paper.md) · [ChatGPT](../chatbots/chatgpt.md) · [RLHF](../models-and-training/rlhf.md) · [Supervised fine-tuning](../models-and-training/supervised-fine-tuning.md) · [Instruction tuning](../models-and-training/instruction-tuning.md)

## Sources

- Long Ouyang et al., "Training language models to follow instructions with human feedback," *Advances in Neural Information Processing Systems 35* (NeurIPS 2022) ([proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html)); [arXiv:2203.02155](https://arxiv.org/abs/2203.02155), abstract quoted.
- OpenAI, ["Introducing ChatGPT"](https://openai.com/index/chatgpt/) (30 November 2022).
