---
title: The familiar chat interface
description: "Welcome suggestions, message bubbles, an editable conversation. Same chat engine; a familiar face."
route: /chat-ui
status: working
group: "Build your bot"
order: 3
---

## What was asked

Show assistant-ui's familiar styled thread, wired to the existing `/api/chat`, and evaluate Vercel's chatbot starter separately for the student repo.

## What was built

This is a text-chat adaptation of [assistant-ui's stock thread](https://r.assistant-ui.com/thread.json): welcome suggestions, a rounded composer, right-aligned user messages, Markdown responses and fenced code, copy, edit, regenerate, stop, and branch navigation. The components are editable source, not a hosted service. The current [installation guide](https://www.assistant-ui.com/docs/installation) distributes the styled components through a registry.

The stock Tailwind/shadcn presentation is translated into route-scoped plain CSS. Existing `react-markdown` and `remark-gfm` render text and code blocks, with a separate code-copy control. Syntax highlighting, attachments, tools, voice, account login, and saved history are omitted. The endpoint accepts text messages; unsupported controls would imply capabilities it does not provide.

## Try it

Use a welcome suggestion to fill the composer, then send. Suggestions do not automatically spend a model call. Edit a user message, regenerate an answer, and use the arrows to compare branches. **New chat** clears the conversation. **Local interface demo** streams authored sample Markdown so you can test every control without a key or API cost. Changing modes clears the thread.

Live mode calls `/api/chat`; sending, saving an edit, and regenerating each incur a model call. Threads are held in page state, not saved after navigation or reload. **Under the interface** exposes the server's last-request snapshot without credentials.

## Compare the interfaces

[The original chat demo](/chat-demo) and this route use the same assistant-ui primitives, AI SDK transport, and backend. This route follows the stock thread's fuller interaction pattern and neutral styling. Interface choices change what a reader can do and how the system presents itself; they do not change the underlying model. The runtime, not the CSS, supplies editing and branches.

Vercel's starter evaluation is in `_context/chat-interfaces/vercel-ai-chatbot.md`; it is not merged into this app. The recommendation is to begin the student repo with assistant-ui and borrow selected Vercel patterns later. The inspected starter needs PostgreSQL even for guest use; OpenRouter requires a provider adaptation. No cloud resources were created.

## Open questions

Should AA’s bot editor use this thread skin? Which projects need saved conversations or artifacts enough to justify Vercel’s larger application? The current route has no persistence, attachment support, or syntax highlighting. Vercel’s clone was inspected but not started because its database setup was not already available.

## How this was made

Codex, October 20, 2026, task AC. Thread `01a158f2-d2d0-7f00-9449-72d4a8f701ea`, started in `/Users/mk/Development/mk-27/apps/the-notebook`. Resume with `codex resume 01a158f2-d2d0-7f00-9449-72d4a8f701ea` there. The official registry source was inspected against installed package types; MIT attribution is retained beside the adapted components. Browser checks passed for send/stop, edit/cancel, regenerate and branches, Markdown/code, copying, keyboard controls, and desktop/mobile layout. One short live OpenRouter response succeeded; further transport checks used mock responses to avoid extra spending.
