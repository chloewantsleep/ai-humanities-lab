---
title: "Proposal: a second activity in Claude Code"
description: "A proposal, not part of today's plan: open a starter folder in Claude Desktop's Code tab and ask Claude to build your bot a page of its own."
eyebrow: "Build a chatbot in Claude Desktop"
updated: "2026-10-20"
order: 4
---

# Proposal: a second activity in Claude Code

> **A proposal for the instructors, not part of today's plan.** Nothing here has been tried with students. The steps for the Code tab were checked against Anthropic's [desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart) on 2026-10-20.

Claude Desktop has a **Code** tab: Claude Code with a graphical interface, working on the files in a folder on your computer. It needs a paid plan (Pro, Max, Team, or Enterprise). On a free account, clicking Code asks you to upgrade. That alone may decide whether this activity can run in class.

## The idea

The Project you built today is a chatbot made of two things: instructions and files. The Code tab can make the same bot into something you can see the parts of: a folder with the instructions in one file, the knowledge in another, and a web page that puts them together. It's the same step this site takes in [/layers](/layers) and [/retrieval](/retrieval), done by the student.

## Steps (as proposed)

1. Download a starter folder (to make: a `README.md` explaining the task, an empty `persona.md`, and a `knowledge/` folder with one course text).
2. In Claude Desktop, click the **Code** tab at the top center.
3. Under the prompt box, choose the **Local** environment, then **Open folder…**, and pick the starter folder.
4. Leave the permission mode on **Manual**, so that Claude shows each change and waits for you to accept it.
5. Paste your project's instructions into `persona.md`, then ask: *"Read README.md and persona.md. Build a single web page where I can talk to this character. Start without any AI model: write rules, like ELIZA's, that answer in the character's voice and quote from the file in knowledge/."*
6. Open the page, talk to it, and run the [test sheet](test-sheet.md) on it. Compare it with your Claude Project.

## Why start without a model

A rule-based page needs no API key and no account beyond the Code tab, and it makes the comparison with [ELIZA](/eliza) concrete: every reply can be traced to a rule the student can read. A second step could connect the page to a model through the workshop keys (verify that keys can be handed out first), which brings the voice and knowledge question back with the model in the loop.

## Open questions

- Which plan do the students' accounts have? Without a paid plan, there's no Code tab.
- Who makes the starter folder, and where do students download it from?
- Is there time for this today, or is it next week's activity, before the October 27 presentations?
