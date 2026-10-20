---
task: "AA"
title: "/bot-lab: the simple chat app where students build their bot"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/bot-lab/`, `nextjs/app/api/bot-lab/`, `nextjs/lib/bots.mjs` (the bot-file reader, which O also uses), `nextjs/content/experiments/bot-lab.md`"
depends_on: "the bot format in `nextjs/bots/README.md` (set; read it, don't change it); B's chat shell and `/api/chat` (read them; reuse what fits)"
report: "../reports/AA-bot-lab.md"
---
# AA. The bot lab

**Marlon (voice session, 2026-10-20), moment 7, "Build with the API":** "Everyone gets a repo. It includes a simple chat app, Vercel-like or even simpler, and students build their system prompt into it. The sample page should have a model selector." This is where students build the chatbot the whole session is about, and the bot they make here is the one they submit to the Slack Ensemble (task O). Read the session record: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/handoffs/20261020-voice-session-run-of-show-and-repo.md`. This repo is the model for the students' repo, so keep it plain enough that a student opening it in Claude Code can find and change their bot.

**Build:**

- `nextjs/lib/bots.mjs`: read, validate, and write bot files in the format of `nextjs/bots/README.md` (list bots, load one, build the exact messages sent to the model, validate with readable errors). O imports it, so land a first version early and keep its exports stable; list them in the report.
- `/bot-lab`: pick a bot (the examples in `bots/_examples/` and any in `bots/`), or start a new one; an editor for the system prompt and the frontmatter fields beside a chat with it; a **model selector** (a short curated list of OpenRouter ids with one-line notes: a Claude, a GPT, a Gemini, an open model, a small cheap one; check ids and prices with the `openrouter-models` skill or OpenRouter's models API, and note the date). Edits apply to the next message at once. A "show what the model gets" toggle that shows the exact messages. Save writes `bots/<slug>.md`, so the bot is a file students can open in Claude Code; a "download my bot file" button too.
- **Base models in the selector?** An open question of Marlon's (the voice agent noted base models would give the Shanahan contrast). Find out which base (non-instruct) models OpenRouter serves today, if any, and how they take a prompt; if there's one that works, add it under a separate "base model" heading with a note on what to expect; if not, say so in the report.
- **One short knowledge text** (`knowledge:` in the format): attach a file, and it is pasted into the prompt whole, visibly. No retrieval here; that's `/retrieval`.
- **Build the chat on the shared shell**, `nextjs/app/components/chat/ChatShell.jsx` (assistant-ui primitives on the AI SDK, streaming through `/api/chat`; read its README and B's report). Pass the bot's system prompt and the selected model; if `/api/chat` needs a `model` field in the body to support the selector, add it there in a small, backward-compatible change and say so in the report (B is done; nobody else owns that route today).
- Keep the chat itself simple and robust: streaming, stop, clear, a clear error when the key is missing or out of credit.

**Done looks like:** a student can go from the Socrates example to their own saved bot, chatting with it on two different models, in five minutes; `lib/bots.mjs` has tests; the report says what O can import.

**Testing:** use the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. If you need a headless browser and the Playwright tools say the browser is in use, write your own driver in your scratchpad using the Playwright install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` (load it with `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` to `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, and `waitUntil: "load"`, never `networkidle`, against Next dev).

**Spending:** the app's `OPENROUTER_API_KEY` had about $25 left of its limit at 08:15 on 2026-10-20. Test with short prompts and cheap models where you can; report roughly what you spent.

## Phase 2, added 08:55: the assistant builder (Marlon)

Marlon: "we can have the old-school assistant-builder with r.a.g. and system prompt and model selector. could be based on the basic code of the vercel demo with a model switcher, a system prompt area, and a rag option that computes similarity in browser with transformers and displays the choices and how they are added to the prompt." That is `/bot-lab`, grown by one feature: **knowledge by retrieval**, beside the "paste the whole text" option you already have.

- **Knowledge mode:** "whole text" (as now) or "retrieve" (the first-generation custom GPT's way). With "retrieve", the attached text(s) are chunked and embedded **in the browser** with transformers.js, using `lib/retrieval/` (`chunk`, `cosine`, `topK`, `buildSystem`, and the embed worker `lib/retrieval/embed-worker.js`; import them, don't edit them; the course texts' ready-made vectors are in `public/retrieval/`). On each message, embed the question, score every passage, and show **the choices**: the top passages with their similarity scores, and the cut-off, beside the chat; then show **how they are added to the prompt**, highlighted inside the exact messages the model gets. A k slider. Allow picking course texts from `public/retrieval/` as well as uploading one.
- **The bot file:** add the optional field `retrieval: true` (and `top_k:`) to what `lib/bots.mjs` reads and writes; the format README says unknown fields are ignored, and the orchestrator has added these two to it. The Slack Ensemble (O) ignores them today and pastes the text whole.
- **"Based on the basic code of the Vercel demo":** keep the chat on the AI SDK as it is (`useChat`-style streaming through `/api/chat`, which is what Vercel's examples use). If task AC's `/chat-ui` (assistant-ui's stock, familiar-looking thread) has landed and works, use its look for the bot lab's chat; otherwise stay on `ChatShell`. Say which in the report.
- `/rag` (task AH) is the slow, step-by-step explanation of the same pipeline; link to it from the retrieval panel ("how this works").


Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
