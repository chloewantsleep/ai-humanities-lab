---
task: "AC"
title: "The familiar chat interfaces: assistant-ui's stock thread, and Vercel's AI chatbot starter"
status: "not started"
track: "prototype (feeds the student repo)"
owns: "`nextjs/app/chat-ui/`, `nextjs/content/experiments/chat-ui.md`, `_context/chat-interfaces/` (new), a scratch clone outside the repo"
depends_on: "B (`/api/chat`, the shared shell)"
report: "../reports/AC-chat-interfaces.md"
---
# AC. The familiar chat interfaces

Marlon (2026-10-20): "do we have the actual chatbot interface yet? from assistant-ui and then also vercel ai starter?" What exists: B built `/chat-demo` and a shared `ChatShell` on assistant-ui's **primitives** with plain CSS, streaming from `/api/chat` with the AI SDK through OpenRouter. What doesn't: assistant-ui's own styled, ChatGPT-like thread as it ships, or Vercel's AI chatbot starter. Students should see (and the student repo may start from) a chat interface that looks like the products they know.

1. **`/chat-ui`: assistant-ui as it ships.** Add assistant-ui's stock styled thread (follow its current docs and the installed package's types in `node_modules/@assistant-ui/`; versions here are newer than most training data) wired to our `/api/chat`, so a student sees the familiar interface: message list, composer, edit and regenerate, copy, markdown and code rendering, thread welcome with suggestions. If the stock UI needs Tailwind or shadcn, which this app doesn't use, don't add them to the whole app: scope it (a route-level stylesheet, or plain-CSS equivalents of its components) and say what you chose and why. Note in the page document how this differs from `/chat-demo` (same primitives, same backend, different skin) — that's a lesson about interfaces.
2. **Vercel's AI chatbot starter: evaluate, don't merge.** Find Vercel's current official AI chatbot template (and its docs), clone it into a scratch folder **outside this repo**, and find out what it needs to run (database, auth, blob storage, AI Gateway or provider keys) and whether it can run with only an OpenRouter key and no database. Run it if that's quick, without creating any cloud resources or accounts. Write `_context/chat-interfaces/vercel-ai-chatbot.md`: what it is, what it needs, how long setup takes, what a student would learn from it, and a recommendation for the student repo (start from it, borrow from it, or link to it), compared with assistant-ui.

Don't change `ChatShell.jsx`, `/chat-demo`, or `/api/chat` (AA may touch `/api/chat` today). pnpm only.

**Testing:** use the shared dev server at http://localhost:3000; don't start a second dev server in `nextjs/` (a separate port for the scratch Vercel clone is fine). For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` to `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"`.

**Spending:** the app's key had about $25 left at 08:15; keep test prompts short.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
