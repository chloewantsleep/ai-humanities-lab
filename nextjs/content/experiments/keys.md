---
title: Student keys
description: "Claim your own OpenRouter key for the workshop: a name, the password from the slide, and a key that expires on its own."
route: /keys
status: building
group: "Build your bot"
order: 1
---

## What it is

For today you each get your own OpenRouter key, so the bots you build can call real models. The keys come from one pooled budget for the whole room: one person using a lot is fine, and the room as a whole can't go past the limit. Each key is named for the person who claimed it and stops working on its own after a few hours.

**In Claude Code**, type `/setup-key`: it writes the key straight into your `.env` without passing it through the chat. **In a browser**, use the form above: your name and the password on the slide. The key is shown once; put the line in your project's `.env`.

Never paste a key into a chat, a commit, or a shared document. If you lose it, claim again under the same name: that replaces your old key.

## How it works

This page is a copy of the claim app in `workshop-keys` (a separate repo in The Notebook). The instructor's command line creates an OpenRouter *workspace* for the workshop with a lifetime budget, opens a claim window for a few minutes, and deletes every key afterward. There is no database: OpenRouter's own list of keys is the record of who claimed what, and the claim window is a line in the workspace's description.

The page needs four settings on the server (`OPENROUTER_MANAGEMENT_KEY`, `WORKSHOP_SLUG`, `WORKSHOP_TITLE`, `CLAIM_PASSWORD`); without them it says it isn't set up. Running on the instructor's laptop it reaches only that laptop, so for students it has to be deployed.

## How this was made

Built by Claude Code (Opus 5.5) on 2026-10-20, thread `0eb5f30c-df85-41fe-af61-fdec77f9cbb8`, task AB on the orchestration board. Marlon: "we should also start testing those keys. ultimately this week maybe the key-dispenser should just be /keys in the course app?" The library is copied from `workshop-keys/nextjs/lib/` (see `lib/workshop-keys/README.md`). Unfinished: not deployed with the settings; today's room uses the separate claim app.
