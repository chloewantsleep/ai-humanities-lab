---
task: "S"
thread_id: "0eb5f30c-df85-41fe-af61-fdec77f9cbb8"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 0eb5f30c-df85-41fe-af61-fdec77f9cbb8"
status: "working; QA in headless Chromium"
---

# S. /markov — report

## What I built

- `nextjs/app/markov/markov.mjs`: the chain (tokenize words or characters, build state → next → corpus positions, weighted draw, sentence-start seed, verbatim-run tracking).
- `nextjs/app/markov/MarkovLab.jsx`, `page.jsx`, `markov.css`: the page, wrapped in `ExperimentPage`. Pick any of the six readings (fetched from `public/retrieval/<id>.json`, nothing copied) and/or paste text; words (order 1–5) or characters (1–10); Step, Run/Pause with a speed slider, Clear. Each step shows the state, its followers with counts, bars and shares, and the one drawn. Clicking an output token shows that step's table and the source passage with the matching stretch highlighted. Output tokens in runs longer than order + 1 (i.e. copied verbatim beyond what the chain guarantees) are shaded, darker for long runs; a header line gives the longest verbatim run and the share of output inside copied runs.
- `nextjs/content/experiments/markov.md`: the document (status `working`, order 20), with history marked "(verify)", things to try, rough edges, and "How this was made".

## How to try it

http://localhost:3000/markov — Phaedrus is preselected. Press Step a few times at order 2, then Run; move the order to 4 and watch the shading spread. Click a shaded word.

## Commits

- `72ffc17` first version (route, lib, CSS, document)
- this report's commit follows it

## What I couldn't do or didn't check

- **Browser QA (2026-10-20, headless Chromium against :3000):** Step, Run/Pause, the order slider, clicking a copied token (source passage highlighted correctly), and character mode all work with no console errors. At word order 4 on Phaedrus, 81% of the output was inside copied runs (longest 27 words). Not checked: phone width, all six texts in character mode on a slow machine.
- Shannon (1948), Markov (1913), and Mark V. Shaney are all marked "(verify)" in the document; I didn't check them.
- No test added to `pnpm test` (`markov.mjs` is pure and easy to test if R wants it).

## For other tasks

- **V:** `/markov` is a candidate for the path between ELIZA and the spiral room; it needs a browser QA pass first.
- **C:** the document links to `/spiral` as the neural answer to the order trade-off.
- **R:** `app/markov/markov.mjs` could get a small test.

## Marlon's words

None in this thread; the brief quotes his planning: "Markov chains could be there. A full Markov-chain demonstration."

## Decisions and open questions

- Words keep punctuation and capitals (reads better, sparser tables). A normalize toggle is an open idea.
- "Copied" means a run longer than order + 1, tracked by intersecting corpus positions step by step; a run can continue across a choice point if the source continues the same way.
- Gutenberg front matter and editors' introductions are in the corpus, as on `/retrieval`.
