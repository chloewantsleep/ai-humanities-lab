---
task: "AA"
thread_id: "6c51b456-6f15-4b9d-bbb6-c2e966b54ab0"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 6c51b456-6f15-4b9d-bbb6-c2e966b54ab0"
status: "done"
updated: 2026-10-20
---

# AA. The bot lab: report

## What I built

- **`nextjs/lib/bots.mjs`**, the bot-file reader (landed first, commit `68cdb93`), and **`nextjs/lib/bots-format.mjs`**, the pure part it re-exports (no file system, so the browser editor uses it too). Tests: `nextjs/tests/bots.test.mjs` (7 tests, in `pnpm test`).
- **`/bot-lab`**: `nextjs/app/bot-lab/` (`page.jsx`, `BotLab.jsx`, `models.mjs` the curated selector list, `emoji.mjs` a shortcode map for the speaker label, `bot-lab.css`).
- **`nextjs/app/api/bot-lab/bots/route.js`** (GET: every bot in `bots/` and `bots/_examples/` with text, loaded knowledge text, and errors; POST `{ bot }` or `{ text }`: save to `bots/<slug>.md`) and **`nextjs/app/api/bot-lab/knowledge/route.js`** (GET the reference texts; POST `{ name, text }`: save to `bots/knowledge/<name>.md`). Both return a readable error if the file system is read-only (Vercel), and tell the student to download the file instead.
- **A second example, `bots/_examples/the-creature.md`**, with a reference text at `bots/_examples/knowledge/the-creature.md` (the creature's last speech to Walton, 1818 Gutenberg text, 1,545 words), so the knowledge feature has something to show.
- **A small change to the shared `/api/chat`** (`nextjs/app/api/chat/route.js`, B's route; nobody else owns it today): an optional `model`, in the body or as `?model=` on the URL, checked against an id pattern; the body-only form stays as it was. The query form exists because `ChatShell`'s body is fixed to `{ system, messages }` and AF owns the shell today. The stream's error text now names the model rather than saying "Claude". B's route test still passes.
- `nextjs/content/experiments/bot-lab.md`: status `working`, with how to use it.

## How to try it

http://localhost:3000/bot-lab (the shared dev server).

1. Pick "Socrates, on writing" in the Bot menu; the fields and prompt fill in.
2. Pick Claude Haiku 5.5 in the Model menu and send "In one sentence: who are you?"
3. Switch the Model menu to DeepSeek V4.1 Flash and send "What did I just ask you?" The conversation stays; the second answer comes from the second model.
4. Click "Show what the model gets": the system message, then "Last request actually sent" with the model id and the three messages, then the file as it will be saved.
5. Pick "The Creature": the reference text select shows `_examples/knowledge/the-creature.md · 1,545 words`, and the system message in the reveal panel carries the prompt, the `--- Reference text ---` line, and the speech.
6. Pick "New bot…", type a name (the slug follows), a prompt, and Save: the file appears in `nextjs/bots/`, and the bot appears under "The room's bots". "Download my bot file" gives the same file.

Checked in a headless browser against the shared server (steps 1 to 6, all passing, console clean) and by hand with curl: a malformed model id gets the 400; an unknown but well-formed id (`nobody/no-such-model`) gets the stream error "The request to nobody/no-such-model failed. Check the server key, the model id, OpenRouter balance, and connection." `pnpm test`: 55 tests pass.

## Commits

- `68cdb93` AA: lib/bots.mjs, the bot-file reader, with tests.
- `767c940` AA: /bot-lab, the API routes, the /api/chat model option, the Creature example, this report.

## What I couldn't do or didn't check

- **Base models:** none. OpenRouter's public catalog on 2026-10-20 (470 models, `https://openrouter.ai/api/v1/models`) had no pretrained, non-instruct model: nothing named "(base)", no completion-only Llama 405B or Mixtral base, and no `instruct_type` of none among the open models. The selector says so under a "Base models" heading and points to `/spiral` and `/by-hand` for the Shanahan contrast. If Marlon wants a base model in class, the browser GPT-2 is the one we have.
- Prices in the selector are that day's, from the same catalog call; they will drift.
- The missing-key path (503) wasn't re-tested today since the key is present; B tested it on the 19th and the route's code for it is unchanged.
- `/print/bot-lab` not checked (AF's shared fix).
- Not done: a `.gitignore` rule for `bots/*.md`. O's brief assigns it; I removed my own test bot by hand (`bots/test-bot-aa.md`) rather than commit it.

## For other tasks

- **O (the Slack Ensemble):** import from `nextjs/lib/bots.mjs` (Node). Stable exports:
  - `listBots({ root?, examples? })` → array of bots; each has `name, slug, author, model, emoji, icon_url, description, knowledge, body, extra, source, example, text, knowledgeFile, knowledgeText, errors, warnings, ok`. Invalid files are included with `ok: false` and readable `errors`; filter on `ok` to run only valid bots.
  - `loadBot(slug, { root?, examples? })` → one bot or `null` (the room's `bots/<slug>.md` wins over `_examples/<slug>.md`).
  - `saveBot(botOrText, { root?, overwrite? })` → `{ ok, slug, file, errors, warnings, text }`; writes only into `bots/`, never `_examples/`.
  - `buildRequest(bot, history, { defaultModel?, model?, knowledgeText? })` → `{ model, messages }` where `messages` is `[{ role: "system", content }, ...user/assistant turns]`, chat-completions shape; `history` is `[{ role, content }]`. Also `buildMessages`, `buildSystemPrompt(bot, knowledgeText?)` (the body, then `--- Reference text ---`, then the whole text), `parseBotFile(text, { slug? })`, `validateBot(bot)`, `serializeBotFile(bot)`, `slugify`, `checkKnowledge`, `countWords`, and the constants `DEFAULT_MODEL`, `BOT_FIELDS`, `SLUG_PATTERN`, `MODEL_PATTERN`, `EMOJI_PATTERN`, `KNOWLEDGE_MARKER`, `KNOWLEDGE_WORD_LIMIT`.
  - `listKnowledge({ root? })` and `saveKnowledge(name, text, { root? })`; `resolveKnowledge(bot, { root? })`.
  - `botsRoot` defaults to `<cwd>/bots`, so from `slack-ensemble/` pass `root: path.resolve("../nextjs/bots")`.
  - The frontmatter parser is a strict subset of YAML: one `key: value` per line, quoted or bare strings, `#` comments. Not gray-matter, so the browser can run it; both readers should go through this module rather than parse separately.
  - **Knowledge paths:** per the format, relative to `bots/`; for an example I also try relative to the example's own folder, so `_examples/knowledge/…` works written either way. A `knowledge:` path that escapes `bots/` is an error.
  - A student's `model:` is a free OpenRouter id; the lab's selector writes it only when it differs from the app's default. Empty means "the app's default".
- **B / AF:** `/api/chat` takes `model` now (body or query). If AF changes `ChatShell` to accept extra body fields, the lab can drop the query form; the route will keep both.
- **AD (site structure):** the experiment doc is `content/experiments/bot-lab.md`, `order: 7`.
- **AB (keys):** when the students' keys arrive, the lab reads the server's `OPENROUTER_API_KEY` only; a per-student key would need a change in `/api/chat`.
- **AG (Vercel):** saving and uploading return a clear "can't write files here; download instead" error on a read-only file system, so the page degrades to an editor plus download.
- **AI (bot room):** `buildRequest` gives each bot's messages; the chat shell and `?model=` query work per bot.

## Spending

Two short calls, one on Claude Haiku 5.5 and one on DeepSeek V4.1 Flash, each with a 129-word system prompt: well under one cent in total.

## Marlon's words

None in this thread; the brief quotes him.

## Decisions and open questions

- Two modules rather than one so the editor validates and serializes in the browser with the same code the server and O use; `bots.mjs` re-exports everything, so one import suffices.
- Saving an example under its own slug writes `bots/<slug>.md` beside the example; the room's copy then wins in `loadBot`. Should it replace the example in the picker instead?
- The reference text is read whole at list time (a few thousand words per file), which is fine for a room of bots; if `bots/knowledge/` grows large, make the list lazy.
- The emoji shortcode map is about a hundred common codes; others show as the code text in the speaker label (Slack renders them properly).
