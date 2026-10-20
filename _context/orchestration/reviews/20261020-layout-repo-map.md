---
title: "Review: is mk-chatbot-experiments shaped to become the students' repo?"
date: 2026-10-20
lens: "Layout and the repo map: zones vs. what exists, navigation and information architecture, first-open legibility for a student in Claude Code, and what must be excluded before handing it over"
written_by: "Claude subagent of orchestrator 9b639a81-e358-4142-9f22-26dc755aec5f"
looked_at: "2026-10-20, 07:58–08:05 EDT, at commit f4a0f59 (07:58), working tree clean except nextjs/app/layout.jsx (another agent); other agents are building, so routes from O, AA, AB, C, D, W, X, Y may have landed since"
---

# Review: the experiments repo as the model for the student repo

Read: The Notebook's `humanities-ai-lab/map-of-repo.md` and `handoffs/20261020-voice-session-run-of-show-and-repo.md`; this repo's `README.md`, `AGENTS.md`, `nextjs/CLAUDE.md` and `nextjs/AGENTS.md`, `nextjs/lib/content.mjs`, the board, `nextjs/bots/README.md`, `app/page.jsx`, `app/components/Chrome.jsx`, the content tree, `.gitignore`, and the course context repo's `_context/` listing. Nothing was run; no dev server.

**Verdict in one line:** the app's architecture (a folder of Markdown is the site, one route per experiment, a shared bot file) is the right model, but the repo itself is an orchestration workspace. Students should get a fresh repo with an allowlist of files copied in, rather than a clone of this one.

## 1. Zones onto what exists

| Zone (map-of-repo) | What exists at 08:00 | Gap, and where it should live | Owner |
|---|---|---|---|
| Chat app (Marlon) | `nextjs/bots/README.md` (format) + one example; `/chat-demo` (B's test page); `app/api/chat/` | `/bot-lab` not started. Live in `app/bot-lab/`, read `bots/` | AA |
| History pieces (Marlon) | `/eliza`, `/markov`, `/spiral`, `/by-hand` all `status: working`; `/story`; `/history` (screenshots) | Built but presented as 4 of 13 undifferentiated cards. Needs a History hub (see §2) | V, or a new nav task |
| RAG pipeline page (Marlon) | `/retrieval` (T, done): scores, histogram, exact prompt; `public/retrieval/*.json` index | Vectors and the dot product not shown; **no task on the board** for build request 2. Extend `/retrieval` in place; add `/rag` as an alias, since Marlon said he'd point to `/rag` in the talk | new task (T's files) |
| Multi-bot page (Marlon) | Nothing (N6 is claws in one room, not started) | **No task.** `app/bot-lab/room/` (or `/room`), reading the same `bots/` via `lib/bots.mjs` | new task after AA |
| Slack Ensemble (Marlon) | Nothing yet | O: `slack-ensemble/` at repo root + `/ensemble`. In the student repo, include only the submission page; keep the harness (tokens, Lab infrastructure) in the Lab's repo | O |
| Reading zone (Marlon) | `/readings` = a checked bibliography of 7 experiment readings; `/reading-rooms` (Phaedrus, turn-taking); `_context/course-readings-summary.md` (Codex summary, internal location); `eng-298ai-context/_context/course-readings/course-readings-md` | No per-reading pages. Make `content/readings/<reading-id>.md` (or folder) one per course reading: key concepts, unpacked takeaway, link to its room. Move today's bibliography to `content/readings/sources.md` | **no task**; build on X and P |
| Literature thread (Marlon) | Forster is quoted in `story/10-staged-interiority.md`; no Bloom | `content/readings/literature-and-character.md`; the quote-holding bot as `bots/_examples/character-quotes.md` | new task |
| Symbolic vs. statistical (Marlon) | Marcus/LeCun nowhere except `glossary/chatbots/eugene-goostman.md` | `content/readings/debates/symbolic-vs-statistical.md` | new task |
| Claude Desktop kit | `content/workshop/claude-desktop/` + `public/workshop/texts/` (12 files, all Project Gutenberg) | Done. Drop `claude-code-proposal.md` ("for the instructors") from the student copy | U |
| In-app assistant (idea) | Nothing | Cheapest form: a bot in the shared format, `bots/_examples/site-guide.md`, whose `knowledge:` is a generated site map; runs in `/bot-lab` and in Slack for free | later |
| Product timeline (Marlon) | GPT retirement (11 Dec 2026) and Gems (17 Nov 2026) dates live in `content/history/README.md` and `shot-list.md`; Assistants API absent | `content/history/timeline.md`; Assistants API date marked (verify) | new task (J's facts) |
| Prototypes to explore | `/tics`, `/rosie-roomba`, `/knowledge-voice`, `/layers`, `/mini-claw` (+ root `mini-claw/` workspace), `/fine-tune` (+ root `fine-tune/`), `/engine`, `/chat-demo`, `/persona-dial` (idea, "Not built yet") | Madeleine's prototypes have no home: `content/prototypes/madeleine/` or their own routes. Hide `idea` cards from the student home | Marlon's cost-benefit review |
| Reference shelf | `/glossary` (5 groups, done), `/history` screenshots, `/story` | Screenshots unredacted (K not started) | K, L, M |
| Course texts | 6 PD texts as `.md`/`.txt` + retrieval JSON; the syllabus is not in this repo | In-copyright PDFs (Grice 1975, Sacks et al. 1974) stay out; link out | Marlon (public/private) |

## 2. Navigation and information architecture

**Now:** the header is Experiments · Story · History · Readings · Glossary (`Chrome.jsx`). The home page is the intro plus 13 flat experiment cards with status badges. The two Marlon-named categories, "history pieces" and "build your bot", have no section. `/workshop` (today's path) is not in the header or on the home page. "History" means the screenshots, not the playable history. `bots/` sits outside `content/`, so it is not on the site.

**Proposal, built without renaming any URL.** `content.mjs` already supports section hubs: a folder's `README.md` frontmatter can carry `tools: [{href, title, copy}]` (buttons at the top) and `list_heading:`. So each section is one README, and the routes stay flat:

| Section | Hub route (content file) | Buttons / pages |
|---|---|---|
| Today | `/workshop` (exists) | the path; `/workshop/claude-desktop` |
| History | `/history` (`content/history/README.md`, add `tools:`) | `/eliza`, `/markov`, `/spiral`, `/by-hand`; `/story`; timeline; the screenshot sections below |
| Build your bot | `/build` (new `content/build/README.md`) | `/bot-lab`, the bot format (copy `bots/README.md` in as a page), `/ensemble`, the room, `/workshop/claude-desktop` |
| Under the hood | `/under-the-hood` (new) | `/retrieval` (alias `/rag`), `/layers`, `/knowledge-voice`, `/engine` |
| Readings | `/readings` (README becomes the index) | one page per reading, `/reading-rooms`, literature thread, debates, `sources` |
| Reference | `/glossary` | glossary; later a reference hub if timeline and fact-check need one |
| Prototypes | `/experiments` (relabel to "Prototypes · works in progress"; keep the URL) | `/tics`, `/rosie-roomba`, `/mini-claw`, `/fine-tune`, `/persona-dial`, Madeleine's |

Header: Today · History · Build · Under the hood · Readings · Glossary · Prototypes. Home: replace the 13 cards with seven section cards (the experiment cards move to `/experiments`, which already lists them).

**Renames that would break links, and why to avoid them today:** `/experiments` → `/prototypes` breaks the `/experiments/<name>` redirects and the many `../experiments/*.md` links in glossary and readings; moving the screenshot pages to `/history/screenshots/...` breaks 3 files' links; moving the bibliography out of `readings/README.md` breaks one anchor (`story/06-post-training.md` → `readings/README.md#the-shoggoth-with-a-smiley-face`) and any `Reading ID` lookups P uses. Keep URLs, change labels. If `/prototypes` is wanted, add it as a redirect to `/experiments` rather than a move.

## 3. First open in Claude Code

**What a student sees at the top level today:** `_context/` (the orchestration board with Marlon's to-dos, key budgets, account notes; a ChatGPT deep-research doc marked unverified; the reading-rooms design), `fine-tune/` (Python and Colab; 3.1 GB of gitignored artifacts on this disk), `mini-claw/` (the agent's live workspace), `nextjs/`, and, once O lands, `slack-ensemble/`. `AGENTS.md` tells their Claude to read the task board, take a task, or become the orchestrator. `README.md` and the home page (`content/README.md`) both say "This is not the course repo." A student's Claude would start by orienting to a fleet that doesn't exist.

**Student top level (proposed):** `README.md`, `AGENTS.md` + `CLAUDE.md` (`@AGENTS.md`), `nextjs/` (the site, with `bots/` inside, since AA and O are building against `nextjs/bots/`), `notebook/` (new: the student's own notes, test logs, and results before Oct 27), and `prototypes/` only if `fine-tune/` and `mini-claw/` go in at all (both are later, as code to read). No `_context/orchestration/`; if Marlon wants it as a worked example of directing agents, ship one finished task brief and its report under `notebook/examples/` or as a page, not the live board.

**Student `README.md` should say:** what this is (the ENG 298AI Lab repo, Oct 20 – Nov 3); open it in Claude Desktop's Code tab or `claude` in this folder; run it (Node 22, `cd nextjs`, `pnpm install`, `pnpm dev`, open localhost:3000; the first visit to `/spiral` downloads about 130 MB); the hosted backup link; keys (copy `.env.example` to `.env.local`, paste the key from `/keys`, never share it); the seven sections with their routes; where your work goes (`nextjs/bots/<your-slug>.md`, `notebook/`); how to add a page (drop a `.md` in `nextjs/content/`, it appears at the same path).

**Student `AGENTS.md` should say:** you are helping an ENG 298AI student, a humanities scholar who may be new to code; explain each step and command in plain words before running it; this repo's map (the same seven sections); the bot format is `nextjs/bots/README.md`, and their bot must stay simple enough for the Slack Ensemble; pages are Markdown in `nextjs/content/`; use pnpm; never print, commit, or paste a key; ask before installing packages or deleting files; don't push to the course's GitHub unless the student asks; mark unchecked facts "(verify)"; keep texts that aren't public domain out of the repo and link to them instead. Keep the `nextjs/AGENTS.md` Next-version block; it is regenerated by `next dev` anyway.

## 4. Exclude or clean before handing it over

- **Git history.** 78 commits including the board, the original screenshot record, and agents' reports. A scan of all history for OpenRouter, Anthropic, Slack, and GitHub token patterns found none, and `.env.local` is gitignored. Even so, start the student repo with fresh history: copy an allowlist, don't fork.
- **Screenshots.** `content/history/_images/` is 43 PNGs, 26 MB, captured in Marlon's logged-in accounts (personalized greetings, project lists; the "Course TF Assistant" GPT and project). K (crop and redact) has not started. Today: ship the history pages without the images, or only images K or Marlon has looked at.
- **Links into private repos.** Content has 276 links to `github.com/ll-26-27/eng-298ai-context` (118 glossary files, 8 story chapters, 11 history pages) and 14 to this repo. Students will get 404s or, if given access, a path into in-copyright PDFs. Rewrite them to public sources or to the reading zone's own pages; at minimum strip them in the copy.
- **In-copyright texts.** Tracked texts are clean: all six texts and their retrieval JSON are Project Gutenberg (Jowett's Phaedrus, Selver and Playfair's R.U.R., Brereton and Rothwell's Bergson). The course context repo holds Grice 1975 and Sacks et al. 1974 as PDFs (in copyright) and Phaedrus/Wilde PDFs of unknown edition: keep all PDFs out and use summaries plus links. The turn-taking room links a third-party PDF of Sacks et al. on columbia.edu; prefer the JSTOR/DOI record.
- **Marlon's notes and internal pages.** Leave out all of `_context/`, and from `content/`: `workshop/claude-desktop/claude-code-proposal.md`, `history/shot-list.md` and `history/fact-check.md` (or rewrite them for students), `story/samples/`, and the "not the course repo" lines in `README.md` and `content/README.md`. `course-readings-summary.md` is useful raw material for the reading zone, but it is an unreviewed Codex summary; review it before it becomes a student page.
- **Large and local artifacts.** `fine-tune/` (3.1 GB of `.venv`, `.cache`, `outputs`, gitignored, but present if anyone zips the folder), `nextjs/output/playwright`, `nextjs/.playwright-cli`, `.next`, `node_modules`. `.gitignore` covers all of them; distribute by clone or by a zip of the clean copy, never a zip of this folder.
- **`.gitignore` for students:** keep it, and add `notebook/private/` and the ensemble's local JSONL log. Keep `!.env.example`.

## Recommendations, prioritized

1. **Today.** Build the student repo as a fresh repo from an allowlist (`nextjs/` minus the exclusions above, `bots/`, the PD texts), not a clone of this one. No board task owns this; add one (packaging, owned by the orchestrator).
2. **Today.** Write the student `README.md`, `AGENTS.md`, and `content/README.md` (home intro) per §3. The current ones send a student's Claude to the task board and say "not the course repo." Same packaging task.
3. **Today.** Strip from the copy the unredacted screenshots (K not started), the 290 private-repo links, `claude-code-proposal.md`, and `_context/`. Packaging task, with K for the images.
4. **Today (cheap, no renames).** Add section hubs via folder-README `tools:` frontmatter: `/history` gets buttons to `/eliza`, `/markov`, `/spiral`, `/by-hand`; new `/build` and `/under-the-hood` hubs; relabel `/experiments` as Prototypes; add `/rag` → `/retrieval`; put the sections and `/workshop` in the header and on the home page. Chrome.jsx and `app/page.jsx` are shared files: one small orchestrator-assigned change (R or V), separate from AA and O.
5. **Today.** Keep `nextjs/bots/` where AA and O expect it, and point to it from the student README; add `notebook/` for students' test logs. AA, O.
6. **This week.** The reading zone: one page per course reading in `content/readings/` (concepts, takeaway, room link), the bibliography moved to `readings/sources.md` (fix the one anchor in `story/06`), plus the literature thread and the symbolic-vs-statistical page. A new task building on X and P.
7. **This week.** New tasks for the two Marlon zones with no owner: the RAG under-the-hood extension of `/retrieval` (vectors, dot product) and the multi-bot room on `lib/bots.mjs`; plus `content/history/timeline.md` with the Assistants API date checked.
8. **This week.** K: crop and redact the screenshots, then restore them to the student copy.
9. **Later.** The in-app assistant as a bot file with a site map as its knowledge; Madeleine's prototypes a home under Prototypes; decide whether `fine-tune/` and `mini-claw/` go in as code to read; consider moving `bots/` to the repo root once AA and O are stable.
