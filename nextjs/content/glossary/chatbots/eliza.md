---
term: "ELIZA"
slug: eliza
short: "Joseph Weizenbaum's 1966 program at MIT that held typed conversations by matching keywords and turning the user's own sentences back as questions; its DOCTOR script played a Rogerian therapist."
aliases: [DOCTOR, Eliza]
category: chatbots
year: 1966
maker: "Joseph Weizenbaum, MIT"
status: retired
screenshot: 00-eliza-1966.png
see_also: [parry, eliza-effect, joseph-weizenbaum, doctor-script, persona]
readings: [weizenbaum-1966, plato-phaedrus, bergson-laughter]
experiments: [eliza, persona-dial]
updated: 2026-10-19
---

# ELIZA

**Joseph Weizenbaum's 1966 program at MIT that held typed conversations by matching keywords and turning the user's own sentences back as questions; its DOCTOR script played a Rogerian therapist.**

![An ELIZA emulator running the "Men are all alike" exchange from Weizenbaum's 1966 paper](../../history/_images/00-eliza-1966.png)

## In plain terms

ELIZA has no model of the world and no memory of language beyond a list of rules. It scans what you type for a keyword ("mother", "always", "you"), picks the highest-ranked one, breaks your sentence into pieces with a matching pattern, and reassembles the pieces into a reply, swapping "I" for "you" on the way. When nothing matches, it falls back on a stock line ("PLEASE GO ON"). Weizenbaum stressed that the rules (the "script") are data, separate from the program, so the same engine could run other scripts in other languages.

The famous run is the one printed in his paper, which opens: "Men are all alike." / "IN WHAT WAY?" / "They're always bugging us about something or other." / "CAN YOU THINK OF A SPECIFIC EXAMPLE?" / "Well, my boyfriend made me come here." / "YOUR BOYFRIEND MADE YOU COME HERE". Every reply is built from the user's own words.

Weizenbaum chose the therapist because, as he put it, the psychiatric interview is one of the few conversations in which one party can "assume the pose of knowing almost nothing of the real world" without seeming strange. The persona hides the program's ignorance.

## Where it fits

**Rules and persona.** ELIZA is the starting point of the story: a conversation with no language model at all, made convincing by a persona (the listening therapist) and by the person typing, who supplies the meaning. People's readiness to treat it as understanding them is what came to be called the ELIZA effect, and Weizenbaum spent much of his later career warning about it.

## In the readings

Socrates' complaint about writing in the *Phaedrus* (275d) fits ELIZA closely: written words seem to "have intelligence, but if you want to know anything and put a question to one of them, the speaker always gives one unvarying answer" ([Jowett translation](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/plato-phaedrus.md#L906)). ELIZA varies its answers, but only by rule. Bergson's comedy of "mechanical inelasticity, just where one would expect to find the wide-awake adaptability and the living pliableness of a human being" ([*Laughter*, ch. 1](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/bergson-laughter.md#L46)) describes the moment an ELIZA conversation breaks: the rule fires where a person would have adapted.

## Try it

[ELIZA](/eliza) runs the DOCTOR script with a "show the rule" view beside each reply. The [persona dial](/persona-dial) puts ELIZA behind the same chat interface as Claude.

## See also

[PARRY](parry.md) · [ELIZA effect](../persona-and-dialogue/eliza-effect.md) · [Joseph Weizenbaum](../people-and-texts/joseph-weizenbaum.md) · [The DOCTOR script](../people-and-texts/doctor-script.md) · [Persona](../persona-and-dialogue/persona.md)

## Sources

- Joseph Weizenbaum, "ELIZA—A Computer Program for the Study of Natural Language Communication Between Man and Machine," *Communications of the ACM* 9, no. 1 (January 1966): 36–45, [doi:10.1145/365153.365168](https://doi.org/10.1145/365153.365168); [full text (UMBC course copy)](https://courses.cs.umbc.edu/331/papers/eliza.html). The implementation on MIT's MAC time-sharing system in MAD-SLIP, keyword ranks, scripts as data, the Rogerian scripts, the "pose" quotation, and the "Men are all alike" transcript are all from the paper.
- Rupert Lane, Anthony Hay, Arthur Schwarz, David M. Berry, and Jeff Shrager, ["ELIZA Reanimated: The world's first chatbot restored on the world's first time sharing system"](https://arxiv.org/abs/2501.06707) (arXiv, January 2025): the original printout found in Weizenbaum's MIT archives, with an early DOCTOR script and nearly complete MAD-SLIP code, run again on an emulated IBM 7094. The [original listing](../../history/README.md) is in the history screenshots.
- ["ELIZA"](https://en.wikipedia.org/wiki/ELIZA), Wikipedia: developed 1964 to 1967; the MAD-SLIP source found in the MIT archives in 2021; the restoration run in December 2024 (dates not checked against a primary source; verify).
