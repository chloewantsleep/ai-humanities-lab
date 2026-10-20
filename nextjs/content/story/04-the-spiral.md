---
title: "GPT-2"
chapter: 2
years: "2019"
description: "Generate text from learned patterns."
year: 2019
label: "GPT-2"
---

# GPT-2

A [Markov chain](/markov) offers a simple way to generate text: count which words follow a short sequence, then sample a continuation. GPT-2 uses a neural network to predict the next [token](../glossary/models-and-training/token.md), which can be a word or part of one.

OpenAI released GPT-2 in 2019. Training on web text taught it patterns that it can use to continue a prompt. Each generated token becomes part of the text used to predict the next one. [Read the GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf).

```panel
type: demo
demo: spiral
prompt: "Who are you?\n"
recorded: "\nI'm not on the inside, so I'll see how you behave. This is the last thing I'm going to do.\n\n\"I'd like to meet you,\" you say softly.\n\n\"Yes I want to meet you,\" you say.\n\nAnd I ask you again. \"You wanna get up?\"\n\n"
recorded_note: "Recorded 19 Oct 2026: GPT-2 small, temperature 0.8, top-k 40, 70 new tokens. See [all recorded samples](samples/gpt2-20261019.md)."
fallback: "The web demonstration includes a recorded GPT-2 response and an option to run the model."
caption: "Run GPT-2 in your browser. The model downloads when you load it."
```

Try a question, then the start of a story. Compare the continuations. GPT-2 may answer, invent another speaker, or repeat itself. Its training task lets it continue any of these forms.

Change the prompt to include speaker labels such as `User:` and `Assistant:`. Does that change the exchange? The [full GPT-2 experiment](/gpt-2) has more examples and controls.
