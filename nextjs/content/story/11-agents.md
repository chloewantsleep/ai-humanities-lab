---
title: "Tools and agents"
chapter: 6
years: "2025–2026"
description: "Connect the model to tools and run a sequence of actions."
year: 2025
label: "Tools and agents"
---

# Tools and agents

An agent combines a model with software that can run tools, keep records, and manage a task. This surrounding software is often called a harness. The model requests an action, the software runs it, and the result becomes input for the next step.

Earlier research such as [ReAct](https://arxiv.org/abs/2210.03629) described how to alternate generated reasoning with actions. The [mini-claw experiment](/mini-claw) lets you inspect a small tool loop and its memory.

The class Ensemble applies a related idea to a group conversation. Each bot has instructions and notes about when it should respond. The surrounding software selects a bot and supplies the conversation. Use [the chatbot builder](#build-a-bot) to edit those settings and submit a bot.
