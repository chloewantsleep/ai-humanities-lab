---
task: "AH"
title: "/rag: the whole retrieval pipeline, with the vectors and the dot product visible"
status: "not started"
track: "prototype (Marlon wants it as a footnote route today)"
owns: "`nextjs/app/rag/`, `nextjs/content/experiments/rag.md`"
depends_on: "T (`/retrieval`; import `lib/retrieval/`, don't edit it)"
report: "../reports/AH-rag.md"
---
# AH. /rag

Marlon (voice session, 2026-10-20): "A RAG-based assistant page that makes the whole pipeline visible, so students see under the hood." He'd "assumed pgvector/Postgres would be easier but likes showing the math since it's trivial." He named `/rag` as the kind of route he'd point to as a footnote during the talk, and Madeleine's context-window drawing is the frame. Read the record: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/handoffs/20261020-voice-session-run-of-show-and-repo.md` ("RAG assistant page"), and T's report and `content/experiments/retrieval.md` (what `/retrieval` already shows: scores, histogram, BM25 comparison, the exact prompt).

**Build `/rag`** as a step-through of the pipeline on a small corpus (one or two course texts from `public/retrieval/`, or the student's own pasted text), each step a panel you advance through: **1 chunk** (see the passages and how the text was cut), **2 embed** (a passage becomes 384 numbers: show them, as numbers and as a strip of colour), **3 store** (the store is just a JSON file: show a slice of it), **4 embed the question** (same model), **5 compare** (the dot product of two normalized vectors, worked for one passage: the multiplications and the sum, then the score for every passage), **6 top k** (the cut-off), **7 the prompt** (exactly what goes in the context window), **8 the answer** (Claude through `/api/chat`, citing passages; needs the key). A footnote on the industrial version (a vector database such as pgvector) and on the alternative of putting whole texts in the context window, without claims you haven't checked. Link `/retrieval` for the comparisons it already has.

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
