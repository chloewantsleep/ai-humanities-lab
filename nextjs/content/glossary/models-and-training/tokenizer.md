---
term: "Tokenizer"
slug: tokenizer
short: "The fixed procedure that cuts text into tokens and turns them into numbers, and turns numbers back into text."
aliases: [byte-pair encoding, BPE]
category: models-and-training
see_also: [token, vocabulary, special-tokens, chat-template]
updated: 2026-10-19
---

# Tokenizer

**The fixed procedure that cuts text into tokens and turns them into numbers, and turns numbers back into text.**

## In plain terms

The tokenizer is made once, before training, from a sample of text, and then frozen with the model. GPT-2's uses byte-pair encoding: start from single bytes and repeatedly merge the most frequent adjacent pair into a new token, until the vocabulary reaches its set size. Frequent words end up as single tokens; rare words stay in pieces.

The tokenizer also decides what counts as a [special token](special-tokens.md), and for chat models it ships with the [chat template](chat-template.md). Two models with different tokenizers can't share weights or compare token counts directly, which is one reason the four columns use SmolLM2 and its instruct sibling: same tokenizer, same pretraining.

## See also

[Token](token.md) · [Vocabulary](vocabulary.md) · [Special tokens](special-tokens.md) · [Chat template](chat-template.md)

## Sources

- Sennrich, Haddow, and Birch, ["Neural Machine Translation of Rare Words with Subword Units"](https://arxiv.org/abs/1508.07909) (2015), which introduced byte-pair encoding for language models.
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
