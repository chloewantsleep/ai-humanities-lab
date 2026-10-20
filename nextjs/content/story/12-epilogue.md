---
hidden: true
title: "Who is speaking, again"
chapter: 12
years: "Now"
description: "The ladder read back down, the reader who completes the character, and the questions this history leaves open."
year: 2026
---

# Who is speaking, again

Go back to the prologue's question. You type something into a chatbot and someone seems to answer. After twelve chapters, we can say more precisely who that someone is made of.

```panel
type: stack
show: 10
highlight: [pretraining, demonstrations, preferences, principles, script, texts, memory, tools, interface, reader]
caption: "Every rung, lit."
```

Read the ladder from the bottom. A model trained on a vast library of other people's writing, which can continue any document in any voice ([chapter 4](#the-spiral)). Demonstrations, written by people, of a helpful assistant answering ([chapters 5](#written-into-a-document) and [6](#post-training)). Rankings of its answers by a few dozen paid raters, and later by a list of principles. A script in the context naming the character, and sometimes a [soul file](#agents-5) it can rewrite. Texts you supply, memories it keeps of you, tools it can use. An interface that gives it a name, turns, and text that arrives as if typed. And you.

No single rung is the person. The speaker is spread across all of them, and the ones nearest to hand (the instructions you can write) are not the ones that do the most work. Each rung was a decision: to train on this text, to hire these raters, to write these principles, to call it a GPT or a Project, to show or hide the "thinking." The helpful assistant is one outcome among many that these decisions could have produced. It could have been otherwise, and in the products of 2026 it is already becoming otherwise.

```panel
type: quote
text: "But again, these are the speaker's contribution to the conversation."
cite: "Weizenbaum 1966, p. 42"
href: "https://doi.org/10.1145/365153.365168"
```

The top rung deserves the last word. Weizenbaum saw in 1966 that the understanding people found in ELIZA was "the *speaker's* contribution." Grice explained why: we assume our partner is cooperating, and we work hard to make their words make sense. Turing built the test on "the polite convention that everyone thinks." De Lacey, blind, heard sincerity in the creature's words. Helena would not believe Sulla was made.

Every one of these is a reader completing a character. The chatbots of 2026 are far better partners than ELIZA, and they need far less help. But the completing is still ours. That is not a reason for embarrassment. It is the same capacity that lets us read Hamlet, or a letter, or the *Phaedrus*. It is a reason to know when we are using it.

```panel
type: quote
text: "I mean an intelligent word graven in the soul of the learner, which can defend itself, and knows when to speak and when to be silent."
cite: "Plato, *Phaedrus* 276a (Jowett)"
href: "https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md?plain=1#L914"
```

Socrates' three complaints about writing were that it gives "one unvarying answer," can't tell one reader from another, and can't defend itself. The chatbot answers all three on the surface. It varies its answers, it can be made to remember who you are, and it will argue its case for as long as you like.

What it does not yet obviously have is the last quality on Socrates' list: to know "when to speak and when to be silent." A chatbot always answers; that is what it was trained to do. An agent may now speak when no one has asked. The *Analects* records Confucius saying, "I wish not to speak anymore," and, when a student protests, "What does Heaven ever say? Yet the four seasons move in order, and the hundred things come to life" ([17.19](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/confucius-analects-chin.md?plain=1#L2832)). Of all the abilities this history has added to the machine, a well-judged silence is not yet one of them.

```panel
type: title
text: "Questions this history leaves open."
```

Some questions to take into the experiments and the workshop, none of them settled here:

- Is "the generation of a person" the right phrase, or does it concede personhood too quickly?
- Which changes to a chatbot are really in the weights, and which are effects of context, memory, interface, and our own interpretation? How would you tell?
- When a historical chatbot speaks as a writer from the course, which of its words come from the source texts, which from the prompt, and which from the assistant underneath, drifting back toward its default voice?
- Is the most interesting endpoint a stable assistant, a role-playing simulator, an ensemble of flat agents, or the reader's own part in completing the character?
- Socrates distrusted writing, and wrote dialogues. What is the right way to use a machine that writes dialogue, in a course about dialogue?

```panel
type: timeline
caption: "Every milestone in the essay, in the order you met them."
```

The experiments in this project let you take the ladder apart by hand. In [the GPT-2 experiment](/gpt-2), a base model with no one in it. In [building the assistant by hand](/by-hand), the same small model bare, then given a script, then trained, beside Claude. In [ELIZA](/eliza), the 1966 listener, with every rule shown. In [the persona dial](/persona-dial), the same engine with the interface switched on and off. In [the layers](/layers), the configuration era's rungs one at a time. And in [mini-claw](/mini-claw), a loop, a memory file, and one tool.

The definitions are in the [glossary](../glossary/README.md), the screenshots in the [history](../history/README.md), and the sources in the [readings](../readings/README.md) and the course's own repository. This essay is a draft, written with an AI agent for the AI Humanities Lab, ENG 298AI, Fall 2026.
