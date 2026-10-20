---
task: "T"
title: "/retrieval: knowledge files, the custom GPT's RAG made visible"
status: "done (built 2026-10-20 by Claude Code af8e0f99 before it had a brief; this brief is written after the fact as the record)"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/retrieval/`, `nextjs/lib/retrieval/`, `nextjs/public/retrieval/`, `nextjs/scripts/build-retrieval-index.mjs`, `nextjs/content/experiments/retrieval.md`"
depends_on: "A (the transformers.js engine), B (`/api/chat` for the answer step)"
report: "../reports/T-retrieval.md"
---
# T. /retrieval

Marlon's request in the October 20 planning (`the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261020-workshop-planning.md`): a place to try the first-generation, corpus-based custom GPT; an explanation of retrieval and vector search students can return to; and an interactive view of what happens under the hood, including the retrieved passages and their similarity scores. Similarity is not answer correctness or a calibrated probability.

Built in commit `0782e89`; see `content/experiments/retrieval.md` for what it does. Later tasks that touch these files (Y, the knowledge-versus-voice experiment) import from `lib/retrieval/core.mjs` read-only rather than editing it.
