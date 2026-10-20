---
term: "Least privilege"
slug: "least-privilege"
short: "Giving a system only the access needed for its task."
aliases: ["minimum necessary access"]
category: "interfaces-and-agents"
see_also: ["permissions", "sandbox", "lethal-trifecta"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Least privilege

**Giving a system only the access needed for its task.**

## In plain terms

Permission and sandbox controls can narrow an agent’s reach. For this course, the mini-claw design illustrates the principle with a single tool, no network or shell, and writes confined to its workspace.

Imagine a note-taking exercise: access to an entire home directory would add power unrelated to the task. Evaluate the available operations alongside the written instructions.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Permissions](permissions.md) · [Sandbox](sandbox.md) · [The lethal trifecta](lethal-trifecta.md)

## Sources

- [Claude Code: sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Claude Code: permissions](https://code.claude.com/docs/en/permissions)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
