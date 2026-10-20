---
term: "Supervised fine-tuning"
slug: supervised-fine-tuning
short: "Fine-tuning a base model on written examples of the behavior you want, such as prompts paired with good assistant replies."
aliases: [SFT, behavior cloning, imitation learning]
category: models-and-training
see_also: [fine-tuning, instruction-tuning, rlhf, post-training]
readings: [askell-2021]
updated: 2026-10-19
---

# Supervised fine-tuning

**Fine-tuning a base model on written examples of the behavior you want, such as prompts paired with good assistant replies.**

## In plain terms

In supervised fine-tuning, people write (or select) examples of an ideal reply, and the model is trained to reproduce them. For InstructGPT, OpenAI hired about 40 contractors who wrote demonstrations of the desired behavior for prompts submitted to its API; that was step one, before any ranking.

SFT teaches the format and the voice: answer the question, then stop. It is limited by what people can write down, which is part of why it is usually followed by training on preferences ([RLHF](rlhf.md)), where people only have to judge, not write.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) calls this "imitation learning" and reports (abstract) that "ranked preference modeling performs much better than imitation learning."

## See also

[Fine-tuning](fine-tuning.md) · [Instruction tuning](instruction-tuning.md) · [RLHF](rlhf.md) · [Post-training](post-training.md)

## Sources

- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
