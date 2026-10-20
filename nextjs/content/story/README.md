---
title: "Who is speaking? A short history of the chatbot"
description: "From Plato's worry about writing that cannot answer back to the agents of 2026: talk to ELIZA, give GPT-2 its first assistant script, and build a poetry Gem from its parts."
status: working
updated: 2026-10-20
---

# Timeline content

The home page (`/`). Its argument: **the helpful assistant is a character that was written, trained, and staged, and it could have been otherwise.** The page opens with a zoom (`app/story/TimelineZoom.jsx`) from 2023–2026, the years the class has just discussed, out to c. 370 BCE – 2026, then starts at Plato.

## Chapters

| File | Chapter | Interactive |
| --- | --- | --- |
| `01-writing-cannot-answer.md` | Phaedrus, Analects, Wilde | |
| `02-made-beings.md` | Frankenstein, R.U.R., Bergson, Turing | |
| `03-eliza.md` | ELIZA | live ELIZA (`demo: eliza`) |
| `04-the-spiral.md` | Markov, Shannon, GPT-2, GPT-3 | live GPT-2 (`demo: spiral`) |
| `05-written-into-a-document.md` | The HHH prompt (Askell et al. 2021) | GPT-2 with and without the HHH prompt (`demo: hhh`); the Gem's head |
| `06-post-training.md` | InstructGPT, Constitutional AI, chat templates | |
| `07-chatgpt.md` | ChatGPT, Grice, Dorian Gray, Sydney | |
| `09-configuration.md` | GPTs, Projects, Gems | knowledge and delivery (`type: knowledge`); the whole Gem; then the builder |
| `10-staged-interiority.md` | Reasoning models | |
| `11-agents.md` | ReAct, harnesses, OpenClaw, Grok Bot, Muse, dots | |
| `12-epilogue.md` | After the Gem: harnesses, for discussion | ELIZA / GPT-2 / harness comparison (`type: compare`) |

The builder (`app/components/BuildABot.jsx`) is inserted after the `configuration` chapter by `app/story/page.jsx`.

## The format

Frontmatter: `title`, `chapter`, `years`, `description`, `year` (moves the timeline; negative for BCE), `label` (a milestone). `hidden: true` leaves a chapter out. Each ```` ```panel ```` block (YAML) starts a step; the Markdown after it is the step's prose. Panel types: `title`, `quote`, `image`, `dialogue` (`lines`, `style`), `continuation`, `stack` (the intervention ladder), `demo` (`eliza`, `spiral`, `hhh`), `gem` (`show: [head, torso, legs]`), `compare` (`columns`, `rows`), `knowledge`, `timeline`.

## Sources

The full first draft (about 14,000 words, by Claude for Marlon, 19 Oct 2026) is in `mk-chatbot-experiments` and in this repository's first commit; this version cuts it to about 4,500 words. Course-text links go to `readings/` in this repository. Recorded GPT-2 samples are in `samples/`. Claims marked "(verify)" have not been checked against the printed source.
