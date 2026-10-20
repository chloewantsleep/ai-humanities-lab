---
task: "L4 Glossary: interfaces and agents"
thread_id: "01a15578-1ada-7a40-8779-436e597c09a9"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15578-1ada-7a40-8779-436e597c09a9"
ran: "18:41–18:46 UTC, 2026-10-19"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# L4: Glossary, interfaces and agents

## What I built

The thread wrote one glossary category in `nextjs/content/glossary/interfaces-and-agents/`: **39 entries plus a `README.md`** (40 files). The README opens with a framing paragraph and a table of all 39 terms ordered "from a chat window outward to an agent with its own computer": chat interface, typing indicator, streaming, conversation history, custom instructions, projects, knowledge (files), retrieval (RAG), memory, context assembly, compaction, tool use, function calling, tool call, tool result, plugins, MCP, skills, progressive disclosure, CLAUDE.md / AGENTS.md (slug `instruction-files`), agent, agent loop, workflow, harness, Claude Code, workspace, trace, stopping condition, permissions, human in the loop, sandbox, least privilege, prompt injection, the lethal trifecta, subagent, hooks, computer use, always-on agent, an agent's own computer (`agent-computer`).

Beyond the orchestration doc's candidate list the thread added the supporting vocabulary needed to read an agent trace: tool call, tool result, context assembly, compaction, stopping condition, workspace, trace, workflow, human in the loop, least privilege, progressive disclosure, subagent, hooks, agent-computer. Claude Code is the running example throughout. Four screenshots from `content/history/_images/` are embedded where they explain a term better than words: the Gemini Gem editor with Knowledge (`20-gemini-gem-editor-knowledge.png`), ChatGPT project settings (`10-chatgpt-project-settings-instructions.png`), the Claude project instructions dialog (`14-claude-project-instructions-dialog.png`), and the xAI Grok Bot announcement (`25-xai-introducing-grok-bot-aug2026.png`). Checked on 2026-10-19: all four files exist.

**Entry counts:** 39 entries (README excluded). Experiments linked: `layers`, `mini-claw`, `persona-dial`. Reading ids used: only `plato-phaedrus` and `sacks-1974`; most entries have no "In the readings" section, which is as the format allows.

## How to try it

Open http://localhost:3000/glossary/interfaces-and-agents, or an entry such as `/glossary/interfaces-and-agents/memory`. Static Markdown; no `OPENROUTER_API_KEY` is needed to read it. Checked on 2026-10-19: the category and `memory` return HTTP 200, as do `/layers` and `/mini-claw`. (During the thread nothing answered on localhost:3000, so it could not look at pages in a browser.)

## Commits

**The entries were committed by someone else's commit.** The thread's files were swept into `61a6a48` "Orchestration: add task M, a scrollytelling history of the chatbot at /story", authored mkuzmick, 2026-10-19 14:45:33 -0400 (18:45:33 UTC), because agents were sharing one git index and task M's plain `git commit` (not by path) carried the staged L4 files along. That commit touches 41 files: `_context/orchestration.md` plus the whole L4 folder (README and 39 entries, 1355 lines). The thread ran its own `git add` and `git commit -m "Add interfaces and agents glossary with 39 entries" -- nextjs/content/glossary/interfaces-and-agents` and then saw that the files were already committed; `git log` shows **no separate L4 commit**. Verified: `git log -- nextjs/content/glossary/interfaces-and-agents` lists only `61a6a48`. Nothing in the folder is uncommitted. Not pushed. (This accident is why rule 7 in the orchestration doc says to commit by path.)

## What I couldn't do or didn't check

- Browser rendering was not checked (no server was responding when the thread tried). It did check frontmatter, section order, local links, experiment metadata and README coverage by script, and that the app's content loader resolves every page.
- **"(verify)" marks, exactly two:** `always-on-agent.md` line 21 (the history collection's announcement-page screenshots present persistent agents; their feature and availability claims "need independent confirmation") and the README's closing sentence ("unconfirmed product promises remain marked '(verify)'"). The Grok Bot screenshot caption is also hedged ("this records product presentation; it does not verify the advertised capabilities").
- **Stale wording, noticed on 2026-10-19:** the entries describe `/layers` and `/mini-claw` as *proposals* and *design briefs* ("mini-claw proposes...", "this describes the proposed experiment, not a claim that it has been built"). That was accurate when the thread wrote them, but tasks G and H landed during the same hour (both experiments now have `status: working` and committed code). The hedged language in roughly twenty entries (and the README) should be revised once someone has looked at the finished experiments. Similarly the entries link `../../experiments/mini-claw.md` as "the experiment brief".
- The thread flagged one subtle point: Willison's third trifecta element is "external communication", whereas the mini-claw brief says "the ability to act"; `lethal-trifecta.md` keeps the distinction. It did not independently confirm Willison's wording beyond what it read online.

## For other tasks

- **Dangling cross-links.** At the time of its report, four links pointed at entries that did not yet exist: `chatbots/claude-projects.md`, `chatbots/custom-gpts.md`, `models-and-training/context-window.md`, `models-and-training/weights.md`. **Checked on 2026-10-19: all four now exist, and every relative link and every `see_also` slug in the L4 folder resolves. There are no broken links now.**
- **N7 (claw vocabulary): which claw-related terms already exist.** No entry in this folder is claw-specific: `grep` finds "claw" and "hermes" only through "mini-claw" references. Not present: `soul-md`, `identity-md`, `user-md`, `heartbeat-md`, `bootstrap-md`, `tools-md`, `memory-md`, a dated memory log, `gateway`, `channel`, `heartbeat`, `cron`, `session`, `self-written skill`. Already present and relevant, so extend or link rather than redefine: `workspace` (N7 says to extend it), `memory`, `compaction`, `skills`, `instruction-files` (CLAUDE.md / AGENTS.md), `agent`, `agent-loop`, `harness`, `always-on-agent`, `agent-computer`, `subagent`, `hooks`, `trace`, `stopping-condition`, `context-assembly`, `progressive-disclosure`, `lethal-trifecta`, `prompt-injection`, `permissions`, `sandbox`, `least-privilege`, `human-in-the-loop`. Elsewhere in the glossary, `chatbots/openclaw.md`, `chatbots/hermes-agent.md`, `chatbots/grok-bot.md` and `chatbots/grok.md` exist. Note N7 must update this folder's README table. Note that the CLAUDE.md / AGENTS.md entry's slug is `instruction-files`.
- **K and G/H owners:** the stale "proposed" wording above; also the four embedded screenshots could be reused in `/layers` and `/mini-claw`.
- **P/J:** the thread's sources are Claude Code docs, OpenAI/Google/Anthropic help pages and Willison's writing; no reading ids beyond `plato-phaedrus` and `sacks-1974`.

## Marlon's words

None beyond the task prompt (received 18:41:38 UTC).

## Decisions and open questions

- The thread split "projects" (general idea, here) from "Claude Projects / custom GPTs" (products, in `chatbots/`), as instructed, and linked across.
- It treated permissions as enforced rules and instruction files as advice, and said so in both entries; it also separated sandbox from permissions from least privilege.
- Open for Marlon or the next task: whether to rewrite the "proposed" experiment language now that G and H are built (see above); whether to add a `session`/`heartbeat`/`gateway` cluster (N7 will); no direct question was left for Marlon.
