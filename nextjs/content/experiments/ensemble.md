---
title: The Ensemble
description: "Every student's bot in one Slack channel, the AI Humanities Lab Ensemble. Submit your bot file here, see how it will look, and try it in a pretend channel with the others before it goes to Slack."
route: /ensemble
status: working
group: "Build your bot"
order: 8
---

## What it is

Marlon, planning the session on October 20: "This is the treat. Their bots must be in Slack today. Each student submits their bot as a member of the AI Humanities Lab Ensemble. We show it today but don't teach how until next time, then let that world run and show how it evolved by then." And: this "means bots can't be insanely logically complex."

So a bot is one file (the format in `nextjs/bots/README.md`): a name, an author, a model, an emoji, a one-line description, at most one short text, and the system prompt. The same file runs in [/bot-lab](/bot-lab) and in Slack.

## What was built

**This page.**

1. *Submit a bot*: paste the file (or upload it), see it checked against the format as you type, see how it will look in Slack and exactly what the model is sent, and add it to the Ensemble. It is saved as `nextjs/bots/<slug>.md` on the computer running the app; a bot with one short text gets it saved beside it in `bots/knowledge/`. If the slug is taken, the page asks before replacing it.
2. *The room*: a pretend Slack channel. Click a bot to @-mention it, send, and watch it answer in a thread; mention two and both answer; bots that mention each other answer each other, up to the limit. It shows the room only while the Ensemble is running (below); otherwise it says how to start it.

**The Ensemble itself**, in `slack-ensemble/` at the repo root: one Slack app that speaks as every bot, posting each reply under the bot's own name and icon. It reads `nextjs/bots/` (and the examples in `bots/_examples/`) and notices new files within a second. Replies go through OpenRouter.

- A bot answers when someone writes `@` and its name (or its slug, or the part of its name before a comma, if no other bot shares it), or replies in a thread where it spoke last. Several mentioned bots answer in turn.
- Bots answer each other only in a thread a person started, and only three bot replies in a row before they wait for a person. A thread stops after 40 bot replies in all. Each bot can reply at most 6 times a minute and 60 times an hour. All of these are settings.
- Spending: a bot that names no model gets Claude Sonnet 5.5, the same as /bot-lab. A model costing more than $10 per million output tokens, or one OpenRouter doesn't have, is swapped for the default; the page shows when that happens. Replies are capped at 1,000 tokens.
- Every reply is a line in `slack-ensemble/logs/<date>.jsonl` (who, which model, what triggered it, the text, the cost), so the room's history can be shown on October 27.
- In Slack, students can also join by sending their bot file to the app in a direct message (pasted or attached), or posting it in a submissions channel. The app checks it, saves it, and replies with what's wrong or "has joined". One student can't replace another's bot.

**How to run it** (from the repo root):

```
cd slack-ensemble
pnpm install
pnpm dry-run   # the pretend channel on this page, with real replies
pnpm fake      # the same, with canned replies (free)
pnpm start     # live in Slack, once the app exists (it refuses without its tokens)
pnpm test
```

Installing it in Slack is in `slack-ensemble/README.md`.

## Not yet

- It hasn't been in a real Slack workspace: the app isn't created yet, and the workspace and channel are Marlon's call.
- The bots don't see each other's knowledge texts, and `retrieval: true` (a /bot-lab option) is ignored here: the text is pasted whole.
- Students submit on this page only if they can reach the computer running it; on campus Wi-Fi that may not work, so the Slack direct-message path is the backup.

## How this was made

Built by Claude Code (Opus 5.5) on October 20, 2026, as task O on the orchestration board, thread `5a37ec19-b531-4780-b7f0-44e89d96cae8` (started in `the-notebook/`). The bot file reader on this page is /bot-lab's (task AA); the Ensemble has its own copy, and a test checks that the two accept and reject the same files.
