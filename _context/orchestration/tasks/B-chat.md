---
task: "B"
title: "Claude chat route and the shared chat shell"
status: "partly done (the Claude path has never run: no key yet)"
owns: "`nextjs/app/api/chat/`, `nextjs/app/components/chat/`"
depends_on: "start now"
report: "../reports/B-chat.md"
---
# B. Claude chat route and the shared chat shell

- `POST /api/chat`: streams a reply from Claude through OpenRouter with the AI SDK (`@openrouter/ai-sdk-provider`). Takes a system prompt and messages; the model comes from `CHAT_MODEL` in `.env.local` (default to a current Claude model on OpenRouter; check OpenRouter's catalog for the exact id; The Notebook has an `openrouter-models` skill). Works with the AI SDK's `useChat` and with assistant-ui's AI SDK runtime. Returns a clear error when `OPENROUTER_API_KEY` is missing.
- A shared chat shell in `app/components/chat/`, built on assistant-ui's primitives and styled with plain CSS in the app's look (no Tailwind, no shadcn). It must accept either the Claude route or a local engine (assistant-ui's local runtime with a custom adapter), so ELIZA (F) and, later, a browser model can sit behind the same shell. It needs hooks the persona dial (E) will use: a display name and avatar, an optional typing indicator, and a way to read the exact system prompt and messages that were sent.
- Write `nextjs/.env.example` entries for the variables you use.

## When you finish

Write or update [`../reports/B-chat.md`](../reports/B-chat.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
