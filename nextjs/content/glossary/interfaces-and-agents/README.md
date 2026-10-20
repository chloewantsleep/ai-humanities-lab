---
title: "Interfaces and agents"
description: "From the chat screen to saved context, tools, agent loops, and computers that act."
order: 4
updated: 2026-10-19
---

# Interfaces and agents

What gets wrapped around a model: the screen, saved context, reference files, tools, and the software that lets an agent act. Read the table from a chat window outward to an agent with its own computer. The Course TF Assistant and Claude Code in a student’s repository are recurring examples; invented scenarios are labeled. Product profiles belong in [Chatbots](../chatbots/README.md), while [Persona and dialogue](../persona-and-dialogue/README.md) covers roles, system prompts, and conversational interpretation.

[The layers](/layers) makes configuration and memory visible; [mini-claw](/mini-claw) implements a loop, a memory file, skills, one file tool, and a trace. Mini-claw can run with a scripted stand-in without a key. The first-wave reports did not verify live Claude replies in either experiment; a built interface is not evidence that the model path has been tested. Retrieval, MCP, subagents, hooks, and computer use explain the larger systems around these small experiments; their inclusion does not imply that either experiment implements them. Sources were checked on 2026-10-19. Screenshot captions identify interface evidence; unconfirmed product promises remain marked “(verify).”

| Term | Gist |
| --- | --- |
| [Chat interface](chat-interface.md) | The screen that organizes an exchange as messages between a user and an assistant. |
| [Typing indicator](typing-indicator.md) | A visual signal that the interface is waiting for a reply. |
| [Streaming](streaming.md) | Delivering a response in pieces as it becomes available. |
| [Conversation history](conversation-history.md) | The record of earlier messages in an exchange. |
| [Custom instructions](custom-instructions.md) | Saved directions for how an assistant should respond. |
| [Projects](projects.md) | Containers that group related conversations, reference material, and instructions. |
| [Knowledge (files)](knowledge-files.md) | Reference documents made available to an assistant. |
| [Retrieval (RAG)](retrieval-rag.md) | Finding relevant material and supplying it to a model before it answers. |
| [Memory](memory.md) | Information saved for use beyond the immediate exchange. |
| [Context assembly](context-assembly.md) | Selecting and arranging what the model receives for a particular step. |
| [Compaction](compaction.md) | Replacing some earlier context with a shorter account to make room for continued work. |
| [Tool use](tool-use.md) | Letting a model request an operation that software can carry out. |
| [Function calling](function-calling.md) | Expressing a tool request as a named operation with structured arguments. |
| [Tool call](tool-call.md) | One specific request to run a tool with particular inputs. |
| [Tool result](tool-result.md) | The output returned to the agent after a tool runs. |
| [Plugins](plugins.md) | Installable packages that extend an application’s capabilities. |
| [MCP](mcp.md) | A protocol for connecting AI applications to external tools and context. |
| [Skills](skills.md) | Reusable instructions an agent can load for a particular kind of task. |
| [Progressive disclosure](progressive-disclosure.md) | Showing a little information first and loading more when it becomes relevant. |
| [CLAUDE.md / AGENTS.md](instruction-files.md) | Repository files that give a coding agent written project instructions. |
| [Agent](agent.md) | A system that lets a model choose steps and use tools toward a task. |
| [Agent loop](agent-loop.md) | The repeated cycle of model call, tool request, execution, and returned result. |
| [Workflow](workflow.md) | A sequence of steps whose path is largely specified in advance. |
| [Harness](harness.md) | The surrounding software that turns model outputs into an operating agent. |
| [Claude Code](claude-code.md) | Anthropic’s coding agent, used here as a running example of an agent around a model. |
| [Workspace](workspace.md) | The files and directories an agent is given as its working area. |
| [Trace](trace.md) | A record of an agent’s steps, requests, and returned results. |
| [Stopping condition](stopping-condition.md) | The rule that determines when an agent run should end. |
| [Permissions](permissions.md) | Enforced rules about which actions an agent may execute. |
| [Human in the loop](human-in-the-loop.md) | A design that returns a decision or action to a person at a chosen point. |
| [Sandbox](sandbox.md) | An enforced boundary around what a running process can access. |
| [Least privilege](least-privilege.md) | Giving a system only the access needed for its task. |
| [Prompt injection](prompt-injection.md) | An attempt to turn material an agent encounters into instructions that redirect its behavior. |
| [The lethal trifecta](lethal-trifecta.md) | Simon Willison’s name for combining private data access, untrusted content, and external communication. |
| [Subagent](subagent.md) | A separate agent given a narrower part of a larger task. |
| [Hooks](hooks.md) | Programs triggered at specified points in an agent application’s lifecycle. |
| [Computer use](computer-use.md) | Acting through a computer interface by observing the screen and issuing input. |
| [Always-on agent](always-on-agent.md) | An agent service designed to remain available and respond to triggers beyond one chat session. |
| [An agent’s own computer](agent-computer.md) | A dedicated computing environment in which an agent can keep files and run its tools. |
| [Voice assistant](voice-assistant.md) | An interface for spoken requests and synthesized replies. |
