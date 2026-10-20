---
term: "Special tokens"
slug: special-tokens
short: "Tokens that are not text at all but markers: where a document ends, where a turn begins, who is speaking."
aliases: [control tokens, role tokens]
category: models-and-training
see_also: [end-of-sequence-token, chat-template, tokenizer, role, turn]
readings: [sacks-1974]
experiments: [by-hand]
updated: 2026-10-19
---

# Special tokens

**Tokens that are not text at all but markers: where a document ends, where a turn begins, who is speaking.**

## In plain terms

A special token is a vocabulary entry reserved for structure. GPT-2 has one, `<|endoftext|>`, which separated documents in its training data. Chat models add more, such as tokens that open and close a message and say whose message it is. Many chat models use a format like `<|im_start|>user ... <|im_end|>` (the "ChatML" style; check a given model's own template).

To the model these are just tokens it has seen many times in training, in the same positions. To a reader they are where the play's stage directions are hidden: the speaker names and the curtain. A [chat template](chat-template.md) is the rule for inserting them.

## In the readings

[Sacks, Schegloff, and Jefferson 1974](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/sacks-schegloff-jefferson-1974-turn-taking.md) describe the end of a turn as a "transition-relevance place," a point where "transfer of speakership" can happen. In a chat model, that point is not inferred from the talk: it is a token.

## Try it

Column 3 of [building the assistant by hand](/by-hand) shows the instruct model's input with its special tokens visible.

## See also

[End-of-sequence token](end-of-sequence-token.md) · [Chat template](chat-template.md) · [Tokenizer](tokenizer.md) · [Role](../persona-and-dialogue/role.md) · [Turn](../persona-and-dialogue/turn.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- Hugging Face, [Chat templates](https://huggingface.co/docs/transformers/main/en/chat_templating) (Transformers documentation).
