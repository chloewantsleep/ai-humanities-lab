---
title: "Today: build a bot"
description: "ENG 298AI, October 20, 2026. Set up Claude Code and the repo, talk about context windows and Gems, do four activities (ELIZA, GPT-2, the Poetry Gem, build your own bot), then critique it together."
list_heading: "Handouts"
---

You have just heard about 2023 to 2026: custom GPTs, Gems, reasoning models, agents. Today you build one of those bots, take it apart, and rebuild its interface yourself. The [timeline](/) tells the longer story; this page is the plan for the session.

## 1. Get set up: Claude Code and the repo

1. **Install the Claude desktop app** if you don't have it ([claude.ai/download](https://claude.ai/download)), sign in, and open the **Code** tab.
2. **Get the repo.** In Claude Code, ask: *"Clone https://github.com/ll-26-27/eng298ai-20261020 and open it."* (Or in a terminal: `git clone https://github.com/ll-26-27/eng298ai-20261020`.) For Activity D you will need your own copy, so you can also start by pressing **Fork** on that GitHub page and cloning your fork instead.
3. **Run it.** Ask Claude: *"Set this up and run it."* It installs the app in `nextjs/` and starts it. Then open [localhost:3000/workshop](http://localhost:3000/workshop): this page, on your own machine.
4. **Keys.** Paste the lines from the slide into `nextjs/.env.local` (Claude can make the file; never commit it). The Poetry Gem also needs a model key: claim one at [/keys](/keys) and paste it into the Gem's **API key** box.

**Notice:** the whole site is a folder of Markdown and a handful of pages. Your bot will be one file in it.

## 2. Context windows, and what a Gem or custom GPT is

**Do:** follow the drawing at the board: what is in the context window when a model answers you, and the ways other text gets in. Then look at the interfaces: the [custom GPT builder](/history/01-gpts) and [Google's Gem editor](/history/03-gems).

**Notice:** a 2023 bot is three things, all of them text placed in the window: **instructions**, **knowledge** (uploaded files), and a way of **delivering** that knowledge (all of it, or a search). Nothing is learned. [Bot materials](/bot-materials) lists exactly what goes into today's bot.

## 3. Four activities

### A. ELIZA (1966) → [/eliza](/eliza)

Talk to the first chatbot. Turn on **Show the rule** and watch which keyword fired. Try to make it say something it has no rule for.

**Notice:** every reply is decided by a rule a person wrote. The same sentence always gets the same reply. Whatever understanding you feel, you supplied.

### B. GPT-2, twice → [/gpt-2-assistant](/gpt-2-assistant)

First the raw model (2019): ask it who it is, and it keeps writing instead of answering. Then the same model with the conversations of the HHH prompt (2021) placed in front of your question, so it plays an assistant.

**Notice:** the weights don't change between the two. Only the document does. That page of invented dialogue is the ancestor of every system prompt.

### C. The Poetry Gem → [/poetry-gem](/poetry-gem)

A custom bot of 2023–24, drawn as a paper doll: the head is its instructions (a poetic form), the bodice its knowledge (Plato, Shelley, or Confucius), the skirt how the knowledge reaches the model (the whole text, a keyword search, a meaning-based search, or a search the model runs itself). Ask it for poems. Then open **What the model saw**.

**Notice:** for each line of a poem, can you tell whether it came from the instructions, the reading, or the assistant underneath? Watch the token bar: what does sending the whole novel cost?

### D. Build your own bot → [/build-a-bot](/build-a-bot)

It opens looking exactly like the Poetry Gem. Press the big **Reset** button. The page is wiped to plain text and a few drop-downs: the data your bot is actually made of, and a Submit button that sends it to the class's Airtable.

**Do:** don't just submit the drop-downs. In Claude Code, in your fork, ask Claude to redesign `nextjs/app/build-a-bot/BotPage.jsx` into an interface you like. Look at [Interfaces](/history) for sixty years of ideas. Then submit your bot from *your* design.

**Notice:** the one rule is the data. The box in the corner of the page, and Claude Code itself, warn you when your design stops sending what the table needs. Anything extra your design collects goes in **extras**.

## 4. Then: in person, and on paper

We stop the screens and talk. On paper, in pairs: what did the build-a-bot model make easy, and what did it hide? Where did your bot sound like itself, and where like the assistant underneath? Who is speaking when it speaks?

Then where the industry is going. Character.AI, Gems, and custom GPTs (which retire on 11 December 2026) are giving way to **harnesses**: a model run inside a loop of tools, checks, files, and permissions. ELIZA was rules without fluency; GPT-2 was fluency without rules. A harness puts the rules around the odds. The last chapter of the [timeline](/#epilogue) sets out the argument.
