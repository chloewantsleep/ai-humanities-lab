---
title: RAG, step by step
description: "Retrieval-augmented generation with nothing hidden: the passages, the 384 numbers, the JSON file that is the whole store, the dot product worked out, the cut-off, the exact prompt, and the answer."
route: /rag
status: working
group: "Under the hood"
order: 2
---

## What it shows

How a chatbot "uses your files," one step at a time: cut the text into passages, turn each passage into a list of numbers, keep those lists in a file, turn the question into numbers with the same model, score every passage by multiplying and adding, keep the best few, paste them into the prompt, and ask. The math is short enough to show in full: step 5 works out the dot product for one passage, all 384 multiplications, and then does the same for every passage in under a millisecond.

It builds on [Knowledge files](/retrieval) (`/retrieval`), which compares embedding search with keyword search across several texts. This page follows one text through the whole pipeline instead.

## What was built

- **The route** `/rag` (`app/rag/RagPipeline.jsx`, styles in `app/rag/rag.css`), eight steps you move through with Next and Back or the numbered tabs. Each step has its own address (`/rag#chunk`, `#embed`, `#store`, `#question`, `#compare`, `#top-k`, `#prompt`, `#answer`), so a talk can point straight at one.
- **The texts:** any one of the six course texts already embedded for `/retrieval` (`public/retrieval/`), or your own, pasted in and cut and embedded in the browser tab in the same format (and downloadable as that JSON file).
- **The model:** `Xenova/all-MiniLM-L6-v2` (384 numbers per passage), run in the browser with transformers.js through `/retrieval`'s worker. The example questions were embedded ahead of time with the same model (`app/rag/tools/embed-questions.mjs`, into `app/rag/questions.json`), so steps 4 to 7 work before the model downloads; a typed question, "Embed it here instead", or your own text downloads it (about 23 MB, once).
- **The answer** goes to Claude through the shared `/api/chat` route and needs `OPENROUTER_API_KEY`. Each click is one paid call.

## The steps

1. **Chunk.** The passages laid end to end with a mark at each cut, and the rule that made them. Click a passage to follow it.
2. **Embed.** That passage's 384 numbers, as numbers and as a strip of colour, with its length (1). A button re-embeds it live and shows the fresh and stored vectors agree.
3. **Store.** A slice of the JSON file that is the whole store, and how to find one passage's numbers in it.
4. **Embed the question.** The question's 384 numbers, beside the passage's.
5. **Compare.** The dot product worked out: question × passage for each of the 384 numbers, with a running total, the sum, and the angle it corresponds to. Then every passage's score, in text order.
6. **Top k.** The scores sorted, with the cut-off you set.
7. **The prompt.** Exactly what the model is sent, and how it divides between instructions, passages, and question.
8. **The answer.** Claude's answer, the passages it cites traced back, and every quotation in it checked word for word against the passages it was given: ✓ found in the passage it cites, ≠ found but in a different passage, ✗ in none of them.

## Tested on 2026-10-20

On Marlon's Mac against the shared dev server, headless Chromium, with `app/rag/tools/browser-test.mjs`:

- All eight steps on *Phaedrus* with "Does writing destroy memory?": the worked dot product for the top passage (Jowett's introduction, passage 33) is 0.4003, the same score `/retrieval` gives; scoring all 352 passages took about a millisecond or less. Plato's own passage on Theuth comes third (0.348). Asking "Why did Thamus distrust letters?" puts Plato's passage first (0.66).
- A typed question in a fresh browser: the model download (about 29 MB of network traffic) and the first embedding took 2.3 to 3.9 seconds on this connection; the next question took under a tenth of a second. Re-embedding a passage live gives a vector whose dot product with the stored one is 0.995 (the gap is the rounding to whole numbers).
- Pasted text (six paragraphs of notes on Grice) was cut into three passages, embedded, stored, and searched.
- One live answer from Claude: it cited [1], [3], and [4], and all six of its quotations were found word for word in the passages it cited. The quotation check was also run against a canned answer (no paid call), and flagged a real quotation cited to the wrong passage and an invented one.
- No horizontal scrolling at 1024 or 390 pixels; no console errors. Chromium only.

## Facts checked (2026-10-20)

- all-MiniLM-L6-v2 maps text to 384 dimensions and truncates input longer than 256 word pieces (its Hugging Face model card).
- pgvector: "Open-source vector similarity search for Postgres"; exact search by default, approximate indexes HNSW and IVFFlat that "trade some recall for speed"; distances include inner product and cosine (its GitHub README).
- The figures on the page (passage counts, file sizes, scores, times) are computed in the page from the files it loads.

## Open questions

- The footnote on long context windows gives the text's size in tokens at a rough four characters per token, and says to verify the window of the model you use rather than naming one.
