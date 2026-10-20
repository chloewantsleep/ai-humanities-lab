---
term: "The lethal trifecta"
slug: "lethal-trifecta"
short: "Simon Willison’s name for combining private data access, untrusted content, and external communication."
aliases: ["lethal trifecta"]
category: "interfaces-and-agents"
see_also: ["prompt-injection", "least-privilege", "sandbox"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# The lethal trifecta

**Simon Willison’s name for combining private data access, untrusted content, and external communication.**

## In plain terms

The dangerous combination permits a prompt injection encountered in outside material to steer disclosure of private information. The term identifies a configuration of capabilities, not a claim that every run will leak data.

Writing a local note and transmitting it outside the workspace are different powers. Mini-claw’s file tool has no external-communication operation, removing that direct transmission route. Its Claude engine still calls an external model provider; the whole application is not offline.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Prompt injection](prompt-injection.md) · [Least privilege](least-privilege.md) · [Sandbox](sandbox.md)

## Sources

- [Simon Willison: the lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
