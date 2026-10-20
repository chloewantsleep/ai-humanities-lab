---
task: "AI"
title: "/bot-room: two or three bots in one conversation"
status: "not started"
track: "prototype"
owns: "`nextjs/app/bot-room/`, `nextjs/app/api/bot-room/`, `nextjs/content/experiments/bot-room.md`"
depends_on: "the bot format (`nextjs/bots/README.md`); AA's `nextjs/lib/bots.mjs` once it lands (read the files to the spec yourself until then)"
report: "../reports/AI-bot-room.md"
---
# AI. The bot room

Marlon (voice session, 2026-10-20): a "multi-bot page" where "students put two or three bots in conversation, or working together"; it's where "custom bot to personal agent" "echoes in the build, on the many-agents page where students define two or three bots and have them work together." Read the record: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/handoffs/20261020-voice-session-run-of-show-and-repo.md`.

**Build `/bot-room`:** pick two or three bots (files in the shared format: `bots/_examples/`, `bots/`, or written on the spot), give the room a starting line or a task, and run turns: round-robin, or a "director" choosing who speaks next (show which, and why). A "working together" mode where the bots share a task (e.g. two readers and an editor producing one paragraph about a course text) with the shared draft visible. Show each bot exactly what it received (its own system prompt plus the transcript, with the others' turns labeled). Turn limit and stop button; a cost estimate per run (each turn is a paid call through OpenRouter).

**Not the same as O:** task O builds the Slack Ensemble and a simulated Slack room at `/ensemble`; this is the in-browser design space for multi-bot interplay. Read O's brief so you don't duplicate it, don't import its code, and say in your report what O could borrow (e.g. turn-taking rules).

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
