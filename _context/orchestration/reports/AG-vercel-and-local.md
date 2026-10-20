---
task: AG
thread_id: 01a158f2-cff1-72a0-9cb0-a14e0571874b
agent: Codex
started_in: /Users/mk/Development/mk-27/apps/the-notebook
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && codex resume 01a158f2-cff1-72a0-9cb0-a14e0571874b"
status: "Complete: preparation and local verification; not deployed"
date: 2026-10-20
---

## What I built

- `nextjs/proxy.js`: a site-wide Basic authentication gate (username `class`, private `CLASS_PASSWORD`), covering pages, static assets, downloads, every existing API, and future API paths. Missing password fails closed with 503 for production/Vercel. Local `pnpm dev` remains open when the password is unset. Wrong/missing credentials return 401; authenticated cross-origin writes return 403. Protected responses are not publicly cached, and class credentials are stripped before handlers. The public Host header is used for Origin comparison because Next can use an internal hostname in `request.url`.
- `_context/deploy/proxy.test.mjs`: focused automated checks for local/deployed behavior, unauthorized GET/POST, invalid credentials, future APIs, static/media paths, same-origin and cross-origin writes, and reverse-proxy host/protocol handling. Run separately from `pnpm test`.
- `nextjs/.env.example`: added the blank `CLASS_PASSWORD`, `MAX_KEYS`, `KEY_TTL_HOURS`, and `ENSEMBLE_HARNESS_URL` names and comments. Preserved AB's previously committed management/claim settings. No `.env.local` was edited or copied.
- `_context/deploy/vercel.md`: current server-route/secret/cost inventory, account/repo choice, future dashboard steps, environment names, asset sizes, model-download origins, test/build evidence, and deployment blockers. It includes this thread ID and starting directory.
- `nextjs/content/workshop/run-locally.md`, rendered at `/workshop/run-locally`: draft student guide with download/install/key/start steps, a Claude Code prompt for each, and three likely snags. It explicitly waits for Marlon's student-repo choice and distinguishes `/keys` from another starter's `/setup-key`.

No deployment, project creation, Vercel setting change, account switch, remote push, parent submodule-pointer update, board edit, or message to Slack occurred. Git author was `mkuzmick <29003991+mkuzmick@users.noreply.github.com>`.

## How to try it

On Marlon's existing server: http://localhost:3000/workshop/run-locally. Read the draft notice, then the five setup steps and troubleshooting list. The last shared-server request returned **200** with the guide title. ELIZA returned 200, and deliberately invalid chat/mini-claw POSTs returned 400 without model calls. An earlier guide request returned 500 during concurrent edits; the retry recovered without restarting the shared server.

From the project root, run `node --test _context/deploy/proxy.test.mjs` for the gate checks. To activate the browser gate locally later, Marlon can enter a private `CLASS_PASSWORD` in `nextjs/.env.local` and restart his server himself; username is `class`. Production always requires that variable. No password was chosen or installed for him by this task.

For deployment preparation, read `_context/deploy/vercel.md`; the click sequence is written for Marlon to use after resolving its blockers and authorizing publication. Do not deploy this checkout merely because the local build passed.

## Commits

- `22fda98` — Add class access protection and local deployment preparation (all five implementation/documentation paths, committed explicitly by path).
- This report is committed separately by its exact path; its commit is reported in the final chat and available in `git log -- _context/orchestration/reports/AG-vercel-and-local.md`.

## What I couldn't do or didn't check

**Verified:** two successful `pnpm build` runs, both solely in `/private/tmp/ag-vercel-build-dzs7gaeo/nextjs`, an independent copy excluding all `.env*`, `.vercel`, and the shared `.next`. The second run followed a browser-discovered Origin/host bug in the new gate, which was fixed and regression-checked. The initial build compiled in 13.3 seconds; the incremental rebuild compiled in 1.2 seconds. Tools were Next 16.3.6, Node 25.6.1, pnpm 10.7.0. A fresh Node 22/pnpm 10.28.0 installation was not tested.

**Verified:** an isolated temporary production server on 127.0.0.1:3107, first without a password (503), then with synthetic test credentials. Unauthenticated requests were refused (401), including future API names and public text/download paths; authenticated pages and downloads loaded (200); a foreign Origin POST was refused (403). Validly authenticated malformed/missing-key requests reached the relevant handler without calling a provider. Chromium authenticated, rendered the guide and loaded its assets, and sent a same-origin browser fetch through the gate. No browser page errors. Screenshot `/private/tmp/ag-run-locally.png` was visually inspected. The temporary server and browser were stopped; port 3107 had no listener afterward. Test script: `/private/tmp/ag-verify-local.mjs`. No paid model call, workshop key issuance, or live Slack action was used.

**Broader check:** the copied snapshot's `pnpm test` passed **61/62**. The failure is `tests/content.test.mjs:12`: its one-segment route regex rejects the experiment route `/workshop/claude-desktop`. This is outside AG's owned paths; no route/test shared by another task was changed. The focused gate test passes.

**Build warnings and size:** five warnings report broad filesystem tracing at `app/bot-room/page.jsx:21` and `lib/bots.mjs:111–114`. Initial `.next` measured 214,448,352 bytes including caches, with 42,143,898 bytes under `.next/server` and 30,460,456 under `.next/static`; these are local output bytes, not a Vercel deployment-size measurement. The inspected fine-tune trace contains all four allowlisted download files, and mini-claw's trace contains its seed. Inspected fine-tune, mini-claw, and bot-lab traces contain history images and no `.env*` entries. The copy captured a mixed working tree while agents were active; O's Ensemble routes landed after that snapshot. Their source was inventoried, and the proxy covers them, but they were not included in these builds.

**Still blocks release:** unredacted screenshots (~26 MB); repo/account authorization choice; writable/shared storage for mini-claw and bot-lab/Ensemble saves; separate hosting/authentication for the Ensemble harness; broad file tracing. No Vercel function packaging, real dashboard/account settings, deployment protection, live budgets, fresh student-machine install, or slow-device browser-model downloads were tested. No reliable distributed IP limiter was added: the docs explain why an in-memory counter is insufficient and describe the platform option. The shared class password is access control, not a per-student budget; a separately limited OpenRouter key remains necessary.

## For other tasks

- **Orchestrator:** prep is complete, with blockers in `_context/deploy/vercel.md`. Do not deploy yet. Current repo is private under `ll-26-27`, while the workbook deployment rule calls for a PB standalone repo under `bok-learning-lab`. Marlon must choose the approved repo/account arrangement. Inventory includes chat, mini-claw, keys, bot-room, bot-lab file APIs, Ensemble routes, context-media, and fine-tune downloads.
- **AA / AI:** shared-password users can select potentially expensive models through chat/bot-room. Use an OpenRouter cap; a future model allowlist or per-student credentials would be separate work. Bot files/knowledge saves need a serverless storage decision. The build traced the whole project from the bots reader; narrow/explicit tracing is needed before release.
- **AB:** `/keys` and its claim/status APIs are behind the site gate. Existing claim-password/window checks still apply. A command-line `claim-key.sh` caller needs Basic credentials too; the browser flow works with the gate. Do not exempt the claim API. Management-key live provisioning was not attempted. Optional claim variables are now named in `.env.example`.
- **O:** `/api/ensemble` and `/api/ensemble/bots` are protected. The harness defaults to laptop localhost:3031, which will not be reachable as the same localhost from Vercel. Publishing needs an authenticated remote service design and durable bot storage. Browser Basic login uses `Authorization`; future BYOK or integrations need separate handling. A Slack webhook would require a deliberately designed signed route, not an accidental gate exception.
- **AF / H:** mini-claw's seed is traced, but the workspace still writes beside the app. That is a local feature until its storage design changes.
- **K:** all 43 history images are traced into the build; public publication still waits for crop/redaction approval.
- **AD / R:** the snapshot test rejects nested experiment `route:` values, specifically `/workshop/claude-desktop`; update its assumption to match the intended new document routes. AG's draft `/workshop/run-locally` is available for workshop navigation, but AG did not edit shared navigation files.
- **AE:** local guide explains Hugging Face/jsDelivr downloads and the key-free browser models; first-use performance was not retested by AG.

## Marlon's words

In this thread: “Don't deploy, and don't create or change anything on Vercel; run any production build in a copy outside this working tree.”

In this thread: “Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9).”

After interrupting a local-test approval request: “sorry i meant go ahead”.

Quoted in the task brief, attributed there to October 20: “we will be putting the ultimate site on vercel but also helping them run it locally.”

## Decisions and open questions

AG chose a whole-site class-password gate, which protects new paid endpoints automatically and avoids an additional app login UI. Local development without a configured class password stays available. The gate provides no individual identity, logout button, model allowlist, or distributed quota. Browsers can retain Basic credentials until their session is closed; credential rotation requires a server restart/redeploy.

Marlon still chooses the student repository, approved deployment repo/team, class password, finite model budget, screenshot disposition, and whether filesystem/harness features should stay local or gain hosted storage/services. The draft local guide and the deployment notes identify those choices; none was silently resolved through a Vercel action.
