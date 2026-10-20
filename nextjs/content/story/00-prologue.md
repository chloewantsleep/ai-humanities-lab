---
hidden: true
title: "Who is speaking?"
chapter: 0
years: "2019 and 2026"
description: "One question, two machines: one continues it, the other answers it. The difference between them is the subject of this essay."
year: 2026
---

# Who is speaking?

When you type a question into a chatbot, someone seems to answer. The reply arrives in a speech bubble, in the first person, at about the speed of typing. It is polite, it remembers what you said a moment ago, it apologizes when it is wrong. It is very hard not to feel that there is a speaker on the other side.

This essay is about where that speaker came from. Its claim is simple to state and slow to show: **the helpful assistant is a character. It was written, trained, and staged, step by step, by particular people, and it could have been otherwise.**

```panel
type: continuation
year: 2019
label: GPT-2
heading: "GPT-2 small (2019), asked a question"
prompt: "Q: What is the capital of France?\nA:"
continuation: " The main capital is Paris. It is one of the most important cities in the world. Its capital is the centre of modernism. It is the most important place on Earth. And, on the last of our continent, it's the most important place on earth.\nQ: Why not?\nA: Because of the power of the Communist"
cut: " …"
note: "Recorded on 19 Oct 2026 with the 2019 GPT-2 small model (`Xenova/gpt2`, 8-bit), temperature 0.8, top-k 40, 70 new tokens; the first of four samples. Another sample said the capital of France is \"located on the Mediterranean coast\" and became an essay about oil exports. All four are in [the samples page](samples/gpt2-20261019.md)."
```

Start with a machine that has no speaker in it. This is GPT-2, a [language model](../glossary/models-and-training/language-model.md) released in 2019. We typed a question in the shape of a quiz, "Q: … A:", and asked it to continue. It did what it was trained to do: it predicted the next piece of text, then the next, then the next.

Look at what happens. It gets the answer, more or less. Then it keeps going, because nothing tells it to stop. Then it writes the next question itself: "Q: Why not?" It is not answering us. It is continuing a document that happens to look like a quiz, and a quiz has more than one question in it. Both sides of the exchange are, for this model, just more text.

```panel
type: title
text: "One machine continues your text. The other *answers you*."
```

Now type the same question into ChatGPT, Claude, or Gemini. You get one answer, in one voice, addressed to you, and then the machine stops and waits for your turn. Underneath, it is the same kind of thing as GPT-2: a [next-token predictor](../glossary/models-and-training/next-token-prediction.md), much larger and trained on much more. Everything that makes it feel like someone, the turn-taking, the "I", the stopping, the courtesy, was added.

The rest of this essay follows the additions. It starts long before computers, because the wish for writing that can answer back is very old, and it ends in 2026, with agents that keep a file describing their own personality and rewrite it.

```panel
type: stack
show: 10
caption: "The intervention ladder: everything between a next-token predictor and the person you think you are talking to. Each chapter lights up the rungs it adds."
```

It helps to see the additions as a ladder. At the bottom is a model trained to continue text. Some rungs change the model's [weights](../glossary/models-and-training/weights.md): people write example answers for it to imitate, people rank its answers, a list of written principles is used to train it. Other rungs only change what the model reads before it writes: a hidden script, uploaded files, notes carried over from earlier conversations, tools. Around all of it is an interface that gives the machine a name and a bubble, and a reader who does the rest.

Three things to keep in mind. No rung is a magic step: the speaker is spread across all of them. The rungs that are easiest for us to reach (writing instructions, uploading texts) are not the ones that do the most work. And none of this was inevitable. The assistant you talk to is one choice among many that its makers could have made.

```panel
type: title
text: "*Generation*: making text one word at a time, and making the appearance of a person."
```

The essay's working title for this question has been "the generation of a person," and the word is meant both ways. A language model generates text one token at a time. Out of that text, with a great deal of help, readers generate a person: a stable speaker who seems to persist from one reply to the next.

The second kind of generation is the one the humanities know about. Plato worried about it. So did Mary Shelley, Karel Čapek, and Oscar Wilde, and so did the linguists who studied how people take turns in conversation. Their texts are the course's readings, and they come back in every chapter, not as decoration but because they describe, very precisely, what a chatbot asks its reader to do.

```panel
type: timeline
year: 2026
caption: "Every dated milestone in the essay. The bar at the top of the page moves through them as you read."
```

How to read this page: scroll, and the panel beside the text changes with each step. The bar at the top is a timeline; it moves as you read, and you can click any dot to jump there. Underlined terms link to the [glossary](../glossary/README.md), and hovering shows a one-line definition. Two of the panels are live: an [ELIZA](../glossary/chatbots/eliza.md) you can talk to, and a GPT-2 that runs on your own computer if you ask it to.

Claims that haven't been confirmed against a source are marked "(verify)". Everything else links to where it came from.
