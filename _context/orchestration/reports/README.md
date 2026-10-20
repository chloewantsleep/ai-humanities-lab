---
title: Reports and handoffs
updated: 2026-10-19
---

# Reports and handoffs

One file per task: what was built, how to try it, the commits, what wasn't done or checked, notes for other tasks, Marlon's words, and the thread to resume (rule 8 of [the board](../README.md)). Agents write their own report when they finish; if resumed, they update the same file.

The reports below for the first wave were written after the threads had closed, on 2026-10-19, by Claude Code subagents working from each thread's transcript and checking it against the repo. Each says so in its `written_by:` line. They were written before the board became the `_context/orchestration/` folder, so where they mention `_context/orchestration.md` or `_context/reports/`, read `_context/orchestration/README.md` and `_context/orchestration/reports/`.

| Report | Task | Agent | Status |
|---|---|---|---|
| [A-engine.md](A-engine.md) | A. Browser language-model engine | Codex | done |
| [B-chat.md](B-chat.md) | B. Claude chat route and shared chat shell | Codex | partly done: no live Claude call yet (no key) |
| [F-eliza.md](F-eliza.md) | F. ELIZA | Claude Code | done |
| [G-layers.md](G-layers.md) | G. The layers around the model | Codex | done; live replies untested (no key) |
| [H-mini-claw.md](H-mini-claw.md) | H. Mini-claw | Claude Code | partly done: tested with a scripted stand-in, the Claude path has never run |
| [I-fine-tune.md](I-fine-tune.md) | I. Fine-tune notebook | Codex | done locally; never run on Colab |
| [J-fact-check.md](J-fact-check.md) | J. Fact-check | Codex | done; 13 claims left open |
| [L0-L1-glossary-route-and-chatbots.md](L0-L1-glossary-route-and-chatbots.md) | L0 glossary route, L1 chatbots | Claude Code | done |
| [L2-models-and-training.md](L2-models-and-training.md) | L2 models and training | Claude Code | done |
| [L3-persona-and-dialogue.md](L3-persona-and-dialogue.md) | L3 persona and dialogue | Codex | done |
| [L4-interfaces-and-agents.md](L4-interfaces-and-agents.md) | L4 interfaces and agents | Codex | done |
| [L5-people-and-texts.md](L5-people-and-texts.md) | L5 people and texts | Claude Code | done |
| [M-story.md](M-story.md) | M. The scrollytelling essay at `/story` | Claude Code | a full first draft, not yet read by Marlon |
| [T-retrieval.md](T-retrieval.md) | T. `/retrieval`: knowledge files, the custom GPT's RAG made visible | Claude Code | done (`0782e89`); one live search-to-Claude-answer run, most other paths untested; written from the transcript 2026-10-20 |
| [screenshots-history.md](screenshots-history.md) | The history screenshots (not a board task) | Claude Code | done; side effects left in Marlon's accounts |

Two other threads from the same afternoon worked in The Notebook rather than here: adding the ENG 298AI context repo as a submodule (handoff in The Notebook at `_context/projects/50-in-focus/humanities-ai-lab/handoffs/`), and renaming a GitHub org.

The coordinating thread, which wrote the orchestration doc and the prompts for these agents, is Claude Code `6e61228f-6c66-48cd-984d-4778bc90e28c`, started in `/Users/mk/Development/mk-27/apps/the-notebook` (`claude --resume 6e61228f-6c66-48cd-984d-4778bc90e28c`).
