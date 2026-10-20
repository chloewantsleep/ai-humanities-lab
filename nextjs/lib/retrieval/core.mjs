// The retrieval half of a first-generation custom GPT, small enough to read: split texts into passages, score
// every passage against a question, keep the top few, and paste them into the prompt. Shared by the /retrieval
// page and scripts/build-retrieval-index.mjs.

export const MODEL = "Xenova/all-MiniLM-L6-v2";
export const DIMS = 384;
export const TARGET = 700; // characters per passage, roughly

// Paragraphs are kept whole and merged up to TARGET characters; a paragraph longer than twice TARGET is cut at
// sentence ends. Each passage remembers the last heading above it, so a result can say where it came from.
export function chunk(body, target = TARGET) {
  const passages = [];
  let heading = "", buffer = [], size = 0;
  const flush = () => {
    if (buffer.length) passages.push({ heading, text: buffer.join("\n\n") });
    buffer = []; size = 0;
  };
  for (const raw of body.split(/\n\s*\n/)) {
    const para = raw.trim();
    if (!para || /^(\*\s*){3,}$|^-{3,}$/.test(para)) continue;
    const h = para.match(/^#{1,6}\s+(.*)$/);
    if (h && !para.includes("\n")) { flush(); heading = h[1].replace(/[*_]/g, "").trim(); continue; }
    const pieces = para.length > target * 2 ? para.match(new RegExp(`[^]{1,${target}}(?:[.!?;:]["'”’)]*\\s|$)`, "g")) ?? [para] : [para];
    for (const piece of pieces) {
      if (!piece.trim()) continue;
      if (size && size + piece.length > target) flush();
      buffer.push(piece.trim()); size += piece.length;
    }
  }
  flush();
  return passages;
}

// Vectors are normalized, so the dot product is the cosine similarity. Stored ones are int8 (value × 127).
export function decodeVectors(base64) {
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new Int8Array(bytes.buffer);
}

export function cosine(query, vectors, index, scale = 127) {
  let sum = 0;
  const offset = index * DIMS;
  for (let k = 0; k < DIMS; k++) sum += vectors[offset + k] * query[k];
  return sum / scale;
}

// Keyword search for comparison: BM25 over lower-cased words, with no notion of meaning.
const STOP = new Set("a an and are as at be but by do does for from had has have he her his i if in is it its me my not of on or she so that the their them they this to was we were what when which who why will with you your".split(" "));
export const words = text => (text.toLowerCase().match(/[a-zÀ-ɏ']+/g) ?? []).map(w => w.replace(/^'+|'+$/g, "")).filter(w => w && !STOP.has(w));

export function keywordIndex(passages) {
  const docs = passages.map(p => words(p.text));
  const df = new Map();
  for (const doc of docs) for (const w of new Set(doc)) df.set(w, (df.get(w) ?? 0) + 1);
  const avg = docs.reduce((n, d) => n + d.length, 0) / (docs.length || 1);
  return { docs, df, avg, n: docs.length };
}

export function bm25(index, query, i, k1 = 1.2, b = 0.75) {
  const doc = index.docs[i];
  let score = 0;
  for (const term of new Set(words(query))) {
    const tf = doc.filter(w => w === term).length;
    if (!tf) continue;
    const df = index.df.get(term);
    const idf = Math.log(1 + (index.n - df + 0.5) / (df + 0.5));
    score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc.length / index.avg));
  }
  return score;
}

export function topK(scores, k) {
  return scores.map((score, i) => ({ i, score })).sort((a, b) => b.score - a.score).slice(0, k);
}

// What the bot is actually sent: the instructions, then the retrieved passages, labelled so it can cite them.
export function buildSystem(instructions, results) {
  const sources = results.map((r, n) => `[${n + 1}] ${r.title}${r.heading ? ` — ${r.heading}` : ""}\n${r.text}`).join("\n\n");
  return `${instructions.trim()}\n\n<retrieved_passages>\n${sources || "(none retrieved)"}\n</retrieved_passages>`;
}
