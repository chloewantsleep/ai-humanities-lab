---
title: "Vercel and local readiness — AG"
date: 2026-10-20
author: Codex
status: "Preparation only; deployment blocked pending content review and Marlon's choice"
thread_id: 01a158f2-cff1-72a0-9cb0-a14e0571874b
started_in: /Users/mk/Development/mk-27/apps/the-notebook
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && codex resume 01a158f2-cff1-72a0-9cb0-a14e0571874b"
---

# Deployment preparation

Nothing was deployed, no Vercel project was created, and no Vercel setting was changed. Instructions below are for Marlon to carry out after choosing to deploy. No CLI linking or Vercel account inspection was performed.

## Access and spending protection

`nextjs/proxy.js` uses Next 16's request proxy. It covers every path, including all APIs, Markdown, history media, public text files, and framework assets. Browser login: username **class**, password supplied privately through `CLASS_PASSWORD`. Visiting the site normally prompts once; same-origin browser fetches then use the cached Basic credentials. Never put credentials in a URL. Use HTTPS for a deployed site; Basic authentication is encoded, not encrypted on its own.

With `CLASS_PASSWORD` set, local development is protected too. Without it, only `NODE_ENV=development` with no `VERCEL` environment variable is open. Production `pnpm start` and Vercel deployments return **503** for every path if the password is missing or blank. Wrong or missing credentials return **401** before a handler can call OpenRouter. Authenticated cross-origin writes return **403**. Responses use `private, no-store`; the password header is stripped before passing to handlers. There is no public API exception, even for `/api/keys/status`.

This is shared class access, not per-student identity or a spending cap. Anyone who knows the password can make repeated paid requests. Set a separate low, finite limit on the app's OpenRouter key before deployment, watch its balance, rotate the class password if shared beyond class, and disable the model key to stop model spending. OpenRouter supports credit limits and disabling keys through its [management API](https://openrouter.ai/docs/guides/overview/auth/management-api-keys). No key or limit was changed by AG.

No in-memory IP counter was added: it would reset and split across serverless instances, and classroom users can share one public IP. A reliable shared limiter needs platform rules or shared storage. If abuse becomes a concern, Marlon can configure a Vercel Firewall rate-limit rule for `/api/*`, after choosing a classroom-safe threshold. The class password and OpenRouter budget must remain the primary controls. Vercel's separate hosting budget does not cap direct OpenRouter charges.

## Server-route inventory

Inventory refreshed from source on October 20 after AA, AI, and O added routes. Every future path is gated automatically, but its own permissions, input limits, and secret handling still need review. The build snapshot predates O's two Ensemble routes.

| Route | Methods and purpose | Secret or cost | Deployment concern |
| --- | --- | --- | --- |
| `/api/chat` | POST, streamed model replies | `OPENROUTER_API_KEY`; `CHAT_MODEL` supplies the default; caller can select a model; max 2,048 output tokens per call | Many pages share this endpoint: bot-lab, chat-demo, chat-ui, by-hand's Claude column, layers, retrieval, knowledge-voice, tics. A password holder can select a more expensive model; use a limited key. |
| `/api/mini-claw` | GET workspace; POST agent; DELETE working-memory reset | POST with Claude uses the same model key; scripted mode does not | Workspace is `../mini-claw`; writes local memory and notes. Current implementation needs a writable filesystem and is not ready for durable serverless use. |
| `/api/keys/claim` | POST, issues/replaces a student key; optional env-file format | `OPENROUTER_MANAGEMENT_KEY`, `CLAIM_PASSWORD`, `WORKSHOP_SLUG`; can mint credentials that spend workshop credit | AB's own password and claim window still apply inside class access. Budget and live provisioning require AB validation. |
| `/api/keys/status` | GET, claim-window status | Management key reads OpenRouter workspace if configured | No secret returned, but still behind class gate. |
| `/context-media/[...path]` | GET, allowlisted images/PDFs inside `content` | No provider key; private screenshots may be served | Unredacted history is a release blocker. |
| `/fine-tune/files/[asset]` | GET, four allowlisted notebook/readme/dialogue downloads | No provider key; reads `../fine-tune` | Verify sibling files are traced into deployed functions; a local build alone doesn't prove that. |
| `/api/bot-room` | POST, one bot turn or a director's decision | `OPENROUTER_API_KEY`; bot model may be caller-selected; turn cap 1,024 output tokens, director cap 120 | Every turn/director call can spend credit; not a single call for the whole conversation. |
| `/api/bot-lab/bots` | GET list/load; POST save a bot | No provider key for file operations; default model name from `CHAT_MODEL` | Writes `nextjs/bots`, shared by all users of the local instance. Serverless saving requires a storage design; download is the local fallback. |
| `/api/bot-lab/knowledge` | GET list; POST save reference text | No provider key for file operations | Writes `nextjs/bots/knowledge`; same storage limitation and class-wide access. |
| `/api/ensemble` | GET harness state; POST simulated message/reset | `ENSEMBLE_HARNESS_URL`, default localhost:3031 | Forwards to a separately running harness. Vercel's localhost is not Marlon's laptop; requires a separately hosted, authenticated harness design. Not in the build snapshot. |
| `/api/ensemble/bots` | POST save submitted bot/knowledge | No direct provider key | Same bot-file storage limitation. Not in the build snapshot. |

Browser Basic auth occupies `Authorization`. Future BYOK support should use a separate explicit header and handler validation, not replace class authentication. Slack event webhooks would need a separate signed endpoint design; the Next app has no such endpoint in this inventory. Slack's credentials belong to its separately running harness, not this Next deployment.

CLI clients calling protected endpoints must also provide Basic credentials. AB's starter `claim-key.sh` is not automatically compatible with a gated host: use the browser `/keys` flow or adapt it to prompt for credentials without exposing them. Do not exempt the claim API from protection to make a script work.

## Which parts work without an OpenRouter key

After class login on a deployment (or directly in local development): ELIZA, Markov, browser-model engine/GPT-2, the local columns of by-hand, retrieval and RAG search, get-ready, reading rooms, Rosie/Roomba, documents, glossary, and the history/story text do not need an OpenRouter key. Browser models still need initial external downloads. Retrieval/RAG's **Ask Claude**, by-hand's Claude column, chat-demo/chat-ui, bot-lab replies, bot-room turns/director, layers' replies, knowledge-voice and tics' paid comparisons need the server model key. Bot-lab editing is key-free but saving requires writable storage. Mini-claw's scripted mode is key-free but still has filesystem requirements. `/keys` needs AB's management configuration and a provisioned workshop. Fine-tune's downloads are key-free; training runs separately, for example in Colab. This is a source inventory, not a claim that every page was exercised by AG.

## Account and repository decision

Current private remote: `https://github.com/ll-26-27/mk-chatbot-experiments.git`. Source commits are authored as **mkuzmick**. The brief identifies **Process Black's paid Vercel account** as the deployment account. The mk-27 deployment rule calls for a standalone repo under `bok-learning-lab` for PB deployment, while this repo is under `ll-26-27`. **Marlon must choose whether to authorize this repo's GitHub access from PB's Vercel team or provide a separate approved deployment repo under `bok-learning-lab`.** AG did not transfer, create, change visibility, or reconnect any repo. Do not deploy the workbook or The Notebook parent repositories.

## What Marlon will click, after the blockers are resolved

1. Sign in to Vercel as **Process Black** and select the Lab's paid team. Choose **Add New → Project**, then import the approved standalone repository. If it is absent, use the GitHub integration's repository-access control for that repo only. Importing eventually creates a project; this is a future action, not done here.
2. In the import form choose **Next.js**, **Root Directory → Edit → nextjs**, and Node **22.x**. Set install command `pnpm install --frozen-lockfile`, build command `pnpm build`, and keep the framework's default output directory. The app pins pnpm 10.28.0. Confirm the version in the first build log. [Vercel build settings](https://vercel.com/docs/builds/configure-a-build) document the root and command controls.
3. Because the app refers to sibling `mini-claw/` and `fine-tune/`, enable **Include source files outside of the Root Directory in the Build Step**, if shown. This permits access during build; it does not guarantee dynamic sibling files enter the function bundles. Resolve the mini-claw storage design and verify function tracing before treating those routes as deployed features.
4. Expand **Environment Variables** and add the names from the next table, with values entered privately. Set `CLASS_PASSWORD` for **Production and Preview**; do not put it or any key in a `NEXT_PUBLIC_` variable. Omit management credentials until AB's provisioning is approved. For later edits use **Project → Settings → Environment Variables**; changes apply to new deployments. [Environment-variable documentation](https://vercel.com/docs/environment-variables).
5. **Stop before Deploy until Marlon approves publication**, the screenshots are redacted/removed, the repo/account choice is resolved, and storage-sensitive routes are addressed. At that point Marlon can click **Deploy**. Check an incognito request gets 401, a wrong login fails, a valid login opens ELIZA, and a direct API request without login is refused before making a short paid test.
6. After project creation, inspect **Project → Settings → Deployment Protection**. Choose protection for the intended deployment URLs; do not assume preview-only protection covers production. Avoid requiring individual Vercel accounts for students unless intended. The app password remains in place. [Deployment Protection](https://vercel.com/docs/deployment-protection).
7. In **Team → Settings → Spend Management**, review the on-demand budget and notification options. Vercel can pause production deployments at a threshold, but this affects **all projects in that team** and is not instantaneous. Marlon must choose the amount and team-wide consequence; no amount was set here. [Spend Management](https://vercel.com/docs/spend-management).

## Environment names

| Name | Use |
| --- | --- |
| `CLASS_PASSWORD` | Required on every deployment and for `pnpm start`; optional in local dev. Username is fixed to `class`. |
| `OPENROUTER_API_KEY` | Ordinary limited inference key, optional for key-free pages. |
| `CHAT_MODEL` | Optional model identifier; current default is defined by `/api/chat`. |
| `OPENROUTER_MANAGEMENT_KEY` | Optional privileged credential for `/keys`; only after AB approves live setup. Never substitute this for an inference key. |
| `WORKSHOP_SLUG`, `WORKSHOP_TITLE`, `CLAIM_PASSWORD` | Optional workshop claim configuration; claim password is separate from class login. |
| `MAX_KEYS`, `KEY_TTL_HOURS` | Optional claim settings; code defaults to 40 keys and six-hour expiry. |
| `ENSEMBLE_HARNESS_URL` | Optional address of O's separately running harness; defaults to local port 3031. Do not point a deployed app at an unauthenticated public harness. |

All values stay in the platform settings or gitignored `nextjs/.env.local`. Leave the test-only `OPENROUTER_API_URL` unset on a deployment. This preparation adds no Vercel configuration file; the standard Next.js preset and explicit root are sufficient to attempt a build.

## Assets, model downloads, and release blockers

Disk measurements before the build: `public/retrieval` **3,248 KiB**, `public/workshop/texts` **3,432 KiB**, `content/history/_images` **26,148 KiB** (about 25.5 MiB), all `content` **27,664 KiB**, all `public` **6,680 KiB**. These are allocated disk sizes, not compressed transfer sizes or total Vercel artifact size. `next.config.mjs` traces `content/**/*` into routes, including the screenshots. **Do not publish these screenshots until cropped/redacted and approved (task K).** A class gate does not replace that review.

Browser model weights/tokenizers come from **huggingface.co** and its download/CDN hosts. ONNX browser runtime assets default to **cdn.jsdelivr.net**. Confirmed in the installed Transformers.js source (`src/env.js` and `src/backends/onnx.js`), with no custom host override in this app. These large model downloads do not come from Vercel, though the app's code, text corpora, screenshots, and other same-origin assets do. No model weights were added to `public/`.

The filesystem mini-claw and bot-file save implementations need a storage decision: Vercel function files are not a durable shared workspace. Their current write paths are beside the code, not a `/tmp` adaptation. Fine-tune's four download files and mini-claw's seed **were found in their local build traces**, so these particular reads are not missing from the inspected snapshot. Actual Vercel packaging and runtime access remain untested. O's localhost harness needs separate hosting. Report these to AF/H, AA, O, and the orchestrator rather than silently presenting the whole app as serverless-ready.

## Build and local verification

**Build passed** with Next 16.3.6 in `/private/tmp/ag-vercel-build-dzs7gaeo/nextjs`. A second build in that same copy passed after the browser check exposed and prompted a correction to the gate's public-host comparison. Both builds stayed outside the working tree. The copy excludes all `.env*` files and the shared `.next`; it includes an independent copy of installed dependencies. No real provider or management credentials were used. Host tools were Node 25.6.1 and pnpm 10.7.0; Node 22 and the pinned pnpm 10.28.0 have not been exercised here.

The first build compiled in 13.3 seconds; the incremental gate rebuild compiled in 1.2 seconds. Five broad filesystem-tracing warnings pointed at `app/bot-room/page.jsx:21` and `lib/bots.mjs:111–114` (tasks AI/AA). The initial output measured **214,448,352 bytes** for `.next` including caches, **42,143,898 bytes** for `.next/server`, and **30,460,456 bytes** for `.next/static`. This is not a Vercel function-size or compressed-deployment measurement. The fine-tune, mini-claw, and bot-lab traces inspected included the history images; none of those inspected traces included an `.env*` file. Reduce broad tracing before release.

Focused gate tests pass. HTTP integration on a temporary production server on port 3107 confirmed 503 with no password, 401 without credentials (including hypothetical future APIs and text/download assets), 200 for authenticated pages/assets, 403 for cross-origin POST, and handler validation/missing-key errors after valid authentication. Chromium opened the guide with Basic credentials, loaded its assets, and made a same-origin API fetch successfully through the gate (503 from the absent model key, with no paid call). No page errors; screenshot `/private/tmp/ag-run-locally.png` was inspected. The temporary production server was stopped afterward.

The broader snapshot's `pnpm test` passed **61/62**. Its failure is `tests/content.test.mjs:12`, whose one-segment route regex rejects `/workshop/claude-desktop` in an experiment document added by AD. No files owned by AD were changed. The shared dev server returned 200 for ELIZA and 400 for malformed chat/mini-claw requests without paid calls; the first guide request returned 500 despite including the guide title, then a retry returned **200** with the guide title. Marlon's server was not restarted.

Run the focused gate checks from the repository root:

```sh
node --test _context/deploy/proxy.test.mjs
```

Student guide: `/workshop/run-locally` (`nextjs/content/workshop/run-locally.md`), marked draft pending the student repo choice. The shared dev server remains Marlon's at http://localhost:3000. Do not start another server against its `.next/`.

## Update, 20 Oct 2026 (afternoon)

The class-password gate was removed at Madeleine's request: the deployment is open to anyone with the link. `nextjs/proxy.js` now only refuses cross-origin writes. `CLASS_PASSWORD` is no longer read, and its test (`proxy.test.mjs`) was removed. Keep the OpenRouter key's credit limit low, and rotate the Airtable token after class.
