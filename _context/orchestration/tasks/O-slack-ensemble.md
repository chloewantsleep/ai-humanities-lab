---
task: "O"
title: "The Slack Ensemble: every student's bot in Slack today"
status: "not started"
track: "MVP for the October 20 workshop (the finale)"
owns: "`slack-ensemble/` (new folder at the repo root: the harness, its manifest, its README, its own package.json), `nextjs/app/ensemble/` (the submission page and the room preview), `nextjs/app/api/ensemble/`, `nextjs/content/experiments/ensemble.md`"
depends_on: "the bot format in `nextjs/bots/README.md` (set; read it, don't change it); AA writes `nextjs/lib/bots.mjs`, which you may import once it lands, but you can read the files to the same spec yourself"
report: "../reports/O-slack-ensemble.md"
---
# O. The Slack Ensemble

**Marlon (voice session, 2026-10-20):** "This is the treat. Their bots must be in Slack today. Each student submits their bot as a member of the AI Humanities Lab Ensemble. We show it today but don't teach how until next time, then let that world run and show how it evolved by then." And: this "means bots can't be insanely logically complex." Read the session record first: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/handoffs/20261020-voice-session-run-of-show-and-repo.md` (moment 11 and the build requests), and the run of show beside it. Build it here, in `slack-ensemble/`, for now; Marlon may later move it into the students' repo, so keep it self-contained.

**The bot** is the shared format in `nextjs/bots/README.md`: one Markdown file per bot (name, author, model, emoji, one optional short text; the body is the system prompt). Students write that file in today's chat app (task AA) and submit it.

**Build:**

1. **The harness** (`slack-ensemble/`): one Slack app that speaks as every bot. Use Socket Mode with Bolt for JavaScript, as The Notebook Ensemble does (`/Users/mk/Development/mk-27/apps/the-notebook/apps/notebook-ensemble/`, read its README and `app.js` for the pattern; don't change it and don't use its tokens). Post each bot's replies with its own display name and icon (`chat:write.customize`, `username` and `icon_emoji`/`icon_url` on `chat.postMessage`). Replies go through OpenRouter (`OPENROUTER_API_KEY` in `slack-ensemble/.env`, gitignored; `.env.example` lists the variable names only). Behaviour to start, simple and safe: a bot answers when @-mentioned by its name or slug, or when addressed in a thread it's already in; each reply sees the thread so far. Guard against loops: a bot never answers another bot unless a human started that thread, and at most N bot turns per thread (N small, configurable). Rate-limit per bot. Log every reply to a local JSONL so "how that world evolved" can be shown on Oct 27.
2. **The manifest** (`slack-ensemble/slack-manifest.json`) for a new app, "AI Humanities Lab Ensemble," for Marlon to create at api.slack.com: Socket Mode, the fewest scopes that work, and a README section with the install steps. **Which Slack workspace the students are in is Marlon's call**; ask in your chat if you need it, and write the steps so they work in either.
3. **Submission.** Students must be able to submit a bot in class in under two minutes. Propose and build the simplest path that works with the app running on Marlon's laptop. A strong candidate: a `/ensemble` page in the course app where a student pastes or uploads their bot file, the page validates it against the format, shows how it will look in Slack, and saves it to `bots/<slug>.md` (the harness reloads `bots/` on change). Another: a Slack slash command or a message in a submissions channel. Say which you built and why.
4. **A dry run.** Until Marlon has created the app and its tokens, run the harness with `--dry-run` against a local simulated room: the `/ensemble` page shows a pretend channel where you can @-mention submitted bots and watch them answer (and, within the loop limits, answer each other). This is also what Marlon shows if Slack isn't ready.

**Don't post to any real Slack workspace** until Marlon says to, in your chat, with the workspace and channel. Never print or commit a token or key. Keep the room's bots in `bots/`; commit only `bots/_examples/` (add `bots/*.md` except README to `.gitignore`, since students' bots are theirs, and say so in the report).

**Done looks like:** a student-written bot file goes from the submission page to an answer in the simulated room in under two minutes; the harness starts with `pnpm start` in `slack-ensemble/` and refuses to run live without tokens; the README has Marlon's install steps; tests for the loop guard and the bot-file parsing.

**Testing:** use the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. If you need a headless browser and the Playwright tools say the browser is in use, write your own driver in your scratchpad using the Playwright install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` (load it with `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` to `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, and `waitUntil: "load"`, never `networkidle`, against Next dev).

**Spending:** the app's `OPENROUTER_API_KEY` had about $25 left of its limit at 08:15 on 2026-10-20. Test with short prompts and cheap models where you can; report roughly what you spent.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
