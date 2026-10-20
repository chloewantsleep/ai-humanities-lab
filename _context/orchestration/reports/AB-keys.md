---
task: "AB"
thread_id: "0eb5f30c-df85-41fe-af61-fdec77f9cbb8"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 0eb5f30c-df85-41fe-af61-fdec77f9cbb8"
status: "parts 1 and 3 done; part 2 (live test) waiting for Marlon's management key in apps/workshop-keys/.env"
---

# AB. Student keys — report

## What I built

**Part 1, workshop-keys tested against the mock and the docs.**
- Whole flow against `tests/mock-openrouter.mjs`: `setup` (budget $2), `open`, claims through `lib/claim.mjs` (new name, the same name again replaces the key and keeps its number, a wrong password gives 401, an empty name gives 400, two concurrent claims), `mint`, `status`, `revoke`, `close`, `teardown` (dry, then `--yes`), and the refusal to touch `default`. All behaved.
- Checked `lib/openrouter.mjs` against OpenRouter's live OpenAPI spec (https://openrouter.ai/openapi.json, fetched 2026-10-20) and the management-key guide. Endpoints, slug-or-UUID workspace paths, `PUT /workspaces/{ref}/budgets/lifetime` with `limit_usd`, `POST /keys` (`name`, `workspace_id`, `expires_at` with seconds; the secret is top-level `key`), and `DELETE /keys/{hash}` all match.
- **Two bugs fixed** (workshop-keys `c09fefb`):
  1. `GET /keys` leaves out expired keys unless `include_expired=true`. Student keys expire after 6 hours, so after class `status` wouldn't have listed them and `teardown` wouldn't have deleted them, which would leave the workspace undeletable if expired keys still block deletion. `listKeys` now asks for them.
  2. A lifetime budget's `reset_interval` is `null`, so `status` would print "budget: $2.00 null". Fixed. The mock now does both things the way OpenRouter does.
- **Not bugs, but worth knowing:**
  - Two claims at the same instant can get the same number (it is max + 1, with no lock). Names still differ, so nothing breaks; the mock was too fast to show it.
  - `GET /keys` page size 100 comes from a docs example, not the spec.
  - A management key's expiry can't be changed after creation, and it can't call models.
- Deployed claim app https://workshop-keys-one.vercel.app: the page loads (200); `POST /api/claim` answers "This claim page isn't set up yet." (its Vercel env vars aren't set).

**Part 3, `/keys` in the course app** (`ffe6822`):
- `nextjs/app/keys/` (page, `KeyClaim.jsx`, `keys.css`)
- `nextjs/app/api/keys/claim/route.js` and `nextjs/app/api/keys/status/route.js`
- `nextjs/lib/workshop-keys/` holds `openrouter.mjs` and `claim.mjs`, **copied** (with the fixes) rather than imported, so the course app deploys on its own; its README says workshop-keys is the source.
- `nextjs/content/experiments/keys.md` (status `building`, order 3).
- The four variable names were added to `nextjs/.env.example` (a shared file: four lines appended). Without them the page says "Not set up here" and the APIs refuse with 503 (checked with curl and headless Chromium, no console errors).

**Part 2, the live test:** not run. Waiting for Marlon to put a short-expiry management key in `apps/workshop-keys/.env`.

## How to try it

http://localhost:3000/keys shows "Not set up here" until the four variables are in `nextjs/.env.local`.

## Commits

- workshop-keys `c09fefb`: expired keys, the lifetime label, the mock (not pushed)
- mk-chatbot-experiments `ffe6822`: `/keys`; then this report

## What I couldn't do or didn't check

- No real OpenRouter call yet (part 2).
- `/keys` was not exercised against the mock through the dev server (it reads the real env). Its library is the same code the mock run tested.
- No money spent so far.

## For other tasks

- **V / AD:** `/keys` exists but is unconfigured; today's room should use the deployed claim app once its Vercel env is set (Marlon's call).
- **AG (Vercel):** to configure the claim app, the Vercel project `workshop-keys` needs `OPENROUTER_MANAGEMENT_KEY`, `WORKSHOP_SLUG`, `WORKSHOP_TITLE`, `CLAIM_PASSWORD` (optional `MAX_KEYS`, default 40, and `KEY_TTL_HOURS`, default 6), then a redeploy.

## Marlon's words

None in this thread for AB yet.

## Decisions and open questions

- Copy, not import, for `lib/workshop-keys/`.
- Whether `/keys` replaces the separate claim app depends on the course app being deployed with a management key, which would put that key on a second Vercel project.
