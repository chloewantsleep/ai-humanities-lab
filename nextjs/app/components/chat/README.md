---
status: working
---

# Shared chat foundation (task B)

Try http://localhost:3000/chat-demo. Send to Claude to see a reply or the missing-key error. Select the local demo checkbox for an echo adapter that needs no key. Switching engines resets this demo's conversation. Open “Pull back the curtain” after sending.

## Use the shell

Import `ChatShell` from `app/components/chat/ChatShell.jsx` in a client component. Props:

- `api`: AI SDK UI-message stream endpoint, default `/api/chat`.
- `system`: system prompt string; changes apply on the next send while retaining the conversation.
- `displayName`, `avatar`: presentation only. Avatar accepts a React node (text, an image with alt text, etc.).
- `typingIndicator`: boolean, default true.
- `onRequest(snapshot)`: observes the captured last request. Remote calls first emit the submitted UI messages, then the authoritative server snapshot with converted model messages and the selected model. Neither includes the generated reply. Snapshots live in component memory only.
- `adapter`: selects assistant-ui's local runtime instead of HTTP. Supply a `ChatModelAdapter` with `run({ messages, abortSignal, system, ...options })` returning a promise of `{ content: [{ type: "text", text }] }` or an async generator yielding cumulative assistant-ui results. Respect `abortSignal`; streaming yields contain the full response so far. Errors appear in the shell. Keep adapter identity stable (module constant or useMemo). Local snapshots contain assistant-ui messages exactly as passed to the adapter; any further transformation inside an engine must be traced by that engine.

## Route and environment

`POST /api/chat` accepts `{ system?: string, messages: UIMessage[] }`. Messages use AI SDK text parts, e.g. `{ id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] }`. It supports user/assistant text messages (and step-start markers), validates before calling OpenRouter, streams the AI SDK UI-message protocol, passes cancellation upstream, and caps output at 2048 tokens. It does not execute client-supplied tools or fetch attachments.

Works with `useChat({ transport: new DefaultChatTransport({ api: "/api/chat", body: { system: "…" } }) })` from `@ai-sdk/react` and with assistant-ui's `useChatRuntime` / `AssistantChatTransport`. The transient `data-request` stream event contains `{ engine, model, system, messages }`, with `messages` the exact result of AI SDK conversion supplied to `streamText`; this is the model-call input, not a claim about the provider's internal chat template.

Set `OPENROUTER_API_KEY` in gitignored `nextjs/.env.local`. Optionally set `CHAT_MODEL`; default `anthropic/claude-sonnet-5.5` was checked in the public OpenRouter catalog on 2026-10-19 (https://openrouter.ai/api/v1/models). Restart the dev server after changing environment variables. Missing key returns 503 with setup instructions; malformed input returns 400. Provider failures use a safe stream error without exposing credentials or raw provider responses.

## Handoff

- E: use `displayName`, `avatar`, `typingIndicator`, and `system` for the dial; `onRequest` and the inspector expose each send. Pass F's adapter to switch to ELIZA. Add a React key if switching should reset history; props alone preserve history within the same runtime kind.
- G: compose configuration/memory/file text into `system` before sending and use `onRequest` to inspect the combined input. Tools and attachments need a dedicated endpoint and renderer, beyond this text route.
- H: reuse the provider setup and model default in `app/api/chat/route.js` as a pattern for the server agent loop. Implement server-owned tools in `/api/mini-claw`; this route intentionally does not accept tool definitions for execution. Return AI SDK UI-message streams to reuse the remote shell. Emit `data-request` snapshots for the shell inspector; a multi-step trace needs H's own view.

## Verification and open work

Run `node --test app/api/chat/route.test.mjs` and `pnpm test` from `nextjs/`. Browser checks covered missing-key messaging, local send/reply, and request inspection. No `.env.local` was present, so a live Claude response and upstream cancellation remain unverified pending a key.
