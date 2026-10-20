---
task: "L2 (glossary: models and training)"
thread_id: "4480de68-412b-437e-9897-c40c3c5617cc"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 4480de68-412b-437e-9897-c40c3c5617cc  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:39–18:46 UTC, 2026-10-19 (final report at 18:46:38; the session file's last record is 18:49 UTC)"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# L2: Glossary, models and training

## Who actually wrote and committed the folder

This thread did, alone. The transcript is short because the thread wrote the entries through two generator scripts (`gen.py` and `entries.py`, in its scratchpad) instead of one file at a time, then ran them. It started no subagents (the raw session file has only Bash and Write tool calls: 18 Bash, 4 Write; no Agent calls).

Checked on 2026-10-19: `git log` on `nextjs/content/glossary/models-and-training/` shows exactly one commit, `4c34690`, "Glossary: models and training (53 entries, token to post-training)", authored 2026-10-19T14:46:23 -04:00 (18:46:23 UTC) as Marlon Kuzmick's noreply address, 54 files, 1,821 insertions. That matches the thread's own commit command at 18:46:21 UTC in the raw session file, and no other commit has touched the folder since. The commit contains only this folder (no stray files from other agents), so the commit-by-path rule (rule 7) was followed. Note the author name is written "Marlon Kuzmick", where the L0/L1 commits show "mkuzmick" (same noreply email); the thread set it with `git -c user.name=...` on the command line.

## What I built

- `nextjs/content/glossary/models-and-training/`: **53 entries** plus a `README.md` (54 files). Checked on 2026-10-19: `ls` shows 53 entry files besides the README, and the folder's front matter parses (the thread checked all 54 with gray-matter and fixed two files whose aliases needed quoting: `end-of-sequence-token.md` and `transformers-js.md`).
- The README (`order: 2`) is a table of entries in six groups, in reading order from token to post-training:
  1. **Text as numbers:** language model, token, tokenizer, vocabulary, special tokens, end-of-sequence token, embedding.
  2. **Choosing the next token:** next-token prediction, logits, probability distribution, sampling, temperature, top-k, top-p, greedy decoding, repetition (the file is `repetition.md`; the term in the thread's list is "repetition loop"), stop sequence, seed, context window.
  3. **Inside the model:** neural network, parameters, weights, transformer, attention.
  4. **Pretraining and the base model:** training, loss, training data, pretraining, scaling laws, base model, in-context learning, GPT-2, SmolLM2.
  5. **Post-training:** post-training, fine-tuning, LoRA, supervised fine-tuning, instruction tuning, preference data, reward model, RLHF, Constitutional AI, context distillation, chat template, instruct model.
  6. **Running a model:** inference, tokens per second, quantization, ONNX, Transformers.js, WebGPU, open weights, model card.
- Experiments linked: Checked on 2026-10-19: 18 entries have `spiral` in `experiments:` and 17 have `by-hand`; `fine-tune` is linked from fine-tuning and LoRA, and `layers` from chat template. Each "Try it" line says which slider or column shows the idea.
- Readings linked (in `readings:` and the "In the readings" section), quotations checked by the thread against the Markdown copies, with links pinned to course-repo commit `24df8b8`: *Phaedrus* 275d ("one unvarying answer") on next-token prediction and greedy decoding; Bergson's "something mechanical encrusted on the living" on temperature and repetition; *Frankenstein*, the creature learning language by overhearing the De Laceys, on training data; Sacks, Schegloff and Jefferson's transition-relevance place on special tokens and the end-of-sequence token; Grice's Cooperative Principle on instruction tuning and RLHF; Rossum "had to simplify him" in *R.U.R.* on post-training; *Analects* 7.8 ("one corner of a square") on next-token prediction. Askell et al. 2021 and Shanahan et al. 2023 are cited in several entries.
- The AI papers are cited by link into the course repo's `papers-on-ai-md/` sidecars, which hold only abstracts for Askell, InstructGPT, Constitutional AI, and LoRA. To check figures and quotations the thread downloaded those four PDFs from arXiv into its scratchpad (nothing committed from them), and confirmed: the HHH prompt is 4,600 words from 14 fictional conversations; Askell et al.'s stop sequence is "literally the string Human:"; section 2.1 is context distillation, including the counting example; InstructGPT used about 40 contractors and its 1.3B model was preferred to the 175B GPT-3; LoRA cuts trainable parameters 10,000 times.

## How to try it

- http://localhost:3000/glossary/models-and-training (the table) and http://localhost:3000/glossary/models-and-training/base-model (an entry), or pick "Models and training" in the `/glossary` sidebar.
- No `OPENROUTER_API_KEY` needed: static Markdown.
- Checked on 2026-10-19: both URLs return 200. The experiment links in "Try it" lines point at `/spiral`, `/by-hand`, `/fine-tune`, `/layers`; whether each of those pages is built depends on tasks C, D, I, G (see the orchestration board).

## Commits

- `4c34690` Glossary: models and training (53 entries, token to post-training). It is the only commit; `git status` was clean on 2026-10-19, so nothing of this thread's is uncommitted. Not pushed; Notebook submodule pointer not moved.

## What I couldn't do or didn't check

From the thread's own admissions: it did not read the pages in a browser; its checks were front-matter parsing, a relative-link check, and one HTTP 200 on `/glossary/models-and-training/base-model`.

"(verify)" appears in 13 places across 12 entries. Checked on 2026-10-19 against the files:

- **context-window:** typical context windows of recent models are "hundreds of thousands of tokens (verify any specific figure)".
- **vocabulary:** newer models' vocabularies "often 100,000 or more, verify for any given model".
- **token:** the rule of thumb that English is about three-quarters of a word per token.
- **embedding:** GPT-2 small's 768 numbers per token.
- **instruction-tuning:** Google's FLAN (2021) result on unseen tasks.
- **rlhf:** that ChatGPT, released later in 2022, used the same approach as InstructGPT.
- **onnx:** that Facebook and Microsoft introduced it in 2017.
- **webgpu:** that Chrome turned it on by default in 2023.
- **in-context-learning:** the section number (1.2) in Askell et al. for the few-shot point.
- **pretraining:** which section of Shanahan et al. carries the broader "many roles" argument.
- **training-data:** the chapter boundaries for the De Lacey passage in *Frankenstein* (the entry says volume 2 and to verify against the assigned edition).
- **seed** and **top-p:** whether a given hosted API exposes a seed, or advises changing top-p or temperature but not both.

Nothing claimed in the thread's closing report is contradicted by the repo. The thread's summary lists 9 verify items; the files contain a few more small ones (seed, top-p), which it did not list.

Unchecked beyond that: no entry in the folder has been reviewed by Marlon, and the entries about real models' sizes, vocabularies, and dates rest on the model cards and papers linked in each. (Checked on 2026-10-19: I did not re-verify those sources.)

## For other tasks

- **L0 (glossary index):** the thread said the index README claimed `ouyang-2022` was "not in the course repo", but it is there (`2203.02155v1`), and it listed papers it cites that could get reading ids: Vaswani 2017, Brown 2020, Christiano 2017, Hu 2021 (LoRA), Bai 2022 (Constitutional AI), Kaplan 2020, Hoffmann 2022. Checked on 2026-10-19: the L0/L1 thread had already fixed the README for InstructGPT, LaMDA, and Constitutional AI in `b5ea787` (18:43 UTC, before this thread finished), and the README now maps `ouyang-2022` and `bai-2022` to course-repo files. The models-and-training entries still use only `askell-2021`, `shanahan-2023`, `grice-1975`, `sacks-1974`, `plato-phaedrus`, `bergson-laughter`, and `capek-rur` in `readings:`; none uses `ouyang-2022` or `bai-2022` as an id, so P or a later pass could add them to `rlhf`, `instruction-tuning`, and `constitutional-ai`.
- **L4 (interfaces and agents) / N7:** `embedding.md` links to `../interfaces-and-agents/retrieval.md`, which does not exist. Checked on 2026-10-19: L4's entry is `retrieval-rag.md`, so this link should be changed to point there (or an alias file added). It is the only dangling link from this folder; every other cross-category target (system prompt, preamble, few-shot prompting, assistant, HHH, sycophancy, role, turn, turn-taking, simulator, conversation history) exists on disk.
- **C (spiral room) and D (by hand):** these entries are the glossary under those pages. `base-model`, `temperature`, `top-k`, `end-of-sequence-token`, `repetition`, `special-tokens`, `chat-template`, `instruct-model`, `stop-sequence`, and `smollm2` link to the experiment routes; when the experiment documents are updated (task K), link back to the entries.
- **A (engine):** `tokens-per-second.md`, `transformers-js.md`, `onnx.md`, `webgpu.md`, `quantization.md` describe the engine's stack; A's measured download sizes and speeds are not in them.
- **P (readings):** the course repo holds only abstracts for Askell, InstructGPT, Constitutional AI, and LoRA, so full-text quotations came from arXiv PDFs that the thread downloaded to its scratchpad; P's gathered-papers folder is the place to hold those if Marlon wants them.

## Marlon's words

None beyond the task prompt (18:39:58 UTC): do L2, read the Stafford glossary first, use the entry format exactly, aim for 30 to 60 entries, write the README table "in a sensible reading order (from token to post-training)", link `experiments:` carefully because "These terms carry the spiral room (/spiral) and the four columns (/by-hand)", explain them "for humanities students", say where a course reading touches an idea, "'(verify)' for what you can't confirm", commit in this repo and don't push, and report the number of entries and any links to entries in other categories that don't exist yet.

## Decisions and open questions

- **53 entries, near the top of the 30 to 60 range.** The brief's candidate list was extended with: embedding, loss, neural network, in-context learning, context distillation, instruct model, tokens per second, seed, stop sequence, repetition (as a loop), GPT-2, SmolLM2, Transformers.js, which the experiments use.
- **The Askell paper's stop sequence and context distillation** have entries of their own (`stop-sequence.md`, `context-distillation.md`), apparently because the by-hand preamble column depends on them (my inference, not stated by the thread).
- **Several figures are deliberately "(verify)" rather than guessed** (see above); someone may want to settle them.
- **Terms placed here that another category might also claim:** `chat-template`, `special-tokens`, `stop-sequence`, `context-window`, `in-context-learning`. The thread checked the other folders before writing and linked to `system-prompt`, `preamble`, `few-shot-prompting`, and others rather than redefining them.
- **File naming:** the thread used `repetition.md` (not `repetition-loop.md`), and `gpt-2.md` and `smollm2.md` for model entries. If M or K link by the longer slug, they will find nothing.
- Question left for Marlon: none asked in the thread.
