---
term: "Logic and Conversation"
slug: logic-and-conversation
short: "H. P. Grice's paper separating what a speaker says from what they implicate, and explaining the gap with a Cooperative Principle and four maxims: Quantity, Quality, Relation, and Manner."
aliases: [Grice 1975, the Cooperative Principle, conversational implicature]
category: people-and-texts
see_also: [h-p-grice, simplest-systematics, ../persona-and-dialogue/grices-maxims, ../persona-and-dialogue/implicature, ../persona-and-dialogue/hallucination, ../persona-and-dialogue/sycophancy, ../persona-and-dialogue/hhh, ../persona-and-dialogue/cooperative-principle, ../persona-and-dialogue/flouting, ../persona-and-dialogue/irony]
readings: [grice-1975]
experiments: [eliza, by-hand]
updated: 2026-10-19
---

# Logic and Conversation

**H. P. Grice's paper separating what a speaker says from what they implicate, and explaining the gap with a Cooperative Principle and four maxims: Quantity, Quality, Relation, and Manner.**

## Why it matters here

Read on October 13, Grice explains why a chatbot can seem to mean more than its words, and why people work so hard to make its replies make sense. Hearers assume a speaker is cooperating, so when a reply seems off they look for the point. That is the ELIZA effect described from the listener's side: "IN WHAT WAY?" is taken as a therapist's probe because we assume it is relevant.

The maxims also read as a spec for an assistant, and an awkward one. "Do not say what you believe to be false" and "Do not say that for which you lack adequate evidence" are what [hallucination](../persona-and-dialogue/hallucination.md) breaks; "Do not make your contribution more informative than is required" is what an over-eager assistant breaks; and the helpful, honest, harmless (HHH) goals of the Askell et al. paper overlap with Quantity, Quality, and Relation. Irony, metaphor, and understatement all depend on a speaker *visibly* breaking a maxim, which raises the question of whether a model can flout or only fail.

## In the readings

Cited by page from *Syntax and Semantics 3* (1975):

- **p. 43:** the opening example: asked how C is doing at the bank, B says "he hasn't been to prison yet." What B *implicates* differs from what B *said* ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L25)).
- **p. 45:** the Cooperative Principle: "Make your conversational contribution such as is required, at the stage at which it occurs, by the accepted purpose or direction of the talk exchange in which you are engaged" ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L33)).
- **pp. 45–46:** the maxims of Quantity ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L37)), Quality ("Do not say what you believe to be false"; "Do not say that for which you lack adequate evidence"), Relation ("Be relevant"), and Manner ("Be perspicuous") ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L44)).
- **p. 49:** ways of failing a maxim: violating, opting out, a clash, and flouting, where a maxim is "exploited" to generate an implicature ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L88)).
- **p. 52:** the letter of reference that praises only the candidate's English and attendance ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L129)). **p. 53:** irony ("X is a fine friend") and metaphor ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L141)).
- **p. 57:** conversational implicatures can be "canceled" ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L180)).

## Try it

In [ELIZA](/eliza), notice how much of the sense you supply. In [building the assistant by hand](/by-hand), compare how informative each column's answer is: the base model breaks every maxim at once.

## See also

[H. P. Grice](h-p-grice.md) · [A Simplest Systematics](simplest-systematics.md) · [Grice's maxims](../persona-and-dialogue/grices-maxims.md) · [Implicature](../persona-and-dialogue/implicature.md) · [Hallucination](../persona-and-dialogue/hallucination.md) · [Sycophancy](../persona-and-dialogue/sycophancy.md) · [HHH](../persona-and-dialogue/hhh.md) · [Cooperative Principle](../persona-and-dialogue/cooperative-principle.md) · [Flouting](../persona-and-dialogue/flouting.md) · [Irony](../persona-and-dialogue/irony.md)

## Sources

- H. P. Grice, "Logic and Conversation," in *Syntax and Semantics, Vol. 3: Speech Acts*, ed. Peter Cole and Jerry L. Morgan (New York: Academic Press, 1975), 41–58, course copy ([Markdown](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md)). Its first note says it comes from Grice's William James Lectures at Harvard, 1967 ([text](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/course-readings-md/grice-1975-logic-and-conversation.md?plain=1#L190)).
- [ENG 298AI syllabus](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/course-readings/syllabus.md), Seminar 6.
