---
term: "Stop sequence"
slug: stop-sequence
short: "A string that, when the model writes it, ends generation: the program around the model cuts it off."
aliases: [stop string, stop token]
category: models-and-training
see_also: [end-of-sequence-token, base-model, role, turn-taking]
readings: [askell-2021]
experiments: [by-hand]
updated: 2026-10-19
---

# Stop sequence

**A string that, when the model writes it, ends generation: the program around the model cuts it off.**

## In plain terms

A stop sequence is a rule in the program, not in the model. If the stop sequence is "Human:", the moment the model starts writing the next human turn, the program stops and shows only what came before. This is how a base model with a dialogue [preamble](../persona-and-dialogue/preamble.md) is made to look like an assistant that waits for you: it would happily write your next line too, so the program doesn't let it.

Turn the stop sequence off and the model writes both sides of the conversation.

## In the readings

[Askell et al. 2021](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md) describes its evaluation interface this way (introduction): "Models indicate they have completed a response by generating a stop sequence, which is literally the string Human: used to designate roles in the dialogue."

## Try it

The "let it write both sides" switch in column 2 of [building the assistant by hand](/by-hand) removes the stop sequence.

## See also

[End-of-sequence token](end-of-sequence-token.md) · [Base model](base-model.md) · [Role](../persona-and-dialogue/role.md) · [Turn-taking](../persona-and-dialogue/turn-taking.md)

## Sources

- Askell et al., ["A General Language Assistant as a Laboratory for Alignment"](https://arxiv.org/abs/2112.00861) (2021); [course copy](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md).
