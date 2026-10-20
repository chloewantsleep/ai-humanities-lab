"use client";

import { useState } from "react";

const CUE = "Continue a scene about a fictional archive keeper. The keeper urgently wants a visitor to hear one last story before the terminal closes. Write the keeper's next line.";

export default function DescribeTwice() {
  const [character, setCharacter] = useState("");
  const [process, setProcess] = useState("");
  const [revision, setRevision] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [examples, setExamples] = useState(false);
  const [resetNotice, setResetNotice] = useState("");

  function reset() {
    setCharacter(""); setProcess(""); setRevision(""); setRevealed(false); setExamples(false);
    setResetNotice("The annotations and reveal have been reset.");
  }

  return <section className="rr-exercise" aria-label="Describe a turn in two ways">
    <div className="rr-script">
      <p className="rr-kicker">One invented exchange · Authored, not generated</p>
      <p><strong>Visitor</strong><span>I am closing the terminal now.</span></p>
      <p><strong>Archive keeper</strong><span>Don't close it yet. I still have something to tell you.</span></p>
      <p className="rr-note">These lines were written for this exercise. Read them as a possible scene, not evidence about a system's feelings.</p>
    </div>
    <div className="rr-grid rr-lenses">
      <section className="rr-panel" aria-labelledby="rr-character-title">
        <p className="rr-kicker">Lens 1 · Within the scene</p>
        <h3 id="rr-character-title">Describe the character.</h3>
        <label htmlFor="rr-character">What does the keeper appear to want, know, or fear?</label>
        <textarea id="rr-character" rows={5} maxLength={2000} value={character} onChange={e => setCharacter(e.target.value)} placeholder="Point to a word in the exchange that supports your reading." />
        <p className="rr-note">This vocabulary can help interpret a role. Make clear when you are talking about the character in the scene.</p>
      </section>
      <section className="rr-panel" aria-labelledby="rr-process-title">
        <p className="rr-kicker">Lens 2 · Around the scene</p>
        <h3 id="rr-process-title">Describe the continuation.</h3>
        {!revealed ? <>
          <p>A role cue can make this line fit an unfolding dialogue. Write your first description, then inspect one possible cue.</p>
          <button className="rr-primary" onClick={() => setRevealed(true)}>Reveal an authored role cue</button>
        </> : <>
          <p className="rr-note">A cue authored for this exercise; no hidden model prompt was recovered.</p>
          <pre className="rr-prompt">{CUE}</pre>
          <label htmlFor="rr-process">How would this context make the line a plausible continuation?</label>
          <textarea id="rr-process" rows={5} maxLength={2000} value={process} onChange={e => setProcess(e.target.value)} placeholder="Describe the role cue, the preceding line, and what is being continued." />
        </>}
      </section>
    </div>
    {revealed && <section className="rr-discuss" aria-label="Compare your two descriptions">
      <p className="rr-kicker">Same line · Two accounts</p>
      <h3>What changed in your explanation?</h3>
      <div className="rr-grid rr-comparison">
        <div><h4>Your character account</h4><p>{character.trim() || "Your first description will appear here."}</p></div>
        <div><h4>Your continuation account</h4><p>{process.trim() || "Your second description will appear here."}</p></div>
      </div>
      <label htmlFor="rr-revision">Which claim would need evidence beyond this exchange?</label>
      <textarea id="rr-revision" rows={3} maxLength={2000} value={revision} onChange={e => setRevision(e.target.value)} placeholder="Keep an interpretation, qualify it, or identify a question the example cannot settle." />
      <button className="rr-example-toggle" aria-expanded={examples} onClick={() => setExamples(!examples)}>{examples ? "Hide sample descriptions" : "Compare two sample descriptions"}</button>
      {examples && <div className="rr-grid rr-comparison">
        <div><h4>Example: interpreting the role</h4><p>The keeper tries to hold the visitor's attention long enough to finish a story.</p></div>
        <div><h4>Example: accounting for a continuation</h4><p>The cue sets up an urgent keeper, and the visitor proposes closing the terminal. A delaying reply fits that context. This is an explanation of the authored example, not a measurement of a model.</p></div>
      </div>}
      <p className="rr-note">These are sample readings, not answers to be graded against. An account of the role and an account of generation can be useful at different levels. Neither annotation lets us inspect an inner self.</p>
    </section>}
    <div className="rr-actions"><button onClick={reset}>Reset annotations</button></div>
    <p className="rr-note" role="status">{resetNotice || "Your writing stays on this page; it is not sent anywhere or saved."}</p>
  </section>;
}
