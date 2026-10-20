---
title: "Layout review: does the site serve today's arc?"
date: 2026-10-20
lens: "Walk Marlon's eleven-moment arc (20261020-run-of-show.md) through the site: which page each moment uses, its state, how a student reaches it from / and /workshop; then the home page, /workshop, and the footnote routes."
written_by: "Claude subagent of orchestrator 9b639a81-e358-4142-9f22-26dc755aec5f"
looked_at: "07:58–08:02 EDT, 2026-10-20 (machine clock), against Marlon's dev server on http://localhost:3000; repo HEAD f4a0f59 (07:58). Other agents are building; recheck before acting."
---

# Does the site serve the arc?

**Short answer: not yet.** The pages behind moments 3, 4, 6 and 8 are good. But the arc's spine (keys, then build a bot file in `/bot-lab`, test it in pairs, submit it to `/ensemble`) has no pages yet, since all three routes return 404. `/workshop` still follows the pre-voice-session path, which builds in Claude Desktop. The home page doesn't link to `/workshop` at all, and neither does the header. A student who opens `/` sees "Marlon's working prototypes … not the course repo" and then 13 equal cards. The first card is `/spiral`, and the third is an unbuilt "idea".

All routes I fetched return 200 except `/bot-lab`, `/keys`, `/ensemble`, `/rag` and the many-bots page, which return 404. Only `/persona-dial` shows "Not built yet".

## The arc, moment by moment

| # | Moment | Page(s) | State now | Reach from `/` / from `/workshop` | Gap |
|---|---|---|---|---|---|
| 1 | Setup: Desktop + keys | deployed claim app; `/keys` (AB); `/workshop/claude-desktop` §account | `/keys` 404; claim app unconfigured. Handout 200 | none / none | No page says "step 0: get a key". The no-login warm-ups (`/eliza`, `/markov`) aren't framed as "while you wait". |
| 2 | Download the repo | student repo (doesn't exist) | — | none / none | The home page says this is *not* the course repo. Nothing tells a student what to download or where the hosted backup is. |
| 3 | Tour: ELIZA, Markov, GPT-2 (footnote) | `/eliza`, `/markov`, `/spiral` | all working (C done, S first version) | cards 04, 09, 01 / stops 1–2 (Markov missing) | `/markov` isn't on `/workshop`. Tab titles read `spiral`, `markov`. |
| 4 | Assistant written into a prompt (full) | `/by-hand` | working (D done 07:54) | card 02 / stop 3 | Fine as a projected demo. **"Load the three browser models" is about 410 MB**, too much for a room on Wi-Fi. `/workshop` invites every student to try it. |
| 5 | Gem / custom GPT demo (footnote) | `/history/01-gpts`, `/history/03-gems`, `/glossary/chatbots/custom-gpts` | exist; Dec 11 retirement sourced; Assistants API not on any page | header "History" / none | No footnote link from `/workshop`. The product-timeline line (GPTs Dec 11, Gems Nov, Assistants API) has no home. |
| 6 | Madeleine's context-window drawing (full) | `/layers` ("What went in?") as the after-image; `/retrieval` | both working | cards 05, 08 / stops 4–5 | `/workshop` presents both as hands-on stops *before* the build. The arc has them as the drawing's footnotes. The RAG pipeline page (vectors, dot product) is requested but has no board task. |
| 7 | Build with the API (full) | `/bot-lab` (AA) | **404, not started** | none / none (stop 6 points to Claude Desktop instead) | The heart of the session has no page. The bot format exists (`nextjs/bots/README.md`, one example). |
| 8 | Knowledge files: vector store vs. pasted in vs. skills | `/retrieval`, `/knowledge-voice`, `/workshop/claude-desktop` (a Project as the third way) | working | cards 08, 12 / stop 4, stop 6 | Nothing frames the three-way comparison Marlon wants. The bot format's `knowledge:` field (pasted whole) is itself one of the three, which is worth saying. |
| 9 | Test in pairs (full) | `/workshop/claude-desktop/test-sheet` | built | none / inside stop 6 | Item 8 says **"Swap seats"**, which contradicts Marlon's "no machine-swapping". The sheet is also written for a Claude Project ("open a new chat in the project", Memory toggle), not for a `/bot-lab` bot. |
| 10 | Custom bot to personal agent (footnote) | `/rosie-roomba`, `/mini-claw`; many-bots page (requested) | first two working; many-bots none | cards 11, 06 / `/mini-claw` under "For later" | `/rosie-roomba` isn't on `/workshop`. The many-bots page has no board task. |
| 11 | Slack Ensemble (full, the treat) | `/ensemble` (O) + Slack | **404, not started**; needs Marlon's Slack app | none / none | The finale has no page and no stop. |

## The home page

- **What a student sees first:** the site title, then "Where the assistant came from". Next comes a paragraph of the Oct 19 argument (base model to agent), then "These are Marlon's working prototypes … They are not the course repo." Then 13 cards in the Oct 19 argument's order: spiral, by-hand, **persona-dial (idea)**, eliza, layers, mini-claw, fine-tune, retrieval, markov, reading-rooms, rosie-roomba, knowledge-voice, tics.
- **Today's path is not findable.** `/workshop` isn't a card. It isn't in the header nav (Experiments, Story, History, Readings, Glossary), and it isn't mentioned in `content/README.md`. Experiment pages have no "back to today's path" link either.
- **The order and labels don't match the arc.** The arc runs history pieces → by-hand → build → knowledge → test → Slack. The cards put mini-claw and fine-tune (moment-10 material and a Colab notebook) ahead of retrieval. The build, keys and ensemble pages aren't cards at all. Every card shows a "working" badge, so the cards don't separate full-attention pages from footnotes or works in progress. That separation was Marlon's main structural idea from the voice session.

## `/workshop` against the arc

It was drafted before the voice session (V's brief), and its description still says "Seven stops … from ELIZA to a chatbot you build yourself in Claude Desktop." Against the arc:

- It has no setup or keys step, and no "download the repo" step. Moments 1–2 are missing.
- Its order is ELIZA → spiral → by-hand → retrieval → layers → build in Claude Desktop. The arc runs setup/history → by-hand → (Gem demo) → Madeleine → **build with the API** → knowledge comparison → **test in pairs** → personal agents → **Slack**.
- Moments 5, 7, 9, 10 and 11 have no stop, and it has nothing for the Slack finale.
- It treats every stop as hands-on "Try … Notice". Marlon's two kinds of moments aren't marked, so the footnotes read as things to do in class.

## Footnote routes: are they easy to reach later?

They are reachable as cards and through the nav, but they're mixed in with the in-class pages, and nothing ties a footnote to the moment it belongs to. Under Marlon's model these are footnotes: `/eliza`, `/markov`, `/spiral` (tour); `/history/01-gpts` and `/glossary/chatbots/custom-gpts` (moment 5); `/layers`, `/retrieval`, `/knowledge-voice` (moments 6 and 8); `/rosie-roomba`, `/mini-claw` (moment 10). `/reading-rooms`, `/tics`, `/fine-tune`, `/story`, `/history` and `/glossary` are repo-only works in progress. `/persona-dial` (idea) and `/engine`, `/chat-demo` (test benches) shouldn't sit where students see them first.

There's a bigger catch: footnotes are only "for later" if students can open them later. The site runs only on `localhost:3000` (V's open question), and the student repo doesn't exist. Until Marlon decides between a deploy and a downloaded repo, no footnote is reachable after class.

## Recommendations, prioritized

**Must-before-class**

1. **Rewrite `/workshop` to the eleven-moment arc** (`nextjs/content/workshop/README.md`, **V**). Give each moment a heading with a "full" or "footnote" tag (mark the tags as the agent's tentative split). Put the routes on the Try lines, not the headings: `/print` uppercases headings, so a route there becomes `/BY-HAND` and 404s.
   - Order: 0 setup (claim-app link or `/keys`, the Claude Desktop account check, and "while you wait: `/eliza`, `/markov`"); download the repo (link or "coming"); the tour (footnote to `/eliza`, `/markov`, `/spiral`); `/by-hand` ("watch on the screen; loading all three models is 410 MB, so try it at home"); GPTs and Gems (footnote to `/history/01-gpts`); Madeleine's drawing (footnote to `/layers` and `/retrieval`); **build in `/bot-lab`**; knowledge files, three ways (`/retrieval`, the bot file's `knowledge:`, a Claude Project via `/workshop/claude-desktop`); test in pairs (the test sheet); personal agents (footnote to `/rosie-roomba`, `/mini-claw`); **the Ensemble (`/ensemble`)**; then "for later".
   - Update the description line. Keep the "draft" banner, and say a 404 means "coming during the morning".
2. **Put today's path first on the home page.** Add "Today, October 20: build and test a chatbot → `/workshop`" above the cards: in `nextjs/content/README.md` (**R**, which owns READMEs, or **V**, whose brief lists the home page) or as a block in `app/page.jsx` (**V**). Rewrite or cut "They are not the course repo" once Marlon says what the student repo is.
3. **Add "Today" (`/workshop`) to the header nav** in `app/components/Chrome.jsx` (shared file, **orchestrator**), first in the list.
4. **Change test-sheet item 8 from "Swap seats" to "Pair at the owner's machine: the owner types, the partner reads over the shoulder and proposes the attacks"** (`content/workshop/claude-desktop/test-sheet.md`, **U**). Also add a line that the same tests work on a `/bot-lab` bot. Its Memory step is Project-only, so say what to skip.
5. **Land `/bot-lab`, `/ensemble` and `/keys` before anything else** (**AA**, **O**, **AB**). Without them, moments 1, 7 and 11 have no page and `/workshop` must point at the fallbacks: Claude Desktop for the build, Marlon's key for keys, one bot from Marlon's machine for Slack. Each should register as an experiment doc (`content/experiments/bot-lab.md`, `ensemble.md`, `keys.md`, already in the briefs) with a low `order:` so they sort near the top.
6. **Decide how students reach the site and the repo** (**Marlon**; V's open question). Every footnote depends on it.

**Nice-to-have (today if time)**

7. **Split the home cards into three groups:** "Today" (bot-lab, ensemble, by-hand, retrieval), "Footnotes from today" (eliza, markov, spiral, layers, knowledge-voice, rosie-roomba, mini-claw) and "Works in progress" (reading-rooms, tics, fine-tune, persona-dial). The cleanest way is a `group:` frontmatter field read by `app/page.jsx` (**V** for the page, **orchestrator** for the convention). The cheap way is re-setting `order:` in each experiment doc, which each route's owner holds (C, D, F, G, H, I, S, T, W, X, Y, Z, E).
8. **Move `/persona-dial` (idea, "Not built yet") off third place.** Give it `order: 90` in `content/experiments/persona-dial.md` (**E**, not started, so the **orchestrator** can do it).
9. **Add a "← Today's path" link in `ExperimentPage.jsx`** so every footnote page leads back (shared, **orchestrator**, one line).
10. **Fix the lowercase tab titles** `spiral`, `by-hand`, `markov`, `rosie and roomba`, `persona-dial` (`export const metadata` in each `page.jsx`; owners **C, D, S, W, E**).
11. **Put the product timeline on one page** for the moment-5 footnote: GPTs Dec 11, 2026 (sourced on `/history/01-gpts`), Gems to skills in November (verify), and the Assistants API (date to verify). It could sit in `content/history/README.md` or as a new history section (**orchestrator** to assign; no owner on the board).

**Later (the two weeks before Nov 3)**

12. **Create board tasks for the requested pages that have none:** the RAG pipeline page (vectors, dot product; extends T's `/retrieval`), the many-bots page (moment 10), the reading zone (key concepts, takeaways and interactives per reading, with Bloom and Forster quotes; the Readings nav item is a bibliography now), and the symbolic-vs-statistical reference (**orchestrator**).
13. **Keep `/engine` and `/chat-demo` off student-facing lists, and order `/history` with the sections before `shot-list` and `fact-check`** (R, per V's note).
14. **Revisit the home intro paragraph** (the Oct 19 base-to-agent argument). After today it should say what students can build next, Marlon's "handout of the future" message, and point to the Nov 3 session.
