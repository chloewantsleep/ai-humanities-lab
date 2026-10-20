---
title: The bot lab
description: "Build your chatbot as one file: a name, a voice, a model, and at most one short text. Chat with it here, switch models under it, and save it as bots/<slug>.md, the file the Slack Ensemble runs."
route: /bot-lab
status: working
order: 7
---

## What it is

The simple chat app from the session plan: "Everyone gets a repo. It includes a simple chat app, Vercel-like or even simpler, and students build their system prompt into it. The sample page should have a model selector."

A bot here is one Markdown file in the format in `nextjs/bots/README.md`: frontmatter for the name, slug, author, model, emoji, a one-line description, and optionally one short reference text; then the system prompt, as written. The same file is what the Slack Ensemble runs, so a bot that works on this page works in Slack.

## How to use it

1. **Pick a bot** at the top: an example (`bots/_examples/`: Socrates on writing, and the Creature with his last speech to Walton attached as a reference text), one of the room's bots (`bots/`), or "New bot".
2. **Edit it on the left.** Name, slug (made from the name until you change it), author, a Slack emoji shortcode, a one-line description, an optional reference text, and the system prompt. Every edit applies to your next message; the conversation on the right stays.
3. **Choose a model** in the selector: eight OpenRouter ids with one-line notes and prices (checked 2026-10-20), or "Other" to type any id. You can switch models mid-conversation and the history goes with you, so the same bot can be compared on two models in one thread.
4. **Talk to it** on the right. Send streams the reply; Stop cancels; "Clear conversation" starts over. If the key is missing, out of credit, or the model id is wrong, the error says so under the chat.
5. **Show what the model gets** opens a panel with the exact system message (the prompt, then the reference text under its `--- Reference text ---` line), the last request actually sent (model and messages, from the server), and the file as it will be saved.
6. **Save** writes `nextjs/bots/<slug>.md`, so your bot is a file you can open in Claude Code and submit to the Ensemble. **Download my bot file** gives you the same file if the app can't write (for instance, hosted on Vercel).
7. **Reference text:** choose one from `bots/knowledge/` or upload a `.md` or `.txt` (under about 8,000 words). It is pasted into the prompt whole and visibly. No retrieval here; that's `/retrieval`.

## What was built

- `nextjs/lib/bots.mjs` (and the pure part, `lib/bots-format.mjs`): read, validate, serialize, and save bot files; build the exact messages. Tests in `tests/bots.test.mjs`. The Slack Ensemble imports the same module.
- `nextjs/app/bot-lab/`: the page (`BotLab.jsx`), its models list (`models.mjs`), a small emoji map, and styles. `nextjs/app/api/bot-lab/bots` lists and saves bots; `nextjs/app/api/bot-lab/knowledge` lists and saves reference texts.
- The shared `/api/chat` route now takes an optional `model` (in the body, or `?model=` on the URL), which the selector uses. Without it the route behaves as before.

## Base models

None in the selector. OpenRouter's catalog on 2026-10-20 (470 models) listed no pretrained, non-instruct model, so Shanahan's contrast between a model that continues text and an assistant steered into a role can't be shown here. It is shown on this site at `/spiral` (GPT-2, a base model, in the browser) and `/by-hand` (the same base model made into an assistant by a prompt).

## Open questions

- Should a saved bot with the same slug as an example replace the example in the picker, or sit beside it? Now it sits beside it, and the room's copy wins when a slug is looked up.
- The curated list is one day's prices; who refreshes it?
