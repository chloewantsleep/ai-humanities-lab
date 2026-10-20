// Reads a script in the 1966 format (see doctor.mjs) into the structures the engine uses.
// The format is described in the paper, pp. 38-41: a greeting list, START, one list per keyword, and () at the end.

// Split script text into "(", ")" and words, dropping ; comments, and read them into nested arrays.
function readLists(text) {
  const tokens = [];
  for (const line of text.split("\n"))
    for (const m of line.replace(/;.*/, "").matchAll(/[()]|[^\s()]+/g)) tokens.push(m[0]);
  let i = 0;
  function read() {
    const token = tokens[i++];
    if (token !== "(") return token;
    const list = [];
    while (tokens[i] !== ")") {
      if (i >= tokens.length) throw new Error("script error: unbalanced parentheses");
      list.push(read());
    }
    i++;
    return list;
  }
  const items = [];
  while (i < tokens.length) items.push(read());
  return items;
}

// Lisp-style printing, for showing rules: [["0", "YOUR", "0"]] -> "(0 YOUR 0)"
export function show(item) {
  return Array.isArray(item) ? `(${item.map(show).join(" ")})` : item;
}

// A decomposition element: a number (that many words; 0 is any number), a word, (*A B C) for any of those words,
// or (/TAG) for any word carrying that DLIST tag.
function readPatternElement(element) {
  if (!Array.isArray(element)) return /^\d+$/.test(element) ? Number(element) : element;
  const words = element.join(" ").replace(/^\s*([*/])\s*/, "$1 ").trim().split(/\s+/);
  const kind = words.shift();
  if (kind === "*") return { any: words };
  if (kind === "/") return { tags: words };
  throw new Error(`script error: unknown pattern element ${show(element)}`);
}

// A link to another keyword's rules, written (=WHAT) or (= WHAT).
function readLink(list) {
  if (!Array.isArray(list) || !list.length || !String(list[0]).startsWith("=")) return null;
  return list[0] === "=" ? list[1] : list[0].slice(1);
}

// A reassembly rule: words and numbers, or NEWKEY, or a link, or (PRE (reassembly) (=KEYWORD)).
function readReassembly(list) {
  const link = readLink(list);
  if (link) return { link, source: show(list) };
  if (list.length === 1 && list[0] === "NEWKEY") return { newkey: true, source: show(list) };
  if (list[0] === "PRE") return { pre: list[1], link: readLink(list[2]), source: show(list) };
  return { words: list, source: show(list) };
}

function readTransformation(list) {
  const [decomposition, ...reassemblies] = list;
  return {
    pattern: decomposition.map(readPatternElement),
    source: show(decomposition),
    reassemblies: reassemblies.map(readReassembly),
  };
}

// (KEYWORD [= SUBSTITUTE] [DLIST(/TAGS)] [RANK] [transformations...] [(=LINK)])
function readKeyword(list) {
  const [keyword, ...rest] = list;
  const rule = { keyword, substitute: null, tags: [], rank: 0, transformations: [], link: null, source: show(list) };
  for (let i = 0; i < rest.length; i++) {
    const item = rest[i];
    if (item === "=") rule.substitute = rest[++i];
    else if (item === "DLIST") rule.tags = rest[++i].join(" ").replace(/\//g, " ").trim().split(/\s+/).filter(Boolean);
    else if (/^\d+$/.test(item)) rule.rank = Number(item);
    else if (Array.isArray(item) && Array.isArray(item[0])) rule.transformations.push(readTransformation(item));
    else if (readLink(item)) rule.link = readLink(item);
    else throw new Error(`script error in ${keyword}: did not expect ${show(item)}`);
  }
  return rule;
}

// (MEMORY MY (0 YOUR 0 = LETS DISCUSS FURTHER WHY YOUR 3) ...): four transformations, each one decomposition and one
// reassembly, separated by "=".
function readMemory(list) {
  const [, keyword, ...transformations] = list;
  return {
    keyword,
    source: show(list),
    transformations: transformations.map(t => {
      const split = t.indexOf("=");
      return {
        pattern: t.slice(0, split).map(readPatternElement),
        source: show(t.slice(0, split)),
        reassembly: { words: t.slice(split + 1), source: show(t.slice(split + 1)) },
      };
    }),
  };
}

export function parseScript(text) {
  const items = readLists(text);
  const [greeting, start, ...lists] = items;
  if (start !== "START") throw new Error("script error: expected START after the greeting");
  const script = { greeting: greeting.join(" "), keywords: new Map(), none: null, memory: null, tags: new Map() };
  for (const list of lists) {
    if (!Array.isArray(list) || !list.length) continue; // the closing ()
    if (list[0] === "MEMORY") script.memory = readMemory(list);
    else if (list[0] === "NONE") script.none = readKeyword(list);
    else script.keywords.set(list[0], readKeyword(list));
  }
  if (!script.none) throw new Error("script error: no NONE rule");
  if (!script.memory || script.memory.transformations.length !== 4) throw new Error("script error: MEMORY needs four transformations");
  // DLIST tags: e.g. BELIEF -> [FEEL, THINK, BELIEVE, WISH]
  for (const rule of script.keywords.values())
    for (const tag of rule.tags) script.tags.set(tag, [...(script.tags.get(tag) || []), rule.keyword]);
  return script;
}
