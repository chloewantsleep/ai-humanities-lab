---
task: "AD"
title: "Site structure for today: the home page, a full /experiments list, sections, and /workshop rewritten to Marlon's arc"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/content/README.md`, `nextjs/app/page.jsx`, `nextjs/app/components/Chrome.jsx`, `nextjs/app/components/ExperimentPage.jsx` (a back-link only), `nextjs/lib/content.mjs` (a `group:` field), `nextjs/content/experiments/README.md`, `nextjs/content/workshop/README.md`, one fix in `nextjs/content/workshop/claude-desktop/test-sheet.md`, new docs `content/experiments/chat-demo.md` and `engine.md`, and the `group:`/`order:` frontmatter lines of every experiment doc (only those lines)"
depends_on: "start now; pick up new experiment docs as other tasks land them"
report: "../reports/AD-site-sections.md"
---
# AD. Site structure for today

Read first: Marlon's arc for today, `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261020-run-of-show.md`, and the two layout reviews `_context/orchestration/reviews/20261020-layout-arc.md` and `20261020-layout-repo-map.md` (their recommendations are your starting list).

Marlon (2026-10-20): "the experiments page needs the full list, and I think there are things missing. In particular I can't see the chatbot-builder pages." Those builder pages (`/bot-lab` AA, `/chat-ui` AC, `/ensemble` O, `/keys` AB) are being built now; make sure each appears the moment its doc lands.

1. **`/experiments` lists everything.** Every route a student might use has an experiment doc and a card, including ones without docs now (`/chat-demo`, `/engine`; write short docs for them) and the new ones as they land (`bot-lab`, `chat-ui`, `ensemble`, `keys`, `rag`, `bot-room`, `gpt-2`). Add a `group:` field (read by `lib/content.mjs`, cards grouped under headings) with these groups, in this order: **Today** (the path), **Build your bot** (bot-lab, chat-ui, ensemble, keys, the Claude Desktop kit), **Before the assistant** (eliza, markov, gpt-2, by-hand), **Under the hood** (retrieval, rag, layers, knowledge-voice, engine, chat-demo), **Readings** (reading-rooms, tics), **Where agents are going** (rosie-roomba, mini-claw, bot-room), **Works in progress** (persona-dial, fine-tune, anything unbuilt). Unbuilt pages go last with their status shown.
2. **Home page:** "Today, October 20 → /workshop" at the top, then the groups. Header nav: keep "Today" first (already added); add sections only if they fit at 1024px.
3. **Rewrite `content/workshop/README.md` to Marlon's eleven-moment arc** (order and wording from the run of show; mark each moment full attention or footnote only where Marlon decided it; otherwise leave it unmarked). Each stop: what to do, what to notice, the route. Moments with no page yet link to where it will be (`/keys`, `/bot-lab`, `/ensemble`). Note that `/by-hand` downloads ~410 MB (watch it on the projector) and that the GPT-2 page has recorded runs if downloads stall. Use `/gpt-2` for the base-model page (task AE renames `/spiral`; a redirect covers old links).
4. **ExperimentPage:** a small "← Today's path" link.
5. **Test sheet:** item 8's "Swap seats" contradicts Marlon ("not machine-swapping … pair up at one person's machine; the owner types and the partner adds eyes"); fix that item and say the sheet works for a `/bot-lab` bot too.

Don't touch `content/experiments/spiral.md` or `gpt-2.md` beyond `group:` (AE owns them), or any route's own code.

**Testing:** the shared dev server at http://localhost:3000 (Marlon's); don't start a second dev server in `nextjs/`. For a headless browser when the Playwright tools are busy: the install at `/Users/mk/Development/_sort/ai-lab-team/node_modules/playwright` via `createRequire("/Users/mk/Development/_sort/ai-lab-team/package.json")("playwright")`, `executablePath` `~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, `waitUntil: "load"` (never `networkidle`). The app's OpenRouter key is low on credit: keep paid test calls few and short.

## Added from the visual review (`../reviews/20261020-layout-visual.md`)

- **Legibility when projected:** helper text, captions, chips, and kickers are 11–13px grey in `app/globals.css`. Raise the small sizes (and contrast where it's grey on grey) so they read from the back of a room; you own `globals.css` for this change only, keep it small, and check `/by-hand` doesn't break (D is fixing its overflow).
- **Folder pages:** `/workshop` shows "4 documents" but lists one card, with a stray dot; `/readings` says "Folder · 0 documents" and "Nothing here yet." under seven readings. Fix the folder rendering in `lib/content.mjs` / the page component. Make the "Draft" call-out on `/workshop` quieter.
- **`/history` index** opens with five paragraphs of agent provenance. Lead with one or two screenshots and a line on what the gallery is; move the audit notes to the bottom (or the fact-check page). You may edit `content/history/README.md` for this.

## Added 08:45: the front page (Marlon: "I need the frontpage of the site to make it easier to navigate to the key stuff")

Above the fold, a short row of big, plain links to the key things for today, in this order: **Setup** (`/workshop/setup`, new: Claude Desktop, tools, the `ai` folder, today's repo, the key), **Today's path** (`/workshop`), **Build your bot** (`/bot-lab`), **Your key** (`/keys`), **The Slack Ensemble** (`/ensemble`), **Build one in Claude Desktop** (`/workshop/claude-desktop`). Then the grouped experiments below. Show a link even if its page hasn't landed yet only if it says "coming today"; check which exist when you finish. Make "Setup" reachable from the header too (e.g. Today → the workshop folder, which lists Setup first).


Write the report named in the frontmatter (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
