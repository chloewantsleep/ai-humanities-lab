"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { makeComparison, PERSONAS, retrieve } from "./comparison.mjs";

async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status}).`);
  return response.json();
}

export default function KnowledgeVoice({ hasKey }) {
  const [texts, setTexts] = useState([]);
  const [corpusId, setCorpusId] = useState("frankenstein");
  const [question, setQuestion] = useState("What does a creator owe the being they create?");
  const [personaId, setPersonaId] = useState("creature");
  const [custom, setCustom] = useState("Explain carefully, then end with one surprising question.");
  const [includeExamples, setIncludeExamples] = useState(false);
  const [run, setRun] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState("");
  const [reflection, setReflection] = useState("");
  const answers = useRef({});
  const runId = useRef(0);
  const busy = preparing || answering;

  useEffect(() => {
    let active = true;
    loadJSON("/retrieval/manifest.json").then(d => { if (active) setTexts(d.texts); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, []);

  async function prepare(event) {
    event.preventDefault();
    if (busy) return;
    setPreparing(true); setError("");
    try {
      const corpus = await loadJSON(`/retrieval/${corpusId}.json`);
      const persona = personaId === "custom" ? custom.trim() : PERSONAS.find(p => p.id === personaId).instructions;
      const comparison = makeComparison({ question, corpus: corpus.title, persona, results: retrieve(corpus, question), includeExamples });
      setRun({ ...comparison, id: ++runId.current });
      setReflection("");
    } catch (e) { setError(e.message); }
    finally { setPreparing(false); }
  }

  async function askAll() {
    if (answering || !hasKey) return;
    setAnswering(true);
    try { await Promise.all(run.cells.map(cell => answers.current[cell.id]?.ask())); }
    finally { setAnswering(false); }
  }

  return <div className="kv-lab">
    <p className="kv-intro">One question. Two changes: supply passages, or ask for a voice. Compare across a row to change the files; compare down a column to change the instructions. Do the effects stay separate?</p>
    <form className="kv-setup" onSubmit={prepare}>
      <fieldset disabled={busy}>
        <legend>01 / Set up the comparison</legend>
        <label className="kv-field">One question<textarea rows={2} required maxLength={2000} value={question} onChange={e => setQuestion(e.target.value)} /></label>
        <div className="kv-controls">
          <label className="kv-field">Knowledge file<select value={corpusId} onChange={e => setCorpusId(e.target.value)}>{texts.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>
          <label className="kv-field">Voice preset<select value={personaId} onChange={e => setPersonaId(e.target.value)}>{PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
        </div>
        {personaId === "custom" ? <label className="kv-field">Write the voice instructions<textarea rows={3} required maxLength={4000} value={custom} onChange={e => setCustom(e.target.value)} /></label> : <p className="kv-muted">{PERSONAS.find(p => p.id === personaId).instructions} These directions are our interpretation.</p>}
        <label className="kv-check"><input type="checkbox" checked={includeExamples} onChange={e => setIncludeExamples(e.target.checked)} /> Add a fifth answer: use the found passages as voice examples, without an evidence file.</label>
        <button className="kv-primary" disabled={!texts.length || !question.trim() || (personaId === "custom" && !custom.trim())} type="submit">{preparing ? "Finding passages…" : "Prepare the comparison"}</button>
      </fieldset>
      <p className="kv-muted">Uses keyword search (BM25) over the same course-text index as <a href="/retrieval">/retrieval</a>. Keeps up to three matching passages. No embedding download or key is needed to prepare prompts.</p>
    </form>
    {!hasKey && <p className="kv-notice" role="status">Answers need OPENROUTER_API_KEY in nextjs/.env.local and a server restart. You can still retrieve passages and inspect every prompt.</p>}
    {error && <p className="kv-error" role="alert">{error}</p>}
    {run && <section className="kv-comparison" aria-labelledby="kv-comparison-title">
      <h2 id="kv-comparison-title">02 / The comparison</h2>
      <p>Prepared question: <strong>{run.question}</strong></p>
      <p className="kv-muted">The cards below keep this question and these instructions until you prepare again. “No files” still has the model’s existing knowledge; it does not mean a blank mind. {run.cells.length === 5 && "The fifth card gets the same excerpts labeled as voice examples; it gets no evidence passages or named persona."}</p>
      <details className="kv-sources"><summary>Inspect the shared evidence · {run.results.length} passages from {run.corpus}</summary>
        <p className="kv-muted">Both “files” cards receive exactly these passages. BM25 scores measure word matches, not truth or support.</p>
        {run.results.length ? run.results.map((r, i) => <article key={r.index}><h3>[{i + 1}] {r.title} · passage {r.index + 1}</h3><p className="kv-muted">{r.heading} · BM25 {r.score.toFixed(2)}</p><p className="kv-excerpt">{r.text}</p></article>) : <p>No keyword matches. The files cards receive an empty retrieval block. Try words used in the text.</p>}
      </details>
      <div className="kv-actions">
        <button type="button" className="kv-primary" disabled={!hasKey || busy} onClick={askAll}>{answering ? "Answering…" : `Ask Claude in all ${run.cells.length === 5 ? "five" : "four"} cells`}</button>
        {answering && <button type="button" onClick={() => Object.values(answers.current).forEach(answer => answer?.stop())}>Stop all</button>}
        <span className="kv-muted">{run.cells.length} separate requests; no conversation history. Repeating replaces all answers.</span>
      </div>
      <div className="kv-matrix" aria-label="Plain assistant above persona; no files left and files right">
        {run.cells.slice(0, 4).map(cell => <Answer key={`${run.id}-${cell.id}`} ref={answer => { answers.current[cell.id] = answer; }} cell={cell} question={run.question} />)}
      </div>
      {run.cells[4] && <div className="kv-fifth"><p className="kv-muted">Optional fifth condition · The text is present, but its assigned job changes. An instruction cannot guarantee that its facts will have no influence.</p><Answer key={`${run.id}-examples-none`} ref={answer => { answers.current["examples-none"] = answer; }} cell={run.cells[4]} question={run.question} /></div>}
      <label className="kv-field kv-reflection">03 / What changed?<span className="kv-muted">Name one change in evidence and one in manner. Did the supplied text change the voice? Did the persona change what the answer claimed? Use phrases from the answers as evidence.</span><textarea rows={4} value={reflection} onChange={e => setReflection(e.target.value)} placeholder="My comparison… (kept only in this tab)" /></label>
    </section>}
    <p className="kv-muted">This is an experiment in prompting, not a clean separation of knowledge from style. Passages carry voices; instructions can alter claims. Independent model samples can also vary.</p>
  </div>;
}

function Answer({ ref, cell, question }) {
  const [receipt, setReceipt] = useState(null);
  const [completion, setCompletion] = useState("");
  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onData: part => { if (part.type === "data-request") setReceipt(part.data); },
    onFinish: result => setCompletion(result.isAbort ? "Stopped; any text below is partial." : result.isDisconnect ? "Connection ended; text may be partial." : result.isError ? "Request failed; text may be partial." : "Answer complete."),
  });
  const [attempted, setAttempted] = useState(false);
  useImperativeHandle(ref, () => ({
    ask: async () => {
      setAttempted(true); setReceipt(null); setCompletion(""); setMessages([]);
      await sendMessage({ text: question }, { body: { system: cell.system } });
    },
    stop,
  }));
  const text = messages.filter(m => m.role === "assistant").flatMap(m => m.parts.filter(p => p.type === "text").map(p => p.text)).join("\n");
  const pending = status === "submitted" || status === "streaming";
  let errorText = error?.message;
  try { errorText = JSON.parse(errorText).error ?? errorText; } catch { /* Plain SDK errors are already readable. */ }
  return <article className="kv-cell" aria-busy={pending}>
    <h3>{cell.title}</h3>
    <details><summary>Show the prompt</summary><p className="kv-muted">{receipt ? `Server confirmed · ${receipt.model}` : attempted ? "Submitted to the shared chat route." : "Prepared; not sent yet."}</p><pre>{`SYSTEM\n${receipt?.system ?? cell.system}\n\nUSER\n${question}`}</pre></details>
    <p className="kv-muted" role="status">{pending ? (text ? "Claude is answering…" : "Waiting for Claude…") : error ? "Request failed." : completion || (attempted ? "Request ended." : "Prompt prepared; no request sent yet.")}</p>
    {error && <p className="kv-error" role="alert">{errorText}</p>}
    {text && <div className="kv-answer"><ReactMarkdown>{text}</ReactMarkdown></div>}
  </article>;
}
