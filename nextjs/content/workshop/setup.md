---
title: "Setup: Claude Desktop and your tools"
description: "Six steps to get going today: Claude Desktop, a package manager, Git and Node, an ai folder, today's repo, and your key."
order: 1
---

Do these in order. Steps 1 to 4 take about fifteen minutes, mostly waiting for downloads. If you're ahead, help the person next to you; if you're stuck, raise a hand and keep going with ELIZA ([/eliza](/eliza)) or the Markov chain ([/markov](/markov)) while you wait: they need nothing installed.

You'll type a few commands. On a Mac they go in **Terminal** (press ⌘-Space, type "Terminal", press Return). On Windows they go in **PowerShell** (press the Windows key, type "PowerShell", press Enter). Paste a command, press Return, and wait until the prompt comes back before the next one.

## 1. Install Claude Desktop

Download it from [claude.com/download](https://claude.com/download), install it, and sign in. Claude Code lives inside it: click the **Code** tab at the top of the window. Claude Code needs a paid plan (Pro, Max, Team, or Enterprise) or a Harvard Claude license (to use one, type your HarvardKey email on the sign-in screen and choose **Sign in with SSO**). On a free plan you can still do the chat and Projects parts of today.

## 2. Install a package manager

A package manager installs developer tools with one command each.

**Mac: Homebrew.** Paste this in Terminal (from [brew.sh](https://brew.sh)):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It asks for your Mac password (nothing shows as you type; that's normal; your Mac account must be an administrator), then asks you to press Return to continue, and may install Apple's Command Line Tools first. **When it finishes, read the "Next steps" it prints**: on Apple Silicon Macs (M1 or later) you must paste the three lines it gives you there (they start with `echo` and `eval`) so the `brew` command works. Close Terminal, open a new one, and check:

```sh
brew --version
```

**Windows: winget.** It's already part of Windows 11 and up-to-date Windows 10 (as "App Installer"). Check in PowerShell:

```powershell
winget --version
```

If that fails, install or update **App Installer** from the Microsoft Store ([apps.microsoft.com/detail/9nblggh4nns1](https://apps.microsoft.com/detail/9nblggh4nns1)), then open a new PowerShell and try again.

## 3. Install Git, Node, and pnpm (and optionally ffmpeg)

- **Git** keeps track of versions of files and fetches today's repo. On Windows it also gives Claude Code the Bash shell it prefers (without it, Claude Code falls back to PowerShell).
- **Node** runs the course's web app (it needs version 22 or newer; the commands below get a newer one).
- **pnpm** installs the app's packages (the course uses pnpm, not npm).
- **ffmpeg** (optional) converts audio and video; some later experiments use it.

**Mac:**

```sh
brew install git node pnpm
brew install ffmpeg
```

**Windows** (one at a time; accept the prompts: type `Y` if it asks you to agree to source terms, and click Yes if Windows asks for permission):

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id pnpm.pnpm -e
winget install --id Gyan.FFmpeg -e
```

Then **close and reopen** Terminal or PowerShell, and check each one:

```sh
git --version
node --version
pnpm --version
```

Each should print a version number (Node's should start with v22 or higher). If one says "command not found" or "not recognized", reopen the window once more; if it still fails, ask.

Then **quit Claude Desktop completely and open it again** (on a Mac, ⌘-Q), so Claude Code sees the tools you just installed.

Today's repo is **public**, so cloning it needs no GitHub account or sign-in.

## 4. Make a folder called `ai` in your home folder

This is where today's work (and the rest of the course's) will live.

**Mac:**

```sh
mkdir -p ~/ai
```

**Windows:**

```powershell
mkdir $HOME\ai
```

Your home folder is the one with your user name: `/Users/<you>` on a Mac, `C:\Users\<you>` on Windows.

## 5. Open the folder in Claude Code and ask it to get today's repo

In Claude Desktop, click the **Code** tab. In the row under the prompt box, make sure the environment says **Local**, then click the folder control beside it, choose **Open folder…**, pick your `ai` folder, and type:

> Please clone today's course repo into this folder: **(link coming in class)**. Then tell me what's in it and how to run it.

When Claude asks permission to run a command, read what it wants to do, then allow it. When it's done, ask it to start the app and open the address it gives you (usually http://localhost:3000).

If you'd rather do it by hand, the steps are in [Run it locally](run-locally.md).

## 6. Get your key

The app calls AI models through OpenRouter, which needs a key. **Steps coming in class**: you'll claim your own key from a page we'll show you, and Claude Code will put it in the right file for you. Never paste a key into a chat or a shared document.

---

**Already set up?** Start with [today's path](/workshop), or build a bot without installing anything in a Claude Project: [Build a chatbot in Claude Desktop](claude-desktop/).
