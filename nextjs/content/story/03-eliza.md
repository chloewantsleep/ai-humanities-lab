---
title: "ELIZA, or the listener"
chapter: 3
years: "1966 – 2016"
description: "A program with no knowledge of the world, a well-chosen role, and a user who supplies the meaning. Fifty years of chatbots written by hand."
year: 1966
label: "ELIZA"
---

# ELIZA, or the listener

In 1966 Joseph Weizenbaum, a computer scientist at MIT, published a paper about a program that could hold a typed conversation. It knew nothing about anything. It was, by design, a trick, and he wrote the paper to show how the trick worked.

```panel
type: demo
demo: eliza
fallback_image: ../history/_images/00b-eliza-chatbot-commons-publicdomain.png
fallback: "An ELIZA conversation in a later reimplementation (Commons, 2021). On the web page this panel is a working ELIZA."
caption: "The DOCTOR script from Weizenbaum's paper, running in your browser. Under each reply is the rule that produced it."
```

Talk to it. This is a working [ELIZA](../glossary/chatbots/eliza.md), rebuilt from the 1966 paper and the original program listing. Under each reply is the rule that made it.

The procedure is short. ELIZA scans your sentence for a keyword ("mother," "always," "I"), matches a pattern, and reassembles your own words into a reply, swapping "my" for "your" on the way. If nothing matches, it says something like "PLEASE GO ON." Weizenbaum stressed that the script "is data," separate from the program. From the start, the character lived in a document the machine read, not in the machine. Every reply is determined: the same sentence gets the same rule every time.

```panel
type: quote
text: "The psychiatric interview is one of the few examples of categorized dyadic natural language communication in which one of the participating pair is free to assume the pose of knowing almost nothing of the real world."
cite: "Weizenbaum, \"ELIZA,\" *Communications of the ACM* 9, no. 1 (1966), p. 42"
href: "https://doi.org/10.1145/365153.365168"
```

The trick begins with a choice of role. The [DOCTOR](../glossary/people-and-texts/doctor-script.md) script plays a therapist who reflects the patient's words back, because a therapist can "assume the pose of knowing almost nothing of the real world." The first chatbot [persona](../glossary/persona-and-dialogue/persona.md) was chosen to hide a lack.

The user does the rest. A person talking to ELIZA protects "his sense of being heard and understood" by attributing to the program "all sorts of background knowledge, insights and reasoning ability. But again, these are the *speaker's* contribution" (p. 42). H. P. Grice named the mechanism in 1975: we assume a partner is following a [Cooperative Principle](../glossary/persona-and-dialogue/cooperative-principle.md), so when a reply seems thin, we work out what it must have meant ([Grice](https://github.com/ll-26-27/eng298ai-20261020/blob/main/readings/course-readings/course-readings-md/grice-1975-logic-and-conversation.md)).

```panel
type: quote
year: 1976
label: "Computer Power and Human Reason"
text: "Once my secretary, who had watched me work on the program for many months and therefore surely knew it to be merely a computer program, started conversing with it. After only a few interchanges with it, she asked me to leave the room."
cite: "Weizenbaum, *Computer Power and Human Reason* (1976), p. 6 (verify against the printed book; wording from a quotation in *Humanist* 36.439)"
href: "https://dhhumanist.org/volume/36/439/"
```

Explaining did not explain it away. Ten years later Weizenbaum told the story that has followed ELIZA ever since: his secretary, who knew exactly what it was, asked him to leave the room so she could talk to it in private. This is the [ELIZA effect](../glossary/persona-and-dialogue/eliza-effect.md). Notice that she was not fooled about what the program was. She wanted a listener, and the role was enough.

For fifty years after, chatbots were mostly built this way, by hand: rules, templates, and a persona, from [PARRY](../glossary/chatbots/parry.md) (1972) to [SmarterChild](../glossary/chatbots/smarterchild.md) (2001) and [Siri](../glossary/chatbots/siri.md) (2011). They were predictable and inspectable, and brittle the moment you stepped outside the script.
