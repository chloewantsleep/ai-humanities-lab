"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { build, draw, extendRun, followers, seed, tokenize } from "./markov.mjs";

const TEXTS = [
  ["phaedrus", "Phaedrus"], ["rur", "R.U.R."], ["frankenstein", "Frankenstein"],
  ["dorian-gray", "Dorian Gray"], ["intentions", "Intentions"], ["laughter", "Laughter"],
];
const MAX_ORDER = { word: 5, char: 10 };
const SHOW_ROWS = 12;

export default function MarkovLab() {
  const [chosen, setChosen] = useState(["phaedrus"]);
  const [own, setOwn] = useState("");
  const [loaded, setLoaded] = useState({});
  const [mode, setMode] = useState("word");
  const [order, setOrder] = useState(2);
  const [out, setOut] = useState([]);
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [error, setError] = useState(null);

  // Fetch the chosen texts (the passages the retrieval page already serves).
  useEffect(() => {
    for (const id of chosen) {
      if (loaded[id]) continue;
      fetch(`/retrieval/${id}.json`).then((r) => r.json())
        .then((d) => setLoaded((l) => ({ ...l, [id]: d })))
        .catch((e) => setError(String(e)));
    }
  }, [chosen, loaded]);

  const passages = useMemo(() => {
    const ps = [];
    for (const id of chosen) {
      const d = loaded[id];
      if (d) for (const p of d.passages) ps.push({ title: d.title, heading: p.heading, text: p.text });
    }
    if (own.trim()) ps.push({ title: "Your text", heading: "pasted", text: own });
    return ps;
  }, [chosen, loaded, own]);

  const corpus = useMemo(() => {
    const { tokens, where } = tokenize(passages, mode);
    return { tokens, where, table: tokens.length > order ? build(tokens, order) : new Map() };
  }, [passages, mode, order]);

  const ready = corpus.tokens.length > order + 1;

  // Any change to the corpus or the settings starts the output over.
  useEffect(() => { setOut([]); setSelected(null); setRunning(false); }, [corpus]);

  function start(prev) {
    const s = seed(corpus.tokens, order, mode);
    const i0 = prev.length;
    return [...prev, ...s.state.map((token, k) => ({
      token, positions: s.positions[k], candidates: s.positions[k], runStart: i0, seeded: true, restart: k === 0 && i0 > 0,
    }))];
  }

  function step(prev) {
    if (!ready) return prev;
    if (prev.length < order) return start(prev);
    const state = prev.slice(-order).map((t) => t.token);
    const rows = followers(corpus.table, state);
    if (!rows.length) return start(prev); // the end of the corpus: no followers, so reseed
    const pick = draw(rows);
    const last = prev[prev.length - 1];
    const i = prev.length;
    const run = extendRun(last.candidates, pick.positions, last.runStart, i, order);
    return [...prev, { token: pick.token, state, rows, pickedIndex: rows.indexOf(pick), positions: pick.positions, ...run }];
  }

  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setOut((o) => (o.length > 2000 ? (setRunning(false), o) : stepRef.current(o))), 1000 / speed);
    return () => clearInterval(id);
  }, [running, speed]);

  const shown = selected ?? out.length - 1;
  const cur = out[shown];
  const joiner = mode === "char" ? "" : " ";

  // The verbatim runs: how long the stretch ending at each token appears word for word in the source.
  const runLen = (t, i) => i - t.runStart + 1;
  const copiedMin = order + 2; // the chain guarantees n + 1 tokens; anything longer is copying
  const longest = out.reduce((m, t, i) => Math.max(m, runLen(t, i)), 0);
  const copiedCount = out.filter((t, i) => runLen(t, i) >= copiedMin).length;

  function sourceView(t, i) {
    const p = t.candidates[0];
    const len = runLen(t, i);
    const from = p - len + 1;
    const lo = Math.max(0, from - (mode === "char" ? 120 : 25));
    const hi = Math.min(corpus.tokens.length, p + (mode === "char" ? 120 : 25));
    const where = passages[corpus.where[p]];
    return { where, before: corpus.tokens.slice(lo, from).join(joiner), match: corpus.tokens.slice(from, p + 1).join(joiner), after: corpus.tokens.slice(p + 1, hi).join(joiner), len, places: t.candidates.length };
  }

  const toggle = (id) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const setModeSafe = (m) => { setMode(m); setOrder((o) => Math.min(o, MAX_ORDER[m]) || 1); };

  return (
    <div className="mk-lab">
      <div className="mk-controls mk-panel">
        <div>
          <h4>Corpus</h4>
          <div className="mk-chips">
            {TEXTS.map(([id, name]) => (
              <label key={id} className={chosen.includes(id) ? "on" : ""}>
                <input type="checkbox" checked={chosen.includes(id)} onChange={() => toggle(id)} /> {name}
              </label>
            ))}
          </div>
          <details className="mk-own">
            <summary>Or paste your own text{own.trim() ? " (in use)" : ""}</summary>
            <textarea rows={5} value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Paste anything: a poem, an email thread, a chapter. It is added to the corpus." />
          </details>
          <p className="mk-muted">
            {corpus.tokens.length.toLocaleString()} {mode === "char" ? "characters" : "words"} · {corpus.table.size.toLocaleString()} distinct states of {order} {mode === "char" ? "character" : "word"}{order > 1 ? "s" : ""}
            {error && <span className="mk-error"> · {error}</span>}
          </p>
        </div>
        <div>
          <h4>Chain</h4>
          <div className="mk-row">
            <label><input type="radio" checked={mode === "word"} onChange={() => setModeSafe("word")} /> words</label>
            <label><input type="radio" checked={mode === "char"} onChange={() => setModeSafe("char")} /> characters</label>
          </div>
          <label className="mk-slider">
            order <strong>{order}</strong>
            <input type="range" min={1} max={MAX_ORDER[mode]} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
            <span className="mk-muted">the next {mode === "char" ? "character" : "word"} depends on the last {order}</span>
          </label>
          <div className="mk-row">
            <button className="mk-primary" disabled={!ready} onClick={() => { setSelected(null); setOut((o) => step(o)); }}>Step</button>
            <button disabled={!ready} onClick={() => { setSelected(null); setRunning((r) => !r); }}>{running ? "Pause" : "Run"}</button>
            <button disabled={!out.length} onClick={() => { setRunning(false); setOut([]); setSelected(null); }}>Clear</button>
            <label className="mk-speed">speed <input type="range" min={1} max={40} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
          </div>
        </div>
      </div>

      <div className="mk-panel mk-output-panel">
        <h4>Output <span className="mk-muted">{out.length ? `longest verbatim run ${longest} ${mode === "char" ? "characters" : "words"} · ${Math.round((100 * copiedCount) / out.length)}% inside a copied run` : "press Step to begin"}</span></h4>
        <p className={`mk-output mk-${mode}`}>
          {out.map((t, i) => {
            const len = runLen(t, i);
            const cls = ["mk-tok", t.seeded && "seed", len >= copiedMin && "copied", len >= copiedMin + 4 && "long", i === shown && "sel", t.restart && "restart"].filter(Boolean).join(" ");
            return (
              <span key={i}>
                <span className={cls} onClick={() => { setRunning(false); setSelected(i); }} title={`verbatim run of ${len}`}>{t.token}</span>
                {joiner}
              </span>
            );
          })}
        </p>
        <p className="mk-legend mk-muted">
          <span className="mk-tok seed">seed</span> taken from the source to start · <span className="mk-tok copied">copied</span> part of a run longer than order + 1, so the chain is reproducing the source word for word · <span className="mk-tok copied long">long run</span> · click any token to see where it came from
        </p>
      </div>

      {cur && (
        <div className="mk-grid">
          <div className="mk-panel">
            <h4>The step {selected != null && <button className="mk-link" onClick={() => setSelected(null)}>back to latest</button>}</h4>
            {cur.rows ? (
              <>
                <p className="mk-muted">State (the last {order}): <code className="mk-state">{cur.state.join(mode === "char" ? "" : " ").replace(/ /g, mode === "char" ? "␣" : " ")}</code></p>
                <p className="mk-muted">{(() => { const n = cur.rows.length, t = cur.rows.reduce((s, r) => s + r.count, 0), u = mode === "char" ? "character" : "word"; return n === 1 ? `In the corpus, this state occurred ${t} time${t > 1 ? "s" : ""}, always followed by the same ${u}:` : `In the corpus, this was followed by ${n} different ${u}s, ${t} times in all:`; })()}</p>
                <table className="mk-table">
                  <tbody>
                    {cur.rows.slice(0, SHOW_ROWS).map((r, k) => {
                      const total = cur.rows.reduce((s, x) => s + x.count, 0);
                      return (
                        <tr key={k} className={k === cur.pickedIndex ? "picked" : ""}>
                          <td className="mk-next">{r.token === " " ? "␣" : r.token}</td>
                          <td className="mk-count">{r.count}</td>
                          <td className="mk-bar"><span style={{ width: `${(100 * r.count) / cur.rows[0].count}%` }} /></td>
                          <td className="mk-count">{Math.round((100 * r.count) / total)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {cur.rows.length > SHOW_ROWS && <p className="mk-muted">…and {cur.rows.length - SHOW_ROWS} more{cur.pickedIndex >= SHOW_ROWS ? `, including the one drawn (“${cur.token}”, ${cur.rows[cur.pickedIndex].count})` : ""}.</p>}
                {cur.rows.length === 1 && <p className="mk-note">Only one thing ever followed this state, so the chain had no choice: it copies.</p>}
              </>
            ) : (
              <p className="mk-muted">This token is part of the seed: the first {order} tokens are taken straight from a random place in the source so that the chain has a state to start from.{cur.restart ? " The chain had reached a state with no followers (the end of a text) and started again here." : ""}</p>
            )}
          </div>
          <div className="mk-panel">
            <h4>Where it came from</h4>
            {(() => {
              const s = sourceView(cur, shown);
              return (
                <>
                  <p className="mk-muted">{s.where?.title} · {s.where?.heading} · the last {s.len} {mode === "char" ? "characters" : "words"} of output appear here word for word{s.places > 1 ? ` (and in ${s.places - 1} other place${s.places > 2 ? "s" : ""})` : ""}</p>
                  <blockquote className={`mk-source mk-${mode}`}>…{s.before}{joiner}<mark>{s.match}</mark>{joiner}{s.after}…</blockquote>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
