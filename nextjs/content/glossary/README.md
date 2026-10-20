---
title: "Glossary"
description: "Plain-language definitions under the chatbot experiments: the chatbots from ELIZA to the 2026 agents, how a model is made, how it becomes someone, what gets wrapped around it, and the people and texts the course reads."
updated: 2026-10-19
---

# Glossary

The reference layer under the chatbot experiments for ENG 298AI, the AI Humanities Lab (Fall 2026). The experiments make an argument about where the assistant came from, from a base model that spirals to an agent with its own computer; this glossary holds the words that argument needs. It is a reference, not required reading: open an entry when a term comes up in an experiment, a reading, or the room.

Each entry is one short file: a one-line definition in bold, "In plain terms" with an example, and, where they apply, where a course reading touches the idea, which experiment shows it, related entries, and sources. Examples come back across entries so they build on each other:

- **"Men are all alike."** The opening of the exchange in Weizenbaum's 1966 ELIZA paper, run by the DOCTOR script ([ELIZA](/eliza)).
- **A question put to GPT-2 that spirals.** A base model asked "Who are you?" doesn't answer; it continues the text, and keeps going ([the GPT-2 experiment](/gpt-2)).
- **The "Course TF Assistant."** The same teaching assistant built three times, as a custom GPT, a Claude project, and a Gem, with the same instructions ([History](../history/README.md), [the layers](/layers)).
- **Claude Code in a student's repo.** An agent that reads the folder's `CLAUDE.md`, loads skills, uses tools, and loops until the task is done ([mini-claw](/mini-claw)).

Every date, launch, number, and quotation links to a source that was checked. Anything that couldn't be confirmed is marked "(verify)".

## Categories

| Category | What it covers |
| --- | --- |
| [Chatbots](chatbots/README.md) | One entry per chatbot or chatbot product, 1966 to 2026, in order, so the list doubles as a timeline. Each says where it fits: rules, persona, post-training, configuration, memory, public presence, agency. |
| [Models and training](models-and-training/README.md) | How a language model is made and how it produces text: tokens, next-token prediction, sampling and temperature, pretraining, the base model, fine-tuning, RLHF, chat templates. |
| [Persona and dialogue](persona-and-dialogue/README.md) | How a model becomes legible as someone: the assistant, the system prompt, roles and turns, Grice's maxims, the ELIZA effect, simulators and "the void", sycophancy and hallucination. |
| [Interfaces and agents](interfaces-and-agents/README.md) | What gets wrapped around the model: the chat interface, memory, custom instructions and projects, retrieval, tools, MCP, skills, the agent loop, the harness, prompt injection. |
| [People and texts](people-and-texts/README.md) | The people and works the experiments and the course return to: Turing, Weizenbaum, Colby, the *Phaedrus*, *Frankenstein*, *R.U.R.*, Grice, Sacks, the Askell et al. paper, "Simulators". |

## For anyone writing entries

The entry format, the rules, and the starting lists for each category are in the task board's shared glossary brief, `_context/orchestration/tasks/L-glossary.md`. In short:

- **One file per entry**, named by its slug (`base-model.md`), in its category's folder. Frontmatter: `term`, `slug`, `short`, `aliases`, `category`, `see_also` (slugs, any category), `readings` (ids below), `experiments` (route names), `updated`. Chatbots add `year`, `maker`, `status`, and `screenshot`.
- **Body:** `# Term`, the `short` line in bold, then `## In plain terms`, and where they apply `## In the readings`, `## Try it`, `## See also`, `## Sources`. Chatbots add `## Where it fits` after "In plain terms".
- **Links between entries** are relative paths to the file: `../persona-and-dialogue/persona.md` from another category, `eliza.md` within one. Experiments are linked by route: `[the GPT-2 experiment](/gpt-2)`.
- **Screenshots** are in `nextjs/content/history/_images/`; from an entry, embed one as `![caption](../../history/_images/<file>.png)`.
- **Each category's `README.md`** has a paragraph on what the category covers, then a table of entries (term and gist) in reading order. Give it `order:` (the category's place in the list above, 1 to 5) and a one-line `description:` in its frontmatter; both show on this page and in the sidebar.

### Reading ids

Use these ids in `readings:` frontmatter. The course readings are in the sibling repo `ll-26-27/eng-298ai-context`, in `_context/course-readings/course-readings-md/` (the file named here) and, for the AI papers, `_context/LL-readings/papers-on-ai-md/`. When citing one in "In the readings", link the file on GitHub, pinned to commit `24df8b8` as in `_context/course-readings-summary.md`, so the entry works outside this checkout. Add a row here if you need a reading that isn't listed.

| id | Reading | File |
| --- | --- | --- |
| `shelley-1818` | Mary Shelley, *Frankenstein* (1818 text) | `shelley-frankenstein-1818.md` |
| `wilde-1891` | Oscar Wilde, *The Picture of Dorian Gray* | `wilde-picture-of-dorian-gray-1891.md` |
| `wilde-intentions` | Oscar Wilde, *Intentions* ("The Critic as Artist") | `wilde-intentions.md` |
| `capek-rur` | Karel Čapek, *R.U.R.* (Selver and Playfair's English version; the Czech is `capek-rur-cs.md`) | `capek-rur.md` |
| `bergson-laughter` | Henri Bergson, *Laughter* | `bergson-laughter.md` |
| `plato-phaedrus` | Plato, *Phaedrus* | `plato-phaedrus.md` |
| `confucius-analects` | Confucius, *Analects* | `confucius-analects-chin.md` |
| `sacks-1974` | Sacks, Schegloff, and Jefferson, "A Simplest Systematics for the Organization of Turn-Taking for Conversation" | `sacks-schegloff-jefferson-1974-turn-taking.md` |
| `grice-1975` | H. P. Grice, "Logic and Conversation" | `grice-1975-logic-and-conversation.md` |
| `shanahan-2023` | Shanahan, McDonell, and Reynolds, "Role Play with Large Language Models" | `papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md` |
| `askell-2021` | Askell et al., "A General Language Assistant as a Laboratory for Alignment" | `papers-on-ai-md/2112.00861v3--a-general-language-assistant-as-a-laboratory-for-alignment.md` |
| `weizenbaum-1966` | Joseph Weizenbaum, "ELIZA" (1966) | not in the course repo |
| `ouyang-2022` | Ouyang et al., "Training language models to follow instructions with human feedback" (InstructGPT) | `papers-on-ai-md/2203.02155v1--training-language-models-to-follow-instructions-with-human-feedback.md` |
| `thoppilan-2022` | Thoppilan et al., "LaMDA: Language Models for Dialog Applications" | `papers-on-ai-md/2201.08239v3--lamda-language-models-for-dialog-applications.md` |
| `bai-2022` | Bai et al., "Constitutional AI: Harmlessness from AI Feedback" | `papers-on-ai-md/2212.08073v1--constitutional-ai-harmlessness-from-ai-feedback.md` |
| `janus-2022` | janus, "Simulators" | not in the course repo |
| `nostalgebraist-2025` | nostalgebraist, "the void" | not in the course repo |
