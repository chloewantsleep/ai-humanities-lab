---
term: "In-context learning"
slug: in-context-learning
short: "A model picking up a task from examples in its input, with no change to its weights."
aliases: [prompting, few-shot learning]
category: models-and-training
see_also: [few-shot-prompting, preamble, base-model, context-window, context-distillation]
readings: [askell-2021]
experiments: [by-hand]
updated: 2026-10-19
---

# In-context learning

**A model picking up a task from examples in its input, with no change to its weights.**

## In plain terms

Show a base model three lines of English followed by French and a fourth English line, and it will likely write French. Nothing was retrained; the pattern in the [context](context-window.md) made French the likely continuation. Brown and colleagues' GPT-3 paper (2020) made this the headline: a big enough model can do many tasks from a few examples in the prompt.

The fake-dialogue preamble in the four columns is in-context learning at work: the model infers from the examples what kind of character "Assistant" is. How to *write* such prompts belongs to [few-shot prompting](../persona-and-dialogue/few-shot-prompting.md).

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) (section 1.2, verify) cites GPT-3's few-shot learning as the reason a long prompt of example conversations can "generically elicit" assistant behavior.

## Try it

Column 2 of [building the assistant by hand](/by-hand); edit the preamble's examples and watch the character change.

## See also

[Few-shot prompting](../persona-and-dialogue/few-shot-prompting.md) · [Preamble](../persona-and-dialogue/preamble.md) · [Base model](base-model.md) · [Context window](context-window.md) · [Context distillation](context-distillation.md)

## Sources

- Brown et al., ["Language Models are Few-Shot Learners"](https://arxiv.org/abs/2005.14165) (2020), the GPT-3 paper (175 billion parameters); in the course's AI papers as [`2005.14165v4`](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md).
- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
