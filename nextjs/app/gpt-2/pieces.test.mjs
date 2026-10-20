import { test } from "node:test";
import assert from "node:assert/strict";
import { addPiece, firstBreak } from "./pieces.mjs";

test("pieces are the new tail of the cumulative text", () => {
  let p = [];
  for (const t of ["The", "The capital", "The capital\n", "The capital\nWhat"]) p = addPiece(p, t);
  assert.deepEqual(p, ["The", " capital", "\n", "What"]);
});

test("a replacement character is trimmed back when the next token completes it", () => {
  let p = addPiece([], "caf�");
  p = addPiece(p, "café!");
  assert.equal(p.join(""), "café!");
  assert.equal(p.length, 2);
});

test("the first line break after some text marks where an answer could end", () => {
  assert.equal(firstBreak(["\n", "I", "'m", " a", " man", ".", "\n", "I"]), 6);
  assert.equal(firstBreak(["\n", "\n"]), -1);
});
