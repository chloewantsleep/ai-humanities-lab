---
term: "Poe"
slug: poe
short: "Quora's app for chatting with many AI bots from different companies in one place, launched invite-only on iOS in December 2022; from April 2023 users could make their own bots from a prompt."
aliases: [Platform for Open Exploration, poe.com]
category: chatbots
year: 2022
maker: "Quora"
status: active
screenshot: 41-poe-explore-bots-2026.png
see_also: [chatgpt, claude-ai, custom-gpts, system-prompt, chat-interface]
readings: []
experiments: [layers]
updated: 2026-10-19
---

# Poe

**Quora's app for chatting with many AI bots from different companies in one place, launched invite-only on iOS in December 2022; from April 2023 users could make their own bots from a prompt.**

![Poe's Explore page in October 2026, listing official bots from OpenAI, Anthropic, Google, and xAI side by side](../../history/_images/41-poe-explore-bots-2026.png)

## In plain terms

Poe ("Platform for Open Exploration") treats language models as contacts in a messaging app. At its public opening in February 2023 it offered three bots: Sage and Dragonfly, built on OpenAI models, and Claude, built on Anthropic's. Quora's CEO Adam D'Angelo framed the bet in his launch post: models would multiply, and "most people and even most companies who are capable of training or fine tuning these models are not well suited to create these interfaces." Poe would be the interface.

In April 2023 Poe added user-created bots: anyone could write "a short text prompt" on top of an existing bot (ChatGPT or Claude) and get a new bot with its own URL. That is the "Course TF Assistant" idea, seven months before OpenAI's custom GPTs: the same model underneath, a different set of instructions on top, published under a new name.

## Where it fits

**Platform and configuration.** Poe separated the chatbot from the model. The persona a user meets is a name, an avatar, and a prompt; the model behind it can be swapped. Its prompt bots are an early public version of the configuration layer that [custom GPTs](custom-gpts.md), Gems, and projects later built into each company's own app.

## Try it

The configuration layer in [the layers](/layers) (a system prompt, attached files, one tool on a fixed engine) is the move Poe's prompt bots made public.

## See also

[ChatGPT](chatgpt.md) · [Claude](claude-ai.md) · [Custom GPTs](custom-gpts.md) · [System prompt](../persona-and-dialogue/system-prompt.md) · [Chat interface](../interfaces-and-agents/chat-interface.md)

## Sources

- Kyle Wiggers, ["Quora launches Poe, a way to talk to AI chatbots like ChatGPT"](https://techcrunch.com/2022/12/21/quora-launches-poe-a-way-to-talk-to-ai-chatbots-like-chatgpt/), TechCrunch, 21 December 2022: the December launch, invite-only and iOS-only, the name "Platform for Open Exploration," access to several models including ChatGPT.
- Adam D'Angelo, ["Poe"](https://quorablog.quora.com/Poe-1), The Quora Blog (February 2023): public access, iOS first, models from OpenAI and Anthropic, the quotation about interfaces, the meaning of the name.
- Sarah Perez, ["Quora opens its new AI chatbot app Poe to the general public"](https://techcrunch.com/2023/02/06/quora-opens-its-new-ai-chatbot-app-poe-to-the-general-public/), TechCrunch, 6 February 2023: the public launch "on Friday" (3 February 2023), the three launch bots Sage, Claude, and Dragonfly and who powered each.
- Sarah Perez, ["Poe's AI chatbot app now lets you make your own bots using prompts"](https://techcrunch.com/2023/04/10/poes-ai-chatbot-app-now-lets-you-make-your-bots-using-prompts/), TechCrunch, 10 April 2023, quoting D'Angelo's announcement of 7 April 2023: user-created bots from "a short text prompt and an existing bot used as a base," each with its own poe.com URL.
- Screenshot `41-poe-explore-bots-2026.png` (captured 19 October 2026): the service running, with official bots from several makers; the basis for status "active".
