---
title: Knowledge and voice
description: "One question, four answers: change the files, change the voice, and inspect what each change does."
route: /knowledge-voice
status: working
group: "Under the hood"
order: 4
---

## What was asked

Marlon asked for a way to “play up content versus form”: compare what supplied texts give a chatbot to know with the voice its instructions ask it to perform. The task brief requests a 2×2 comparison, exact prompts, literary persona presets, and a student-written voice.

## What is built

Choose one course text, one question, and one voice. **Prepare the comparison** retrieves up to three keyword-matching passages from the existing course-text index. The two files conditions get the same passages. The two persona conditions get the same voice instructions. All four start without conversation history and share the same answer-length and evidence instructions.

Inspect the passages and each card’s **Show the prompt**, then **Ask Claude in all four cells**. The answers use the shared chat endpoint; the prompt toggle also identifies the model confirmed by the server. Without the server’s OpenRouter key you can still prepare and inspect the comparison; the page explains why answers are unavailable. **Stop all** interrupts the requests. A repeated comparison replaces the answers. Editing setup fields does not alter a prepared comparison until you prepare it again.

The optional fifth condition puts the same found passages into a **voice examples** block, with no retrieved evidence and no named persona. It asks the model to infer diction, syntax, rhythm, and stance rather than use the passages as factual support. The text is still present: instructions cannot guarantee that its facts have no influence. If there are no keyword matches, this extra condition is omitted. The passages may include a narrator and multiple speakers; the resulting voice is not necessarily one character’s voice.

The creature, Lord Henry, and Socrates presets are agent-written rehearsal directions, not quotations, authenticated character models, or a test of historical fidelity. Choose **A voice I write** to supply your own instructions.

## What to look for

Compare across a row for the effects of supplied passages; compare down a column for the effects of the voice instructions. Note changes in claims, cited evidence, syntax, stance, and who seems to be speaking. Try a question unrelated to the chosen text, too.

The distinction is an investigation. Files can carry a voice, instructions can affect claims, and a model without supplied files still has knowledge from training. Different samples can vary even when nothing else changes. A BM25 score measures matching words, not whether a passage supports an answer. See [retrieval](/retrieval) to compare keyword and embedding search.

## Open questions

- Do the selected passages answer the question, or merely share its words?
- Can a persona change which evidence gets emphasized or ignored?
- How much does a fresh sample change the answer without any change of condition?
- How does this change with semantic retrieval rather than matching words?
- Classroom use and systematic comparisons across voices remain to be checked. A live five-cell comparison has worked; that does not establish a general effect.

## How this was made

Built by Codex on October 20, 2026, for task Y. Thread: `01a158f2-d011-7c53-a5de-f43a5bfa592b`, started in `/Users/mk/Development/mk-27/apps/the-notebook`. Marlon asked for a first version committed early, then improvements, importing from `nextjs/lib/retrieval/` without editing it. The first four-cell version was committed as `2118f59`, then the fifth condition and server-confirmed prompt information were added. This prototype reuses retrieval helpers and the shared chat route. A live five-cell run returned answers. Semantic retrieval, a controlled sampling study, and classroom evaluation are unfinished.
