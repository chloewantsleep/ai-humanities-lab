---
task: "I"
title: "Fine-tune notebook (stretch)"
status: "done locally (never run on Colab)"
owns: "`fine-tune/` at the repo root, `nextjs/app/fine-tune/`"
depends_on: "start now"
report: "../reports/I-fine-tune.md"
---
# I. Fine-tune notebook (stretch)

Brief: `content/experiments/fine-tune.md`. A Colab notebook in `fine-tune/` that LoRA-fine-tunes SmolLM2-135M (base) on about fifty short dialogues, with a template for students to write their own and a sample set. Measure how long it takes on Colab's free GPU. Find out whether the result can be exported to ONNX and loaded by engine A; if it's impractical, say so. `/fine-tune` explains how to run it.

## When you finish

Write or update [`../reports/I-fine-tune.md`](../reports/I-fine-tune.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
