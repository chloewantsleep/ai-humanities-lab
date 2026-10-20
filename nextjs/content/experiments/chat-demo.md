---
title: The chat shell
description: "The bare chat window every Claude-backed page here is built on: a message list, a composer, and an inspector that shows the last request sent."
route: /chat-demo
status: working
group: "Under the hood"
order: 6
---

## What it is

A test page for the shared chat component (task B), the piece that `/layers`, `/knowledge-voice`, `/retrieval`, and the bot lab build on. There is no persona and no files: a short system line, Claude on the other end, and an inspector so you can see exactly what was sent.

## How to use it

Type a message and send it. Open the inspector to read the request as the model received it. Tick **Use local demo** to swap Claude for an echo engine that needs no key; switching resets the conversation.

## Why it is on the list

Every chatbot on this site is this window plus something assembled around your message. If you want to know what the frame itself contributes (very little), start here.
