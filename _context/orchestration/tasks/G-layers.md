---
task: "G"
title: "The layers around the model"
status: "done (live Claude replies untested: no key yet)"
owns: "`nextjs/app/layers/`"
depends_on: "B"
report: "../reports/G-layers.md"
---
# G. The layers around the model

Brief: `content/experiments/layers.md`. Uses B. One engine with each layer as a switch: configuration (system prompt, attached files, one tool), persistent memory, and a view of what each layer adds to the text the model receives. The screenshots of GPT builders, Claude Projects, and Gems (`/history`) show the configuration layer in real products; the three builders were all filled in with the same "Course TF Assistant" example, which this experiment can recreate.

## When you finish

Write or update [`../reports/G-layers.md`](../reports/G-layers.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
