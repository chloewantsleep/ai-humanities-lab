---
task: "D"
title: "Building the assistant by hand"
status: "not started"
track: "MVP for the October 20 workshop"
owns: "`nextjs/app/by-hand/`"
depends_on: "A, B (for column 4)"
report: "../reports/D-by-hand.md"
---
# D. Building the assistant by hand

Brief: `content/experiments/by-hand.md`. Uses A for columns 1 to 3 (SmolLM2-135M base, the same with a preamble, SmolLM2-135M-Instruct with its template shown) and B for column 4 (Claude). One question box sends to all four. The column 2 preamble is editable, with presets (an HHH-style script after Askell et al. 2021, a sardonic assistant, a medieval monk) and a "let it write both sides" switch that doesn't stop at the next "Human:" turn. Read the Askell et al. paper's appendix for the shape of the original prompt; write our own preamble rather than pasting theirs at length.

## For today's workshop (added 2026-10-20 by the second orchestrator; supersedes the last sentence above)

This is part of the **MVP for the October 20 class**. Marlon wants students to see "the assistant written into the prompt": a base model given a long scripted conversation between a helpful assistant and a human before the student's question. He particularly wants **the exact prompt from Askell et al. 2021**, *A General Language Assistant as a Laboratory for Alignment* (arXiv 2112.00861), not an imitation.

- **Find the original prompt.** It is reported to have been released publicly alongside the paper (a gist linked from the paper or its appendix); find it, confirm it is the paper's own HHH prompt, and save it in the route folder as `hhh-prompt.txt` with a header comment naming the source URL, the date you fetched it, and how you verified it. If you can't verify it, say so on the page and in the report; don't present a reconstruction as the original.
- **Make it a preset you can read.** A viewer shows the whole prompt (it is long), with a link to the source. Label clearly that running it on these small models is our experiment, not a recreation of Anthropic's results (they used their own 52B model).
- **Context length is the catch.** The full prompt is several thousand tokens. GPT-2's context is 1,024 tokens; check each model's real limit in its config on Hugging Face. When the preamble doesn't fit, keep the last N exchanges that do and show the student what was cut and why. Make GPT-2 available in column 2 if it fits at all (Marlon: "GPT-2 must be there"), even with a short preamble.
- **Column 4 (Claude)** needs `OPENROUTER_API_KEY` in `nextjs/.env.local`. If the key isn't there when you test, make column 4 say so plainly and still test columns 1–3 fully.
- **Test well:** the same three questions through all columns, cold and warm cache; record what students will see, with times, in the report. Check the "write both sides" switch actually lets it invent the Human's next turn.
- **Testing in a browser:** use the shared dev server on http://localhost:3000. Don't start a second dev server in `nextjs/`; if 3000 is down, say so and wait.

## From the visual review (2026-10-20, 08:10; do this with the toggle)

`/by-hand` is the only page that scrolls sideways, and it's a full-attention moment today. At 1440 and 1280, column 2's selects and preamble spill ~200px out of the card under column 3; at 1024 the page is 1041px wide, on a phone 539px. Measured cause: `.bh-col` is a grid with an `auto` track that grows to a select's 504px width. Fix in `by-hand.css`: `.bh-col { grid-template-columns: minmax(0, 1fr) }`, selects `width: 100%; max-width: 100%`, and `minmax(0, 1fr)` in the 700px media query too. Re-check at 1440, 1280, 1024, 390, and at 125–150% zoom (Marlon may project zoomed). Screenshot: `/private/tmp/claude-501/-Users-mk-Development-mk-27-apps-the-notebook/9b639a81-e358-4142-9f22-26dc755aec5f/scratchpad/layout-review/shots1/by-hand-1440-full.png`. Also give the page a proper tab title.

## When you finish

Write or update [`../reports/D-by-hand.md`](../reports/D-by-hand.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
