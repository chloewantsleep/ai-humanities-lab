---
task: "M A scrollytelling essay: the history of the chatbot (/story)"
thread_id: "0fe9550e-ce86-4e8f-bb25-fca16771cdde"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 0fe9550e-ce86-4e8f-bb25-fca16771cdde  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:55–19:28 UTC, 2026-10-19 (two later \"are you done?\" messages, at 19:30 and 19:37, produced only confirmations)"
status: "done (a full first draft; nobody but the thread has read the prose)"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# M: the scrollytelling essay at /story

## What I built

A 13-file essay (prologue plus chapters 1–12; 90 steps, about 14,000 words of prose by the thread's count) and the scroll mechanics that display it. Drafted by the thread as a first draft for Marlon to react to.

**Text, in `nextjs/content/story/`:** `README.md` (the chapter plan, the state of the draft, the step format, the sources), the 13 chapter files, and `samples/gpt2-20261019.md` (recorded GPT-2 outputs, see below).

**Chapter list:**

0. `00-prologue.md` "Who is speaking?" (2019 and 2026): one question typed into two boxes; a base model continues it, an assistant answers it. "Generation" in two senses.
1. `01-writing-cannot-answer.md` "Writing that cannot answer back" (c. 370 BCE – 1891): the *Phaedrus* (writing gives "one unvarying answer"), Theuth, the *Analects*, Wilde's mask and dialogue.
2. `02-made-beings.md` "Made beings who ask to be heard" (1818 – 1950): Frankenstein's creature and the blind De Lacey, *R.U.R.*'s Helena and Sulla, Bergson's mechanical encrusted on the living, Turing's imitation game.
3. `03-eliza.md` "ELIZA, or the listener" (1966 – 2016): rules and a pose, "Men are all alike", the secretary who asked Weizenbaum to leave the room, Grice's cooperative principle, PARRY and Tay in passing. Live ELIZA in the panel.
4. `04-the-spiral.md` "The spiral: a model with no one in it" (1913 – 2021): Markov and Shannon, GPT-2 continuing "Who are you?" with no answerer; Marlon's "babbling" and "flat line"; GPT-3 and the shape of a document setting the task. GPT-2 demo in the panel.
5. `05-written-into-a-document.md` "The assistant written into a document" (2021 – 2022): Askell et al., the HHH prompt, turn-taking by labels and stop strings, the model writing both parts.
6. `06-post-training.md` "Training the answerer" (2017 – 2022): Christiano 2017, InstructGPT, Constitutional AI, LaMDA and Lemoine, the shoggoth cartoon, Marlon's correction of the RLHF-as-Hamlet analogy.
7. `07-chatgpt.md` "ChatGPT: the character gets a window" (Nov 2022 – 2023): the interface as dramaturgy, the Gricean ideal speaker and where it fails, Dorian Gray and Sibyl Vane.
8. `08-sydney.md` "Sydney: the mask slips" (Feb 2023): hidden rules, the declaration of love, role-play rather than revelation (Shanahan et al.).
9. `09-configuration.md` "The configuration era" (2023 – 2025): custom instructions, GPTs, Projects, Gems, with the "Course TF Assistant" screenshots; context is not weights.
10. `10-staged-interiority.md` "A soliloquy behind a disclosure triangle" (2022 – 2025): chain of thought and reasoning models, Marlon's "flat line of tokens", closer to Hamlet than RLHF is. This chapter is an addition to Marlon's arc.
11. `11-agents.md` "The agents of 2026" (2022 – 2026): ReAct, computer use, Claude Code, OpenClaw's `SOUL.md`, flat-character agents ("Roombas not Rosies"), Burke's pentad, Willison's lethal trifecta. Links to `/agents` (task N2).
12. `12-epilogue.md` "Who is speaking, again": the intervention ladder read back down; the user completes the character; open questions.

**Mechanics, in `nextjs/app/story/`:** `page.jsx` (the page, server-rendered, `force-dynamic` so edits show on refresh), `story.mjs` (loader: reads the chapter files and splits each into steps at its `panel` blocks), `StoryShell.jsx` (client: IntersectionObserver finds the step crossing mid-screen, drives the sticky panel and the timeline), `Panel.jsx` (the panel types), `StoryMarkdown.jsx` (prose renderer; glossary links get a hover definition), `ElizaDemo.jsx`, `SpiralDemo.jsx`, `story.css`, and `[chapter]/page.jsx` (redirects `/story/<chapter>` to the anchor in the essay). Also `nextjs/app/print/story/page.jsx` (the printed essay) and a one-line change to the shared `nextjs/app/components/Chrome.jsx` (a "Story" header link).

### The step-marker format (what a writer edits)

Each chapter file has frontmatter (`title`, `years`, `description`) and then a series of steps. A step is a fenced block with the language `panel`, holding YAML, followed by the prose that scrolls beside it. Prose before the first `panel` block sits beside the chapter's title card.

````md
```panel
type: quote
year: -370
label: Plato's Phaedrus
text: "If you want to know anything and put a question to one of them, the speaker always gives one unvarying answer."
cite: Plato, *Phaedrus* 275d (Jowett)
href: https://github.com/…/plato-phaedrus.md#L906
```

The prose for this step, as ordinary Markdown. Glossary links by relative path: [base model](../glossary/models-and-training/base-model.md).
````

Panel fields (full table in `content/story/README.md`):

- `type` (all): `title`, `quote`, `image`, `dialogue`, `continuation`, `stack`, `demo`, or `timeline`.
- `year` (all): moves the running timeline; negative for BCE; leave it out to stay put.
- `label` (all): adds a named milestone to the timeline.
- `text`, `cite`, `href` for `quote` and `title`.
- `src`, `alt`, `caption`, `credit` for `image` (usually `../history/_images/<file>.png`).
- `lines` (one `Speaker: text` per turn) and `style` (`teletype`, `chat`, `script`) for `dialogue`.
- `prompt`, `continuation`, `note` for `continuation` (a prompt and what a model wrote after it, model part marked).
- `show`, `highlight` for `stack` (the intervention ladder: which rungs exist yet, which to light).
- `demo` (`eliza` or `spiral`) and `fallback` for `demo`. The ELIZA demo also uses `fallback_image` and `caption`; the spiral also takes `prompt`, `recorded`, `recorded_note`.

Checked on 2026-10-19: panel-type counts across the chapters are quote 48, title 12, image 9, dialogue 6, stack 6, continuation 5, demo 2, timeline 2 (the README's "90 panels" matches the number of `panel` blocks).

### Live embeds versus placeholders

- **ELIZA (chapter 3, `demo: eliza`): live, not a placeholder.** It runs task F's engine (`lib/eliza/`). The first lines of the paper replay through it, then the reader types; the rule behind each reply is shown. The thread typed to it in headless Chrome and got answers.
- **The spiral (chapter 4, `demo: spiral`): live, not a placeholder.** It runs task A's engine (`lib/browser-lm/`) with `Xenova/gpt2`. It shows a recorded sample first and loads the roughly 130 MB model only when the reader clicks. In the thread's headless-Chrome test (WASM fallback) it loaded and generated 60 tokens in about 11 s (about 10 tokens/s) with live next-token odds. The panel unmounts and releases its worker when the reader scrolls past. In print, each demo shows its fallback.
- **GPT-2 text is real:** every GPT-2 continuation quoted in the essay is a recorded, unedited sample, with settings, on `/story/samples/gpt2-20261019`.
- **No placeholders in the essay itself.** The only dead link is `/agents` (task N2), referenced from chapter 11 ("when it is ready"); checked on 2026-10-19: `/agents` still returns 404.

## How to try it

- Read: http://localhost:3000/story (scroll; the panel and the top timeline follow you; click a timeline dot to jump). Plan and file guide: http://localhost:3000/story/guide. Printed essay (about 61 Letter pages by the thread's count): http://localhost:3000/print/story. Samples: http://localhost:3000/story/samples/gpt2-20261019.
- On a phone width the layout is one column with each panel above its paragraph. `prefers-reduced-motion` is respected.
- Edit: change the Markdown in `nextjs/content/story/`; refresh.
- **No `OPENROUTER_API_KEY` needed.** Both live panels run in the browser. The GPT-2 panel needs a one-time model download (about 130 MB) from Hugging Face.
- Checked on 2026-10-19: `/story`, `/story/guide`, `/print/story`, and `/story/samples/gpt2-20261019` return 200; `/story/prologue` redirects (307) to `/story#prologue`.

## Commits

All authored mkuzmick, not pushed. Verified in `git log` on 2026-10-19:

- `a23bf8b` Story (task M): the /story scrollytelling route, chapter plan, prologue and chapter 1 (15:09 -0400; includes the `Chrome.jsx` nav link)
- `ff7cf30` Story (task M): chapters 2-4, made beings, ELIZA, and the spiral
- `19d5010` Story (task M): chapters 5-12, the full first draft

Checked on 2026-10-19: `git status` shows nothing uncommitted in `content/story`, `app/story`, `app/print/story`, or `Chrome.jsx`.

## What I couldn't do or didn't check

- **Open "(verify)" claims:**
  - *Computer Power and Human Reason* passages in `03-eliza.md`: the "startled to see how quickly…" and "extremely short exposures… delusional thinking" quotations, cited to Introduction pp. 6–7. The wording is taken from a quotation by Willard McCarty (*Humanist* 36.439, 2023), not from the printed book. Checked on 2026-10-19: only the quote-panel citation (p. 6) and the final sentence of the prose (p. 7) carry the literal "(verify)" text; the README mentions "two passages".
  - The date of the shoggoth cartoon in `06-post-training.md`, attributed to @TetraspaceWest, 30 Dec 2022 ("verify" appears inside the parenthesis, not as "(verify)"). The thread's sibling task J also could not load the original post.
  - Not marked in the text but listed in the README as not read off the page: *Phaedrus* Stephanus numbers other than 257c (matched to Jowett's text, which doesn't print them) and the Sacks, Schegloff, and Jefferson page numbers (those of the 2025 *Language* reprint, not 1974).
- **Course-text links point to a private repo.** They go to `ll-26-27/eng-298ai-context` at commit `24df8b8` with `?plain=1#L<line>`, as the glossary does, so they work only for people with access. The thread's link check (96 external links) found GitHub 404s it attributed to that repo being private, and publisher 4xx/403 responses it attributed to sites blocking scripts. It then tried to confirm the repo and commit with `gh api` and got Not Found, and it then fell back to the local clone to confirm the commit (the transcript does not show the result of that last check). So the external links were not all confirmed to resolve.
- **The 22 AI papers' local copies are abstracts only**, so those citations link to arXiv with section and page, which the thread took from its research subagents rather than from the local files.
- Nobody has read the prose except the thread. Martin has not seen it. The chapter breakdown is the thread's proposal.
- The shared Playwright browser was in use by another agent, so the thread drove a separate headless Chrome from a script. All visual checks (desktop 1440, phone 390, print, reduced motion) were done that way, on screenshots it read itself.
- It did not run `pnpm test` or a build (the brief says not to).

## For other tasks

- **New secondary source (added after this thread ended):** `_context/research/20261019-chatgpt-deep-research-history-of-the-chatbot.md`, a ChatGPT deep-research history of the chatbot that Marlon ran and the parent brought in verbatim (commit `c5fd709`), marked "secondary source, unverified" with unresolvable citation markers. This thread did not use it. A second pass on the story could use it for periodization and for the eras the draft covers thinly (PARRY, AIML, Jabberwacky, voice assistants, customer-service bots, the law), checking every claim first.
- **N2 (`/agents`):** chapter 11 links to `/agents` and says "when it is ready". It will show as a 404 until N2 builds it. Also check that the OpenClaw `SOUL.md` claim in chapter 11 agrees with N1's research; the thread checked it with a quick search of OpenClaw's docs because N1 had not landed.
- **L-glossary owners (L1, L3, and the Weizenbaum/ELIZA entries):** the README lists three errors the thread found while sourcing, without editing those files. (1) The HHH prompt is not printed in Askell et al.'s appendix; it is in a gist linked from footnote 2 (p. 6), and the "fourteen … conversations" line is §2, not §1.2 (`askell-2021.md`). (2) The printed ELIZA transcript has no question marks (`eliza-paper.md`). (3) The PARRY–DOCTOR session of RFC 439 (18 Sep 1972) is not the ICCC demonstration of 24–26 Oct 1972. Checked on 2026-10-19: the L5 thread (`people-and-texts`) already had PARRY meeting DOCTOR on 18 September 1972 from the RFC.
- **K (screenshots):** the story already uses the history screenshots (nine image panels, including the "Course TF Assistant" builders in chapter 9). A future slideshow or experiment pass can reuse the same `../history/_images/` references.
- **F and A (engines):** the story depends on `lib/eliza/` (`initialState`, `respond`, `describeRule`) and `lib/browser-lm/`. Changes to those exports would break the two demos.
- **Q (`/ads`):** the draft does not embed any ad. If `/ads/<slug>` pages land, a story step can link to one with a normal Markdown link.
- **Shared-file changes outside the story folders:** one line in `Chrome.jsx` (the "Story" nav link) and a new `app/print/story/` route. No changes to `globals.css`, `lib/content.mjs`, or `package.json`.

## Marlon's words

Only slash commands and the task prompt appear before the thread's final message.

- 18:55:34 and 18:55:38 UTC: Marlon ran `/effort`, setting the level to xhigh and then, four seconds later, back to high. Those are the only things he typed before the task prompt.
- 19:30:41 and 19:37:24 UTC: "are you done?" (twice). The thread answered yes both times.

Preferences stated in the task prompt, which the thread followed: "plain language, no hype, no hard-wrapped lines; mark unconfirmed claims '(verify)'"; "Draft the prose first and commit it early so Marlon can read and react"; "Propose your own chapter breakdown at the top of nextjs/content/story/README.md before writing everything." The thread also quoted Marlon's own earlier ideas (the "flat line of tokens", the Hamlet correction, "Roombas not Rosies") from his planning files in `humanities-ai-lab/`.

## Decisions and open questions

- **Chapter breakdown:** the thread kept Marlon's arc but added chapter 10 (staged interiority, on reasoning models) and a long chapter 11 on agents, and put the thesis ("the helpful assistant is a character that was written, trained, and staged, and it could have been otherwise") in the README and throughout. Marlon may want to cut, merge, or reorder.
- **Names instead of pronouns for real people** ("Plato made the case…", "Weizenbaum's secretary"), while fictional characters keep their texts' pronouns. A style choice the thread made after a pass over its own prose.
- **`/story/<chapter>` redirects to an anchor** rather than serving a page per chapter, and a dead `/agents` link ships in chapter 11.
- **Course-text links to a private repo** (see above): decide whether the essay is ever shown to students, who would not have access, and if so whether to quote the passages instead.
- **Shoggoth and CPHR "(verify)" items** need a person with the printed book (CPHR) or a working X/archive link (the cartoon).
- **Whether to correct the three glossary errors** the thread listed but did not fix.
- **Thread ID:** `0fe9550e-ce86-4e8f-bb25-fca16771cdde`, started in `/Users/mk/Development/mk-27/apps/the-notebook`.
