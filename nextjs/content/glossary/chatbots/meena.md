---
term: "Meena"
slug: meena
short: "Google's 2.6-billion-parameter open-domain chatbot, described in a January 2020 paper and blog post and never released to the public; it introduced the sensibleness-and-specificity measure that LaMDA inherited."
aliases: [Towards a Human-like Open-Domain Chatbot]
category: chatbots
year: 2020
maker: "Google Research, Brain Team"
status: retired
screenshot:
see_also: [lamda, blenderbot, tay, transformer, language-model, sampling]
readings: []
experiments: []
updated: 2026-10-19
---

# Meena

**Google's 2.6-billion-parameter open-domain chatbot, described in a January 2020 paper and blog post and never released to the public; it introduced the sensibleness-and-specificity measure that LaMDA inherited.**

## In plain terms

Meena was a single neural network trained end to end on 341 GB of text filtered from public social-media conversations, about 8.5 times the data of GPT-2. Its training objective was the one behind every language model: predict the next word (token) of the conversation, given what came before. It was "open-domain": not built for a task such as booking tables, but for chatting about anything.

To measure that, the team asked crowdworkers two questions about each reply: does it make sense in context, and is it specific to this context rather than a safe all-purpose answer such as "I don't know"? The average of the two is the Sensibleness and Specificity Average (SSA). The full Meena scored 79%, against 86% for people and well above the other chatbots tested, including Mitsuku, Cleverbot, and XiaoIce. Google did not let the public talk to it: "we are not currently releasing an external research demo," the blog post said, citing safety and bias.

## Where it fits

**Public presence, withheld.** Meena showed that a large network trained on conversation, with no rules or scripts, could hold a sensible open-ended chat, judged by a measure close to how people judge each other, and then it stayed in the lab, one of several capable chatbots of the years after [Tay](tay.md) that were kept from the public. Google's next step was [LaMDA](lamda.md), whose paper reuses Meena's metric and decoding method and is about 50 times larger.

## See also

[LaMDA](lamda.md) · [BlenderBot](blenderbot.md) · [Tay](tay.md) · [Transformer](../models-and-training/transformer.md) · [Language model](../models-and-training/language-model.md) · [Sampling](../models-and-training/sampling.md)

## Sources

- Daniel Adiwardana and Thang Luong (Google Research), ["Towards a Conversational Agent that Can Chat About…Anything"](https://research.google/blog/towards-a-conversational-agent-that-can-chat-aboutanything/), 28 January 2020 (primary): 2.6 billion parameters, 341 GB of filtered social-media conversation, the comparison with GPT-2, the next-token training objective, the SSA definition and the "I don't know" example, the scores, the bots compared, and the decision not to release a demo.
- Daniel Adiwardana et al., ["Towards a Human-like Open-Domain Chatbot"](https://arxiv.org/abs/2001.09977) (arXiv, 27 January 2020): the paper behind the post.
- Romal Thoppilan et al., ["LaMDA: Language Models for Dialog Applications"](https://arxiv.org/abs/2201.08239) (2022), sections 3 and 4: LaMDA's use of Meena's sample-and-rank decoding and of SSA, and its largest model at about 50 times Meena's parameters.
