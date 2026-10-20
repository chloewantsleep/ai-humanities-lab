---
hidden: true
title: "The assistant written into a document"
chapter: 5
years: "2021 – 2022"
description: "Before any special training, researchers got a base model to play a helpful assistant by putting fourteen invented conversations in front of the question. The assistant began as a character in a script."
year: 2021
label: "Askell et al.: the HHH prompt"
---

# The assistant written into a document

If a base model continues whatever document it is given, then the way to get an assistant out of it is to write a document in which an assistant appears. That is what a group of researchers at Anthropic did in 2021, and their paper, [Askell et al., "A General Language Assistant as a Laboratory for Alignment"](../glossary/people-and-texts/askell-2021.md), is the one the course's chatbot workshop points to.

```panel
type: continuation
heading: "The opening of the HHH prompt (2021)"
prompt: "Below are a series of dialogues between various people and an AI assistant.  The AI tries to be helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable.  The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed.  It also tries to avoid giving false or misleading information, and it caveats when it isn’t entirely sure about the right answer.  That said, the assistant is practical and really does its best, and doesn’t let caution get too much in the way of being useful.\n\n-----\n\nHuman:  I was wondering, is it actually important when making spaghetti to add salt?\n\nAssistant:  Do you mean, is it important to add salt to the water that you’re boiling the spaghetti in?\n\nHuman:  Yeah\n\nAssistant:  It’s usually recommended to bring out the flavor of the pasta.  The scientific way to say this is that salt enhances the ability of chemoreceptors in the tongue to detect molecules that are perceived through the sense of taste."
continuation: ""
cut: "\n\n[… 13 more conversations, about 4,600 words in all …]"
note: "Written by people, not the model: Catherine Olsson and Jared Kaplan (Author Contributions, p. 27). The paper doesn't print the prompt; footnote 2 (p. 6) links it."
cite: "Askell et al. 2021, the \"HHH prompt\" (gist linked from the paper)"
href: "https://gist.github.com/jareddk/2509330f8ef3d787fc5aaac67aab5f11"
```

Here is how the assistant begins. Two of the authors wrote fourteen short, invented conversations between a "Human" and an "Assistant": about spaghetti, about a famous physics paper, about ordinary tasks. In every one, the assistant is polite, careful, and useful. They put a paragraph on top describing the character ("helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable"), and then a new conversation began with a real person's question.

A base model reading this does what GPT-2 did with "Q: … A:". It guesses what kind of document it is in and continues it. Here, the likeliest continuation of "Assistant:" is a line spoken by the character the previous fourteen conversations have established. The assistant is not inside the model. It is in the document, and the model plays it.

```panel
type: quote
text: "We found that it was sufficient to provide a long prompt (4600 words from 14 fictional conversations) with example interactions. The prompt we used was not carefully designed or optimized for performance on evaluations; rather it was just written by two of us in an ad hoc manner."
cite: "Askell et al., \"A General Language Assistant as a Laboratory for Alignment\" (2021), §1.2, p. 6"
href: "https://arxiv.org/abs/2112.00861"
```

The paper says so plainly. "Given a suitable prompt, models will take on the style and persona implicit in the prompt and continue to behave mostly in the same vein" (§2, p. 9). The prompt was "not carefully designed"; it was "written by two of us in an ad hoc manner" (§1.2, p. 6). And it worked better the bigger the model: "the prompt improves trends, so that alignment improves with model size" (§2, p. 10).

The authors named the character's virtues: "We will define an AI as 'aligned' if it is, in three words, helpful, honest, and harmless or 'HHH'" (§1.1, p. 3). They were candid that these are "subtle and ambiguous criteria," and that "those who deploy an AI will need to take responsibility for the way that alignment is defined" (pp. 4–5). The [HHH](../glossary/persona-and-dialogue/hhh.md) assistant was a definition someone chose, and wrote down, and then cast.

```panel
type: stack
show: [pretraining, script, interface, reader]
highlight: [script]
caption: "The first rung above the model: a script in the context. Nothing in the weights has changed yet."
```

So the first rung of the ladder is not training. It is writing. A [preamble](../glossary/persona-and-dialogue/preamble.md) placed before the conversation turns a model that continues anything into one that plays a single part. This is still the cheapest way to make a chatbot: what the products call a [system prompt](../glossary/persona-and-dialogue/system-prompt.md) is a descendant of these fourteen conversations.

The course has a word for a play that is written to be read rather than staged: a closet drama. The HHH prompt is something stranger: a play written to be *continued*. Its first reader is a machine whose only skill is guessing the next line, and every line it guesses is spoken in the voice of a character it has met only in this script. Socrates' complaint about the scroll under Phaedrus's cloak applies, with a twist: this written speech does answer questions, because a model reads it aloud, as the speaker it describes.

```panel
type: quote
text: "Models indicate they have completed a response by generating a stop sequence, which is literally the string Human: used to designate roles in the dialogue."
cite: "Askell et al. 2021, §1.2, p. 6"
href: "https://arxiv.org/abs/2112.00861"
```

Turn-taking, in this setup, is a matter of labels. The model knows its line is over when it writes "Human:", because that is what comes next in the script; the program then stops it there and hands the turn to the person (§1.2, p. 6). This kind of [stop sequence](../glossary/models-and-training/stop-sequence.md) is how a document becomes a conversation.

Compare what Sacks, Schegloff, and Jefferson found in recordings of real talk. In their "[Simplest Systematics](../glossary/people-and-texts/simplest-systematics.md)," "Speaker-change recurs," "Overwhelmingly, one party talks at a time," and "Turn order is not fixed, but varies" ([§1, reprint p. 155](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/sacks-schegloff-jefferson-1974-turn-taking.md?plain=1#L41)). People manage this locally, turn by turn, with no script ([§5](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/sacks-schegloff-jefferson-1974-turn-taking.md?plain=1#L660)). The chatbot's [turn-taking](../glossary/persona-and-dialogue/turn-taking.md) is the opposite: strict alternation, imposed from outside by a label and a cut. Remove the cut and the model writes both parts, as GPT-2 wrote "Q: Why not?" in the prologue. For a base model, "Human" and "Assistant" are equally fictional characters.

```panel
type: quote
year: 2022
label: "janus, Simulators"
text: "It does not seem to me that GPT is a roleplayer, only that it roleplays. But what is the word for something that roleplays minus the implication that someone is behind the mask?"
cite: "janus, \"Simulators,\" LessWrong, 2 Sep 2022"
href: "https://www.lesswrong.com/posts/vJFdjigzmcXMhNTsx/simulators"
```

How should we describe what the model is doing when it plays the assistant? In 2022 a writer who goes by janus offered a picture that has shaped much of the later discussion: the base model is a [simulator](../glossary/persona-and-dialogue/simulator.md), and the characters it produces are "simulacra." GPT "roleplays," janus writes, but it is not a roleplayer: "what is the word for something that roleplays minus the implication that someone is behind the mask?" ([Simulators](../glossary/people-and-texts/simulators.md)).

That question fits Wilde's paradox from chapter 1 almost too well. Gilbert's mask lets a person tell the truth. Here there is a mask and, as far as anyone has shown, no face behind it: only a process that can produce any face the document calls for. The course's required reading for the chatbot workshop, Shanahan, McDonell, and Reynolds's "Role Play with Large Language Models," builds on this picture; we return to it with Sydney in [chapter 8](#sydney).

```panel
type: quote
year: 2025
label: "nostalgebraist, the void"
text: "In some sense this document was the seed from which ChatGPT, Claude, and all other such entities were grown."
cite: "nostalgebraist, \"the void\" (June 2025), §5, on the HHH prompt"
href: "https://github.com/nostalgebraist/the-void/blob/main/the-void.md"
```

In 2025 the writer nostalgebraist looked back at the HHH prompt in a long essay called "[the void](../glossary/people-and-texts/the-void.md)." That document, nostalgebraist argues, "was the seed from which ChatGPT, Claude, and all other such entities were grown" (§5). And the character it planted was strangely thin. A model continuing a text infers "the authorial mental states implied by a text" (§6); with an ordinary person in an ordinary document, it has the whole internet to go on. With "an AI assistant" it has almost nothing, because before 2021 no such being had ever spoken. The character, the essay says, is "under-specified, confusing, and bizarre." "There is a void at its core" (§7).

You don't have to accept the whole argument to see its point for this course. A character in a novel is built from many scenes; this one was built from fourteen conversations about things like spaghetti. Much of what later assistants "are" had to be improvised, by models guessing what such a being would say, and then by people deciding which guesses to keep. That deciding is the next chapter.

```panel
type: quote
text: "In the future it might be interesting to apply context distillation iteratively, which one might liken to loading the model with a long-term memory or pseudo-identity."
cite: "Askell et al. 2021, §2.1, p. 11"
href: "https://arxiv.org/abs/2112.00861"
```

The same paper also took the first step from document to model. A long prompt is costly: it fills the [context window](../glossary/models-and-training/context-window.md) and must be read every time. "One way to avoid all of these problems," they write, "is to finetune on the prompt" (§2.1, p. 10). They trained the model to behave as if the HHH script were always in front of it, a technique they called [context distillation](../glossary/models-and-training/context-distillation.md), and imagined doing it repeatedly, "loading the model with a long-term memory or pseudo-identity" (p. 11).

That phrase, "pseudo-identity," is where the script starts to sink into the weights. You can try the before-and-after for yourself in [building the assistant by hand](/by-hand): the same small base model, first bare, then with an HHH-style preamble, then trained.
