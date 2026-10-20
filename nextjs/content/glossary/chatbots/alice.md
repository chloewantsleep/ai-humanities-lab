---
term: "A.L.I.C.E."
slug: alice
short: "Richard Wallace's open-source chatbot, begun in 1995, whose replies are tens of thousands of hand-written pattern-and-response rules in AIML; it won the Loebner Prize in 2000, 2001, and 2004."
aliases: [ALICE, Alice, "Artificial Linguistic Internet Computer Entity", Alicebot, AIML]
category: chatbots
year: 1995
maker: "Richard S. Wallace and volunteers (A.L.I.C.E. Artificial Intelligence Foundation)"
status: retired
screenshot:
see_also: [eliza, jabberwacky, eugene-goostman, imitation-game, persona, character, system-prompt]
readings: []
experiments: []
updated: 2026-10-19
---

# A.L.I.C.E.

**Richard Wallace's open-source chatbot, begun in 1995, whose replies are tens of thousands of hand-written pattern-and-response rules in AIML; it won the Loebner Prize in 2000, 2001, and 2004.**

## In plain terms

A.L.I.C.E. is ELIZA scaled up. Wallace wrote a markup language, AIML (Artificial Intelligence Markup Language), in which each rule is a `<category>` holding a `<pattern>` (what the user might say) and a `<template>` (the reply). A rule like `DO YOU KNOW WHO * IS` can point to the rule for `WHO IS *`, so many phrasings fall through to one answer. Wallace compared the scale directly: A.L.I.C.E. had "more than 40,000 categories of knowledge, whereas the original ELIZA had only about 200." Volunteers wrote many of them; Wallace counts more than 500 contributors.

The name came by accident. The first prototype was called PNAMBIC ("pay no attention to that man behind the curtain"), "in tribute to the hoaxes, deceptions and tricks that have littered the history of artificial intelligence," but the machine it ran on was already named Alice, so people called the bot Alice, and the acronym was made up afterwards. Wallace wrote that A.L.I.C.E. is "possibly the first A.I. technology to embrace this tradition of deception openly."

## Where it fits

**Rules and persona.** A.L.I.C.E. is the high point of the hand-written chatbot: a persona assembled one rule at a time by hundreds of people, published as free software so anyone could copy the "personality" files and make their own bot. Its AIML files still seed other bots (Pandorabots' Rosie is a fork), and its contest wins set up the argument with learning bots like Jabberwacky.

## See also

[ELIZA](eliza.md) · [Jabberwacky](jabberwacky.md) · [Eugene Goostman](eugene-goostman.md) · [The imitation game](../people-and-texts/imitation-game.md) · [Persona](../persona-and-dialogue/persona.md) · [Character](../persona-and-dialogue/character.md) · [System prompt](../persona-and-dialogue/system-prompt.md)

## Sources

- Richard S. Wallace, ["The Anatomy of A.L.I.C.E."](https://freeshell.de/~chali/programowanie/Anatomy_of_ALICE.pdf) (preprint; published in Epstein, Roberts, and Beber, eds., *Parsing the Turing Test*, Springer, 2009): AIML categories, patterns and templates, the `<srai>` reduction example, 40,000 versus about 200, more than 500 volunteers, PNAMBIC and the "retronym," the first edition written in SETL in 1995, Java from 1998, "Program B" launched 1999 and winning the Loebner Prize in January 2000; the Loebner wins in 2000 and 2001.
- ["Alice chatbot wins for third time,"](http://news.bbc.co.uk/1/hi/technology/3672424.stm) BBC News, 20 September 2004: the third win (2004), work begun in 1995.
- ["The 2001 Loebner Prize Contest,"](https://web.archive.org/web/20150109045048/http://loebner.net/Prizef/2001_Contest/loebner-prize-2001.html) loebner.net (archived): held 13 October 2001 at the London Science Museum; winner Richard Wallace.
- Status: the original alicebot.org domain now hosts an unrelated site (checked 2026-10-19), and the original bot's public chat page could not be confirmed. AIML lives on: Pandorabots' [Rosie](https://github.com/pandorabots/rosie) is "a fork of the ALICE 2.0 project." Whether A.L.I.C.E. itself still answers anywhere is unconfirmed (verify).
