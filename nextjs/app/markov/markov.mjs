// A Markov chain built from counts: no model, no training, only a table of what followed what.

// Turn the passages into one token stream, remembering which passage each token came from.
export function tokenize(passages, mode) {
  const tokens = [];
  const where = [];
  passages.forEach((p, pi) => {
    const clean = p.text.replace(/[_*]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return;
    const parts = mode === "char" ? Array.from(clean + " ") : clean.split(" ");
    for (const t of parts) { tokens.push(t); where.push(pi); }
  });
  return { tokens, where };
}

const SEP = "\u0001";
export const keyOf = (arr) => arr.join(SEP);

// table: state (the last n tokens) -> Map(next token -> positions in the corpus where that next token occurs)
export function build(tokens, order) {
  const table = new Map();
  for (let p = order; p < tokens.length; p++) {
    const key = keyOf(tokens.slice(p - order, p));
    let nexts = table.get(key);
    if (!nexts) table.set(key, (nexts = new Map()));
    const list = nexts.get(tokens[p]);
    if (list) list.push(p); else nexts.set(tokens[p], [p]);
  }
  return table;
}

// The followers of a state, most frequent first.
export function followers(table, state) {
  const nexts = table.get(keyOf(state));
  if (!nexts) return [];
  return [...nexts].map(([token, positions]) => ({ token, count: positions.length, positions }))
    .sort((a, b) => b.count - a.count);
}

// Draw one follower in proportion to its count.
export function draw(rows, rand = Math.random) {
  const total = rows.reduce((s, r) => s + r.count, 0);
  let x = rand() * total;
  for (const r of rows) { x -= r.count; if (x < 0) return r; }
  return rows[rows.length - 1];
}

// A seed: n tokens from a random place, at a sentence start when the tokens are words.
export function seed(tokens, order, mode, rand = Math.random) {
  for (let tries = 0; tries < 200; tries++) {
    const p = Math.floor(rand() * (tokens.length - order - 1));
    if (mode === "char" || tries > 150 || p === 0 || /[.!?]["'’”]?$/.test(tokens[p - 1])) {
      return { state: tokens.slice(p, p + order), positions: Array.from({ length: order }, (_, i) => [p + i]) };
    }
  }
}

// Copying: candidates[i] are corpus positions where output tokens ...i match the source word for word.
// Continue the run when some candidate follows one of the previous step's; otherwise the run restarts
// at the start of the current state (the chain always matches its last n + 1 tokens).
export function extendRun(prevCandidates, positions, prevRunStart, i, order) {
  const prev = new Set(prevCandidates);
  const cont = positions.filter((p) => prev.has(p - 1));
  if (cont.length) return { candidates: cont, runStart: prevRunStart };
  return { candidates: positions, runStart: Math.max(0, i - order) };
}
