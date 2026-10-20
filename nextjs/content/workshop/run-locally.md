---
title: "Run this chatbot lab on your own computer"
description: "A draft guide for getting the lab running with help from Claude Code."
status: draft
---

> **Draft, October 20, 2026.** Marlon has not yet chosen the student repository. The current repository is private: ask for the class copy or access before trying to download it. These steps are written for students and have not been tested on a fresh student computer.

You will run a small website on your computer. Your browser opens it at http://localhost:3000. Keep the terminal running while you use it. Start with [ELIZA](/eliza): it works without an API key. A paid model needs your own OpenRouter key; a Claude subscription does not supply that key.

## 1. Get the class files

Ask the instructor for the student repository link. On its GitHub page, click **Code → Download ZIP**, unzip it, and move the folder somewhere you can find again, such as Documents. If the link says “404,” check that you are signed into the invited GitHub account; the current instructor repository is private.

**Ask Claude Code:** “Help me open the class chatbot repository on my computer. Ask me for the class repository link and the folder I downloaded. Read its AGENTS.md and nextjs/CLAUDE.md first. Use pnpm. Keep API keys out of our conversation.” In Claude Desktop, use Code if available and select the downloaded folder. If you do not have Code, ask the instructor for the supported setup; the terminal steps below still work.

## 2. Install Node.js and pnpm

Install **Node.js 22 or later (an LTS version)** from the [official Node.js download page](https://nodejs.org/en/download). Choose the installer for your operating system. Open a new Terminal on Mac or PowerShell on Windows, then check:

```sh
node --version
```

Install pnpm using its [official installation guide](https://pnpm.io/installation), choosing version **10.28.0**, the version this repository pins. That guide has separate Mac/Linux and Windows instructions; ask for help picking the correct one. Then open a new terminal and check:

```sh
pnpm --version
```

**Ask Claude Code:** “Check whether Node.js 22 or later and pnpm 10.28.0 are installed. Help me install missing tools using the official Node.js and pnpm instructions for my operating system. Explain any system permission request before making it. Use pnpm for this project.”

## 3. Install the project

Find the full path to the downloaded folder. Replace the example below with that path. Quotes matter if your folder name contains spaces. On Windows it may begin with `C:/Users/` rather than `/Users/`.

```sh
cd "/Users/YOUR-NAME/Documents/CLASS-FOLDER/nextjs"
```

```sh
pnpm install
```

Wait until the command finishes. Downloading the project's packages requires internet access.

**Ask Claude Code:** “Find the nextjs folder inside this downloaded repository. Show me its full path, change into it, and run pnpm install. Explain any installation error in plain language.”

## 4. Add your own key when you need a paid model

You can skip this step for ELIZA, Markov, the reading rooms, and the browser models. For Claude replies, ask the instructor how to claim your student key at [/keys](/keys). Copy it yourself into a file named **.env.local**, inside **nextjs**, using your text editor:

```dotenv
OPENROUTER_API_KEY=PASTE_YOUR_OWN_KEY_HERE
```

The text after the equals sign is your private key. Do not paste it into chat, screenshots, GitHub, or a document. The file must be `.env.local`, including the leading dot, with no `.txt` at the end. This repository ignores it in Git. You do not need a management key, Slack token, or the instructor's key. Claimed keys expire and have a limited workshop budget; ask the instructor if yours stops working.

If the instructor instead supplies the workshop-keys starter with a `/setup-key` page, follow that starter's instructions. This app's `/keys` page issues a key; it does not install it in your local `.env.local`. This app currently has no `/setup-key` route.

**Ask Claude Code:** “Help me create nextjs/.env.local with the name OPENROUTER_API_KEY and a placeholder. I will enter the key myself. Do not read or print the file after I enter it, and do not commit it.”

## 5. Start the website

From the same **nextjs** folder:

```sh
pnpm dev
```

Open http://localhost:3000 in your browser. If the terminal gives a different port, open the address it shows. Try [/eliza](/eliza) first; then [/chat-demo](/chat-demo) if you added a key. Send one short message to check the key; model calls spend its credit. Keep the terminal open. Press **Control+C** in that terminal to stop the website. After changing `.env.local`, stop and restart it.

**Ask Claude Code:** “Check whether this project already has a dev server running. If not, show me the command to run it from the full path to nextjs. Help me open the local address and try ELIZA, then one short paid reply if my key is configured. Do not run a production build in a shared working folder.”

## The three most likely snags

1. **“Command not found” or “package.json not found.”** Open a new terminal after installing the tools, check `node --version` and `pnpm --version`, and make sure you are inside **nextjs**, not the folder above it. Ask Claude Code to check your folder and versions.
2. **The site opens but Claude does not answer.** Check the filename and location of `.env.local`, restart the server, and ask the instructor whether your key expired or the class budget is used up. Share the error text, with keys removed. A browser login asking for username `class` is a separate class password, supplied by the instructor.
3. **The page is blank, busy, or the model seems stuck.** Check the terminal's address and port. The first GPT-2 or SmolLM2 run downloads model files from Hugging Face and runtime files from jsDelivr; it needs internet access and may take time. Try the page's recorded example where offered. If ELIZA works but a browser model fails, tell Claude Code the browser name and the error text.

To come back tomorrow, open a terminal, change into the same **nextjs** folder using its full path, and run `pnpm dev` again. You usually do not need to reinstall packages.
