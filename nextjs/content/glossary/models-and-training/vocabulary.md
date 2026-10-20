---
term: "Vocabulary"
slug: vocabulary
short: "The complete list of tokens a model knows. Every prediction is a choice among exactly these."
aliases: [vocab]
category: models-and-training
see_also: [token, tokenizer, logits, probability-distribution]
updated: 2026-10-19
---

# Vocabulary

**The complete list of tokens a model knows. Every prediction is a choice among exactly these.**

## In plain terms

GPT-2's vocabulary has 50,257 tokens. At every step the model produces one score for each of them, all 50,257, and the next token is drawn from that list. Nothing outside the vocabulary can ever be written, though any text can be spelled out from smaller pieces, down to single bytes.

The vocabulary is a record of its training text. GPT-2's was built from web pages linked from Reddit, so it contains whole-word tokens for usernames and forum oddities that turned up often enough to be merged. Newer models have much larger vocabularies (often 100,000 or more, verify for any given model) to cover more languages and code efficiently.

## See also

[Token](token.md) · [Tokenizer](tokenizer.md) · [Logits](logits.md) · [Probability distribution](probability-distribution.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
- Radford et al., ["Language Models are Unsupervised Multitask Learners"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019), the GPT-2 paper.
