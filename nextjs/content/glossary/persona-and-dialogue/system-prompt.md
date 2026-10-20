---
term: "System prompt"
slug: "system-prompt"
short: "Instructions supplied in a system role to guide the assistant’s behavior."
aliases: ["system instructions"]
category: "persona-and-dialogue"
see_also: ["preamble", "role", "recipient-design", "fine-tuning"]
readings: ["askell-2021", "plato-phaedrus"]
experiments: ["by-hand", "persona-dial"]
updated: "2026-10-19"
---

# System prompt

**Instructions supplied in a system role to guide the assistant’s behavior.**

## In plain terms

For the Course TF Assistant, an invented instruction might say: “Ask for the passage before interpreting it.” The system prompt supplies context for generation; editing it is not a training run. Distinguish the role carrying an instruction from the instruction’s wording, and inspect what the application sends.

## In the readings

Askell et al. investigate prompting alongside other ways of shaping an assistant (abstract). Plato, *Phaedrus*, 271a–272b, gives a different standard for responsive speech: attending to the particular hearer. A prompt requesting that behavior is a design attempt, not proof that the standard has been met.

## Try it

[Building the assistant by hand](/by-hand): compare the same question across columns and inspect the supplied text.

[Persona dial](/persona-dial): hold the model fixed, change a presentation or prompt setting, and compare the exchange.

## See also

[Preamble](preamble.md) · [Role](role.md) · [Recipient design](recipient-design.md) · [Fine-tuning](../models-and-training/fine-tuning.md)

## Sources

- [Askell et al., A General Language Assistant as a Laboratory for Alignment](https://arxiv.org/abs/2112.00861).
- [Plato, Phaedrus](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md).
- [Anthropic, prompting best practices, “Give Claude a role”](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#give-claude-a-role).
