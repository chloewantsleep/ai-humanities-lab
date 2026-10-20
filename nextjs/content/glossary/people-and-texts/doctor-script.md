---
term: "The DOCTOR script"
slug: doctor-script
short: "The set of keywords and rules that made ELIZA play a Rogerian psychotherapist: the most famous script in the history of chatbots, and the first written persona."
aliases: [DOCTOR, the ELIZA script]
category: people-and-texts
see_also: [eliza-paper, joseph-weizenbaum, kenneth-colby, ../chatbots/eliza, ../persona-and-dialogue/system-prompt, ../persona-and-dialogue/persona]
readings: [weizenbaum-1966]
experiments: [eliza, persona-dial]
updated: 2026-10-19
---

# The DOCTOR script

**The set of keywords and rules that made ELIZA play a Rogerian psychotherapist: the most famous script in the history of chatbots, and the first written persona.**

## Why it matters here

Weizenbaum separated the engine from the character. In his paper, "keywords and their associated transformation rules constitute the SCRIPT for a particular class of conversation," and "a script is data; i.e., it is not part of the program itself," so ELIZA could run other scripts, in Welsh and German as well as English. DOCTOR was the one that mattered. It ranks keywords ("mother," "always," "you"), decomposes the user's sentence around the best one, and reassembles the pieces into a question, with a few fallbacks when nothing matches.

That split is the ancestor of the system prompt and of the Course TF Assistant built in three products: one engine, a separate text that says who to be. The choice of therapist was itself a persona decision. The psychiatric interview, Weizenbaum wrote, is one of the few conversations in which one party "is free to assume the pose of knowing almost nothing of the real world": if a therapist answers "I went for a long boat ride" with "Tell me about boats," no one assumes he knows nothing about boats.

## Try it

[ELIZA](/eliza) runs DOCTOR in the browser with a "show the rule" view; the [persona dial](/persona-dial) puts it behind a chat interface beside Claude. The original MAD-SLIP listing, found in Weizenbaum's archives, is in the [history screenshots](../../history/README.md).

## See also

["ELIZA" (1966 paper)](eliza-paper.md) · [Joseph Weizenbaum](joseph-weizenbaum.md) · [Kenneth Colby](kenneth-colby.md) · [ELIZA](../chatbots/eliza.md) · [System prompt](../persona-and-dialogue/system-prompt.md) · [Persona](../persona-and-dialogue/persona.md)

## Sources

- Joseph Weizenbaum, "ELIZA," *Communications of the ACM* 9, no. 1 (1966): 36–45, [doi:10.1145/365153.365168](https://doi.org/10.1145/365153.365168); quotations from the [UMBC course copy](https://courses.cs.umbc.edu/331/papers/eliza.html). The full paper's appendix prints a version of the script.
- Rupert Lane et al., ["ELIZA Reanimated"](https://arxiv.org/abs/2501.06707) (arXiv, January 2025), on the original listing and an early DOCTOR script.
