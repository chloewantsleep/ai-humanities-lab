---
term: "Sandbox"
slug: "sandbox"
short: "An enforced boundary around what a running process can access."
aliases: ["execution sandbox", "isolation"]
category: "interfaces-and-agents"
see_also: ["permissions", "workspace", "computer-use", "least-privilege"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Sandbox

**An enforced boundary around what a running process can access.**

## In plain terms

Claude Code’s sandboxing can constrain filesystem and network access. This differs from asking the model to avoid certain actions: the boundary is implemented by the execution environment.

Mini-claw exposes no shell or network tool. Its file tool permits Markdown writes only under notes/ and one-line appends to memory.md; tests cover path traversal, symlink escapes, and permission refusals. These checks constrain this tool, rather than sandboxing the entire server process.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Permissions](permissions.md) · [Workspace](workspace.md) · [Computer use](computer-use.md) · [Least privilege](least-privilege.md)

## Sources

- [Claude Code: sandboxing](https://code.claude.com/docs/en/sandboxing)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
