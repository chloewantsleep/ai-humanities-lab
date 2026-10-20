---
title: "The claw workbench (tasks N1–N8): shared brief"
---

# The claw workbench: shared brief for N1–N8

Added 2026-10-19 at Marlon's request: "I'd love to build out a route with a doc that explains them, especially all their quirky md-doc centric stuff like soul.md etc. And then have the ability to construct and run something that mimics it."

The 2026 personal agents (OpenClaw, Hermes Agent, and their kin) are strikingly Markdown-centric: the agent is a folder of plain-text files (a soul, an identity, a description of its user, standing instructions, a heartbeat checklist, memory logs, skills), assembled into context on every turn, and the agent edits some of those files itself. For this course that is the argument made literal: the assistant is a character written into a document, and here the document is a folder the character keeps rewriting. The workbench explains that anatomy, lets students write a workspace, and runs it in a loop that mimics the real thing.

**How it relates to H (mini-claw):** H is the smallest possible agent (loop, memory, one tool, skills), built to be read in one sitting. N is the full anatomy of a 2026 claw. N4 extends H's loop rather than forking it: if H's code needs to become a small library to be shared, N4 does that refactor and tells H's owner.

**Material already in hand:**
- Marlon ran OpenClaw himself in February 2026 on a Mac mini, with several agents side by side: his setup notes are in the mk-27 workbook at `apps/claude-week-3/_context/reference/reference-library/plans/the_plan/openclaw/` (`multi-agent-setup.md`, `tmux-customization.md`) and `the_plan/tmux-for-openclaw.md`. Read them for how it actually felt to use; don't copy hostnames or usernames.
- Marlon's ideas: the "`SOUL.md` ensemble" and flat-character agents (the Aug 22 planning record, part 8), "tiers of chatbot complexity, from a custom GPT to a little agent" (Oct 12 dictation), the bot zoo and a dramaturg bot (Sept bike-ride session), and CL 126X's *Interview with a Monster* and *Monster Dinner Party* (bots in conversation): all gathered in The Notebook at `_context/projects/50-in-focus/humanities-ai-lab/20261019-gathered/`.
- In this repo: the OpenClaw and Hermes screenshots (`content/history/05-agentic-turn.md`), J's fact-check (`content/history/fact-check.md`), L1's chatbot entries, and L4's interfaces-and-agents glossary (agent, agent loop, harness, workspace, skills, memory, the lethal trifecta).

**Safety, for every N task:** don't install OpenClaw, Hermes, or any personal agent on Marlon's machine; read their source and docs on GitHub instead (live demos happen from a dedicated machine). Nothing in the workbench gets a shell, the network, or real messaging accounts. A running workspace can read and write only inside its own folder.
