---
term: "Fine-tuning"
slug: fine-tuning
short: "Continuing to train an already-trained model on a smaller, chosen set of examples, to shift its behavior toward them."
aliases: [finetuning, further training]
category: models-and-training
see_also: [supervised-fine-tuning, lora, post-training, weights, context-distillation]
readings: [askell-2021]
experiments: [fine-tune]
updated: 2026-10-19
---

# Fine-tuning

**Continuing to train an already-trained model on a smaller, chosen set of examples, to shift its behavior toward them.**

## In plain terms

Fine-tuning takes the pretrained weights as a starting point and keeps training on new text: legal documents to make a legal writer, dialogues to make a chat partner. The model keeps most of what it knew and leans toward the new examples.

It differs from prompting in a useful way. A prompt asks a model to continue a particular context; fine-tuning changes what the model expects text to look like in the first place. The fine-tune notebook does this to SmolLM2-135M with about fifty short dialogues.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) (section 2.1) puts the difference with a counting example: show a model "1, 2, ..., 63" and it expects 64 next; fine-tune on the same list and it "will not expect to immediately see the token 64," though it will "catch on to the counting pattern" if you continue it.

## Try it

[The fine-tune notebook](/fine-tune).

## See also

[Supervised fine-tuning](supervised-fine-tuning.md) · [LoRA](lora.md) · [Post-training](post-training.md) · [Weights](weights.md) · [Context distillation](context-distillation.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
- Hu et al., ["LoRA: Low-Rank Adaptation of Large Language Models"](https://arxiv.org/abs/2106.09685) (2021); in the course's AI papers as [`2106.09685v2`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2106.09685v2--lora-low-rank-adaptation-of-large-language-models.md).
