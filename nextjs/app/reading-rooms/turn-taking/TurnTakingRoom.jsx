"use client";

import { useState } from "react";

const NAMES = { A: "Ari", B: "Bea", C: "Cam" };
const END = 2400;
const DURATION = 1600;
const SCALE = 6000;
const percent = (ms) => `${ms / SCALE * 100}%`;

export default function TurnTakingRoom() {
  const [selected, setSelected] = useState("B");
  const [volunteer, setVolunteer] = useState("B");
  const [continues, setContinues] = useState(true);
  const [offset, setOffset] = useState(0);
  const [bubbles, setBubbles] = useState(false);
  const [notice, setNotice] = useState("");

  const next = selected || volunteer || (continues ? "A" : null);
  const rule = selected ? "selected" : volunteer ? "self" : continues ? "continue" : "silence";
  // A speaker cannot overlap their own continuation in this teaching model.
  const shift = next === "A" ? Math.max(0, offset) : offset;
  const start = END + shift;
  const opening = selected ? `${NAMES[selected]}, what did you make of the ending?` : "What did you make of the ending?";
  const reply = next === "A" ? "I am still unsure what to make of it." : "I thought it left the question open.";
  const timing = !next ? "No next turn" : shift < 0 ? `${-shift} ms overlap` : shift > 0 ? `${shift} ms silence` : "0 ms gap / overlap";
  const explanation = {
    selected: `${NAMES[selected]} has been selected by Ari. In the paper's first rule, the selected participant has the next turn. An earlier start here makes overlap visible; it is not an instruction to interrupt.`,
    self: `${NAMES[volunteer]} self-selects because Ari did not select a next speaker. The paper gives the first starter the turn; this simplified room models only one volunteer.`,
    continue: "No next speaker was selected and nobody self-selected. Ari may continue; the allocation rules apply again at the next possible completion point.",
    silence: "Nobody takes the next turn and Ari does not continue. The room leaves the floor open. The paper considers how successive unused opportunities can develop into a lapse.",
  }[rule];

  function reset() {
    setSelected("B"); setVolunteer("B"); setContinues(true); setOffset(0); setBubbles(false);
    setNotice("Room reset. Default speaker choices and timing restored.");
  }

  return <div className="rr-exercise">
    <p className="rr-note">Authored diagram · No audio or model · All times and dialogue are invented</p>
    <div className="rr-grid rr-turn-controls">
      <section className="rr-panel" aria-labelledby="rr-allocation-title">
        <h3 id="rr-allocation-title">1. Allocate the next turn</h3>
        <label htmlFor="rr-selected">Does Ari select someone?</label>
        <select id="rr-selected" value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value="B">Ari selects Bea</option><option value="C">Ari selects Cam</option><option value="">No one is selected</option>
        </select>
        <label htmlFor="rr-volunteer">If no one is selected, who starts?</label>
        <select id="rr-volunteer" value={volunteer} disabled={Boolean(selected)} onChange={(event) => setVolunteer(event.target.value)}>
          <option value="B">Bea self-selects</option><option value="C">Cam self-selects</option><option value="">Nobody self-selects</option>
        </select>
        <label className="rr-checkbox"><input type="checkbox" checked={continues} disabled={Boolean(selected || volunteer)} onChange={(event) => setContinues(event.target.checked)} /> Ari continues if nobody else takes the turn</label>
        <p className="rr-note">Later options become available only when earlier ones are unused. The checkbox is a choice, not an obligation to continue.</p>
      </section>
      <section className="rr-panel" aria-labelledby="rr-timing-title">
        <h3 id="rr-timing-title">2. Move the next beginning</h3>
        <label htmlFor="rr-onset">{next ? `${NAMES[next]}'s onset relative to the marked boundary` : "No next turn to move"}</label>
        <input id="rr-onset" type="range" min={next === "A" ? 0 : -1200} max={1800} step={100} value={shift} disabled={!next} aria-valuetext={timing} onChange={(event) => setOffset(Number(event.target.value))} />
        <div className="rr-range-labels" aria-hidden="true"><span>{next === "A" ? "Boundary" : "1.2 s before"}</span><span>1.8 s after</span></div>
        <p className="rr-timing" aria-live="polite">{timing}</p>
        <div className="rr-actions">
          <button disabled={!next || next === "A"} onClick={() => setOffset(-600)}>Overlap</button>
          <button disabled={!next} onClick={() => setOffset(0)}>Meet at boundary</button>
          <button disabled={!next} onClick={() => setOffset(800)}>Leave a gap</button>
        </div>
        <p className="rr-note">Timing is geometry here. Overlap is not automatically an interruption; silence is not automatically confusion. Ari's own continuation can have a pause, but cannot overlap itself.</p>
      </section>
    </div>

    <section className="rr-floor" aria-labelledby="rr-floor-title">
      <div className="rr-floor-heading"><h3 id="rr-floor-title">The same words, two views</h3><button aria-pressed={bubbles} onClick={() => setBubbles(!bubbles)}>{bubbles ? "Show timing lanes" : "Flatten into chat bubbles"}</button></div>
      {bubbles ? <div className="rr-bubbles">
        <div><strong>Ari</strong><p>{opening}</p></div>
        {next && <div><strong>{NAMES[next]}</strong><p>{reply}</p></div>}
        <p className="rr-note">This view orders messages and hides their timing. Return to the lanes to see overlap or silence.</p>
      </div> : <figure className="rr-figure" aria-label={`Speech timeline. Ari speaks from 0 to 2400 milliseconds. ${next ? `${NAMES[next]} speaks from ${start} to ${start + DURATION} milliseconds. ${timing}.` : "No next speaker starts."}`}>
        <div className="rr-axis"><span>0 s</span><span>3 s</span><span>6 s</span></div>
        <div className="rr-lanes">
          <div className="rr-boundary" style={{left:percent(END)}} aria-hidden="true" />
          {next && shift !== 0 && <div className={`rr-interval ${shift < 0 ? "rr-overlap" : "rr-silence"}`} style={{left:percent(Math.min(END, start)),width:percent(Math.abs(shift))}} aria-hidden="true" />}
          {Object.entries(NAMES).map(([id, name]) => <div key={id} className="rr-lane">
            <span className="rr-lane-name">{name}</span>
            {id === "A" && <div className="rr-speech rr-speaker-a" style={{left:0,width:percent(END)}} aria-hidden="true">Question</div>}
            {id === next && <div className={`rr-speech ${id === "A" ? "rr-speaker-a" : "rr-speaker-next"}`} style={{left:percent(start),width:percent(DURATION)}} aria-hidden="true">{id === "A" ? "Continues" : "Reply"}</div>}
          </div>)}
        </div>
        <figcaption>Dashed line: a possible completion point at 2.4 s. {next && shift < 0 ? "Rose band: simultaneous speech." : next && shift > 0 ? "Striped band: time without speech." : "Move the onset to separate or overlap the turns."}</figcaption>
        <div className="rr-transcript"><p><strong>Ari:</strong> {opening}</p>{next ? <p><strong>{NAMES[next]}:</strong> {reply} <span className="rr-note">({(start / 1000).toFixed(1)}–{((start + DURATION) / 1000).toFixed(1)} s)</span></p> : <p className="rr-note">The floor remains open.</p>}</div>
      </figure>}
    </section>

    <div className="rr-rule" aria-live="polite">
      <p className="rr-kicker">{rule === "selected" ? "Rule 1a · Current speaker selects next" : rule === "self" ? "Rule 1b · Another speaker self-selects" : rule === "continue" ? "Rule 1c → Rule 2 · Current speaker continues" : "No option taken · Floor open"}</p>
      <p>{explanation}</p>
      {next && shift > 0 && <p className="rr-note">{selected ? "Because a next speaker was selected, this silence can be heard as waiting for that participant. Its duration alone does not make it a lapse." : next === "A" ? "This is a pause within Ari's continuing turn in our diagram." : "This is a gap before a self-selected turn in our diagram. Its social meaning needs the surrounding interaction."}</p>}
    </div>
    <div className="rr-actions"><button onClick={reset}>Reset room</button></div>
    <p className="rr-note" role="status">{notice}</p>
    <div className="rr-discuss"><p className="rr-kicker">Carry back to the reading</p><h3>What did the bubbles make disappear?</h3><p>Compare a 600 ms overlap with an 800 ms silence. Then change who gets the turn. Which differences can you see in words alone, and which require the timing and the occasion?</p></div>
  </div>;
}
