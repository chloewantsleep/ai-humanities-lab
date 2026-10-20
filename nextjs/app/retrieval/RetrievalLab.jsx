"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { bm25, buildSystem, chunk, cosine, decodeVectors, keywordIndex, topK, words } from "../../lib/retrieval/core.mjs";

const DEFAULT_TEXTS = ["phaedrus", "rur"];
const EXAMPLES = [
  "Does writing destroy memory?",
  "Why do the robots rebel?",
  "Can a made thing have a soul?",
  "What makes something funny?",
  "Is art more true than life?",
];
const INSTRUCTIONS = "You are a reading companion for a humanities seminar. Answer the question using only the retrieved passages below. Cite them by number, like [2]. If the passages do not contain the answer, say so plainly rather than answering from general knowledge.";

// The embedding model runs in a worker; one request at a time is enough for this page.
function useEmbedder() {
  const worker = useRef(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(null);
  useEffect(() => () => worker.current?.terminate(), []);
  async function embed(texts) {
    worker.current ??= new Worker(new URL("../../lib/retrieval/embed-worker.js", import.meta.url), { type: "module" });
    setStatus(s => (s === "ready" ? "embedding" : "loading"));
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      worker.current.onmessage = ({ data }) => {
        if (data.id !== id) return;
        if (data.type === "progress") setProgress(data);
        if (data.type === "done") { setStatus("ready"); setProgress(null); resolve(data.vectors); }
        if (data.type === "error") { setStatus("error"); setProgress(null); reject(new Error(data.message)); }
      };
      worker.current.postMessage({ id, texts });
    });
  }
  return { status, progress, embed };
}

export default function RetrievalLab() {
  const [manifest, setManifest] = useState(null);
  const [loaded, setLoaded] = useState({}); // id -> { title, passages, vectors, scale, keywords }
  const [chosen, setChosen] = useState(DEFAULT_TEXTS);
  const [question, setQuestion] = useState(EXAMPLES[0]);
  const [k, setK] = useState(4);
  const [method, setMethod] = useState("both");
  const [run, setRun] = useState(null);
  const [instructions, setInstructions] = useState(INSTRUCTIONS);
  const [own, setOwn] = useState({ title: "", text: "" });
  const [error, setError] = useState("");
  const embedder = useEmbedder();
  const { messages, sendMessage, setMessages, status: chatStatus, error: chatError, stop } = useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });

  useEffect(() => {
    fetch("/retrieval/manifest.json").then(r => r.json()).then(setManifest).catch(() => setError("Could not load the corpus manifest."));
  }, []);

  useEffect(() => {
    for (const id of chosen) {
      if (loaded[id] || id.startsWith("own-")) continue;
      fetch(`/retrieval/${id}.json`).then(r => r.json()).then(d => setLoaded(prev => ({ ...prev, [id]: {
        title: d.title, passages: d.passages, vectors: decodeVectors(d.vectors), scale: 127, keywords: keywordIndex(d.passages),
      } })));
    }
  }, [chosen, loaded]);

  const library = useMemo(() => [
    ...(manifest?.texts ?? []),
    ...Object.entries(loaded).filter(([id]) => id.startsWith("own-")).map(([id, t]) => ({ id, title: t.title, author: "your text", passages: t.passages.length })),
  ], [manifest, loaded]);
  const ready = chosen.length > 0 && chosen.every(id => loaded[id]);
  const totalPassages = chosen.reduce((n, id) => n + (loaded[id]?.passages.length ?? 0), 0);

  async function search(q = question) {
    if (!q.trim() || !ready) return;
    setError("");
    try {
      const [queryVector] = await embedder.embed([q]);
      // Every passage in every chosen text gets both scores, so the page can show the whole distribution.
      const all = chosen.flatMap(id => {
        const t = loaded[id];
        return t.passages.map((p, i) => ({
          id, title: t.title, heading: p.heading, text: p.text, index: i,
          vector: cosine(queryVector, t.vectors, i, t.scale),
          keyword: bm25(t.keywords, q, i),
        }));
      });
      setRun({ question: q, ...cut(all, k), terms: [...new Set(words(q))] });
      setMessages([]);
    } catch (e) {
      setError(`Embedding failed: ${e.message}`);
    }
  }

  async function addOwn() {
    if (!own.text.trim()) return;
    const passages = chunk(own.text);
    const title = own.title.trim() || "Your text";
    try {
      const vectors = await embedder.embed(passages.map(p => p.text));
      const flat = new Float32Array(vectors.flat());
      const id = `own-${Date.now()}`;
      setLoaded(prev => ({ ...prev, [id]: { title, passages, vectors: flat, scale: 1, keywords: keywordIndex(passages) } }));
      setChosen(prev => [...prev, id]);
      setOwn({ title: "", text: "" });
    } catch (e) {
      setError(`Embedding failed: ${e.message}`);
    }
  }

  const retrieved = run ? (method === "keyword" ? run.keyword : run.vector) : [];
  const system = buildSystem(instructions, retrieved);
  const busy = embedder.status === "loading" || embedder.status === "embedding";
  const reply = messages.filter(m => m.role === "assistant").at(-1);

  return (
    <div className="rag-lab">
      <section className="rag-intro">
        <p>A first-generation custom GPT came with “knowledge files.” When you asked it something, it did not read them. It searched them: it split each file into passages, turned each passage and your question into a list of numbers (an <em>embedding</em>), and kept the passages whose numbers pointed in nearly the same direction as the question’s. Those passages were pasted into the prompt, above your question. This page does that in front of you, on six course texts.</p>
      </section>

      <div className="rag-grid">
        <section className="rag-panel" aria-labelledby="rag-files">
          <h3 id="rag-files">01 / Knowledge files</h3>
          <p className="rag-muted">Choose what the bot can search. Every text is split into passages of about 700 characters.</p>
          <ul className="rag-files">
            {library.map(t => (
              <li key={t.id}>
                <label>
                  <input type="checkbox" checked={chosen.includes(t.id)} onChange={e => setChosen(prev => e.target.checked ? [...prev, t.id] : prev.filter(x => x !== t.id))} />
                  <span><strong>{t.title}</strong> <span className="rag-muted">{t.author}{t.translator ? `, tr. ${t.translator}` : ""} · {t.passages} passage{t.passages === 1 ? "" : "s"}</span></span>
                </label>
              </li>
            ))}
          </ul>
          <details className="rag-own">
            <summary>Add your own text</summary>
            <label className="rag-field">Title<input value={own.title} onChange={e => setOwn({ ...own, title: e.target.value })} placeholder="My notes on Grice" /></label>
            <label className="rag-field">Text<textarea rows={6} value={own.text} onChange={e => setOwn({ ...own, text: e.target.value })} placeholder="Paste anything. Blank lines separate paragraphs." /></label>
            <button type="button" onClick={addOwn} disabled={busy || !own.text.trim()}>Split and embed it here</button>
            <p className="rag-muted">Embedded in this browser tab and kept only until you reload.</p>
          </details>
        </section>

        <section className="rag-panel" aria-labelledby="rag-ask">
          <h3 id="rag-ask">02 / Ask</h3>
          <form onSubmit={e => { e.preventDefault(); search(); }}>
            <label className="rag-field">Question<input value={question} onChange={e => setQuestion(e.target.value)} /></label>
            <div className="rag-examples">{EXAMPLES.map(x => <button type="button" key={x} onClick={() => { setQuestion(x); search(x); }} disabled={!ready || busy}>{x}</button>)}</div>
            <div className="rag-controls">
              <label>Keep the top <input type="range" min={1} max={8} value={k} onChange={e => { const n = Number(e.target.value); setK(n); setRun(r => r && { ...r, ...cut(r.all, n) }); }} /> <strong>{k}</strong></label>
              <label>Search by <select value={method} onChange={e => setMethod(e.target.value)}>
                <option value="both">meaning and keywords, side by side</option>
                <option value="vector">meaning (embeddings)</option>
                <option value="keyword">keywords (BM25)</option>
              </select></label>
              <button type="submit" className="rag-primary" disabled={!ready || busy || !question.trim()}>Search {totalPassages || ""} passages</button>
            </div>
          </form>
          <p className="rag-muted" aria-live="polite">
            {embedder.status === "loading" && `Downloading the embedding model (${MODEL_NOTE})${embedder.progress?.percent ? `: ${Math.round(embedder.progress.percent)}%` : "…"}`}
            {embedder.status === "embedding" && (embedder.progress?.total > 1 ? `Embedding passage ${embedder.progress.done} of ${embedder.progress.total}…` : "Embedding…")}
            {!ready && chosen.length > 0 && "Loading the texts…"}
            {chosen.length === 0 && "Choose at least one text."}
          </p>
          {error && <p className="rag-error">{error}</p>}
        </section>
      </div>

      {run && <>
        <section className="rag-results" aria-labelledby="rag-found">
          <h3 id="rag-found">03 / What the search found for “{run.question}”</h3>
          {method !== "keyword" && <Distribution run={run} />}
          <div className={method === "both" ? "rag-columns" : ""}>
            {method !== "keyword" && <ResultList label="By meaning" note="cosine similarity, −1 to 1" results={run.vector} other={method === "both" ? run.keyword : null} digits={3} />}
            {method !== "vector" && <ResultList label="By keywords" note={`BM25 on: ${run.terms.join(", ") || "(no content words)"}`} results={run.keyword} other={method === "both" ? run.vector : null} digits={2} terms={run.terms} />}
          </div>
        </section>

        <section className="rag-grid" aria-labelledby="rag-prompt">
          <div className="rag-panel">
            <h3 id="rag-prompt">04 / What the bot is sent</h3>
            <p className="rag-muted">The bot never sees the files, only this: its instructions with the {method === "keyword" ? "keyword" : "meaning"} results pasted in (about {Math.round(system.length / 4)} tokens), then your question.</p>
            <label className="rag-field">Instructions (edit them)<textarea rows={4} value={instructions} onChange={e => setInstructions(e.target.value)} /></label>
            <pre className="rag-system">{system}{"\n\n"}<strong>User:</strong> {run.question}</pre>
          </div>
          <div className="rag-panel">
            <h3>05 / The answer</h3>
            <p className="rag-muted">Sends the prompt on the left to Claude through the app’s shared <code>/api/chat</code> route. One question at a time; each search starts fresh.</p>
            <div className="rag-controls">
              <button type="button" className="rag-primary" disabled={chatStatus === "submitted" || chatStatus === "streaming"} onClick={() => { setMessages([]); sendMessage({ text: run.question }, { body: { system } }); }}>Ask Claude with these passages</button>
              {(chatStatus === "submitted" || chatStatus === "streaming") && <button type="button" onClick={stop}>Stop</button>}
            </div>
            {chatError && <p className="rag-error">{readError(chatError)}</p>}
            {reply && <div className="rag-reply">{reply.parts.filter(p => p.type === "text").map((p, i) => <ReactMarkdown key={i}>{p.text}</ReactMarkdown>)}</div>}
            <p className="rag-muted">Then try: lower the number kept to 1, switch to keywords, or ask about something none of the texts discuss. Does the answer say so, or does it fill the gap?</p>
          </div>
        </section>
      </>}
    </div>
  );
}

const MODEL_NOTE = "all-MiniLM-L6-v2, about 23 MB, once";

// The top k of every scored passage, by each method; the slider re-cuts a search without running it again.
function cut(all, k) {
  const pick = key => topK(all.map(p => p[key]), k).map(({ i }) => all[i]);
  return { k, all, vector: pick("vector"), keyword: pick("keyword") };
}

function readError(error) {
  try { return JSON.parse(error.message).error ?? error.message; } catch { return error.message; }
}

function ResultList({ label, note, results, other, digits, terms }) {
  const key = r => `${r.id}:${r.index}`;
  const shared = new Set(other?.map(key));
  return (
    <div className="rag-list">
      <h4>{label} <span className="rag-muted">{note}</span></h4>
      <ol>
        {results.map((r, n) => {
          const score = label === "By meaning" ? r.vector : r.keyword;
          const width = label === "By meaning" ? Math.max(0, score) * 100 : (score / Math.max(...results.map(x => x.keyword), 1e-9)) * 100;
          return (
            <li key={key(r)}>
              <div className="rag-score"><span className="rag-rank">[{n + 1}]</span><span className="rag-bar"><span style={{ width: `${width}%` }} /></span><code>{score.toFixed(digits)}</code>{other && shared.has(key(r)) && <span className="rag-both" title="Also found by the other search">both</span>}</div>
              <p className="rag-source">{r.title}{r.heading ? ` · ${r.heading}` : ""} · passage {r.index + 1}</p>
              <details><summary>{r.text.slice(0, 180)}{r.text.length > 180 ? "…" : ""}</summary><p className="rag-text">{terms ? highlight(r.text, terms) : r.text}</p></details>
            </li>
          );
        })}
      </ol>
      {terms && results.every(r => r.keyword === 0) && <p className="rag-muted">No passage shares a word with the question.</p>}
    </div>
  );
}

function highlight(text, terms) {
  const set = new Set(terms);
  return text.split(/([A-Za-zÀ-ɏ']+)/).map((part, i) => set.has(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part);
}

// Every passage's similarity to the question, as a histogram, with the kept ones marked: retrieval is a cut-off
// on this curve, and the kept passages are often barely ahead of the next ones.
function Distribution({ run }) {
  const scores = run.all.map(p => p.vector);
  const cutoff = run.vector.at(-1)?.vector ?? 1;
  const lo = Math.min(...scores), hi = Math.max(...scores);
  const bins = 48, counts = new Array(bins).fill(0);
  for (const s of scores) counts[Math.min(bins - 1, Math.floor(((s - lo) / (hi - lo || 1)) * bins))]++;
  const peak = Math.max(...counts);
  const next = [...scores].sort((a, b) => b - a)[run.k];
  return (
    <figure className="rag-dist">
      <svg viewBox={`0 0 ${bins * 10} 60`} role="img" aria-label={`Similarity of all ${scores.length} passages, from ${lo.toFixed(2)} to ${hi.toFixed(2)}`}>
        {counts.map((c, i) => {
          const binLo = lo + (i / bins) * (hi - lo);
          const kept = binLo + (hi - lo) / bins > cutoff;
          return <rect key={i} x={i * 10 + 1} width={8} y={60 - (c / peak) * 56 - (c ? 2 : 0)} height={(c / peak) * 56 + (c ? 2 : 0)} className={kept ? "kept" : ""} />;
        })}
      </svg>
      <figcaption>All {scores.length} passages by similarity to the question, from {lo.toFixed(2)} to {hi.toFixed(2)}. The bot is given the {run.k} at the right edge (from {cutoff.toFixed(3)} up){next !== undefined ? `; the next one scored ${next.toFixed(3)}` : ""}. A score measures how alike two embeddings are, not whether a passage answers the question.</figcaption>
    </figure>
  );
}
