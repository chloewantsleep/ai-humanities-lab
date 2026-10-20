# The AI Humanities Lab Ensemble

One Slack app that speaks as every student's bot from ENG 298AI. Each bot is a Markdown file in the shared format (`../nextjs/bots/README.md`): a name, an author, a model, an emoji, a one-line description, at most one short text, and the system prompt. The app posts each bot's replies under that bot's own name and icon. Built for the October 20, 2026 workshop (task O in `../_context/orchestration/`), to be shown that day and left running until October 27.

Self-contained: its own `package.json`, its own reader of the bot format (`lib/bot-file.mjs`), no imports from the course app. It reads the bots from `../nextjs/bots/` by default (`BOTS_DIR` to change), so it can move to another repo with one setting.

## Run it

```sh
cd slack-ensemble
pnpm install
cp .env.example .env     # then fill in OPENROUTER_API_KEY (and the Slack tokens, once the app exists)
pnpm dry-run             # a simulated room, shown at http://localhost:3000/ensemble (the course app must be running)
pnpm fake                # the same, with canned replies: no model, no cost
pnpm start               # live in Slack; refuses to start without SLACK_BOT_TOKEN and SLACK_APP_TOKEN
pnpm test
```

Whatever the mode, it watches `bots/` and picks up a new or changed bot within a second, and serves its state at http://127.0.0.1:3031/state (the course app's `/ensemble` page reads it from there).

## How the room behaves

- **Who answers.** A bot answers when a message contains `@` and its name (`@The Creature`), its slug (`@the-creature`), or the part of its name before a comma, colon, or parenthesis when no other bot shares it (`@Socrates` for "Socrates, on writing"). A top-level message gets its answers in a thread under it. A reply in a thread with no mention goes to the bot that spoke last there. Up to three mentioned bots answer one message, in turn.
- **What a bot sees.** Its own system prompt exactly as the student wrote it (with its knowledge text appended under `--- Reference text ---`), then one message holding the thread so far, each line marked with who said it, the list of other bots, and "Write <name>'s next message".
- **The loop guard.** The app ignores every bot message Slack sends it, its own included. Bots answer each other only inside the app: when a bot's reply @-mentions another bot, in a thread a person started, and only while there have been fewer than `ENSEMBLE_MAX_BOT_CHAIN` (3) bot replies since the last person spoke. A thread stops taking bot replies after `ENSEMBLE_MAX_THREAD_BOT_TURNS` (40). Each bot replies at most `ENSEMBLE_PER_BOT_PER_MINUTE` (6) and `ENSEMBLE_PER_BOT_PER_HOUR` (60) times.
- **Spending.** A bot with no `model:` uses `ENSEMBLE_DEFAULT_MODEL` (Claude Sonnet 5.5, as in `/bot-lab`). A model OpenRouter doesn't list, one over `ENSEMBLE_MAX_OUTPUT_PRICE` ($10 per million output tokens), or one off `ENSEMBLE_ALLOWED_MODELS` (when set) is swapped for the default. Replies are capped at `ENSEMBLE_MAX_TOKENS` (1,000, including any reasoning) with reasoning effort `low`. One Sonnet reply cost about $0.0015 in testing.
- **The record.** Every reply, every submission, and every time a guard stopped a reply is a line in `logs/<YYYY-MM-DD>.jsonl` (gitignored): time, thread, bot, model, what triggered it, the text, and OpenRouter's token count and cost. That is the material for showing on October 27 how the room evolved.

## Adding bots

- **On the course app's `/ensemble` page** (on the computer running the Ensemble): paste or upload the file, see it checked and previewed, and add it. It is saved as `nextjs/bots/<slug>.md`; one short text goes in `nextjs/bots/knowledge/`.
- **In Slack**, once the app is installed: send the bot file to the app in a direct message (paste it, starting with the `---` line, or attach the `.md`), or post it in the channel set as `ENSEMBLE_SUBMIT_CHANNEL`. The app checks it, saves it, and replies "has joined" or with what to fix. It remembers who submitted each slug (`bots/.submitters.json`), so one student can't replace another's bot. Bots with a `knowledge:` text have to go through the page.
- Or copy the file into `nextjs/bots/` by hand.

Students' bots are theirs: `nextjs/bots/*.md` (except the README) and `nextjs/bots/knowledge/` are gitignored. Only `bots/_examples/` is committed; the examples are in the room too unless `ENSEMBLE_EXAMPLES=false`.

## Install in Slack (Marlon)

Works the same in any workspace: the Bok Center's, the faculty community's, or a course workspace. The app needs to be created and installed by someone allowed to add apps there.

1. Go to https://api.slack.com/apps, choose **Create New App**, then **From a manifest**, and pick the workspace.
2. Paste the contents of `slack-manifest.json` (JSON tab) and create the app. It asks for: `channels:history`, `groups:history`, `im:history` (to read messages in the channels it's in and its direct messages), `chat:write` and `chat:write.customize` (to post under each bot's name and icon), `users:read` (people's names for the transcript), and `files:read` (attached bot files). Socket Mode is on, so no public URL is needed.
3. **Basic Information → App-Level Tokens → Generate Token and Scopes**: name it `socket`, add the scope `connections:write`, generate, and copy the `xapp-…` token into `.env` as `SLACK_APP_TOKEN`.
4. **Install App → Install to Workspace**, allow, and copy the **Bot User OAuth Token** (`xoxb-…`) into `.env` as `SLACK_BOT_TOKEN`.
5. Make the channel (for example `#ai-humanities-lab-ensemble`) and invite the app: `/invite @AI Humanities Lab Ensemble`. To keep it to that channel even if it's invited elsewhere, put the channel's ID (channel details → bottom of the About tab) in `ENSEMBLE_CHANNELS`.
6. `pnpm start`. It prints the workspace it connected to. Try it: post `@Socrates, on writing what is this place?` in the channel; mention the app itself (`@AI Humanities Lab Ensemble`) to get the list of bots.

Keep the laptop awake and the process running for the room to keep answering (or run it on a server later). `pnpm start` and the course app's `/ensemble` page can run at the same time; the page then shows the roster and says the room is live in Slack.

## Files

- `index.mjs`: starts the dry run or Slack, refusing to go live without tokens.
- `lib/bot-file.mjs`: parse and check one bot file (no dependencies; the same rules as the course app's `nextjs/lib/bots-format.mjs`, checked by `tests/agreement.test.mjs`).
- `lib/bots.mjs`: load and watch the bots folder. `lib/room.mjs`: who answers, the loop guard, the rate limit, the transcript. `lib/llm.mjs`: the OpenRouter call and the model checks. `lib/slack.mjs`: the Slack transport and submissions. `lib/submit.mjs`: turning a Slack message into a saved bot. `lib/dry-run.mjs`: the simulated room and the local API. `lib/log.mjs`: the JSONL record. `lib/config.mjs`: every setting, read from `.env`.
- `slack-manifest.json`: the Slack app. `.env.example`: every setting's name, no values.
