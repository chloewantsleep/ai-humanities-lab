---
task: "L0"
title: "The glossary route and index"
status: "done"
owns: "`nextjs/app/glossary/`, `nextjs/content/glossary/README.md`"
depends_on: "start now"
report: "../reports/L0-L1-glossary-route-and-chatbots.md"
---
# L0. The glossary route and index

Read [the glossary's shared brief (the entry format and the rules for glossary agents)](L-glossary.md) first: it applies to this task.

A `/glossary` route in the style of tdm155ai-week-6's `/concepts` (in The Notebook at `apps/tdm155ai/tdm155ai-week-6/nextjs/app/concepts/`): a sidebar listing the categories, then within one category its entries, with the entry beside it. `content/glossary/README.md` introduces the glossary and links each category. Add "Glossary" to the header nav in `Chrome.jsx`. Optional, if time allows: show the `short` line on hover for glossary links inside experiment documents, and a search box over terms and aliases. Write the README first and commit it early, so the category agents have a place to link to.

## When you finish

Write or update [`../reports/L0-L1-glossary-route-and-chatbots.md`](../reports/L0-L1-glossary-route-and-chatbots.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
