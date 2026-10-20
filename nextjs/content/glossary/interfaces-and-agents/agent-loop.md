---
term: "Agent loop"
slug: "agent-loop"
short: "The repeated cycle of model call, tool request, execution, and returned result."
aliases: ["tool loop"]
category: "interfaces-and-agents"
see_also: ["agent", "tool-call", "tool-result", "stopping-condition"]
readings: []
experiments: ["mini-claw"]
updated: "2026-10-19"
---

# Agent loop

**The repeated cycle of model call, tool request, execution, and returned result.**

## In plain terms

Claude Code describes its work as gathering context, taking action, and verifying results. Repetition allows a tool result to change what happens next.

Mini-claw exposes each iteration in its trace. If a requested note is missing, does the next step acknowledge the error, choose another action, or stop? Read the sequence rather than judging only the final answer.

## Try it

[mini-claw](/mini-claw). Inspect the built interface and its current notes. Mini-claw offers a scripted stand-in; live model replies require the configured Claude connection.

## See also

[Agent](agent.md) · [Tool call](tool-call.md) · [Tool result](tool-result.md) · [Stopping condition](stopping-condition.md)

## Sources

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [The mini-claw experiment brief](../../experiments/mini-claw.md)
