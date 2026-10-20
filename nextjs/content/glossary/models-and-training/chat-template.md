---
term: "Chat template"
slug: chat-template
short: "The exact text format that turns a list of messages (system, user, assistant) into the single string a chat model was trained on, special tokens included."
aliases: [prompt format, chat format, ChatML]
category: models-and-training
see_also: [special-tokens, instruct-model, role, system-prompt, turn]
experiments: [by-hand, layers]
updated: 2026-10-19
---

# Chat template

**The exact text format that turns a list of messages (system, user, assistant) into the single string a chat model was trained on, special tokens included.**

## In plain terms

A chat model still reads one long string. The chat template is the rule that writes the conversation into it: where the [system prompt](../persona-and-dialogue/system-prompt.md) goes, how each user and assistant turn is marked, and the open assistant tag at the end that cues the model to speak. Each model family has its own, stored with its [tokenizer](tokenizer.md); a model given the wrong template behaves worse.

Seeing the template takes away some of the chat window's magic. Your message arrives as a labeled line in a script, and "the assistant" is the next speaker's name the model has been trained to write lines for.

## Try it

Column 3 of [building the assistant by hand](/by-hand) shows the templated string. [The layers](/layers) show what else is added to it.

## See also

[Special tokens](special-tokens.md) · [Instruct model](instruct-model.md) · [Role](../persona-and-dialogue/role.md) · [System prompt](../persona-and-dialogue/system-prompt.md) · [Turn](../persona-and-dialogue/turn.md)

## Sources

- Hugging Face, [Chat templates](https://huggingface.co/docs/transformers/main/en/chat_templating) (Transformers documentation).
