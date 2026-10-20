---
task: "M2a"
title: "Thinking about v2 of the story (a design document, no code)"
status: "not started"
owns: "_context/story-v2/"
depends_on: "M (done)"
report: "../reports/M2a-story-v2-design.md"
---
# M2a. Thinking about v2 of the story (a design document, no code)

**M2. Round two: a v2 of the essay, centered on the playable pieces.** Marlon, 2026-10-19, after reading the first draft: "the 'playable' components in the essay are great. I need to center it around them (like gpt-2 and eliza---need much of this, and have to think about how to make it work elegantly)." **Keep the current essay as it is and build a second version beside it** (Marlon: "we can keep the current one and we can try a v2"): `/story` and `content/story/` stay untouched, and v2 lives at `/story-v2` (not `/story/v2`, which the chapter redirect in `app/story/[chapter]/` would catch), with its code in `nextjs/app/story-v2/` and its text in `nextjs/content/story-v2/`. Reuse the first version's prose, components, and demos by copying or importing them, never by editing them.

Marlon's direction for v2, in his words: "we need to simplify and organize around a group of show pieces. I think it would be good to have fewer pull quotes in that section and more demos--or single animations that stay in place longer and have elements or images animate over time so there are fewer disruptive moments (like everytime you enter a new room you forget about where you were, there's surplus cognitive load)." In the first draft the sticky panel changes about 90 times (48 of them quotes), so every few paragraphs the reader walks into a new room. v2 has a handful of show pieces, each holding the screen for a long stretch while the prose scrolls past and things change *within* it: a token appears, a probability bar grows, a screenshot slides in beside the last one, ELIZA's rule lights up, the same question reaches the next model. Quotations move into the prose.

Two tasks, in order: M2a (this one) and then [M2b](M2b-story-v2-build.md).


## The task

Write `_context/story-v2/design.md` for Marlon to read and argue with. It should:
- **Choose the show pieces.** Propose a group of five to eight, each a single stage that persists across a chapter or more, and say what animates within it as the reader scrolls and what the reader can play with. Draw on what's live (ELIZA, the GPT-2 spiral) and what's coming: SmolLM2 base against SmolLM2-Instruct with the chat template revealed (A, D), the temperature and top-k dials (C), a preamble that turns a base model into an assistant (D), the persona-dial switches (E), the layers stacking up around a model (G), the mini-claw's trace and its files (H), the fine-tuned model (I), a tokenizer, the history screenshots as one evolving interface rather than separate images, the ads (Q). Consider a single through-line, such as one question ("Who are you?") put in turn to ELIZA, GPT-2, a base model, an instruct model, and Claude.
- **Map the argument onto them.** Re-outline the essay around the show pieces: which chapters merge, which pull quotes go into the prose or are cut, what each stage shows at its start, middle, and end. Keep the first draft's argument and readings; change the staging.
- **Answer the practical questions:** one model downloaded once and shared across stages (130 MB for GPT-2); what a phone gets; what print gets; reduced motion; how the prose hands off to play and back ("try it", then what you should have noticed); a contract for embeddable demos, so each experiment (C, D, E, G, H) builds its full page at its route and a compact stage for the essay.
- **Look at how others do it**, briefly: a few scrollytelling pieces known for persistent, evolving graphics (for example, explorable explanations, or the long-form visual essays of The Pudding and the NYT), with links, and what to borrow.
- Read first: `_context/orchestration/reports/M-story.md`, the first draft at `/story`, Marlon's framing in The Notebook's `humanities-ai-lab/` (`generation-of-person-essay.md`, `dramaturgy-of-ai-dialogue/`), and the deep research in `_context/research/`.
- Commit the document and stop. Marlon chooses before anything is built.

## When you finish

Write or update [`../reports/M2a-story-v2-design.md`](../reports/M2a-story-v2-design.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
