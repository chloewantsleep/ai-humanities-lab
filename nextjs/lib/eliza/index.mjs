// ELIZA running Weizenbaum's 1966 DOCTOR script. See engine.mjs for the procedure and its sources.
//
//   import { greeting, initialState, respond } from "../../lib/eliza/index.mjs";
//   let state = initialState();
//   const { reply, rule, state: next } = respond("Men are all alike.", state);  // reply: "IN WHAT WAY"
//   state = next;
//
// rule says how the reply was made: kind ("keyword", "memory", "none" or "nomatch"), keyword, rank, decomposition,
// reassembly, parts, the keystack, the substitutions, and every step on the way (see describeRule for one line).

import { DOCTOR_SCRIPT } from "./doctor.mjs";
import { createEliza, describeRule } from "./engine.mjs";

export const doctor = createEliza(DOCTOR_SCRIPT);
export const { greeting, initialState, respond, replay } = doctor;
export { createEliza, describeRule, DOCTOR_SCRIPT };
