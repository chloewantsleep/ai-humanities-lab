---
term: "ReAct (Yao et al., 2022)"
slug: react-paper
short: "A 2022 paper that had a language model alternate between writing out its reasoning and taking actions, such as searching Wikipedia, then reading the results: the pattern of the agent loop."
aliases: [ReAct, Yao et al. 2022, reason and act]
category: people-and-texts
see_also: [generative-agents, simon-willison, ../interfaces-and-agents/agent-loop, ../interfaces-and-agents/tool-use, ../interfaces-and-agents/agent, ../interfaces-and-agents/claude-code, ../interfaces-and-agents/trace]
readings: []
experiments: [mini-claw]
updated: 2026-10-19
---

# ReAct (Yao et al., 2022)

**A 2022 paper that had a language model alternate between writing out its reasoning and taking actions, such as searching Wikipedia, then reading the results: the pattern of the agent loop.**

## Why it matters here

ReAct is the short answer to "what is an agent?" A model writes a thought, chooses an action, sees what came back, and writes the next thought, "in an interleaved manner," until the task is done. The paper's actions were humble (a "simple Wikipedia API," moves in a text game, clicks in a shopping simulation), and it was done with prompting alone, "with only one or two in-context examples." The same loop, with better models and more tools, is what Claude Code and the 2026 agents in the history pages run.

## In the readings

In the course's AI paper collection ([notes](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2210.03629v3--react-synergizing-reasoning-and-acting-in-language-models.md)); the collection notes say it "helped define the modern agent pattern."

## Try it

[Mini-claw](/mini-claw)'s trace view shows each step of the loop: what the model received, the tool it asked for, what came back.

## See also

[Generative Agents](generative-agents.md) · [Simon Willison](simon-willison.md) · [Agent loop](../interfaces-and-agents/agent-loop.md) · [Tool use](../interfaces-and-agents/tool-use.md) · [Agent](../interfaces-and-agents/agent.md) · [Claude Code](../interfaces-and-agents/claude-code.md) · [Trace](../interfaces-and-agents/trace.md)

## Sources

- Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, and Yuan Cao, "ReAct: Synergizing Reasoning and Acting in Language Models," ICLR 2023 ([conference page](https://iclr.cc/virtual/2023/poster/11003)); [arXiv:2210.03629](https://arxiv.org/abs/2210.03629), abstract quoted.
