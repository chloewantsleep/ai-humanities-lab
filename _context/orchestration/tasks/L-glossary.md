---
title: "The glossary (tasks L0–L5): shared brief and entry format"
---

# The glossary: shared brief for L0–L5

A large glossary, on the pattern of the one made for William Stafford's SOC-STD 98to workshop (in the mk-27 workbook at `apps/william-stafford/mk-next/_context/glossary/`, 60 entries; read its README and three or four entries before writing). It is the reference layer under the experiments: every term an experiment uses, every chatbot in the history, and the people and texts the course reads. It lives in `nextjs/content/glossary/`, one folder per category, one short Markdown file per entry. Aim for 30 to 60 entries per category; breadth matters more than length.

## The entry format (all categories)

File name: the slug, lowercase with hyphens (`eliza.md`, `base-model.md`). Frontmatter:

```yaml
---
term: "Base model"
slug: base-model
short: "A language model trained only to continue text, before any training to act as an assistant."
aliases: [pretrained model, foundation model]
category: models-and-training
see_also: [pretraining, instruction-tuning, chat-template]   # slugs, any category
readings: [askell-2021]                                      # ids from content/readings/, if any
experiments: [spiral, by-hand]                               # the experiments that show it, if any
updated: 2026-10-19
---
```

Body, in this order:

1. `# Term`, then the `short` line again in bold.
2. `## In plain terms`: one to three short paragraphs with a concrete example. Reuse a small set of running examples across entries so they build on each other: the "Men are all alike" ELIZA exchange, a question put to GPT-2 that spirals, the "Course TF Assistant" built in three products, and Claude Code in a student's repo.
3. `## In the readings` (only where it applies): where a course reading touches the idea, with page or section. The course readings are in the sibling repo `../eng-298ai-context/_context/course-readings/` (Markdown conversions in `course-readings-md/`) and summarized in this repo's `_context/course-readings-summary.md`. The Phaedrus, Frankenstein, R.U.R., Dorian Gray, Grice, and Sacks, Schegloff and Jefferson are all there, and the humanities connections are the point of the course.
4. `## Try it` (only where it applies): which experiment route shows it, as a link.
5. `## See also`: links to the `see_also` entries, by relative path (`../persona-and-dialogue/persona.md`).

Keep entries short: a definition someone can read in a minute. Plain language, no hype, no hard-wrapped lines. Every factual claim (a date, a launch, a number, a quotation) needs a source you actually checked, as a link in the text or a `## Sources` list at the end. Mark anything you couldn't confirm "(verify)". Each category folder gets a `README.md`: a paragraph on what the category covers, then a table of entries (term and gist) in a sensible reading order, like the Stafford README's category tables.

## Rules for the glossary agents

- Stay in your category folder. Cross-category links are fine (by relative path), and a link to an entry that doesn't exist yet is fine too: list such links in your report so the owning agent can fill the gap.
- Before writing a term, check the other folders for it, so the same idea isn't defined twice. If two categories could own it, it goes where the experiments use it most, and the other links to it.
- Commit your folder when done (see the general rules above).
