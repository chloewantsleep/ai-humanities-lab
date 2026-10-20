---
term: "Role"
slug: "role"
short: "A label identifying a message’s place in a chat exchange."
aliases: ["user role", "assistant role", "system role"]
category: "persona-and-dialogue"
see_also: ["assistant", "role-play", "turn", "chat-template"]
readings: ["sacks-1974"]
experiments: ["by-hand", "persona-dial"]
updated: "2026-10-19"
---

# Role

**A label identifying a message’s place in a chat exchange.**

## In plain terms

In these experiments, user, assistant, and system identify different kinds of messages. These labels organize the app’s input (some APIs carry system instructions in a separate field); a medieval monk is instead a character the assistant may be asked to perform. Inspect both levels: which message carries an instruction, and which speaking part the instruction asks for.

## In the readings

Sacks, Schegloff, and Jefferson, §3.2–3.3, describe current and next speakers as positions in an unfolding exchange. That provides a comparison, not an equivalence: a human conversation’s changing speakership is different from a chat application’s fixed message labels.

## Try it

[Building the assistant by hand](/by-hand): compare the same question across columns and inspect the supplied text.

[Persona dial](/persona-dial): hold the model fixed, change a presentation or prompt setting, and compare the exchange.

## See also

[Assistant](assistant.md) · [Role-play](role-play.md) · [Turn](turn.md) · [Chat template](../models-and-training/chat-template.md)

## Sources

- [Sacks, Schegloff, and Jefferson, turn-taking](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/sacks-schegloff-jefferson-1974-turn-taking.md).
- [Anthropic, prompting best practices, “Give Claude a role”](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#give-claude-a-role).
