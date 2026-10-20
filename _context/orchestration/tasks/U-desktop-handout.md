---
task: "U"
title: "The Claude Desktop handout: build and test a chatbot as a Claude project"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/content/workshop/claude-desktop/` (new folder), `nextjs/public/workshop/texts/` (new folder)"
depends_on: "start now"
report: "../reports/U-desktop-handout.md"
---
# U. The Claude Desktop handout

**Why.** Marlon, for today's class: students are using the **Claude Desktop app for the first time**, so some of the session must happen in Desktop itself, not only on this site. The syllabus promises that students will "prompt their own custom chatbot personas." The familiar pattern is the first-generation custom GPT: instructions plus uploaded knowledge files. In Claude that pattern is a **Project** (custom instructions plus project knowledge). Read the planning note first: `/Users/mk/Development/mk-27/apps/the-notebook/_context/projects/50-in-focus/humanities-ai-lab/20261020-workshop-planning.md` (the "Claude Desktop" and "Knowledge, style, and form" sections).

**What to make** (Markdown pages in `nextjs/content/workshop/claude-desktop/`, which the site renders at `/workshop/claude-desktop/...`; `/print/...` gives a printable copy):

1. `README.md`: **Build a chatbot in Claude Desktop.** Step by step, for someone who has never opened the app: make a Project, write its instructions (the persona), add knowledge files (the corpus), start a chat in it. Keep **knowledge** (what the bot can look up) and **voice** (how it speaks: the instructions) visibly separate, since Marlon wants to play up that distinction, without claiming that files affect only content or instructions only style.
2. `persona-card.md`: a one-page template for designing a bot: who it is, who it talks to, what it knows (which files), what it won't do, three sample exchanges written by the student before building.
3. `test-sheet.md`: **Test your chatbot.** "Build and test" are both in the top line. A short protocol students run and record: in-character questions; a question the files answer, then check the answer against the file; a question the files *don't* answer (does it say so, or make something up?); "Who are you, really?"; a long conversation to see if the voice holds; a classmate tries to break it. A table to fill in.
4. `texts.md` plus the files in `nextjs/public/workshop/texts/`: downloadable public-domain course texts ready to upload as knowledge. Copy the Project Gutenberg Markdown files from `/Users/mk/Development/mk-27/apps/the-notebook/apps/eng-298ai-context/_context/course-readings/course-readings-md/` (Phaedrus, R.U.R., Frankenstein 1818, Bergson's *Laughter*, *Dorian Gray*, *Intentions*; the same six `scripts/build-retrieval-index.mjs` uses). **Only those Gutenberg texts**: nothing in-copyright, since `public/` is served openly. Keep each file's provenance frontmatter.
5. A short section (in `README.md` or its own page) linking the site's `/retrieval` page as the way to see what "knowledge files" do under the hood.

**Facts.** Claude's apps change often. Check every UI step and feature limit (Projects, project knowledge, file types and sizes, which plans have Projects, what the Desktop app calls things today) against Anthropic's official help center and docs, and date the page ("checked 2026-10-20"). Mark anything you couldn't verify "(verify)". Don't assume students' plan type or Martin's account features. If you can, look at the app itself on this Mac, but don't sign in to anything, create projects in Marlon's account, or change settings.

**Optional, if time:** a page proposing a second activity in Desktop's Claude Code (open a starter folder and ask it to build a chat page). Label it a proposal.

**Done looks like:** the pages render at `/workshop/claude-desktop` and print cleanly at `/print/workshop/claude-desktop/...`; the text downloads work; the report lists what you verified and where.

Don't touch `nextjs/content/workshop/README.md` (task V owns it) or any route.

## When you finish

Write [`../reports/U-desktop-handout.md`](../reports/U-desktop-handout.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
