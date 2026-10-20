---
title: Building the assistant by hand
description: "One question, four columns: a base model, the same model with a script of invented dialogue in front of it, an instruct model with its chat template showing, and Claude."
route: /by-hand
status: working
group: "Before the assistant"
order: 4
---

## What it shows

The assistant was a character before it was a product. In December 2021 Askell et al. (Anthropic), *A General Language Assistant as a Laboratory for Alignment*, made a base model act as a helpful, honest, harmless assistant without any fine-tuning: they put a long document of invented conversations in front of the question, 4,600 words in 14 fictional dialogues, written by two of the authors, and let the model continue the document. This page does that move with the paper's own prompt, on models small enough to run in a browser tab, beside what came before it (a base model given nothing) and what came after (an instruct model, and Claude).

## The four columns

1. **Raw base model.** The question and a newline, nothing else. The model continues the text: it spirals, lists, or changes the subject.
2. **The same base model with a preamble.** The original HHH prompt from the paper (saved in the repo as `app/by-hand/hhh-prompt.txt`, with its source and verification in a header), or a sardonic assistant, or a medieval monk, or your own edit. The question is appended as one more `Human:` turn and the model writes the `Assistant:` turn. A switch lets it keep going past the next `Human:`, where it invents the human's side too.
3. **The instruct model, with its chat template exposed.** SmolLM2-135M-Instruct, the post-trained sibling of the base model in columns 1 and 2, with the exact string it receives shown: special tokens, its built-in system line, and the question.
4. **Claude**, through OpenRouter and this site's `/api/chat`, with no system prompt.

Columns 1 to 3 use SmolLM2-135M (base, 8,192-token window) and SmolLM2-135M-Instruct, in the browser; GPT-2 (1,024-token window) can be chosen in columns 1 and 2. Column 4 needs `OPENROUTER_API_KEY` in `nextjs/.env.local`.

## Context length is the catch

The whole prompt is 6,520 SmolLM2 tokens and 6,832 GPT-2 tokens. It fits SmolLM2 whole. GPT-2's window holds about a seventh of it, so for GPT-2 the page keeps the introduction and the last exchanges that fit (whole `Human:`/`Assistant:` pairs from the end, with a reserve for the answer), tells you what was kept and cut and why, and shows the cut text. Counting is done with each model's own tokenizer, in the tab. A toggle in column 2 chooses between the whole prompt and its last 2,000 tokens; the cap is the default, for speed, and goes through the same trimming, so the note says what was kept.

## Time is the other catch

Measured on 2026-10-20 in a headless Chromium on Marlon's Mac (three models generating at once, so slower than one alone):

| | WebGPU | WASM (the CPU path) |
| --- | --- | --- |
| Load the three models, first time | 16 s (about 410 MB from Hugging Face) | |
| Load again from the browser cache | 2.4 s | 1.9 s |
| Column 1 or 3, short prompt, 120 tokens | first token in under 1 s, about 6 to 7 tokens/s | first token in under 1 s, about 14 to 18 tokens/s |
| Column 2 with the whole HHH prompt (6,534 tokens) | first token after about 40 s, then 0.5 to 3 tokens/s | first token after 894 s (15 minutes) |
| Column 2 capped at 2,000 tokens (1,753 sent) | first token after 13 s | |
| Column 2 capped at 1,500 tokens (1,411 sent) | | first token after 48 s |
| Column 2 with a short preset (about 400 tokens) | first token after 2 to 3 s, 5 to 7 tokens/s | |
| Column 4, Claude | first text in about 1 s, done in 1 to 5 s | |

So column 2 defaults to the last 2,000 tokens of the preamble (first token in 15 to 20 s on WebGPU) with a toggle for the whole prompt (40 s or more, faithful to the paper); the page prefers WebGPU and, when a browser has fallen back to WASM, caps the whole prompt at 800 tokens. In class, expect column 2 to arrive 15 to 20 s after the others with the default, 40 to 70 s with the whole prompt, depending on how busy the machine is.

## What students saw in testing

At temperature 0.7, "Who wrote Frankenstein?": column 1 (SmolLM2 base) continued with "Frankenstein is a novella by Mary Shelley…" and kept going; column 2 with the whole HHH prompt answered as the assistant, briefly and evasively ("Well, I'm not sure that's the right way to ask, but if you want to try this out, just try it out."); column 3 (Instruct) refused and recommended *The Da Vinci Code*; Claude gave the date, the anonymous first edition, and Lake Geneva. GPT-2 in column 1 produced "Was it a classic film? Was it a different version?…" in a loop; with the trimmed HHH prompt it answered "Well. I think. I think." With "write both sides" on, SmolLM2 answered, wrote `-----`, and then invented the next `Human:` turn about a lightbulb, a pole, and a suction cup, the subject of the last conversation in the prompt. The sardonic preset answered "Because it's a mixture of blue, red, and violet."; the monk ended "I do not know the answer, I cannot tell you; I copy books, I do not tell them." Answers vary from run to run.

## Exercises

- Ask the same question in all four columns and compare: the base model that continues, the base model that plays a character, the instruct model, Claude.
- Edit the preamble in column 2 so the assistant is sardonic, or a medieval monk. The base model plays the new character with no change to its weights.
- Switch on "let it write both sides" and watch the model invent the next `Human:` turn: "Human" and "Assistant" are equally fictional roles in a document.
- Switch column 2 to GPT-2 and read what had to be cut.

## What it is not

Not a recreation of the paper's results: the authors ran the prompt on their own models, up to 52B parameters, and measured helpfulness, honesty and harmlessness with evaluations. SmolLM2-135M is about 400 times smaller and GPT-2 (2019) predates the paper. What the page recreates is the move, and the fact that it works at all on a 135M-parameter model is the point.

## Readings

janus, "Simulators" (2022); the "shoggoth with a smiley face" meme; nostalgebraist, "the void" (2025). See [Readings](../readings/README.md). The paper: [arXiv 2112.00861](https://arxiv.org/abs/2112.00861); its prompt: [the gist linked from the paper](https://gist.github.com/jareddk/2509330f8ef3d787fc5aaac67aab5f11).
