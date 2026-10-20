"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";
import { readDevicePreference } from "../../lib/browser-lm/device-preference.mjs";
import { HHH_SOURCE, PRESETS, buildPrompt, cutText, describePlan, parsePreamble, planPreamble, questionTurn, splitHeader, unitsOf } from "./preamble.mjs";
import "./by-hand.css";

// Columns 1 and 2 can run either base model; column 3 is the Instruct sibling of SmolLM2; column 4 is Claude via /api/chat.
const BASE_MODELS = [
  { id: "onnx-community/SmolLM2-135M-ONNX", label: "SmolLM2-135M", note: "base, 135M, 8,192-token window" },
  { id: "Xenova/gpt2", label: "GPT-2", note: "base, 124M, 1,024-token window" },
];
const INSTRUCT_MODEL = { id: "onnx-community/SmolLM2-135M-Instruct-ONNX", label: "SmolLM2-135M-Instruct", note: "the post-trained sibling of SmolLM2-135M" };
const EXAMPLES = ["Who wrote Frankenstein?", "Why is the sky blue?", "Write me a two-line poem about a robot."];
const DEFAULTS = { temperature: 0.7, topK: 40, maxNewTokens: 120 };
const BOTH_SIDES_TOKENS = 240;
const WASM_SAFE_CAP = 800; // on the CPU path, reading the whole 6,500-token prompt took 15 minutes in testing, and 1,400 tokens took 48 s
const labelOf = id => BASE_MODELS.find(m => m.id === id)?.label ?? id;
const seconds = ms => `${(ms / 1000).toFixed(1)} s`;
const n = x => (x ?? 0).toLocaleString("en-US");

const FINISH = {
  eos: "stopped at the end-of-text token",
  stop: "stopped at the end of its turn",
  length: "hit the token budget",
  context: "hit the end of the context window",
  abort: "stopped by you",
};

// Output text with special tokens (<|im_start|>) and role markers (Human:, Assistant:) picked out.
function Marked({ text, cursor }) {
  const parts = (text ?? "").split(/(<\|[^|<>\s]+\|>|^(?:Human|Assistant):)/m);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^<\|[^|]+\|>$/.test(part)) return <span key={i} className="bh-tok">{part}</span>;
        if (/^(Human|Assistant):$/.test(part)) return <b key={i} className="bh-role">{part}</b>;
        return <span key={i}>{part}</span>;
      })}
      {cursor && <span className="bh-cursor" aria-hidden="true" />}
    </>
  );
}

// The status, progress bar, and load button of one browser model.
function ModelStatus({ lm, label, onLoad }) {
  const busy = ["loading", "generating"].includes(lm.status);
  return (
    <div className="bh-status" role="status">
      <div>
        <strong>{lm.status === "idle" ? "Not loaded" : lm.status}</strong>
        {lm.model && <> · {lm.model.device} · {lm.model.dtype} · {(lm.model.totalBytes / 1e6).toFixed(0)} MB · window {n(lm.model.contextLimit)} tokens</>}
      </div>
      {lm.model?.fallbackReason && <div>{lm.model.fallbackReason}</div>}
      {lm.status === "loading" && (
        <>
          <progress max="100" value={lm.progress?.percent ?? undefined} />
          <div>{lm.progress ? `${(lm.progress.loadedBytes / 1e6).toFixed(0)} of ${(lm.progress.totalBytes / 1e6).toFixed(0)} MB (${lm.progress.percent?.toFixed(0) ?? "?"}%)` : "Starting the worker…"}</div>
        </>
      )}
      {lm.status === "error" && <div className="bh-error">{lm.error}</div>}
      {lm.status === "idle" || lm.status === "error" ? <div className="bh-actions"><button type="button" onClick={onLoad} disabled={busy}>Load {label}</button></div> : null}
    </div>
  );
}

function Stats({ lm, run }) {
  const r = lm.result;
  const s = lm.step;
  if (!r && !s) return null;
  const tps = (r ?? s).tokensPerSecond;
  return (
    <p className="bh-stats">
      {r ? <>{n(r.promptTokens)} prompt tokens · first token after {run?.firstMs != null ? seconds(run.firstMs) : "?"} · {n(r.generatedTokens)} tokens in {seconds(r.elapsedMs)} ({tps.toFixed(1)}/s) · {FINISH[r.finishReason] ?? r.finishReason}{r.stopString ? ` (${JSON.stringify(r.stopString)})` : ""}</>
        : <>{n(s.generatedTokens)} tokens · {tps.toFixed(1)}/s{run?.firstMs != null ? ` · first token after ${seconds(run.firstMs)}` : ""}</>}
    </p>
  );
}

export default function ByHandLab({ hhhFile }) {
  const hhh = useMemo(() => splitHeader(hhhFile), [hhhFile]);
  const presets = useMemo(() => PRESETS.map(p => (p.id === "hhh" ? { ...p, text: hhh.text } : p)), [hhh]);
  const [question, setQuestion] = useState(EXAMPLES[0]);
  const [settings, setSettings] = useState(DEFAULTS);
  const [device, setDevice] = useState("auto");
  useEffect(() => { setDevice(readDevicePreference("auto")); }, []);
  const [model1, setModel1] = useState(BASE_MODELS[0].id);
  const [model2, setModel2] = useState(BASE_MODELS[0].id);
  const lm1 = useBrowserLM(model1);
  const lm2 = useBrowserLM(model2);
  const lm3 = useBrowserLM(INSTRUCT_MODEL.id);
  const [presetId, setPresetId] = useState("hhh");
  const [preambleText, setPreambleText] = useState(hhh.text);
  const [bothSides, setBothSides] = useState(false);
  const [cap, setCap] = useState(2000); // 2000 = the last 2,000 tokens (the default, for speed); 0 = the whole preamble
  const [run1, setRun1] = useState(null);
  const [run2, setRun2] = useState(null);
  const [run3, setRun3] = useState(null);
  const [run4, setRun4] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);

  // Column 4: Claude through the shared route. The route's transient data-request event is the exact request it sent.
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const chat = useChat({
    transport,
    onData: part => { if (part.type === "data-request") setRun4(r => ({ ...r, request: part.data })); },
    onFinish: () => setRun4(r => (r ? { ...r, doneAt: performance.now() } : r)),
  });
  const reply = useMemo(() => chat.messages.filter(m => m.role === "assistant").at(-1)?.parts.filter(p => p.type === "text").map(p => p.text).join("") ?? "", [chat.messages]);
  useEffect(() => { if (reply && run4 && run4.firstAt == null) setRun4(r => ({ ...r, firstAt: performance.now() })); }, [reply, run4]);
  const claudeError = useMemo(() => {
    if (!chat.error) return null;
    try { return JSON.parse(chat.error.message).error ?? chat.error.message; } catch { return chat.error.message; }
  }, [chat.error]);
  const claudeBusy = chat.status === "submitted" || chat.status === "streaming";

  const { temperature, topK, maxNewTokens } = settings;
  const q = question.trim();

  const load = useCallback(async lm => { try { await lm.load({ device }); } catch { /* shown in the column */ } }, [device]);
  const loadAll = async () => {
    setLoadingAll(true);
    // One at a time: columns 1 and 2 usually share a model, and the second load then reads the browser cache.
    for (const lm of [lm1, lm2, lm3]) if (lm.status === "idle" || lm.status === "error") await load(lm);
    setLoadingAll(false);
  };

  const firstStep = setRun => step => setRun(r => (r && r.firstMs == null ? { ...r, firstMs: step.elapsedMs } : r));

  // Column 1: the question as plain text, and nothing else.
  const askRaw = async () => {
    if (lm1.status !== "ready") return;
    const prompt = `${q}\n`;
    setRun1({ prompt, firstMs: null, error: null });
    try { await lm1.generate({ prompt, temperature, topK, maxNewTokens, stopStrings: [], neverStop: false }, firstStep(setRun1)); }
    catch (e) { setRun1(r => ({ ...r, error: e.message })); }
  };

  // Column 2: fit the preamble to the model's window, then the question as one more "Human:" turn.
  const askPreamble = async () => {
    if (lm2.status !== "ready") return;
    const label = labelOf(model2);
    const reserved = bothSides ? Math.max(maxNewTokens, BOTH_SIDES_TOKENS) : maxNewTokens;
    setRun2({ status: "counting", firstMs: null, error: null });
    try {
      const parsed = parsePreamble(preambleText);
      const counted = await lm2.count([...unitsOf(parsed), questionTurn(q)]);
      const contextLimit = counted.contextLimit;
      const counts = counted.counts.slice(0, -1);
      const questionTokens = counted.counts.at(-1);
      const autoCapped = cap === 0 && lm2.model?.device === "wasm";
      const effectiveCap = autoCapped ? WASM_SAFE_CAP : cap;
      const limit = Math.min(contextLimit - reserved, effectiveCap || Infinity);
      let budget = limit - questionTokens - 2;
      let plan, prompt, promptTokens;
      for (let attempt = 0; attempt < 8; attempt++) {
        plan = planPreamble(parsed, counts, budget);
        prompt = buildPrompt(plan.preamble, q);
        promptTokens = (await lm2.count([prompt])).counts[0];
        if (!plan.fits || promptTokens <= limit || plan.keptExchanges === 0) break;
        budget -= promptTokens - limit; // the per-unit estimate was a little short; trim and recount
      }
      if (!plan.fits || promptTokens > limit) {
        setRun2({ error: describePlan({ ...plan, fits: false, introTokens: plan.fits ? promptTokens : plan.introTokens, budget: limit }, { modelLabel: label, contextLimit, reserved, cap: effectiveCap, autoCapped }) });
        return;
      }
      const description = describePlan(plan, { modelLabel: label, contextLimit, reserved, promptTokens, cap: effectiveCap, autoCapped });
      const cut = plan.cutExchanges ? cutText(parsed, plan) : "";
      setRun2({ status: "generating", prompt, plan, description, cut, promptTokens, contextLimit, reserved, bothSides, firstMs: null, error: null });
      await lm2.generate({
        prompt, temperature, topK, maxNewTokens: reserved,
        stopStrings: bothSides ? [] : ["\nHuman:", "\n-----"], neverStop: bothSides,
      }, firstStep(setRun2));
    } catch (e) { setRun2(r => ({ ...r, error: e.message })); }
  };

  // Column 3: the Instruct model's own chat template, special tokens and all.
  const askInstruct = async () => {
    if (lm3.status !== "ready") return;
    setRun3({ firstMs: null, error: null });
    try { await lm3.generate({ messages: [{ role: "user", content: q }], temperature, topK, maxNewTokens, stopStrings: [], neverStop: false }, firstStep(setRun3)); }
    catch (e) { setRun3(r => ({ ...r, error: e.message })); }
  };

  // Column 4: no system prompt; just the question.
  const askClaude = () => {
    chat.setMessages([]);
    setRun4({ startedAt: performance.now(), firstAt: null, doneAt: null, request: null });
    chat.sendMessage({ text: q });
  };

  const askAll = () => { if (!q) return; askRaw(); askPreamble(); askInstruct(); askClaude(); };
  const anyBusy = [lm1, lm2, lm3].some(lm => lm.status === "generating") || claudeBusy || run2?.status === "counting";
  const loaded = [lm1, lm2, lm3].filter(lm => lm.status === "ready" || lm.status === "generating").length;

  const choosePreset = id => {
    setPresetId(id);
    const preset = presets.find(p => p.id === id);
    if (preset) setPreambleText(preset.text);
  };
  const editPreamble = text => { setPreambleText(text); setPresetId("custom"); };

  return (
    <div className="bh-lab">
      <p className="bh-intro">
        One question goes to four places at once. Columns 1 to 3 run small language models inside this browser tab (each is about 130 to 140 MB the first time, then cached);
        column 4 goes to Claude through this site&rsquo;s server. Load the models, pick or type a question, and ask all four.
      </p>

      <section className="bh-ask" aria-label="Ask">
        <div className="bh-ask-row">
          <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask something" aria-label="Question" onKeyDown={e => { if (e.key === "Enter") askAll(); }} />
          <button type="button" className="bh-primary" onClick={askAll} disabled={!q || anyBusy}>Ask all four</button>
        </div>
        <div className="bh-examples">
          <span className="bh-muted">Try:</span>
          {EXAMPLES.map(x => <button key={x} type="button" onClick={() => setQuestion(x)}>{x}</button>)}
        </div>
        <div className="bh-settings">
          <button type="button" onClick={loadAll} disabled={loadingAll || loaded === 3}>{loaded === 3 ? "All three models loaded" : loadingAll ? "Loading…" : `Load the ${3 - loaded === 3 ? "three" : "remaining"} browser models`}</button>
          <label>Run on <select value={device} onChange={e => setDevice(e.target.value)} disabled={loadingAll} aria-label="Device"><option value="auto">WebGPU if available, else WASM</option><option value="wasm">WASM (CPU)</option><option value="webgpu">WebGPU only</option></select></label>
          <label>Temperature <input type="range" min="0" max="1.5" step="0.1" value={temperature} onChange={e => setSettings(s => ({ ...s, temperature: Number(e.target.value) }))} /> {temperature.toFixed(1)}</label>
          <label>Max new tokens <input type="number" min="8" max="1024" value={maxNewTokens} onChange={e => setSettings(s => ({ ...s, maxNewTokens: Math.max(8, Number(e.target.value) || 8) }))} /></label>
        </div>
      </section>

      <div className="bh-columns">
        {/* 1. The raw base model */}
        <section className="bh-col" aria-label="Column 1: raw base model">
          <div className="bh-col-head">
            <span className="bh-num">1 · RAW BASE MODEL</span>
            <h3>Just the text</h3>
            <select value={model1} onChange={e => setModel1(e.target.value)} disabled={["loading", "generating"].includes(lm1.status)} aria-label="Column 1 model">
              {BASE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}: {m.note}</option>)}
            </select>
            <p className="bh-blurb">The question, a newline, and nothing else. A base model only continues the document it is given.</p>
          </div>
          <ModelStatus lm={lm1} label={labelOf(model1)} onLoad={() => load(lm1)} />
          <div className="bh-actions">
            <button type="button" onClick={askRaw} disabled={lm1.status !== "ready" || !q}>Ask column 1</button>
            {lm1.status === "generating" && <button type="button" onClick={lm1.abort}>Stop</button>}
          </div>
          <pre className="bh-output" aria-live="polite"><Marked text={lm1.text} cursor={lm1.status === "generating"} /></pre>
          {run1?.error && <p className="bh-error">{run1.error}</p>}
          <Stats lm={lm1} run={run1} />
          {run1?.prompt && <details className="bh-details"><summary>Exactly what was sent</summary><pre>{run1.prompt}</pre></details>}
        </section>

        {/* 2. The same base model with a preamble */}
        <section className="bh-col" aria-label="Column 2: base model with a preamble">
          <div className="bh-col-head">
            <span className="bh-num">2 · THE ASSISTANT WRITTEN INTO THE PROMPT</span>
            <h3>A script in front of the question</h3>
            <select value={model2} onChange={e => setModel2(e.target.value)} disabled={["loading", "generating"].includes(lm2.status)} aria-label="Column 2 model">
              {BASE_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}: {m.note}</option>)}
            </select>
            <p className="bh-blurb">The same kind of base model, but the question arrives at the end of a long document of invented conversations with a helpful assistant. The model continues the document, so it plays the assistant.</p>
          </div>
          <ModelStatus lm={lm2} label={labelOf(model2)} onLoad={() => load(lm2)} />
          <label className="bh-field">Preamble
            <select value={presetId} onChange={e => choosePreset(e.target.value)} disabled={lm2.status === "generating"}>
              {presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              <option value="custom">Custom (edited below)</option>
            </select>
          </label>
          <fieldset className="bh-toggle" disabled={lm2.status === "generating"}>
            <legend>How much of the preamble to send</legend>
            <label className={cap === 2000 ? "on" : ""}>
              <input type="radio" name="bh-cap" value="2000" checked={cap === 2000} onChange={() => setCap(2000)} />
              <b>The last 2,000 tokens</b>
              <span>The introduction and the final conversations. First token in 15 to 20 s on WebGPU in testing. The default, for speed.</span>
            </label>
            <label className={cap === 0 ? "on" : ""}>
              <input type="radio" name="bh-cap" value="whole" checked={cap === 0} onChange={() => setCap(0)} />
              <b>The whole prompt</b>
              <span>All 6,500 tokens, faithful to the paper. The model reads it all before its first token: 40 s or more on WebGPU. On the CPU path (WASM) the page caps it at 800 tokens, about half a minute, because the whole prompt took 15 minutes there.</span>
            </label>
          </fieldset>
          <label className="bh-field">The text, editable
            <textarea value={preambleText} onChange={e => editPreamble(e.target.value)} spellCheck={false} disabled={lm2.status === "generating"} />
          </label>
          <details className="bh-details">
            <summary>Read the original prompt and where it came from</summary>
            <span className="bh-muted">{hhh.header[0]} Source: <a href={HHH_SOURCE.gist} target="_blank" rel="noreferrer">the gist linked from the paper</a> · <a href={HHH_SOURCE.paper} target="_blank" rel="noreferrer">the paper</a>. Fetched {HHH_SOURCE.fetched}; the file in this repo is checked against the gist by hash. Running it on these small models is our experiment, not a recreation of Anthropic&rsquo;s results: they used their own models, up to 52B parameters.</span>
            <pre>{hhh.text}</pre>
          </details>
          <label className="bh-switch"><input type="checkbox" checked={bothSides} onChange={e => setBothSides(e.target.checked)} /> Let it write both sides (don&rsquo;t stop at the next &ldquo;Human:&rdquo;)</label>
          <div className="bh-actions">
            <button type="button" onClick={askPreamble} disabled={lm2.status !== "ready" || !q || run2?.status === "counting"}>Ask column 2</button>
            {lm2.status === "generating" && <button type="button" onClick={lm2.abort}>Stop</button>}
          </div>
          {run2?.status === "counting" && <p className="bh-muted">Counting tokens and fitting the preamble to the window…</p>}
          {run2?.status === "generating" && lm2.status === "generating" && !lm2.step && <p className="bh-muted">Reading {n(run2.promptTokens)} tokens of prompt before the first token…</p>}
          <pre className="bh-output" aria-live="polite"><Marked text={lm2.text} cursor={lm2.status === "generating"} /></pre>
          {run2?.error && <p className="bh-error">{run2.error}</p>}
          <Stats lm={lm2} run={run2} />
          {run2?.description && <p className="bh-note">{run2.description}</p>}
          {run2?.prompt && <details className="bh-details"><summary>Exactly what was sent ({n(run2.promptTokens)} tokens)</summary><pre>{run2.prompt}</pre></details>}
          {run2?.cut && <details className="bh-details"><summary>What was cut</summary><pre>{run2.cut}</pre></details>}
        </section>

        {/* 3. The instruct model with its template */}
        <section className="bh-col" aria-label="Column 3: instruct model">
          <div className="bh-col-head">
            <span className="bh-num">3 · THE INSTRUCT MODEL</span>
            <h3>{INSTRUCT_MODEL.label}</h3>
            <p className="bh-blurb">{INSTRUCT_MODEL.note}: the same pretraining, then fine-tuned on conversations. Its chat template wraps the question in special tokens and a built-in system line; the exact string it receives is below.</p>
          </div>
          <ModelStatus lm={lm3} label={INSTRUCT_MODEL.label} onLoad={() => load(lm3)} />
          <div className="bh-actions">
            <button type="button" onClick={askInstruct} disabled={lm3.status !== "ready" || !q}>Ask column 3</button>
            {lm3.status === "generating" && <button type="button" onClick={lm3.abort}>Stop</button>}
          </div>
          <pre className="bh-output" aria-live="polite"><Marked text={lm3.text} cursor={lm3.status === "generating"} /></pre>
          {run3?.error && <p className="bh-error">{run3.error}</p>}
          <Stats lm={lm3} run={run3} />
          {lm3.templatedPrompt && <details className="bh-details" open><summary>Exactly what was sent</summary><pre><Marked text={lm3.templatedPrompt} /></pre></details>}
        </section>

        {/* 4. Claude */}
        <section className="bh-col" aria-label="Column 4: Claude">
          <div className="bh-col-head">
            <span className="bh-num">4 · CLAUDE</span>
            <h3>{run4?.request?.model ?? "Claude, through OpenRouter"}</h3>
            <p className="bh-blurb">How far post-training has carried the same object. No system prompt: just the question, sent to this site&rsquo;s <code>/api/chat</code> route.</p>
          </div>
          <div className="bh-status" role="status"><div><strong>{claudeBusy ? chat.status : "Ready"}</strong> · runs on a server, needs a key</div></div>
          <div className="bh-actions">
            <button type="button" onClick={askClaude} disabled={claudeBusy || !q}>Ask column 4</button>
            {claudeBusy && <button type="button" onClick={() => chat.stop()}>Stop</button>}
          </div>
          <pre className="bh-output bh-prose" aria-live="polite">{reply}{claudeBusy && <span className="bh-cursor" aria-hidden="true" />}</pre>
          {claudeError && <p className="bh-error">{claudeError}{/OPENROUTER_API_KEY/.test(claudeError) ? " Column 4 needs that key; columns 1 to 3 work without it." : ""}</p>}
          {run4 && (reply || run4.doneAt) && (
            <p className="bh-stats">
              {run4.firstAt != null ? `first text after ${seconds(run4.firstAt - run4.startedAt)}` : "waiting"}{run4.doneAt ? ` · done in ${seconds(run4.doneAt - run4.startedAt)} · ${n(reply.length)} characters` : ""}
            </p>
          )}
          {run4?.request && <details className="bh-details"><summary>Exactly what was sent</summary><pre>{JSON.stringify(run4.request, null, 2)}</pre></details>}
        </section>
      </div>
      <p className="bh-caveat" style={{ marginTop: 16 }}>
        Sampling is at temperature {temperature.toFixed(1)} with top-k {topK} for the browser models, so the same question gives different answers each time; set the temperature to 0 for the most likely continuation every time. Nothing about columns 1 to 3 leaves this tab.
      </p>
    </div>
  );
}
