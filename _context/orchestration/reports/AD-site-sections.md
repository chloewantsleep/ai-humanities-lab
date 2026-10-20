---
task: "AD"
thread_id: "120fb139-0b1c-4ab4-86b4-c103cb9b7554"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume 120fb139-0b1c-4ab4-86b4-c103cb9b7554 (from /Users/mk/Development/mk-27/apps/the-notebook)"
status: "done (a2b0acb); re-run me when more experiment docs land, to set their group: lines"
---

# AD. Site structure: report

## What I built

- **Groups.** `nextjs/lib/content.mjs` reads a `group:` field on every experiment doc and exports `experimentGroups` (the seven sections in the brief's order, each with a one-line blurb) and `getExperimentGroups()`. A doc with no `group:` gets the section listed for its name in `defaultGroups` (bot-lab, chat-ui, ensemble, keys, eliza, markov, gpt-2, spiral, by-hand, retrieval, rag, layers, knowledge-voice, engine, chat-demo, reading-rooms, tics, rosie-roomba, mini-claw, bot-room, get-ready), so a page lands in the right section the moment its document exists; anything else goes under "Works in progress". Within a group: `status: idea` sorts last (shown as "not built yet"), then by `order:`. Empty groups are left out.
- **Cards in groups:** new `nextjs/app/components/ExperimentGroups.jsx`, used by the home page and by `/experiments` (the `[...slug]` page renders it for the `experiments` folder instead of the flat list). The "Today" group always starts with a card for `/workshop`; "Build your bot" ends with a fixed card for the Claude Desktop kit (`/workshop/claude-desktop`), since it is a handout, not an app route (a doc for it broke R's "every experiment names a route in app/" test, so it is a fixed card).
- **Home page** (`app/page.jsx`): a "Today, October 20: Build and test a chatbot →" banner above the title, then the intro, then the groups. Header nav unchanged (Today is already first; nothing more fits cleanly at 1024).
- **`/workshop`** (`content/workshop/README.md`): rewritten to the eleven moments of the run of show, in Marlon's order, each with Do / Notice / the route. Attention (full vs. footnote) is not marked, since Marlon hasn't decided it; the only decided thing, pairing at the owner's machine with no machine-swapping (moment 9), is in. Notes the 410 MB load on `/by-hand`, the recorded runs on `/gpt-2`, the key rules, and where unbuilt pages will be (`/keys`, `/bot-lab`, `/rag`, `/bot-room`, `/ensemble`). The "Draft" call-out is now one italic line. Uses `/gpt-2` throughout.
- **ExperimentPage:** a "← Today's path" link above the kicker on every experiment.
- **Test sheet:** item 8 now reads "Stay at your own machine: you type, your classmate reads over your shoulder and proposes the attacks"; a line at the top says the sheet works for a `/bot-lab` bot too and which Project-only steps to skip (the Memory toggle; "a new chat in the project" means reloading).
- **Folder pages** (`app/[...slug]/page.jsx`): the kicker counts one level down ("1 folder · 2 pages") instead of the recursive "4 documents"; a folder with only a README shows its eyebrow ("Folder") and no "Nothing here yet."; the stray "▸" before folder rows is gone.
- **Legibility** (`app/globals.css`, small change, appended note): eyebrows, document numbers, ai-badge 11→13px; breadcrumbs, updated lines, captions, footer, context counts 12→14px; status pills 11→12px; card copy 15→16px; mobile nav 13→14px. Plus the CSS for the banner, group headings, and the back-link. `/by-hand` checked at 1440 and 1024: no overflow.
- **`/history` index** (`content/history/README.md`): leads with two screenshots (ELIZA, the GPT Store with its retirement banner) and a paragraph on what the gallery is, with the two dates that matter today; the provenance and correction notes moved under "About these images" at the bottom.
- **New docs:** `content/experiments/chat-demo.md` and `engine.md`.
- **`group:`/`order:` lines** set on every experiment doc present at the time: keys, eliza, markov, gpt-2, by-hand, retrieval, layers, knowledge-voice, reading-rooms, tics, rosie-roomba, mini-claw, persona-dial, fine-tune, bot-lab, bot-room, rag, get-ready, chat-ui. `order:` is now per group (1, 2, 3…), not site-wide.

## How to try it

http://localhost:3000/ (the banner, then the groups), /experiments (the same groups), /workshop (the eleven moments), /readings and /history (folder fixes), any experiment page (the back-link). Headless screenshots at 1440 and 1024 for /, /experiments, /workshop, /readings, /history, /eliza, /by-hand, and the test sheet: all 200, no horizontal scroll, no console errors from my pages (one React dev warning on /readings at 1440, "state update on a component that hasn't mounted", from a shared component, not reproduced at 1024). `pnpm test`: 55 pass.

## Commits

- `a2b0acb`: everything above except the docs listed below.

**Not committed by me** (other agents' uncommitted changes in the same files; my `group:`/`order:` lines are in the working tree): `chat-ui.md` (AC), and the untracked `get-ready.md` (AE) and `rag.md` (AH). Their owners' commits will carry the lines; until then the defaults in content.mjs place them correctly anyway. `bot-lab.md`, `bot-room.md`, `by-hand.md`, `reading-rooms.md` were committed by their owners with my lines in.

## What I couldn't do or didn't check

- `ensemble.md` (O) hadn't landed when I stopped; it will fall into "Build your bot" by default. Re-run me to set its lines.
- The `/history` images are served (200) but render lazily; the headless shot caught the captions before the pixels. Check once in a real browser.
- Phone width not re-screenshotted after the CSS change.
- The hosted-copy and student-repo links in /workshop moments 1–2 say "on the slide": Marlon's decision (board to-do).

## For other tasks

- **All route owners:** `order:` on an experiment doc is now its place within its group; the list of groups is in `lib/content.mjs`.
- **O, AA, AB, AC, AE, AH, AI:** your doc appears in its section automatically; add `group:` and `order:` lines to pin it.
- **V:** /workshop is rewritten; the QA path should follow its eleven moments.
- **R / AF:** the "every experiment names a route" test is why the Claude Desktop kit is a fixed card, not a doc.
- **Orchestrator:** `defaultGroups` in content.mjs is the place to register a new page's section before its doc exists.

## Marlon's words

None in this thread (the brief quoted him: "the experiments page needs the full list, and I think there are things missing. In particular I can't see the chatbot-builder pages." and, for the test sheet, "not machine-swapping … pair up at one person's machine; the owner types and the partner adds eyes").

## Decisions and open questions

- The Today group holds the `/workshop` card plus `/get-ready`. The Claude Desktop kit is a fixed card in "Build your bot".
- Attention tags (full / footnote) are left off every moment until Marlon decides.
- `/experiments` keeps its URL and the groups; the header was not extended.
