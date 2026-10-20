---
term: "MCP"
slug: "mcp"
short: "A protocol for connecting AI applications to external tools and context."
aliases: ["Model Context Protocol"]
category: "interfaces-and-agents"
see_also: ["tool-use", "plugins", "permissions"]
readings: []
experiments: []
updated: "2026-10-19"
---

# MCP

**A protocol for connecting AI applications to external tools and context.**

## In plain terms

The Model Context Protocol provides a shared way for applications and servers to exchange capabilities such as tools and resources. It is a connection standard, not a model or a guarantee that a server is trustworthy.

Imagine connecting Claude Code to a course archive through MCP. The connection can expose a search operation; access to a student’s private notes remains a separate permission question.

## See also

[Tool use](tool-use.md) · [Plugins](plugins.md) · [Permissions](permissions.md)

## Sources

- [Model Context Protocol introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)
