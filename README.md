# mk-chatbot-experiments

Marlon's chatbot experiments for ENG 298AI (the AI Humanities Lab, Fall 2026): prototypes that turn a sequence of chatbots into an argument about where the assistant came from, from a base model that spirals to an agent with its own computer. Private; nested in `ll-26-27/the-notebook` at `apps/mk-chatbot-experiments/`, where the planning folder is `_context/projects/50-in-focus/mk-chatbot-experiments/`. This is not the course repo: students will get selected docs, copied out later.

## Layout

| Path | What |
| --- | --- |
| `nextjs/` | The app (see `nextjs/CLAUDE.md`): one route per experiment, and the Markdown in `nextjs/content/` rendered as pages |
| `nextjs/content/experiments/` | One brief per experiment; its `route:` names the route that runs it |
| `nextjs/content/history/` | 43 screenshots of chat interfaces, 1966 to 2026, one page per section |
| `_context/orchestration/` | The task board (`README.md`), one brief per task (`tasks/`), the agents' reports (`reports/`), and the orchestrator's guide and log (`ORCHESTRATOR.md`); see `AGENTS.md` |
| `_context/research/` | Secondary research, such as ChatGPT's deep-research history of the chatbot |
| `_context/course-readings-summary.md` | ENG 298AI course readings through October 20, 2026 |

## Run it

Node 22 or later.

```sh
cd nextjs
pnpm install
pnpm dev
```

Copy `nextjs/.env.example` to `nextjs/.env.local` for the experiments that call Claude.

## Routes

| URL | What |
| --- | --- |
| `/` | The intro and a card per experiment |
| `/spiral`, `/by-hand`, `/persona-dial`, `/eliza`, `/layers`, `/mini-claw`, `/fine-tune` | The experiments (status on the board, `_context/orchestration/README.md`; `/eliza`, `/layers`, `/mini-claw`, and `/fine-tune` are built) |
| `/engine`, `/chat-demo` | Test pages for the browser model engine and the Claude chat route |
| `/story` | The scrollytelling history of the chatbot (a first draft) |
| `/glossary` | The glossary |
| `/history`, `/history/...` | The screenshots |
| `/experiments/...`, `/readings` | The briefs and readings as documents |
| `/print` | Light print versions: `/print` in front of any page's address |
