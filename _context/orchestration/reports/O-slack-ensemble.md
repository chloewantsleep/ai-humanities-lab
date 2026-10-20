---
task: O
thread_id: 5a37ec19-b531-4780-b7f0-44e89d96cae8
agent: Claude Code (Opus 5.5)
started_in: /Users/mk/Development/mk-27/apps/the-notebook
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 5a37ec19-b531-4780-b7f0-44e89d96cae8"
status: working in the simulated room; not yet in any real Slack (waiting for Marlon to create the app and name the workspace and channel)
---

# O. The Slack Ensemble: report

(The same thread did task W earlier; see `W-rosie-roomba.md`.)

## What I built

**The harness, `slack-ensemble/`** (self-contained: own `package.json` with `@slack/bolt` 4.7 and `dotenv`, own reader of the bot format, no imports from `nextjs/`):

- `index.mjs`: `pnpm dry-run` (simulated room), `pnpm fake` (simulated room, canned replies, no model), `pnpm start` (live; refuses without `xoxb-`/`xapp-` tokens, and refuses without `OPENROUTER_API_KEY` unless fake). Serves its state on http://127.0.0.1:3031/state in every mode.
- `lib/bot-file.mjs`: parse and check one bot file, dependency-free. Same accept/reject rules, slug, and system prompt as AA's `nextjs/lib/bots-format.mjs`; `tests/agreement.test.mjs` runs both readers on 14 files.
- `lib/bots.mjs`: loads `nextjs/bots/*.md` and `bots/_examples/*.md` (room bots win on a slug clash; `ENSEMBLE_EXAMPLES=false` drops the examples), appends the knowledge text, lists invalid files with reasons, and watches all three folders.
- `lib/room.mjs`: mentions, who answers, the loop guard, the rate limit, the transcript.
  - A bot answers when the text has `@` plus its name, its slug, or its short name (before a comma, colon, or parenthesis, when unique). The longest name wins at the same `@`.
  - A thread reply with no mention goes to the bot that spoke last there.
  - Bots answer bots only in a thread a person started, and only 3 bot replies in a row since the last person. A thread takes at most 40 bot replies.
  - Each bot is limited to 6 replies a minute and 60 an hour. A bot named by a person doesn't answer twice if it already spoke in the chain that followed. Messages in one thread are handled one at a time.
  - The bot's system prompt is sent exactly as written. The thread goes in one user message, each line labelled with its speaker, so any number of speakers works with any model.
- `lib/llm.mjs`: OpenRouter via `fetch`, with `usage.include` so the cost is logged.
  - Model checks against OpenRouter's public model list: an unknown model, one over $10 per million output tokens, or one off an optional allow-list falls back to the default.
  - Default model: `anthropic/claude-sonnet-5.5`, as in /bot-lab. Replies are capped at 1,000 tokens with reasoning effort low. With 400 tokens, Haiku 5.5's reasoning ate the budget and cut a reply short.
- `lib/slack.mjs`: Socket Mode transport.
  - Ignores every bot message as an event, so bot-to-bot replies happen only inside `room.mjs`'s guards.
  - Posts with `username` plus `icon_emoji`/`icon_url`, and reads threads with `conversations.replies`.
  - Mentioning the app itself gets the roster. `ENSEMBLE_CHANNELS` optionally restricts it to some channels.
- `lib/submit.mjs`: Slack submission. A bot file pasted (code block or not) or attached as `.md`, in a DM to the app or in `ENSEMBLE_SUBMIT_CHANNEL`, is checked and saved. The app replies "has joined" or with what to fix. `bots/.submitters.json` stops one student replacing another's slug.
- `lib/dry-run.mjs`: the simulated room (threads in memory) and the local JSON API (`GET /state`, `POST /messages`, `POST /reset`).
- `lib/log.mjs`: `logs/<date>.jsonl` (gitignored). Every reply (bot, model, trigger, text, tokens, cost), submission, guard stop, and error.
- `slack-manifest.json`: "AI Humanities Lab Ensemble", Socket Mode, 7 bot scopes (`channels:history`, `groups:history`, `im:history`, `chat:write`, `chat:write.customize`, `users:read`, `files:read`), 3 events (`message.channels`, `message.groups`, `message.im`).
- `README.md`: how to run it, how the room behaves, how bots are added, and **"Install in Slack (Marlon)"**, six steps that work in any workspace.
- `.env.example` (names only), `.gitignore`, and 22 tests (`pnpm test`): parsing, the loop guard, the rate limit, mentions, a whole fake room, submissions, and agreement with AA's reader.

**The course app:**

- `/ensemble` (`nextjs/app/ensemble/`):
  1. *Submit a bot*: paste or upload, checked live with AA's `parseBotFile`, a Slack-style preview, "What the model is sent", optional one short text, and **Add to the Ensemble**. It asks before replacing an existing slug.
  2. *The room*: the simulated channel while the harness runs (roster with click-to-mention, invalid files with reasons, threads, reply-in-thread, clear). A "Live in Slack" panel when `pnpm start` is running. Start instructions when it isn't running.
- `nextjs/app/api/ensemble/route.js`: passes requests to the harness (`ENSEMBLE_HARNESS_URL`, default `http://127.0.0.1:3031`) and lists the saved bot files.
- `nextjs/app/api/ensemble/bots/route.js`: saves via AA's `saveBot` and `saveKnowledge`. It refuses a `knowledge:` path that isn't on this machine unless the text is pasted.
- `nextjs/content/experiments/ensemble.md`: `status: working`, group "Build your bot", order 8.

**Shared file changed:** the repo-root `.gitignore`. It now ignores `nextjs/bots/*.md` (except `README.md`) and `nextjs/bots/knowledge/`, because students' bots are theirs, as the brief asked. `bots/_examples/` is still committed.

## How to try it

1. `cd slack-ensemble && pnpm install && pnpm dry-run` (or `pnpm fake` for no cost). It needs `OPENROUTER_API_KEY` in `slack-ensemble/.env`. I created that `.env` locally by copying the key line from `nextjs/.env.local` without printing it; it's gitignored.
2. Open http://localhost:3000/ensemble.
3. Paste a bot file (or press **Template**), fix whatever it flags, press **Add to the Ensemble**.
4. In the room, click the bot's name to mention it, type, press Enter. Mention two bots, or bots that mention each other, to watch the guard stop them after three.

Measured: save in 0.3 s, in the room at 1.2 s, a real Sonnet reply at 6.9 s. Add pasting the file, and a student is well under two minutes.

## Commits

- `63d8015` the harness (first working version).
- `4564bfc` /ensemble, the API routes, the manifest and README, Slack submissions, examples in the room, and agreement with AA's reader.
- This report: committed by path after `4564bfc` (`git log -- _context/orchestration/reports/O-slack-ensemble.md`).

## What I couldn't do or didn't check

- **No real Slack.** I didn't create the app or post anywhere. `lib/slack.mjs` and the Slack submission path have never run against Slack: the Bolt wiring, `conversations.replies` mapping, `chat:write.customize` posting, file download, and DM events are untested. The first live run should be watched.
- The harness's model checks and the room were tested live against OpenRouter. Spending: about $0.002 in all (two Haiku 5.5 replies at $0.0004, one Sonnet 5.5 reply at $0.0016); everything else ran in fake mode.
- The page was tested in my own headless Chromium (paste, error, save, roster, mention, replies, replace prompt, 390-px width, no console errors), not in Safari or Firefox.
- Whether students can reach `/ensemble` on Marlon's laptop over campus Wi-Fi is unknown (client isolation is common). The Slack DM path is the backup, once the app exists.
- I left the harness stopped. My two test bots (`lord-henry`, `miss-prism`) were removed from `nextjs/bots/`.

## For other tasks

- **AA (/bot-lab):** `/ensemble` uses your `parseBotFile`, `buildSystemPrompt`, `saveBot`, `saveKnowledge`, `resolveKnowledge`, `listBots`, and `DEFAULT_MODEL`. If you change the format's rules, run `cd slack-ensemble && pnpm test`: `tests/agreement.test.mjs` will fail until the harness's `lib/bot-file.mjs` matches. In the room, `retrieval: true` gets a warning and the text is pasted whole, as the README says.
- **Orchestrator:** no fields were added to the format. The harness reads but ignores `retrieval` and `top_k`.
- **AG (Vercel):** `/ensemble` saves files and talks to a process on localhost, so it only works locally. On Vercel it should show the "not running" panel, and saving will fail (read-only file system); hide it there or say so.
- **AI (/bot-room):** `slack-ensemble/lib/room.mjs` has a transport-free loop guard and transcript format (`decideResponders`, `transcriptFor`) if a shared one helps.
- **V (session path):** the finale. Run `pnpm dry-run` before class so `/ensemble` shows the room. Show Slack only after Marlon has installed the app.

## Marlon's words

In this thread, only the task prompt: "Don't post to any real Slack until Marlon names the workspace and channel in this chat." From the brief (voice session, 2026-10-20): "This is the treat. Their bots must be in Slack today. Each student submits their bot as a member of the AI Humanities Lab Ensemble. We show it today but don't teach how until next time, then let that world run and show how it evolved by then." And: bots "can't be insanely logically complex."

## Decisions and open questions

- **Submission: built both.**
  - `/ensemble` on the laptop running the Ensemble: works today with no Slack, and shows the check, the preview, and what the model gets.
  - A DM to the Slack app (or a submissions channel): works from any student's machine wherever they are, once the app exists.
  - I'd lead with Slack DMs if the app is installed before the finale, and fall back to `/ensemble` otherwise (Marlon pastes, or students on the same network).
- **Default model is Sonnet 5.5** (matching /bot-lab) rather than Haiku 5.5, so a bot sounds the same in both. Haiku is a twentieth of the cost; set `ENSEMBLE_DEFAULT_MODEL` to switch.
- **Example bots are in the room** by default, so it isn't empty at the start. Turn off with `ENSEMBLE_EXAMPLES=false`.
- **Open, Marlon's call:**
  - Which workspace and channel.
  - Who creates the app there.
  - Whether to restrict it to one channel (`ENSEMBLE_CHANNELS`).
  - Whether the room keeps running all week on the laptop (it needs the process awake) or moves to a server. The Notebook Ensemble runs on Railway; this harness has no Dockerfile yet.
