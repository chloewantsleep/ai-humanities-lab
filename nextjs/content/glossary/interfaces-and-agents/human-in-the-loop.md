---
term: "Human in the loop"
slug: "human-in-the-loop"
short: "A design that returns a decision or action to a person at a chosen point."
aliases: ["human oversight", "approval checkpoint"]
category: "interfaces-and-agents"
see_also: ["permissions", "trace", "stopping-condition"]
readings: []
experiments: []
updated: "2026-10-19"
---

# Human in the loop

**A design that returns a decision or action to a person at a chosen point.**

## In plain terms

Claude Code can ask for approval before actions, according to its permission configuration. Approval is useful only when the person can understand what action is proposed.

Imagine a student reviewing the exact destination and text before an agent publishes a course post. “Proceed?” without those details makes the human’s role harder to exercise. Mini-claw’s trace offers a place to discuss where such a checkpoint could go; its brief does not require an approval interface.

## See also

[Permissions](permissions.md) · [Trace](trace.md) · [Stopping condition](stopping-condition.md)

## Sources

- [Claude Code: permissions](https://code.claude.com/docs/en/permissions)
