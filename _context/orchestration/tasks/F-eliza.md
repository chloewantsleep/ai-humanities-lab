---
task: "F"
title: "ELIZA"
status: "done"
owns: "`nextjs/app/eliza/`, `nextjs/lib/eliza/`"
depends_on: "start now"
report: "../reports/F-eliza.md"
---
# F. ELIZA

Brief: `content/experiments/eliza.md`. Implement ELIZA with the DOCTOR script in `lib/eliza/` (keywords with ranks, decomposition and reassembly rules, pronoun reflection, the memory stack), from Weizenbaum's 1966 paper; the 2021 publication of the original MAD-SLIP listing (Commons image `content/history/_images/00c-eliza-original-mad-slip-source-1966-cc0.png`) is a check on fidelity. Expose it as an engine for B's shell, and build `/eliza` with a "show the rule" view beside each reply. It should reproduce the "Men are all alike" exchange from the paper. No dependency on B for a first version: a plain chat UI is fine, and switching to the shared shell can come later.

## When you finish

Write or update [`../reports/F-eliza.md`](../reports/F-eliza.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
