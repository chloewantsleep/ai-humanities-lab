---
title: The bot room
description: "Two or three bots in one conversation, or working together on one task: who speaks next, what each one is shown, and what it costs."
route: /bot-room
status: working
group: "Where agents are going"
order: 3
---

## What it shows

A chatbot is a system prompt in front of a model. Put two or three of them in one room and the same thing is suddenly a cast: each bot sees the others' words as messages labeled with their names, and only its own words as its own. The room runs the turns, chooses who speaks next (in order, or by asking a director model), and shows each bot exactly what it received, so the trick is visible: there is no shared mind, only three prompts and one transcript copied around.

## What was built

- **Pick two or three bots** from the files in the shared bot format (`bots/README.md`): the room's own examples (the Creature, Victor Frankenstein, the Editor, a Skeptical Reader, in `app/bot-room/examples/`), the site's examples in `bots/_examples/`, and any bot in `bots/`, read with the shared reader (`lib/bots.mjs`), so a bot's `knowledge:` text is appended to its prompt as the format says. Or write one on the spot (name, model, system prompt) and download it as a file in the same format. Every bot can be run on one chosen model for the whole room (Claude Haiku is the cheap one).
- **A starting line or a task** from the host, then **turns**: round-robin, or a **director** (Claude Haiku) that is given the roster and the transcript and answers with who speaks next and why, shown in the transcript as a dashed note.
- **Working together:** the bots share a task; each turn is sent the latest draft, and a bot that writes a new one between `<draft>` and `</draft>` replaces the shared draft, shown in its own panel.
- **What each bot received:** every turn has an "Exactly what this bot received" panel with its system prompt (its file's body plus the room's note), and the transcript as the model saw it: its own earlier turns as the assistant, everyone else's merged into user messages labeled by name.
- **Turn limit, step, run, stop; a cost line** per turn and for the run, from OpenRouter's token counts and today's prices (checked 2026-10-20 at https://openrouter.ai/api/v1/models), plus an estimate before you run. Every turn is a paid call; the director adds one more per turn.

## What students saw in testing (2026-10-20, Claude Haiku 5.5 for every bot, to keep it cheap)

- **The Creature and Victor, round-robin, four turns, 11 s, $0.0006.** The Creature: "I have followed you across the ice, Victor, and I find that my hands are trembling, though I have not decided whether it is rage or grief that shakes them." Victor: "I cannot look at you. Your face, your size, the very sound of your voice, these things turn my stomach as they did on that night in Ingolstadt." Each turn's "Exactly what … received" shows the other's lines as `The Creature: …` in user messages and its own as the assistant.
- **The director** (with a Skeptical Reader added): "The host just addressed Victor and the creature is the one who has come to speak with him, so the creature should answer or open the confrontation"; then "The Creature has directly addressed Victor and accused him of abandonment, so Victor is the one who must answer"; then the Reader, "who distrusts big claims … has been quiet". Each director call cost about a hundredth of a cent.
- **Working together** (the Editor, a Skeptical Reader, Socrates; "one paragraph, under 120 words, on what Socrates in the Phaedrus would say about chatbots"): the Editor offered a first draft, the Reader asked "where exactly does Socrates say the written …" and cited 275d, Socrates asked whether a chatbot "is answering from a mind that knows what it is saying". With 260 tokens per turn the drafts were cut off before their closing tag, which is why together mode now starts at 400 tokens per turn and keeps an unfinished draft (marked as such).
- **A host line mid-conversation** ("Both of you: say in one sentence what you want from the other") was answered by the next speaker; **Stop** halted a six-turn run after the first turn's first words; **a bot written on the spot** (Brother Anselm) downloaded as a file in the shared format.
- **What went wrong first:** with reasoning left on, Claude Haiku 5.5 sometimes spent all 200 output tokens thinking and returned no words (empty turns, an unreadable director). The route now turns reasoning off for every call and shows reasoning tokens when a model reports them.

## What it is not

Not the Slack Ensemble (task O), where the same bot files become members of a Slack workspace. This is the in-browser design space: the place to find out what two bots do to each other before letting them loose.

## Things to try

- The Creature and Victor, with the host's line "Victor, the creature has come to the glacier to speak with you." Round-robin first; then the director.
- The Editor, a Skeptical Reader, and Socrates, working together: "One paragraph on what Socrates would say about chatbots, for a newsletter."
- Open "Exactly what this bot received" on two consecutive turns and compare the role labels.

## Open questions

- Should bots be able to address one another by name in a way the director respects (a "to:" field), or is the director's own reading enough?
- The Slack Ensemble (O) needs the same loop guard (a turn limit and a "a bot never answers a bot unless a human started it" rule); the room's turn limit is the browser version of that.
