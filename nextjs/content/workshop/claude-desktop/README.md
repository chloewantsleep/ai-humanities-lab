---
title: "Build a chatbot in Claude Desktop"
description: "Make a Claude Project, give it a voice (instructions) and knowledge (files), then test it. Steps checked against Anthropic's help center on 2026-10-20."
eyebrow: "Workshop"
updated: "2026-10-20"
order: 6
list_heading: "The handouts"
---

# Build a chatbot in Claude Desktop

> **Checked 2026-10-20** against Anthropic's help center (sources at the bottom). Claude's apps change often, and Anthropic rolls changes out to different accounts at different times, so your screen may not match this page exactly. If a button has a different name, look for the nearest match, and tell us what you saw.

In 2023 the familiar way to make a custom chatbot was a custom GPT: you wrote it some **instructions** and uploaded some **knowledge files**. In Claude the same pattern is a **Project**. A project has its own instructions, its own files (its "project knowledge"), and its own chats. Today you'll build one as a character, and then test it.

Keep two things apart as you build:

| | **Voice** | **Knowledge** |
|---|---|---|
| Where it goes | The project's **instructions** | The project's **files** |
| What it's for | Who the bot is, how it speaks, what it won't do | What the bot can look things up in |
| Ask yourself | Does it *sound* like the character? | Is what it says *in the files*? |

The split is a working distinction to test, not a rule. A file of Wilde's prose can pull the bot toward Wilde's manner, and an instruction can slip facts in. Part of today's job is finding where the two blur.

In the glossary: [projects](/glossary/interfaces-and-agents/projects), [custom instructions](/glossary/interfaces-and-agents/custom-instructions), [knowledge files](/glossary/interfaces-and-agents/knowledge-files).

You'll need: the [persona card](persona-card.md) (design the bot first), one or two [course texts](texts.md) (the knowledge), and the [test sheet](test-sheet.md) (to record what happens).

## Before you start: your account

- **Projects are on every plan, including free accounts.** Anthropic's help center says free accounts can make up to five projects. (One of its pages also calls project instructions a paid-plan feature; the pages disagree, so if you can't find "Set project instructions", tell us. *(verify)*)
- **How much you can upload depends on your plan.** On a free plan, everything in a project's knowledge has to fit within what the model can read at once (its context window). On paid plans (Pro, Max, Team, Enterprise), Claude switches to searching the files automatically when they get large (more under [Under the hood](#under-the-hood-what-the-files-do)). **Start with one or two texts.** *Frankenstein* or *Dorian Gray* alone is roughly 100,000 tokens.
- **Your account may remember things about you.** Claude's memory is on by default for Free, Pro, and Max accounts, and a project can use your account memory alongside its own. For a clean test, see step 5.

## 1. Open Claude Desktop

If it isn't installed: download it from [claude.ai/download](https://claude.ai/download), open the file, launch **Claude** from Applications (Mac) or the Start menu (Windows), and sign in. It needs macOS 13 (Ventura) or later, or Windows 10 or later.

**What you might see.** The app has a **Code** tab for Claude Code (paid plans only). Under the message box, your account shows either **Chat** and **Cowork** options or a single message box with no mode to choose: Anthropic is merging the two into "one Claude", and it reaches different accounts at different times. Either way works today. If you see Chat and Cowork, use **Chat**.

## 2. Make a project

1. In the left sidebar, click **Projects**. (On the web the same page is [claude.ai/projects](https://claude.ai/projects).)
2. Click **+ New Project**.
3. Give it a **name** and a **description**. Claude doesn't see either of these: they're labels for you. The bot's character goes in the instructions, in step 3.
4. On a Team or Enterprise account you'll be asked about visibility. Keep it **private**.

If instead you're offered three choices (**Start from scratch**, **Import from project**, **Use an existing folder**), you're making a Cowork-style project. Choose **Start from scratch**: it has the same instructions and files.

Some Pro and Max accounts have a new beta version of projects, starting in the Code tab, where a project works as a single conversation. If your Projects page looks nothing like these steps, ask us. *(verify on the day)*

## 3. Write the voice: the instructions

1. On the project's page, click **Set project instructions**.
2. Write the bot's instructions, then click **Save instructions**.

The instructions apply to every chat in the project. Write them from your [persona card](persona-card.md). A shape that works:

```text
You are [name], [one line: who they are and where they come from].
You are talking with [who the user is, and why they've come to you].

How you speak: [register, sentence length, vocabulary, habits, things you never say].

What you know: the files in this project are [which texts]. When you answer from them,
[quote them / name the chapter / stay close to their words]. When the files don't say,
[say so in character / admit it plainly].

What you won't do: [limits].

If someone asks whether you are an AI: [what you do].
```

Write it in your own words. Keep it short to start: you can always add a line after testing.

## 4. Add the knowledge: the files

1. The project's knowledge is on the **right side** of the project's page. Click the **+** button there.
2. Upload one or two texts from the [course texts page](texts.md). Use the **.txt** versions: TXT is on the help center's list of document types, and Markdown isn't. *(.md probably works too; verify)*
3. Claude processes the files and uses them in every chat in this project.

The help center lists these document types: PDF, DOCX, CSV, TXT, HTML, ODT, RTF, EPUB, JSON (and XLSX if code execution is on). Project files can be up to 30 MB each. You can add any number of files, but on a free plan they must fit together in the context window. Name files clearly: the help center notes that descriptive filenames help Claude find the right one.

## 5. Talk to it

Start a chat from the project's page. A chat started there uses the project's instructions and files. Chats inside a project don't share what was said in them. Only the instructions and the files carry over from one chat to the next, so a new chat is a fresh start.

**For a clean test**, turn memory off for that chat: open the **+** menu in the message box and turn off **Memory** *before you send your first message*. The help center says a project chat started that way neither uses nor adds to memory. This is a switch for one chat, not an account setting.

Then run the [test sheet](test-sheet.md). Start with your own three sample exchanges from the persona card: did it say anything like what you wrote?

## Two quick experiments: knowledge or voice?

Try these if you finish early. They make the split concrete.

1. **Voice without knowledge.** Remove the files (or make a second project with the same instructions and no files). Ask the same question that one of the files answers. What changes: the facts, the manner, or both?
2. **Knowledge without voice.** Keep the files, and replace the instructions with one plain line ("Answer questions about the files in this project."). Ask your in-character questions again. How much of the character came from the instructions, and how much from the text itself?

Write what you notice on the test sheet. It's the start of next week's presentation.

## Under the hood: what the files do

When a project's files are small enough, Claude reads all of them along with your question; nothing is searched. When the files approach the model's limit on a paid plan, the help center says Claude turns on **RAG mode** (retrieval-augmented generation): it uses a **project knowledge search tool** to find the most relevant passages instead of reading everything, and the project shows that it's in RAG mode. That's the first-generation custom GPT's method.

To watch a retrieval search work step by step, open **[/retrieval](/retrieval)** on this site. It splits the same six course texts into passages, scores every passage against your question, and shows exactly which passages get pasted into the prompt. It's a legible example of the technique, not Anthropic's own system, which uses its own models and hasn't been fully documented.

Then come back to your bot and ask: when it answered from the files, did it read the passage, or find it?

## Sharing your bot

Projects can be shared only on Team and Enterprise plans. On other accounts, show your bot from your own screen. To show the design itself, share its instructions and the names of its files: those two are the whole of what you built.

## Sources (checked 2026-10-20)

- [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects): free accounts and the five-project limit; RAG on paid plans; the new projects beta.
- [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects): **+ New Project**, name and description not seen by Claude, project knowledge and the **+** button, **Set project instructions**, memory in projects and the per-chat memory switch, sharing on Team and Enterprise.
- [Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude): document types; project files 30 MB each and must fit in the context window.
- [Retrieval augmented generation (RAG) for projects](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects): when RAG mode turns on, and the project knowledge search tool.
- [Understanding Claude's personalization features](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features): project instructions (and the "paid plans only" line that disagrees with the other pages).
- [Install Claude Desktop](https://support.claude.com/en/articles/10065433-install-claude-desktop): download, system requirements, and what each plan gets in the app.
- [Claude Cowork and chat are one Claude](https://support.claude.com/en/articles/16761823) and [Organize your tasks with projects in Claude Cowork](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork): the Chat and Cowork options, and the three ways to start a Cowork project.
- [Get started with the desktop app](https://code.claude.com/docs/en/desktop-quickstart) (Claude Code docs): the Chat, Cowork, and Code tabs.
