---
title: "Layout and visual review: the site at classroom sizes"
date: 2026-10-20
lens: "visual layout and usability at classroom sizes (projector 1440×900, laptops 1280×800 and 1024×768, phone 390×844), forced-dark theme, navigation, overflow, consistency of the ExperimentPage frame, console errors"
written_by: "Claude subagent of orchestrator 9b639a81-e358-4142-9f22-26dc755aec5f"
looked_at: "2026-10-20, 07:59–08:09 (two full passes: 07:59–08:03 and 08:04–08:08; the header gained 'Today' at 08:02, commit ec5e9ed, so the second pass is the one reported)"
---

# Layout and visual review, October 20

Headless Chrome for Testing (Playwright), against Marlon's dev server at http://localhost:3000, `waitUntil: "load"`. 22 routes × 4 viewports. Requests to Hugging Face, OpenRouter and `/api/chat` were blocked; **none were attempted on load**, so no page auto-downloads a model. Nothing was clicked except Markov's Step button (25 times). Screenshots are in `/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/9b639a81-e358-4142-9f22-26dc755aec5f/scratchpad/layout-review/shots/` (`<route>-<width>.png` is above the fold, `-full.png` the whole page at 1440 and 390); call that folder `SHOTS/` below.

**Across the site:** every route returned 200; **zero console errors or warnings** on any page at any size; no horizontal scroll anywhere except `/by-hand`. The forced-dark theme is consistent (body `#121412`, text `#ECECE6`); no text measured below 4.5:1 contrast. Body prose is 17px (16px on the phone), which is fine on a laptop but small from the back of a room: helper text, captions, chips and kickers are 11–13px gray, unreadable when projected at 100%. The header now has Home (the wordmark) and **Today → /workshop** on every page; on the phone it wraps to two lines with "Glossary" alone on the second (117px tall, not sticky, acceptable). The Next dev indicator ("N" bubble, bottom left) sits over content on every page and on the phone covers text and checkboxes (`SHOTS/retrieval-390-full.png`, `SHOTS/spiral-390-full.png`).

## Page by page

**`/` (home): fix before class.** No link to today's path anywhere in the body; above the fold at 1440 is only the 124px hero and the intro, and the 13 cards start below it (`SHOTS/home-1440.png`, `SHOTS/home-1440-full.png`). A student told "go to the site" lands here and must find "Today" in the header. The cards are clean and consistent at all sizes; card kicker text (`01 · /spiral`, status pills) is 11px. The intro says "These are Marlon's working prototypes … not the course repo", which is fine.

**`/workshop` (today's path): fine; small fixes later.** Readable column, clear "Try / Notice" stops (`SHOTS/workshop-1440-full.png`). At 1024 the first stop is below the fold behind the title, subtitle, repo line and the draft call-out (`SHOTS/workshop-1024.png`). The kicker says "Folder · 4 documents" but only one card is listed, and a stray dot sits left of that card (`SHOTS/workshop-1440-bottom.png`). The "Draft: proposed path … if a page says 'Not built yet', skip" call-out reads as unfinished on a projector.

**`/workshop/claude-desktop` and `/test-sheet`: fine.** Breadcrumbs work back to Home and Today's path (`SHOTS/workshop_claude-desktop-1440.png`). Long (6,900px at 1440, ~10,000px on the phone) but well structured.

**`/eliza`: fine.** The cleanest experiment page; the conversation is monospace at 16px (`SHOTS/eliza-1440-full.png`, `SHOTS/eliza-390.png`). On the phone the input placeholder is clipped ("Tell ELIZA what's on your").

**`/markov`: fine.** After stepping, the output is 17px with copied/long-run highlights legible (`SHOTS/markov-1440-stepped.png`); the legend line is 13px. Unlike most experiment pages it has no intro paragraph under the subtitle. Browser tab title is lowercase "markov".

**`/spiral`: fine.** Download is a deliberate button with the size stated and a "Watch recorded runs" fallback; the side panel (meter, sliders, odds) stacks well on the phone (`SHOTS/spiral-1440-full.png`, `SHOTS/spiral-390-full.png`). Tab title "spiral".

**`/by-hand`: fix before class (step 3 of today's path, full attention).** Column 2 overflows its card and runs underneath column 3 at 1440 and 1280 (`SHOTS1/by-hand-1440-full.png`, see note below): the preamble select, "Use at most" select, explanatory text and the "Ask column 2" panel spill about 200px right of the card. At 1024 the page scrolls sideways (1041px) and on the phone badly (539px wide on a 390 screen) (`SHOTS/by-hand-1024.png`, `SHOTS/by-hand-390.png`). Measured cause: `.bh-col` is `display: grid` with an implicit `auto` track, so its single track grows to the select's min-content width (504px) although the outer grid uses `minmax(0, 1fr)`. Also: the column body text is 13px and the editable preamble textarea 12px, too small to project. Tab title "by-hand".

**`/retrieval`: fine.** Two-panel layout holds at every size; stacks cleanly on the phone (`SHOTS/retrieval-1440-full.png`, `SHOTS/retrieval-390-full.png`). The "Search by" select truncates on the phone.

**`/layers`: later.** Works at all sizes (`SHOTS/layers-1440-full.png`, `SHOTS/layers-1024.png`). Dense: controls text 14px, the product screenshots are thumbnails too small to read when projected (click opens full size), "04 / What went in?" starts lower than "03 / Send" beside it, and the empty chat box is ~350px of blank panel.

**`/tics`: later.** No overflow. Visually the odd one out: its text areas use a blue-violet panel color not used elsewhere, the six rule cards have 11px descriptions, and the "Three separate layers" prose runs the full 1324px width (lines of ~150 characters) where other pages cap prose near 860px (`SHOTS/tics-1440-full.png`). The copy says "The canvas's separate Opus reflections", which is internal shorthand a student won't follow.

**`/glossary`: fine.** Sidebar plus prose, readable (`SHOTS/glossary-1440.png`); on the phone the sidebar stacks above.

**`/history`: fix before class if it will be pointed at.** The index has no pictures: it opens with five paragraphs of process notes ("A separate agent reported capturing … Task J inspected all 43 PNGs … the alleged ELIZA code page is an archival cover sheet") and then a list of ten section titles (`SHOTS/history-1440-full.png`). For a student this reads as an internal audit, not a history of chat interfaces.

**`/readings`: later.** Kicker says "Folder · 0 documents" and the page ends "Nothing here yet." directly under seven readings (`SHOTS/readings-1440-full.png`); it opens with "Bibliographic check: 19 Oct 2026, task J".

**`/story`: fine (for later reading).** Big type, chapter grid, 18px body (`SHOTS/story-1440.png`); 80,000px tall.

**`/experiments`: fine.** Folder index of the 13 documents.

**Prototypes (`/rosie-roomba`, `/reading-rooms`, `/knowledge-voice`, `/mini-claw`, `/fine-tune`, `/persona-dial`): fine as works in progress.** All load clean at every size. Rosie and Roomba's right panel is a "?" until stepped, by design (`SHOTS/rosie-roomba-1440.png`). Mini-claw's radio label wraps under the radio (`SHOTS/mini-claw-1440.png`). `/persona-dial` is a "Not built yet" panel listed on the home page as card 03, between two working experiments.

**The shared frame:** all experiment pages share the kicker, status pill, 72px title and gray subtitle, and the collapsed "About this experiment" at the bottom, so they read as one set. Differences: some pages add an intro paragraph (spiral, by-hand, retrieval, knowledge-voice) and some don't (eliza, markov, mini-claw); lab widths vary (ELIZA and mini-claw stop at ~1240px, others run to 1382px); "About this experiment" is a fixed ~860px box under full-width labs. Tab titles come from each route's `metadata` and six are slugs: "markov", "spiral", "by-hand", "persona-dial", "fine-tune", "rosie and roomba".

## Prioritized fixes

1. **`/by-hand` column overflow** (task D): in `nextjs/app/by-hand/by-hand.css`, give `.bh-col` `grid-template-columns: minmax(0, 1fr);` and make its selects `width: 100%; max-width: 100%;` (line 25; the 700px query on line 55 should also be `minmax(0, 1fr)`). Recheck at 1440, 1024, 390. This also matters if Marlon zooms the projector to 125–150%, which puts a 1440 screen at 960–1150 CSS pixels.
2. **Home → today's path** (task V, or R; `nextjs/app/page.jsx`): a prominent "Today, October 20: build and test a chatbot →" link to `/workshop` above the hero or directly under the kicker, visible above the fold at 1024.
3. **Project at 125–150% browser zoom**, and raise the floor for projected text (shared, `nextjs/app/globals.css`; keep it small): the 11–13px gray helper/kicker/caption sizes are what the back of the room can't read. If no CSS change happens before 12:45, Cmd-plus on the projector is the workaround, and only after fix 1.
4. **`/history` index** (task J or K, `nextjs/content/history/README.md`): lead with one or two screenshots and a one-line framing; move the provenance and correction notes into the fact-check page.
5. **Hide the Next dev indicator for class** (shared, `nextjs/next.config.mjs`: `devIndicators: false`). It overlays text on every page and on phones. Mention in the report, since it touches a shared file.
6. **Tab titles** (each route's `page.jsx` `metadata`; tasks S, C, D, E, I, W): use the document titles ("Markov chain", "The spiral room", "Building the assistant by hand", …) instead of slugs; the tab bar is visible when projecting.
7. **`/workshop` small things** (task V, `nextjs/content/workshop/README.md`, and the folder card in `nextjs/app/[...slug]/page.jsx`): the "4 documents" count versus one listed card, the stray dot, and the "Draft" call-out, which could go once the order is settled.
8. **Later:** `/readings` "0 documents / Nothing here yet" under a full list (the folder index in `nextjs/app/[...slug]/page.jsx` counts child files, not the README's entries); `/tics` prose width, panel color and "the canvas's Opus reflections" (task Z, `nextjs/app/tics/`); `/layers` thumbnails and the misaligned 03/04 cards (task G, `nextjs/app/layers/`); the persona-dial "idea" card's position among working ones on the home page (`nextjs/app/page.jsx`); one intro-paragraph convention for every experiment page (`nextjs/app/components/ExperimentPage.jsx`).

Note: the first pass (before the header change) is in `/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/9b639a81-e358-4142-9f22-26dc755aec5f/scratchpad/layout-review/shots1/`; `SHOTS1/by-hand-1440-full.png` there shows the column-2 overlap most clearly, and `SHOTS/by-hand-1440-full.png` in the second pass shows the same. The driver is `/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/9b639a81-e358-4142-9f22-26dc755aec5f/scratchpad/layout-review/driver.mjs` and the raw metrics are `results-1792498067572.json` beside it, so the pass can be rerun after fixes.
