---
term: "Workspace"
slug: "workspace"
short: "The files and directories an agent is given as its working area."
aliases: ["working directory"]
category: "interfaces-and-agents"
see_also: ["harness", "sandbox", "memory", "permissions"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Workspace

**The files and directories an agent is given as its working area.**

## In plain terms

For this glossary’s mini-claw example, the workspace is the mini-claw/ directory: memory.md, skills, and the tool’s permitted output all live there. A directory name alone does not enforce confinement.

Ask which part of the host rejects a path outside that directory. This separates “the agent was told where to work” from “the software limits where it can write.”

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Harness](harness.md) · [Sandbox](sandbox.md) · [Memory](memory.md) · [Permissions](permissions.md)

## Sources

- [The mini-claw experiment brief](../../experiments/mini-claw.md)
- [Claude Code: sandboxing](https://code.claude.com/docs/en/sandboxing)
