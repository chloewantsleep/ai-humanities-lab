---
task: "AG"
title: "Ready for Vercel and for running locally: spending protection, environment, and a run-it-yourself guide"
status: "not started"
track: "MVP prep (no deploy without Marlon)"
owns: "`_context/deploy/` (new), `nextjs/proxy.js` or the Next 16 equivalent (new), `nextjs/.env.example` (names only), `nextjs/content/workshop/run-locally.md` (new), `nextjs/vercel.json` if needed"
depends_on: "start now"
report: "../reports/AG-vercel-and-local.md"
---
# AG. Vercel and local

Marlon (2026-10-20): "we will be putting the ultimate site on vercel but also helping them run it locally." Today the site runs only on his laptop. **Don't deploy, create a Vercel project, or change any Vercel setting**: prepare everything so Marlon can, and say exactly what he must click.

1. **Spending protection first.** A public deploy with the app's `OPENROUTER_API_KEY` would let anyone spend it through `/api/chat`, `/api/mini-claw`, and any new API routes (`/api/bot-lab`, `/api/keys`, `/api/ensemble` are landing today). Inventory every server route that spends money or needs a secret. Propose and build the simplest protection that works for a class: e.g. a shared class password checked by Next 16's request proxy (read `node_modules/next/dist/docs/` for the current name and API; it was "middleware" before 16) on paid routes, or bring-your-own-key (the student's claimed key in a header), or both; plus per-IP rate limits if cheap. Test it locally against the dev server.
2. **What a deploy needs** (`_context/deploy/vercel.md`): repo and account (the Lab's paid Vercel is Process Black's, which can deploy private repos; see The Notebook's `AGENTS.md` and the mk-27 deployment rule), root directory `nextjs`, env vars (names only), which pages work with no key, how big the build is (`public/retrieval`, `public/workshop/texts`, `content/history/_images` at 26 MB, which must not be public until redacted), model downloads come from Hugging Face and jsDelivr, not Vercel. Run `pnpm build` once **in a copy of the repo outside this working tree** (a shared `.next/` would break Marlon's dev server) and record whether it builds.
3. **Running locally** (`content/workshop/run-locally.md`, rendered at `/workshop/run-locally`): for a student with Claude Desktop and no coding background: get the repo, install Node and pnpm, `pnpm install`, put their key in `.env.local` (or `/setup-key` from workshop-keys' starter), `pnpm dev`, open localhost:3000; with a "ask Claude Code to do it" version of each step and the three things most likely to go wrong. Mark it draft until Marlon decides the student repo.

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## When you finish

Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
