---
term: "Constitutional AI: Harmlessness from AI Feedback (2022)"
slug: constitutional-ai-paper
short: "Anthropic's 2022 paper training a harmless assistant from a written list of principles, with the model critiquing and revising its own replies instead of people labeling harm."
aliases: [Bai et al. 2022, Constitutional AI paper, RLAIF]
category: people-and-texts
see_also: [askell-2021, claudes-constitution, christiano-2017, ../models-and-training/constitutional-ai, ../models-and-training/rlhf, ../persona-and-dialogue/refusal]
readings: []
experiments: [by-hand]
updated: 2026-10-19
---

# Constitutional AI: Harmlessness from AI Feedback (2022)

**Anthropic's 2022 paper training a harmless assistant from a written list of principles, with the model critiquing and revising its own replies instead of people labeling harm.**

## Why it matters here

For a humanities course this is the paper where prose becomes training. "The only human oversight is provided through a list of rules or principles," the authors write, which is why they call it a constitution. The model drafts a reply, critiques it against a principle, revises it, and is fine-tuned on the revisions; then a model, not a person, judges which of two replies is better, and that judgment becomes the reward ("RL from AI Feedback"). The goal was an assistant that is "harmless but non-evasive," one that explains its objections instead of simply refusing. Who writes the principles, and in what words, becomes a question about authorship of a character.

The method has its own entry, [Constitutional AI](../models-and-training/constitutional-ai.md); this one is the paper.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2212.08073v1--constitutional-ai-harmlessness-from-ai-feedback.md)).

## Try it

Column 4 of [building the assistant by hand](/by-hand) is Claude, trained in this line.

## See also

[Askell et al. 2021](askell-2021.md) · [Claude's constitution](claudes-constitution.md) · [Christiano et al. 2017](christiano-2017.md) · [Constitutional AI (method)](../models-and-training/constitutional-ai.md) · [RLHF](../models-and-training/rlhf.md) · [Refusal](../persona-and-dialogue/refusal.md)

## Sources

- Yuntao Bai, Saurav Kadavath, Sandipan Kundu, et al., "Constitutional AI: Harmlessness from AI Feedback," [arXiv:2212.08073](https://arxiv.org/abs/2212.08073) (15 December 2022), abstract quoted.
