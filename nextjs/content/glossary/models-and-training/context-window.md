---
term: "Context window"
slug: context-window
short: "The most text, counted in tokens, that a model can take into account at once. Anything outside it is invisible to the model."
aliases: [context length, context]
category: models-and-training
see_also: [token, attention, conversation-history, system-prompt, context-distillation]
readings: [askell-2021]
updated: 2026-10-19
---

# Context window

**The most text, counted in tokens, that a model can take into account at once. Anything outside it is invisible to the model.**

## In plain terms

GPT-2's window is 1,024 tokens, a few pages. Recent models' windows run to hundreds of thousands of tokens (verify any specific figure). Everything the model is given for one reply has to fit: the [system prompt](../persona-and-dialogue/system-prompt.md), the whole [conversation history](../interfaces-and-agents/conversation-history.md), attached files, and the reply itself.

A chatbot's "memory" within a conversation is just this: the program resends the whole transcript every turn. When a conversation outgrows the window, something has to be dropped or summarized, and the model loses it.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) (section 2.1) gives the window as one reason to stop prompting and train instead: a prepended prompt "occupies useful space in a finite context window." Their 4,600-word HHH prompt is a long thing to carry around every turn.

## See also

[Token](token.md) · [Attention](attention.md) · [Conversation history](../interfaces-and-agents/conversation-history.md) · [System prompt](../persona-and-dialogue/system-prompt.md) · [Context distillation](context-distillation.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
