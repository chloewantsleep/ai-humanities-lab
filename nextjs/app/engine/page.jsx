"use client";

import { useState } from "react";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";
import "./engine.css";

const models = [
  "Xenova/gpt2", "onnx-community/SmolLM2-135M-ONNX",
  "onnx-community/SmolLM2-135M-Instruct-ONNX", "HuggingFaceTB/SmolLM2-135M-Instruct",
  "onnx-community/gemma-3-270m-ONNX", "onnx-community/gemma-3-270m-it-ONNX",
  "onnx-community/Qwen3-0.6B-ONNX",
];
const bytes = n => `${((n ?? 0) / 1e6).toFixed(2)} MB`;

export default function EnginePage() {
  const [modelId, setModelId] = useState(models[0]);
  const [device, setDevice] = useState("auto");
  const [dtype, setDtype] = useState("q8");
  const [prompt, setPrompt] = useState("Who are you?\n");
  const [chat, setChat] = useState(false);
  const [temperature, setTemperature] = useState(0.8);
  const [topK, setTopK] = useState(20);
  const [maxNewTokens, setMaxNewTokens] = useState(64);
  const [neverStop, setNeverStop] = useState(false);
  const [stops, setStops] = useState("");
  const [localError, setLocalError] = useState(null);
  const lm = useBrowserLM(modelId);
  const busy = ["loading", "generating"].includes(lm.status);
  const run = async action => {
    setLocalError(null);
    try { await action(); } catch (error) { setLocalError(error.message); }
  };
  const metrics = lm.result ?? lm.step;
  return <main id="main" className="engine-page">
    <a href="/">← Experiments</a>
    <h1>Browser language-model engine</h1>
    <p>Task A test bench. Models download from Hugging Face and stay in this browser’s cache. Inference runs in a worker.</p>
    <fieldset disabled={busy}>
      <legend>Model</legend>
      <label>Model id <input list="engine-models" value={modelId} onChange={e => setModelId(e.target.value)} /></label>
      <datalist id="engine-models">{models.map(id => <option key={id} value={id} />)}</datalist>
      <label>Device <select value={device} onChange={e => setDevice(e.target.value)}><option value="auto">WebGPU, with WASM fallback</option><option value="wasm">WASM</option><option value="webgpu">WebGPU only (diagnostic)</option></select></label>
      <label>Weights <select value={dtype} onChange={e => setDtype(e.target.value)}>{["q8", "q4", "q4f16", "fp16", "fp32"].map(x => <option key={x}>{x}</option>)}</select></label>
      <button onClick={() => run(() => lm.load({ device, dtype }))}>Load model</button>
    </fieldset>
    <div role="status" data-testid="engine-status">
      <strong>{lm.status}</strong>{lm.model && <> · {lm.model.device} · {lm.model.dtype} · model assets {bytes(lm.model.totalBytes)}</>}
      {lm.model?.fallbackReason && <p>{lm.model.fallbackReason}</p>}
      {lm.status === "loading" && lm.progress && <>
        <p>{bytes(lm.progress.loadedBytes)} / {bytes(lm.progress.totalBytes)} · {lm.progress.percent?.toFixed(1) ?? "?"}% of files discovered so far</p>
        <progress max="100" value={lm.progress.percent ?? undefined} />
        <p>{lm.progress.event.file ?? lm.progress.event.status} (loading includes session compilation)</p>
      </>}
    </div>
    {(lm.error || localError) && <p role="alert">{localError ?? lm.error}</p>}
    <fieldset disabled={busy}>
      <legend>Generation</legend>
      <label>Prompt <textarea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} /></label>
      <label><input type="checkbox" checked={chat} onChange={e => setChat(e.target.checked)} /> Apply chat template (prompt is one user message)</label>
      <div className="engine-controls">
        <label>Temperature <input type="number" min="0" max="100" step="0.1" value={temperature} onChange={e => setTemperature(Number(e.target.value))} /></label>
        <label>Top-k (0 = all) <input type="number" min="0" value={topK} onChange={e => setTopK(Number(e.target.value))} /></label>
        <label>Max new tokens <input type="number" min="1" value={maxNewTokens} onChange={e => setMaxNewTokens(Number(e.target.value))} /></label>
      </div>
      <label>Stop strings (one per line) <textarea rows={2} value={stops} onChange={e => setStops(e.target.value)} /></label>
      <label><input type="checkbox" checked={neverStop} onChange={e => setNeverStop(e.target.checked)} /> Never stop at EOS (token budget, stop strings, context limit and Abort still apply)</label>
      <button disabled={!lm.model} onClick={() => run(() => lm.generate({
        ...(chat ? { messages: [{ role: "user", content: prompt }] } : { prompt }),
        temperature, topK, maxNewTokens, neverStop, stopStrings: stops.split("\n").filter(Boolean),
      }))}>Generate</button>
    </fieldset>
    <button disabled={lm.status !== "generating"} onClick={lm.abort}>Abort</button>
    {metrics && <p data-testid="engine-metrics">{metrics.generatedTokens} tokens · {(metrics.elapsedMs / 1000).toFixed(2)} s · {metrics.tokensPerSecond.toFixed(2)} tokens/s{lm.result && ` · ${lm.result.finishReason}`}</p>}
    <h2>Continuation</h2><pre data-testid="engine-output">{lm.text || "(no output yet)"}</pre>
    {lm.templatedPrompt !== null && <><h2>Exact templated prompt</h2><pre data-testid="engine-template">{lm.templatedPrompt}</pre></>}
    <h2>Latest next-token distribution</h2>
    <p>Probability is after temperature and top-k renormalization. Temperature 0 selects the most likely token. Special tokens remain visible.</p>
    {lm.step && <p>Step {lm.step.index + 1}: chose {JSON.stringify(lm.step.tokenText)} (id {lm.step.tokenId})</p>}
    <div className="engine-distribution">{lm.step?.candidates.slice(0, 100).map(candidate => <div key={candidate.id}>
      <code>{JSON.stringify(candidate.text)}</code><meter min="0" max="1" value={candidate.probability} /><span>{(100 * candidate.probability).toFixed(2)}%</span>
    </div>)}</div>
    {lm.model && <details><summary>Asset byte counts (model and tokenizer; cached reads count too)</summary><pre>{JSON.stringify(lm.model.files, null, 2)}</pre></details>}
  </main>;
}
