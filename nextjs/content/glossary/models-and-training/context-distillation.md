---
term: "Context distillation"
slug: context-distillation
short: "Training a model to behave as if a long prompt were in front of it, so the prompt no longer has to be sent."
aliases: [prompt distillation]
category: models-and-training
see_also: [preamble, fine-tuning, context-window, post-training, system-prompt]
readings: [askell-2021]
experiments: [by-hand]
updated: 2026-10-19
---

# Context distillation

**Training a model to behave as if a long prompt were in front of it, so the prompt no longer has to be sent.**

## In plain terms

Askell and colleagues found that a 4,600-word prompt of fourteen invented conversations made a base model act as a helpful assistant. Sending that prompt with every question is expensive and uses up the context window, so they fine-tuned the model on its own prompted behavior: the trained model acts as if the conversations were there.

This is the clearest link between columns 2 and 3 of the four columns. The assistant first exists as a character in a script placed before the question; distillation writes the script into the weights.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md), section 2.1 ("Context Distillation"): "One way to avoid all of these problems is to finetune on the prompt."

## Try it

Compare column 2 (the preamble) and column 3 (post-trained) of [building the assistant by hand](/by-hand).

## See also

[Preamble](../persona-and-dialogue/preamble.md) · [Fine-tuning](fine-tuning.md) · [Context window](context-window.md) · [Post-training](post-training.md) · [System prompt](../persona-and-dialogue/system-prompt.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
