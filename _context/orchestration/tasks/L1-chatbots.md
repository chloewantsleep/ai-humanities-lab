---
task: "L1"
title: "Chatbots: one entry per chatbot"
status: "done"
owns: "`nextjs/content/glossary/chatbots/`"
depends_on: "start now"
report: "../reports/L0-L1-glossary-route-and-chatbots.md"
---
# L1. Chatbots: one entry per chatbot

Read [the glossary's shared brief (the entry format and the rules for glossary agents)](L-glossary.md) first: it applies to this task.

Folder `content/glossary/chatbots/`, `category: chatbots`. One entry per chatbot or chatbot product, from 1966 to 2026, with extra frontmatter: `year:` (first public release or demonstration), `maker:`, `status:` (active, retired, renamed), and `screenshot:` (a file in `content/history/_images/`, if there is one). Embed that screenshot in the entry as `![…](../../history/_images/<file>.png)`. Body sections for chatbots: "In plain terms", then **"Where it fits"** (what it added to the story: rules, persona, post-training, configuration, memory, public presence, agency), then "In the readings", "Try it", "See also", "Sources".

A starting list; add what's missing and drop what can't be sourced: ELIZA, PARRY, Racter, Jabberwacky, Dr. Sbaitso, A.L.I.C.E., SmarterChild, Cleverbot, Siri, Alexa, Xiaoice, Tay, Replika, Meena, BlenderBot, LaMDA, Sparrow, ChatGPT, Bing Chat and "Sydney", Bard and Gemini, Claude, Character.AI, Pi, Grok, Copilot, Meta AI, Poe, custom GPTs, Gems, Claude Projects, NotebookLM / Gemini Notebook, Dot, OpenClaw, Hermes Agent, Grok Bot, Muse, OpenAI's dots. The README's table should run in chronological order with the year, so it doubles as a timeline. Coordinate with task J (fact-checking): if J has already confirmed a date or claim, use its source; if you confirm something J lists as open, note it in your report.

## When you finish

Write or update [`../reports/L0-L1-glossary-route-and-chatbots.md`](../reports/L0-L1-glossary-route-and-chatbots.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
