---
task: "AB"
title: "Student keys: test workshop-keys for real, then /keys in the course app"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "in `apps/workshop-keys` (its own repo, nested in The Notebook): fixes found by testing, committed there by path; here: `nextjs/app/keys/`, `nextjs/app/api/keys/`, `nextjs/lib/workshop-keys/`, `nextjs/content/experiments/keys.md`"
depends_on: "a management key from Marlon for part 2"
report: "../reports/AB-keys.md"
---
# AB. Student keys

Moment 1 of today's arc is setup: Claude Desktop **and keys**. The key dispenser is `/Users/mk/Development/mk-27/apps/the-notebook/apps/workshop-keys` (read its `README.md`, `AGENTS.md`, and The Notebook's project note `_context/projects/50-in-focus/workshop-keys/README.md`): one OpenRouter workspace per workshop with a pooled budget, students claim a key by name and password, keys expire. It has only been tested against a mock. Its claim app is deployed at https://workshop-keys-one.vercel.app but unconfigured. Marlon (2026-10-20): "we should also start testing those keys. ultimately this week maybe the key-dispenser should just be /keys in the course app?"

**Part 1, now (no management key needed):** run its mock tests and the whole flow against `tests/mock-openrouter.mjs`; read `nextjs/lib/openrouter.mjs` against OpenRouter's current management/provisioning API docs (endpoints, workspace and budget support, key expiry) and list anything that has changed or that the mock gets wrong. Check the deployed claim app loads. Fix real bugs in workshop-keys, committed in that repo by path, authored as mkuzmick; don't push.

**Part 2, needs Marlon:** the course app's `OPENROUTER_API_KEY` is an ordinary key, not a management key (checked 08:15: `GET /api/v1/keys` returns 401), so it can't mint keys. Ask Marlon in your chat to create a management key **with a short expiry** and put it in `apps/workshop-keys/.env` himself (don't ask him to paste it into chat). Then test for real with a tiny budget: `setup` a throwaway workspace (budget $2), `open`, claim one key through the deployed app if it's configured (or the CLI's `mint`), make one cheap model call with the claimed key, `status`, then `teardown --yes`. Configuring the Vercel project's environment variables and redeploying is Marlon's call: ask, with the exact variables, before touching it. Record what worked, with times.

**Part 3, `/keys` in the course app:** port the claim page and `POST /api/claim` into this app as `/keys` and `/api/keys/claim`, importing or copying `lib/openrouter.mjs` into `nextjs/lib/workshop-keys/` (say which), so the course app can hand out keys when it's deployed. It reads `OPENROUTER_MANAGEMENT_KEY`, `WORKSHOP_SLUG`, `WORKSHOP_TITLE`, `CLAIM_PASSWORD` from `nextjs/.env.local` (add names to `.env.example`, never values) and refuses politely when they're missing. Note: running on Marlon's laptop, `/keys` reaches only his machine; for students it needs a deployed app, so today's room still uses the deployed claim app unless Marlon decides otherwise.

**Never print, log, or commit a key** (management or student), including in your report and screenshots.

**Testing:** use the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. If you need a headless browser and the Playwright tools say the browser is in use, write your own driver in your scratchpad using the Playwright install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` (load it with `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` to `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, and `waitUntil: "load"`, never `networkidle`, against Next dev).

**Spending:** the app's `OPENROUTER_API_KEY` had about $25 left of its limit at 08:15 on 2026-10-20. Test with short prompts and cheap models where you can; report roughly what you spent.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
