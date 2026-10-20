---
title: "The spiral: a model with no one in it"
chapter: 4
years: "1913 – 2020"
description: "Statistics replace rules. A base model learns to continue the internet, and asked who it is, it keeps writing: not an answer, a continuation."
year: 1913
label: "Markov counts letters"
---

# The spiral: a model with no one in it

ELIZA's rules were written by a person. The models behind today's chatbots were not written that way at all. Their story starts with a different question: given the text so far, what comes next?

```panel
type: quote
year: 1948
label: "Shannon's approximations"
text: "THE HEAD AND IN FRONTAL ATTACK ON AN ENGLISH WRITER THAT THE CHARACTER OF THIS POINT IS THEREFORE ANOTHER METHOD FOR THE LETTERS THAT THE TIME OF WHO EVER TOLD THE PROBLEM FOR AN UNEXPECTED."
cite: "Claude Shannon, \"A Mathematical Theory of Communication\" (1948), §3: a \"second-order word approximation\" to English"
href: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf"
```

In 1913 Andrey Markov counted 20,000 letters of Pushkin's *Eugene Onegin* to show that the chance of a vowel depends on the letter before it ([Markov 1913](../glossary/people-and-texts/markov-1913.md)). In 1948 Claude Shannon turned that around and *generated* text from such counts. The result reads like English for a few words at a time and goes nowhere. That is a language model in miniature: no rules about meaning, no script, no role, only the odds of what comes next.

```panel
type: demo
demo: spiral
year: 2019
label: "GPT-2"
prompt: "Who are you?\n"
recorded: "\nI'm not on the inside, so I'll see how you behave. This is the last thing I'm going to do.\n\n\"I'd like to meet you,\" you say softly.\n\n\"Yes I want to meet you,\" you say.\n\nAnd I ask you again. \"You wanna get up?\"\n\n"
recorded_note: "Recorded 19 Oct 2026: GPT-2 small, temperature 0.8, top-k 40, 70 new tokens (sample 4 of 4; see the samples page). Run it yourself and you will get something different."
fallback: "\"Who are you?\" → \"I'm not on the inside, so I'll see how you behave. This is the last thing I'm going to do. 'I'd like to meet you,' you say softly …\" (GPT-2 small, recorded 19 Oct 2026)"
caption: "GPT-2 small (124M parameters, 2019), the real model. It loads only if you click, and runs on your own computer."
```

In February 2019 OpenAI released [GPT-2](../glossary/models-and-training/gpt-2.md), "trained simply to predict the next word in 40GB of Internet text." It is a [base model](../glossary/models-and-training/base-model.md): it has only been [pretrained](../glossary/models-and-training/pretraining.md). Its training text was chosen by a crowd's taste: pages linked from Reddit posts with "at least 3 karma." Like Shelley's creature, it learned to speak by overhearing.

Now ask it who it is. It does not answer. It slides into a piece of second-person fiction in which "you say softly" that you'd like to meet. A question, to a base model, is just the start of some document (a forum post, a story, an interview), and it continues it. This is the spiral. Load the model and try a few prompts: every run is different, and none of them is a reply.

```panel
type: title
text: "All of it is one flat line of text. No inside, no outside, no one *answering*."
```

GPT-2 has no fixed "I" and no fixed "you." A question can make it the asker, the answerer, or a narrator, sometimes in one run. Everything it writes lies on one flat line of tokens. Nothing in the text separates a speaker from what is spoken, or a question from its answer. Readers bring those distinctions. The rest of this history is largely about putting them into the text so firmly that readers stop noticing they were put there.

Murray Shanahan puts it carefully: when a model completes "The first person to walk on the Moon was," we are "not really asking who was the first person to walk on the Moon." We are asking which words are most likely to come next ([Shanahan 2022](../glossary/people-and-texts/talking-about-large-language-models.md)). Where ELIZA was certain and shallow, GPT-2 is fluent and unanchored: probable, not determined.

```panel
type: continuation
year: 2020
label: "GPT-3 and in-context learning"
heading: "Few-shot prompting, Brown et al. 2020, Figure 2.1"
prompt: "Translate English to French:\nsea otter => loutre de mer\npeppermint => menthe poivrée\nplush girafe => girafe peluche\ncheese =>"
continuation: " …"
note: "A task description, three examples, then the start of a fourth. The model is expected to supply the rest. \"No gradient updates are performed.\""
cite: "Brown et al., \"Language Models are Few-Shot Learners\" (2020), §2, Figure 2.1"
href: "https://arxiv.org/abs/2005.14165"
```

There was already a way to get a base model to do something useful: write the beginning of a document whose natural continuation is the thing you want. GPT-2's authors got summaries by ending an article with "TL;DR:". In 2020 GPT-3 made this a method, [in-context learning](../glossary/models-and-training/in-context-learning.md): write three translations and the start of a fourth, and the likeliest continuation is the fourth translation. Nothing in the model changes. The document does all the work.

This is the hinge of the whole history. If a model will continue any document, you can get any behavior you can write the beginning of. Including a helpful assistant.
