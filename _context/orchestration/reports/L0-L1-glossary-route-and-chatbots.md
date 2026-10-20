---
task: "L0 (the glossary route and index) and L1 (glossary: chatbots, one entry per chatbot)"
thread_id: "a2a4c55c-a6de-4bf2-80c6-91c2d4a0e19c"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume a2a4c55c-a6de-4bf2-80c6-91c2d4a0e19c  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:38–19:02 UTC, 2026-10-19 (work and final report; the session file runs on to 19:32 UTC with three replies to 'are you still working?')"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# L0 and L1: the glossary route, and the chatbots category

One thread did both tasks in order: L0 first (README, then the route), then L1. For L1 it wrote ELIZA itself as the model entry and fanned the other 38 entries out to four research subagents, then wrote the timeline README and committed everything. The four subagents are not separate threads of Marlon's; their hand-backs are summarised below.

## What I built

### L0: the glossary index and the `/glossary` route

- `nextjs/content/glossary/README.md`: introduces the glossary, links the five category folders, sums up the entry format, and lists the reading ids that entries may put in `readings:` (with the path in the course repo, or "not in the course repo"). Committed first so the other glossary agents could link to it.
- `nextjs/app/glossary/[[...slug]]/page.jsx`: the route, modelled on tdm155ai-week-6's `/concepts`. At `/glossary` the sidebar lists the categories; inside a category the sidebar lists that category's entries beside the entry being read. Additions the thread made beyond the brief: chatbots are listed in date order with the year in the sidebar, the line above a chatbot's title reads "Chatbots · year · maker · status", and the index has a search over terms and aliases.
- `nextjs/app/glossary/GlossarySearch.jsx`: the client-side search box.
- `nextjs/app/glossary/glossary.css`: the route's styles, beside the route rather than in `globals.css` (rule 1).
- `nextjs/app/components/Chrome.jsx`: "Glossary" added to the header nav (a small shared-file change, as the brief asked).

### L1: chatbots

- `nextjs/content/glossary/chatbots/`: 39 entries plus a `README.md`. In the entry format of the orchestration doc, with the extra frontmatter `year`, `maker`, `status`, `screenshot`, and a "Where it fits" section. 19 entries carry a `screenshot:` (embedded from `content/history/_images/`); 20 have none.
- The README table runs in date order with year, maker, and a one-line gist, and so doubles as a timeline. A dagger marks the three years that sources disagree on (Dr. Sbaitso, Jabberwacky, Cleverbot).
- Entries, by date: ELIZA 1966; PARRY 1971; Racter 1984; Dr. Sbaitso 1990†; A.L.I.C.E. 1995; Jabberwacky 1997†; SmarterChild 2001; Eugene Goostman 2001; Cleverbot 2006†; Siri 2011; Alexa 2014; Xiaoice 2014; Tay 2016; Replika 2017; Meena 2020; BlenderBot 2020; LaMDA 2021; Character.AI 2022; Sparrow 2022; ChatGPT 2022; Poe 2022; Bing Chat and "Sydney" 2023; Claude 2023; Bard and Gemini 2023; Pi 2023; NotebookLM (Gemini Notebook) 2023; Meta AI 2023; Microsoft Copilot 2023; Grok 2023; Custom GPTs 2023; Claude Projects 2024; Dot 2024; Gems 2024; ChatGPT Projects 2024; OpenClaw 2025; Hermes Agent 2026; Grok Bot 2026; Muse 2026; OpenAI's dots 2026.
- That is the whole starting list from the orchestration doc, with the 2023-and-later configuration products and 2026 agents added. Nothing on the starting list was dropped.
- The Claude entry is `claude-ai.md` (slug `claude-ai`), not `claude.md`: on macOS's case-insensitive filesystem Claude Code was loading `chatbots/claude.md` as that folder's `CLAUDE.md` instructions. Links to it were updated (`chatgpt.md`, `claude-projects.md`, `poe.md`).

## How to try it

- http://localhost:3000/glossary (the index, with search), http://localhost:3000/glossary/chatbots (the timeline), http://localhost:3000/glossary/chatbots/eliza (the model entry), http://localhost:3000/glossary/chatbots/claude-ai.
- Does not need `OPENROUTER_API_KEY`: it is static Markdown.
- Checked on 2026-10-19: `/glossary`, `/glossary/chatbots`, `/glossary/chatbots/eliza`, and `/glossary/chatbots/claude-ai` all return 200. The thread itself reported checking every chatbot page for 200 (one `dr-sbaitso` 500 was transient and cleared on re-request).

## Commits

All verified in `git log`; authored as `mkuzmick`.

- `231ede7` Glossary: the index page, entry conventions, and reading ids (L0)
- `945eddb` Glossary route: categories in the sidebar, a category's entries beside the one you're reading, search over terms and aliases; Glossary in the nav (L0)
- `b5ea787` Glossary README: reading ids for the InstructGPT, LaMDA, and Constitutional AI papers in the course repo
- `ef41e25` Glossary: chatbots, 39 entries from ELIZA (1966) to OpenAI's dots (2026), with a timeline README (L1) (40 files: 39 entries and the README)

Checked on 2026-10-19: `git status` is clean, so nothing belonging to this thread is uncommitted. Nothing pushed, and The Notebook's submodule pointer was not moved, as the rules require.

## What I couldn't do or didn't check

Counts, from the repo on 2026-10-19: 21 of the 39 chatbot entries contain at least one "(verify)" (the thread said 21 too). By entry:

- **Disputed years (daggered in the README):** Dr. Sbaitso (the program file inside a bundled Sound Blaster floppy image is dated 1990, most accounts say 1991; the disk image is a user upload); Jabberwacky (its own About page says 1988, BBC 2003 says 1989; also whether jabberwacky.com still answers, since it did not respond on 2026-10-19); Cleverbot (its site says "started in 2006", Wikipedia says October 2008).
- **ELIZA:** the Wikipedia dates (development 1964-67, the 2021 find of the MAD-SLIP listing, the December 2024 run). The thread also noted that the orchestration list's "2021 publication of the original MAD-SLIP listing" is half right: the find was reported in 2021, but the published restoration (Lane et al.) is January 2025.
- **PARRY:** the 1972 "Turing-like Indistinguishability Tests" paper (cited only via Wikipedia, not opened).
- **Racter:** the 1984 Mindscape release and its platforms; the "computerized Mad Libs" description.
- **SmarterChild:** whether it was on MSN at launch (InternetNews 2002 says yes, the Computer History Museum says only after 2004); its return to AIM; the renamings to Conversagent and Colloquis; the shutdown date (Wikipedia only).
- **A.L.I.C.E.:** whether it still runs anywhere (alicebot.org is now an unrelated content-farm site and was deliberately not linked).
- **Eugene Goostman:** the third developer (Sergey Ulasen), the 29 percent result at Bletchley Park in 2012, and the 2005 and 2008 Loebner placings (Wikipedia only).
- **Tay:** the "16 hours" figure and the reactivation. **Replika:** the launch month. **Xiaoice:** platforms and the 2017 takedown. **BlenderBot:** when the demo was taken down. **Sparrow:** that it was never released. **Character.AI:** the exact beta date. **Siri:** the iOS 18 ChatGPT hand-off.
- **Pi:** whether it is still free and available in every country. **Grok:** when @grok began replying in X threads. **Gems:** when Gems opened to free users and the later Workspace and education migration dates (Google's help page not opened; Android Central 29 Sep 2026 and a screenshot used). **ChatGPT Projects:** OpenAI's own launch post not opened (13 Dec 2024 is from TechCrunch), and when project memory arrived. **Custom GPTs:** one "(verify)".
- **Dot:** the exact public release day (waitlist seen on Wayback 30 Nov 2023, "Available now" by 3 Jul 2024, "June 2024" only in secondary sources). **OpenClaw:** the intermediate name "Clawdbot" (secondary coverage only), and the security counts, which are not stated as fact. **Hermes Agent:** the February 2026 launch (earliest GitHub release found is v0.2.0, 12 Mar 2026). **Muse:** whether it has a file system or terminal (neither Meta source says so). **Grok Bot:** the corporate name (the x.ai page is titled "Introducing Grok Bot | SpaceXSI"); this one has no "(verify)" tag in the file by my count but was flagged in the subagent's report.

Other limits, from the transcript:

- Bing Chat: the NYT column was read through a Wayback copy and the Ignite 2023 page only as a search excerpt (the same sentence is confirmed on Microsoft's Copilot post). Meta AI: The Information is cited through the NY Post, not opened (paywalled).
- The Dr. Sbaitso 1990 date rests on strings inside a user-uploaded disk image.
- The thread did not look at the pages in a browser; its checks were HTTP status codes and a link-check script.

**Claimed but not fully borne out:** none found. The thread said "every other cross-category link resolves", and my check on 2026-10-19 agrees (see the next section).

## For other tasks

- **L3 (persona and dialogue):** `chatbots/replika.md`, `pi.md`, and `character-ai.md` link to `../persona-and-dialogue/parasocial-relationship.md` (and list `parasocial-relationship` in `see_also`). Checked on 2026-10-19: there is no such file in `persona-and-dialogue/`. Either write the entry or change the links.
- **L4 (interfaces and agents):** `chatbots/dr-sbaitso.md` links to `../interfaces-and-agents/voice-assistant.md` and has `voice-assistant` in `see_also`. Checked on 2026-10-19: no such file (the folder has `retrieval-rag.md`, etc.). These two (parasocial-relationship and voice-assistant) are the only dangling cross-category links from the chatbots folder.
- **L2 (models and training):** its `embedding.md` links to `../interfaces-and-agents/retrieval.md`, which does not exist; L4 named the entry `retrieval-rag.md`. (Not L1's link, but the same kind of gap.) See the L2 report.
- **J (fact-check):** the thread confirmed, with sources, items J's ledger had open: GPT Store launched 10 Jan 2024; custom instructions launched July 2023; GPT retirement on 11 Dec 2026 (OpenAI help FAQ, which also gives 11 Feb 2027 for Enterprise workspaces with an approved deferral); Muse's name, avatar, and style controls (Meta's "How We Designed Muse" page; terminal and file system still unconfirmed, and the claim that these choices cause bonding is still unsourced); Dot's founders (Freethink, 2 Nov 2023); NotebookLM renamed Gemini Notebook (Google blog, 16 Jul 2026); Gems previewed 14 May 2024 and released 28 Aug 2024; OpenClaw repo created 24 Nov 2025; Grok announcement dated 3 Nov 2023.
- **M (the story):** the chatbot entries and their sources are the intended basis for `/story`; the Sbaitso, Jabberwacky, and Cleverbot dates are the contested ones.
- **N7 (claw vocabulary):** `openclaw.md`, `hermes-agent.md`, `grok-bot.md`, `muse.md`, and `openai-dots.md` link to L4's agent entries (agent, agent-loop, always-on-agent, agent-computer, harness, skills, memory, permissions, lethal-trifecta, and others); the exact slugs used are on disk (`knowledge-files`, `retrieval-rag`).
- **P (readings):** the L0 README lists `weizenbaum-1966`, `janus-2022`, and `nostalgebraist-2025` as "not in the course repo".
- **Candidates the subagents suggested but nobody wrote:** Cortana, Google Assistant, Mitsuku/Kuki, Elbot, PC Therapist, Perplexity, DeepSeek's chatbot, and Gemini "skills" (Nov 2026). The PC Therapist / Loebner 1991 details were from memory and unsourced.

## Marlon's words

Only the task prompt (18:38:45 UTC) and three check-ins; the other "user" turns in the session file were subagent hand-backs and task notifications, not Marlon.

- 18:38:45 UTC: the task prompt (read the four docs and the model glossary, do L0 then L1, "Every date and claim needs a source you actually checked, linked in the entry; mark anything you can't confirm '(verify)'", commit in this repo, don't push, "report how many entries you wrote, which claims are still '(verify)', and any links to entries in other categories that don't exist yet").
- 18:58:39 UTC: "are you still working?"
- 19:13:40 UTC: "are you still working?"
- 19:29:33 UTC: "are you still working?"

(The thread answered the first by checking the folder and writing the timeline README; the second and third by saying it was finished.)

## Decisions and open questions

Choices someone might revisit:

- **Rename `claude.md` to `claude-ai.md`** to avoid the CLAUDE.md collision. Any future entry named like an instruction file (`agents.md`, `claude.md`, `gemini.md`) has the same risk on macOS.
- **PARRY dated 1971, not "c. 1972":** Colby, Weber and Hilf, "Artificial Paranoia," *Artificial Intelligence* 2 (1971). The 18 September 1972 PARRY-DOCTOR conversation (RFC 439) is in the entry.
- **Dr. Sbaitso dated 1990** from the program file, against the usual 1991.
- **Eugene Goostman year 2001** (creation), with the 2014 claim in the body. **Grok year 2023** (xAI post dated 3 Nov 2023).
- **Custom GPTs `status: active`**, though OpenAI retires them on 11 Dec 2026; the body says so.
- **Character.AI `status: active`:** the entry cites The Verge's report of a Chapter 11 filing on 13 Oct 2026 (with a Disney bid for some assets) but the status field was not changed. Marlon may want it changed.
- **Siri:** the thread's own check says the standalone app launched 4 Feb 2010, not December 2010 as Wikipedia has it.
- **Gems:** the body explains Google's migration to "skills" from 17 Nov 2026, sourced to Android Central and a screenshot rather than Google's own page.
- **Search, sidebar year, and metadata line** on the route were additions beyond the brief.

Questions left for Marlon (the thread asked none directly): whether to add Cortana, Google Assistant, Mitsuku/Kuki, Elbot, PC Therapist, Perplexity, and DeepSeek; whether to update Character.AI's status; whether to chase the "(verify)" list.

Per the new rule 8, this thread did not write its own report in `_context/reports/` (the rule was added at 16:23 EDT, after the thread ended); this file is the substitute.
