---
title: Knowledge files
description: "How a first-generation custom GPT used its uploaded files: split them into passages, search them by embedding, paste the best few into the prompt. Every step is visible."
route: /retrieval
status: working
group: "Under the hood"
order: 1
---

## What it shows

From late 2023, a custom GPT (and later a Gem or a Claude Project) could be given "knowledge files." The bot did not read them. The system split each file into passages, turned every passage and every question into an embedding (here, 384 numbers), and pasted the passages whose embeddings pointed most nearly the same way as the question's into the prompt. This is retrieval-augmented generation (RAG; Lewis et al. 2020, in the course's AI papers).

The page makes three points visible:

- **The search is separate from the answer.** The ranked passages and their scores come first; the model only sees what the cut-off lets through (step 04 shows the exact text it is sent).
- **A similarity score is not a judgment of relevance.** It measures how alike two embeddings are in this one model. The histogram shows how little separates the kept passages from the next ones, and the Phaedrus example shows Jowett's introduction outranking Plato's own myth of Theuth on "Does writing destroy memory?"
- **Meaning and keywords find different things.** The side-by-side view compares embedding search with BM25, a keyword ranking that knows only shared words. Passages found by both are marked.

## What was built

- Six Project Gutenberg course texts (Phaedrus, R.U.R., Frankenstein, Bergson's *Laughter*, *Dorian Gray*, *Intentions*), split into ~700-character passages and embedded ahead of time by `scripts/build-retrieval-index.mjs` from the `eng-298ai-context` course repo. The output is in `public/retrieval/`. Grice, Sacks et al., and the Chin *Analects* are left out because these files are served publicly.
- Questions, and any text a student pastes in, are embedded in the browser with the same model (`Xenova/all-MiniLM-L6-v2`, about 23 MB, downloaded once). No key is needed to search.
- "Ask Claude with these passages" sends the assembled prompt through the shared `/api/chat` route, so it needs `OPENROUTER_API_KEY`.

## What it is not

It is a legible example of the technique, not a reproduction of OpenAI's, Google's, or Anthropic's retrieval systems, which use their own models, passage sizes, and re-ranking, and which they have not fully documented.

## Things to try

- Turn the number kept down to 1, then up to 8, and compare the answers.
- Ask something none of the texts discuss. Does the answer say so, or fill the gap?
- Ask with a word the text never uses ("robots rebel" against R.U.R.'s "revolt") and compare the two searches.
- Paste your own notes in and ask about them.
