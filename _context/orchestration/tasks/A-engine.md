---
task: "A"
title: "Browser language-model engine"
status: "done"
owns: "`nextjs/lib/browser-lm/`"
depends_on: "start now"
report: "../reports/A-engine.md"
---
# A. Browser language-model engine

Build one engine that every in-browser experiment uses, so the spiral room and the four columns don't each reinvent model loading. Run transformers.js in a **Web Worker** so the page never freezes.

- Load any of the models listed above by id, with progress events (download size, percent), cached by the browser after the first load. Prefer WebGPU when available and fall back to WASM; report which is in use.
- Step-by-step generation that, at each step, reports the chosen token, its text, and the top-k next-token candidates with probabilities (after temperature), so a page can draw the distribution live. Controls: temperature, top-k, max new tokens, stop strings, and a "never stop" mode that ignores end-of-sequence.
- Stop/abort mid-generation.
- For instruct models, apply the model's chat template and return the exact templated string (special tokens included) alongside the output.
- A small React hook (for example `useBrowserLM(modelId)`) that pages can use.
- A bare test page (for example `/engine`) for trying it, removable later.

Report the real download sizes and tokens per second you observe for GPT-2 and SmolLM2-135M on Marlon's Mac.

## When you finish

Write or update [`../reports/A-engine.md`](../reports/A-engine.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
