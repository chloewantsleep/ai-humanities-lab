---
title: "Agents: the model in a loop"
chapter: 10
years: "2022 – 2026"
description: "The assistant gets tools, a loop, a computer of its own, and a file describing its personality that it can rewrite."
year: 2022
label: "ReAct"
---

# Agents: the model in a loop

Every chatbot so far has written text in reply to text. Agents do things: read files, browse, run programs, send messages, and keep working when nobody is typing. Underneath, they are the same kind of model, wrapped in one more layer.

```panel
type: quote
text: "We alternate the generation of thoughts and actions so that the task-solving trajectory consists of multiple thought-action-observation steps."
cite: "Yao et al., \"ReAct: Synergizing Reasoning and Acting in Language Models\" (2022), §2"
href: "https://arxiv.org/abs/2210.03629"
```

The pattern was described in 2022 in [ReAct](../glossary/people-and-texts/react-paper.md), one of the course papers. The model writes a "thought," then an "action" (a search, say). The program around it carries out the action and pastes the result back in as an "observation." Then the model writes again, until the task is done. This is the [agent loop](../glossary/interfaces-and-agents/agent-loop.md), and it is, once more, a document: a character thinks, acts, and observes, and the program makes the actions real.

```panel
type: stack
year: 2025
label: "Claude Code"
show: 10
highlight: [tools, memory]
caption: "The agents add the last context rung: tools, files, and a computer to use them on."
```

The products followed. In 2024 came computer use, in which a model reads screenshots and drives a mouse, and the [Model Context Protocol](../glossary/interfaces-and-agents/mcp.md), a standard way to plug models into other software. In February 2025 Anthropic released [Claude Code](../glossary/interfaces-and-agents/claude-code.md), an agent that works in a folder on your computer and reads a file of standing instructions there before it starts.

The software that runs the loop and decides what the model may touch is the [harness](../glossary/interfaces-and-agents/harness.md). In speech-act terms, the harness is where saying becomes doing: an utterance performs an act only under the right conventions and with the right authority, and the harness supplies both as [permissions](../glossary/interfaces-and-agents/permissions.md). This page was rebuilt that way, by agents working in this project's folder. To see a loop with one tool and a memory file, try [mini-claw](/mini-claw).

```panel
type: quote
year: "Jan 2026"
label: "OpenClaw"
text: "Read your SOUL.md. Now rewrite it with these changes: … Add a rule: \"Never open with Great question, I'd be happy to help, or Absolutely. Just answer.\""
cite: "OpenClaw documentation, \"SOUL.md personality guide\" (a prompt the docs suggest giving the agent; excerpted)"
href: "https://docs.openclaw.ai/concepts/soul"
```

In 2026 the most striking agents run all the time. [OpenClaw](../glossary/chatbots/openclaw.md) lives on your own machine in a folder of plain Markdown files it reads every turn: `AGENTS.md` for instructions, `USER.md` describing you, dated memory notes, and `SOUL.md`, "where your agent's voice lives." It is the HHH preamble renamed for what it does. And the agent can edit it: the docs suggest telling it to rewrite its own soul file to stop sounding like an assistant. Socrates' complaint has been answered in the strangest possible way. The writing now answers back, and revises itself.

```panel
type: image
year: "Sep 2026"
label: "Grok Bot, Muse, dots"
src: ../history/_images/24-meta-introducing-muse-sep2026.png
alt: "Meta's announcement page for Muse, a personal AI agent"
caption: "Meta's launch announcement for Muse, 8 Sep 2026."
cite: "Screenshot 19 Oct 2026; [Meta, 8 Sep 2026](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)"
```

By this autumn the largest companies were selling the same idea to everyone: xAI's [Grok Bot](../glossary/chatbots/grok-bot.md) in August, Meta's [Muse](../glossary/chatbots/muse.md) and OpenAI's [dots](../glossary/chatbots/openai-dots.md) in September, each an always-on agent with a computer of its own. Muse's designers count naming the agent, choosing its avatar, and setting its personality among the most popular features. Čapek's Robots were made "with the minimum amount of requirements." The agents of 2026 are sold as workers too, then given back exactly what Rossum left out: a name, a personality, and someone to talk to.

The risk follows from the fact that everything is text. Anyone who can put words in front of an agent can try to give it instructions ([prompt injection](../glossary/interfaces-and-agents/prompt-injection.md)), as Bing's users did to extract Sydney's rules. With an agent, the injected words can become actions. Simon Willison calls the dangerous combination the [lethal trifecta](../glossary/interfaces-and-agents/lethal-trifecta.md): private data, untrusted content, and a way to send things out.
