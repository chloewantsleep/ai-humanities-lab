---
task: "AE"
title: "Rename the spiral room to GPT-2, and a get-ready page that preloads the models"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/spiral/` → `nextjs/app/gpt-2/`, `content/experiments/spiral.md` → `gpt-2.md`, a redirect from `/spiral`, links to `/spiral` everywhere except `content/workshop/README.md` (AD), `nextjs/app/get-ready/`, `content/experiments/get-ready.md`"
depends_on: "C (done)"
report: "../reports/AE-gpt-2-rename-and-get-ready.md"
---
# AE. GPT-2, and getting ready

**The name.** "Spiral room" was never Marlon's choice: the word came from his canvas ("replies spiral off instead of answering"), the name from an AI's proposal, and it stuck. Marlon (2026-10-20): "let's choose a different name for it . . . can just be gpt-2-era chat or something more descriptive." The orchestrator's pick, which Marlon can still change: route **`/gpt-2`**, title **"GPT-2, before the assistant"**, with a one-line description that says what happens (you type, it continues the document instead of answering). Read C's report first (`../reports/C-spiral.md`).

1. `git mv` the route folder and the document; update the title, metadata, CSS class names only if they say "spiral" in user-visible text (keep internal names if renaming is risky), and every link to `/spiral` in `nextjs/content/` and `nextjs/app/` except `content/workshop/README.md` (AD writes `/gpt-2` there). Add a permanent redirect `/spiral` → `/gpt-2` (and `/experiments/spiral`) using Next 16's current mechanism (read `node_modules/next/dist/docs/`). Keep "spiral" as a word in the page's prose where it describes what the model does. `pnpm test` still passes.
2. **`/get-ready`** (Marlon: "sure as an option"): one page a student opens at the start of class that downloads and caches every browser model the session uses (GPT-2, the SmolLM2 base and instruct models `/by-hand` uses, the MiniLM embedder `/retrieval` uses), each with size, progress, and a done tick; a quick speed check that recommends WASM or WebGPU and remembers it; and a clear "you're ready" state. Use the engine's own loaders (`lib/browser-lm/`, `lib/retrieval/`) so the cache is the one the pages read; don't change those libraries beyond a small exported helper, and say so. Optional: it says what will still need a key.

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
