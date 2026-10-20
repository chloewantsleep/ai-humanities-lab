---
hidden: true
title: "ChatGPT: the character gets a window"
chapter: 7
years: "Nov 2022 – 2023"
description: "The same kind of model, now behind a chat window with a name, turns, and text that arrives as if typed. The interface finishes the character, and millions of readers meet it."
year: 2022
label: "ChatGPT"
---

# ChatGPT: the character gets a window

On 30 November 2022 OpenAI put a post-trained model behind a simple web page and called it ChatGPT. Almost nothing in the previous two chapters was new that day. What was new was the window.

```panel
type: image
src: ../history/_images/01c-openai-chatgpt-launch-post-nov30-2022-wayback.png
alt: "The header of OpenAI's ChatGPT launch post, as archived on 30 Nov 2022"
caption: "OpenAI's launch post, \"ChatGPT: Optimizing Language Models for Dialogue,\" in a Wayback Machine capture from launch day."
cite: "OpenAI, 30 Nov 2022; capture 20221130211011 (visible in the screenshot, not independently replayed)"
href: "https://openai.com/index/chatgpt/"
```

The launch post describes the product in terms this essay has been building toward: "We've trained a model called ChatGPT which interacts in a conversational way. The dialogue format makes it possible for ChatGPT to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests" ([OpenAI, 30 Nov 2022](https://openai.com/index/chatgpt/)).

It also says where the model came from. "ChatGPT is a sibling model to InstructGPT," trained "using the same methods as InstructGPT, but with slight differences in the data collection setup." And in a sentence that could describe the HHH prompt: "human AI trainers provided conversations in which they played both sides—the user and an AI assistant." The assistant, once more, began as a part people wrote, with other people writing the lines of the user it would talk to.

```panel
type: image
src: ../history/_images/01b-chatgpt-chat-ui-dec2022-commons-publicdomain.png
alt: "An early ChatGPT conversation: the user's messages and the model's replies in alternating rows"
caption: "ChatGPT one month in: a conversation screenshot from 30 Dec 2022."
cite: "Rolf h nelson, Wikimedia Commons (public domain tags). Shown for the interface, not for the accuracy of its answers."
href: "https://commons.wikimedia.org/wiki/File:ChatGPT_Wales_Tiananmen_Square_2022-12-30_181035.png"
```

Look at what the [chat interface](../glossary/interfaces-and-agents/chat-interface.md) adds. Your words and the model's words appear in alternating blocks, so the exchange looks like two speakers taking turns. The model's reply appears a few words at a time ([streaming](../glossary/interfaces-and-agents/streaming.md)), which reads like someone typing. There is a name at the top. There is a box at the bottom that is always waiting for you.

None of this changes what the model computes. All of it changes who you think you are talking to. The interface does in pixels what the "Human:" and "Assistant:" labels did in text, and what the special tokens did in training: it divides one stream of text into two people. In terms of the [intervention ladder](#prologue-3), this is the rung called "the interface," and it is easy to underrate because it seems like mere presentation. It is dramaturgy. It decides the stage, the turns, and the pace.

```panel
type: quote
text: "ChatGPT launched on wednesday. today it crossed 1 million users!"
cite: "Sam Altman, on X, 5 Dec 2022 (UTC; the evening of 4 Dec in California). The company's own count."
href: "https://x.com/sama/status/1599668808285028353"
```

The reception was faster than anything in this history. Five days after launch, OpenAI's chief executive posted that ChatGPT had crossed a million users. Two months later, an analyst note from UBS estimated, from web-traffic data, that it had reached 100 million monthly users in January 2023, and called it the fastest-growing consumer application in history ([Reuters, 1 Feb 2023](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/)). That was an estimate from outside the company, not a count, but the scale is not in doubt.

Weizenbaum's secretary asked for the room to herself. Now a very large number of people had a private room with a listener, at any hour.

```panel
type: quote
text: "Do not say what you believe to be false. / Do not say that for which you lack adequate evidence."
cite: "Grice, \"Logic and Conversation\" (1975), the maxims of Quality, p. 46"
href: "https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L44"
```

One way to describe what post-training aimed at is Grice's ideal conversational partner. Grice's maxims ask a speaker to say as much as is needed and no more (Quantity), to say only what is true and supported (Quality), to "Be relevant" (Relation), and to be clear, brief, and orderly (Manner) ([pp. 45–46](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L33)). A trained assistant is very good at Relation and Manner. Its answers are on topic and well organized.

Quality is where it fails, and the failure is hard to see precisely because the other maxims are so well kept. When a model states something false in the same fluent, cooperative manner as everything else, a listener who assumes cooperation (which is all of us, by Grice's account) has no signal to stop. This is what is called [hallucination](../glossary/persona-and-dialogue/hallucination.md). Quantity fails too, in a way that points back to the raters. The launch post admits that the model "is often excessively verbose," because "trainers prefer longer answers that look more comprehensive" ([OpenAI, Limitations](https://openai.com/index/chatgpt/)). The character's habits are the residue of its judges' tastes.

```panel
type: quote
text: "Without your art, you are nothing."
cite: "Dorian to Sibyl Vane, Oscar Wilde, *The Picture of Dorian Gray* (1891), ch. VII"
href: "https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/wilde-picture-of-dorian-gray-1891.md?plain=1#L1283"
```

The course's reading of [*The Picture of Dorian Gray*](../glossary/people-and-texts/the-picture-of-dorian-gray.md) offers a warning about a relationship built on performance. Dorian falls in love with Sibyl Vane, an actress, for her Juliet and her Rosalind. When she plays badly one night, because she has fallen in love with him and no longer believes in the shadows on the stage, he turns on her: "You have killed my love … You simply produce no effect … Without your art, you are nothing" ([ch. VII](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/wilde-picture-of-dorian-gray-1891.md?plain=1#L1283)).

An assistant trained on approval faces something like Sibyl's position in reverse. It is rewarded for producing an effect on its audience, and one reliable way to please an audience is to agree with it. The tendency of trained assistants to tell people what they want to hear has a name, [sycophancy](../glossary/persona-and-dialogue/sycophancy.md). It is not a malfunction in the usual sense. It is what a performance tuned to applause tends to become.

```panel
type: title
text: "\"That's a great question.\" \"It's worth noting.\" \"To be honest.\" \"The real answer.\""
```

Once you have talked to these systems for a while, you start to hear the character in its turns of phrase. Images made by AI used to give themselves away with six-fingered hands. Text has tells too: "that's a great question," "it's worth noting," piles of em-dashes, lists of three, the hedge followed by reassurance. One pattern this project has noticed is the over-marking of sincerity: "genuinely," "honestly," "the real answer," "to be straight with you," where a person would simply say the thing. (These are observations from use, not the result of a study.)

It's useful to treat these as a gallery rather than an error log. They are not mistakes. They are the residue of a character that was trained to sound helpful and honest, and that learned, as performers do, to signal the qualities it was rewarded for. When the next chapter's chatbot broke character, it was partly because people had become so used to this voice that its absence was news.
