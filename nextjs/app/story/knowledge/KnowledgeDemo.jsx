"use client";

import { useEffect, useState } from "react";
import "./knowledge.css";

// Knowledge + Delivery, before the full builder: a custom GPT's "knowledge" is text put in front of the model, either
// all of it or a few retrieved passages, and you can see exactly which. One pack (Frankenstein), three deliveries.
// Data comes from KnowledgeStep.jsx (presets run on the server); free-text searches go to /api/story-knowledge.

const MODES = [
  { id: "whole", label: "Whole text", legs: "full" },
  { id: "keyword", label: "Keyword search", legs: "lexical" },
  { id: "meaning", label: "Meaning-based search", legs: "semantic" },
];

const fmt = (n) => n.toLocaleString("en-US");

function Highlight({ text, terms }) {
  if (!terms?.length) return text;
  const re = new RegExp(`\\b(${terms.map((t) => t.replace(/[^a-z']/g, "")).join("|")})(?:'s)?\\b`, "gi");
  const out = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    out.push(text.slice(last, m.index), <mark key={m.index}>{m[0]}</mark>);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

function Cost({ tokens, whole, label }) {
  const pct = (tokens / whole) * 100;
  return (
    <div className="kd-cost">
      <div className="kd-cost-label">
        <span>≈ {fmt(tokens)} tokens{label ? `, ${label}` : ""}</span>
        {tokens < whole && <span className="kd-cost-pct">{pct < 1 ? "<1" : Math.round(pct)}% of the whole novel</span>}
      </div>
      <div className="kd-bar" aria-hidden="true">
        <div className="kd-bar-fill" style={{ width: `max(3px, ${Math.min(100, pct)}%)` }} />
      </div>
    </div>
  );
}

export default function KnowledgeDemo({ data }) {
  const { whole, presets, words } = data;
  const [mode, setMode] = useState("meaning");
  const [draft, setDraft] = useState(presets[0].q);
  const [query, setQuery] = useState(presets[0].q);
  const [fetched, setFetched] = useState({}); // "mode:query" -> result | { error }
  const preset = presets.find((p) => p.q === query);
  const key = `${mode}:${query}`;
  const result = mode === "whole" ? null : preset ? preset[mode] : fetched[key];

  useEffect(() => {
    if (mode === "whole" || preset || fetched[key] || !query) return;
    if (mode === "meaning" && !words.includes(query)) {
      setFetched((f) => ({ ...f, [key]: { error: "no-vector" } }));
      return;
    }
    let live = true;
    fetch(`/api/story-knowledge?mode=${mode}&q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((r) => live && setFetched((f) => ({ ...f, [key]: r })))
      .catch(() => live && setFetched((f) => ({ ...f, [key]: { error: "failed" } })));
    return () => {
      live = false;
    };
  }, [mode, query, key, preset, fetched, words]);

  function ask(q) {
    const v = q.trim().toLowerCase().slice(0, 200);
    setDraft(v);
    if (v) setQuery(v);
  }


  return (
    <section className="kd" aria-label="What a custom GPT's knowledge sends to the model">
      <header className="kd-head">
        <p className="kd-kicker">Knowledge: <em>Frankenstein</em> (Shelley, 1818)</p>
        <div className="kd-modes" role="radiogroup" aria-label="Delivery">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className="kd-mode" onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <form
        className="kd-ask"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <label className="kd-ask-row">
          <span className="kd-sr">Your message</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask the book something" maxLength={200} />
          <button type="submit">Search</button>
        </label>
        <div className="kd-chips">
          {presets.map((p) => (
            <button key={p.q} type="button" className="kd-chip" aria-pressed={query === p.q} onClick={() => ask(p.q)}>
              {p.q}
            </button>
          ))}
        </div>
      </form>

      <div className="kd-out" aria-live="polite">
        <p className="kd-out-label">Sent to the model with your message</p>
        {mode === "whole" ? (
          <>
            <Cost tokens={whole.tokens} whole={whole.tokens} label="the whole novel" />
            <blockquote className="kd-opening">{whole.opening}</blockquote>
            <p className="kd-note">…and so on for {fmt(whole.chars)} characters, every time, whatever you ask.</p>
          </>
        ) : !result ? (
          <p className="kd-note">Searching…</p>
        ) : result.error === "no-vector" ? (
          <p className="kd-note">
            Meaning-based search needs your words turned into numbers by an embedding model first. This page keeps those
            numbers for a few single words only:{" "}
            {words.map((w, i) => (
              <span key={w}>
                {i > 0 && ", "}
                <button type="button" className="kd-link" onClick={() => ask(w)}>{w}</button>
              </span>
            ))}
            . Keyword search takes anything.
          </p>
        ) : result.error ? (
          <p className="kd-note">The search did not answer. Try again.</p>
        ) : !result.hits.length ? (
          <p className="kd-note">No passage contains {result.terms.length ? "those words" : "a searchable word"}. Nothing is sent.</p>
        ) : (
          <>
            <Cost tokens={result.tokens} whole={whole.tokens} label={`${result.hits.length} passage${result.hits.length > 1 ? "s" : ""}`} />
            <ol className="kd-hits">
              {result.hits.map((h, i) => (
                <li key={i}>
                  <p className="kd-hit-where">
                    {h.title}
                    {mode === "meaning" && !h.sharesWord && <span className="kd-tag">no “{query}” in it</span>}
                  </p>
                  <p className="kd-hit-text"><Highlight text={h.snippet} terms={result.terms} /></p>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <footer className="kd-foot">
        <div>
          <p className="kd-moral">
            {mode === "whole"
              ? "Nothing is learned: the book is pasted in front of the model with every message."
              : mode === "keyword"
                ? "Keyword search matches words: a passage is found only if it uses yours."
                : "Meaning-based search matches nearby ideas, so it can find a passage that shares no words with the query."}
          </p>
          <p className="kd-builder">In the <a href="/poetry-gem">Poetry Gem</a> (Activity C), these are the bot&rsquo;s Knowledge and Delivery settings.</p>
        </div>
      </footer>
    </section>
  );
}
