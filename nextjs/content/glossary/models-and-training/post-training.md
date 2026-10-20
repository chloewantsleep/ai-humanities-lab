---
term: "Post-training"
slug: post-training
short: "Everything done to a model after pretraining to make it useful and safe as an assistant: fine-tuning on examples, training on preferences, and more."
aliases: [alignment training, fine-tuning stage]
category: models-and-training
see_also: [base-model, supervised-fine-tuning, rlhf, constitutional-ai, instruct-model, assistant]
readings: [askell-2021, capek-rur]
experiments: [by-hand]
updated: 2026-10-19
---

# Post-training

**Everything done to a model after pretraining to make it useful and safe as an assistant: fine-tuning on examples, training on preferences, and more.**

## In plain terms

Pretraining makes a model that can write anything; post-training narrows it to one character. A typical recipe: [supervised fine-tuning](supervised-fine-tuning.md) on written examples of good assistant replies, then training on human (or AI) judgments of which replies are better ([RLHF](rlhf.md), [Constitutional AI](constitutional-ai.md)). Along the way the model learns the [chat template](chat-template.md), when to stop, what to refuse, and how to describe itself.

Post-training uses far less data and computation than pretraining but changes the model's behavior more visibly. It is where the [assistant](../persona-and-dialogue/assistant.md) is made a habit rather than a role written into each prompt.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) studies the first steps: prompting, then training the prompt in ("context distillation"), then preference modeling. In [Čapek, *R.U.R.*](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/capek-rur.md), Domin describes young Rossum's method: man "wants to do a whole lot of things that are really unnecessary," so Rossum "had to simplify him." Post-training also cuts away most of what a base model might say; what's kept is decided by what the product is for.

## Try it

Columns 1, 3, and 4 of [building the assistant by hand](/by-hand) show a base model, a small post-trained model, and a heavily post-trained one.

## See also

[Base model](base-model.md) · [Supervised fine-tuning](supervised-fine-tuning.md) · [RLHF](rlhf.md) · [Constitutional AI](constitutional-ai.md) · [Instruct model](instruct-model.md) · [Assistant](../persona-and-dialogue/assistant.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
