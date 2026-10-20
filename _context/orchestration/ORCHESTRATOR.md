---
title: The orchestrator — how to direct the agents, and who has held the role
updated: 2026-10-20
---

# The orchestrator

Marlon directs this project through one orchestrating agent at a time (Marlon, 2026-10-19: "I'm having you be orchestrator for now. When I shut you down I'll ask the next agent to orchestrate"). The orchestrator does little of the building itself. It keeps the board, writes the briefs and the prompts that start other agents, reads their reports, checks their work, and tells Marlon where things stand and what he needs to decide. Task agents come and go; the orchestrator holds the thread between them. When Marlon retires one orchestrator, the next one starts from this file.

## Taking over

When Marlon asks you to orchestrate:

1. **Record yourself.** Run `echo $CLAUDE_CODE_SESSION_ID` (Claude Code) or `echo $CODEX_THREAD_ID` (Codex) and add an entry to the log at the bottom of this file: your thread ID, agent, the directory you started in, and the date. Update `orchestrator:` in the board's frontmatter.
2. **Read your predecessor's handoff,** the last entry in the log: what was in flight, what was promised to Marlon, what was left undone.
3. **Read the board** ([README.md](README.md)), then the reports in [reports/](reports/) for anything newer than the board, and `git log --oneline -30` for commits the board doesn't know about yet.
4. **Find agents that finished without reporting.** An agent that was started but has no report may still be running, or may have stopped without writing one. Ask Marlon which threads are still open before assuming. For closed threads, see "Reports nobody wrote" below.
5. **Tell Marlon where things stand** in a few lines: what's done since the last handoff, what's waiting on him, and the next batch you'd start.

## The work

- **Briefs.** A new task gets its own file in [tasks/](tasks/), with frontmatter `task`, `title`, `status`, `owns` (the files it may change), `depends_on`, `report` (the report path), then the brief, then "When you finish". Write it so an agent with no other context can do the task: name the files, the routes, what to read first, what done looks like, and what not to touch. Quote Marlon's words when the task comes from them. Add a row to the board's table. Don't let two concurrent tasks own the same files.
- **Prompts.** Marlon starts each agent himself, in a Claude Code or Codex window, by pasting a prompt the orchestrator writes. Give him a batch at a time, each with a header naming the task and a suggested effort level (Low, Medium, High, or xhigh/max for open-ended thinking or design). Every prompt says, in this order: work in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`; read `AGENTS.md`, then `_context/orchestration/README.md` (the board and its rules), then the brief `_context/orchestration/tasks/<file>.md`; commit by path only (rule 7); write the report to the path in the brief, with the thread ID (rules 8 and 9). Keep the brief in the file and the prompt short: the prompt points, the brief explains.
- **Reports.** When an agent finishes, read its report in [reports/](reports/), check the claims that matter against the repo (the commits exist, the route loads, the tests pass), then update the board: the task's status and report link, the "Can start now" line, and the to-dos. Add anything the report says another task needs to that task's brief. Commit the board and briefs by path.
- **Marlon's to-dos.** Keep his decisions and actions in the board's to-do list, short and concrete, and raise the ones that block work when he next talks to you.
- **Your own context.** Delegate wide reading (many reports, transcripts, a big folder) to subagents and keep only their conclusions. Don't read raw transcripts into your own thread.
- **Fixes.** Small fixes are fine to make yourself (a broken redirect, a stale line in the board), committed by path. Anything bigger becomes a task.

## Reports nobody wrote

If a thread closed without writing its report, write it from the transcript, using subagents so the transcripts stay out of your context:

1. List the day's sessions: `python3 _context/orchestration/tools/list-sessions.py <YYYY-MM-DD>` (times are UTC; Marlon's clock is US Eastern). It prints each Claude Code and Codex session's ID, times, start directory, the task letters in its first prompt, and the prompt's opening.
2. Condense each relevant one: `python3 _context/orchestration/tools/condense-transcript.py <session.jsonl> <out.md>` keeps the user and assistant text and one line per tool call, about 40 KB instead of several MB. Claude Code sessions are in `~/.claude/projects/<start-dir-with-dashes>/<id>.jsonl`; Codex sessions are in `~/.codex/sessions/YYYY/MM/DD/rollout-*-<id>.jsonl`. Write the condensed copies to your scratchpad, not the repo.
3. Give each subagent one or two threads and a shared brief: the report format in rule 8, check every claim against `git log` and the files, quote Marlon's words exactly, say "written by a subagent from the transcript" in the frontmatter, write only the assigned files, don't commit, never copy a key. Then commit the reports yourself, by path. This was done for the first wave on 2026-10-19; the reports in [reports/](reports/) show the result.

## Handing over

Before Marlon shuts you down, or when he says he's switching orchestrators, add your handoff to the log below: what you started and what came back, agents still running (with thread IDs if known) and the prompts you gave them, anything you promised Marlon, decisions he made that aren't on the board yet, and what you'd do next. Commit it by path. The next orchestrator reads it first.

## Log

### 1. Claude Code `6e61228f-6c66-48cd-984d-4778bc90e28c` (2026-10-19)

- **Started in:** `/Users/mk/Development/mk-27/apps/the-notebook`. Resume with `claude --resume 6e61228f-6c66-48cd-984d-4778bc90e28c` from that directory.
- **What it did:** founded the app (`nextjs/`, copied from tdm155ai-week-6), brought in the history screenshots, wrote the board and every task brief, gave Marlon the prompts for the first wave (A, B, F, G, H, I, J, L0–L5, M), had subagents write the first wave's reports from the closed threads, added tasks P, Q, R, M2a/M2b and the claw workbench (N1–N8), brought in the ChatGPT deep research, made experiment documents redirect to their routes, and turned the board into this folder.
- **The convention it set:** thread IDs in every handoff (also in The Notebook's `AGENTS.md`), reports as files, commits by path.
- **Handoff, as of the evening of 2026-10-19:** no agents are running; the first wave is done and reported. The next batch, not yet given to Marlon as prompts: R, P, Q, C, E, N1, M2a. Promised to Marlon: test `/chat-demo`, `/layers`, and `/mini-claw` against Claude once he adds the key (and restart the dev server if needed). Marlon's open decisions are in the board's to-dos. The GitHub org handoff (`ll-26-27-secret`, not about this project) is in this thread's scratchpad; Marlon hasn't said where to file it.

### 2. Claude Code `9b639a81-e358-4142-9f22-26dc755aec5f` (2026-10-20)

- **Started in:** `/Users/mk/Development/mk-27/apps/the-notebook`. Resume with `claude --resume 9b639a81-e358-4142-9f22-26dc755aec5f` from that directory.
- **Took over** at 06:45 ET on the day of the workshop (Marlon: "I want you to be the orchestrator for english 298 work right now"). Found: no commits since the first orchestrator's handoff; an unreported agent building `/retrieval` in the working tree (`nextjs/app/retrieval/`, `lib/retrieval/`, `public/retrieval/`, `scripts/build-retrieval-index.mjs`, untracked); `eng-298ai-context` `main` one commit ahead (the Czech *R.U.R.*, now merged from `mk/czech-rur`) but its GitHub remote returns 404 for both mkuzmick and process-black, so it can't be pushed.
