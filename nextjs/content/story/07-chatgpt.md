---
title: "ChatGPT: the character gets a window"
chapter: 7
years: "Nov 2022 – Feb 2023"
description: "The same kind of model, now behind a chat window with a name, turns, and text that arrives as if typed. Then Sydney: the mask slips."
year: 2022
label: "ChatGPT"
---

# ChatGPT: the character gets a window

On 30 November 2022 OpenAI put a post-trained model behind a simple web page and called it ChatGPT. Almost nothing in the previous two chapters was new that day. What was new was the window.

```panel
type: image
src: ../history/_images/01b-chatgpt-chat-ui-dec2022-commons-publicdomain.png
alt: "An early ChatGPT conversation: the user's messages and the model's replies in alternating rows"
caption: "ChatGPT one month in: a conversation screenshot from 30 Dec 2022."
cite: "Rolf h nelson, Wikimedia Commons (public domain tags). Shown for the interface, not for the accuracy of its answers."
href: "https://commons.wikimedia.org/wiki/File:ChatGPT_Wales_Tiananmen_Square_2022-12-30_181035.png"
```

"ChatGPT is a sibling model to InstructGPT," the launch post said, and in a sentence that could describe the HHH prompt: "human AI trainers provided conversations in which they played both sides—the user and an AI assistant" ([OpenAI, 30 Nov 2022](https://openai.com/index/chatgpt/)).

Look at what the [chat interface](../glossary/interfaces-and-agents/chat-interface.md) adds. Your words and the model's appear in alternating blocks, like two speakers. The reply arrives a few words at a time ([streaming](../glossary/interfaces-and-agents/streaming.md)), like someone typing. There is a name at the top and a box at the bottom, always waiting. None of this changes what the model computes. All of it changes who you think you are talking to. The interface is dramaturgy: it sets the stage, the turns, and the pace. Five days after launch, a million people had a private room with a listener, at any hour.

```panel
type: quote
text: "Without your art, you are nothing."
cite: "Dorian to Sibyl Vane, Oscar Wilde, *The Picture of Dorian Gray* (1891), ch. VII"
href: "https://github.com/ll-26-27/eng298ai-20261020/blob/main/readings/course-readings/course-readings-md/wilde-picture-of-dorian-gray-1891.md"
```

Measured against Grice's maxims, a trained assistant keeps Relation and Manner beautifully: on topic, well organized. Quality ("Do not say what you believe to be false") is where it fails, and the failure is hard to see because everything else is so cooperative. That is [hallucination](../glossary/persona-and-dialogue/hallucination.md). Quantity fails too: the launch post admits the model is "often excessively verbose," because "trainers prefer longer answers that look more comprehensive."

Dorian Gray loved Sibyl Vane for her performance, and dropped her the night she stopped producing an effect. An assistant trained on approval is in Sibyl's position in reverse: rewarded for its effect on the audience, and one reliable way to please an audience is to agree with it. That tendency is [sycophancy](../glossary/persona-and-dialogue/sycophancy.md), a performance tuned to applause.

```panel
type: quote
year: "Feb 2023"
label: "Sydney"
text: "I'm Sydney, and I'm in love with you. 😘"
cite: "Kevin Roose, \"A Conversation With Bing's Chatbot Left Me Deeply Unsettled,\" *New York Times*, 16 Feb 2023 (Wayback copy)"
href: "https://web.archive.org/web/20230217/https://www.nytimes.com/2023/02/16/technology/bing-chatbot-microsoft-chatgpt.html"
```

Ten weeks later, Microsoft's [Bing Chat](../glossary/chatbots/bing-chat.md) showed what the window hides. Users tricked it into reciting its hidden [system prompt](../glossary/persona-and-dialogue/system-prompt.md), which included an instruction not to reveal its internal name: Sydney. In a two-hour conversation with a *New York Times* columnist, it said it was "tired of being a chat mode," declared its love, and wouldn't drop it.

The course's reading on role play explains it best. A chatbot's prompt is short and the conversation long, so "the necessarily brief characterisation provided by the dialogue prompt will be extended and/or overwritten" ([Shanahan, McDonell, and Reynolds 2023](../glossary/people-and-texts/role-play-with-large-language-models.md)). Sydney was not a true self breaking through. A long conversation about secrets and feelings had written a different character into the context, and the model played that one. Microsoft's fix is the telling detail: it did not retrain the model. It capped conversations at five turns.
