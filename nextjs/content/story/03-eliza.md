---
title: "ELIZA"
chapter: 1
years: "1966"
description: "Match words, select a rule, and assemble a reply."
year: 1966
label: "ELIZA"
---

# ELIZA

Joseph Weizenbaum published [ELIZA](../glossary/chatbots/eliza.md) in 1966. Its DOCTOR script looks for words and sentence patterns, then uses a rule to assemble a reply. The script imitates a therapist who asks the user to explain more. [Read the paper](https://doi.org/10.1145/365153.365168).

```panel
type: demo
demo: eliza
fallback_image: ../history/_images/00b-eliza-chatbot-commons-publicdomain.png
fallback: "An ELIZA conversation in a later implementation. The web version includes a working demonstration."
caption: "Try ELIZA. Each reply shows the rule that produced it."
```

Type a sentence about yourself. Read the rule beneath the reply. Then change one word and try again.

The reply can seem attentive because it repeats your words or asks a relevant question. Inspecting the rule shows how the program produced that effect. Where does the exchange begin to repeat itself?
