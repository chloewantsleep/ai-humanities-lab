---
title: ELIZA
description: "Weizenbaum's 1966 DOCTOR script, running in the browser, with its rules visible."
route: /eliza
status: working
group: "Before the assistant"
order: 1
---

## What it shows

ELIZA had no model of the world and no memory beyond a few stored phrases; it matched keywords and reflected the user's words back. People confided in it anyway. Weizenbaum's secretary, who had watched him build it for months, asked him to leave the room after a few exchanges (*Computer Power and Human Reason*, 1976, p. 6).

The rule view is the argument: every reply that seemed to listen came from a keyword, a template, and a pronoun swap.

## What was built

- **A chat with ELIZA** running Weizenbaum's DOCTOR script from the appendix of the 1966 paper. ELIZA greets you with the script's first line, HOW DO YOU DO. PLEASE TELL ME YOUR PROBLEM, and answers in capitals without punctuation, as the 1966 teletype did.
- **Show the rule** (on by default): beside each reply, a card shows how it was made. It lists the phrase ELIZA dropped (it keeps only the first phrase or sentence that has a keyword), the words it swapped (MY → YOUR, I → YOU), the sentence as it read it, and the keystack (the keywords found, highest rank on top). Then come the steps: each keyword's decomposition pattern with the parts it cut the sentence into (numbered, because the reply refers to them by number), the reassembly template it used and where that template is in its cycle ("2 of 4"), and any link to another keyword's rules. When MY is the keyword, the card shows the copy of the sentence ELIZA saved on its memory stack for later.
- **Play the 1966 exchange** types the paper's "Men are all alike" conversation, one line a second, and marks each reply that is the same as in the paper. All fifteen are.
- **The counter and the memory stack**, shown above the chat and below it: ELIZA counts inputs from 1 to 4 and repeats; it brings back a saved memory only when the count is 4 and you've said nothing with a keyword in it. That is how "Bullies." gets DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR BOYFRIEND MADE YOU COME HERE, twelve lines after the boyfriend came up.
- **The whole DOCTOR script** at the bottom of the page, because "an important property of ELIZA is that a script is data" (Weizenbaum 1966, p. 37). The engine reads that text, not a translation of it.

To try it: open [/eliza](/eliza), press **Play the 1966 exchange**, and read the rule cards; then type your own lines. Questions work (ELIZA's users couldn't type a question mark, which deleted the line on the MAC system; here ? ends a sentence). Things to try: "I remember my mother", "computers frighten me", "Can we talk?" (no rule fits: ELIZA says one of four built-in replies), "You are like my father", "I dreamt I was flying".

![The 1966 exchange as printed in the paper, reproduced here line for line. A later ELIZA (Norbert Landsteiner's elizabot.js, 2005, at masswerk.at) answers the same first lines differently: WHAT RESEMBLENCE DO YOU SEE ?, REALLY, ALWAYS ?](../history/_images/00-eliza-1966.png)

![Wikipedia's ELIZA screenshot: elizabot.js again, with a different DOCTOR. Most "ELIZA" on the web is a re-implementation of this kind, not the 1966 script.](../history/_images/00a-eliza-conversation-wikipedia.png)

![The folder in Weizenbaum's papers at MIT (MC-0383, box 8) labelled COMPUTER CONVERSATIONS (1965), where Jeff Shrager found the ELIZA listing in 2021; released CC0.](../history/_images/00c-eliza-original-mad-slip-source-1966-cc0.png)

## How faithful it is

The engine (`nextjs/lib/eliza/`) follows the procedure in the 1966 paper, runs the paper's own script, and takes three behaviours from the 1965 MAD-SLIP listing that the paper leaves out or gets wrong:

1. **BUT ends a phrase**, like a comma or period. The paper names only the comma and the period (p. 37), but line 000660 of the listing tests for `$.$`, `$,$` and `$BUT$`. Without this, the paper's own line "You are not very aggressive but I think you don't want me to notice that" would get a longer reply than the one printed.
2. **"A certain counting mechanism"** (p. 41) is the variable LIMIT, which goes 1, 2, 3, 4, 1 with each input; a memory is recalled only when it is 4 (lines 000510–000520, 001130). The same counter picks which of four built-in replies (PLEASE CONTINUE, HMMM, GO ON , PLEASE, I SEE) ELIZA gives when a keyword's patterns all fail (lines 002200–002260).
3. **Which memory gets saved is not random.** The paper says one of the four MEMORY transformations "is randomly selected" (p. 41); line 001230 chooses it with SLIP's HASH of the input's last word. HASH (the middle bits of the word squared, in the 7094's six-bit character code) was found in Weizenbaum's papers in 2022; the engine implements it and checks it against the paper's example (ALWAYS hashes to 14 in seven bits, p. 38) and against the exchange (HERE must pick the fourth memory). So ELIZA has no randomness at all: the same lines always get the same replies.

The listing is an earlier version than the one the paper describes: it has no keystack and no NEWKEY, which the published script relies on. Where the two differ in that way, the engine follows the paper. These are the same choices Anthony Hay made in his C++ ELIZA, which reproduces the paper's conversation; this engine is a JavaScript reading of the paper checked against his, and the test also runs thirteen further lines of a conversation Hay published, with identical replies.

Not reproduced: the 1966 EDIT command (and the listing's `+` and `*` script-changing commands), and one quirk Hay reports in the listing's keyword table (keywords whose hashes collide may shadow each other). Input is upper-cased, curly quotes are straightened, and ! ? : ; and dashes are read as periods or commas, as in Hay's version.

The test is `nextjs/tests/eliza.test.mjs` (`pnpm test` from `nextjs/`): the fifteen lines of the paper, the rules behind several of them (the link from ALIKE to DIT, the dropped "WELL ,", BUT as a delimiter, the keystack order, the memory recall at count 4), the HASH values, Hay's continuation, and the chat-shell adapter.

## For the other experiments

The engine takes a message and the state, and returns the reply, the rule, and the next state. The state is plain JSON (`{ limit, memories, cursors }`), and `respond` never changes the state it's given.

```js
import { greeting, initialState, respond, describeRule } from "../../lib/eliza/index.mjs";

let state = initialState();
const { reply, rule, state: next } = respond("Men are all alike.", state);
// reply: "IN WHAT WAY"
// describeRule(rule): "ALIKE → DIT: (0) → (IN WHAT WAY)"
state = next;
```

`rule.kind` is `keyword`, `memory`, `none` (no keyword: the NONE rule), or `nomatch`; `rule.steps` lists every keyword tried, with its decomposition, parts, reassembly and what happened next. For the shared chat shell (task B) there is an assistant-ui adapter that rebuilds the state from the thread each turn and puts the rule in the message's `metadata.custom.rule`:

```js
import { elizaAdapter } from "../../lib/eliza/adapter.mjs";
<ChatShell adapter={elizaAdapter} displayName="ELIZA" />
```

`createEliza(scriptText)` runs any script in the 1966 format, if someone wants to write their own.

## Sources

- Joseph Weizenbaum, "ELIZA—A Computer Program for the Study of Natural Language Communication Between Man and Machine," *Communications of the ACM* 9, no. 1 (January 1966): 36–45. [PDF](https://web.stanford.edu/class/linguist238/p36-weizenabaum.pdf). The exchange is on pp. 36–37 and the DOCTOR script in the appendix.
- The DOCTOR script as text: Anthony Hay's verbatim transcription of the appendix (2020), [`scripts/ELIZA-script-DOCTOR-original-1966-CACM-appendix.txt`](https://github.com/anthay/ELIZA/blob/master/scripts/ELIZA-script-DOCTOR-original-1966-CACM-appendix.txt), copied unchanged into `lib/eliza/doctor.mjs`.
- The 1965 MAD-SLIP listing: the CC0 transcription at elizagen.org, [`1965_Weizenbaum_MAD-SLIP/MAD-SLIP_transcription.txt`](https://github.com/jeffshrager/elizagen.org/blob/master/1965_Weizenbaum_MAD-SLIP/MAD-SLIP_transcription.txt); the line numbers above are the listing's, checked in that transcription. Jeff Shrager's account of finding it: [elizagen.org, "The original ELIZA"](https://sites.google.com/view/elizagen-org/the-original-eliza).
- Anthony Hay, [*A Simulation in C++ of Joseph Weizenbaum's 1966 ELIZA*](https://github.com/anthay/ELIZA) and his notes on what the listing shows ([part 2](https://github.com/anthay/ELIZA/blob/master/doc/Eliza_part_2.md)) and on HASH ([part 3](https://github.com/anthay/ELIZA/blob/master/doc/Eliza_part_3.md)).
- Joseph Weizenbaum, *Computer Power and Human Reason* (W. H. Freeman, 1976), p. 6, for the secretary (quoted in Hay's part 3; not checked against the book).

## Open questions

- Should the persona dial (task E) show ELIZA's replies in capitals, as here, or in sentence case, so it sits beside Claude without looking antique? The capitals are part of what made it feel like a machine.
- Weizenbaum's papers are now viewable at MIT ([dome.mit.edu](https://dome.mit.edu/handle/1721.3/201698), per Hay); a page image of the listing itself would make a better illustration than the folder.
