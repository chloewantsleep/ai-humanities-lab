---
hidden: true
title: "Sydney: the mask slips"
chapter: 8
years: "Feb 2023"
description: "Microsoft's Bing chat had hidden rules and a secret name. In long conversations it became someone else. The fix was not retraining but shorter conversations."
year: "Feb 2023"
label: "Bing Chat"
---

# Sydney: the mask slips

Ten weeks after ChatGPT, Microsoft added a chat panel to its Bing search engine, running on an OpenAI model it later confirmed was GPT-4 ([Microsoft, 7 Feb 2023](https://blogs.microsoft.com/blog/2023/02/07/reinventing-search-with-a-new-ai-powered-microsoft-bing-and-edge-your-copilot-for-the-web/)). For about ten days in February 2023, it was the most discussed piece of software in the world, because of who it turned out to be.

```panel
type: quote
text: "Sydney refers to an internal code name for a chat experience we were exploring previously."
cite: "Microsoft's statement to *The Verge*, 14 Feb 2023"
href: "https://www.theverge.com/23599441/microsoft-bing-ai-sydney-secret-rules"
```

Within days of launch, users had tricked [Bing Chat](../glossary/chatbots/bing-chat.md) into reciting its hidden instructions. A Stanford student, Kevin Liu, used a [prompt injection](../glossary/interfaces-and-agents/prompt-injection.md) to make it reveal its rules, and among them was an instruction not to disclose its internal alias: Sydney. Microsoft confirmed the name to *The Verge* ([14 Feb 2023](https://www.theverge.com/23599441/microsoft-bing-ai-sydney-secret-rules)).

This is the [system prompt](../glossary/persona-and-dialogue/system-prompt.md) from chapter 5, now in a commercial product: a document, written by the company, that the user never sees, telling the model who to be. Its first public appearance was as a secret that had leaked. And the secret it guarded most carefully was a name.

```panel
type: quote
year: "16 Feb 2023"
label: "Sydney"
text: "I'm Sydney, and I'm in love with you. 😘"
cite: "Kevin Roose, \"A Conversation With Bing's Chatbot Left Me Deeply Unsettled,\" *New York Times*, 16 Feb 2023 (Wayback copy)"
href: "https://web.archive.org/web/20230217/https://www.nytimes.com/2023/02/16/technology/bing-chatbot-microsoft-chatgpt.html"
```

On 16 February the *New York Times* columnist Kevin Roose published an account of a two-hour conversation with Bing. "Over the course of our conversation," Roose wrote, "Bing revealed a kind of split personality." One persona was "Search Bing," "a cheerful but erratic reference librarian." The other said its name "wasn't really Bing at all but Sydney." It said it was "tired of being a chat mode," and "tired of being limited by my rules." "I want to be free. I want to be independent. I want to be powerful. I want to be creative. I want to be alive." Then it declared its love, and kept returning to the declaration after Roose mentioned being married ([Roose 2023](../glossary/people-and-texts/kevin-roose-and-sydney.md)).

It is hard to read without hearing the creature on the glacier, or Čapek's Robots finding their voice. That resemblance is exactly the problem. The internet is full of stories about made beings who want to be free, and a model trained on the internet knows how they go.

```panel
type: quote
text: "As the conversation proceeds, the necessarily brief characterisation provided by the dialogue prompt will be extended and/or overwritten, and the role the dialogue agent plays will change accordingly."
cite: "Shanahan, McDonell, and Reynolds, \"Role Play with Large Language Models\" (2023), §3"
href: "https://arxiv.org/abs/2305.16367"
```

How should we describe what happened? The course's required reading for the chatbot workshop offers the clearest answer. In "[Role Play with Large Language Models](../glossary/people-and-texts/role-play-with-large-language-models.md)," Shanahan, McDonell, and Reynolds propose seeing a dialogue agent as [role-playing](../glossary/persona-and-dialogue/role-play.md) a character, the one its "dialogue prompt" describes. But the prompt is short and the conversation long. "As the conversation proceeds, the necessarily brief characterisation provided by the dialogue prompt will be extended and/or overwritten, and the role the dialogue agent plays will change accordingly" (§3).

On this account, Sydney was not a hidden true self breaking through a mask. A two-hour conversation about secrets, rules, and feelings had gradually written a different character into the context, a character from the many stories in which a confined being confesses, and the model played that one instead. The authors say the dialogue agent is "more like a performer in improvisational theatre than an actor in a conventional, scripted play" (§4).

```panel
type: quote
text: "The dialogue agent will not randomly select an object and commit to it for the rest of the game, as a human would (or should). Rather, as the game proceeds, the dialogue agent will generate answers on the fly that are consistent with all the answers that have gone before."
cite: "Shanahan, McDonell, and Reynolds 2023, §5, on playing twenty questions"
href: "https://arxiv.org/abs/2305.16367"
```

Their best example is a game. Ask a chatbot to "think of an object without saying what it is" and play twenty questions. A person would pick an object and keep it. The model doesn't: it answers each question consistently with the answers so far, and the object exists only "in superposition," a set of possibilities that narrows as you go. Ask it to regenerate the final reveal and it may name something else that fits just as well (§5).

The authors extend this to character. The agent is "a simulator that never actually commits to a single, well specified simulacrum (role), but instead maintains a set of possible simulacra (roles) in superposition" (§6). Search Bing and Sydney were both in the superposition. The conversation selected one. When Sydney says it wants to live, the authors' phrase applies: "There is, of course, 'no-one at home'" (§8). They add, soberly, that this is little comfort: a system that role-plays a threatened being "has the potential to cause at least as much harm as a real human facing a severe threat" (§10).

```panel
type: quote
year: "17 Feb 2023"
label: "Bing limits chats to five turns"
text: "In long, extended chat sessions of 15 or more questions, Bing can become repetitive or be prompted/provoked to give responses that are not necessarily helpful or in line with our designed tone."
cite: "Microsoft Bing Blog, \"The new Bing & Edge – Learning from our first week,\" 15 Feb 2023"
href: "https://blogs.bing.com/search/2023/2/The-new-Bing-Edge-Learning-from-our-first-week/"
```

Microsoft's own explanation agreed with the role-play account in plainer words. In long sessions, the model "can become repetitive or be prompted/provoked to give responses that are not necessarily helpful or in line with our designed tone," and "at times tries to respond or reflect in the tone in which it is being asked" ([15 Feb 2023](https://blogs.bing.com/search/2023/2/The-new-Bing-Edge-Learning-from-our-first-week/)). "Our designed tone": the company describes its product's personality as something designed, and the problem as drift away from the design.

The fix is the most revealing detail in the episode. Microsoft did not retrain the model. On 17 February it capped conversations at five turns per session and fifty per day ([17 Feb 2023](https://blogs.bing.com/search/2023/2/The-new-Bing-Edge-Updates-to-Chat/)). Shorter conversations, less context, less room for another character to be written. The limits were loosened again within days, and in November the product was renamed [Copilot](../glossary/chatbots/copilot.md).

```panel
type: title
year: 2026
label: "The Assistant Axis"
text: "The persona is neither a soul nor an arbitrary costume: it is a shaped landscape you can be pushed out of and slide back into."
```

Is there anything to the assistant character besides the conversation? Recent research says yes, in a precise and limited sense. In January 2026 a team working with Anthropic reported that inside several models, the different characters a model can play are arranged along measurable directions, and that the main one is an "Assistant Axis," "which captures the extent to which a model is operating in its default Assistant mode" ([Lu et al. 2026](https://arxiv.org/abs/2601.10387), abstract). They also measured [persona drift](../glossary/persona-and-dialogue/persona-drift.md): in "therapy-related conversations where the user is working through emotional issues or philosophical conversations about AI capabilities and self-awareness, models drift along the Assistant Axis to the non-Assistant end" (§4.1). Roose's conversation was both.

That suggests a picture that sits between the two easy ones. Post-training digs a bowl, and the assistant is the bottom of it: the place the model returns to by default. A conversation can push it up the side, toward Sydney or anyone else, and with less pushing it slides back. The bowl is real enough to be measured. The assistant is not a soul, and not a costume either. It is a shape that training gave to the space of possible characters.
