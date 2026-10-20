---
term: "End-of-sequence token"
slug: end-of-sequence-token
short: "The special token a model emits to say \"this text is finished.\" When it is chosen, generation stops."
aliases: [EOS, end-of-text, "<|endoftext|>"]
category: models-and-training
see_also: [special-tokens, stop-sequence, next-token-prediction, base-model, turn-taking]
readings: [sacks-1974]
experiments: [spiral, by-hand]
updated: 2026-10-19
---

# End-of-sequence token

**The special token a model emits to say "this text is finished." When it is chosen, generation stops.**

## In plain terms

A model doesn't know when it's done; it only knows how likely an ending is. Generation stops when the end-of-sequence token is sampled (or a [stop sequence](stop-sequence.md) appears, or a length limit is hit). In GPT-2 that token is `<|endoftext|>`, which in training marked the boundary between one web page and the next.

This is a large part of why a base model spirals. Ask GPT-2 "Who are you?" and an answer is not the most likely kind of document; a forum thread is, and forum threads go on. An assistant, by contrast, has been trained to put the end token right after a complete answer. The GPT-2 experiment's "never stops" mode removes the end token from the choices altogether.

## In the readings

[Sacks, Schegloff, and Jefferson 1974](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/sacks-schegloff-jefferson-1974-turn-taking.md): a speaker "is initially entitled, in having a turn, to one such unit," and the rules re-apply "at each next transition-relevance place, until transfer is effected." A base model has no other speaker to hand over to, so it keeps taking the next turn.

## Try it

[The GPT-2 experiment](/gpt-2) shows the probability of ending at each step, and its "never stops" mode ignores it. Column 1 of [building the assistant by hand](/by-hand) shows a base model that rarely chooses to stop.

## See also

[Special tokens](special-tokens.md) · [Stop sequence](stop-sequence.md) · [Next-token prediction](next-token-prediction.md) · [Base model](base-model.md) · [Turn-taking](../persona-and-dialogue/turn-taking.md)

## Sources

- Hugging Face, [openai-community/gpt2 model card](https://huggingface.co/openai-community/gpt2) (the 124M-parameter "small" GPT-2, its 50,257-token vocabulary, and its WebText training data).
