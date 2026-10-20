"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { DIMS, MODEL, TARGET, buildSystem, chunk, cosine, decodeVectors, topK } from "../../lib/retrieval/core.mjs";
import { QUESTIONS } from "./questions.mjs";
import PRE_EMBEDDED from "./questions.json";

const STEPS = [
  { id: "chunk", title: "Chunk" },
  { id: "embed", title: "Embed" },
  { id: "store", title: "Store" },
  { id: "question", title: "Embed the question" },
  { id: "compare", title: "Compare" },
  { id: "top-k", title: "Top k" },
  { id: "prompt", title: "The prompt" },
  { id: "answer", title: "The answer" },
];
const NEEDS_QUESTION = new Set(["compare", "top-k", "prompt", "answer"]);
const INSTRUCTIONS = "You are a reading companion for a humanities seminar. Answer the question using only the retrieved passages below. Cite them by number, like [2]. If the passages do not contain the answer, say so plainly rather than answering from general knowledge.";
const OWN = "own";
const SAMPLE = { phaedrus: 330 }; // the myth of Theuth; other texts start on their first long passage

// The embedding model runs in /retrieval's worker (lib/retrieval/embed-worker.js), one request at a time.
function useEmbedder() {
  const worker = useRef(null);
  const [status, setStatus] = useState("idle"); // idle → loading (first use: download) → ready; embedding while busy
  const [progress, setProgress] = useState(null);
  useEffect(() => () => worker.current?.terminate(), []);
  function embed(texts) {
    worker.current ??= new Worker(new URL("../../lib/retrieval/embed-worker.js", import.meta.url), { type: "module" });
    setStatus(s => (s === "ready" ? "embedding" : "loading"));
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      worker.current.onmessage = ({ data }) => {
        if (data.id !== id) return;
        if (data.type === "progress") setProgress(p => ({ ...p, ...data }));
        if (data.type === "done") { setStatus("ready"); setProgress(null); resolve(data.vectors); }
        if (data.type === "error") { setStatus("error"); setProgress(null); reject(new Error(data.message)); }
      };
      worker.current.postMessage({ id, texts });
    });
  }
  return { status, progress, embed, busy: status === "loading" || status === "embedding" };
}

// The same format build-retrieval-index.mjs writes: each number × 127, rounded to a whole number, as bytes in base64.
function toStore(meta, passages, vectors) {
  const bytes = new Int8Array(passages.length * DIMS);
  vectors.forEach((v, i) => v.forEach((x, k) => { bytes[i * DIMS + k] = Math.max(-127, Math.min(127, Math.round(x * 127))); }));
  let binary = "";
  const u8 = new Uint8Array(bytes.buffer);
  for (let i = 0; i < u8.length; i += 8192) binary += String.fromCharCode(...u8.subarray(i, i + 8192));
  return JSON.stringify({ ...meta, model: MODEL, dims: DIMS, passages, vectors: btoa(binary) });
}

function readStore(raw, origin) {
  const d = JSON.parse(raw);
  return { id: d.id, title: d.title, author: d.author, translator: d.translator, source: d.source, model: d.model, passages: d.passages, vectors: decodeVectors(d.vectors), raw, bytes: new Blob([raw]).size, origin };
}

const firstLong = passages => Math.max(0, passages.findIndex((p, i) => i > 3 && p.text.length > 450));
const fmt = (x, d = 3) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
const plural = (n, word) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

export default function RagPipeline() {
  const [manifest, setManifest] = useState(null);
  const [textId, setTextId] = useState("phaedrus");
  const [corpus, setCorpus] = useState(null);
  const [own, setOwn] = useState({ title: "", text: "" });
  const [sample, setSample] = useState(SAMPLE.phaedrus);
  const [step, setStep] = useState("chunk");
  const [question, setQuestion] = useState(QUESTIONS.phaedrus[0]);
  const [query, setQuery] = useState(null); // { text, vector, how, ms }
  const [worked, setWorked] = useState(null); // passage index for step 5; null = the top one
  const [k, setK] = useState(4);
  const [error, setError] = useState("");
  const embedder = useEmbedder();
  const { messages, sendMessage, setMessages, status: chatStatus, error: chatError, stop } = useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });

  useEffect(() => {
    fetch("/retrieval/manifest.json").then(r => r.json()).then(setManifest).catch(() => setError("Could not load the list of texts."));
    // Each step has an address (/rag#compare), so a link or the back button can open it.
    const follow = () => { const id = window.location.hash.slice(1); if (STEPS.some(s => s.id === id)) setStep(id); };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);

  useEffect(() => {
    if (textId === OWN) return;
    let live = true;
    setCorpus(null);
    fetch(`/retrieval/${textId}.json`).then(r => r.text()).then(raw => {
      if (!live) return;
      const c = readStore(raw, "prebuilt");
      setCorpus(c);
      setSample(SAMPLE[textId] ?? firstLong(c.passages));
    }).catch(() => setError("Could not load that text's store."));
    return () => { live = false; };
  }, [textId]);

  function go(id) {
    setStep(id);
    window.history.replaceState(null, "", `#${id}`);
    document.getElementById("rag-stage")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function chooseText(id) {
    setTextId(id);
    setQuery(null); setWorked(null); setMessages([]);
    if (id !== OWN) setQuestion(QUESTIONS[id]?.[0] ?? "");
    else setCorpus(null);
  }

  async function embedOwn() {
    const passages = chunk(own.text);
    if (!passages.length) return;
    setError("");
    try {
      const vectors = await embedder.embed(passages.map(p => p.text));
      const raw = toStore({ id: "your-text", title: own.title.trim() || "Your text", author: "you", translator: null, source: "pasted into this page" }, passages, vectors);
      setCorpus(readStore(raw, "browser"));
      setSample(Math.min(firstLong(passages), passages.length - 1));
      setQuery(null); setWorked(null); setMessages([]);
    } catch (e) {
      setError(`Embedding failed: ${e.message}`);
    }
  }

  async function embedQuestion(text = question, live = false) {
    if (!text.trim() || (!live && text === query?.text)) return;
    setError(""); setWorked(null); setMessages([]);
    const stored = PRE_EMBEDDED.vectors[text];
    if (stored && !live) { setQuery({ text, vector: stored, how: "stored" }); return; }
    try {
      const started = performance.now();
      const [vector] = await embedder.embed([text]);
      setQuery({ text, vector, how: "live", ms: performance.now() - started });
    } catch (e) {
      setError(`Embedding failed: ${e.message}`);
    }
  }

  // Step 5: the same dot product for every passage, timed.
  const scored = useMemo(() => {
    if (!corpus || !query) return null;
    const started = performance.now();
    const scores = corpus.passages.map((_, i) => cosine(query.vector, corpus.vectors, i));
    return { scores, ms: performance.now() - started, ranked: topK(scores, scores.length) };
  }, [corpus, query]);
  const kept = scored ? scored.ranked.slice(0, k).map(({ i, score }) => ({ index: i, score, title: corpus.title, ...corpus.passages[i] })) : [];
  const system = buildSystem(INSTRUCTIONS, kept);
  const workedIndex = worked ?? scored?.ranked[0]?.i ?? 0;
  const reply = messages.filter(m => m.role === "assistant").at(-1);
  const at = STEPS.findIndex(s => s.id === step);
  const blocked = NEEDS_QUESTION.has(step) && !scored;

  const ctx = { corpus, sample, setSample, query, scored, kept, k, setK, workedIndex, setWorked, system, go };

  return (
    <div className="pipe">
      <section className="pipe-intro">
        <p>When a chatbot “has read” your files, this is usually what happened: the files were cut into passages, each passage was turned into a list of numbers, and when you asked something, your question was turned into numbers too. The passages whose numbers line up best with the question’s are pasted into the prompt. Everything below runs in this page, step by step, on one course text or on your own.</p>
        <div className="pipe-corpus">
          <label>The text
            <select value={textId} onChange={e => chooseText(e.target.value)}>
              {(manifest?.texts ?? []).map(t => <option key={t.id} value={t.id}>{t.title} ({t.author}, {t.passages} passages)</option>)}
              <option value={OWN}>Paste your own text…</option>
            </select>
          </label>
          {corpus && <span className="pipe-muted">{corpus.title} · {plural(corpus.passages.length, "passage")} · the store is {(corpus.bytes / 1024).toFixed(0)} KB</span>}
        </div>
        {textId === OWN && (
          <div className="pipe-own">
            <label className="pipe-field">Title<input value={own.title} onChange={e => setOwn({ ...own, title: e.target.value })} placeholder="My notes" /></label>
            <label className="pipe-field">Text<textarea rows={6} value={own.text} onChange={e => setOwn({ ...own, text: e.target.value })} placeholder="Paste anything. Blank lines separate paragraphs." /></label>
            <button type="button" className="pipe-primary" onClick={embedOwn} disabled={embedder.busy || !own.text.trim()}>Cut it into passages and embed them</button>
            <p className="pipe-muted">Cut and embedded in this browser tab, with the same model as the course texts. Nothing is saved or sent anywhere.</p>
          </div>
        )}
        <EmbedderStatus embedder={embedder} />
        {error && <p className="pipe-error" role="alert">{error}</p>}
      </section>

      <nav className="pipe-steps" aria-label="The steps">
        {STEPS.map((s, n) => (
          <button key={s.id} type="button" aria-current={s.id === step ? "step" : undefined} className={n < at ? "done" : ""} onClick={() => go(s.id)}>
            <span>{n + 1}</span>{s.title}
          </button>
        ))}
      </nav>

      <section className="pipe-stage" id="rag-stage" aria-labelledby="pipe-step-title">
        <h2 id="pipe-step-title"><span>{at + 1}</span> {STEPS[at].title}</h2>
        {!corpus ? <p className="pipe-muted">{textId === OWN ? "Paste a text above and embed it to begin." : "Loading the text…"}</p>
          : blocked ? <p className="pipe-muted">This step needs a question. <button type="button" onClick={() => go("question")}>Go to step 4</button></p>
          : <>
            {step === "chunk" && <Chunk {...ctx} />}
            {step === "embed" && <Embed {...ctx} embedder={embedder} />}
            {step === "store" && <Store {...ctx} textId={textId} />}
            {step === "question" && <Question {...ctx} textId={textId} question={question} setQuestion={setQuestion} embedQuestion={embedQuestion} embedder={embedder} />}
            {step === "compare" && <Compare {...ctx} />}
            {step === "top-k" && <TopK {...ctx} />}
            {step === "prompt" && <Prompt {...ctx} />}
            {step === "answer" && <Answer {...ctx} reply={reply} chatStatus={chatStatus} chatError={chatError} stop={stop}
              ask={() => { setMessages([]); sendMessage({ text: query.text }, { body: { system } }); }} />}
          </>}
        <div className="pipe-nav">
          {at > 0 && <button type="button" onClick={() => go(STEPS[at - 1].id)}>← {at}. {STEPS[at - 1].title}</button>}
          {at < STEPS.length - 1 && <button type="button" className="pipe-primary" onClick={() => go(STEPS[at + 1].id)}>{at + 2}. {STEPS[at + 1].title} →</button>}
        </div>
      </section>

      <Footnotes corpus={corpus} manifest={manifest} />
    </div>
  );
}

function EmbedderStatus({ embedder }) {
  const p = embedder.progress;
  if (embedder.status === "loading") return <p className="pipe-muted" aria-live="polite">Downloading the embedding model ({MODEL}, about 23 MB, once){p?.percent ? `: ${Math.round(p.percent)}%` : "…"}</p>;
  if (embedder.status === "embedding" && p?.total > 1) return <p className="pipe-muted" aria-live="polite">Embedding passage {p.done} of {p.total}…</p>;
  return null;
}

// 1. How the text was cut.
function Chunk({ corpus, sample, setSample, go }) {
  const lengths = corpus.passages.map(p => p.text.length);
  const from = Math.max(0, Math.min(sample - 2, corpus.passages.length - 5));
  const shown = corpus.passages.slice(from, from + 5);
  return (
    <>
      <p className="pipe-lede">The text is cut into {plural(corpus.passages.length, "passage")}. The rule (<code>chunk</code> in <code>lib/retrieval/core.mjs</code>): blank lines separate paragraphs; paragraphs are kept whole and joined until a passage reaches about {TARGET} characters; a paragraph longer than {TARGET * 2} is cut at the end of a sentence. Each passage remembers the heading above it, so an answer can say where it came from.</p>
      <p className="pipe-muted">Shortest {Math.min(...lengths)} characters, longest {Math.max(...lengths)}, average {Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)}. {corpus.origin === "prebuilt" ? "The course texts were cut ahead of time by scripts/build-retrieval-index.mjs; here the passages are laid end to end again, with a mark at each cut." : "Your text was cut in this tab, just now."}</p>
      <div className="pipe-cuts">
        {shown.map((p, n) => {
          const i = from + n;
          return (
            <div key={i} className={`pipe-cut ${i === sample ? "on" : ""}`}>
              <button type="button" className="pipe-cutmark" onClick={() => setSample(i)} aria-pressed={i === sample}>✂ passage {i + 1} · {p.text.length} characters{p.heading ? ` · ${p.heading}` : ""}{i === sample ? " · following this one" : " · follow this one"}</button>
              <p>{p.text}</p>
            </div>
          );
        })}
      </div>
      <div className="pipe-row">
        <button type="button" disabled={from === 0} onClick={() => setSample(Math.max(0, sample - 5))}>← earlier</button>
        <label className="pipe-inline">Passage <input type="number" min={1} max={corpus.passages.length} value={sample + 1} onChange={e => setSample(Math.max(0, Math.min(corpus.passages.length - 1, Number(e.target.value) - 1)))} /> of {corpus.passages.length}</label>
        <button type="button" disabled={from + 5 >= corpus.passages.length} onClick={() => setSample(Math.min(corpus.passages.length - 1, sample + 5))}>later →</button>
      </div>
      <p className="pipe-muted">The highlighted passage is the one the next two steps follow. <button type="button" className="pipe-link" onClick={() => go("embed")}>See it become numbers →</button></p>
    </>
  );
}

const vectorOf = (corpus, i) => Array.from(corpus.vectors.subarray(i * DIMS, (i + 1) * DIMS), b => b / 127);

// 2. One passage becomes 384 numbers.
function Embed({ corpus, sample, embedder }) {
  const v = useMemo(() => vectorOf(corpus, sample), [corpus, sample]);
  const p = corpus.passages[sample];
  const [again, setAgain] = useState(null);
  useEffect(() => setAgain(null), [corpus, sample]);
  const length = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return (
    <>
      <p className="pipe-lede">An embedding model ({MODEL}, a small sentence-embedding model) reads the passage and puts out {DIMS} numbers. Passages about similar things get similar lists. No single number means anything you could name; only the whole list, compared with another list, does.</p>
      <blockquote className="pipe-quote"><span className="pipe-muted">Passage {sample + 1}{p.heading ? ` · ${p.heading}` : ""}</span><br />{p.text.length > 420 ? `${p.text.slice(0, 420)}…` : p.text}</blockquote>
      <p className="pipe-arrow">↓ {MODEL} ↓</p>
      <Strip values={v} label={`Passage ${sample + 1}`} />
      <Numbers values={v} />
      <p className="pipe-muted">The colours are the same numbers: red for positive, blue for negative, brighter for larger. The vector has length 1 (the square root of the sum of the squares of its numbers is {length.toFixed(3)}); every vector here is scaled to length 1, which step 5 relies on. The store keeps each number as a whole number from −127 to 127, to save space, so these are those whole numbers divided by 127, accurate to about two decimal places. The model reads at most 256 word pieces (its model card says longer input is truncated), so the end of a very long passage may not count.</p>
      <div className="pipe-row">
        <button type="button" disabled={embedder.busy} onClick={async () => { const [w] = await embedder.embed([p.text]); setAgain(w.reduce((s, x, k) => s + x * v[k], 0)); }}>Embed this passage again, here in the browser</button>
        {again !== null && <span>The fresh vector and the stored one agree: their dot product is <strong>{again.toFixed(4)}</strong> (1 would be identical; the gap is the rounding to whole numbers).</span>}
      </div>
    </>
  );
}

// 3. The store is just a file.
function Store({ corpus, sample, textId }) {
  const href = textId === OWN ? null : `/retrieval/${textId}.json`;
  const b64 = useMemo(() => JSON.parse(corpus.raw).vectors, [corpus]);
  const offset = sample * DIMS;
  const bytes = Array.from(corpus.vectors.subarray(offset, offset + 8));
  const preview = JSON.stringify({ id: corpus.id, title: corpus.title, model: corpus.model, dims: DIMS, passages: corpus.passages.slice(0, 2) }, null, 2)
    .replace(/\n  \]\n\}$/, `,\n    … ${(corpus.passages.length - 2).toLocaleString()} more passages …\n  ],\n  "vectors": "${b64.slice(0, 64)}… (${b64.length.toLocaleString()} characters in all)"\n}`);
  const download = useMemo(() => (textId === OWN ? URL.createObjectURL(new Blob([corpus.raw], { type: "application/json" })) : null), [corpus, textId]);
  return (
    <>
      <p className="pipe-lede">There is no database. The whole store is one JSON file of {(corpus.bytes / 1024).toFixed(0)} KB: the passages, in order, and then every passage’s {DIMS} numbers packed into one long string ({corpus.passages.length} × {DIMS} = {(corpus.passages.length * DIMS).toLocaleString()} numbers, one byte each, written in base64). {href ? <>It is served like any other file: <a className="pipe-a" href={href} target="_blank" rel="noreferrer">{href}</a>.</> : <>This one was built in your tab, in exactly the course texts’ format: <a className="pipe-a" href={download} download="your-text.json">download it</a>.</>}</p>
      <pre className="pipe-json">{preview}</pre>
      <p className="pipe-lede">To find passage {sample + 1}’s numbers, skip {sample} × {DIMS} = {offset.toLocaleString()} bytes into the string and read the next {DIMS}. Its first eight bytes, as whole numbers, then divided by 127:</p>
      <table className="pipe-table pipe-bytes">
        <thead><tr><th>byte</th>{bytes.map((_, n) => <th key={n}>{offset + n}</th>)}</tr></thead>
        <tbody>
          <tr><th>stored</th>{bytes.map((b, n) => <td key={n}>{b}</td>)}</tr>
          <tr><th>÷ 127</th>{bytes.map((b, n) => <td key={n}>{fmt(b / 127)}</td>)}</tr>
        </tbody>
      </table>
      <p className="pipe-muted">The page loaded this file once ({(corpus.bytes / 1024).toFixed(0)} KB) and searches it in memory. That works for a few texts; the footnote below says what changes at a million passages.</p>
    </>
  );
}

// 4. The question goes through the same model.
function Question({ corpus, textId, question, setQuestion, embedQuestion, query, embedder, sample, go }) {
  const examples = [...new Set([...(QUESTIONS[textId] ?? []), ...Object.values(QUESTIONS).flat()])].slice(0, 5);
  const p = useMemo(() => vectorOf(corpus, sample), [corpus, sample]);
  return (
    <>
      <p className="pipe-lede">The question has to become numbers too, with the same model: two different models’ numbers can’t be compared. Type a question about {corpus.title}, or pick one.</p>
      <form className="pipe-ask" onSubmit={e => { e.preventDefault(); embedQuestion(question, true); }}>
        <input value={question} onChange={e => setQuestion(e.target.value)} aria-label="Question" />
        <button type="submit" className="pipe-primary" disabled={embedder.busy || !question.trim()}>Embed the question</button>
      </form>
      <div className="pipe-chips">{examples.map(q => <button type="button" key={q} disabled={embedder.busy} onClick={() => { setQuestion(q); embedQuestion(q); }}>{q}</button>)}</div>
      <p className="pipe-muted">Example questions use numbers computed ahead of time with the same model on {PRE_EMBEDDED.embedded} (app/rag/tools/embed-questions.mjs), so they work before the model has downloaded. A typed question is embedded here, in your browser; the first one downloads the model (about 23 MB).</p>
      {query && <>
        <Strip values={query.vector} label={`“${query.text}”`} />
        <Strip values={p} label={`Passage ${sample + 1}, from step 2`} />
        <Numbers values={query.vector} />
        <p className="pipe-muted">{query.how === "stored" ? <>These numbers were stored ahead of time. <button type="button" className="pipe-link" disabled={embedder.busy} onClick={() => embedQuestion(query.text, true)}>Embed it here instead</button></> : `Embedded in this browser in ${Math.round(query.ms)} ms.`} Compare the two strips: where both are red, or both blue, the two lists agree. Step 5 adds that agreement up. <button type="button" className="pipe-link" onClick={() => go("compare")}>Compare them →</button></p>
      </>}
    </>
  );
}

// 5. The dot product, worked for one passage, then done for all of them.
function Compare({ corpus, query, scored, workedIndex, setWorked, sample }) {
  const p = useMemo(() => vectorOf(corpus, workedIndex), [corpus, workedIndex]);
  const q = query.vector;
  const products = p.map((x, k) => q[k] * x);
  const [all, setAll] = useState(false);
  let running = 0;
  const rows = products.map((x, k) => ({ k, q: q[k], p: p[k], x, sum: (running += x) }));
  const score = scored.scores[workedIndex];
  const rank = scored.ranked.findIndex(r => r.i === workedIndex) + 1;
  const angle = (Math.acos(Math.max(-1, Math.min(1, score))) * 180) / Math.PI;
  const shown = all ? rows : [...rows.slice(0, 8), null, ...rows.slice(-3)];
  return (
    <>
      <p className="pipe-lede">To score a passage, multiply the question’s first number by the passage’s first number, the second by the second, and so on to the {DIMS}th, and add up the {DIMS} products. That sum is the <em>dot product</em>. Because both lists have length 1, it is also the cosine of the angle between them: 1 means the same direction, 0 unrelated, negative opposed.</p>
      <div className="pipe-row">
        <span>Worked for passage {workedIndex + 1}{corpus.passages[workedIndex].heading ? ` (${corpus.passages[workedIndex].heading})` : ""}, ranked {rank} of {corpus.passages.length}.</span>
        <button type="button" onClick={() => setWorked(null)} disabled={workedIndex === scored.ranked[0].i}>the top passage</button>
        <button type="button" onClick={() => setWorked(sample)} disabled={workedIndex === sample}>passage {sample + 1}, from step 2</button>
      </div>
      <Strip values={q} label="question" />
      <Strip values={p} label={`passage ${workedIndex + 1}`} />
      <Strip values={products} label="question × passage" />
      <div className="pipe-tablewrap">
        <table className="pipe-table pipe-dot">
          <thead><tr><th>#</th><th>question</th><th></th><th>passage</th><th></th><th>product</th><th>running total</th></tr></thead>
          <tbody>
            {shown.map((r, n) => r ? (
              <tr key={r.k} className={r.x > 0 ? "plus" : "minus"}><td>{r.k + 1}</td><td>{fmt(r.q, 4)}</td><td>×</td><td>{fmt(r.p, 4)}</td><td>=</td><td>{fmt(r.x, 5)}</td><td>{fmt(r.sum, 4)}</td></tr>
            ) : (
              <tr key={`gap-${n}`}><td colSpan={7}><button type="button" className="pipe-link" onClick={() => setAll(true)}>… show all {DIMS} rows …</button></td></tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={5}>sum of {DIMS} products</td><td colSpan={2}><strong>{score.toFixed(4)}</strong> (an angle of {angle.toFixed(1)}°)</td></tr></tfoot>
        </table>
      </div>
      <p className="pipe-lede">Then the same {DIMS} multiplications for every passage: {corpus.passages.length.toLocaleString()} × {DIMS} = {(corpus.passages.length * DIMS).toLocaleString()} multiplications, which took this browser {scored.ms < 1 ? "under a millisecond" : `${scored.ms.toFixed(1)} ms`}. Each bar is one passage, in the order they come in the text; click one to work it above.</p>
      <ScoreMap corpus={corpus} scored={scored} workedIndex={workedIndex} setWorked={setWorked} />
    </>
  );
}

function ScoreMap({ corpus, scored, workedIndex, setWorked }) {
  const n = scored.scores.length, max = Math.max(...scored.scores), min = Math.min(0, ...scored.scores);
  const y = s => 100 - ((s - min) / (max - min || 1)) * 96;
  return (
    <figure className="pipe-map">
      <svg viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" role="img" aria-label={`Scores of all ${n} passages in text order, from ${min.toFixed(2)} to ${max.toFixed(2)}`}>
        {scored.scores.map((s, i) => <rect key={i} x={i + 0.1} width={0.8} y={y(s)} height={y(min) - y(s)} className={i === workedIndex ? "worked" : ""} onClick={() => setWorked(i)}><title>{`Passage ${i + 1}: ${s.toFixed(3)}${corpus.passages[i].heading ? ` · ${corpus.passages[i].heading}` : ""}`}</title></rect>)}
      </svg>
      <figcaption className="pipe-muted">Passage 1 on the left, passage {n} on the right. Highest {max.toFixed(3)} (passage {scored.ranked[0].i + 1}).</figcaption>
    </figure>
  );
}

// 6. Keep the best k.
function TopK({ corpus, scored, k, setK, kept }) {
  const shown = scored.ranked.slice(0, 40);
  const max = shown[0].score, min = Math.min(0, shown.at(-1).score);
  const next = scored.ranked[k];
  return (
    <>
      <p className="pipe-lede">Sort the passages by score and keep the first k. Nothing in the scores says where to stop: k is a setting someone chose (here, {k}), and the passage just below the line is often barely worse than the one just above it.</p>
      <label className="pipe-inline">k = <input type="range" min={1} max={10} value={k} onChange={e => setK(Number(e.target.value))} /> <strong>{k}</strong></label>
      <figure className="pipe-sorted">
        <svg viewBox={`0 0 ${shown.length * 10} 100`} preserveAspectRatio="none" role="img" aria-label={`The top ${shown.length} scores, sorted; the first ${k} are kept`}>
          {shown.map((r, i) => { const h = ((r.score - min) / (max - min || 1)) * 96; return <rect key={r.i} x={i * 10 + 1} width={8} y={100 - h} height={h} className={i < k ? "kept" : ""}><title>{`#${i + 1}: passage ${r.i + 1}, ${r.score.toFixed(3)}`}</title></rect>; })}
          <line x1={k * 10} x2={k * 10} y1={0} y2={100} />
        </svg>
        <figcaption className="pipe-muted">The best {shown.length} of {corpus.passages.length}, sorted. Kept: {kept[0].score.toFixed(3)} down to {kept.at(-1).score.toFixed(3)}; the first one left out scored {next ? next.score.toFixed(3) : "—"}.</figcaption>
      </figure>
      <ol className="pipe-kept">
        {kept.map((r, n) => (
          <li key={r.index}>
            <span className="pipe-score">[{n + 1}] <code>{r.score.toFixed(3)}</code> passage {r.index + 1}{r.heading ? ` · ${r.heading}` : ""}</span>
            <details><summary>{r.text.slice(0, 160)}{r.text.length > 160 ? "…" : ""}</summary><p>{r.text}</p></details>
          </li>
        ))}
      </ol>
    </>
  );
}

// 7. Exactly what goes into the context window.
function Prompt({ system, query, kept }) {
  const passages = system.slice(system.indexOf("<retrieved_passages>"));
  const parts = [
    { label: "instructions", size: INSTRUCTIONS.length, cls: "a" },
    { label: `${kept.length} passages`, size: passages.length, cls: "b" },
    { label: "question", size: query.text.length, cls: "c" },
  ];
  const total = parts.reduce((s, x) => s + x.size, 0);
  return (
    <>
      <p className="pipe-lede">This is the whole of what the model is given: the instructions with the {kept.length} passages pasted in (sent as the system prompt), then the question (sent as the user’s message). The model never sees the file, the numbers, or the passages that weren’t kept. About {Math.round(total / 4).toLocaleString()} tokens (counting roughly four characters to a token).</p>
      <div className="pipe-window" role="img" aria-label="How the prompt divides between instructions, passages, and question">
        {parts.map(x => <span key={x.label} className={x.cls} style={{ flexGrow: x.size }} title={`${x.label}: ${x.size.toLocaleString()} characters`}>{x.label}</span>)}
      </div>
      <pre className="pipe-prompt"><span className="pipe-role">system</span>{"\n"}{system}{"\n\n"}<span className="pipe-role">user</span>{"\n"}{query.text}</pre>
      <p className="pipe-muted">The page sends exactly this to the app’s <code>/api/chat</code> route, which passes it to Claude through OpenRouter without adding anything (<code>app/api/chat/route.js</code>).</p>
    </>
  );
}

// 8. The answer, with its citations traced back.
function Answer({ query, kept, reply, chatStatus, chatError, stop, ask }) {
  const busy = chatStatus === "submitted" || chatStatus === "streaming";
  const text = reply?.parts.filter(p => p.type === "text").map(p => p.text).join("") ?? "";
  const cited = [...new Set([...text.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1])))].filter(n => n >= 1 && n <= kept.length).sort((a, b) => a - b);
  const quotes = busy ? [] : checkQuotes(text, kept);
  return (
    <>
      <p className="pipe-lede">Send the prompt from step 7 to Claude. The answer can only draw on the {kept.length} passages it was given (and on whatever it already knows: the instructions ask it not to, which it may or may not honour).</p>
      <div className="pipe-row">
        <button type="button" className="pipe-primary" disabled={busy} onClick={ask}>Ask Claude: “{query.text}”</button>
        {busy && <button type="button" onClick={stop}>Stop</button>}
        <span className="pipe-muted">One paid call per click.</span>
      </div>
      {chatError && <p className="pipe-error" role="alert">{readError(chatError)}</p>}
      {text && <div className="pipe-reply"><ReactMarkdown>{text}</ReactMarkdown></div>}
      {text && !busy && (
        <div className="pipe-cited">
          <p className="pipe-muted">{cited.length ? `It cites ${cited.map(n => `[${n}]`).join(", ")}. Those are:` : "It cites none of the passages by number."}</p>
          <ul>{cited.map(n => <li key={n}><strong>[{n}]</strong> passage {kept[n - 1].index + 1}{kept[n - 1].heading ? ` · ${kept[n - 1].heading}` : ""} <span className="pipe-muted">(score {kept[n - 1].score.toFixed(3)})</span>: {kept[n - 1].text.slice(0, 200)}…</li>)}</ul>
          {quotes.length > 0 && <>
            <p className="pipe-muted">Its quotations, checked word for word against the {kept.length} passages it was given:</p>
            <ul className="pipe-quotes">{quotes.map(q => <li key={q.text} className={!q.found.length ? "missing" : q.cited && !q.found.includes(q.cited) ? "elsewhere" : "found"}>{!q.found.length ? "✗" : q.cited && !q.found.includes(q.cited) ? "≠" : "✓"} “{q.text}” <span className="pipe-muted">{q.found.length ? `is in ${q.found.map(n => `[${n}]`).join(", ")}` : "is in none of them"}{q.cited && q.found.length && !q.found.includes(q.cited) ? `, though the answer cites [${q.cited}]` : ""}</span></li>)}</ul>
          </>}
        </div>
      )}
    </>
  );
}

// Every quotation of a few words or more in the answer, and which of the given passages contain it word for word
// (ignoring case, curly vs straight quotes, line breaks, and a final comma or full stop).
const flat = t => t.toLowerCase().replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/[_*]/g, "").replace(/\s+/g, " ").trim();
function checkQuotes(answer, kept) {
  const passages = kept.map(r => flat(r.text));
  const seen = new Set();
  return [...answer.matchAll(/[“"]([^”"\n]{12,}?)[”"](?:[^\[\n“"]{0,40}?\[(\d+)\])?/g)]
    .map(m => ({ text: m[1].trim(), cited: m[2] ? Number(m[2]) : null }))
    .filter(q => q.text.split(/\s+/).length >= 3 && !seen.has(q.text) && seen.add(q.text))
    .map(q => {
      const needle = flat(q.text).replace(/[.,;:]$/, "");
      return { ...q, found: passages.flatMap((p, n) => (p.includes(needle) ? [n + 1] : [])) };
    });
}

function readError(error) {
  try { return JSON.parse(error.message).error ?? error.message; } catch { return error.message; }
}

function Strip({ values, label }) {
  const scale = Math.max(...values.map(Math.abs)) || 1;
  return (
    <figure className="pipe-strip">
      <figcaption>{label}</figcaption>
      <svg viewBox={`0 0 ${values.length} 1`} preserveAspectRatio="none" role="img" aria-label={`${label}: ${values.length} numbers as colours`}>
        {values.map((v, k) => <rect key={k} x={k} width={1.02} height={1} fill={v >= 0 ? `rgba(255,84,104,${Math.abs(v) / scale})` : `rgba(90,160,255,${Math.abs(v) / scale})`}><title>{`#${k + 1}: ${fmt(v, 4)}`}</title></rect>)}
      </svg>
    </figure>
  );
}

function Numbers({ values }) {
  return (
    <details className="pipe-numbers">
      <summary>All {values.length} numbers</summary>
      <ol>{values.map((v, k) => <li key={k} className={v >= 0 ? "plus" : "minus"} title={`#${k + 1}`}>{fmt(v)}</li>)}</ol>
    </details>
  );
}

function Footnotes({ corpus, manifest }) {
  const chars = corpus?.passages.reduce((s, p) => s + p.text.length, 0);
  return (
    <aside className="pipe-foot">
      <h3>Footnotes</h3>
      <p><strong>The industrial version.</strong> This page keeps a few hundred vectors in one file and compares the question with every one of them. With millions of passages, the vectors usually go into a database built for them. One is pgvector, “open-source vector similarity search for Postgres”: it adds a vector column to an ordinary Postgres table and finds the nearest vectors by inner product, cosine, or other distances. By default it compares the question with every row, as this page does; its approximate indexes (HNSW and IVFFlat) skip most of the comparisons and, in its README’s words, “trade some recall for speed”: they can miss a passage that would have made the top k. The score is the same dot product as step 5.</p>
      <p><strong>Or skip retrieval.</strong> {chars ? <>All of {corpus.title} is about {Math.round(chars / 4 / 1000)} thousand tokens ({Math.round(chars / 1000)} thousand characters, at roughly four to a token). </> : null}Many current models accept a context window of that size or larger (verify the limit of the model you use), so for a short text the alternative is to paste the whole of it into the prompt and let the model read everything, at the cost of a larger prompt on every question. Retrieval sends a few passages instead and depends on the search having found the right ones.</p>
      <p><strong>Compare searches.</strong> <Link className="pipe-a" href="/retrieval">Knowledge files</Link> runs the same search over several texts at once, side by side with a keyword search (BM25), with a histogram of every passage’s score and instructions you can edit.</p>
    </aside>
  );
}
