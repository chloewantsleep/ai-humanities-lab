---
task: "G. The layers around the model"
thread_id: "01a15584-5617-74f1-a94a-7c4ddd0e2a1a"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15584-5617-74f1-a94a-7c4ddd0e2a1a  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:55–19:30 UTC, 2026-10-19 (work and commit finished by 19:05; the last message at 19:30 only answered \"are you done?\")"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

## What I built

Task G, the layers experiment, at `/layers`, on top of task B's `ChatShell` and `POST /api/chat` (no shared chat code or API contract was changed). Files, all under `nextjs/` in `apps/mk-chatbot-experiments`:

- `app/layers/page.jsx`: wraps the experiment in the shared `ExperimentPage` frame, imports `layers.css`, `force-dynamic`.
- `app/layers/LayersLab.jsx` (client component, about 220 lines): the whole page. Sections: 01 Configuration, 02 Persistent memory, 03 Send with these layers (the chat), 04 "What went in?" (the trace), and a "Beyond this page" panel.
- `app/layers/engine.mjs`: the plain-JS layer engine. `assembleLayers()` turns the switches into four named text blocks (persona, attached files, tool and result, memory) and joins the non-empty ones with a blank line into the `system` string. Also `discussionTiming()` (the tool), `PERSONA`, `SAMPLE_FILE`, the limits, and `localAdapter`.
- `app/layers/engine.test.mjs`: four `node:test` cases (layer exclusion, exact reconstruction of the system string from the blocks, tool arithmetic and its range check, local-adapter cancellation).
- `app/layers/layers.css`: route styles (nothing added to `globals.css`).
- `content/experiments/layers.md`: rewritten from the brief into what was built and how to use it; `status: working`.

What the page does:

1. **Configuration** is a named persona ("Course TF Assistant"), editable name, description and system instructions. The default text is the GENED 1000 teaching-fellow instructions copied from the three builder screenshots, with a "Restore screenshot persona" button. Inside it: an **attached files** switch (up to 3 UTF-8 `.txt`/`.md`/`.csv`/`.json` files, 8 KiB each, full text pasted into context, no retrieval; oversize and binary files are rejected; an "invented sample syllabus" button) and one **tool**, `discussion_timing` (5–180 whole minutes split into 15% opening, 15% closing, rest discussion). The tool is run by the user with a "Run tool" button, and its latest call and result become text in the next send. It is not model-called.
2. **Memory** is one note saved to the browser's `localStorage` (key `layers-course-tf-memory-v1`) by "Save memory", and "Forget saved memory" deletes it. The memory switch defaults off after every reload; only the saved note survives a reload.
3. **Trace**: uses the shell's `onRequest` hook. Each send is stored as a frozen record (the layer blocks as they stood at submission plus a deep clone of the shell snapshot), so later edits do not rewrite earlier sends. A dropdown picks a send; each layer shows its exact text and character count, then conversation history, then the raw snapshot. For the Claude engine the HTTP-submitted record is updated in place with the server's model-call snapshot when it arrives (one record per send, not two). Records live in component state only and are not persisted.
4. **Product screenshots** beside the configuration panel: `06-gpt-builder-configure-tab.png`, `14-claude-project-instructions-dialog.png`, `19-gemini-gem-editor.png` (served from `/context-media/history/_images/`), each linked to its `/history/0N-…` page, plus a link to the ChatGPT Projects page (`/history/04-chatgpt-projects`).
5. **Engines**: "Local inspection adapter" (no key, no model; it echoes the message and says how many characters of system context it received) and "Claude · shared POST /api/chat". Switching engine starts a new conversation.
6. Glossary links to `custom-instructions`, `knowledge-files`, `context-assembly`, `memory`, `conversation-history`, `tool-use`, `tool-result`, `trace`, `agent`, `agent-loop`, `permissions` (and `agent-computer` in the doc). Public presence and agency are described in a table in the doc and a closing panel, and pointed to `/mini-claw`; not built.

## How to try it

Open http://localhost:3000/layers. Leave the engine on "Local inspection adapter" (no `OPENROUTER_API_KEY` needed). Click "Add invented sample syllabus", type "When is the weekly response due?" and send; open "What went in?" to see the persona block and the file block. Switch on "Include discussion-timing tool", click "Run tool", send again, and compare the two sends in the trace dropdown. Type a memory note (for example "I prefer one question at a time"), "Save memory", turn "Memory" on, send, then reload to see the note come back (switch off again). Choosing the Claude engine **does** need `OPENROUTER_API_KEY` in `nextjs/.env.local`; without it the shell shows the missing-key message.

Checked on 2026-10-19: `/layers`, `/chat-demo` and the screenshot URL under `/context-media/history/_images/` all return 200. `nextjs/.env.local` now exists but is empty (0 bytes, created about 20:29 UTC, after this thread ended), so there is still no key, and the Claude engine on `/layers` still can't be used.

## Commits

- `42d3c99` "Build layers experiment with configuration, memory and request traces" (2026-10-19 15:05 -0400, which is 19:05 UTC; author mkuzmick, noreply address). Six files: `LayersLab.jsx`, `engine.mjs`, `engine.test.mjs`, `layers.css`, `page.jsx`, `content/experiments/layers.md`. Verified in `git log`. Not pushed, as instructed. `git status` shows nothing uncommitted under `nextjs/app/layers` or this thread's experiment doc.
- The thread did **not** write `_context/reports/G-layers.md` (rule 8); this file is the late substitute.

## What I couldn't do or didn't check

- **Live model behavior was never tested**: no `OPENROUTER_API_KEY`. Not tested: instruction following by a real model, whether Claude answers from the attached file, and upstream cancellation. The "server snapshot replaces the submitted record" path was verified only with a synthetic UI-message stream, not a real model call.
- Browser checks were done with `@playwright/cli` against the local adapter and the missing-key error: files (including rejected oversize and binary), layer exclusion, frozen records, new conversation, memory save/reload/forget, and desktop and 390-pixel mobile screenshots. These are the thread's own report; I did not re-run them. The transcript's "all 15 automated checks" is its own count; the session log shows `node --test` runs of 4 (engine) and 5 and 1 (route/other) tests and `pnpm test` at 10 passing, 0 failing.
- The page does not run the tool through the model: B's `/api/chat` accepts only text context and does not execute tools, so the tool is user-run (the doc says so). The discussion-timing tool, the sample syllabus, and the "Course TF Assistant" facts are the thread's additions or the screenshot agent's example, not verified course policy.
- The trace shows application-level `system` plus messages, not the provider's internal chat template (the doc says so).

## For other tasks

- **H (mini-claw)**: G's tool is user-run, and its "memory" is a manually edited `localStorage` note, not files. Model-selected tool calls, the server-side action loop, filesystem memory (`mini-claw/memory.md`), skills and the multi-step trace are all still H's. The `/layers` "Beyond this page" panel and the doc link forward to `/mini-claw`.
- **B (chat shell)**: G depends on `ChatShell` props `adapter`, `system`, `displayName` and `onRequest`, and on the snapshot sequence "submitted `http` snapshot, then `openrouter` snapshot on success" (the `engine` field values `local`, `http`, `openrouter`). If B changes those, `LayersLab.jsx` `onRequest` breaks.
- **A / E (persona dial)**: `engine.mjs`'s `assembleLayers` is a small reusable "context assembler" if the persona dial needs one.
- **K (use the screenshots)**: three history screenshots are already used on `/layers`.
- **L (glossary)**: the page and doc depend on eleven `interfaces-and-agents` entries named above; all exist on disk.

## Marlon's words

- 19:30:36 UTC: "are you done?" (the only message after the task prompt; the assistant replied "Yes").

## Decisions and open questions

- Decision: memory is an explicit saved note (kept simple, as asked), separate from conversation history; the memory switch always defaults off after reload; configuration off excludes persona, files and tool together, while memory stays independent.
- Decision: the tool is user-run to stay inside B's text-only route, rather than adding function calling.
- Decision: local adapter does not imitate a model, so students see plumbing, not fake answers.
- Open: should the course version have automatic memory extraction or a model-invoked tool? (The doc raises it; it would add a decision loop beyond the explicit controls.)
- Open: live Claude replies need Marlon to add `OPENROUTER_API_KEY` to `nextjs/.env.local` and restart the dev server.
