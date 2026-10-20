# Chatbot timeline handoff

Updated: 20 October 2026 (afternoon, Claude Code). The sections after "Earlier handoff (Codex)" describe the morning's state and are kept for history; where they disagree with this section, this section is current.

## Current state

- **The home page (`/`) is Today** (`nextjs/app/components/TodayPage.jsx`; `/workshop` redirects there). The timeline moved, unchanged, to `/timeline` (also `/story`). The nav lists Today, the four activities, Timeline, Bot materials, Interfaces, Readings. Earlier note, still accurate for the activities: setup (Claude Code, clone, run), context windows and Gems, then four activities on their own routes: A `/eliza`, B `/gpt-2-assistant` (raw GPT-2, then with the HHH prompt), C `/poetry-gem` (the studio in its original cream palette), D `/build-a-bot` (identical to C plus a RESET banner), then the in-person critique and the turn to harnesses. The timeline no longer embeds the Gem or any paper doll; it links to C and D. Type is Inter throughout (mk's); the Gem pages scroll as one page, with no inner scroll boxes or sticky parts.

- **Look.** One theme for the whole site (`nextjs/app/globals.css`): a garnet-charcoal ground, Inter body, Josefin Sans semibold for every h1/h2 (a heavier art-deco face than the Gem's Poiret One), Jost for eyebrows and labels, EB Garamond for quotations, vermilion accent, brass rules.
- **Timeline (`/`).** Opens with a scroll-driven zoom (`app/story/TimelineZoom.jsx`) from 2023–2026, which the class has just discussed, out to c. 370 BCE – 2026, then starts at the *Phaedrus*. Eleven chapters, about 4,800 words (cut from the 14,000-word first draft, not from Codex's 530): `nextjs/content/story/`, format in its README. Interactives in order: ELIZA; GPT-2; **GPT-2 with and without the real HHH prompt** (`HhhDemo.jsx`; the paper's file, trimmed to GPT-2's window with the cut shown; six recorded runs in `content/story/samples/hhh-gpt2.json` show before the model loads); the Gem's head (`type: gem`); knowledge and delivery on *Frankenstein* (`app/story/knowledge/`); the whole Gem; the builder; an ELIZA / GPT-2 / harness comparison (`type: compare`) and discussion questions; **Fork it** → `/build-a-bot`.
- **`/build-a-bot`.** The full studio and a RESET button (`ResetShell.jsx`). Reset wipes the page to `BotPage.jsx`: plain browser-default text on the data flow, drop-downs, a Submit button, and fork instructions. **Students fork the repo and redesign only `BotPage.jsx`.** The contract is `contract.js` (`submitBot(choices, catalog)` with botName, studentName, prompt, pack, material, delivery, and optional `extras`). Two watchers: `Watcher.jsx` in the page (live; asks `/api/submit?dry=1`, which validates and writes nothing), and `watch.mjs`, run by the Claude Code hook in `.claude/settings.json` after every edit. Student instructions for agents are at the top of `AGENTS.md`.
- **Extras / Airtable.** `extras` (long text) is accepted by `lib/custom-chatbot/schema.ts`. Until `AIRTABLE_EXTRAS_FIELD` (the new field's name or ID) is set in `.env.local`, extras are appended to Notes.
- **`/bot-materials`.** A reference page on the Gem's parts: instructions, packs, delivery modes, costume, Ensemble.
- **`readings/`** (repo root): the course PDFs and Markdown, and the AI papers, from `eng-298ai-context`.
- **Tests:** `pnpm test` passes except `every experiment names a route` (`get-ready`), which already failed in the baseline commit.
- **Limits:** meaning-based search in the knowledge panel works only on the Gem's 15 pre-embedded words (no embedding key on the server); free-text keyword search works. GPT-2 with the HHH prompt is small: it changes form, not competence.

# Earlier handoff (Codex)

Updated: 20 October 2026

## Current direction

The main page is a short teaching sequence. ELIZA and GPT-2 are the two main historical demonstrations. A brief explanation of assistant training leads to custom GPTs in 2023. The working chatbot builder belongs at that point in the timeline. Reasoning models and tools follow it.

The first integration preserved the source repository closely, but it also preserved its very long essay and added the studio below the entire timeline. That did not meet the intended teaching structure. It made the builder feel like a separate application. The revisions prioritize the order of activities, short explanations, and a single builder.

## What is on the page

1. **ELIZA, 1966:** a short explanation and the working rule-based chat. Students can inspect the rule behind a reply.
2. **GPT-2, 2019:** a brief Markov comparison, a recorded sample, and an optional browser model download. Students compare continuations from different prompts.
3. **Training an assistant, 2021–2022:** examples, preference feedback, and the ChatGPT interface in one short section.
4. **Custom GPTs, 2023:** historical context followed immediately by the working Poetry Gem builder.
5. **Reasoning models, 2024:** intermediate steps, summaries, and the need to check the result.
6. **Tools and agents, 2025–2026:** tools, memory, the harness, and the class Ensemble.

The timeline body went from approximately 13,800 words to approximately 530. This count excludes interface labels, panel data, and source texts. The layout also dropped its nearly full-screen minimum height for every step.

## The consolidated builder

`Build a bot` is the single navigation entry. It points to `/#build-a-bot`. The studio is rendered directly as React components in the timeline: no iframe, separate document, or cream-colored enclosing frame. Its controls use the timeline palette. Settings remain in normal page flow; the conversation has its own scrollable message area.

The builder retains poetry forms, reading packs, material size, all four delivery modes, the costume controls, token estimates, and inspection of model input. “Edit instructions” changes the prompt used in the next chat request. It also supplies the initial instructions for submission.

“Save or submit this bot” opens the Ensemble form in the same section. It collects the bot name, student name, optional icon, editable instructions, short knowledge, and notes about triggers and extra instructions. It can download a JSON copy or submit through `/api/submit`.

The form takes a snapshot when opened. “Use current studio settings” explicitly replaces that snapshot and the exported instructions/knowledge. Edits in the submission form affect the submitted version; they do not silently modify the studio test.

The Ensemble receives a short voice note, not a whole book. Full-text and retrieval settings are recorded in Studio settings, but the current Ensemble does not reproduce the studio's retrieval. Its default model may also differ. This is a material difference to explain in class.

`/my-custom-chatbot` redirects to the timeline builder. Its duplicate interface has been removed. `/poetry-gem` remains a full-page view of the same studio, including submission. “Experiments” has been removed from the main navigation and timeline footer. Experiment routes remain available through relevant teaching links. “History” is now labeled “Interfaces”; its `/history` address is preserved.

## Editorial decisions and their costs

| Material | Change | Reason and consequence |
| --- | --- | --- |
| Repeated questions about who speaks, masks, characters, and performance | Removed from the main sequence | These repeated the argument without adding a new action for students. The page now has less interpretive direction. Discussion can supply it. |
| Plato, Wilde, Frankenstein, Čapek, Bergson, and Turing as opening chapters | Hidden from the timeline | They delayed the first working demonstration. This loses a substantial humanities frame, so a short reading-based introduction may be worth restoring later. |
| ELIZA interpretation | Reduced to the rule, the reply, and the reader's response | Kept the connection between mechanism and interpretation. Cut the extended theoretical explanation. |
| Markov and Shannon history | Reduced to a brief Markov explanation within GPT-2 | Kept a useful contrast in how text is generated. Lost the longer history of probability and information theory. |
| Assistant prompting, post-training, and ChatGPT | Combined | Gives enough context to reach the builder. It risks making distinct interventions seem too similar. A small comparison is the strongest technical addition to restore. |
| Sydney | Hidden | It is a lengthy case study that can pull attention toward sensational behavior. It remains useful for a focused discussion of prompting and conversation length. |
| Product catalogs and repeated dates | Cut back | Avoids a long sequence of similar screenshots and names. The Interfaces gallery retains this material for optional use. |
| Soliloquy and staged interiority | Replaced by a short reasoning-model section | Explains observable behavior without suggesting that displayed reasoning establishes an inner self. The literary comparison remains available for discussion. |
| Long epilogue | Hidden | Avoids another recap after the activities. A short classroom question could replace it if the page needs a clearer ending. |

The writing follows useful ASD-STE100 principles: short sentences, clear actions, consistent terms, and literal headings. It is not certified STE. Literary quotations, source readings, and genre prompt templates were not rewritten into technical prose.

## Best additions to restore, in priority order

1. **A compact base-model / prompted-model / trained-assistant comparison.** Use `/by-hand` and the original Askell discussion. This directly addresses the biggest conceptual loss from the cuts. An expandable example would avoid another mandatory screen.
2. **One Markov interaction.** Let students change the sequence length and compare output before GPT-2. `/markov` already exists. Keep the explanation short.
3. **One humanities question beside ELIZA.** A brief passage from Weizenbaum or a course reading could ask how a reader interprets a rule-generated reply. Avoid rebuilding the long prehistory before the demo.
4. **A retrieval comparison inside the builder.** Ask students to send the same message using the full text, keyword search, and semantic search. The controls and inspection trace already exist; this mainly needs a concise activity prompt.
5. **A short tool-loop demonstration after 2023.** Link or adapt `/mini-claw` so students can identify the request, tool result, and next model turn. This makes “harness” concrete.
6. **An optional Sydney case or interface comparison.** Use a sourced example and a specific question about the interface. Keep it outside the main path unless the class discussion requires it.

The strongest material to keep prominent is the inspectable mechanism: ELIZA's rule, GPT-2's continuation, the builder's actual model input, and the agent's tool result. These give students evidence for their interpretations.

## Files and restoration

- `nextjs/content/story/`: timeline text. Seven older chapters remain with `hidden: true`.
- `nextjs/app/story/story.mjs`: omits hidden chapters and builds compact chapter indexes.
- `nextjs/app/story/page.jsx`: inserts the builder at the end of the 2023 chapter.
- `nextjs/app/story/story.css`: compact layout with demos beside their explanations.
- `nextjs/app/components/BuildABot.jsx`: timeline introduction and shared studio.
- `nextjs/app/poetry-gem/Studio.tsx`: configuration, testing, and input inspection.
- `nextjs/app/poetry-gem/EnsembleSubmission.tsx`: in-page submission and JSON export.
- `nextjs/lib/custom-chatbot/schema.ts`: submission validation, including all studio settings.
- `integration/`: source manifests, documented exceptions, and verification scripts.

Removing `hidden: true` restores an omitted chapter, but review its length and placement first. Active chapters were shortened in place. Their full original versions remain in the untouched source repository, `/Users/madeleinewoods/Development/mk-chatbot-experiments`, at the commit recorded in `integration/foundation-manifest.json`. The current working tree has no initial commit, so do not assume Git history here contains the earlier draft.

## Verification and remaining work

The earlier live Airtable smoke tests, run by Madeleine in Terminal, confirmed creation, same-slug update, read-back, and deletion for both supplied Airtable credentials. The student OpenRouter key authenticated successfully. These checks did not test a paid model response.

The production build and TypeScript check passed after consolidation. Four inherited filesystem-tracing warnings remain in `lib/bots.mjs`.

All 12 checks in the integration suite passed. The suite checks the consolidated submission payload and inactive default with a mocked Airtable service, custom instructions across all four chat delivery modes, prompt limits, retrieval, and inspection traces. Timeline tests check chapter references, demo presence, and chronology.

This session cannot open a local server port or reach the user's localhost, and it has no connected browser. Live visual and end-to-end form verification remain necessary. Check desktop and phone widths, submit an inactive disposable bot, confirm the saved settings, then remove that test record. Test a model response with a configured key. Credentials stay in ignored environment files and must not enter this handoff.

Before expanding the page, get a classroom-paced review of the current sequence. Add material where students cannot explain a mechanism or complete an activity. Avoid restoring chapters merely because their source material is interesting.
