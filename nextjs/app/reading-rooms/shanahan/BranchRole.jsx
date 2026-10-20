"use client";

import { useRef, useState } from "react";
import { useBrowserLM } from "../../../lib/browser-lm/useBrowserLM.js";

const PREFIX = "Visitor: I am closing the terminal now.\nKeeper:";
const INITIAL_ROLES = [
  "an urgent archive keeper who wants to tell one last story before the visitor leaves",
  "a practical archive keeper who wants to close the museum on time",
];
const MODEL = "Xenova/gpt2";

export default function BranchRole() {
  const lm = useBrowserLM(MODEL);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [temperature, setTemperature] = useState(0);
  const [run, setRun] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelled = useRef(false);
  const locked = useRef(false);
  const loading = lm.status === "loading";

  async function load() {
    if (locked.current) return;
    locked.current = true; setError("");
    try { await lm.load({ device: "wasm", dtype: "q8" }); }
    catch (e) { setError(e.message); }
    finally { locked.current = false; }
  }

  async function compare() {
    if (locked.current || !lm.model || roles.some(role => !role.trim())) return;
    locked.current = true; cancelled.current = false; setBusy(true); setError("");
    const snapshot = {
      temperature, model: MODEL, prefix: PREFIX,
      branches: roles.map(role => ({ role: role.trim(), prompt: `The following is a dialogue with ${role.trim()}.\n\n${PREFIX}`, text: "", status: "Waiting" })),
    };
    setRun(snapshot);
    const update = (index, patch) => setRun(previous => ({ ...previous, branches: previous.branches.map((branch, i) => i === index ? { ...branch, ...patch } : branch) }));
    try {
      for (let index = 0; index < snapshot.branches.length; index++) {
        if (cancelled.current) { update(index, { status: "Not run · comparison stopped" }); continue; }
        update(index, { status: "Generating" });
        const result = await lm.generate({ prompt: snapshot.branches[index].prompt, temperature: snapshot.temperature, topK: 20, maxNewTokens: 48, stopStrings: ["\nVisitor:"], neverStop: false }, step => update(index, { text: step.text }));
        update(index, { text: result.text, status: `${result.generatedTokens} tokens · ${result.finishReason}`, elapsedMs: result.elapsedMs });
      }
    } catch (e) {
      setError(e.message);
      setRun(previous => ({ ...previous, branches: previous.branches.map(branch => ["Generating", "Waiting"].includes(branch.status) ? { ...branch, status: "Incomplete · see error" } : branch) }));
    } finally { locked.current = false; setBusy(false); }
  }

  function stop() { cancelled.current = true; lm.abort(); }
  const stale = run && (run.temperature !== temperature || run.branches.some((branch, i) => branch.role !== roles[i].trim()));

  return <section className="rr-branch-room" aria-label="Branch the role with a browser model">
    <p className="rr-kicker">Optional B · A live continuation experiment</p>
    <h3>Branch the role.</h3>
    <p>Hold this dialogue prefix constant. Change the role cue before it, then compare what the same base model continues.</p>
    <pre className="rr-prompt" aria-label="Shared dialogue prefix">{PREFIX}</pre>
    <p className="rr-note">GPT-2 runs locally in your browser after an explicit download (previously measured at about 130 MB, plus runtime files). It is a small base model: it may ignore the cue, repeat itself, or write an incoherent continuation. That is an observation to discuss, not a failed instruction-following score.</p>
    <div className="rr-actions">
      <button disabled={busy || loading || Boolean(lm.model)} onClick={load}>{loading ? "Loading GPT-2…" : lm.model ? "GPT-2 loaded" : "Load GPT-2 in this browser"}</button>
      {busy && <button onClick={stop}>Stop comparison</button>}
    </div>
    <p className="rr-note" role="status">{loading ? `Loading model assets${lm.progress?.percent != null ? ` · ${lm.progress.percent.toFixed(0)}% of discovered files` : ""}. Session preparation can take a moment.` : lm.model ? `Ready · ${lm.model.device} · ${lm.model.dtype}. No API key or paid call.` : "The annotation exercise above works without loading a model."}</p>
    <fieldset className="rr-branch-fields" disabled={busy || loading}>
      <legend>Only the role cue changes between the two branches</legend>
      <div className="rr-grid">{roles.map((role, i) => <div key={i}>
        <label htmlFor={`rr-role-${i}`}>Role cue {i + 1}</label>
        <textarea id={`rr-role-${i}`} rows={3} maxLength={400} value={role} onChange={event => setRoles(previous => previous.map((value, index) => index === i ? event.target.value : value))} />
      </div>)}</div>
      <label htmlFor="rr-sampling">Decoding for both branches</label>
      <select id="rr-sampling" value={temperature} onChange={event => setTemperature(Number(event.target.value))}>
        <option value={0}>Greedy · temperature 0</option><option value={0.8}>Sample · temperature 0.8, top-k 20</option>
      </select>
      <p className="rr-note">Both branches have a 48-token limit and stop at the next Visitor cue or end token. Greedy decoding removes sampling randomness. In sampling mode, there is no fixed seed; differences can also come from the draw. Try identical cues as a control.</p>
      <div className="rr-actions"><button className="rr-primary" disabled={!lm.model || roles.some(role => !role.trim())} onClick={compare}>Compare continuations</button><button onClick={() => { setRoles(INITIAL_ROLES); setTemperature(0); setRun(null); setError(""); }}>Reset branches</button></div>
    </fieldset>
    {error && <p className="rr-error" role="alert">{error} You can retry loading or running the comparison; the annotation exercise is still available.</p>}
    {run && <>
      <p className="rr-note">{stale ? "The controls have changed. These are the previous run's prompts and outputs; compare again to use the new settings." : "Run snapshot"} · {run.model} · temperature {run.temperature} · 48 tokens per branch</p>
      <div className="rr-grid">{run.branches.map((branch, i) => <article key={i} className="rr-panel rr-branch-result">
        <p className="rr-kicker">Branch {i + 1} · {branch.status}</p>
        <p className="rr-output">{branch.text || (branch.status === "Generating" ? "Waiting for the first token…" : "No continuation yet.")}</p>
        <details><summary>Exact prompt used for branch {i + 1}</summary><pre className="rr-prompt">{branch.prompt}</pre></details>
      </article>)}</div>
    </>}
    <p className="rr-note">This compares visible continuations. It does not expose an internal character or establish a belief, intention, or experience. Return to your two descriptions and identify which observations each can explain.</p>
  </section>;
}
