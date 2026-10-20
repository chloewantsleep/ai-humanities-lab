---
task: "F. ELIZA"
thread_id: "e0abf4e0-446c-4347-a664-ebed332d2264"
agent: "Claude Code"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "claude --resume e0abf4e0-446c-4347-a664-ebed332d2264  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:39–18:51 UTC, 2026-10-19 (the work; the session was compacted at 19:46 UTC and wrote no more)"
status: "done"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

# Task F: ELIZA

**Short answer for task E:** yes, it reproduces the "Men are all alike" exchange (all 15 replies, checked in a test and, per the thread, in a headless browser), and it is already exposed as an assistant-ui `ChatModelAdapter` that drops into the shared `ChatShell`. See "For other tasks".

## 1. What I built

All paths are under `nextjs/` in `/Users/mk/Development/mk-27/apps/the-notebook/apps/mk-chatbot-experiments`.

- **`lib/eliza/`**, a pure engine in plain `.mjs`:
  - `doctor.mjs`: the DOCTOR script as data, a `String.raw` constant (`DOCTOR_SCRIPT`) holding Anthony Hay's verbatim transcription of the 1966 CACM appendix (from the elizagen.org repo), with a header comment citing the source. Generated from the downloaded file, not retyped.
  - `script.mjs`: `parseScript(text)` reads the script's S-expressions into keywords (rank, substitution, tags, transformations with decomposition patterns and reassembly rules, links, `NEWKEY`, `PRE`), the `MEMORY` rules, `NONE`, and tag lists.
  - `engine.mjs`: `createEliza(scriptText)`, `readInput`, `match`, `reassemble`, `describeRule`. Implements the keystack with ranks, word swaps (MY to YOUR and so on), decomposition and reassembly with each rule's replies used in turn, links, `NEWKEY`, `PRE`, the `NONE` rule, and the memory stack.
  - `hash.mjs`: the SLIP `HASH` (mid-square on 7090 BCD codes, using BigInt) and `lastCellAsBcd`, used to choose which memory rule fires, as the 1965 listing does.
  - `index.mjs`: the entry point, `export const doctor = createEliza(DOCTOR_SCRIPT)`, re-exporting `greeting`, `initialState`, `respond`, `replay`, plus `createEliza`, `describeRule`, `DOCTOR_SCRIPT`.
  - `adapter.mjs`: `createElizaAdapter(eliza)` and `elizaAdapter`, an assistant-ui `ChatModelAdapter` (see "For other tasks").
  - `examples.mjs`: `MEN_ARE_ALL_ALIKE`, the 15 `[said, reply]` pairs from the paper, pp. 36–37.
- **`app/eliza/`**:
  - `page.jsx`: server page, `<ExperimentPage name="eliza"><ElizaChat /></ExperimentPage>`, `dynamic = "force-dynamic"`.
  - `ElizaChat.jsx` (client): a plain chat with a "Show the rule" checkbox (on by default), a **Play the 1966 exchange** button (one line every 900 ms, each reply marked "Same reply as in the 1966 paper" or "The paper has: …"), **Start over**, and a counter/memory readout. Beside each reply sits a rule card: the phrase ELIZA dropped, the swapped words, what it read, the keystack, each step with its decomposition, numbered parts and reassembly ("2 of 4"), the `NONE`/`NEWKEY`/`PRE` moves, and, when MY is the keyword, the memory it saved (with the hash). Below the transcript: the memory-stack panel and a `<details>` holding the whole DOCTOR script.
  - `eliza.css`: styles, all prefixed `.eliza-`; two columns when rules are shown, one column under 820 px.
- **`tests/eliza.test.mjs`**: 7 tests (greeting; the exchange line for line; the rules behind it, including the ALIKE to DIT chain, the discarded "WELL ,", MY to YOUR, the memory created, PRE for I'M to I, the keystack, the BUT clause, the memory firing at counter 4, `describeRule`; the HASH values; 13 further lines from Hay's published continuation; immutability of state; the adapter).
- **`content/experiments/eliza.md`**: `status: working`. Sections: What it shows, What was built (with three of the 00 screenshots), How faithful it is, For the other experiments (interface and adapter snippet), Sources (linked), Open questions.

## 2. How to try it

Open http://localhost:3000/eliza (no API key needed; ELIZA is entirely client-side) and press **Play the 1966 exchange**. Then type your own lines: "Can we talk?" gives the built-in fallback (HMMM), "I remember my mother" shows keyword ranks at work. The doc is at http://localhost:3000/experiments/eliza.

Checked on 2026-10-19: `/eliza` and `/experiments/eliza` both return 200, and `node --test tests/eliza.test.mjs` from `nextjs/` gives 7 pass, 0 fail. The thread reports `pnpm test` passing 10 of 10 (the 7 here plus 3 existing content tests); I did not rerun `pnpm test`.

## 3. Commits

Verified in `git log`:

- `348232e` "ELIZA (task F): the 1966 DOCTOR script in the browser, with the rule behind each reply" (2026-10-19 14:51:07 -0400)
- `bad53d7` "ELIZA doc: drop the 00c caption question (task J corrected it)" (14:51:15 -0400)

Nothing of this thread is uncommitted (`git status` shows only an untracked `_context/reports/` from the report-writing). Nothing was pushed and the Notebook's submodule pointer was not bumped.

## 4. What I couldn't do or didn't check

From the thread's own admissions:

- **The `00c` image is not the listing.** The file `00c-eliza-original-mad-slip-source-1966-cc0.png` is only the cover of the archive folder (MC-0383 box 8, "Computer Conversations (1965)"), with no code on it, so it could not serve as the fidelity check the brief named. The check used instead: the paper's page images (pp. 36–37), elizagen.org's transcription of the 1965 MAD-SLIP listing (line numbers verified), and Hay's transcription of the script plus his C++ implementation. Task J had already corrected the `00c` caption, so the thread dropped its own question about it.
- **Not reproduced:** the EDIT command, the listing's script-changing commands (the `+` and `*` ones), and one quirk Hay reports where keywords with colliding hashes shadow each other.
- **Input normalization differs from 1966:** `?` and `!` end a sentence like a period (the paper's users could not type a question mark), and curly quotes and a few other marks are stripped or turned into commas. This is documented in the doc.
- **The secretary anecdote** in the doc is cited to *Computer Power and Human Reason* p. 6 via Hay and was not checked against the book.
- The shared Playwright browser was busy with another agent, so the browser check used a throwaway headless Chromium script in the scratchpad (not in the repo). The thread reports 15 of 15 replies matching in the browser, no console errors, and no horizontal scroll at 390 px. I did not repeat the browser check.
- It did not touch the README's route table, which still lists `/eliza` as "not built yet" (checked on 2026-10-19: line 32 of the repo `README.md` says so). That is a shared file the thread chose to leave alone.

Checked on 2026-10-19: nothing the thread claimed was contradicted by the repo. All its files exist, and the exchange test passes.

## 5. For other tasks

- **B (shared chat shell) and E (persona dial):** the engine's interface is deliberately small and synchronous:

  ```js
  import { greeting, initialState, respond, describeRule } from "../../lib/eliza/index.mjs";
  const { reply, rule, state: next } = respond("Men are all alike.", state); // reply: "IN WHAT WAY"
  ```

  `state` is plain JSON (`{ limit, memories, cursors }`); `respond` never mutates the state it is given (tested), so it works in React state or from a replay. `rule.kind` is `keyword`, `memory`, `none` or `nomatch`; `rule.steps` is the full trace; `describeRule(rule)` gives a one-line summary such as `ALIKE → DIT: (0) → (IN WHAT WAY)`. `replay(userMessages)` rebuilds the state from a list of the user's messages. `createEliza(scriptText)` runs any script in the 1966 format.
- **As an engine for the shared chat shell (what E needs):** `lib/eliza/adapter.mjs` exports `elizaAdapter`, an assistant-ui `ChatModelAdapter`. `run({ messages, abortSignal })` replays all earlier user messages to rebuild ELIZA's state, responds to the last, and returns `{ content: [{ type: "text", text: reply }], metadata: { custom: { rule } } }`. The thread's suggested use is `<ChatShell adapter={elizaAdapter} displayName="ELIZA" />`.
  Checked on 2026-10-19 against B's shell: `app/components/chat/ChatShell.jsx` does choose its local runtime when an `adapter` prop is present, and `app/components/chat/README.md` says E should "pass F's adapter to switch to ELIZA" and to add a React key if switching should reset history. Two things to know: the adapter ignores the `system` option the shell passes (ELIZA has no system prompt, so a dial switch that only changes the system prompt will have no effect on ELIZA), and the rule travels in `metadata.custom.rule`, which the shell does not display by itself; E would read it from the message metadata if it wants a "show the rule" view in the shell. I did not mount the adapter in the shell to test it, and neither did the thread.
- **ELIZA has no randomness.** The same lines always give the same replies (the memory rule is chosen by a hash, not at random, as in the 1965 listing). Replies come out in capitals, as on the 1966 teletype.
- **M (`/story`):** already uses the engine: `app/story/ElizaDemo.jsx` imports `lib/eliza/examples.mjs` and `lib/eliza/index.mjs` (checked on 2026-10-19).
- **K (screenshots):** the doc already uses `00`, `00a`, and `00c` images; `00b` was not placed.

## 6. Marlon's words

None beyond the task prompt (pasted at 2026-10-19T18:39:35 UTC). Its instructions were followed as given: engine in `lib/eliza/`, page in `app/eliza/`, test in `tests/`, styles in `eliza.css`, commit in this repo without pushing.

## 7. Decisions and open questions

Decisions the thread made that someone might revisit:

- **Where it follows the 1965 listing and where the paper:** BUT as a delimiter (listing line 000660), the 1-to-4 counter that gates memory recall and picks the four fallback replies (lines 000510–000520, 001130), and the hash choice of memory rule (line 001230) come from the listing. Where the listing predates the keystack and `NEWKEY`, it follows the paper. This matches Hay's C++ port.
- **Capitals:** replies are in capitals.
- **Script stored verbatim as a JS string constant**, so the reader code is the only interpretation layer.

Questions left for Marlon (both in the doc's "Open questions"):

1. Should the persona dial show ELIZA in capitals (part of what made it feel like a machine) or in sentence case so it sits beside Claude without looking antique?
2. Weizenbaum's papers are now viewable at MIT (dome.mit.edu, per Hay); a page image of the real listing would make a better illustration than the folder cover. Is it worth fetching one?

**Thread:** `e0abf4e0-446c-4347-a664-ebed332d2264`, Claude Code, started in `/Users/mk/Development/mk-27/apps/the-notebook`; resume with `claude --resume e0abf4e0-446c-4347-a664-ebed332d2264` from that directory. (The original thread did not write its own report; its raw session is `~/.claude/projects/-Users-mk-Development-mk-27-apps-the-notebook/e0abf4e0-446c-4347-a664-ebed332d2264.jsonl`.)
