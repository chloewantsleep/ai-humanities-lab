---
task: "AF"
title: "Shared fixes from QA: Markdown in the chat shell, /print for every route, all tests in pnpm test, mini-claw's memory"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/components/chat/ChatShell.jsx` and `chat.css`, `nextjs/app/print/`, `nextjs/package.json` (test script only), `nextjs/app/mini-claw/` and `mini-claw/` (the memory reset only)"
depends_on: "start now"
report: "../reports/AF-shared-fixes.md"
---
# AF. Shared fixes

From V's classroom QA (`../reports/V-session-path-and-qa.md`) and the report digest:

1. **Claude's replies show raw Markdown** (`**asterisks**`) on `/layers` and `/chat-demo`, because `ChatShell` renders text parts as plain text. Render Markdown in assistant messages (the app already uses `react-markdown` with `remark-gfm`; match `Markdown.jsx`), safely (no raw HTML). Every page using `ChatShell` benefits, including AA's `/bot-lab`, which is being built on it right now: keep the component's props and behaviour otherwise unchanged, and tell AA in your report what changed.
2. **`/print/<route>` 404s;** only `/print/experiments/<name>` works. Make `/print/<route>` print the experiment's document when `<route>` is an experiment route (look up the doc by its `route:`), keeping content paths working.
3. **Tests outside `pnpm test`:** `app/spiral/pieces.test.mjs` (moving to `app/gpt-2/` under AE; match both or glob `app/**/*.test.mjs`), `app/knowledge-voice/comparison.test.mjs`, and any markov or tics tests in `app/`. Make `pnpm test` run every `*.test.mjs` in the app; report the count.
4. **`/mini-claw` writes to the tracked `mini-claw/memory.md`** on every run, so a demo dirties the repo. Make runs write a gitignored working copy seeded from the tracked file (or another simple fix), with a "reset memory" button; say what you chose.

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## Added from the visual review

5. **Tab titles:** six pages show the slug in the browser tab ("markov", "spiral", "by-hand", "persona-dial", "fine-tune", "rosie and roomba"). Give each a readable title in its `page.jsx` metadata (only that line; skip `by-hand`, D is doing it, and `spiral`/`gpt-2`, AE is). Check the rest of the routes too.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
