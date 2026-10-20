---
task: AF
thread_id: "01a158f2-d04e-7232-bc40-7c910479d1df"
agent: Codex
started_in: /Users/mk/Development/mk-27/apps/the-notebook
resume: "codex resume 01a158f2-d04e-7232-bc40-7c910479d1df"
status: "complete; 42 tests pass; shared-server browser checks pass"
---

## What I built

- Priority fix: `nextjs/app/components/chat/ChatShell.jsx` renders assistant text parts with react-markdown and remark-gfm, `skipHtml`, no raw-HTML plugin. User text keeps the existing plain-text renderer. Scoped CSS handles paragraphs, lists, code, blockquotes, and tables. Props, adapters, transport, cancellation, trace, and request behavior are unchanged.
- `nextjs/app/print/[[...slug]]/page.jsx`: existing content paths take precedence; otherwise the route is matched against experiment `route:` frontmatter. Metadata uses the same resolver. Existing all/set/folder behavior remains.
- `nextjs/package.json`: test command now runs quoted recursive globs for `tests/**/*.test.mjs` and `app/**/*.test.mjs`, including gpt-2, knowledge-voice, tics, layers, and API tests.
- Mini-claw: `app/api/mini-claw/workspace.mjs` maps logical `memory.md` to ignored `mini-claw/.working-memory.md`, seeded once using exclusive creation from the tracked memory. Reads and appends use this copy. `DELETE /api/mini-claw` restores the seed. The UI has a Reset memory button disabled during a run, and clears its old trace after reset. Notes remain. Updated workspace README, ignore rule, and regression tests. API files were necessary supporting changes beyond the brief's listed UI/workspace folders; no agent-loop behavior changed.
- Readable metadata titles for markov, persona-dial, fine-tune, rosie-roomba, and newly added keys. Skipped by-hand and spiral/gpt-2 as instructed. Checked route metadata; client-only engine/chat-demo inherit the app title and were not restructured merely for titles.

## How to try it

http://localhost:3000/chat-demo — select the local demo, send `**bold**`, a Markdown list, and inline/fenced code. Assistant formatting should render, user input should remain literal. This requires no paid call. The same assistant renderer applies on `/layers` and AA's `/bot-lab`.

http://localhost:3000/print/tics — should print the same experiment document as `/print/experiments/tics`. Existing `/print/glossary`, `/print/all`, and `/print/set` retain their meaning.

http://localhost:3000/mini-claw — run the scripted stand-in, observe memory, then Reset memory. The tracked seed should stay clean; notes persist. Memory is one shared local demo file, not per-user storage.

From `nextjs/`, run `pnpm test`.

## Commits

- `3afba49` — priority ChatShell Markdown fix, committed first.
- `c45318a` — remaining shared fixes, test discovery, memory reset, titles.
- Concurrent AE commit `e822a2e` captured the print resolver, fine-tune title, and one-line route-test regex update from the shared working tree. They are committed in HEAD; not duplicated. AF's commit used explicit paths throughout.

## What I couldn't do or didn't check

`pnpm test`: **42 tests pass**, zero failures. A previously too-restrictive content test rejected the digit in AE's `/gpt-2`; its regex now accepts digits (one-line supporting test change). New memory coverage confirms persistence, reset, unchanged tracked seed, preserved notes, and refusal of direct hidden-file access. Existing scripted-loop tests pass against throwaway workspaces. Next SWC compiles the changed ChatShell, print page, and mini-claw UI. Owned-path diff whitespace checks pass.

Shared-server headless Chromium checks: `/print/tics` and `/print/experiments/tics` both return 200 with the same title; existing `/print/glossary` returns 200, and an unknown print path returns 404. The `/chat-demo` local adapter renders bold, a list item, and inline code through the assistant Markdown component, with no raw script node. Screenshot `/private/tmp/af-chat.png` was inspected: assistant formatting is visible and user Markdown remains literal. The mini-claw Reset memory button renders. Browser title checks pass for Markov chains, The persona dial, Fine-tuning, and Rosie and Roomba. Workshop keys metadata was checked in source. No paid Claude generation was needed; the shared component was exercised with the local adapter. The reset backend is regression-tested in throwaway workspaces; the button was not clicked against the shared demo’s existing memory. Print-dialog/pagination and every individual experiment alias were not separately inspected. The tracked `mini-claw/memory.md` remains clean; the working file is confirmed ignored. No paid API calls, deployment, push, second dev server, or Notebook submodule-pointer changes.

## For other tasks

- AA: **ChatShell fix available in `3afba49`**. No prop/API changes. Assistant Text part renderer now uses GFM; user text remains plain. Shared CSS is scoped to `.chat-markdown`.
- AE: recursive test discovery handles both old spiral and new gpt-2 locations. Content-route regex now permits digits. Your concurrent `e822a2e` also captured AF's print alias resolver and fine-tune title; these are verified present in HEAD.
- AG: mini-claw uses a writable on-disk local working file; this does not make memory durable across serverless instances. Reset is shared for the local demo, like existing memory.
- V: check `/print/<experiment-route>` and Markdown in shared chat surfaces. Mini-claw reset leaves notes untouched.

## Marlon's words

> Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then your brief _context/orchestration/tasks/AF-shared-fixes.md. Do the ChatShell Markdown fix first; AA is building on that component now. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9).

## Decisions and open questions

Used the existing Markdown dependencies, without the content renderer's server-side filesystem import. The assistant text component is supplied through the installed assistant-ui Parts API. Working memory is hidden from file-tool listings; the model continues addressing `memory.md`. Reset restores memory only. Concurrent browser sessions or runs share the same local memory; multi-user isolation and coordination were outside this fix.

Resume from `/Users/mk/Development/mk-27/apps/the-notebook` with `codex resume 01a158f2-d04e-7232-bc40-7c910479d1df`.
