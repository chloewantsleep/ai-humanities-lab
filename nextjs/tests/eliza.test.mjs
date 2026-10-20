import assert from "node:assert/strict";
import test from "node:test";
import { createElizaAdapter } from "../lib/eliza/adapter.mjs";
import { MEN_ARE_ALL_ALIKE } from "../lib/eliza/examples.mjs";
import { hash, lastCellAsBcd } from "../lib/eliza/hash.mjs";
import { describeRule, greeting, initialState, respond } from "../lib/eliza/index.mjs";

function converse(exchange) {
  let state = initialState();
  return exchange.map(([said]) => {
    const result = respond(said, state);
    state = result.state;
    return result;
  });
}

test("the greeting is the first line of the DOCTOR script", () => {
  assert.equal(greeting, "HOW DO YOU DO. PLEASE TELL ME YOUR PROBLEM");
});

test('reproduces the "Men are all alike" exchange from the 1966 paper', () => {
  const results = converse(MEN_ARE_ALL_ALIKE);
  results.forEach(({ reply }, i) => assert.equal(reply, MEN_ARE_ALL_ALIKE[i][1], `line ${i + 1}: ${MEN_ARE_ALL_ALIKE[i][0]}`));
});

test("the rules behind the exchange are the ones the paper describes", () => {
  const rules = converse(MEN_ARE_ALL_ALIKE).map(r => r.rule);
  assert.deepEqual(rules[0].chain, ["ALIKE", "DIT"]); // (ALIKE 10 (=DIT))
  assert.equal(rules[1].keyword, "ALWAYS");
  assert.deepEqual(rules[2].discarded, ["WELL ,"]); // the phrase before the comma has no keyword
  assert.deepEqual(rules[2].substitutions, [["MY", "YOUR"], ["ME", "YOU"]]);
  assert.equal(rules[2].decomposition, "(0 YOUR 0)");
  assert.equal(rules[2].reassembly, "(YOUR 3)");
  assert.equal(rules[2].memory.created, "DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR BOYFRIEND MADE YOU COME HERE");
  assert.equal(rules[3].steps[0].action, "pre"); // I'M -> (PRE (YOU ARE 3) (=I))
  assert.deepEqual(rules[3].chain, ["I'M", "I"]);
  assert.deepEqual(rules[9].keystack, ["LIKE", "YOU", "ARE", "MY"]); // LIKE (rank 10) on top, MY (2) below the rank-0 words
  assert.deepEqual(rules[10].discarded, ["BUT I THINK YOU DON'T WANT ME TO NOTICE THAT ."]); // BUT is a delimiter
  assert.equal(rules[14].kind, "memory");
  assert.equal(rules[14].limit, 4);
  assert.match(describeRule(rules[0]), /ALIKE → DIT: \(0\) → \(IN WHAT WAY\)/);
});

test("SLIP's HASH gives the values Weizenbaum's examples require", () => {
  assert.equal(hash(lastCellAsBcd("ALWAYS"), 7), 14); // the paper, p. 38: "The word 'always', for example, yields the integer 14."
  assert.equal(hash(lastCellAsBcd("HERE"), 2), 3); // the memory recalled at "Bullies." is the fourth MEMORY rule
  // From a 5 March 1965 conversation in Weizenbaum's papers, as worked out by Anthony Hay (doc/Eliza_part_3.md).
  assert.equal(hash(lastCellAsBcd("KIDS"), 2), 1);
  assert.equal(hash(lastCellAsBcd("TIME"), 2), 0);
  assert.equal(lastCellAsBcd("INVENTED"), lastCellAsBcd("ED"));
});

test("continues the conversation as Anthony Hay's C++ ELIZA does (doc/Eliza_part_1.md in github.com/anthay/ELIZA)", () => {
  const more = [
    ["My boyfriend loves me, he's not a bully.", "WHY DO YOU SAY YOUR BOYFRIEND LOVES YOU"],
    ["He annoys me sometimes, but I know he cares about me.", "YOU SAY YOU KNOW HE CARES ABOUT YOU"],
    ["That's why he wanted me to come here, because he knows I'm unhappy.", "WHY DO YOU ASK"],
    ["I didn't.", "CAN YOU ELABORATE ON THAT"],
    ["He knows I'm not getting on with my family and thought it would help me if I talked to someone.", "DO YOU THINK ITS LIKELY THAT YOU TALKED TO SOMEONE"],
    ["That's why I'm talking to you.", "DOES THAT QUESTION INTEREST YOU"],
    ["What question?", "WHAT IS IT YOU REALLY WANT TO KNOW"],
    ["How to have a good relationship with my parents.", "DOES THAT SUGGEST ANYTHING ELSE WHICH BELONGS TO YOU"],
    ["A brighter future?", "I AM NOT SURE I UNDERSTAND YOU FULLY"],
    ["If I could get on better with my parents I'd be a lot happier.", "DO YOU WISH THAT YOU COULD GET ON BETTER WITH YOUR PARENTS I'D BE A LOT HAPPIER"],
    ["I do.", "DO YOU SAY YOU DO FOR SOME SPECIAL REASON"],
    ["Not really.", "DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR MOTHER"],
    ["I'll never be as good as my sister in my mom's eyes.", "TELL ME MORE ABOUT YOUR FAMILY"],
  ];
  const all = [...MEN_ARE_ALL_ALIKE, ...more];
  converse(all).forEach(({ reply }, i) => assert.equal(reply, all[i][1], `line ${i + 1}: ${all[i][0]}`));
});

test("respond does not change the state it is given", () => {
  const state = initialState();
  const before = JSON.stringify(state);
  respond("Well, my boyfriend made me come here.", state);
  assert.equal(JSON.stringify(state), before);
});

test("the chat-shell adapter rebuilds ELIZA's state from the thread", async () => {
  const thread = [];
  const adapter = createElizaAdapter();
  for (const [said, expected] of MEN_ARE_ALL_ALIKE) {
    thread.push({ role: "user", content: [{ type: "text", text: said }] });
    const result = await adapter.run({ messages: thread, abortSignal: new AbortController().signal });
    assert.equal(result.content[0].text, expected);
    thread.push({ role: "assistant", content: result.content });
  }
});
