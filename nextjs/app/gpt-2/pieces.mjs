// Each engine step carries the cumulative continuation; a token's own piece is the new tail. Partial UTF-8 bytes can
// show as "�" until the next token completes them, so when the text so far changes, trim earlier pieces back.
export function addPiece(pieces, text) {
  const joined = pieces.join("");
  if (text.startsWith(joined)) return [...pieces, text.slice(joined.length)];
  let keep = 0;
  while (keep < joined.length && joined[keep] === text[keep]) keep++;
  const next = [];
  let used = 0;
  for (const piece of pieces) {
    next.push(piece.slice(0, Math.max(0, keep - used)));
    used += piece.length;
  }
  return [...next, text.slice(keep)];
}

// Where an answer could have ended: the first line break after the continuation has said something.
export function firstBreak(pieces) {
  let said = false;
  for (let i = 0; i < pieces.length; i++) {
    for (const ch of pieces[i]) {
      if (ch === "\n" && said) return i;
      if (ch.trim()) said = true;
    }
  }
  return -1;
}

export const END_TOKENS = ["<|endoftext|>", "<|im_end|>", "<eos>", "<end_of_turn>"];
