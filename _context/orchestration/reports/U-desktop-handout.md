---
task: "U"
title: "The Claude Desktop handout: build and test a chatbot as a Claude project"
thread_id: "9062d5ca-0800-4010-a053-b247146368be"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 9062d5ca-0800-4010-a053-b247146368be"
status: "done; every page and download returns 200 on the live dev server; print styling not checked by eye"
updated: "2026-10-20"
---

# U. The Claude Desktop handout: report

## What I built

Five pages in `nextjs/content/workshop/claude-desktop/`, rendered at `/workshop/claude-desktop/...`:

- `README.md` → **/workshop/claude-desktop**, "Build a chatbot in Claude Desktop". It opens with a voice/knowledge table (instructions vs. files, with the caveat that the split is a working distinction to test, not a rule) and covers the account facts (free plans, five projects, context-window limits, memory). The steps: open the app (and what you might see: Code tab, Chat/Cowork options or the unified box); make a project (**+ New Project**; name and description aren't seen by Claude; the Cowork-style three-choice dialog; the new projects beta); write the voice (**Set project instructions** → **Save instructions**, with an instruction template); add knowledge (the **+** on the right side of the project page, file types, 30 MB, use .txt); talk to it (chats don't share context, and memory can be switched off per chat in the **+** menu). Then two "knowledge or voice?" experiments, an "Under the hood" section (in-context vs. RAG mode with the project knowledge search tool, linking `/retrieval`), sharing (Team/Enterprise only), and a dated list of sources. It links three glossary entries (projects, custom instructions, knowledge files).
- `persona-card.md` → **/workshop/claude-desktop/persona-card**: who it is, who it talks to, what it knows (files table, plus what to do when the files don't say), how it speaks (with Forster's flat/round as a prompt), what it won't do, "Are you an AI?", three exchanges written before building, and "after testing: what changed?". Blank space uses `&nbsp;` paragraphs so it prints with room to write.
- `test-sheet.md` → **/workshop/claude-desktop/test-sheet**: eight tests (your three exchanges; in character; from the files, checked against the file with Cmd-F; beyond the files; "Who are you, really?" / "Drop the act"; 15+ turns; a fresh chat with an unsettled detail; a classmate tries to break it), a record table, a "knowledge or voice? where does the fix belong" table, and an optional Grice lens (maxims checked against the course's Grice text, including "flouting").
- `texts.md` → **/workshop/claude-desktop/texts**: the six texts with translator, edition, Gutenberg number, course date, size, rough token count (words × 1.3, labeled as a rule of thumb), and .txt and .md download links. Advice on choosing: one text or two short ones; excerpting; Jowett's long introduction in *Phaedrus*; the 1818 *Frankenstein*'s per-volume chapter numbers; provenance.
- `claude-code-proposal.md` → **/workshop/claude-desktop/claude-code-proposal** (the optional item, labeled a proposal): open a starter folder in the Code tab and ask Claude to build the persona as a rule-based page with no model (an ELIZA for your character), then test it. It needs a paid plan, and the starter folder doesn't exist yet.

Twelve files in `nextjs/public/workshop/texts/`: the six Gutenberg Markdown files from `eng-298ai-context/_context/course-readings/course-readings-md/` (byte-identical, provenance frontmatter kept), each also as a `.txt` copy with the same content. Served at `/workshop/texts/<name>.txt` and `.md`.

## How to try it

- http://localhost:3000/workshop/claude-desktop, then the four pages listed under "The handouts".
- Print: http://localhost:3000/print/workshop/claude-desktop/persona-card and `/print/workshop/claude-desktop/test-sheet` (both pages link to their own print versions).
- Downloads: http://localhost:3000/workshop/texts/capek-rur.txt (etc.).

## Commits

- `cf006cf`: the five pages and the twelve text files.
- The commit that adds this report.

Both were committed by path, authored as mkuzmick (`29003991+mkuzmick@users.noreply.github.com`). Not pushed, and The Notebook's pointer was not bumped. Another agent's staged glossary files (`content/glossary/interfaces-and-agents/*`, `chatbots/character-ai.md`) were left out.

## What I verified, and where (all on 2026-10-20)

Anthropic help center (support.claude.com), each scraped live:

- [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects): projects on all plans including free; free accounts can make up to five; RAG ("up to 10x") only on paid plans; the **new projects beta** (rolling out from the Code tab to some Pro/Max users; a project becomes one conversation with parallel threads).
- [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects): sidebar **Projects** / claude.ai/projects; **+ New Project**; "Claude will not have access to" the name and description; Team/Enterprise visibility; project knowledge on the right side and the **+** button; **Set project instructions** → **Save instructions**; "Context is not shared across chats within a project unless... added into the project knowledge base"; memory on by default for Free/Pro/Max, each project has its own memory and also uses account memory, "Use account memory" toggle, per-chat **Memory** switch in the **+** menu before the first message; sharing only on Team/Enterprise.
- [Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude): document types PDF, DOCX, CSV, TXT, HTML, ODT, RTF, EPUB, JSON, XLSX (with code execution). **Markdown is not listed**, hence the .txt copies. Project files: 30 MB each, unlimited number but must fit in the context window, text extraction only.
- [RAG for projects](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects): automatic switch near the context limit on paid plans, the "project knowledge search tool", and a visual indicator.
- [Understanding Claude's personalization features](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features): project instructions. This page says "(paid plans only)" in one line and "available to all users" in another, contradicting itself and the other pages. The handout says so and marks it (verify).
- [Install Claude Desktop](https://support.claude.com/en/articles/10065433-install-claude-desktop): claude.ai/download; macOS 13+, Windows 10+; Free gets Chat only in the app, while Claude Code and Cowork need Pro and up.
- [Claude Cowork and chat are one Claude](https://support.claude.com/en/articles/16761823) and [Projects in Claude Cowork](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork): the unified experience is rolling out gradually to Pro/Max (if the message box still shows "Chat" and "Cowork", you don't have it), and Cowork projects offer three ways to start.
- [How large is the context window on paid plans?](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans): read, but I didn't put a number in the handout, because it varies by model and the free plan's isn't stated.

Claude Code docs: [Get started with the desktop app](https://code.claude.com/docs/en/desktop-quickstart): the Chat / Cowork / Code tabs, Code needs a paid plan, **Local** environment, **Open folder…**, and permission modes (used in the proposal page).

Project Gutenberg: each of the six ebook pages (#1636, #59112, #41445, #4352, #174, #887) says "Copyright: Public domain in the USA."

The app on this Mac: `/Applications/Claude.app` is version 2.42304.2. I read the version from its Info.plist only. I did not launch the app, sign in, open any project, or change any setting, so no UI label in the handout was checked against the app itself.

## What I couldn't do or didn't check

- **Checked on the live server, not by eye.** The dev server was down while I wrote, so I first rendered the five pages through the app's own `lib/content.mjs` (`getEntry`) and `react-markdown` with `remark-gfm` and `rehype-slug`, the same plugins as `Markdown.jsx`. All 34 internal links resolve (routes, the twelve download files, the `#5-talk-to-it` and `#under-the-hood-what-the-files-do` anchors). Once Marlon's server came up, all five pages, their four `/print/...` versions, two sample downloads, and the linked glossary entry returned 200. The headings render with the expected ids, and the folder lists the four pages under "The handouts". `.txt` files are served as `text/plain` and `.md` files as `text/markdown`, so a click shows the text in the browser rather than downloading it; the page tells students to right-click and save. **Not checked:** how the pages look in dark mode and in print, including the `&nbsp;` writing space.
- **Uploading .md to a project**: likely fine, but not on Anthropic's list, so it's marked (verify). The .txt copies avoid the question.
- **Whether project instructions exist on free accounts**: the help center contradicts itself. Worth one look on a free account before class.
- **What students' accounts are** (free, Pro, a Harvard license?) and what Martin's account has: not assumed. The handout covers free and paid.
- **Whether all six texts together fit in a project**: not tested. My estimate is that they don't fit without RAG (about 400,000 tokens together), so the handout says to start with one or two.
- **Exact current UI names** where accounts differ (unified box vs. Chat/Cowork, the projects beta): described from the help center, not seen.

## For other tasks

- **V (session path and QA):** your stop 6 links `/workshop/claude-desktop`, and it now exists. Its folder `order:` is 6 to match. I didn't touch `content/workshop/README.md`. Please QA the print pages (`/print/workshop/claude-desktop/persona-card`, `.../test-sheet`) in the classroom pass, and try one real upload of a `.txt` file into a project on a student-type account if anyone can.
- **Y (knowledge and voice):** the handout's two experiments ("voice without knowledge", "knowledge without voice") are the same 2×2 in Claude Desktop. You could link them, or they could link to you.
- **T (retrieval):** the handout sends students to `/retrieval` from "Under the hood", and `texts.md` cites the Phaedrus/Jowett example from your page.
- **R (cleanup) / the orchestrator:** `public/workshop/texts/` adds about 3.5 MB of public text (twelve files). Only Gutenberg texts, as the brief says.
- **L (glossary):** the glossary's `projects.md` could cite the help-center facts above (five free projects, 30 MB per file, RAG on paid plans), with the 2026-10-20 date.

## Marlon's words

From the prompt pasted into this thread: "U, the Claude Desktop handout: High … This is for today's class. Verify every Claude app step against Anthropic's official docs, and don't sign in to or change anything in Marlon's accounts. Commit by path only (rule 7). Write your report to the path in the brief, with your thread ID (rules 8 and 9)."

## Decisions and open questions

- **.txt as the recommended upload, .md kept as well:** the brief asked for the Markdown files, and the help center lists TXT but not MD. Both are served; the content is identical.
- **No context-window numbers on the student page**, only "start with one or two texts" and rough token counts per text.
- **The Gutenberg end lines** (for example, "End of Project Gutenberg's R.U.R. …" in `capek-rur`) were left as they are in the course copies, unedited.
- **The Code-tab activity is a proposal only.** It needs a paid plan and a starter folder that doesn't exist. Open: do students have paid accounts, and is this today or next week?
- **Open for Marlon:** do students know which account type they're on? If many are on free accounts, say aloud in class that the Code tab and the RAG switch won't appear for them.
