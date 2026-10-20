---
title: Tics
description: "Inspect repeated rhetorical moves, compare passages, and read Bergson alongside them."
route: /tics
status: working
group: "Readings"
order: 2
---

## What was asked

Marlon observed that language models overuse writing moves he once taught: antithesis and heightened binary oppositions. The brief asked for a paste-in pattern finder, public-domain comparisons, and a Bergson panel. It explicitly kept this observation separate from Bergson’s account of the comic and from a proposed explanation involving reward optimization.

## What was built

Choose Bergson or Shelley, or paste text into either of two independent slots. Record provenance for your own text. Six rules flag possible antitheses, triads, em-dash pivots, watch-list vocabulary, immediately answered questions, and summary cues. The legend gives raw counts and matches per 1,000 words. Expand “Compare all four slots” for a table of normalized rates. Read highlights and expand the complete match list to judge false positives. Editing a built-in sample changes only this page’s copy. Nothing is saved after reload or sent to a model.

Bergson’s sample comes from Chapter I of *Laughter*, in the local retrieval corpus; Shelley’s comes from the preface to *Frankenstein*. Source links accompany both. No generated model sample is presented as measured evidence.

## Questions and limitations

Rules measure character patterns rather than rhetorical function. A dash can mark an interruption; a comma list can contain more than three items; a statement after a question may not answer it. Summary cues can occur in the middle of a passage. Counts overlap and short passages yield unstable rates. English-only word counting treats apostrophe words as one and hyphenated words as separate. Neither human nor model authorship follows from these marks. The optional live-generation button is unfinished; the core needs no key.

## How this was made

Codex, October 20, 2026. Thread `01a158f2-d04e-7232-bc40-7c910479d1df`, started in `/Users/mk/Development/mk-27/apps/the-notebook`. Marlon asked for task Z, an early committed working version, refinement, and separate treatment of observation, Bergson, and causation. This prototype uses transparent regular expressions and existing public-domain retrieval passages. Four detector tests and the existing 14-test suite pass. Both JSX components compile with the installed Next SWC. The shared localhost server and native Chrome render the route and initial Bergson results successfully. The passage menu exposes all four slots. Full interaction, responsive visual QA, and classroom review remain unchecked.
