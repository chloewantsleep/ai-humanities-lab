---
title: Orchestration — the task board for the chatbot experiments
updated: 2026-10-20
orchestrator: "Claude Code 9b639a81-e358-4142-9f22-26dc755aec5f (since 2026-10-20; see ORCHESTRATOR.md)"
---

# Orchestration: the task board

Marlon has several agents prototyping these experiments in parallel, directed by one orchestrating agent. This folder is how they coordinate:

- **`README.md`** (this file): the board. The state of the app, the rules every agent follows, the table of tasks with their status, and the to-dos.
- **[`tasks/`](tasks/)**: one brief per task (`C-spiral.md`), each meant to be handed to one agent as-is. Shared briefs for task families: [`N-claw-workbench.md`](tasks/N-claw-workbench.md) and [`L-glossary.md`](tasks/L-glossary.md). A finished task's brief stays here, as the record of what was asked.
- **[`reports/`](reports/)**: one report per task, written by the agent when it finishes ([index](reports/README.md)). The board is updated from these.
- **[`ORCHESTRATOR.md`](ORCHESTRATOR.md)**: how to be the orchestrator, and the log of which thread has held the role.

**If you are an agent given a task:** read this board, then your brief in `tasks/`, then do the task, then write your report in `reports/`. **If you are the orchestrator:** read `ORCHESTRATOR.md` first.

The argument behind the experiments is in the planning note in The Notebook (`ll-26-27/the-notebook`, `_context/projects/50-in-focus/mk-chatbot-experiments/20261019-base-to-assistant-ideas.md`); each experiment's own description is its document in `nextjs/content/experiments/`.

## State on 2026-10-19

- `nextjs/` is a Next 16 app (plain JavaScript and the app's own CSS, forced dark, Inter, red accent), copied from `tdm155ai/tdm155ai-week-6` with its week-specific parts removed. It renders the Markdown in `nextjs/content/` (`content/a/b.md` is `/a/b`); `/print` in front of any address gives a light printable page. An experiment's document (`/experiments/<name>`) redirects to the route that runs it, which shows the document beneath the experiment.
- Each experiment has a route in a shared frame (`app/components/ExperimentPage.jsx`): `/spiral`, `/by-hand`, `/persona-dial`, `/eliza`, `/layers`, `/mini-claw`, `/fine-tune`. Unbuilt ones show a "Not built yet" panel. Also: `/engine` (A's test page), `/chat-demo` (B), `/story` (M), `/glossary` (L0), `/history` (43 screenshots of chat interfaces, images in `content/history/_images/`).
- Installed: `@huggingface/transformers` 4.3.1, `ai` 7, `@ai-sdk/react` 4, `@openrouter/ai-sdk-provider` 3, `@assistant-ui/react` 0.15, `@assistant-ui/react-ai-sdk` 1.4, `zod` 4. These are newer than most models' training data: read the package's own docs and types in `node_modules/` before writing against them, and read `node_modules/next/dist/docs/` before relying on Next conventions (see `nextjs/AGENTS.md`).
- **Research:** `_context/research/20261019-chatgpt-deep-research-history-of-the-chatbot.md`, a ChatGPT deep-research history of the chatbot (secondary and unverified; its citation markers can't be followed). Useful to M, M2a, J, L1, P, and Q; check every claim before using it.
- **Keys:** `OPENROUTER_API_KEY` is in `nextjs/.env.local` since the morning of 2026-10-20 (T got a live Claude answer through `/api/chat`). The other Claude paths still need a live test (V's QA).
- **Tests:** `pnpm test` passes (10 tests); H's own mini-claw test passes when run directly but isn't in `pnpm test` (R adds it).
- **Models:** checked on Hugging Face on 2026-10-19 (ONNX weights exist): `Xenova/gpt2`, `onnx-community/SmolLM2-135M-ONNX` (base), `HuggingFaceTB/SmolLM2-135M-Instruct` and `onnx-community/SmolLM2-135M-Instruct-ONNX`, `onnx-community/gemma-3-270m-ONNX` (pt) and `onnx-community/gemma-3-270m-it-ONNX`, `onnx-community/Qwen3-0.6B-ONNX`. There is **no** `onnx-community/Qwen3-0.6B-Base-ONNX`. Measured on Marlon's M3 (A's report): GPT-2 is a 130 MB download and SmolLM2-135M 140 MB; WASM ran about 23 tokens/s and WebGPU 8–10.

## Today, 2026-10-20: two tracks

Class is today (ENG 298AI, "How to build and test a chatbot"). Marlon: "split into two categories: 1) prep the MVP for today and test well, 2) continue to prototype different ideas, maybe 1 or 2 might make it into the session, and no matter what we will share many as works-in-progress for students to look at as they learn claude code." Each brief has a `track:` line.

- **MVP, added at 08:20 from Marlon's voice session** ([its record](../../../../_context/projects/50-in-focus/humanities-ai-lab/handoffs/20261020-voice-session-run-of-show-and-repo.md) is in The Notebook): O (the Slack Ensemble: every student's bot in Slack today, built here in `slack-ensemble/`), AA (`/bot-lab`, the chat app where students build their bot), AB (student keys: test workshop-keys for real, then `/keys`). O and AA share one bot format, `nextjs/bots/README.md`, set by the orchestrator; change it only through the orchestrator.
- **MVP (test well):** C (spiral room, GPT-2), D (the assistant written into the prompt, with the original Askell et al. prompt), R (cleanup), T (`/retrieval`, done), U (the Claude Desktop handout), V (today's path through the site and classroom QA). Already built and in the path: F (`/eliza`), G (`/layers`).
- **Prototypes (works in progress students will see):** S (`/markov`), W (Rosie and Roomba), X (reading rooms), Y (knowledge and voice), Z (tics and Bergson); then E, Q, N1, M2a and the rest of the queue.
- **Dev server:** one, Marlon's, on http://localhost:3000 from `nextjs/`. Don't start a second dev server in `nextjs/` (they share `.next/`). If it's down, say so and wait.

## Rules for every agent

1. **Stay in your folders.** Your brief names the files you own. A route's styles go in a CSS file beside it (`app/<route>/<route>.css`, imported by the route), not in `app/globals.css`. If you must change a shared file (`globals.css`, `Chrome.jsx`, `ExperimentPage.jsx`, `lib/content.mjs`, `package.json`), keep the change small and say so in your report.
2. **Dependencies:** add with `pnpm add` from `nextjs/` (pnpm only, never npm or yarn). If the lockfile conflicts with another agent's change, run `pnpm install` and keep both.
3. **The dev server** is usually already running on http://localhost:3000 from `nextjs/`. Don't start a second one on the same port; if you need your own, use `pnpm dev --port <other>`.
4. **Keys** go in `nextjs/.env.local` (gitignored; template in `nextjs/.env.example`). Never print, commit, or copy a key into a doc.
5. **Update the experiment's document** as you go: set `status:` to `building`, then `working`; rewrite "What to build" into what was built and how to use it; keep open questions at the bottom.
6. **Facts:** the planning note's product names, dates, and figures are unverified. Don't put a fact on a page as true unless you checked it; mark it "(verify)" otherwise.
7. **Git:** several agents share one working tree and one index, so another agent's staged files will ride along with a plain `git commit`. Always commit by path: `git add <your paths>` and then `git commit -m "…" -- <your paths>`, never `git add -A`, `git add .`, or `git commit -a`. (On 2026-10-19 the L4 glossary entries went into the commit "Orchestration: add task M" this way.) Commit your own files in this repo with a clear message, authored as Marlon's GitHub account (see the Notebook's `_context/resources/tools/github.md`). Don't push and don't bump the submodule pointer in The Notebook unless Marlon says to.
8. **Report back, in a file as well as in your chat:** when you finish (or stop), write `_context/orchestration/reports/<the report name in your brief>.md` and commit it with your work. The board is updated from these files, so a report that exists only in your chat is lost to the next agent. Frontmatter: `task`, `thread_id`, `agent` (Claude Code or Codex), `started_in`, `resume` (the command), `status`. Sections: **What I built** (files and routes), **How to try it** (the URL and what to click), **Commits** (hashes), **What I couldn't do or didn't check**, **For other tasks** (anything another task needs to know, by task letter), **Marlon's words** (anything he said in your thread, quoted exactly), and **Decisions and open questions**. If you are resumed later, update the same file rather than starting a new one. Don't edit this board: the orchestrator does that from your report.
9. **Put your thread ID in your report and in any handoff doc you write**, with the directory you were started in, so Marlon can resume you later. Claude Code: `echo $CLAUDE_CODE_SESSION_ID`, resumed with `claude --resume <id>` from that directory. Codex: `echo $CODEX_THREAD_ID`, resumed with `codex resume <id>`. If the variable is empty, say so; don't guess from the newest session file, which may belong to another agent running in parallel.

## The tasks

Each task's letter links to its brief. Status as of the evening of 2026-10-19, from the reports.

| Task | What | Status | Depends on | Report |
|---|---|---|---|---|
| [A](tasks/A-engine.md) | Browser language-model engine | done | — | [A-engine](reports/A-engine.md) |
| [B](tasks/B-chat.md) | Claude chat route and the shared chat shell | partly done: no live Claude call yet (no key) | — | [B-chat](reports/B-chat.md) |
| [C](tasks/C-spiral.md) | The spiral room | done (`cafa2e6`, `22c3d47`); GPT-2 works cold and warm, WASM default, recorded-runs fallback; 130 MB cold download | A | [C-spiral](reports/C-spiral.md) |
| [D](tasks/D-by-hand.md) | Building the assistant by hand (four columns) | done (`889a286`, `d98441b`); four columns live; column 2 with the whole HHH prompt waits ~40 s (WebGPU), capped on WASM; ~410 MB cold | A, B | [D-by-hand](reports/D-by-hand.md) |
| [E](tasks/E-persona-dial.md) | The persona dial | not started | B, F | |
| [F](tasks/F-eliza.md) | ELIZA | done | — | [F-eliza](reports/F-eliza.md) |
| [G](tasks/G-layers.md) | The layers around the model | done; live replies untested (no key) | B | [G-layers](reports/G-layers.md) |
| [H](tasks/H-mini-claw.md) | Mini-claw | partly done: the Claude path has never run (no key) | B | [H-mini-claw](reports/H-mini-claw.md) |
| [I](tasks/I-fine-tune.md) | Fine-tune notebook | done locally; never run on Colab | — | [I-fine-tune](reports/I-fine-tune.md) |
| [J](tasks/J-fact-check.md) | Fact-check the history and the planning claims | done; 13 claims open | — | [J-fact-check](reports/J-fact-check.md) |
| [K](tasks/K-screenshots.md) | Fix the screenshots and use them in the experiments | not started | J, and each experiment | |
| [M](tasks/M-story.md) | The scrollytelling essay at `/story` | a full first draft | — | [M-story](reports/M-story.md) |
| [M2a](tasks/M2a-story-v2-design.md) | Thinking about v2 of the story: a design document, no code | not started | M | |
| [M2b](tasks/M2b-story-v2-build.md) | Build v2's first show piece at `/story-v2` | waiting | M2a, Marlon's choice | |
| [P](tasks/P-readings-gaps.md) | Fill the gaps in the readings: launch posts and missing papers | not started | — | |
| [Q](tasks/Q-ads.md) | `/ads`: a player for the major AI ads, with the list beside it | not started | — | |
| [R](tasks/R-cleanup.md) | Cleanup after the first wave: broken links, stale labels, tests | done (`024bd8a`, `738e74f`, `31b59d7`, `d7c5a33`) | — | [R-cleanup](reports/R-cleanup.md) |
| [S](tasks/S-markov.md) | `/markov`: a Markov chain over the course readings (prototype) | working (`72ffc17`, browser fix `87d93ef`) | — | [S-markov](reports/S-markov.md) |
| [T](tasks/T-retrieval.md) | `/retrieval`: knowledge files, RAG made visible (MVP) | done (`0782e89`); built before it had a brief | A, B | [T-retrieval](reports/T-retrieval.md) |
| [U](tasks/U-desktop-handout.md) | The Claude Desktop handout: build and test a chatbot as a Claude project (MVP) | done (`cf006cf`); pages and downloads load; print not checked by eye | — | [U-desktop-handout](reports/U-desktop-handout.md) |
| [V](tasks/V-session-path-and-qa.md) | Today's path through the site, and classroom QA of everything built (MVP) | parts 1–2 done (`557311f`, `5044a26`, `49b488b`, `29916f0`); part 3 (/spiral, /by-hand) ready to resume: `claude --resume 9257f40b-ab2a-447c-b59e-4e1c6388bf29` | second pass after C, D | [V-session-path-and-qa](reports/V-session-path-and-qa.md) |
| [W](tasks/W-rosie-roomba.md) | Rosie and Roomba: a page and a reusable presentation component (prototype) | working (`ea83ff6`, `cb8bcfd`); six beats and the reusable `RosieRoomba` component | — | [W-rosie-roomba](reports/W-rosie-roomba.md) |
| [X](tasks/X-reading-rooms.md) | Reading rooms: one interaction per reading, design then build two (prototype) | done (`c50fa85`, `244b5b1`, `09a2305`); design for 11 texts; Phaedrus and turn-taking rooms built | — | [X-reading-rooms](reports/X-reading-rooms.md) |
| [Y](tasks/Y-knowledge-voice.md) | `/knowledge-voice`: files vs. instructions, a 2×2 (prototype) | working (`2118f59`, `ab44711`, `49059ae`); 2×2 plus a fifth cell; one live run; 4–5 paid calls per comparison | T, B, the key | [Y-knowledge-voice](reports/Y-knowledge-voice.md) |
| [Z](tasks/Z-tics.md) | `/tics`: model writing habits and Bergson's mechanical (prototype) | implemented (`ae41cc4`, `7313692`); rendering checked on the shared server (`1a4819b`) | — | [Z-tics](reports/Z-tics.md) |
| [O](tasks/O-slack-ensemble.md) | The Slack Ensemble: every student's bot in Slack today (MVP, the finale) | not started | the bot format | |
| [AA](tasks/AA-bot-lab.md) | `/bot-lab`: the chat app where students build their bot, with a model selector (MVP) | not started | the bot format, B | |
| [AB](tasks/AB-keys.md) | Student keys: test workshop-keys for real, then `/keys` (MVP) | not started | Marlon's management key for part 2 | |
| [AC](tasks/AC-chat-interfaces.md) | The familiar chat interfaces: assistant-ui's stock thread at `/chat-ui`, and an evaluation of Vercel's AI chatbot starter (prototype) | not started | B | |
| [AD](tasks/AD-site-sections.md) | Site structure: home page, the full /experiments list in groups, `/workshop` rewritten to Marlon's arc (MVP) | not started | — | |
| [AE](tasks/AE-gpt-2-rename-and-get-ready.md) | Rename the spiral room to `/gpt-2`; a `/get-ready` page that preloads the models (MVP) | not started | C | |
| [AF](tasks/AF-shared-fixes.md) | Shared fixes: Markdown in ChatShell, `/print/<route>`, all tests in `pnpm test`, mini-claw's memory (MVP) | not started | — | |
| [AG](tasks/AG-vercel-and-local.md) | Ready for Vercel and for running locally; spending protection; no deploy without Marlon (MVP prep) | not started | — | |
| [AH](tasks/AH-rag.md) | `/rag`: the whole retrieval pipeline with the vectors and the dot product (prototype) | not started | T | |
| [AI](tasks/AI-bot-room.md) | `/bot-room`: two or three bots in one conversation (prototype) | not started | the bot format, AA | |
| [N1](tasks/N1-claw-research.md) | Research: how OpenClaw and Hermes Agent work | not started | — | |
| [N2](tasks/N2-agents-explainer.md) | The `/agents` explainer: the anatomy of a claw | not started | N1 | |
| [N3](tasks/N3-workspace-builder.md) | The workspace builder: write a claw's Markdown files | not started | N1 (a draft can start now) | |
| [N4](tasks/N4-claw-runner.md) | The runner: run a workspace in a claw-like loop | not started | H, N3 | |
| [N5](tasks/N5-heartbeat-and-channels.md) | Heartbeat and channels | not started | N4 | |
| [N6](tasks/N6-ensemble.md) | The ensemble: several claws in one room | not started | N4 | |
| [N7](tasks/N7-claw-glossary.md) | Glossary: the claw vocabulary | not started | N1 | |
| [N8](tasks/N8-soul-file-essay.md) | An essay: the soul file | not started | N1 (the argument can start now) | |
| [L0](tasks/L0-glossary-route.md) | The glossary route and index | done | — | [L0-L1](reports/L0-L1-glossary-route-and-chatbots.md) |
| [L1](tasks/L1-chatbots.md) | Glossary: chatbots | done | — | [L0-L1](reports/L0-L1-glossary-route-and-chatbots.md) |
| [L2](tasks/L2-models-and-training.md) | Glossary: models and training | done | — | [L2](reports/L2-models-and-training.md) |
| [L3](tasks/L3-persona-and-dialogue.md) | Glossary: persona and dialogue | done | — | [L3](reports/L3-persona-and-dialogue.md) |
| [L4](tasks/L4-interfaces-and-agents.md) | Glossary: interfaces and agents | done | — | [L4](reports/L4-interfaces-and-agents.md) |
| [L5](tasks/L5-people-and-texts.md) | Glossary: people and texts | done | — | [L5](reports/L5-people-and-texts.md) |

Not a task, but reported: [the history screenshots](reports/screenshots-history.md), taken by an agent before the board existed.

**Can start now (2026-10-20, 08:30):** MVP: O, AA, AB, AD, AE, AF, AG, and resume D (column-2 toggle) and V (part 3); earlier: C, D, R, U, V. Prototypes: AC, AH, AI (and earlier S, W, X, Y, Z). Next wave: E, Q, N1, M2a, P, then K, N3, N8. **Then:** M2b after Marlon reads M2a; N2 and N7 after N1; N4 after N3; N5 and N6 after N4.

## To-dos (updated 2026-10-19, evening)

**Marlon**
- [ ] Create an OpenRouter management key with a short expiry and put it in `apps/workshop-keys/.env` yourself (AB part 2). The course app's key is an ordinary key with about $25 left of its $100 limit (08:15): top it up or raise the limit before class if the room will use it.
- [ ] Say which Slack workspace the students are in, and create the "AI Humanities Lab Ensemble" app from O's manifest when it lands.
- [ ] (from U) Do students know which Claude plan they're on (free, Pro, a Harvard license)? Free accounts may lack project instructions and the Code tab; the help center contradicts itself. One look on a free account before class would settle it.
- [ ] Read M2a's design document for the story's v2 (`_context/story-v2/design.md`) when it lands, and choose the show pieces.
- [ ] Read the rest of the story draft (`/story`) and mark what to keep.
- [ ] Decide on the "Course TF Assistant" custom GPT, ChatGPT project, Claude project, and unsaved Gem left in your accounts by the screenshot agent: delete, or keep for G.
- [ ] Push `mk/czech-rur` in the ENG 298AI context repo (local only), or say to; until then The Notebook shouldn't commit its pointer to that repo.
- [ ] Say where the GitHub org handoff (`ll-26-27-secret`) should be filed, if anywhere; it is in the first orchestrator's scratchpad, not a repo.
- [ ] Say whether the story's links to course texts (a private repo) are acceptable, and which *Frankenstein* chapters the glossary should cite (or ask Martin).
- [ ] Approve cropping and redacting the screenshots (K) before anything goes public; decide whether the eventual public course repo gets code or only selected docs.
- [ ] Decide whether to add the slow-computer work (the engine defaulting to WASM, a speed check with a recorded fallback, a "get ready" page that preloads models) and test on the slowest machine available.
- [ ] Optional: delete about 3 GB of gitignored fine-tune artifacts in `fine-tune/` (`.venv`, `.cache`, `outputs`).

**Agents, next batch** (prompts from the orchestrator on request): R, P, Q, C, E, N1, and M2a. After them: D, K, N3, N8; then N2, N4–N7.

**Orchestrator:** test the Claude paths once the key is in; write the next prompts with effort headers; update this board from the reports as agents finish; commit The Notebook's untracked `humanities-ai-lab/20261019-gathered/` and `readings/` when Marlon says.

**Done today by the orchestrator:** `/experiments/<name>` redirects to the experiment's route (`e1dc5b5`); the board became this folder.
