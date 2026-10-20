---
title: The layers around the model
description: "Toggle instructions, files, a tool and saved memory around one chat engine, then inspect what each send receives."
route: /layers
status: working
group: "Under the hood"
order: 3
---

## What is built

The working experiment is at [/layers](/layers). It uses task B’s `ChatShell` and the shared `POST /api/chat`, with one context assembler and independent switches. Changing layers leaves the selected engine unchanged. The local inspection adapter needs no key and reports the context it received; it does not imitate a language model or answer course questions.

The default **Course TF Assistant** recreates the name, description and GENED 1000 instructions visible in the saved GPT builder, Claude Projects and Gems screenshots. These are the screenshot agent’s example, not a verified course policy or a vendor template. The discussion tool and invented sample syllabus are additions for this experiment; the screenshots do not demonstrate them working.

| Switch | What it adds to the next request |
|---|---|
| Configuration | The editable name, description and system instructions |
| Include attached files | Full text of up to three user-picked UTF-8 `.txt`, `.md`, `.csv` or `.json` files, at most 8 KiB each; no retrieval index |
| Include discussion-timing tool | A tool description and, after **Run tool**, the latest input and computed result |
| Memory | The last explicitly saved note, loaded from this browser’s local storage |
| Show layer trace | A view only: no additional request text |

Turning configuration off excludes its persona, files and tool together. Memory is independent and can remain on. Files and the tool have their own switches for finer comparisons.

## How to use it

1. Open [/layers](/layers). Leave **Local inspection adapter** selected to explore without a key. Compare the configuration panel with the three screenshots beside it; click an image to enlarge it.
2. Add a small text file, or click **Add invented sample syllabus**. The sample labels itself as invented. Ask “When is the weekly response due?” to inspect how a question and supporting material are assembled. The local adapter only confirms receipt; Claude is needed for a generated answer.
3. Enable **Include discussion-timing tool**, choose 5–180 whole minutes and click **Run tool**. The browser divides the time into opening and closing (15% each, rounded down, at least one minute each) and the remaining discussion time. The next send includes that call and its result. Changing the minutes requires running the tool again.
4. Write a memory note, such as “I prefer one question at a time,” and click **Save memory**. Turn **Memory on** and send. Unsaved edits do not change requests. **New conversation** clears the thread while retaining the controls, saved note and this visit’s traces.
5. Inspect **What went in?** Select any send to see each layer’s exact contribution and character count, conversation messages, and the complete shell snapshot. Edit a control and compare another send; the earlier snapshot stays frozen. Empty sections add no text. Nonempty sections join with two newline characters.
6. For a clean comparison, start a new conversation before sending with different layers. Removing a layer does not undo its influence on answers already in conversation history.
7. Reload to test persistence: only the saved memory note survives. The memory switch defaults off after reload; turn it on to include the restored note. **Forget saved memory** deletes the browser note. Earlier snapshots retain their original text until reload. If browser storage is unavailable, the page says the note is limited to the current visit.

Choose **Claude · shared POST /api/chat** for model responses. Switching engines starts a new conversation. Enabled file text and memory then travel with the request to the configured provider. No `OPENROUTER_API_KEY` was present in `nextjs/.env.local` during task G: the local adapter and the actionable missing-key error were tested; live model behavior remains unverified. Set that variable in the gitignored file and restart the server to use Claude.

## What the trace means

The layer view is captured through the shell’s `onRequest` hook. Local sends show the adapter input. Remote sends first show submitted HTTP input, then update the same record with the server’s authoritative model-call snapshot when it arrives. A failed HTTP request is labeled as submitted input, not evidence that a model received it. The snapshot contains the application’s system text and messages, not a claim about a provider’s internal chat template. Request records remain in component memory for this visit; they are not written to local storage.

Read the glossary entries for [custom instructions](../glossary/interfaces-and-agents/custom-instructions.md), [knowledge files](../glossary/interfaces-and-agents/knowledge-files.md), [context assembly](../glossary/interfaces-and-agents/context-assembly.md), [memory](../glossary/interfaces-and-agents/memory.md), [conversation history](../glossary/interfaces-and-agents/conversation-history.md), [tool use](../glossary/interfaces-and-agents/tool-use.md), [tool results](../glossary/interfaces-and-agents/tool-result.md) and [traces](../glossary/interfaces-and-agents/trace.md).

## The same example in the product builders

These saved screenshots show configuration fields and draft states. They are not evidence of retrieval, successful publication or general response quality. Full capture context is in [GPTs](../history/01-gpts.md), [Claude Projects](../history/02-claude-projects.md), [Gems](../history/03-gems.md) and [ChatGPT Projects](../history/04-chatgpt-projects.md).

![GPT builder with the Course TF Assistant name, description and instructions](../history/_images/06-gpt-builder-configure-tab.png)

![Claude project instructions using the same GENED 1000 teaching-fellow example](../history/_images/14-claude-project-instructions-dialog.png)

![Unsaved Gem with the same Course TF Assistant instructions and a preview](../history/_images/19-gemini-gem-editor.png)

## Later layers

| Layer | Examples | What it adds |
|---|---|---|
| Configuration | This experiment’s persona panel | Instructions, files and a tool packaged under a name |
| Memory | This experiment’s saved note | Information loaded across conversations |
| Public presence | An account in a public discussion | A place and identity through which to participate |
| Agency on your machine | local agents | Tools, persistence, chat-app surfaces, self-written skills |
| Agency with its own computer | consumer agents with a cloud computer | Agents that act on your behalf |

Public posting and autonomous actions are not implemented on this page. Continue to [mini-claw](/mini-claw) for the next experiment, and read [agent](../glossary/interfaces-and-agents/agent.md), [agent loop](../glossary/interfaces-and-agents/agent-loop.md), [permissions](../glossary/interfaces-and-agents/permissions.md) and [agent computer](../glossary/interfaces-and-agents/agent-computer.md).

## Handoff to task H and verification

The tool here is executed by the user in the browser, with its result added as text. It is not model-selected function calling: B’s `/api/chat` accepts text context and does not execute tools. H owns the server-side action loop, model-selected calls, filesystem persistence and multi-step trace. This page’s memory is a manually edited local-storage note (`layers-course-tf-memory-v1`), separate from mini-claw’s workspace files. No shared chat code or API contract was changed.

Verification: from `nextjs/`, `node --test app/layers/engine.test.mjs` checks layer exclusion, exact reconstruction, tool arithmetic and local-adapter cancellation; `node --test app/api/chat/route.test.mjs` checks the shared missing-key contract; `pnpm test` checks the existing suite. Browser checks cover the shared `/chat-demo`, all enabled layers, user-picked files, rejected oversized/binary uploads, immutable request records, fresh-conversation history, memory reload/deletion, and the missing-key error. A synthetic UI-message stream verified that the server snapshot updates the existing send instead of creating a duplicate; it was not a live model test. Desktop and 390-pixel mobile layouts were visually inspected, and the page’s glossary/history/media links returned successfully.

## Open questions

- Live model replies, instruction following and upstream cancellation need an OpenRouter key before they can be evaluated.
- Should the course version add automatic memory extraction or a model-invoked tool? Those would add another decision loop beyond the explicit controls here.
