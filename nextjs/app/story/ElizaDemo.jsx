"use client";

import { useEffect, useRef, useState } from "react";
import { MEN_ARE_ALL_ALIKE } from "../../lib/eliza/examples.mjs";
import { describeRule, initialState, respond } from "../../lib/eliza/index.mjs";

// ELIZA in the panel: the opening of the paper's conversation, then the reader's turn. Replies come from the DOCTOR
// script in lib/eliza (task F); the line under each reply says which rule made it. Full version at /eliza.

const OPENING = MEN_ARE_ALL_ALIKE.slice(0, 4);

export default function ElizaDemo() {
  const [turns, setTurns] = useState([]);
  const [state, setState] = useState(initialState);
  const [draft, setDraft] = useState("");
  const log = useRef(null);

  // Replay the paper's opening through the engine, so the replies are the engine's own.
  useEffect(() => {
    let s = initialState();
    const replayed = OPENING.map(([user]) => {
      const out = respond(user, s);
      s = out.state;
      return { user, reply: out.reply, rule: describeRule(out.rule) };
    });
    setTurns(replayed);
    setState(s);
  }, []);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [turns]);

  function send(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const out = respond(text, state);
    setState(out.state);
    setTurns((t) => [...t, { user: text, reply: out.reply, rule: describeRule(out.rule), yours: true }]);
    setDraft("");
  }

  return (
    <div className="eliza-demo">
      <p className="dialogue-heading">ELIZA · DOCTOR script (1966)</p>
      <ol className="eliza-demo-log" ref={log} aria-live="polite">
        {turns.map((turn, i) => (
          <li key={i}>
            <p className="eliza-demo-user">{turn.user}</p>
            <p className="eliza-demo-reply">{turn.reply}</p>
            <p className="eliza-demo-rule">{turn.rule}</p>
          </li>
        ))}
      </ol>
      <form className="eliza-demo-form" onSubmit={send}>
        <label className="sr-only" htmlFor="eliza-demo-input">Message ELIZA</label>
        <input id="eliza-demo-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message." autoComplete="off" />
        <button type="submit">Send</button>
      </form>
      <p className="demo-more">The opening exchanges come from Weizenbaum’s paper (p. 36). <a href="/eliza">Open ELIZA and inspect the rules →</a></p>
    </div>
  );
}
