---
task: "P"
title: "Fill the gaps in the readings"
status: "not started"
owns: "The Notebook's `humanities-ai-lab/20261019-gathered/papers/`; `nextjs/content/readings/`"
depends_on: "start now"
report: "../reports/P-readings-gaps.md"
---
# P. Fill the gaps in the readings

Added 2026-10-19. Marlon asked whether we have "the original major chatgpt and anthropic papers," a November 2022 paper, or an ad. ChatGPT launched with a blog post and no paper; the August collection and today's gathered folder hold most of the papers, but not the launch posts in full or Anthropic's main RLHF paper. Fetch these into The Notebook's `_context/projects/50-in-focus/humanities-ai-lab/20261019-gathered/papers/`, following that folder's README exactly (a PDF in `pdfs/` with a sidecar in `md/` giving the source, checksum, pipeline step, and why it is here; web sources saved in full as Markdown in `web/` with URL, date, and retrieval method in the frontmatter; site navigation removed), and add each to the README's table under its pipeline step:

- **Bai et al. 2022, *Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback*** (arXiv 2204.05862), Anthropic's counterpart to InstructGPT. Steps 5 and 6. The most important gap.
- **OpenAI, "ChatGPT: Optimizing Language Models for Dialogue"** (30 November 2022), the launch post, now "Introducing ChatGPT" at openai.com/index/chatgpt. Save the launch-day text from the Wayback Machine (`https://web.archive.org/web/20221130211011/https://openai.com/blog/chatgpt/`) and note any differences from the current page. The history screenshots `01c` and `01d` show it.
- **Sam Altman's launch post on X** (30 November 2022): the text and link, as the other half of how ChatGPT was announced (verify the exact post).
- **Anthropic, "Introducing Claude"** (March 2023), the launch post.
- **OpenAI, *GPT-4 Technical Report*** (arXiv 2303.08774) and the **GPT-4 System Card** (March 2023).
- **OpenAI, the Model Spec** (first version May 2024, and the current one): OpenAI's counterpart to Claude's constitution, for comparing the two.
- **OpenAI on GPT-4o's sycophancy** (April–May 2025, "Sycophancy in GPT-4o" and the follow-up on what they missed): the clearest public account of a character failure and its rollback.
- **janus, "Simulators"** (LessWrong, September 2022) and **nostalgebraist, "the void"** (2025): the two essays on the Assistant as a character that the glossary already cites (`persona-and-dialogue/simulator.md`) but that we don't have in full.
- Optional, if quick: DeepMind's Sparrow paper (arXiv 2209.14375), the third lab's 2022 assistant.

Also add each to `nextjs/content/readings/README.md` with a correct link and a reading id, and tell L-glossary entries that cite them (InstructGPT, RLHF, HHH, sycophancy, simulator, "the void") the new ids by updating their `readings:` lines. Check reuse rights as the gathered README does: link to official versions, and note which copies shouldn't go to students. **Commits:** commit the readings page and glossary edits in this repo by path. Don't commit in The Notebook: the gathered folder is still untracked there and Marlon will commit it whole; list your new files in your report.

## When you finish

Write or update [`../reports/P-readings-gaps.md`](../reports/P-readings-gaps.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
