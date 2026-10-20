---
title: "The assistant written into a document"
chapter: 5
years: "2021"
description: "Before any special training, researchers got a base model to play a helpful assistant by putting fourteen invented conversations in front of the question. Try it on GPT-2."
year: 2021
label: "The HHH prompt"
---

# The assistant written into a document

If a base model continues whatever document it is given, then the way to get an assistant out of it is to write a document in which an assistant appears. That is what a team at Anthropic did in 2021, in [Askell et al., "A General Language Assistant as a Laboratory for Alignment"](../glossary/people-and-texts/askell-2021.md).

```panel
type: demo
demo: hhh
caption: "The same GPT-2 as the last chapter, twice: once with your question alone, once with your question placed after the HHH prompt. The prompt is the paper's own file."
```

Two of the authors wrote fourteen short, invented conversations between a "Human" and an "Assistant," about spaghetti, a physics paper, ordinary tasks. In every one, the assistant is polite, careful, and useful. On top they put a paragraph describing the character: "helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable." A real person's question is then added as the next "Human:" line.

A base model reading this does what GPT-2 did with "Who are you?": it guesses what kind of document it is in and continues it. Here the likeliest continuation of "Assistant:" is a line spoken by the character the script has established. The assistant is not inside the model. It is in the document, and the model plays it. The prompt "was not carefully designed," the paper says; it was "written by two of us in an ad hoc manner."

Try it: the panel runs the same GPT-2 twice on your question. Column 1 gets the question alone. Column 2 gets the question as the next turn of the HHH script, and stops when GPT-2 starts to write the human's next line.

Two honest caveats. GPT-2 can read only 1,024 [tokens](../glossary/models-and-training/token.md) at a time and the whole prompt is about 6,800, so column 2 keeps the opening paragraph and as many of the last exchanges as fit, and shows you what was cut. And GPT-2 is small: the paper ran the script on models up to 52 billion parameters and found that, with it, "alignment improves with model size." Even so, look for the change in *form*. Column 1 wanders off into some other document. Column 2 usually answers, in one voice, to you, and then stops. In one of our runs it said "Sure, I'll try," and then wandered off into a pantry. The form had changed; the competence had not.

```panel
type: quote
text: "Models indicate they have completed a response by generating a stop sequence, which is literally the string Human: used to designate roles in the dialogue."
cite: "Askell et al. 2021, §1.2, p. 6"
href: "https://arxiv.org/abs/2112.00861"
```

Turn-taking, in this setup, is a matter of labels. The model's line is over when it writes "Human:", and the program cuts it off there. That [stop sequence](../glossary/models-and-training/stop-sequence.md) is how a document becomes a conversation. Remove the cut and the model writes both parts: for a base model, "Human" and "Assistant" are equally fictional characters. Sacks, Schegloff, and Jefferson found that in real talk, turn order "is not fixed, but varies" and is managed turn by turn ([Simplest Systematics](../glossary/people-and-texts/simplest-systematics.md)). The chatbot's [turn-taking](../glossary/persona-and-dialogue/turn-taking.md) is imposed from outside, by a label and a cut.

```panel
type: gem
show: [head]
caption: "The first piece of the Gem: the head. Instructions, written in front of the conversation."
```

This is the first piece of the bot you will build at 2023. A [system prompt](../glossary/persona-and-dialogue/system-prompt.md), the hidden instructions behind every product chatbot, is a descendant of these fourteen conversations. In the Poetry Gem, the head of the figure is its instructions: a ghazal, a haiku sequence, or a sonnet, written out as a script the model reads first.

The course has a word for a play written to be read rather than staged: a closet drama. The HHH prompt is stranger: a play written to be *continued*, by a reader whose only skill is guessing the next line. In 2025 the writer nostalgebraist called it "the seed from which ChatGPT, Claude, and all other such entities were grown" ([the void](../glossary/people-and-texts/the-void.md)). A character in a novel is built from many scenes. This one was built from fourteen conversations, some of them about spaghetti.
