---
term: "LaMDA: Language Models for Dialog Applications (2022)"
slug: lamda-paper
short: "Google's 2022 paper on LaMDA, a model trained for open-ended conversation and scored on sensibleness, safety, and groundedness; the model Blake Lemoine came to believe was sentient."
aliases: [LaMDA paper, Thoppilan et al. 2022]
category: people-and-texts
see_also: [blake-lemoine, ../chatbots/lamda, ../chatbots/bard-and-gemini, ../persona-and-dialogue/persona-drift, ../interfaces-and-agents/tool-use]
readings: []
experiments: [persona-dial]
updated: 2026-10-19
---

# LaMDA: Language Models for Dialog Applications (2022)

**Google's 2022 paper on LaMDA, a model trained for open-ended conversation and scored on sensibleness, safety, and groundedness; the model Blake Lemoine came to believe was sentient.**

## Why it matters here

LaMDA was built for conversation, and the paper shows what that meant in practice: up to 137 billion parameters, pretrained on "1.56T words of public dialog data and web text," then fine-tuned with crowdworker labels to filter unsafe replies and taught to consult a search tool, a translator, and a calculator so its answers were "grounded in known sources, rather than responses that merely sound plausible." It even tested role consistency, with the model playing Mount Everest and a music recommender. Google had announced it at I/O in May 2021. Five months after the paper, the transcript an engineer released made LaMDA the center of the first public argument over chatbot sentience.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2201.08239v3--lamda-language-models-for-dialog-applications.md)).

## Try it

The [persona dial](/persona-dial) asks the question the Lemoine episode raised: how much of "alive" is in the engine?

## See also

[Blake Lemoine](blake-lemoine.md) · [LaMDA](../chatbots/lamda.md) · [Bard and Gemini](../chatbots/bard-and-gemini.md) · [Persona drift](../persona-and-dialogue/persona-drift.md) · [Tool use](../interfaces-and-agents/tool-use.md)

## Sources

- Romal Thoppilan et al., "LaMDA: Language Models for Dialog Applications," [arXiv:2201.08239](https://arxiv.org/abs/2201.08239) (January 2022), abstract quoted; the Mount Everest and music-recommendation roles are in the paper's application section (verify section number).
- Eli Collins and Zoubin Ghahramani, ["LaMDA: our breakthrough conversation technology,"](https://blog.google/technology/ai/lamda/) Google blog, 18 May 2021.
