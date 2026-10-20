// SLIP's HASH(D,N) and the IBM 7094 character code it hashed. ELIZA uses it to choose which MEMORY transformation to
// apply: line 001230 of the 1965 listing is I=HASH.(BOT.(INPUT),2)+1, a 2-bit hash of the last word of the input.
// The paper says the choice is random (p. 41); the listing shows it is not. The FAP source of HASH was found in
// Weizenbaum's MIT papers in 2022 and transcribed by Anthony Hay (doc/Eliza_part_3.md in github.com/anthay/ELIZA):
// it returns the middle N bits of D squared. Everything here follows Hay's reading of it.

// 7090 BCD ("Hollerith") codes, six bits each; the index is the code. Code 014 is the prime (').
const BCD = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "=", "'", "", "", "",
  "+", "A", "B", "C", "D", "E", "F", "G", "H", "I", "", ".", ")", "", "", "",
  "-", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "", "$", "*", "", "", "",
  " ", "/", "S", "T", "U", "V", "W", "X", "Y", "Z", "", ",", "(", "", "", "",
];
const CODE = new Map(BCD.flatMap((c, i) => (c ? [[c, i]] : [])));

// A SLIP cell held six characters, left-justified and space-padded; a longer word ran on into further cells, and BOT
// returns the last cell. So "HERE" is hashed as "HERE  " and "INVENTED" as "ED    ".
export function lastCellAsBcd(word) {
  const start = word.length ? Math.floor((word.length - 1) / 6) * 6 : 0;
  const cell = word.slice(start).padEnd(6, " ");
  let datum = 0n;
  for (const c of cell) datum = (datum << 6n) | BigInt(CODE.get(c) ?? (c.charCodeAt(0) & 0x3f));
  return datum;
}

// The middle n bits of d squared (d taken as a 35-bit magnitude: the 36th bit was the sign).
export function hash(datum, n) {
  let d = BigInt(datum) & 0x7ffffffffn;
  d *= d;
  d >>= BigInt(35 - Math.floor(n / 2));
  return Number(d & ((1n << BigInt(n)) - 1n));
}
