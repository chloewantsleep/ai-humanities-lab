---
term: "PARRY"
slug: parry
short: "Kenneth Colby's simulation of a paranoid patient, built at Stanford around 1971: a chatbot with a biography, a diagnosis, and moods that rose and fell during an interview."
aliases: [Parry, "artificial paranoia"]
category: chatbots
year: 1971
maker: "Kenneth Mark Colby, with Sylvia Weber and Franklin Dennis Hilf, Stanford University"
status: retired
screenshot:
see_also: [eliza, kenneth-colby, persona, character, imitation-game, eliza-effect, doctor-script]
readings: []
experiments: [eliza]
updated: 2026-10-19
---

# PARRY

**Kenneth Colby's simulation of a paranoid patient, built at Stanford around 1971: a chatbot with a biography, a diagnosis, and moods that rose and fell during an interview.**

## In plain terms

ELIZA played the listener; PARRY played the patient. Colby, a psychiatrist working in Stanford's computer science department, wrote out an imagined person and gave him to the program as "initial conditions": "a 28-year-old single man who works as a post office clerk," sensitive about his appearance, family, and religion, who gambles on horses and believes that a bookie he quarrelled with may have the underworld come after him. The program tracks three numbers, fear, anger, and mistrust, which rise when the interviewer seems threatening or insulting and fall slowly otherwise. Mistrust is the "sticky" one. PARRY steers toward its story about the Mafia, then backs off when the topic gets too threatening.

Colby tested it on psychiatrists. In one test, transcripts of an interview with PARRY and an interview with a real patient went to 100 randomly chosen psychiatrists, who were asked which was the computer. Of the 41 who replied, 21 got it right and 20 got it wrong; Colby's draft calls the result "chance guessing." He called these "Turing-like" tests, not Turing's own game.

On 18 September 1972 the two programs were put in a room together over the ARPANET: PARRY running at the Stanford AI Lab, the DOCTOR script at BBN, both reached from UCLA. Vint Cerf printed the session as RFC 439, "PARRY Encounters the DOCTOR." PARRY says "Horseracing interests me," "A bookie didn't pay me off once," and "I beat up the bookie who did not pay off, and I thought he might use his friends in the underworld to get even with me"; the DOCTOR answers, as ever, by turning the words around: "What makes you think I know anything about bookies?"

## Where it fits

**Persona.** PARRY is the first chatbot whose persona is a whole character, with a life story, a diagnosis, and an emotional state that changes turn by turn. ELIZA's therapist hid the program's ignorance; PARRY's paranoia explained its evasions, which is the same move Eugene Goostman made decades later with a 13-year-old boy. The PARRY–DOCTOR session is also the first well-known conversation between two chatbots with no person typing.

## Try it

[ELIZA](/eliza) runs the DOCTOR script that PARRY talked to in 1972. Try typing PARRY's lines from RFC 439 and watch which rule answers.

## See also

[ELIZA](eliza.md) · [Eugene Goostman](eugene-goostman.md) · [Kenneth Colby](../people-and-texts/kenneth-colby.md) · [Persona](../persona-and-dialogue/persona.md) · [Character](../persona-and-dialogue/character.md) · [The imitation game](../people-and-texts/imitation-game.md) · [ELIZA effect](../persona-and-dialogue/eliza-effect.md) · [The DOCTOR script](../people-and-texts/doctor-script.md)

## Sources

- Kenneth Mark Colby, Sylvia Weber, and Franklin Dennis Hilf, "Artificial Paranoia," *Artificial Intelligence* 2 (1971): 1–25, [PDF (UMBC course copy)](https://courses.cs.umbc.edu/471/papers/colby_71.pdf). The model, the hypothetical patient's biography ("28-year-old single man … post office clerk," horseracing, the bookie, the underworld), fear, anger, and mistrust as variables, and mistrust as "sticky." The 1971 date is the paper's; the year the program first ran is not stated there.
- Vint Cerf, ["PARRY Encounters the DOCTOR," RFC 439](https://www.rfc-editor.org/rfc/rfc439.txt) (21 January 1973): the session took place on 18 September 1972; PARRY at SAIL, DOCTOR at BBN Tenex, both accessed from UCLA; the quoted lines.
- Kenneth Colby, draft chapter "Validation," SAIL file `CHAP6[4,KMC]20`, dated 1973-12-11, [SailDart archive](https://www.saildart.org/CHAP6%5B4,KMC%5D20): the transcript test sent to 100 psychiatrists, 41 replies, 21 correct and 20 wrong, "The results indicate chance guessing." The published version of this material is Colby's *Artificial Paranoia* (1975), not checked here.
- Colby, Hilf, Weber, and Kraemer, "Turing-like Indistinguishability Tests for the Validation of a Computer Simulation of Paranoid Processes," *Artificial Intelligence* 3 (1972): 199–221: cited for the term "Turing-like"; title and citation from the [Wikipedia article on PARRY](https://en.wikipedia.org/wiki/PARRY) (secondary; the paper itself was not opened).
