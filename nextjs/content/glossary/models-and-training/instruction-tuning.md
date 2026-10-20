---
term: "Instruction tuning"
slug: instruction-tuning
short: "Fine-tuning a model on many tasks phrased as instructions with their answers, so it learns to do what it is asked."
aliases: [instruction following, instruction fine-tuning]
category: models-and-training
see_also: [supervised-fine-tuning, instruct-model, post-training, rlhf]
readings: [grice-1975]
experiments: [by-hand]
updated: 2026-10-19
---

# Instruction tuning

**Fine-tuning a model on many tasks phrased as instructions with their answers, so it learns to do what it is asked.**

## In plain terms

A base model given "Translate into French: the cat sleeps" may continue with another instruction, since that's what lists of exercises look like. An instruction-tuned model has been trained on thousands of instruction-and-answer pairs and so treats the instruction as something to carry out. Google's FLAN (2021) showed that tuning on many tasks phrased this way helped on tasks the model had never seen (verify).

"Instruct" in a model's name (SmolLM2-135M-Instruct) usually means some mix of instruction tuning and other post-training, not one specific method.

## In the readings

[Grice, "Logic and Conversation"](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md) states the Cooperative Principle: "Make your conversational contribution such as is required, at the stage at which it occurs, by the accepted purpose or direction of the talk exchange." Instruction tuning trains a model to treat the user's request as the accepted purpose.

## Try it

Column 3 of [building the assistant by hand](/by-hand) is an instruct model.

## See also

[Supervised fine-tuning](supervised-fine-tuning.md) · [Instruct model](instruct-model.md) · [Post-training](post-training.md) · [RLHF](rlhf.md)

## Sources

- Wei et al., ["Finetuned Language Models Are Zero-Shot Learners"](https://arxiv.org/abs/2109.01652) (2021), the FLAN paper.
- Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155) (2022), the InstructGPT paper; [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md).
