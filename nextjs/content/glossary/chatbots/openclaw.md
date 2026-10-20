---
term: "OpenClaw"
slug: openclaw
short: "An open-source personal agent that runs on your own machine and takes instructions through chat apps like WhatsApp and Telegram; started by Peter Steinberger in November 2025 as Clawd, renamed Moltbot and then, on 29 January 2026, OpenClaw."
aliases: [Clawd, Clawdbot, Moltbot]
category: chatbots
year: 2025
maker: "Peter Steinberger; now the OpenClaw Foundation"
status: active
screenshot: 21-openclaw-homepage.png
see_also: [hermes-agent, grok-bot, claude-code, agent, agent-loop, always-on-agent, skills, memory, computer-use, lethal-trifecta, prompt-injection, permissions]
readings: []
experiments: [mini-claw]
updated: 2026-10-19
---

# OpenClaw

**An open-source personal agent that runs on your own machine and takes instructions through chat apps like WhatsApp and Telegram; started by Peter Steinberger in November 2025 as Clawd, renamed Moltbot and then, on 29 January 2026, OpenClaw.**

![The OpenClaw home page: "The AI that really does things." Open source, runs on your machine](../../history/_images/21-openclaw-homepage.png)

## In plain terms

OpenClaw is not a chatbot you visit; it is a program you install on a laptop, a home server, or a rented VPS, which then sits in the chat apps you already use (WhatsApp, Telegram, Discord, Slack, Teams) and acts on what you send it. The home page promises it "organizes your inbox, sends emails, manages your calendar, checks you in for flights," keeps memory of your preferences and projects across conversations, and runs skills, including ones it writes itself. It can run shell commands and edit files: "Full access or sandboxed—your choice."

Steinberger's own account: "Two months ago, I hacked together a weekend project," a WhatsApp relay. The first name, Clawd, was a play on Claude with a claw, until "Anthropic's legal team politely asked us to reconsider." The community picked Moltbot, which "never quite rolled off the tongue," and on 29 January 2026 it became OpenClaw. The code is MIT-licensed and stewarded by the OpenClaw Foundation, which the site describes as an independent 501(c)(3).

## Where it fits

**Agency.** OpenClaw is the point where the chatbot leaves the vendor's website: the same agent loop as Claude Code, but always on, on your own machine, with your accounts and files, reachable by text message. That combination of private data, outside messages, and the power to act is what the "lethal trifecta" describes, which is why its security record drew attention: the project publishes [security advisories](https://github.com/openclaw/openclaw/security/advisories), and widely repeated counts of vulnerabilities and exposed installations have not been checked here (verify).

## Try it

[Mini-claw](/mini-claw) builds a small agent of this kind step by step: a loop, tools, memory, and skills.

## See also

[Hermes Agent](hermes-agent.md) · [Grok Bot](grok-bot.md) · [Claude Code](../interfaces-and-agents/claude-code.md) · [Agent](../interfaces-and-agents/agent.md) · [Agent loop](../interfaces-and-agents/agent-loop.md) · [Always-on agent](../interfaces-and-agents/always-on-agent.md) · [Skills](../interfaces-and-agents/skills.md) · [Memory](../interfaces-and-agents/memory.md) · [Lethal trifecta](../interfaces-and-agents/lethal-trifecta.md) · [Prompt injection](../interfaces-and-agents/prompt-injection.md) · [Permissions](../interfaces-and-agents/permissions.md)

## Sources

- Peter Steinberger, ["Introducing OpenClaw"](https://openclaw.ai/blog/introducing-openclaw), 29 January 2026: the weekend project, Clawd (November 2025), Anthropic's request, Moltbot, the OpenClaw name, the chat apps, "laptop, homelab, or VPS." Also confirmed in this repo's [fact-check ledger](../../history/fact-check.md).
- [openclaw.ai](https://openclaw.ai/), fetched 19 October 2026, and screenshot `21-openclaw-homepage.png`: the tagline, the inbox and flights line, memory and skills, full system access, MIT license, the OpenClaw Foundation as a 501(c)(3).
- GitHub API record for [openclaw/openclaw](https://github.com/openclaw/openclaw): repository created 24 November 2025, MIT license.
- The intermediate name "Clawdbot" (the bot's name before Moltbot, around 27 January 2026) is from secondary coverage such as [AlternativeTo](https://alternativeto.net/news/2026/1/trending-open-source-ai-agent-clawdbot-rebrands-to-moltbot-after-pressure-from-anthropic/), not the founder's post (verify).
