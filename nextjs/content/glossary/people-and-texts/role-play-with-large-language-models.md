---
term: "Role Play with Large Language Models"
slug: role-play-with-large-language-models
short: "Shanahan, McDonell, and Reynolds's 2023 paper proposing that a dialogue agent is best described as playing a role, or many roles at once, rather than as a someone."
aliases: [Role-Play with Large Language Models, Shanahan McDonell Reynolds 2023, role play, role-play]
category: people-and-texts
see_also: [murray-shanahan, simulators, talking-about-large-language-models, askell-2021, ../persona-and-dialogue/simulator, ../persona-and-dialogue/role, ../persona-and-dialogue/character, ../persona-and-dialogue/anthropomorphism, ../persona-and-dialogue/role-play]
readings: [shanahan-2023]
experiments: [by-hand, spiral, persona-dial]
updated: 2026-10-19
---

# Role Play with Large Language Models

**Shanahan, McDonell, and Reynolds's 2023 paper proposing that a dialogue agent is best described as playing a role, or many roles at once, rather than as a someone.**

## Why it matters here

It is the required reading for the October 20 workshop, and it gives the experiments their working vocabulary. The paper's problem is how to talk about a chatbot that sounds like a person without either believing it is one or pretending it isn't doing anything. Its answer is role play: the underlying model is "a non-deterministic simulator capable of role-playing an infinity of characters," and a given conversation draws one character (or a cloud of possible ones) out of it. That lets us say "it's lying" or "it says it's afraid" as descriptions of a character, while keeping open what, if anything, is behind it.

Two analogies from the paper are worth having to hand. In twenty questions, the agent never really commits to one object; it keeps every answer consistent with the questions so far "in superposition." And the agent is "more like a performer in improvisational theatre than an actor in a conventional, scripted play." Both describe what the [GPT-2 experiment](/gpt-2) and [building the assistant by hand](/by-hand) show directly.

## In the readings

The course copy is an abstract and notes for the May 2023 preprint ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md)); the syllabus cites the *Nature* version. From the arXiv preprint:

- "We can see a dialogue agent as role-playing a single character. Second, taking a more nuanced view, we can see a dialogue agent as a superposition of simulacra within a multiverse of possible characters (Janus, 2022)."
- The two cases it works through are "(apparent) deception and (apparent) self-awareness" (abstract).

Its debt to janus's ["Simulators"](simulators.md) is explicit. Compare Wilde's "Give him a mask, and he will tell you the truth" in ["The Critic as Artist"](the-critic-as-artist.md), and Lord Henry's "an actor of a part that has not been written for him" in [*Dorian Gray*](the-picture-of-dorian-gray.md).

## Try it

[Building the assistant by hand](/by-hand): the same base model plays a helpful assistant, a sardonic one, or a medieval monk depending on the preamble, and with "let it write both sides" it plays the human too. The [persona dial](/persona-dial) changes how the role is presented.

## See also

[Murray Shanahan](murray-shanahan.md) · ["Simulators"](simulators.md) · ["Talking About Large Language Models"](talking-about-large-language-models.md) · [Askell et al. 2021](askell-2021.md) · [Simulator](../persona-and-dialogue/simulator.md) · [Role](../persona-and-dialogue/role.md) · [Character](../persona-and-dialogue/character.md) · [Anthropomorphism](../persona-and-dialogue/anthropomorphism.md) · [Role play](../persona-and-dialogue/role-play.md)

## Sources

- Murray Shanahan, Kyle McDonell, and Laria Reynolds, "Role play with large language models," *Nature* 623 (7987): 493–498, published online 8 November 2023, [doi:10.1038/s41586-023-06647-8](https://doi.org/10.1038/s41586-023-06647-8); preprint [arXiv:2305.16367](https://arxiv.org/abs/2305.16367) (May 2023), the source of the quotations. Affiliations at publication: Shanahan, Google DeepMind and Imperial College London; McDonell and Reynolds, EleutherAI.
- [ENG 298AI syllabus](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/syllabus.md), Seminar 7.
