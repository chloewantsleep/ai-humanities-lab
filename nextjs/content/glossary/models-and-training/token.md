---
term: "Token"
slug: token
short: "The unit of text a language model reads and writes: often a whole word, sometimes part of a word, a space, or a punctuation mark."
aliases: [subword]
category: models-and-training
see_also: [tokenizer, vocabulary, special-tokens, next-token-prediction, context-window]
experiments: [spiral]
updated: 2026-10-19
---

# Token

**The unit of text a language model reads and writes: often a whole word, sometimes part of a word, a space, or a punctuation mark.**

## In plain terms

Models don't see letters or words. A [tokenizer](tokenizer.md) cuts text into tokens and replaces each with a number. In GPT-2, " Who" (with its leading space), " are", and " you" are each one token, and "?" is another, so "Who are you?" is four tokens. A rare word like "Weizenbaum" is split into several pieces.

Everything about a model is counted in tokens: how much text it can hold at once (its [context window](context-window.md)), how fast it writes (tokens per second), and what an API charges. A common rule of thumb for English is about three-quarters of a word per token (verify; it varies by tokenizer and language). Because the cut points are statistical, not linguistic, some odd failures follow: a model that never sees individual letters can struggle to count the r's in "strawberry".

## Try it

In [the GPT-2 experiment](/gpt-2), each bar in the live chart is one candidate token, and you can see where words get split.

## See also

[Tokenizer](tokenizer.md) · [Vocabulary](vocabulary.md) · [Special tokens](special-tokens.md) · [Next-token prediction](next-token-prediction.md) · [Context window](context-window.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- OpenAI, [Tokenizer](https://platform.openai.com/tokenizer) (an interactive page showing how text is cut into tokens).
