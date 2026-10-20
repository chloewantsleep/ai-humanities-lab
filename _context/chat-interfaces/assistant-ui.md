---
title: "assistant-ui stock-thread adaptation"
author: Codex
date: 2026-10-20
task: AC
thread_id: "01a158f2-d2d0-7f00-9449-72d4a8f701ea"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a158f2-d2d0-7f00-9449-72d4a8f701ea"
status: "Implemented; browser-checked"
---

# Source and adaptation

The official [installation guide](https://www.assistant-ui.com/docs/installation) distributes styled components as source through a registry. I downloaded `https://r.assistant-ui.com/thread.json` on October 20, 2026 and inspected its `components/assistant-ui/elements/thread.aui.tsx` against the installed source/types. Registry JSON SHA-256: `5b4fc22b3f44b781e17dbd1b689b45ef240c5c7d3bea19efcbadce3b1bbc6ac3`. Scratch copies: `/private/tmp/ac-assistant-thread.json` and `/private/tmp/ac-thread-stock.tsx`.

The registry declares `@assistant-ui/react@^0.15.30`, Lucide, and shadcn/helper registry dependencies. This app already had `@assistant-ui/react` 0.15.29 and `@assistant-ui/react-ai-sdk` 1.4.18. The subset used here is supported by those installed types and passed browser testing, so no dependency or lockfile changes were needed.

`nextjs/app/chat-ui/StockThread.jsx` adapts the stock text-thread composition: viewport and footer, welcome, suggestions, user and assistant messages, edit composer, copy, reload, and branch picker. It preserves assistant-ui's behavior primitives. Native buttons and route-prefixed CSS replace shadcn/Tailwind presentation. Existing ReactMarkdown and remark-gfm replace the stock Markdown helper; fenced code has a language header and a code-copy control but no syntax highlighting. Generic SVG icons replace the Lucide dependency. The MIT license is retained in `ASSISTANT-UI-LICENSE.txt` alongside the derivative.

The route is a plain-CSS adaptation of the stock text UI, not a verbatim install of every current registry feature. Attachments, tool groups, reasoning groups, feedback, voice, export, and persistent thread lists are absent. The existing endpoint is text-only; adding those controls would imply unimplemented capabilities.

`ChatInterface.jsx` creates its own runtime/provider, using `AssistantChatTransport` and `useChatRuntime` with `/api/chat`. It neither imports nor edits B's shared `ChatShell`. The live system prompt is fixed and concise. The server's `data-request` part populates the optional inspector. A separate `useLocalRuntime` adapter streams authored Markdown for testing; its label distinguishes that sample from model output. Switching mode or choosing New chat remounts the runtime and clears state.

## Verification

Used Playwright CLI session `ac-chat-ui` against Marlon's existing server at `http://localhost:3000/chat-ui`.

- Local authored stream: suggestion fills without sending; send, edit, cancel edit, save-and-send, previous/next user branches, regeneration/assistant branches, new chat, and stop all worked. Lists, bold, links, a table, and fenced JavaScript rendered.
- One short live request: HTTP 200, streamed `Ready` and a fenced JavaScript example through `/api/chat`; the server trace identified OpenRouter and `anthropic/claude-sonnet-5.5`. Actual clipboard reads confirmed both raw Markdown response copying and code-only copying.
- Mocked remote stream: verified edited request histories and regeneration use the revised question, remote branch navigation, Enter/Shift+Enter, HTTP 503 display, and successful recovery without stale error UI. These were intercepted in the test browser; no mock was added to the server or production route.
- Desktop and 390-pixel mobile screenshots were inspected. No page-width overflow. Welcome, completed conversation, and composer remained usable. Temporary screenshots are `/private/tmp/ac-chat-ui-welcome.png`, `/private/tmp/ac-chat-ui-live-desktop.png`, and `/private/tmp/ac-chat-ui-mobile.png`.

One paid model request was made. Regeneration/edit behavior was tested locally and through mocked transport rather than repeated paid requests. No production build, screen-reader audit, or Safari/Firefox testing was performed. The shared dev server stayed in place; no second server was started.
