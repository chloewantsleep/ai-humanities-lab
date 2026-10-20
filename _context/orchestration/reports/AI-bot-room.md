---
task: "AI. /bot-room: two or three bots in one conversation"
thread_id: "343f149d-375d-4122-9df1-e541550238b6"
agent: "Claude Code (Fable 5.1)"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 343f149d-375d-4122-9df1-e541550238b6  (run from /Users/mk/Development/mk-27/apps/the-notebook; the same thread did task D earlier today)"
ran: "about 12:05–12:45 UTC (8:05–8:45 a.m. EDT), 2026-10-20"
status: "working; first version committed at 12:20 UTC, then improved; tested in a headless browser on the shared dev server on Claude Haiku, about 3 cents in all"
---

# Task AI: the bot room (`/bot-room`)

**Short answer:** `/bot-room` works. Pick two or three bots from files in the shared format (the room's four examples, the site's examples, anything in `bots/`), or write one on the spot; give the room an opening line or a task; run turns in order or let a director (Claude Haiku) choose who speaks and say why; in "working together" mode the bots share a draft that sits in its own panel. Every turn shows exactly what that bot received, its tokens, and its cost; a stop button and a turn limit bound the spending. Round-robin, the director, the host interjecting, stop, the download, and the costs were all seen working in a browser; the shared draft needed two fixes (below) and its re-test is in the last section.

## What I built

Under `nextjs/` in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`:

- **`app/bot-room/room.mjs`**: the room's logic, no React or server code. `MODELS` (five OpenRouter ids with prices read from https://openrouter.ai/api/v1/models on 2026-10-20: Claude Sonnet 5.5 $2/$10, Claude Haiku 5.5 $0.10/$0.50, GPT-5 mini $0.25/$2, Gemini 2.5 Flash $0.30/$2.50, Mistral Small 3.2 $0.094/$0.25 per million tokens in/out), `costOf`, `estimateRun`; `roomNote` (what is appended to a bot's own system prompt: who else is in the room, speak only as yourself, keep it short; in together mode, the task and the draft rule); `messagesFor` (exactly what a bot is sent: its own earlier turns as the assistant, everyone else's merged into user messages labeled `Name: …`, the host's line labeled `Host:`; a bot whose turn was last still gets a user message); `nextRoundRobin`; `directorPrompt` and `parseDirector` (JSON on one line, read leniently); `extractDraft` (closed or cut-off `<draft>` blocks); `stripSelfLabel`.
- **`app/api/bot-room/route.js`**: `POST /api/bot-room`. `kind: "turn"` streams one bot's reply as NDJSON (`start` with the exact system and messages and the model, `delta`s, `done` with usage, reasoning tokens, cost, and the finish reason); `kind: "director"` returns `{ next, why, raw, usage, cost }`. The route builds the messages itself from `room.mjs`, so the "received" panel is what was sent. Reasoning is turned off for every call (see "What went wrong"). 503 without a key; 400 on a bad body; errors are generic, no credentials.
- **`app/bot-room/page.jsx`**: reads the bots on the server: the room's examples in `app/bot-room/examples/` with AA's `parseBotFile`, and `bots/_examples/` and `bots/` with AA's `listBots()` from `lib/bots.mjs`, which resolves a bot's `knowledge:` file; `buildSystemPrompt` appends it under the format's marker. Bots are keyed by file path, so two files with the same slug (there are two Creatures now, one in `bots/_examples/`) both appear and, if both are chosen, the second gets a numbered slug in the room.
- **`app/bot-room/BotRoom.jsx`** and **`bot-room.css`** (`.br-` classes): the cast list with a checkbox per bot (errors shown on an invalid file, not hidden), "Write a bot on the spot" (name, description, model, system prompt; add to the room; download as a bot file through AA's `serializeBotFile`), the mode (in conversation / working together), the host's opening line or the task, who speaks next (round-robin / director), turns (1 to 30), max tokens per turn (200; together mode moves it to 400), "run every bot on" (the model in its file, or one of the five), the estimate, Run / One turn / Stop / Clear; the transcript with host, bot, and director entries, a per-turn stats line (tokens in and out, reasoning tokens if any, cost, a non-stop finish reason), "Exactly what X received" (system in gray, user turns in green, assistant turns in red), the shared-draft panel, and a host line to add before the next turn.
- **`app/bot-room/examples/`**: four bots in the shared format: the Creature, Victor Frankenstein, the Editor (writes drafts between the tags), a Skeptical Reader. They parse with AA's parser with no errors (a test checks).
- **`content/experiments/bot-room.md`**: `status: working`, order 26; what it shows, what was built, what students saw, what it is not, things to try, open questions.
- **`tests/bot-room.test.mjs`**: 6 tests in `pnpm test` (the examples parse; a bot written on the spot round-trips through the shared serializer; the roles in what each bot receives; together mode's task, draft, and extraction, closed and cut off, plus the self-label strip; round-robin and the director's answer; costs and the estimate).

No shared file was changed. I did not touch `nextjs/bots/`, `lib/bots.mjs`, or `lib/bots-format.mjs`; I only import them.

## How to try it

http://localhost:3000/bot-room. Set "Run every bot on" to Claude Haiku 5.5 if you want it cheap. Tick the Creature and Victor Frankenstein (the room examples), leave the opening line, **Run 6 turns**. Then tick a Skeptical Reader, switch "Who speaks next" to the director, **One turn** a few times and read the dashed director notes. Then **Clear the room**, choose the Editor, a Skeptical Reader, and Socrates, pick "Working together on a task", **Run 3 turns**, and watch the draft panel. Open "Exactly what X received" on two consecutive turns. Type a host line and press Enter to interject.

## What I tested

Headless Chromium (the Playwright install the brief names) against Marlon's dev server on port 3000, every bot on Claude Haiku 5.5, 0 console errors or warnings in all three passes. Screenshots and JSON for each pass are in my scratchpad, `/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/343f149d-375d-4122-9df1-e541550238b6/scratchpad/runs/bot-room-*`.

**Pass one (12:26 UTC), before the reasoning fix:**
- Round-robin, the Creature and Victor, 4 turns, 10.8 s, $0.0006 (330 to 946 input tokens per turn as the transcript grew, 184 to 200 out). In character from the first line; both hit the 200-token limit.
- Director, 2 more turns: the director's answer was empty twice and cut off once (`{"next": "a-skeptical-reader", "why": "The`); the page fell back to round-robin and said so. A Skeptical Reader's turn came back empty with 200 output tokens used.
- A host line mid-run, then one turn: Victor answered it ("I want nothing from you, creature, except that you leave me in peace").
- Stop: a 6-turn run was stopped 1.5 s after the first cursor appeared; the run ended cleanly with the partial turn kept.
- Working together, 3 turns: all three replies empty, 200 output tokens each.
- A bot written on the spot (Brother Anselm): the download produced a valid bot file; adding it to a full room did nothing, silently (now it says the room is full).
- Widths: no horizontal scroll at 1440 and 1024; 507 px wide at 390 (two selects in the controls row; fixed, now 390).

**What went wrong, and the fix:** the empty turns and the empty director answers all had output tokens used and no text: Claude Haiku 5.5 through OpenRouter was spending the output budget on reasoning. The route now passes `reasoning: { enabled: false, effort: "none" }` to the provider for every call and reports `reasoningTokens` in `done`. Checked at 12:30 UTC with two direct calls: the director returned a full JSON answer (72 output tokens) and a together-mode turn used 0 reasoning tokens.

**Pass two (12:31 UTC), after the fix:**
- Director, the Creature, Victor, and a Skeptical Reader, 3 turns, 10.1 s, $0.0006 across 6 calls: the director chose the Creature ("the creature is the one who has come to speak with him"), then Victor ("the Creature has directly addressed Victor and accused him of abandonment"), then the Reader ("has been quiet and can challenge … the framing of Paradise Lost"). Victor's turn began "Victor: Do not speak to me of Adam", labeling itself despite the room note; the page now strips a bot's own label.
- Working together, the Editor, a Skeptical Reader, Socrates, 3 then 2 more turns, $0.0011 across 5 calls: real discussion (the Editor offered a first draft, the Reader asked for the passage and cited 275d, Socrates asked whether a chatbot answers "from a mind that knows what it is saying"), but with 260 tokens per turn every draft was cut off before `</draft>`, so the draft panel stayed empty. Fixes: the room note now asks for the draft first and comments after; together mode starts at 400 tokens per turn; a cut-off draft counts and is marked "ends mid-sentence".

**Pass three (12:34 UTC, together mode after the fixes):** the Editor, a Skeptical Reader, Socrates, 3 then 2 more turns, 14 s in all, $0.0015 across 5 calls. The draft panel filled on the first turn (the Editor's paragraph on Thamus and the semblance of wisdom; cut off at 400 tokens and marked so), the Reader objected ("The draft is cut off mid-sentence … the Thamus passage (274c-275b) is about memory"), Socrates conceded one objection and pressed the "father's help" passage, and the Editor's fourth turn replaced the draft with a revised one ("Socrates never considers a responsive text, but we can reason from his concerns…"). The one self-label test then failed on a bold label with the colon inside the asterisks; fixed, 6 of 6 pass.

Spent: about 3 cents of the app's key across all passes and direct calls (every call was on Haiku; the costs above are the page's own figures from OpenRouter's token counts).

## Commits

- `81f1562` "/bot-room: first version…" (12:20 UTC): the first working version, 11 files, 602 lines, committed early as the prompt asked.
- `180a41a` (12:08 UTC) is task D's overflow fix, done first because the review marked it "fix before class" and routed it to D; see D's report.
- `b8bdcc8` "/bot-room: improvements after testing…": AA's reader and format module, reasoning off, keys by file, the phone width, the draft fixes, the self-label strip, the tests, the document at `working`.
- This report, committed by path after it.

## What I couldn't do or didn't check

- **Only Claude Haiku 5.5 was run.** The other four models in the selector were not called (they are ids and prices only, checked in the catalog today). The default for a bot with no `model:` is the app's `CHAT_MODEL`, Sonnet 5.5, so a class run on the defaults costs about twenty times the figures above; the estimate line says so before you run.
- **Not tried in Marlon's own Chrome**, only headless Chromium.
- **The missing-key path** (503) is reasoned from the code, not exercised; the key was present.
- **The `knowledge:` path was not exercised in the room:** AA's reader resolves it and `buildSystemPrompt` appends it, and no example bot of mine has one; `bots/_examples/knowledge/` exists now (AA's), so a bot with a knowledge file should show the text in "Exactly what X received", but I did not run one.
- **The full test suite has one failure that is not mine:** `tests/content.test.mjs` "every experiment names a route that exists in app/" fails on `experiments/get-ready` (AE's document exists before its route). My 6 tests pass; the suite was 62 of 62 green before that document appeared.
- **Director quality:** the director's reasons read well on Haiku, but it has no memory of its own earlier choices beyond the transcript, so it can favor the last speaker's addressee every time. A "to:" field or a rule against the same bot twice in a row would be the next step.
- Phone layout was measured (no overflow at 390 px) but not looked at by eye below 1024 px.

## For other tasks

- **O (the Slack Ensemble):** the loop guard the brief asks for is the same shape as the room's: a hard turn limit per run (here 1 to 30, default 6), "a bot never answers a bot unless a human started it" (here the host always opens), and no bot speaks twice without the room choosing it. The turn-taking rules are in `app/bot-room/room.mjs` (`nextRoundRobin`, `directorPrompt`, `parseDirector`) and the message shape in `messagesFor`: the others' lines as labeled user messages, your own as the assistant, which is also what a Slack thread should become for a bot. Reasoning off and a token cap per reply are worth copying (`reasoning: { enabled: false, effort: "none" }` on the provider call), or Haiku answers with nothing. Don't import the route; the logic file is importable if you want it, but it has the room's wording in it.
- **AA (`/bot-lab`):** I import `listBots`, `parseBotFile`, `buildSystemPrompt`, `serializeBotFile`, and `slugify`; keep those stable. Two files share the slug `the-creature` (`bots/_examples/the-creature.md` and `app/bot-room/examples/the-creature.md`); the room handles it, but `loadBot("the-creature")` will only ever see yours. The room's four examples could move into `bots/_examples/` if you want one list; they are in the format.
- **The orchestrator:** `content/experiments/bot-room.md` has `order: 26`, after the prototypes; the home page will list it. One optional field would help the room: `to:` is not needed, but a bot's `description:` is what the director reads, so examples should have one.
- **V / the workshop path:** if the room goes on today's path, set "Run every bot on" to Haiku and 6 turns; a Sonnet run of 6 turns is about 2 cents, which is fine too. Students should open "Exactly what X received" at least once.

## Marlon's words

- The task prompt: "Work in /Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments. Read AGENTS.md, then _context/orchestration/README.md (the board and its rules), then the bot format nextjs/bots/README.md, then your brief _context/orchestration/tasks/AI-bot-room.md. Get a working first version committed early, then improve it. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9)."
- Nothing else in this thread for this task. (Earlier in the same thread, for task D: "server is running".)

## Decisions and open questions

- **The host opens.** The room's first line is the host's (the opening line, or the task in together mode), so no bot speaks to an empty room; a bot asked to go again gets "(It is your turn again.)" from the host rather than nothing.
- **Turn labels.** Other bots' lines reach a bot as `Name: text` in user messages, merged when consecutive; its own as assistant messages. The `received` panel shows this, which is the lesson.
- **Director on Haiku, always**, regardless of the bots' models: cheap and quick; its model is named in the UI.
- **Reasoning off** for every call in this route (not in `/api/chat`, which I don't own). If a future model needs reasoning for quality, make it a per-bot field.
- **Drafts** are extracted from `<draft>` tags, closed or not; a draft is only replaced when a bot writes one, so a discussion turn leaves it alone.
- **Open:** whether the room's examples should live in `bots/_examples/`; whether to let the director refuse to repeat a speaker; whether to show the token-by-token stream of the director's reasoning (it is off now); a "to:" field in the format; and whether the room should save a run as a file (a transcript in Markdown) for the "how that world evolved" show on Oct 27.

**Thread:** `343f149d-375d-4122-9df1-e541550238b6`, Claude Code, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `claude --resume 343f149d-375d-4122-9df1-e541550238b6` from that directory.
