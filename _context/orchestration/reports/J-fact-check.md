---
task: "J. Fact-check the history and the planning claims"
thread_id: "01a15575-f1cd-7c21-bece-33650f30a5d4"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15575-f1cd-7c21-bece-33650f30a5d4"
ran: "18:39–18:49 UTC, 2026-10-19"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# Task J: fact-check the history and the planning claims

## What I built

No code and no routes. All the work is Markdown in `nextjs/content/`, plus one new file that is the product:

- **`nextjs/content/history/fact-check.md`** (new, `order: 98`, served at `/history/fact-check`). A source ledger in four tables: planning note section 4 (the product claims), planning note section 1 (the base-model claims), the history pages and shot list, and the readings. Each row is claim, verdict, source, notes. It ends with an "Open items and limits" list and a validation paragraph. I committed it early (`d3bee4f`) so the glossary agent could draw on it, then updated it twice.
- **The eight history pages** (`00-prologue.md` through `07-comparisons.md`) and `history/README.md`: every date now says where it came from, with a link, and "(verify)" was replaced by a source or kept with a stated reason.
- **`history/shot-list.md`**: rewritten so each row describes what the saved PNG actually shows, with the date source. It is no longer labeled "verbatim"; the original record is linked as a commit-pinned URL (`ll-26-27/mk-chatbot-experiments` at `26656e3`, a private repo).
- **`nextjs/content/readings/README.md`**: each reading now has its own entry and a correct destination link, with ids the glossary can cite. The Weizenbaum paper, *Computer Power and Human Reason*, Askell et al., Ouyang et al., janus's "Simulators", the shoggoth meme, and nostalgebraist's "the void" are covered.

I did not touch the screenshots, the planning note, or `content/glossary/chatbots/`.

## How to try it

- http://localhost:3000/history/fact-check (the ledger), http://localhost:3000/history (the pages with sourced dates), http://localhost:3000/readings. No `OPENROUTER_API_KEY` needed; these are static Markdown.
- Checked on 2026-10-19: all three routes return 200 on the running dev server.

## Commits

Verified in `git log`, all authored `mkuzmick`, none pushed:

- `d3bee4f` Start task J fact-check ledger with primary chatbot sources (`fact-check.md`, 35 lines)
- `72be8b1` Verify model pairs and clarify agent launch and security claims (`fact-check.md`)
- `01dd0d2` Source history dates, correct screenshot captions, and link readings (12 files: the eight history pages, `README.md`, `fact-check.md`, `shot-list.md`, `readings/README.md`)

Checked on 2026-10-19: `git status` shows nothing uncommitted from this thread (the only untracked path is `_context/reports/`, which is the other reports). `git diff 26656e3 HEAD -- nextjs/content/history/_images` is empty, so the 43 screenshots are unchanged since the scaffold commit.

## What I couldn't do or didn't check

From the thread's own admissions and its ledger:

- **No benchmarks.** The ledger says it did not run a local generation test, a transfer-size test, or a memory test for any browser model. Sizes come from file lists on Hugging Face (SmolLM2-135M-Instruct ONNX files: int8 137 MB decimal, q4 182 MB, q4f16 118 MB, fp16 270 MB), not from a download.
- **No authenticated product testing, no account cleanup, no screenshot replacement.** It did not reopen Marlon's accounts.
- **Blocked sources.** The ACM full text of Weizenbaum returned 403 (it used the Stanford-hosted scan and the issue date instead). The Wayback replay of the ChatGPT launch post and the original X post for the shoggoth meme would not load.
- **Not independently replayed:** the Wayback capture behind screenshots `01c` and `01d` (it read the timestamp in the URL bar of the saved image only).
- **Legal reuse.** It reports Commons' own licence labels (`00a`, `00b`, `01b`, `00c`) and does not give a legal opinion on any screenshot of a company page.

Checked on 2026-10-19: its summary says "validation passed for all 12 Markdown files and 116 relative references." I did not rerun that; I confirmed only that the three routes load and the images are byte-identical to the scaffold commit. I did not run `pnpm test` or a build, per the brief.

### Claims left open in `fact-check.md`

These are the rows still marked "Open (verify)" or otherwise unresolved, in the ledger's own terms:

1. **OpenClaw "138 vulnerabilities in 63 days."** The headline is traceable to a secondary source (Lobster Pack, 8 Apr 2026) and to a current tracker (Jerry Gamblin's), but a current tracker cannot prove a past count. Needs a dated snapshot, the endpoints, and a rule separating advisories from assigned CVEs. Do not teach 138 as a census.
2. **"63% of exposed instances lacked proper authentication."** Not supported by the primary scan it checked. SecurityScorecard STRIKE (9 Feb 2026) shows 42.9K unique exposed IPs, a 40,214 writing-time count, and 35.4% flagged RCE-vulnerable, which is a different measure. No scan with the 63% denominator was found.
3. **"A critical zero-click RCE" in OpenClaw.** Marked misleading without an advisory ID. The January advisory (CVE-2026-25253 / GHSA-g8p2-7wf7-98mq) is explicitly 1-click, High (CVSS 8.8), published 31 Jan, patched in v2026.1.29. The later "ClawJacked" chain is a separate silent-compromise-after-website-visit attack that Oasis says OpenClaw classed High, not Critical. The combined wording in the note is unsupported.
4. **"Qwen and Gemma are slightly smarter alternatives."** Open for the proposed demo; maker evaluations do not rank models for this classroom behaviour. Needs matched prompts on a stated task.
5. **"Modern base models are full of ChatGPT transcripts and may say they're ChatGPT."** Open as a general causal claim. The SmolLM2 and Qwen base cards do not quantify contamination. A hypothesis to test, retaining model, version, prompt, template, seed, and sampling.
6. **"GPT-2 always gives a pure spiral."** Interpretation, not a guarantee. Depends on prompt, sampling, stopping, and seed. Not tested.
7. **Liquid LFM2.5-1.2B pair "roughly 850 MB quantized and better for WebGPU."** Size plausible for one GGUF format (Q5_K_M 843 MB, Q4_K_M 731 MB), but GGUF is not a browser ONNX artifact and the WebGPU recommendation is unproven.
8. **Qwen3-0.6B-Base as a browser-ready base/instruct pair.** The pair exists on Hugging Face, but the ONNX Base URL named in the orchestration doc did not resolve; this matches the orchestration doc's own note that there is no `onnx-community/Qwen3-0.6B-Base-ONNX`.
9. **A "130 MB" SmolLM2-135M-Instruct.** Approximate and format-dependent; the 130 MB figure belongs to a specific uploader's fine-tune (`rish-0-0/SmolLM2-135M-Strudel-ONNX`, a full fine-tune, not stock Instruct and not LoRA).
10. **Screenshot `01a` date and content.** The file is a GitHub profile (`github.com/process-black`), not a ChatGPT login. The 3 Dec 2022 date is unsupported for this asset. A replacement is needed.
11. **Screenshots `01d` and `00c`.** `01d` shows the launch-post article header again, not the sample dialogue; `00c` shows an MIT archival folder cover labeled "Computer Conversations (1965)" with public-domain and CC0 badges, not MAD-SLIP source. Both are mislabeled; no correct replacement exists yet.
12. **Wayback replay of `01c`/`01d`** and **the original shoggoth post** (@TetraspaceWest, 30 Dec 2022, per Know Your Meme) could not be independently opened.
13. **Whether Marlon's test objects still exist** (draft GPT, ChatGPT project, Claude project, unsaved Gem). Persistence is "open (verify)"; the thread did not reopen accounts.

## For other tasks

- **K (use the screenshots):** do not use `01a` (GitHub profile, with account details), `01d` as "sample dialogue", or `00c` as "source code". The shot list and `/history` now say so. `00` shows Landsteiner's 2005 JavaScript ELIZA, whose replies differ from the paper's ("Men are all alike" prompts are drawn from the paper; the first reply differs), so do not caption it as the 1966 exchange.
- **F (ELIZA):** the ledger warns that later emulators must not be captioned as original screens and that `00` is not the paper's verbatim transcript. Use Weizenbaum's CACM 9(1), 36-45 as the check, not the screenshot.
- **L1 and the other glossary tasks:** draw dates from the ledger. Items to carry forward: Dot launched 19 Jun 2024 and ended 5 Oct 2025 (New Computer's Dot, distinct from OpenAI's dots of 29 Sep 2026); Hermes Agent launched 25 Feb 2026 (distinct from Nous's older Hermes model family); OpenClaw's rename was 29 Jan 2026; Grok Bot 11 Aug 2026; Meta Muse 8 Sep 2026 (the agent, not Muse Spark or Muse Code); "lethal trifecta" third term is external communication, not "ability to act"; SmolLM2 Instruct adds SFT and DPO, not PPO-style RLHF.
- **M (story):** use J's dates and the corrected captions. Mark the open claims above "(verify)"; do not state 138, 63%, or "critical zero-click" as fact. Gems: 17 Nov 2026 is the start of a staged migration, not a universal shutdown. GPTs: 11 Dec 2026 is the standard date; approved Enterprise deferrals differ.
- **P (readings gaps):** J fixed links for Askell, Ouyang, janus, nostalgebraist, Weizenbaum, and the shoggoth meme and gave each a reading id in `readings/README.md`. P should extend that file, not restart it. J's Wayback launch-post URL (`web.archive.org/web/20221130211011/https://openai.com/blog/chatgpt/`) could not be replayed by its tool.
- **G (layers):** the three builders were all filled with the same "Course TF Assistant" example; the ledger notes draft builder images do not establish that public creation is available today.
- **N1 (OpenClaw and Hermes research):** the ledger rows on OpenClaw and Hermes (documented facilities, README migration path, "self-improving" means memory and skills, not weight retraining) are a head start. The skills-docs link is docs.openclaw.ai/tools/skills.

## Marlon's words

None beyond the task prompt, which was (timestamp 18:39:48 UTC): "-check (task J)", then instructions to work in `mk-chatbot-experiments`, read AGENTS.md, README.md and `_context/orchestration.md`, and fact-check the history pages, the planning note's section 4 and section 1 claims, and the readings. Standing constraints he gave: "Don't change the screenshots, and don't edit the planning note itself (it's a verbatim record in another repo)"; "Another agent is writing glossary entries for each chatbot ... don't edit that folder, but your fact-check.md is what they'll draw on, so commit it early and update it as you go"; "Commit in this repo (don't push). Report what was wrong, what you confirmed, and what is still open."

## Decisions and open questions

- **Verdict vocabulary.** "Confirmed" means the cited source supports the statement, not that a maker's capability claim was independently tested. "Open (verify)" means the evidence checked does not establish the whole claim. Marlon may want a stricter or looser standard before these go on student-facing pages.
- **It rewrote the shot list** rather than annotating it, and replaced "verbatim" with a commit-pinned link to the original. That link points at a private repo.
- **It chose "(verify)" with a reason** over deleting a wrong claim, so wrong captions are visible and labeled rather than silently fixed. The images remain misdescribed in the filenames (`01a-chatgpt-login-screen-...`); it did not rename them, per the instruction.
- **Open for Marlon:** whether to retake `01a`, `01d`, and `00c`; whether to teach the OpenClaw figures at all until a dated dataset exists; whether to run the model benchmarks (and who owns them: A and C are the natural owners).
- **Thread:** Codex thread `01a15575-f1cd-7c21-bece-33650f30a5d4`, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `codex resume 01a15575-f1cd-7c21-bece-33650f30a5d4`. The thread did not write its own `_context/reports/` file or state its thread ID; this report was written for it afterward.
