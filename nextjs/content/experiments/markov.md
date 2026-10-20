---
title: Markov chain
description: "Text generated purely from counts of what followed what in the course readings. Turn up the order and watch it start copying."
route: /markov
status: working
group: "Before the assistant"
order: 2
---

## What it shows

Before neural language models, the simplest way to make a machine write was to count. Take a text, and for every run of *n* words (the **state**), record which word came next and how often. To generate, start from some state, draw the next word in proportion to those counts, slide the window forward one word, and repeat. That is a Markov chain of order *n*. It has no idea what any word means; it has a table.

The page makes the table visible at every step, and it makes one discovery easy: **as the order goes up, the chain stops inventing and starts copying.** At order 1 the output is fluent-sounding nonsense, because almost any word has many possible followers. At order 3 or 4, most states occurred only once in the corpus, so they have exactly one follower, and the chain reproduces whole sentences of the source. The highlighted stretches in the output are runs that appear word for word in a single place in the readings.

That trade-off (a short memory gives nonsense, a long memory gives plagiarism, and a table can't have both because it has no way to generalize) is the problem neural language models address: instead of looking up the exact last *n* words, a network like GPT-2 (the [GPT-2 experiment](/gpt-2)) turns the context into numbers and can predict sensibly after a sequence it has never seen.

## History

Claude Shannon's *A Mathematical Theory of Communication* (1948) approximated English with exactly this procedure, giving samples of letter-level and word-level approximations of increasing order (verify the details, such as which orders he printed, before quoting them). Andrey Markov had analyzed letter sequences in Pushkin's *Eugene Onegin* in 1913 (verify). Word-level chains were later a common toy for generating parody text, for instance the "Mark V. Shaney" Usenet poster of the 1980s (verify).

## How to use it

1. **Pick a corpus**: one or more of the six course readings (the same passages the [knowledge files](/retrieval) page uses), or paste your own text.
2. **Choose words or characters, and an order**: 1–5 words, or 1–10 characters. The page rebuilds the table instantly.
3. **Step** one token at a time, or **Run** continuously. Each step shows the state, every follower that state had in the corpus with its count and share, and which one was drawn (in red).
4. **Click any token in the output** to see that step's table again and, beside it, the place in the source where the stretch ending at that token appears word for word.

Things to try:

- Phaedrus, words, order 1, then order 3. Read the percentage "inside a copied run".
- Characters at order 2, then 5, then 9: letters, then word-like strings, then real words, then quotation.
- Choose all six texts at order 3. Copying drops where two texts share a phrase, and the chain can jump between books in mid-sentence.
- Paste a short text (a paragraph). Even order 1 copies, because the table is tiny.

## What was built

- `app/markov/markov.mjs`: tokenizing (whitespace-split words with their punctuation, or characters with whitespace collapsed), building the table (state → next token → the corpus positions where it occurs), weighted drawing, seeding at a sentence start, and tracking verbatim runs.
- `app/markov/MarkovLab.jsx` and `markov.css`: the page. Everything runs in the browser; the texts are fetched from `public/retrieval/<id>.json`.
- **How copying is measured:** for each output token the page keeps the corpus positions where the output so far, back to the start of the current run, matches the source exactly. A run of *n* + 1 tokens is guaranteed by construction (the state plus its follower), so a token is highlighted only when its run is longer than that.
- When the chain reaches a state with no followers (the very end of a text), it reseeds from a random sentence start; a ‖ marks the jump.

## Rough edges and open questions

- Words keep their punctuation and capitals, so "soul" and "soul," are different words. That makes output read better but makes tables sparser; a toggle would let students compare.
- The texts include Gutenberg front matter and editors' introductions (Jowett's introduction to *Phaedrus* is long), so the chain sometimes speaks as the editor.
- Character mode on all six texts builds a large table; it takes a moment on a slow machine.
- Ideas not built: a "probability of this exact sentence" view, a side-by-side of two orders, and a link from a step's table to the GPT-2 experiment's next-token distribution for the same context.

## How this was made

Built by Claude Code (Opus 5.5) on 2026-10-20, thread `0eb5f30c-df85-41fe-af61-fdec77f9cbb8`, from task S on the orchestration board. Marlon's planning for the day asked for "a full Markov-chain demonstration" in the interactive history beside ELIZA and GPT-2; the brief asked for word and character modes, an order slider, step-by-step tables, source lookup, and the copying highlight. A prototype: tested in the browser on the shared dev server, not yet used in class.
