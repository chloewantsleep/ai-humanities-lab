---
title: "Vercel Chatbot: evaluation for the student repo"
task: AC
author: Codex
date: 2026-10-20
thread_id: "01a158f2-d2d0-7f00-9449-72d4a8f701ea"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158f2-d2d0-7f00-9449-72d4a8f701ea"
status: "Source inspection complete; no configured runtime test"
---

# Vercel Chatbot and the student repo

**Recommendation: link to Vercel Chatbot as the next-stage application to study, and borrow selected interaction ideas later. Use the smaller assistant-ui thread and our existing API as the student repo's starting point today.** The full Vercel template teaches authentication, persistence, artifacts, and application operations together. For a first lesson about prompts, characters, and the assistant interface, those dependencies add setup before the first conversation.

## What I inspected

The current [official Vercel template](https://vercel.com/templates/next.js/chatbot) links to [vercel/chatbot](https://github.com/vercel/chatbot) and its [documentation](https://chatbot.ai-sdk.dev/docs). I cloned that repository outside this repo at `/private/tmp/ac-vercel-chatbot-20261020`, pinned by the inspected commit `c2f8235e1f3ea903ad8b7f61447c4f74164b5c58`. Its package calls it `chatbot`, version `3.1.0`, using Next `16.2.10`, AI SDK `7.0.15`, React `19.2.7`, and pnpm `10.32.1`. These describe this checkout, not a guarantee about later template versions. The license is Apache 2.0. Nothing from the template has been merged into this app.

The application includes a conversation sidebar, model selection, message history and sharing, authentication including guests, artifact editors, tool handling, and file uploads. It uses Tailwind/shadcn-style UI rather than assistant-ui. These are separate implementations built around the AI SDK; installing assistant-ui is not a step in running this template.

## What it needs

Evidence below is from the pinned checkout. File links point to that commit so later changes do not silently alter the findings.

| Requirement | Needed for what | Evidence and implication |
| --- | --- | --- |
| `AUTH_SECRET` | Signing Auth.js sessions | [proxy.ts](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/proxy.ts) redirects an unauthenticated visit to guest sign-in. The secret can be generated locally; no external login provider is required. |
| `POSTGRES_URL`, migrated PostgreSQL schema | Guest/user records, chats, messages, counts, artifacts, votes | [auth.ts](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/app/%28auth%29/auth.ts) creates a guest through `createGuestUser`; [queries.ts](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/lib/db/queries.ts) inserts that user into PostgreSQL. A guest is not a database-free mode. A local PostgreSQL instance could satisfy this; Neon is not intrinsically required by the `postgres` client. |
| `AI_GATEWAY_API_KEY` locally, or supported Vercel OIDC configuration | Model calls | [providers.ts](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/lib/ai/providers.ts) routes both chat and title models through `gateway.languageModel`. An OpenRouter key is not read by the stock source. |
| `BLOB_READ_WRITE_TOKEN` | File uploads | [upload route](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/app/%28chat%29/api/files/upload/route.ts) calls Vercel Blob's `put`. This is feature-specific; ordinary text chat does not call the upload route. Omitting it does not solve the database requirement. |
| `REDIS_URL` | Production IP rate limiting and optional stream infrastructure | [ratelimit.ts](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/lib/ratelimit.ts) skips the Redis IP limiter in development and when no ready client exists. The chat route catches resumable-stream initialization failures; the inspected per-chat stream GET route returns 204. Do not promise working reconnect/resume from the documentation alone. |

The stock [chat POST handler](https://github.com/vercel/chatbot/blob/c2f8235e1f3ea903ad8b7f61447c4f74164b5c58/app/%28chat%29/api/chat/route.ts) checks the session, reads a user's message count, reads or creates a chat, and saves messages. Database access is in the ordinary request path, not merely an optional history panel.

## Can it run with just OpenRouter and no database?

**Not unchanged.** The key name, provider selection, model metadata, and persistence/authentication paths would all need attention. A minimal adaptation would:

1. Replace both chat and title provider resolution with an OpenRouter-compatible provider. Reconcile the model allowlist and capability lookups in `lib/ai/models.ts`, which currently fetch Gateway metadata, and the Gateway-specific provider options in generation paths.
2. Replace or remove guest authentication, message count checks, chat/message queries and writes, history, ownership checks, and artifact persistence. Supply intentional in-memory or local persistence and explain what is lost on reload. Simply commenting out one save call is insufficient.
3. Disable or replace Blob uploads if no store is configured; decide whether to retain tools/artifacts at all. Revise the feature UI to match the backend.

This would be a meaningful fork. Our existing text-only `/api/chat` already has the smaller request/stream contract needed for today's workshop. Keeping the familiar UI as a layer over it makes the relationship between model, prompt, transport, and interface easier to inspect.

## Setup, measured work, and estimates

The shallow clone completed in about 0.3 seconds on this machine. I inspected the source, example environment variables, package scripts, auth flow, provider routing, database calls, upload route, and stream route. No PostgreSQL or Docker executable was found on the shell PATH. I did not install dependencies or start the clone: a functioning chat session was not a quick key-only run, and setting up its missing services was outside this evaluation's useful scope. No account, cloud resource, database, Vercel link, deployment, or new key was created. No Notebook credentials were copied to the scratch clone.

Planning estimates, **not timed results**: allow roughly 30–60 minutes for dependency installation, local secret/configuration, schema migration, and smoke testing when a usable PostgreSQL database and Gateway credentials already exist. For a new student without those prerequisites, budget a separate setup session. A database-free OpenRouter fork is additional engineering, not included in that estimate. Network, platform setup, and upstream changes can dominate those times.

For a future authorized local run with those prerequisites, use the pinned checkout's pnpm version, fill a local gitignored `.env.local`, install with `pnpm install`, and migrate with `pnpm exec tsx lib/db/migrate.ts` (the package's `db:migrate` script currently invokes `npx`). Then run `pnpm dev --port 3101` from the scratch clone, leaving this project's shared port 3000 alone. This is a future recipe, not an observed successful run.

## Documentation drift worth showing students

The [setup guide](https://chatbot.ai-sdk.dev/docs/setup) says `DATABASE_URL`, while this checkout's `.env.example`, database client, and migration script read `POSTGRES_URL`. The [models guide](https://chatbot.ai-sdk.dev/docs/customization/models-and-providers) illustrates an older custom-provider arrangement; this checkout separates `lib/ai/providers.ts` and the model catalog. The [resumable-streams guide](https://chatbot.ai-sdk.dev/docs/customization/resumable-streams) describes Redis-backed recovery, while this checkout's stream GET returns 204. Prefer the pinned source when following a guide for this exact version.

## What students would learn

| Starting point | First useful lesson | Setup surface | Good next step |
| --- | --- | --- | --- |
| Our primitive-based `/chat-demo` | A chat surface is assembled from message, composer, and runtime pieces | Existing app and API key; local echo available | Inspect the request and change presentation |
| assistant-ui styled thread adapted at `/chat-ui` | Familiar edit/copy/regenerate controls are interface decisions over the same conversation/runtime | Existing app; scoped CSS and installed primitives | Edit a message, navigate branches, compare what the server sees |
| Vercel Chatbot | A deployed chat product coordinates identities, data ownership, storage, tools, and models | Database, authentication secret, provider setup; optional file storage and Redis features | Study a pinned fork after students have a working small chat |

Borrow its sidebar/artifact ideas only when the student task calls for persistent conversations or working documents. Link to the official template and this evaluation now. Revisit adopting the full template when those features are requirements and someone owns the service setup and ongoing costs.
