---
title: "Reading rooms — interaction design"
author: Codex
status: "Agent proposals; first two selected for prototyping"
date: 2026-10-20
task: X
thread_id: "01a158f2-d2d0-7f00-9449-72d4a8f701ea"
followup_thread_id: "01a1593c-6bf2-7091-a9f3-eaf6070de5c5"
followup_resume: "codex resume 01a1593c-6bf2-7091-a9f3-eaf6070de5c5"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158f2-d2d0-7f00-9449-72d4a8f701ea"
---

# Reading rooms

These are Codex's proposals in response to task X, not additional statements of Marlon's intentions. The brief asks for an interaction for each reading through October 20, with a custom chatbot as one possible form. The source syllabus distinguishes required, recommended, and further reading; this design keeps all three visible.

## Design principle and first builds

Start with a move a reader can perform: challenge, withhold, compare, interrupt, select, or reinterpret. Make that move change something visible. Give each room its own URL, a specific passage reference, a visible account of its mechanism, and a question the mechanism leaves unresolved.

Build **Phaedrus: the unvarying answer** and **Sacks, Schegloff and Jefferson: who speaks next?** first. Both work with no model, no key, and no download. The first turns the text's description of writing into an interface limitation. The second exposes timing and turn allocation that a chat transcript usually conceals. They are deliberately small authored demonstrations, not claims to reproduce a philosophical dialogue or a complete theory of conversation.

Marlon's October 19 canvas separates his additions from Opus's suggestions; the Bergson connection below comes from the explicitly labeled MK additions. His ideas document's section “Dialogue is not only alternation between two speakers” motivates making pace visible. These documents were consulted as planning sources, not as verification for historical claims.

## Candidates by reading

### Shelley, Frankenstein — required chapters 10–15

Anchor: the creature learns by watching the De Laceys and overhearing Felix teach Safie; Volney's history and the found books enlarge and disturb his understanding. The local 1818 edition uses volume/chapter divisions; locate the cottage, Safie's lessons, and the portmanteau episode rather than assuming its numbering equals the syllabus's continuous numbering.

- **A. Through the wall:** reveal one overheard passage at a time. A reader tags which claims the creature could support from the revealed evidence and which go beyond it. Needs **no model**; optional Claude via `/api/chat` could propose answers whose evidence the reader audits.
- **B. A changing shelf:** add Volney, Werter, Plutarch, or Milton to a visible context packet and compare the same question about belonging. Needs **Claude through `/api/chat`**, curated public-domain extracts, and explicit labels that the model has prior knowledge beyond the packet. A browser model could illustrate continuation but cannot honestly be described as knowing only what it overheard.

**Recommend A:** withholding evidence is enforceable; withholding a pretrained model's knowledge is not. Keep language acquisition distinct from retrieving a passage.

### Wilde, The Picture of Dorian Gray — required

Anchor: chapter 7's changed mouth after Sibyl's rejection; chapter 20's attempted good deed and the portrait's apparent hypocrisy.

- **A. The portrait's ledger:** choose a public account of one scene, then reveal the portrait's textual description and record what the account omitted. A reader, not a moral scoring algorithm, decides whether the discrepancy is cruelty, vanity, hypocrisy, or something else. Needs **no model**.
- **B. Two audiences:** write the same invented confession for Lord Henry and Basil; compare two responses with passage-based instructions and a visible prompt. Needs **Claude through `/api/chat`**; all generated dialogue labeled as invention.

**Recommend A:** preserves the portrait's resistance to Dorian's own explanation without pretending to compute virtue.

### Wilde, The Critic as Artist — recommended

Anchor: Part I, Gilbert's argument that criticism is creative and records the critic's own impressions, challenged by Ernest.

- **A. The critic's mirror:** hold an artwork description constant while readers switch between two authored critical responses, then mark what belongs to the object and what the critic adds. Needs **no model**.
- **B. Creation within creation:** the reader writes a criticism; a model makes a second work from that criticism, with source, criticism, and transformation beside one another. Needs **Claude through `/api/chat`**.

**Recommend A:** a small annotation tool makes interpretive additions inspectable without settling the dialogue in Gilbert's favor.

### Čapek, R.U.R. — required

Anchor: Domin's opening account of young Rossum stripping away what does not contribute to work; Gall's discussion of pain nerves.

- **A. The factory specification:** select traits to remove from a fictional worker specification; reveal the corresponding tensions in Domin's and Gall's accounts. Needs **no model**. Consequences must be authored interpretive possibilities, never measurements of productivity or personhood.
- **B. Who counts as a speaker?:** hide character labels on short exchanges, classify the evidence for personhood, then reveal the labels and revisit the judgment. Needs **no model**, checked public-domain translation.

**Recommend A:** the act of simplifying a worker is more text-specific than another robot chat. Coordinate with W's Rosie/Roomba contrast before building it.

### Bergson, Laughter — recommended

Anchor: chapter I's absent-minded runner and habitual movements continuing after circumstances change.

- **A. A habit out of place:** keep an authored response pattern constant while changing its occasion; readers mark the moment it becomes mechanical or comic. Needs **no model**.
- **B. Repetition bench:** give a browser model several different prompts, highlight recurring phrases, and ask whether recurrence is comic, useful, or merely conventional. Needs **browser model** and a warning that phrase counts do not test Bergson's theory.

**Recommend A:** isolates rigidity in a changing situation. Task Z owns the broader model-tics experiment; link to it rather than duplicate it.

### Nina Beguš, Artificial Humanities — further reading

Anchor: the introduction, “The Pygmalion Myth in Technology,” especially its opening argument about fictional scripts shaping the imagination and development of humanlike AI. No assigned chapter or local full book was found; this recommendation is scoped to the checked introduction, not a claim about the entire book.

- **A. Rewrite the maker's brief:** annotate an invented AI product brief for creator, creature, desired relationship, and whose wishes govern the design; revise it from the created being's perspective. Needs **no model**.
- **B. Change the inherited story:** keep an invented technical capability constant but frame it through two different fictional relationships; compare what expectations change. Needs **no model**; optional **Claude through `/api/chat`** could draft alternative briefs for reader critique.

**Recommend A:** it makes a narrative assumption into a revisable design choice. Source: [Beguš's introduction, pp. 1–2](https://haas.berkeley.edu/wp-content/uploads/2025.10.01_Begus_Intro_Artificial-Humanities-1.pdf). Paraphrase only.

### Plato, Phaedrus — required, especially 257c onward

Anchor: 274c–275b, Theuth's promise and Thamus's objection; 275d–276a, writing that repeats itself and the contrasting account of discourse able to answer and defend itself.

- **A. The unvarying answer:** put different objections to one fixed written claim; every submission returns precisely the same claim. Beside it, the reader can compose a reply that addresses the objection. Needs **no model**.
- **B. Who is the listener?:** select a novice, an expert, or a hostile listener and revise one explanation for each, drawing on the discussion of fitting speech to souls at 271d–272b. Needs **no model** for reader-authored versions; **Claude through `/api/chat`** for comparison drafts.

**Recommend and build A:** repetitions should be visible together, with the source passage available. The human reply is an exercise in responsiveness, not a simulation of Plato's living discourse. A chatbot that varies its replies would not by itself settle the dialogue's account of knowledge.

### Confucius, Analects — recommended

Anchor: 11.22, contrasting advice to Zilu and Ran You and the explanation addressed to Gongxi Hua.

- **A. Same question, different pupil:** initially hide the pupil context, compare the contrasting advice, then reveal the differing dispositions and revise an explanation of the apparent inconsistency. Needs **no model**.
- **B. Restore the occasion:** pair a detached maxim with several possible occasions; readers choose and defend a fit, then compare to the textual episode. Needs **no model**, optional **Claude through `/api/chat`** for counterarguments.

**Recommend A:** an exact episode tests the limits of a universal assistant answer. The local Annping Chin translation is modern and copyrighted: paraphrase it, or separately verify a public-domain translation before quoting.

### Sacks, Schegloff and Jefferson, turn-taking — required

Anchor: section 3.3's ordered allocation rules; sections 3.4 and 4's account of possible completion points, overlap, and discontinuities. The local course scan is a reprint with different pagination; cite section 3.3 as well as the original publication, Language 50(4), 1974, pp. 696–735.

- **A. Who speaks next?:** a three-speaker invented transcript has a marked possible completion point. Choose whether the current speaker selects a next speaker, whether someone self-selects, or whether the current speaker continues. Move the next onset to show a gap, a boundary meeting, or overlap. Needs **no model**.
- **B. Flatten the conversation:** toggle between a timed transcript and alternating chat bubbles; note which overlaps and silences disappear. Needs **no model**, ideally later with a consented audio recording and checked transcript.

**Recommend and build A:** it pairs an inspectable rule with visible timing. Use invented dialogue, paraphrase the paper, and distinguish a geometric gap from the social interpretation of silence. The marked completion point is a teaching assumption, not an automatic linguistic inference. Source: [paper](https://www.cs.columbia.edu/~julia/cs4706/Sacks_et_al_1974.pdf).

### Grice, Logic and Conversation — required

Anchor: the four categories of maxims and the distinction between quietly violating a maxim and conspicuously flouting one to invite an inference (1975, pp. 45–50).

- **A. What did you infer?:** choose an authored answer that is too sparse, irrelevant, implausibly enthusiastic, or obscure; record what it suggests, then reveal a context in which that inference changes. Needs **no model**. Do not equate every breach with an implicature.
- **B. The maxim mixer:** a model replies to the same invented request under different maxim constraints; the reader classifies and challenges the result. Needs **Claude through `/api/chat`**; controls are requests, not guarantees.

**Recommend A:** reader inference, context, and disagreement stay visible. Use original examples and paraphrase the paper; do not publish its sample exchanges.

### Shanahan, McDonell and Reynolds, Role Play with Large Language Models — required today

Anchor: the paper's role-play framing of apparent deception and self-awareness; its distinction between simulated roles and the system generating them.

- **A. Describe the same turn twice:** take an invented exchange and annotate it first as character behavior, then as a continuation generated under a role prompt; reveal the authored prompt without presenting it as an inner self. Needs **no model**, with explicit labels that the exchange is a teaching example.
- **B. Branch the role:** hold a dialogue prefix constant, alter the role cue, and generate several continuations in parallel columns. Needs **browser model**; larger **Claude through `/api/chat`** optional. Variation demonstrates prompt sensitivity, not a direct inspection of an internal simulator.

**Recommend A:** makes the explanatory choice explicit without dependence on convincing generations. The local Markdown is only an abstract/metadata sidecar, not the full paper. Checked abstract and publisher account: [arXiv](https://arxiv.org/abs/2305.16367) and [Nature](https://doi.org/10.1038/s41586-023-06647-8). Paraphrase only.

## Sources and boundaries

The syllabus and literary anchors were checked in the sibling course repository's `_context/course-readings/` (public-domain Markdown editions for Shelley, Wilde, Čapek, Plato, Bergson; modern Chin translation and course scans for the others). The deployed app will not read sibling files at runtime. Plato uses Benjamin Jowett's translation, available in [Project Gutenberg ebook 1636](https://www.gutenberg.org/ebooks/1636). Only public-domain text will be quoted in these rooms; modern scholarship will be paraphrased and cited. The design's other candidates are proposals, not built rooms or reported classroom outcomes.

## Implementation and acceptance

Own only `nextjs/app/reading-rooms/`, `nextjs/content/experiments/reading-rooms.md`, `_context/reading-rooms/`, and the required task report. Use the existing `ExperimentPage` frame, route-local CSS, React state, and native form controls. Keep the room index honest about which rooms exist. No dependencies, API calls, source-corpus copies, shared navigation edits, or model downloads are needed.

Commit this document before implementation. Commit the Phaedrus room after checking its repeated-answer behavior, editable human reply, whitespace handling, reset, and source. Commit the turn-taking room after checking all three allocation branches, continuation, gap/overlap arithmetic, slider limits, reset, and source. Test routes against Marlon's shared dev server, check keyboard access and a narrow viewport, and report any missing checks. The server was initially down; Marlon has now said it is running.

## Open questions

Marlon selected Shanahan as the third room on October 20, 2026: build option A, and option B if time allows. Should classroom annotations later export to a file? Which edition's chapter numbering should students see for Frankenstein? Is there a specific Beguš chapter intended? For now, inputs remain in component state and disappear on reset, navigation, or reload; neither prototype grades interpretation or saves student writing.

## Third-room selection, October 20

Marlon selected Shanahan after the first two rooms were complete. Build option A at `/reading-rooms/shanahan`, using an invented exchange, a revealed authored cue, two reader annotations, and a comparison. The role cue is an illustrative authoring choice, not a recovered model prompt. The full assigned arXiv v1 was now checked, especially §§3–4, 6, and 8: https://arxiv.org/html/2305.16367v1. Cite and paraphrase; do not reproduce its examples. Option B can reuse the existing browser engine if it can be verified, with explicit loading, fixed shared prefix, visible role cues, and saved run settings. This extends the original no-model scope only for that optional panel.

The optional branching panel was implemented after option A: GPT-2 q8 on WASM, one worker, sequential branches, a fixed two-line prefix, editable cues, a 48-token limit, greedy or temperature-0.8 sampling, exact run snapshots, and cancellation. Live browser checks verified both branches, an identical-cue greedy control, and cancellation. There is no Claude path and no paid call.
