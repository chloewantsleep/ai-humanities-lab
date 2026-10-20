---
task: "C"
title: "The spiral room"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/spiral/`"
depends_on: "A"
report: "../reports/C-spiral.md"
---
# C. The spiral room

Brief: `content/experiments/spiral.md`. Uses A. A raw text area (no chat bubbles), temperature and top-k sliders, a live bar view of the next-token distribution, a "never stops" indicator, and a model picker (GPT-2, SmolLM2-135M base, Gemma 3 270M pt). Include a few starter prompts that show the spiral well (a question, "Who are you?", the start of a forum post), and test them so the defaults actually show the effect.

## For today's workshop (added 2026-10-20 by the second orchestrator)

This is part of the **MVP for the October 20 class** (ENG 298AI, "How to build and test a chatbot"). Marlon: "GPT-2 must be there." Students should type straight into GPT-2 and watch it continue the document rather than answer: drift, repetition, spiraling. That is the point of the page, so make it work first with GPT-2 alone and treat the other models as extras.

- **Classroom-ready means:** the first visit explains the model download (size, time) before it starts; a slow or failed download shows a clear message and a fallback (a few pre-recorded GPT-2 continuations of the starter prompts, saved as a JSON beside the route and labeled as recorded, with the date and settings); generation can be stopped; the page works at laptop widths down to 1024px.
- **Test well:** run every starter prompt at the default settings, cold (cleared cache) and warm, and record in your report what students will see, with times. Measure the download on a cold cache. Note anything WebGPU-vs-WASM.
- **Connect to the readings** in one or two lines on the page (for example: the base model doesn't know it's being asked a question; it continues a document, the way Frankenstein's creature learns language by overhearing). Keep it short and don't overclaim.
- **Testing in a browser:** use the shared dev server on http://localhost:3000. Don't start a second dev server in `nextjs/` (they share `.next/`); if 3000 is down, say so in your chat and wait.

## When you finish

Write or update [`../reports/C-spiral.md`](../reports/C-spiral.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
