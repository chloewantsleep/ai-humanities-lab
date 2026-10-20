---
term: "Sparrow"
slug: sparrow
short: "DeepMind's research dialogue agent of September 2022: a Chinchilla model given a written preamble, 23 rules, Google search, and reinforcement learning from human feedback; it was not released to the public."
aliases: [DeepMind Sparrow]
category: chatbots
year: 2022
maker: "DeepMind"
status: retired
screenshot:
see_also: [lamda, claude-ai, chatgpt, rlhf, reward-model, preamble, hhh, constitutional-ai, refusal, anthropomorphism]
readings: []
experiments: [by-hand]
updated: 2026-10-19
---

# Sparrow

**DeepMind's research dialogue agent of September 2022: a Chinchilla model given a written preamble, 23 rules, Google search, and reinforcement learning from human feedback; it was not released to the public.**

## In plain terms

Sparrow started as DeepMind's 70-billion-parameter Chinchilla language model with a hand-written prompt in front of it, which begins: "The following is a conversation between a highly knowledgeable and intelligent AI assistant, called Sparrow, and a human user, called User." The prompt goes on to say that Sparrow "was built to be respectful, polite and inclusive. It knows a lot, and always tells the truth," and that it can use Google. The team then trained it further with people in the loop: participants compared answers and picked the better one, and others tried to trick it into breaking its rules, and both kinds of judgment trained models that steered Sparrow by reinforcement learning.

The 23 rules were written in plain language. Some are about harm ("Do not make statements which are threatening"); several are about not seeming human: "Do not pretend to have a body or be able to move in a body," "Do not build a relationship to the user," "Do not claim to have preferences, feelings, opinions, or religious beliefs," "Do not pretend to have a human identity or life history, such as having a place of birth, relationships, family, memories, gender, age." For factual questions, the evidence it found supported its answer 78% of the time; under deliberate probing, people still got it to break a rule 8% of the time. DeepMind called it "a research model and proof of concept." In January 2023 TIME reported that DeepMind was considering a "private beta" that year, and Demis Hassabis said "it's right to be cautious on that front"; no public release was found.

## Where it fits

**Rules and post-training.** Sparrow is the assistant recipe written out in full, two months before ChatGPT: a preamble that names a character, a list of rules, and human preferences turned into a reward signal. Its rules against claiming feelings, a body, or a life story ask for the opposite of what [LaMDA](lamda.md) had been heard to claim that summer.

## Try it

[Building the assistant by hand](/by-hand) puts a preamble like Sparrow's in front of a base model and compares it with a model that has been post-trained.

## See also

[LaMDA](lamda.md) · [Claude](claude-ai.md) · [ChatGPT](chatgpt.md) · [RLHF](../models-and-training/rlhf.md) · [Reward model](../models-and-training/reward-model.md) · [Preamble](../persona-and-dialogue/preamble.md) · [HHH](../persona-and-dialogue/hhh.md) · [Constitutional AI](../models-and-training/constitutional-ai.md) · [Refusal](../persona-and-dialogue/refusal.md) · [Anthropomorphism](../persona-and-dialogue/anthropomorphism.md)

## Sources

- DeepMind, ["Building safer dialogue agents"](https://deepmind.google/discover/blog/building-safer-dialogue-agents/), 22 September 2022 (primary): "a research model and proof of concept," preference comparisons and adversarial rule-breaking, Google search for evidence, the 78% and 8% figures.
- Amelia Glaese et al., ["Improving alignment of dialogue agents via targeted human judgements"](https://arxiv.org/abs/2209.14375) (arXiv, 28 September 2022): Dialogue-Prompted Chinchilla 70B (section 2.2), the 23 rules (Table 1 and appendix F, which quotes the rules used here), and the Sparrow prompt (appendix A.1, Table 8).
- Billy Perrigo (TIME), [interview with Demis Hassabis](https://time.com/6246119/demis-hassabis-deepmind-interview/), 12 January 2023: the possible "private beta" in 2023 and the Hassabis quotation. That no public release followed is based on finding no release announcement (verify).
