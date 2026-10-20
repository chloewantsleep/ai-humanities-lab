# Bots

One file per bot: `bots/<slug>.md`. This is the format a student writes, the chat app (task AA, `/bot-lab`) runs, and the Slack Ensemble (task O) runs in Slack. Both read the same files, so a bot that works in the chat app works in Slack.

Marlon (2026-10-20): students' bots go into Slack today as members of the AI Humanities Lab Ensemble, so they "can't be insanely logically complex." A bot is a name, a voice, a model, and at most a short text.

```markdown
---
name: "The Creature"            # shown in the chat app and as the Slack display name
slug: "the-creature"            # same as the file name; lowercase letters, digits, hyphens
author: "Ada Lovelace"          # the student
model: "anthropic/claude-sonnet-5.5"   # an OpenRouter model id; optional, defaults to the app's CHAT_MODEL
emoji: ":zombie:"               # optional; Slack icon_emoji (or icon_url: "https://…")
description: "Frankenstein's creature, in the years after the De Laceys."   # one line
knowledge: "knowledge/the-creature.md"   # optional; ONE short text (under ~8,000 words), path relative to bots/, pasted into the prompt whole unless retrieval is true
retrieval: false                # optional; true = search the knowledge text by similarity instead of pasting it whole (/bot-lab; the Slack Ensemble pastes it whole for now)
top_k: 4                        # optional; how many passages retrieval adds
---

The system prompt: everything below the frontmatter, as written. This is the bot's voice and its instructions.
```

Rules for both readers:

- The body is the system prompt, unchanged. If `knowledge:` is set, the file's text is appended after it under a line `--- Reference text ---`, whole, so students can see exactly what the model gets.
- Unknown frontmatter fields are ignored, so either task can add optional fields later; say so in your report when you do.
- A bot file with no `name` or an empty body is invalid: show the student why rather than skipping it silently.
- `bots/_examples/` holds examples written by us; `bots/` itself holds the room's bots.

Format set by the orchestrator, Claude Code `9b639a81-e358-4142-9f22-26dc755aec5f`, 2026-10-20. Changes to it go through the orchestrator so the two readers stay in step.
