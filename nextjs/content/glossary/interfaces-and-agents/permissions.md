---
term: "Permissions"
slug: "permissions"
short: "Enforced rules about which actions an agent may execute."
aliases: ["access control", "tool permissions"]
category: "interfaces-and-agents"
see_also: ["instruction-files", "sandbox", "human-in-the-loop", "least-privilege"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Permissions

**Enforced rules about which actions an agent may execute.**

## In plain terms

Claude Code’s permission system governs tool execution; written instructions influence what the model requests. A request can therefore be well formed and still be refused.

A student might authorize reading an essay while withholding permission to publish it. Look for that boundary in the host’s checks, rather than expecting a polite sentence in CLAUDE.md to enforce it.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[CLAUDE.md / AGENTS.md](instruction-files.md) · [Sandbox](sandbox.md) · [Human in the loop](human-in-the-loop.md) · [Least privilege](least-privilege.md)

## Sources

- [Claude Code: permissions](https://code.claude.com/docs/en/permissions)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
