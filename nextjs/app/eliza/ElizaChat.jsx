"use client";

import { useEffect, useRef, useState } from "react";
import { MEN_ARE_ALL_ALIKE } from "../../lib/eliza/examples.mjs";
import { DOCTOR_SCRIPT, greeting, initialState, respond } from "../../lib/eliza/index.mjs";

const PAPER = new Map(MEN_ARE_ALL_ALIKE);

function Parts({ parts }) {
  return <ol className="eliza-parts">
    {parts.map((part, i) => <li key={i}><span>{i + 1}</span>{part ? <code>{part}</code> : <em>nothing</em>}</li>)}
  </ol>;
}

function Step({ step }) {
  const action = {
    reply: null,
    link: <>then go to the rules for <b>{step.link}</b></>,
    pre: <>rewrite as <code>{step.result}</code>, then go to <b>{step.link}</b></>,
    newkey: <>NEWKEY: try the next keyword</>,
  }[step.action];
  if (!step.decomposition) return <li className="eliza-step"><p><b>{step.keyword}</b> {step.action === "link" ? <>is linked to <b>{step.link}</b></> : step.action}</p></li>;
  return <li className="eliza-step">
    <p><b>{step.keyword}</b>{step.rank ? <span className="eliza-rank">rank {step.rank}</span> : null}</p>
    <dl>
      <dt>Decomposition</dt>
      <dd><code>{step.decomposition}</code> <span className="eliza-of">{step.decompositionIndex + 1} of {step.decompositionCount}</span></dd>
      <dt>Parts</dt>
      <dd><Parts parts={step.parts} /></dd>
      <dt>Reassembly</dt>
      <dd><code>{step.reassembly}</code> <span className="eliza-of">{step.reassemblyIndex + 1} of {step.reassemblyCount}</span></dd>
      {action && <><dt>Then</dt><dd>{action}</dd></>}
    </dl>
  </li>;
}

function Rule({ rule }) {
  const heading = {
    keyword: <>Keyword <b>{rule.chain?.[0]}</b></>,
    none: <>No keyword: the <b>NONE</b> rule</>,
    memory: <>No keyword: a <b>memory</b></>,
    nomatch: <>Keyword <b>{rule.keyword}</b>, but no decomposition fit</>,
  }[rule.kind];
  return <aside className="eliza-rule" aria-label="The rule behind this reply">
    <p className="eliza-rule-heading">{heading}</p>
    <dl className="eliza-reading">
      {rule.discarded.length > 0 && <><dt>Dropped</dt><dd>{rule.discarded.map((d, i) => <s key={i}>{d}</s>)}</dd></>}
      {rule.substitutions.length > 0 && <><dt>Swapped</dt><dd>{rule.substitutions.map(([a, b], i) => <span key={i} className="eliza-chip">{a} → {b}</span>)}</dd></>}
      <dt>Read as</dt><dd><code>{rule.clause || "(nothing)"}</code></dd>
      <dt>Keystack</dt><dd>{rule.keystack.length ? rule.keystack.map((k, i) => <span key={i} className="eliza-chip">{k}</span>) : <em>empty</em>}</dd>
    </dl>
    {rule.kind === "memory" && <p className="eliza-note">The counter is at 4 and the memory stack isn't empty, so ELIZA says the oldest stored memory.</p>}
    {rule.kind === "nomatch" && <p className="eliza-note">None of this keyword&rsquo;s decompositions fit the input, so ELIZA gives one of four replies built into the 1965 listing, chosen by the counter (now {rule.limit}).</p>}
    {rule.steps.length > 0 && <ol className="eliza-steps">{rule.steps.map((step, i) => <Step key={i} step={step} />)}</ol>}
    {rule.memory?.created && <p className="eliza-note">
      <b>MY</b> was on top, so a copy went on the memory stack: <code>{rule.memory.created}</code>. Rule {rule.memory.hash + 1} of 4 was chosen by hashing the last word, <code>{rule.memory.word}</code>.
    </p>}
    <p className="eliza-counter">Counter {rule.limit} of 4 · {rule.memories} in memory</p>
  </aside>;
}

export default function ElizaChat() {
  const [turns, setTurns] = useState([]);
  const [state, setState] = useState(initialState);
  const [draft, setDraft] = useState("");
  const [showRules, setShowRules] = useState(true);
  const [playing, setPlaying] = useState(false);
  const end = useRef(null);
  const live = useRef({ state, playing });
  live.current = { state, playing };

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [turns.length]);

  function say(text) {
    const result = respond(text, live.current.state);
    live.current.state = result.state;
    setState(result.state);
    setTurns(t => [...t, { said: text, reply: result.reply, rule: result.rule }]);
  }

  function send(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    say(draft.trim());
    setDraft("");
  }

  function reset() {
    live.current.playing = false;
    setPlaying(false);
    setTurns([]);
    setState(initialState());
    live.current.state = initialState();
  }

  async function play() {
    reset();
    live.current.playing = true;
    setPlaying(true);
    for (const [line] of MEN_ARE_ALL_ALIKE) {
      await new Promise(r => setTimeout(r, 900));
      if (!live.current.playing) return;
      say(line);
    }
    setPlaying(false);
  }

  return <div className={`eliza ${showRules ? "eliza-with-rules" : ""}`}>
    <div className="eliza-toolbar">
      <label><input type="checkbox" checked={showRules} onChange={e => setShowRules(e.target.checked)} /> Show the rule</label>
      <button type="button" onClick={play} disabled={playing}>{playing ? "Playing the 1966 exchange…" : "Play the 1966 exchange"}</button>
      <button type="button" onClick={reset}>Start over</button>
      <span className="eliza-state">Counter {state.limit} of 4 · memory stack: {state.memories.length || "empty"}</span>
    </div>

    <ol className="eliza-transcript" aria-live="polite">
      <li className="eliza-turn"><p className="eliza-line eliza-says">{greeting}</p></li>
      {turns.map((turn, i) => {
        const paper = PAPER.get(turn.said);
        return <li key={i} className="eliza-turn">
          <div className="eliza-lines">
            <p className="eliza-line eliza-you">{turn.said}</p>
            <p className="eliza-line eliza-says">{turn.reply}</p>
            {paper && <p className={`eliza-paper ${paper === turn.reply ? "same" : "differs"}`}>{paper === turn.reply ? "Same reply as in the 1966 paper" : `The paper has: ${paper}`}</p>}
          </div>
          {showRules && <Rule rule={turn.rule} />}
        </li>;
      })}
      <li ref={end} aria-hidden="true" />
    </ol>

    <form className="eliza-composer" onSubmit={send}>
      <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Tell ELIZA what's on your mind" aria-label="Your message" disabled={playing} autoComplete="off" />
      <button type="submit" disabled={playing || !draft.trim()}>Send</button>
    </form>

    {state.memories.length > 0 && <div className="eliza-memories">
      <p className="eyebrow">Memory stack (said when the counter reaches 4 and nothing has a keyword)</p>
      <ol>{state.memories.map((m, i) => <li key={i}><code>{m}</code></li>)}</ol>
    </div>}

    <details className="eliza-script">
      <summary>The whole DOCTOR script (1966)</summary>
      <p>&ldquo;An important property of ELIZA is that a script is data&rdquo; (Weizenbaum 1966, p. 37). This is the script the engine reads, as printed in the paper&rsquo;s appendix, from Anthony Hay&rsquo;s transcription.</p>
      <pre>{DOCTOR_SCRIPT.trim()}</pre>
    </details>
  </div>;
}
