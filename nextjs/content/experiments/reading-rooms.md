---
title: Reading rooms
description: "One move from a reading, made tangible. Challenge an inscription, move a conversation, or describe a role from two perspectives."
route: /reading-rooms
status: working
group: "Readings"
order: 1
---

## What was asked

Marlon asked for an appropriate interaction for every reading so far; a character chatbot was one possible form. Task X calls for a design document first, then two small rooms that work without an API key where possible.

## What was built

The design document in `_context/reading-rooms/design.md` proposes two interactions and a recommendation for each of eleven readings, including recommended and further reading. Three rooms are built:

- [The unvarying answer](/reading-rooms/phaedrus), grounded in Plato's *Phaedrus* 274c–276a. Ask different questions of a fixed written claim, then write your own responses. The inscription repeats exactly; the human response is yours to compose.
- [Who speaks next?](/reading-rooms/turn-taking), grounded in Sacks, Schegloff and Jefferson's turn-allocation rules. Choose whether Ari selects Bea or Cam, someone self-selects, Ari continues, or nobody speaks. Move the next onset to expose overlap or silence, then flatten the same words into chat bubbles.

- [Describe the same turn twice](/reading-rooms/shanahan), for Shanahan, McDonell and Reynolds. Annotate one invented exchange as character behavior, reveal an authored role cue, and describe the same turn as a context-shaped continuation. The dialogue is a teaching example, not a recorded model run.

The three core exercises run with authored React state and need no model. Shanahan also includes an optional live branching panel: explicitly load GPT-2, then compare two role cues with a fixed dialogue prefix. Only this panel downloads model assets (about 130 MB previously measured, plus runtime files) and runs inference locally. Nothing is sent to `/api/chat`. Inputs live only in page state and disappear on navigation or reload. Each room points readers back to its source rather than grading their interpretation.

## How to use them

Open [Reading rooms](/reading-rooms) and choose a room.

In **Phaedrus**, select a suggested objection or write your own, then press **Ask the inscription**. Ask again with a different objection. Compare the unchanged claim with the response you write below each encounter. The invented teaching claim is labeled separately from the public-domain Jowett quotation ([source](https://www.gutenberg.org/ebooks/1636)).

In **Who speaks next?**, start with **Overlap** and **Leave a gap**. Toggle **Flatten into chat bubbles** to see the timing disappear. Change **Does Ari select someone?** to **No one is selected** to enable self-selection. Choose **Nobody self-selects** to enable Ari's continuation checkbox; uncheck it to leave the floor open. The rule explanation changes with your choices. **Reset room** restores the initial state in either room.

The turn-taking paper is paraphrased and cited, with invented dialogue and timings: Sacks, Schegloff and Jefferson, *Language* 50(4), 1974, pp. 696–735, especially section 3.3 ([paper PDF](https://www.cs.columbia.edu/~julia/cs4706/Sacks_et_al_1974.pdf)). The marked completion point is an explicit teaching assumption. The room does not infer it from punctuation or analyze recorded speech.

In **Shanahan**, write a character account, reveal the cue, then write a continuation account. The page places your descriptions together. Identify a claim that would need more evidence, and optionally reveal two sample descriptions. **Reset annotations** clears the exercise. The [paper](https://arxiv.org/html/2305.16367v1) is paraphrased only. For **Branch the role**, load GPT-2, edit the two cues, and press **Compare continuations**. Runs use one worker sequentially and keep exact prompt snapshots beside their outputs. Try identical cues at temperature 0 as a control; optional sampling adds randomness. **Stop comparison** keeps partial output and skips remaining branches. **Reset branches** clears the comparison without clearing your annotations.

## What was checked

Browser checks against the shared dev server covered the index and both rooms, whitespace rejection, identical inscription answers, independent reader replies, reset, turn-allocation priority, self-selection, continuation, silence, slider limits, timing arithmetic, and switching between timing lanes and bubbles. Keyboard controls and 390-pixel layouts were checked, and desktop/mobile screenshots inspected. The existing test suite passed (25 tests at the time of this check). Shanahan option A passed annotation, reveal, comparison, sample-toggle, reset, keyboard-focus, and 390-pixel layout checks. Shanahan option B was run live with GPT-2 q8/WASM: both branches produced text, identical cues at temperature 0 produced identical output in the test, cancellation skipped the second branch, and reset/whitespace/stale-snapshot behavior passed. Desktop and 390-pixel views were inspected. No classroom use or production build was tested.

## Decisions and open questions

The first two rooms prioritize a specific textual move over a convincing chatbot persona. The analogy between responsive software and Plato's account of knowledgeable discourse remains open. Turn-taking uses a single possible next starter and fixed durations; simultaneous self-selection, repair, and recorded speech are not modeled. A measured gap is not by itself an interpretation of silence. Marlon chose Shanahan as the third reading. Should reader annotations be exportable? No persistence or scoring has been added.

## How this was made

Codex, October 20, 2026, task X. Thread: `01a158f2-d2d0-7f00-9449-72d4a8f701ea`. Started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `codex resume 01a158f2-d2d0-7f00-9449-72d4a8f701ea` from that directory. Marlon asked for the design first, then two rooms committed separately. The design was committed before code, and the rooms were browser-checked before their individual commits. They use authored interactions, with source passages and inventions kept distinct. Marlon subsequently selected Shanahan, now the third room, with both the annotation exercise and live browser-model branches. The remaining eight readings have candidate designs only; classroom validation and richer conversation timing remain unfinished.

Shanahan follow-up: Codex thread `01a1593c-6bf2-7091-a9f3-eaf6070de5c5`, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `codex resume 01a1593c-6bf2-7091-a9f3-eaf6070de5c5` from that directory. This follow-up built options A and B and updated the existing report. The original two-room thread is retained above for provenance.
