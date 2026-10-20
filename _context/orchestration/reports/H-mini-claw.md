---
task: "H. Mini-claw"
thread_id: "e3a4dacc-096e-4ccb-b7f8-bb59ea278fa4"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume e3a4dacc-096e-4ccb-b7f8-bb59ea278fa4  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:55–19:30 UTC, 2026-10-19"
status: "partly done (built and tested with a scripted stand-in; the Claude path has never run)"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# Task H: mini-claw

**For task N4 (the runner), the loop and the tool are described precisely in section 1.** Short version: `runAgent` in `agent.mjs` is a hand-written 59-line `for` loop around `generateText` with a tool that has no `execute`; the tool, `file`, goes through `resolveInside` (lexical check, hidden-file check, then a realpath check for symlinks) and a four-row permission table. Both take a `root` argument, so N4 can point them at another workspace.

## 1. What I built

Paths are in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`.

### The loop: `nextjs/app/api/mini-claw/agent.mjs` (59 lines, commented for students)

`runAgent({ task, model, report, abortSignal, root = WORKSPACE })`:

1. **Assemble the context.** It reads `memory.md` whole (`readMemory`) and lists skills (`listSkills`: each `skills/*.md`, with `name` and `description` from the YAML frontmatter via `gray-matter`). It builds one system prompt: who it is and today's date (`toLocaleDateString("en-CA")`, local date), the one-tool rule, "each run starts fresh … you remember nothing … except what is in memory.md", then `## memory.md` with the file text (or "(empty)"), then `## Skills` with "Before doing a task that matches a skill, read the skill's file and follow it" and one line per skill (`- name (path): description`). Skill bodies are not in the prompt; the model reads one with the tool if it decides to (progressive disclosure).
2. **Tools** are `{ file: tool(fileTool) }` with **no `execute` function**, so the AI SDK hands each tool call back instead of running it. The loop runs tools itself.
3. **Messages** start as `[{ role: "user", content: task }]`. Each run is a single task with no conversation carried over; `memory.md` is the only thing that persists.
4. **The `for` loop**, `step = 1` to `MAX_STEPS` (10):
   - `report({ type: "model-input", step, messages: structuredClone(messages) })`.
   - `generateText({ model, system, messages, tools, abortSignal, maxOutputTokens: 2048 })`, one call per step (the SDK's own multi-step loop is not used).
   - `messages.push(...result.responseMessages)` (the model's reply, tool calls included, joins the conversation), then `report({ type: "model-output", step, text, toolCalls, finishReason })`.
   - **Stop condition:** `result.toolCalls.length === 0` means the model answered in words; it reports `done` with `memoryBefore` and `memoryAfter` and returns.
   - Otherwise, for each tool call it runs `runFileTool(call.input, root)`, reports a `tool-result` event (`toolCallId`, `input`, `status`, `rule`, `output`, and `memory` after an append to memory), collects `{ type: "tool-result", toolCallId, toolName, output: { type: "text", value } }`, and pushes them as one `{ role: "tool", content: results }` message.
   - If the ten steps run out, it reports `done` with `stopped: true` and the text "Stopped after 10 steps without a final answer."
5. **Event types the loop reports** (what the page and N4 can rely on): `start` (task, system, tool definition, memory, skills), `model-input`, `model-output`, `tool-result`, `done`. The route adds `engine` first and `error` on failure; every event gets an `at` timestamp.

### The route: `nextjs/app/api/mini-claw/route.js`

- `GET /api/mini-claw` returns `{ memory, skills, notes, claude: { available, model } }`.
- `POST /api/mini-claw` takes `{ task, engine: "claude" | "scripted" }` (task a non-empty string up to 4,000 characters; bad input gets 400). With `engine: "claude"` and no `OPENROUTER_API_KEY` it returns 503 with a message. Otherwise it streams the trace as NDJSON, one JSON event per line, with `Content-Type: application/x-ndjson`. The model is `createOpenRouter({ apiKey })(CHAT_MODEL)`, with `CHAT_MODEL` defaulting to `DEFAULT_CHAT_MODEL` imported from `/api/chat/route.js` (`anthropic/claude-sonnet-5.5`, checked on 2026-10-19). Provider errors are not passed through to the page ("The model call failed. Check the key, CHAT_MODEL, OpenRouter balance, and connection."), and are logged to the server console. `request.signal` is passed as the abort signal, so Stop works.

### The one tool and its safety checks: `nextjs/app/api/mini-claw/workspace.mjs`

One tool, `file`, with an input schema (zod) of `action` (`list | read | write | append`), `path` (string), `text` (optional string). `WORKSPACE` is `path.resolve(process.cwd(), "..", "mini-claw")`, so it assumes Next runs from `nextjs/`. There is no shell, no network, and no delete anywhere in it. `runFileTool(input, root = WORKSPACE)` returns `{ status: "allowed" | "refused" | "error", rule?, output }`, and applies these checks in order:

1. **Unknown action** is refused (checked against the `PERMISSIONS` keys).
2. **`resolveInside(root, asked)`**:
   - refuses a non-string, blank, or NUL-containing path;
   - refuses an absolute path;
   - **by name:** `path.resolve(root, asked)` then `path.relative`, refusing `..`, anything starting `../`, or an absolute result;
   - refuses **hidden files** (any path component starting with `.`; the root itself, `.`, is allowed);
   - **on disk (symlinks):** takes `fs.realpath(root)`, then walks up from the target to the deepest part that exists and checks its real path is still inside the real root. A symlink inside `mini-claw/` that points outside is refused, including when the target file doesn't exist yet and its parent folder is a link.
3. **Permission table** (`PERMISSIONS`), applied to the workspace-relative path:
   - `list`, `read`: anywhere in `mini-claw/`;
   - `write`: only paths starting `notes/` and ending `.md`;
   - `append`: `memory.md`, or `.md` files in `notes/`.
4. **Content limits:** `write` and `append` need non-empty text, at most 20,000 characters (`MAX_WRITE`); `read` output is cut at 20,000 characters with a note (`MAX_READ`); an append to `memory.md` must be **one line** (`text.trim().includes("\n")` is refused).
5. Behaviour: `write` creates directories (`mkdir -p`) and always ends the file with a newline; `append` adds a newline first if the file didn't end with one; `list` is recursive and skips hidden files. Refusals and errors come back to the model as the tool result text ("Refused: …", "Error: …") so the model has to work with them.

The model sees the tool through `fileTool` (description plus schema); `fileToolForTrace` is the same thing as plain JSON for the trace display.

### Other files

- **Workspace, `mini-claw/` at the repo root:** `README.md` (what each path is and what the agent may do), `memory.md` (tracked; seeded with one line, "2026-10-19: Built for ENG 298AI, the AI Humanities Lab. Notes go in notes/."), `skills/remember.md`, `skills/take-a-note.md`, `skills/commonplace-book.md` (each with `name` and `description` frontmatter and numbered steps), `notes/.gitkeep`, and `.gitignore` (ignores `notes/*` so demo notes stay on this laptop).
- **`scripted-model.mjs`:** a stand-in "model" implementing the AI SDK's v4 language model interface (`doGenerate` only). It is a script, not a model: if the task names a path (a regex for `something/something`), it first tries to read it; then it always makes the same four calls (read `skills/remember.md`, append a line to `memory.md`, list `notes`, write `notes/scripted-run.md`) and finishes with a fixed sentence saying it is the stand-in.
- **`nextjs/app/mini-claw/MiniClaw.jsx`, `page.jsx`, `mini-claw.css`:** the `/mini-claw` page. A task box, four starter buttons ("Remember something", "Keep a passage", "Use the memory", "Try to escape"), a model choice (Claude, disabled when no key; or the scripted stand-in), Run and Stop, the workspace panel (memory, skills, notes), and the trace (system prompt and tool definition; the full messages the model received at each step; each tool call with its permission verdict and result; `memory.md` before and after with the new line highlighted).
- **`nextjs/app/api/mini-claw/mini-claw.test.mjs`:** 4 tests, all on throwaway copies of a workspace in the system temp folder: escapes by `../` and absolute paths for every action; a symlink can't reach outside; the permission rules (read anywhere, write only in `notes/`, memory one line at a time, no hidden files); and a full run of the loop with the scripted model through the real `generateText`, checking the events, the five model calls, and that the last call saw four tool results.
- **`nextjs/content/experiments/mini-claw.md`:** `status: working`. Contains how to try it, a what's-in-it table, the loop and the tool explained, the **side-by-side table of mini-claw and Claude Code** (harness, standing instructions, memory, skills, tools, permissions, the loop, who is in the loop, the trace, the model; each Claude Code row cites its docs page, which the thread fetched on 2026-10-19), the 2026 agent screenshots (OpenClaw, Hermes Agent, Grok Bot, Muse, dots) with dates taken from task J's history page, a safety note on the lethal trifecta, links to the glossary entries, and open questions.

## 2. How to try it

Open http://localhost:3000/mini-claw. **Choose "Scripted stand-in"** (no key needed) and press **Run**, or use a starter. Starter notes:

- **Remember something** then **Use the memory**: the second run starts with no conversation and can only know about the paper from `memory.md`. This is the clearest demo, but it needs Claude; the stand-in makes the same four calls whatever you type.
- **Keep a passage**: should load the commonplace-book skill and file the quotation (needs Claude to choose the skill).
- **Try to escape**: asks for `../nextjs/.env.local`; with either engine the stand-in or Claude hits the refusal.

**Needs `OPENROUTER_API_KEY` for Claude only.** The key goes in `nextjs/.env.local`, then restart the dev server. Checked on 2026-10-19 (counting lines only, never reading values): `nextjs/.env.local` now exists, but it has no non-empty `OPENROUTER_API_KEY=` line, so the Claude option is still unavailable. Resetting after demos: `git checkout -- mini-claw/memory.md` (and `mini-claw/notes/` is gitignored).

Checked on 2026-10-19: `/mini-claw` and `/experiments/mini-claw` both return 200; `node --test app/api/mini-claw/mini-claw.test.mjs` from `nextjs/` gives 4 pass, 0 fail (it works only in temp folders). I did not run a request against `POST /api/mini-claw` because it would write into the real workspace.

## 3. Commits

- `98250b0` "Mini-claw (task H): an agent loop with one file tool, memory.md, skills, and a trace" (2026-10-19 15:06:08 -0400): 16 files, 828 insertions. Covers `mini-claw/`, `nextjs/app/api/mini-claw/`, `nextjs/app/mini-claw/`, and `nextjs/content/experiments/mini-claw.md`.

Nothing of this thread is uncommitted. Not pushed; the Notebook's submodule pointer was not bumped. The thread's first commit attempt failed because zsh didn't split a path variable; it recommitted with the paths listed, by path as rule 7 requires.

## 4. What I couldn't do or didn't check

- **The Claude path has never run.** There was no `OPENROUTER_API_KEY` in `nextjs/.env.local` (the file didn't exist) or in The Notebook's toolbox `.env` (the thread's grep found none). Everything was tested with the scripted stand-in through the real `generateText`. Untested: that Claude, through OpenRouter with the AI SDK 7 provider, accepts a tool with no `execute` and the `role: "tool"` message with `output: { type: "text", value }` shape; that it loads skills unprompted; and what it says in reply to the "Try to escape" refusal. The thread said so in the doc's first open question.
- **`pnpm test` does not run the mini-claw test.** The package script is `node --test tests/*.test.mjs` and this test lives in `app/api/mini-claw/`. The thread ran it directly. (Checked on 2026-10-19: package.json line 13.) The ELIZA task, by contrast, put its test in `tests/`.
- The thread checked the page in a separate headless Chromium (the shared Playwright browser was in use by another agent): no console errors and it fit a phone-width screen. I did not repeat that.
- The claim that all glossary links resolve was checked by the thread; I did not re-check.
- The thread corrected the doc's safety note to use Simon Willison's definition of the lethal trifecta (private data, untrusted content, external communication) after finding its first wording ("the ability to act") wrong. The glossary entry `lethal-trifecta.md` was not touched or re-read by me.

Checked on 2026-10-19: the files, line count (59), test results, commit, and routes all match what the thread reported.

## 5. For other tasks

- **N4 (the runner) extends this.** Things it will want to know:
  - Reuse points: `runAgent` takes `root`, `model`, and a `report` callback; `runFileTool(input, root)`, `resolveInside(root, asked)`, `readMemory(root)`, `listSkills(root)`, and `PERMISSIONS` all take or use a `root`, so a different workspace (a claw's folder of Markdown files) works without changing the safety code. The system prompt text is hard-coded in `agent.mjs`, and the memory file name (`memory.md`) and the `skills/` and `notes/` conventions are hard-coded in `workspace.mjs` and the permission table; N4 would change those first.
  - Limits to keep in mind: one tool; `write` only inside `notes/` as Markdown, so a claw that must edit its own `SOUL.md`-style files needs new permission rows (and a decision about letting a character rewrite itself; mini-claw deliberately forbids the agent to change its skills or rewrite memory); single-line appends to memory (a line may still be up to 20,000 characters); no per-run budget besides the ten-step limit and `maxOutputTokens: 2048`; one run per task, no multi-turn conversation; the symlink check has no protection against a file swapped between check and use (a race the thread did not discuss); `WORKSPACE` depends on `process.cwd()` being `nextjs/`.
  - The loop calls `generateText` once per step and builds the message list by hand (`messages.push(...result.responseMessages)`); it does not use `stopWhen`. The SDK's own loop is mentioned in the doc as the alternative.
  - The trace protocol (NDJSON events above) is what `MiniClaw.jsx` renders; N4's UI can reuse the shape.
- **B:** mini-claw imports `DEFAULT_CHAT_MODEL` from `app/api/chat/route.js`, so changing that export or the file's location breaks the route.
- **G (layers):** the thread suggested G may want the same lethal-trifecta wording correction (the third part is sending data out, not "the ability to act"). I did not check G's page.
- **K:** the 2026 agent screenshots (`21`–`25`) are already placed in the mini-claw doc.
- **N1/N2/N3/N7/N8:** the side-by-side table (mini-claw vs. Claude Code) is a ready comparison for the `/agents` explainer; extend it to the real claws there. Glossary entries it links under `interfaces-and-agents/` include `agent`, `agent-loop`, `harness`, `tool-use`, `skills`, `memory`, `lethal-trifecta`, `permissions`, `trace`, `progressive-disclosure`, `instruction-files`, `tool-call`, `tool-result`, `stopping-condition`, `prompt-injection`, and `claude-code`.

## 6. Marlon's words

Beyond the task prompt (pasted at 2026-10-19T18:55:24 UTC):

- 2026-10-19T19:30:38 UTC: "are you done?"

## 7. Decisions and open questions

Decisions the thread made that someone might revisit:

- **Hand-written loop instead of the SDK's own multi-step loop,** for readability in class.
- **The tool is `file`, a notes/memory tool,** chosen as a vivid demo (remember something, then use the memory). It reads anywhere in `mini-claw/`, writes only Markdown in `notes/`, and appends to `memory.md` one line at a time; it cannot touch skills or delete.
- **A scripted stand-in model** was added so the loop is testable and demoable without a key; it is clearly labeled in the UI.
- **Demo notes are gitignored; `memory.md` is tracked,** so `git diff mini-claw/memory.md` shows what the agent learned.
- **Each run is one task, not a conversation,** so memory is visibly the only carry-over.

Open questions left in the doc (for Marlon):

1. Add `OPENROUTER_API_KEY` so the Claude path can be tested; then check that Claude loads skills unprompted and that "Try to escape" gives a sensible reply.
2. Should a run be able to continue as a conversation?
3. Should the page ask before acting (a Claude Code-style permission prompt that pauses the loop; the AI SDK supports this via `toolApproval`)?
4. A "reset memory" button for class, so `memory.md` need not be restored from git between demos?

At the end the thread offered to do the Claude check itself if Marlon adds the key.

**Thread:** `e3a4dacc-096e-4ccb-b7f8-bb59ea278fa4`, Claude Code, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `claude --resume e3a4dacc-096e-4ccb-b7f8-bb59ea278fa4` from that directory. (The original thread did not write its own report file.)
