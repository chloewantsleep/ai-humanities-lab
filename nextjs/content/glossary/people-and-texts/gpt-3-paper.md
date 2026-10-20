---
term: "GPT-3 and \"Language Models are Few-Shot Learners\" (2020)"
slug: gpt-3-paper
short: "OpenAI's 2020 paper showing that a large enough base model (175 billion parameters) can do new tasks from a few examples in the prompt: the prompt as the interface."
aliases: [GPT-3, Brown et al. 2020, few-shot learners, in-context learning]
category: people-and-texts
see_also: [gpt-2-paper, askell-2021, instructgpt, ../persona-and-dialogue/few-shot-prompting, ../persona-and-dialogue/preamble, ../models-and-training/base-model, ../models-and-training/in-context-learning]
readings: []
experiments: [by-hand]
updated: 2026-10-19
---

# GPT-3 and "Language Models are Few-Shot Learners" (2020)

**OpenAI's 2020 paper showing that a large enough base model (175 billion parameters) can do new tasks from a few examples in the prompt: the prompt as the interface.**

## Why it matters here

GPT-3 was still a base model, but big enough that writing the start of a document was a way of programming it: give it three question-and-answer pairs and it answers the fourth. That is the move behind the assistant. Before any chat training, the way to get a conversation out of a base model was to write the beginning of a transcript of one, which is exactly what column 2 of [building the assistant by hand](/by-hand) does and what Askell et al. did at scale. The paper also reported that people had difficulty telling its generated news articles from human-written ones.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2005.14165v4--language-models-are-few-shot-learners.md)); the collection notes say it "made in-context learning visible as a powerful general interface."

## Try it

Column 2 of [building the assistant by hand](/by-hand): a few written exchanges in front of a base model.

## See also

[GPT-2 paper](gpt-2-paper.md) · [Askell et al. 2021](askell-2021.md) · [InstructGPT](instructgpt.md) · [Few-shot prompting](../persona-and-dialogue/few-shot-prompting.md) · [Preamble](../persona-and-dialogue/preamble.md) · [Base model](../models-and-training/base-model.md) · [In-context learning](../models-and-training/in-context-learning.md)

## Sources

- Tom B. Brown et al., "Language Models are Few-Shot Learners," NeurIPS 2020 ([proceedings](https://proceedings.neurips.cc/paper/2020/hash/1457c0d6bfcb4967418bfb8ac142f64a-Abstract.html)); [arXiv:2005.14165](https://arxiv.org/abs/2005.14165): 175 billion parameters, tasks "specified purely via text interaction with the model," and news articles "which human evaluators have difficulty distinguishing from articles written by humans" (abstract).
