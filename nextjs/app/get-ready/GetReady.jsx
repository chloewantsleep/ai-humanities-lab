"use client";

import { useEffect, useRef, useState } from "react";
import { readDevicePreference, saveDevicePreference } from "../../lib/browser-lm/device-preference.mjs";
import { cacheInventory, chooseDevice, MODELS, prepareModels } from "./preparation.mjs";
import { loadWorkshopModel, measureDevice } from "./loaders.js";

const deviceName = device => device === "webgpu" ? "WebGPU (GPU)" : "WASM (CPU)";

export default function GetReady() {
  const [states, setStates] = useState({});
  const [cached, setCached] = useState({});
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("");
  const [measurements, setMeasurements] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [saved, setSaved] = useState(false);
  const [previous, setPrevious] = useState(null);
  const [error, setError] = useState("");
  const controller = useRef(null);

  useEffect(() => {
    setPrevious(readDevicePreference(null));
    cacheInventory().then(setCached).catch(() => {});
    return () => controller.current?.abort();
  }, []);

  function stop() {
    controller.current?.abort();
    controller.current = null;
    setBusy(false); setPhase("Stopped. Completed downloads remain in this browser’s cache.");
    setStates(current => Object.fromEntries(Object.entries(current).map(([id, state]) => [id, state.status === "loading" ? { ...state, status: "stopped", progress: null } : state])));
  }

  async function prepare() {
    if (controller.current) return;
    const job = new AbortController();
    controller.current = job;
    const current = () => controller.current === job && !job.signal.aborted;
    setBusy(true); setError(""); setRecommendation(null); setMeasurements([]); setPhase("Downloading and checking models, one at a time…");
    try {
      const complete = await prepareModels({
        signal: job.signal,
        load: (model, progress) => loadWorkshopModel(model, job.signal, progress),
        onState: (id, patch) => { if (current()) setStates(states => ({ ...states, [id]: { ...states[id], ...patch } })); },
      });
      if (!current()) return;
      if (!complete) { setPhase("Some models are not cached yet. Check their messages and retry."); return; }
      setPhase("Speed check: measuring WASM (CPU)…");
      const samples = [];
      for (const device of ["wasm", "webgpu"]) {
        job.signal.throwIfAborted();
        if (device === "webgpu") {
          setPhase("Speed check: checking WebGPU…");
          let adapter;
          try { adapter = await navigator.gpu?.requestAdapter(); } catch { /* No usable GPU; CPU remains available. */ }
          job.signal.throwIfAborted();
          if (!adapter) { samples.push({ device, error: "No WebGPU adapter is available in this browser." }); setMeasurements([...samples]); break; }
          setPhase("Speed check: measuring WebGPU (GPU)…");
        }
        try { samples.push(await measureDevice(device, job.signal)); }
        catch (error) { job.signal.throwIfAborted(); samples.push({ device, error: error.message }); }
        if (current()) setMeasurements([...samples]);
      }
      job.signal.throwIfAborted();
      const best = chooseDevice(samples);
      if (!best) throw new Error("The models are cached, but neither speed check completed. You can retry or use the recorded GPT-2 runs.");
      const persisted = saveDevicePreference(best);
      setSaved(persisted); setRecommendation(best); setPrevious(best);
      setPhase("You’re ready for the browser experiments.");
    } catch (error) { if (current()) { setError(error.message); setPhase("Preparation did not finish. You can retry."); } }
    finally { if (current()) { setBusy(false); controller.current = null; } }
  }

  const ready = MODELS.every(model => states[model.id]?.status === "ready") && Boolean(recommendation);
  return <div className="ready-lab">
    <p className="ready-intro">Open this page before the session, preferably before everyone joins the same wifi. It prepares the models used by <a href="/gpt-2">GPT-2</a>, <a href="/by-hand">the assistant by hand</a>, and <a href="/retrieval">retrieval</a> in this browser.</p>
    <div className="ready-start">
      <h2>01 / Prepare this browser</h2>
      <p>About <strong>435 MB</strong> of model files on a first visit, plus the app and runtime. Sizes below are estimates. Nothing downloads until you press the button. Cached files are reused; models are checked one at a time to limit memory use.</p>
      <div className="ready-actions"><button type="button" className="ready-primary" disabled={busy} onClick={prepare}>{busy ? "Preparing…" : ready ? "Check again" : "Download models and check speed"}</button>{busy && <button type="button" onClick={stop}>Stop preparation</button>}</div>
      <p className="ready-status" role="status">{phase || "Ready to begin. Keep this tab open until the checks finish."}</p>
      {error && <p className="ready-error" role="alert">{error}</p>}
      {previous && !recommendation && <p className="ready-muted">Previously saved device: {deviceName(previous)}. A saved choice is not a check that model files are still present.</p>}
    </div>
    <div className="ready-models">{MODELS.map(model => {
      const state = states[model.id] ?? { status: "idle" };
      const progress = state.progress;
      const percent = progress?.percent;
      return <section className="ready-model" key={model.id} data-model={model.id} data-state={state.status}>
        <div className="ready-model-heading"><h3>{model.label}</h3><span>{state.status === "ready" ? "✓ Cached and checked" : `≈ ${model.mb} MB`}</span></div>
        <p className="ready-muted">{model.role} · <a href={model.use}>{model.use}</a></p>
        {state.status === "idle" && <p>{cached[model.id] ? "Weights found in this browser; prepare to verify the model." : "Not checked yet."}</p>}
        {state.status === "loading" && <div role="status"><progress max={100} value={Number.isFinite(percent) ? percent : undefined} aria-label={`${model.label} progress`} /><p>{progress?.loadedBytes ? `${(progress.loadedBytes / 1e6).toFixed(1)} / ${(progress.totalBytes / 1e6).toFixed(1)} MB` : progress?.file ? `${progress.file}: ${Math.round(percent ?? 0)}% of this file` : "Loading and checking…"}</p></div>}
        {state.status === "error" && <p className="ready-error" role="alert">{state.error} Check the connection and retry preparation.</p>}
        {state.status === "uncached" && <p className="ready-error">The model loaded, but its weights could not be confirmed in the browser cache. Check browser storage settings or space, then retry.</p>}
        {state.status === "stopped" && <p>Stopped. Retry to finish checking this model.</p>}
      </section>;
    })}</div>
    <section className="ready-speed">
      <h2>02 / A quick speed check</h2>
      <p>After downloading, GPT-2 warms up for four tokens, then continues the same short text for 32 tokens on each available device. This measures generation, not download time. WebGPU is tried only if an adapter is available; WASM wins a close result (within 10%). Long preambles and other models can behave differently.</p>
      {measurements.length ? <ul>{measurements.map(m => <li key={m.device}><strong>{deviceName(m.device)}:</strong> {m.error || `${m.tps.toFixed(1)} tokens/s · ${m.tokens} tokens`}</li>)}</ul> : <p className="ready-muted">The speed check starts after all four models have been cached and checked.</p>}
      {recommendation && <p><strong>Recommended: {deviceName(recommendation)}.</strong> {saved ? "Saved for this browser. GPT-2 and By hand restore this choice; you can still change their device selectors." : "This browser blocked saving the preference. Choose this device on the experiment pages."}</p>}
    </section>
    <section className={`ready-finish${ready ? " is-ready" : ""}`} aria-live="polite">
      <h2>{ready ? "✓ You’re ready" : "03 / When you’re ready"}</h2>
      <p>{ready ? "The four models were loaded and their weight files confirmed in this browser’s shared cache. The speed check is complete." : "All four model checks and the speed check must finish before this page marks the browser ready."}</p>
      <p><a href="/gpt-2">Continue to GPT-2 →</a> · <a href="/by-hand">By hand →</a> · <a href="/retrieval">Retrieval →</a></p>
      <p className="ready-muted">Keep using this browser and this site address. Another browser, private window, or different port has a different cache. Pages still initialize their workers, and the runtime or page code may need internet. This is not an offline installation. If the download fails, <a href="/gpt-2">GPT-2’s recorded runs</a> need no model download.</p>
    </section>
    <p className="ready-muted">These downloads and speed checks run locally and need no API key. Claude answers still use the server’s configured API key; this page does not test or spend that credit. The optional Gemma model on /gpt-2 is not part of the classroom preload.</p>
  </div>;
}
