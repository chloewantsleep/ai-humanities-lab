// ELIZA's procedure as Weizenbaum describes it in the 1966 paper (CACM 9(1), pp. 36-45; page numbers below), with three
// behaviours the paper leaves out or gets wrong, taken from the 1965 MAD-SLIP listing found in his MIT papers
// (transcription: 1965_Weizenbaum_MAD-SLIP/MAD-SLIP_transcription.txt in github.com/jeffshrager/elizagen.org;
// line numbers below are the listing's):
//   1. BUT is a delimiter, like the comma and the period (line 000660).
//   2. "A certain counting mechanism" (p. 41) is LIMIT, which counts inputs 1, 2, 3, 4, 1, ...; a memory is recalled
//      only when LIMIT is 4 (lines 000510-000520, 001130).
//   3. The MEMORY transformation is chosen by HASH of the input's last word, not at random (line 001230; hash.mjs).
// Where the listing differs from the paper in other ways (it predates the keystack and NEWKEY), this follows the
// paper, because the published DOCTOR script needs them. The same choices are made in Anthony Hay's C++ ELIZA
// (github.com/anthay/ELIZA), which reproduces the paper's conversation; this is a JavaScript port of that reading.
//
// The engine is pure: respond(message, state) returns the reply, the rule that produced it, and the next state.
// State is plain JSON, so a page can keep it in React state or rebuild it from the user's messages (replay).

import { hash, lastCellAsBcd } from "./hash.mjs";
import { parseScript } from "./script.mjs";

// The hard-coded replies for a keyword whose decompositions all fail, chosen by LIMIT (lines 002200-002260).
const NOMATCH = ["PLEASE CONTINUE", "HMMM", "GO ON , PLEASE", "I SEE"];
const DELIMITERS = new Set([",", ".", "BUT"]);

// Upper-case the text and split it into words, with commas and periods as words of their own. The paper's users could
// not type a question mark (p. 36: it deleted the line); here ? and ! end a sentence like a period.
export function readInput(text) {
  const upper = String(text).toUpperCase()
    .replace(/’/g, "'")
    .replace(/[‘"«»‚-‟‹›¡¿]/g, " ")
    .replace(/[!?]/g, ".")
    .replace(/[:;–—]/g, ",");
  return upper.match(/[,.]|[^\s,.]+/g) || [];
}

function matchesWord(element, word, tags) {
  if (typeof element === "string") return element === word;
  if (element.any) return element.any.includes(word);
  return element.tags.some(tag => tags.get(tag)?.includes(word));
}

// Match a decomposition pattern against the words (p. 38). Returns one part per pattern element, or null.
// A 0 takes as few words as it can, so the leftmost 0 is the shortest.
export function match(pattern, words, tags) {
  if (!pattern.length) return words.length ? null : [];
  const [head, ...rest] = pattern;
  if (head === 0) {
    for (let n = 0; n <= words.length; n++) {
      const tail = match(rest, words.slice(n), tags);
      if (tail) return [words.slice(0, n).join(" "), ...tail];
    }
    return null;
  }
  if (typeof head === "number") {
    if (words.length < head) return null;
    const tail = match(rest, words.slice(head), tags);
    return tail && [words.slice(0, head).join(" "), ...tail];
  }
  if (!words.length || !matchesWord(head, words[0], tags)) return null;
  const tail = match(rest, words.slice(1), tags);
  return tail && [words[0], ...tail];
}

// Build a reply from a reassembly rule: a number n is replaced by the nth part of the decomposition (p. 38).
export function reassemble(template, parts) {
  return template.flatMap(item => {
    if (!/^\d+$/.test(item)) return [item];
    const part = parts[Number(item) - 1];
    if (part === undefined) return ["HMMM"];
    return part ? part.split(" ") : [];
  });
}

export function createEliza(scriptText) {
  const script = parseScript(scriptText);
  const { keywords, tags, memory, none } = script;

  function initialState() {
    return { limit: 1, memories: [], cursors: {} };
  }

  // Apply one keyword's transformations to the words (pp. 39-41). Returns what to do next.
  function transform(rule, words, state, steps) {
    const index = rule.transformations.findIndex(t => match(t.pattern, words, tags));
    if (index < 0) {
      if (rule.link) {
        steps.push({ keyword: rule.keyword, rank: rule.rank, action: "link", link: rule.link, text: words.join(" ") });
        return { link: rule.link };
      }
      steps.push({ keyword: rule.keyword, rank: rule.rank, action: "no decomposition matched", text: words.join(" ") });
      return { nomatch: true };
    }
    const t = rule.transformations[index];
    const parts = match(t.pattern, words, tags);
    // Each decomposition's reassembly rules are used in turn (p. 39).
    const key = `${rule.keyword} ${index}`;
    const used = state.cursors[key] ?? 0;
    state.cursors[key] = (used + 1) % t.reassemblies.length;
    const r = t.reassemblies[used];
    const step = {
      keyword: rule.keyword, rank: rule.rank, text: words.join(" "),
      decomposition: t.source, decompositionIndex: index, decompositionCount: rule.transformations.length, parts,
      reassembly: r.source, reassemblyIndex: used, reassemblyCount: t.reassemblies.length,
    };
    steps.push(step);
    if (r.newkey) {
      step.action = "newkey";
      return { newkey: true };
    }
    if (r.pre) {
      const pre = reassemble(r.pre, parts);
      Object.assign(step, { action: "pre", link: r.link, result: pre.join(" ") });
      return { link: r.link, words: pre };
    }
    if (r.link) {
      Object.assign(step, { action: "link", link: r.link });
      return { link: r.link };
    }
    const reply = reassemble(r.words, parts);
    Object.assign(step, { action: "reply", result: reply.join(" ") });
    return { reply };
  }

  function respond(message, previous = initialState()) {
    const state = structuredClone(previous);
    state.limit = (state.limit % 4) + 1;

    // Scan for keywords (pp. 37-39): keep only the first phrase that has one, substitute words (MY -> YOUR, I -> YOU)
    // as they are read, and stack the keywords, highest rank on top.
    let words = readInput(message);
    const discarded = [];
    const substitutions = [];
    const keystack = [];
    let topRank = 0;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (DELIMITERS.has(word)) {
        if (!keystack.length) {
          discarded.push(words.slice(0, i + 1).join(" "));
          words = words.slice(i + 1);
          i = -1;
          continue;
        }
        const rest = words.slice(i).join(" ");
        if (rest !== ".") discarded.push(rest); // a sentence's own final period isn't worth showing
        words = words.slice(0, i);
        break;
      }
      const rule = keywords.get(word);
      if (!rule) continue;
      if (rule.transformations.length || rule.link) {
        if (rule.rank > topRank) {
          keystack.unshift(word);
          topRank = rule.rank;
        } else keystack.push(word);
      }
      if (rule.substitute) {
        substitutions.push([word, rule.substitute]);
        words[i] = rule.substitute;
      }
    }

    const trace = {
      input: message, limit: state.limit, discarded, substitutions, keystack: [...keystack], clause: words.join(" "),
      steps: [], memory: null,
    };
    const finish = (reply, kind, extra = {}) => {
      const last = trace.steps.at(-1);
      const rule = { kind, ...trace, ...extra };
      if (kind === "keyword" && last) {
        Object.assign(rule, {
          keyword: last.keyword, rank: last.rank, decomposition: last.decomposition, reassembly: last.reassembly,
          parts: last.parts, chain: trace.steps.map(s => s.keyword),
        });
      }
      rule.memories = state.memories.length;
      return { reply, rule, state };
    };

    // No keywords: recall a memory if the counter says so (p. 41; line 001130).
    if (!keystack.length && state.limit === 4 && state.memories.length) {
      const recalled = state.memories.shift();
      trace.memory = { recalled };
      return finish(recalled, "memory");
    }

    while (keystack.length) {
      const keyword = keystack.shift();
      const rule = keywords.get(keyword);
      if (!rule) return finish(NOMATCH[state.limit - 1], "nomatch", { keyword });
      // Whenever the MEMORY keyword (MY) comes to the top, lay down a transformed copy of the text (p. 41).
      if (keyword === memory.keyword) {
        const word = words.at(-1) ?? "";
        const index = hash(lastCellAsBcd(word), 2);
        const t = memory.transformations[index];
        const parts = match(t.pattern, words, tags);
        if (parts) {
          const text = reassemble(t.reassembly.words, parts).join(" ");
          state.memories.push(text);
          trace.memory = { created: text, word, hash: index, decomposition: t.source, reassembly: t.reassembly.source };
        }
      }
      const next = transform(rule, words, state, trace.steps);
      if (next.reply) return finish(next.reply.join(" "), "keyword");
      if (next.nomatch) return finish(NOMATCH[state.limit - 1], "nomatch", { keyword });
      if (next.words) words = next.words;
      if (next.link) keystack.unshift(next.link);
    }

    // Nothing applied: the NONE rule always does (p. 41).
    const fallback = transform(none, words, state, trace.steps);
    return finish(fallback.reply.join(" "), "none", { keyword: "NONE", reassembly: trace.steps.at(-1).reassembly });
  }

  // Rebuild the state from the user's side of a conversation (for chat runtimes that keep only the messages).
  function replay(userMessages) {
    let state = initialState();
    for (const message of userMessages) state = respond(message, state).state;
    return state;
  }

  return { script, greeting: script.greeting, initialState, respond, replay };
}

// One line saying how a reply was made, for compact displays.
export function describeRule(rule) {
  if (rule.kind === "memory") return `no keyword, counter at 4: recalled a memory`;
  if (rule.kind === "nomatch") return `${rule.keyword}: no decomposition matched, so a built-in reply`;
  const last = rule.steps.at(-1);
  const via = rule.steps.length > 1 ? `${rule.steps.map(s => s.keyword).join(" → ")}: ` : `${last.keyword}: `;
  return `${rule.kind === "none" ? "no keyword: " : ""}${via}${last.decomposition} → ${last.reassembly}`;
}
