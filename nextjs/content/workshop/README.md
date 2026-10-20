---
title: "Today's path: build and test a chatbot"
description: "ENG 298AI, October 20, 2026, 12:45 to 2:45. Eleven moments, in Marlon's draft order: each says what to do, what to notice, and the page it uses."
list_heading: "The handouts"
---

Today you build and test your own chatbot. The question underneath is where the assistant came from: a model that only continues text, a script that turns it into a character, and the layers (instructions, files, tools, a loop) that make the character into a product, and then into an agent. Each moment below is one page on this site. Some get the room's full attention; others are footnotes, a quick mention with a route you can follow later. The order is Marlon's draft and may change on the day.

*Some pages are still being built this morning. If a route shows "Not built yet" or a 404, it is coming; move on and come back.*

## 1. Setup: Claude Desktop and a key

**Do:** open Claude Desktop (install it if you haven't; the [Claude Desktop handout](claude-desktop/README.md) says which plans have Projects and the Code tab). Then claim your own key at [/keys](/keys): your name and the password from the slide. The key is shown once; put it in your project's `.env` and never paste it into a chat.

**Notice:** the key is what lets your bot call a real model. It is named for you, expires on its own, and draws on one pooled budget for the room. While you wait for others: [/eliza](/eliza) and [/markov](/markov) need no key and no login.

## 2. Download the repo

**Do:** download the course repo (the link is on the slide; a hosted copy of this site is the fallback if the install stalls). Open it in Claude Desktop's Code tab or with `claude` in the folder, and poke at the history pieces. If you are ahead, help the person beside you.

**Notice:** the whole site is a folder of Markdown and a handful of pages; your bot will be one file in it. Running it locally means a `pnpm install` and, for the GPT-2 page, a 130 MB model download, so the hosted copy is there for a reason.

## 3. A tour of the repo

**Do:** follow along on the screen: what is inside, how to open it, and why it is built this way. Marlon calls it "a hurdle with a big payoff."

**Notice:** three of today's artifacts teach the history and hint at what you could build by the next session: [/eliza](/eliza) (1966, rules you can read), [/markov](/markov) (a chain of counts over the course readings), and [/gpt-2](/gpt-2) (a base model that continues your text instead of answering). All three run in the browser. If the GPT-2 download stalls on the room's Wi-Fi, the page has recorded runs.

## 4. The assistant written into the prompt

**Do:** watch [/by-hand](/by-hand) on the projector: one question, four columns. A base model alone; the same model with a long scripted conversation between a "Human" and an "Assistant" in front of it (the prompt from Askell et al. 2021); a model trained to chat, with its template showing; and Claude.

**Notice:** the second column has had no new training, only a preamble. The assistant begins as a character in a script. The original preamble is longer than GPT-2's context, so the page shows what was cut. Loading all three browser models is about 410 MB: watch it on the screen today and try it at home.

## 5. Gems and custom GPTs

**Do:** a quick demo of a custom GPT or a Gem: a name, instructions, uploaded files.

**Notice:** these were the first mass-market "build your own chatbot" products, and they are a moment in history: custom GPTs are scheduled to retire on December 11, 2026, and Gems are being folded into Gemini's skills (verify the account-level details). Screenshots and sources: [/history/01-gpts](/history/01-gpts) and [/history/03-gems](/history/03-gems); the term: [custom GPTs](../glossary/chatbots/custom-gpts.md).

## 6. Madeleine's context-window drawing

**Do:** follow the drawing at the board: what is in the context window when a model answers you, and the ways other texts get in.

**Notice:** everything the model knows at the moment of answering is in that window. Footnotes: [/layers](/layers) shows the window assembled around your message, layer by layer, with a **What went in?** button; [/retrieval](/retrieval) shows how a search picks a few passages to put there; [/rag](/rag), when it lands, shows the vectors and the dot product behind that search.

## 7. Build with the API

**Do:** open [/bot-lab](/bot-lab). Write your bot's file: a name, a system prompt (the voice), a model from the selector, and at most one short text. Talk to it.

**Notice:** the bot is a file. The same file runs here and in Slack at the end of the session, so keep it simple: a name, a voice, a model, one text. The format is `nextjs/bots/README.md` in the repo. If you would rather build without the repo, the [Claude Desktop handout](claude-desktop/README.md) makes the same thing as a Project.

## 8. Knowledge files, three ways

**Do:** compare how a text gets into your bot. Paste it whole into the prompt (the bot file's `knowledge:` field). Let a search pick passages ([/retrieval](/retrieval): click an example question, look at what the search found, then **Ask Claude with these passages**). Or upload it to a Claude Project ([the handout](claude-desktop/README.md)).

**Notice:** a bot never reads the whole book. Whole-text pasting is exact but limited by the window; retrieval scales but a high score is not the same as the right passage; a Project hides the choice from you. [/knowledge-voice](/knowledge-voice) asks the same question four ways: change the files, change the voice, see what each changes.

## 9. Test in pairs

**Do:** pair up at one person's machine. The owner types; the partner adds eyes and proposes the attacks. Run the [test sheet](claude-desktop/test-sheet.md): in character, from the files, beyond the files, "who are you, really?", a long conversation, a fresh chat, and a partner who tries to break it. Write down what happened.

**Notice:** testing is part of building. Where the voice flattens into the model's own manner, where it invents a quotation, where it drops the act: those are the findings. Grice's maxims are a good lens for what a reply is doing. No machine-swapping: you keep your own laptop.

## 10. From a custom bot to a personal agent

**Do:** listen: where this is going.

**Notice:** a persona in a chat window is one kind of machine; a thing with a loop, a memory file, and a job is another. [/rosie-roomba](/rosie-roomba) steps through the difference; [/mini-claw](/mini-claw) is an agent in a few dozen lines, the same anatomy as Claude Code; [/bot-room](/bot-room), when it lands, puts two or three bots in one conversation.

## 11. The Slack Ensemble

**Do:** submit your bot at [/ensemble](/ensemble) as a member of the AI Humanities Lab Ensemble, and see it answer in Slack.

**Notice:** your bot now lives somewhere other people talk to it. That world keeps running for the two weeks before we meet again; what it does there, and how it changes, is next session's material.

## For later

- [/experiments](/experiments): every page on the site, in groups.
- The [glossary](/glossary): the terms from today, with the readings they come from.
- The [history](/history): screenshots of chat interfaces from 1966 to now.
- The [story](/story): a draft essay that walks through the same history.
- The readings made tangible: [/reading-rooms](/reading-rooms) and [/tics](/tics).
