---
task: "B. Claude chat route and the shared chat shell"
thread_id: "01a15508-f5f2-7ba2-8858-3de27b1a69c8"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15508-f5f2-7ba2-8858-3de27b1a69c8"
ran: "18:38–18:58 UTC, 2026-10-19"
status: "partly done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# Task B: the Claude chat route and the shared chat shell

Status is "partly done" because the shell and route are built and committed, but a live Claude reply and upstream cancellation have never been seen: there is no key.

## What I built

- `nextjs/app/api/chat/route.js`: `POST /api/chat`. Streams Claude through OpenRouter with the AI SDK (`streamText`, `@openrouter/ai-sdk-provider`) as an AI SDK UI-message stream. Body: `{ system?: string, messages: UIMessage[] }`, with user/assistant text parts (and `step-start`); messages are validated first, then converted with `convertToModelMessages`. The model is `CHAT_MODEL` from the environment, defaulting to `anthropic/claude-sonnet-5.5`, which the thread confirmed in OpenRouter's public catalog today. Output is capped at 2048 tokens; the request's abort signal is passed upstream. Missing `OPENROUTER_API_KEY` returns 503 with setup instructions; a malformed body returns 400; provider failures stream a generic error with no credentials or raw provider text. The route sends a transient `data-request` event, `{ engine, model, system, messages }`, with the exact converted messages given to `streamText`. It does not run client-supplied tools or fetch attachments.
- `nextjs/app/api/chat/route.test.mjs`: route validation tests (missing key and bad input).
- `nextjs/app/components/chat/ChatShell.jsx` and `chat.css`: the shared shell on assistant-ui primitives (`ThreadPrimitive`, `MessagePrimitive`, `ComposerPrimitive`), plain CSS, no Tailwind or shadcn. It has a remote mode (assistant-ui's `useChatRuntime` with `AssistantChatTransport`) and a local mode (`useLocalRuntime` with a custom adapter), chosen by whether `adapter` is passed. It also contains a "Pull back the curtain · last request" panel that prints the captured last request as JSON.
- `nextjs/app/chat-demo/page.jsx`: the demo at `/chat-demo`, with a checkbox to switch between Claude and a local echo adapter (switching resets the conversation).
- `nextjs/app/components/chat/README.md`: the handoff doc (props, adapter contract, stream format, notes for E, G, H).
- `nextjs/.env.example`: `CHAT_MODEL` now defaults to `anthropic/claude-sonnet-5.5` (the `OPENROUTER_API_KEY=` line was already there from the scaffold).

### ChatShell props

Import `{ ChatShell }` from `app/components/chat/ChatShell.jsx` in a client component. If `adapter` is given the shell is local, otherwise remote.

- `api` (remote): the AI SDK UI-message stream endpoint, default `/api/chat`.
- `system`: the system prompt string. It is read at send time, so changes apply to the next send while the conversation is kept. In remote mode it goes in the request body; in local mode it is passed to the adapter as `system`.
- `displayName` (default "Claude") and `avatar` (default empty; any React node, such as text or an image with alt text): presentation only. The name labels assistant messages and the typing line; the avatar shows beside it.
- `typingIndicator` (default true): shows "<name> is typing…" while a reply is running.
- `onRequest(snapshot)`: called on each send with the captured request. Remote mode calls it twice, first with the submitted UI messages (`engine: "http"`), then with the server's authoritative `data-request` (`engine: "openrouter"`, the model, and the converted model messages). Local mode calls it once with `{ engine: "local", system, messages }`, where `messages` are the assistant-ui messages exactly as given to the adapter. Snapshots never include the generated reply and live only in component memory.
- `adapter` (local): an assistant-ui `ChatModelAdapter` with `run({ messages, abortSignal, system, ...options })`. It returns a promise of `{ content: [{ type: "text", text }] }` or an async generator that yields cumulative results (each yield holds the full reply so far). It must respect `abortSignal`. Keep its identity stable (a module constant or `useMemo`) or the runtime is rebuilt. Thrown errors are shown in the shell.

### How C, D, E and N4 should use it

The brief asked for the E, G and H notes; the parent asked for C, D, E and N4. Here is what the thread's code and README support, with my reading marked as such.

- **E (persona dial):** this is its main customer. Drive `displayName`, `avatar`, `typingIndicator` and `system` from the dial's switches, and use `onRequest` (or the built-in inspector) for the "pull back the curtain" view of the raw text the model received. Pass F's ELIZA adapter as `adapter` to switch from Claude to ELIZA. Props alone preserve history within the same runtime kind; add a React `key` when switching should reset history, as the demo does. The "callbacks to earlier remarks" and "first-person feelings" switches must be implemented by editing `system` (the shell has no hooks for them).
- **N4 (claw runner):** the route is deliberately not an agent loop. It takes no tool definitions and runs none. The README tells H and N4 to put a server-owned loop in their own endpoint (`/api/mini-claw`, `/api/claw/`) that returns an AI SDK UI-message stream, so the remote shell can render it, and to emit `data-request` snapshots so the inspector keeps working. A multi-step tool trace needs its own view; the shell only renders text parts and an error. Reuse the provider setup and the default model from `route.js` as a pattern. (My reading: N4 can use the same `ChatShell` with `api="/api/claw"` for the conversation, but any tool-call display is new work.)
- **D (by hand), column 4 (Claude):** use `<ChatShell>` or a plain request to `/api/chat`. One caution from reading the code: the shell owns its own composer and thread, so a "one question box sends to all four" layout can't use the shell's input directly. D would need to post to `/api/chat` itself, or drive the other three columns from a shared box and only show column 4's thread with the shell. This is my observation, not something the thread addressed.
- **C (spiral room):** no use. It is a raw text area against the browser engine.
- **G (layers):** compose configuration, memory and file text into `system` before each send and read the combined result through `onRequest`. Tools and attachments need a dedicated endpoint.
- **H (mini-claw):** as for N4.

## How to try it

http://localhost:3000/chat-demo. Tick **Use local demo** to talk to an echo engine with no key, then send a message and open **Pull back the curtain** to see the system prompt and messages. Unticked, the page sends to Claude, which needs `OPENROUTER_API_KEY` in `nextjs/.env.local` (gitignored; copy `.env.example`). Optionally set `CHAT_MODEL`. Restart the dev server after editing environment files. Without a key the shell shows a clear missing-key error.

Checked on 2026-10-19: `/chat-demo` returns 200 and `GET /api/chat` returns 405 on the running dev server (the route is POST only). I did not send a request.

## Commits

- `a0df897` "Build Claude streaming route and shared assistant-ui chat shell" (authored mkuzmick, 2026-10-19 14:42 -04:00; not pushed). Seven files: `nextjs/.env.example`, `nextjs/app/api/chat/route.js`, `route.test.mjs`, `nextjs/app/chat-demo/page.jsx`, and `nextjs/app/components/chat/` (`ChatShell.jsx`, `chat.css`, `README.md`).

Checked on 2026-10-19: nothing uncommitted under these paths.

## What I couldn't do or didn't check

- A live Claude reply, token streaming, and upstream cancellation were never seen (no key). The route's happy path is untested end to end; only the missing-key path (503, and the message in the browser) and the local adapter were exercised in a browser.
- The README says `route.test.mjs` and `pnpm test` pass, and the transcript shows a passing `node --test tests/*.test.mjs` run and a successful `pnpm build`. I did not rerun them (the brief forbids it).
- The thread ran `pnpm build` in `nextjs/` while the dev server was running. Checked on 2026-10-19: the dev server still serves `/chat-demo` with 200, so no damage showed, but other agents were warned not to build against the active `.next`.
- The default model id comes from the catalog listing (`anthropic/claude-sonnet-5.5`, added 2026-09-28, $2 in / $10 out per million tokens, per the thread's lookup); whether OpenRouter accepts it with Marlon's key is unconfirmed.
- Tool calls, attachments, and non-text parts are rejected with 400 by design.
- The shell displays only text parts; there is no markdown rendering, no message editing, and no persistence.

## Marlon's words

- 18:38:24 UTC, the task prompt: "Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, README.md, nextjs/CLAUDE.md, and _context/orchestration.md … then do task B: POST /api/chat in nextjs/app/api/chat/ and the shared chat shell in nextjs/app/components/chat/." It asked for a demo "somewhere obvious (for example /chat-demo)", an updated `nextjs/.env.example`, and, if there's no key, to "build and test the missing-key path and tell Marlon what to set."
- 18:58:26 UTC: "are you still working?" The thread said no: task B is finished.

## Decisions and open questions

- Default model `anthropic/claude-sonnet-5.5`. Marlon may prefer another Claude id; set `CHAT_MODEL`.
- The output cap is 2048 tokens, set in the route. Raise it if E or G need longer replies.
- The request inspector shows the AI SDK's converted model messages, not the provider's internal chat template (the README says so), so "the exact text the model received" is as exact as the API allows.
- Local mode passes `system` to the adapter but also records it in the snapshot; an engine that wants a different shape (for example the browser engine's raw prompt) must do its own transformation and trace it, per the README.
- Open: whether D's shared question box will use this shell or its own request (see above); and the live Claude check is waiting on `OPENROUTER_API_KEY`.
