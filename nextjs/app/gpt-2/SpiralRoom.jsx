"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";
import { readDevicePreference } from "../../lib/browser-lm/device-preference.mjs";
import recorded from "./recorded.json";
import { addPiece, END_TOKENS, firstBreak } from "./pieces.mjs";
import { DEFAULTS, STARTERS } from "./starters.mjs";

// GPT-2 is the point of the page; the other two are extras for machines and connections that can take them.
const MODELS = [
  {
    id: "Xenova/gpt2", name: "GPT-2 small", short: "GPT-2", year: "2019", mb: 130,
    note: "OpenAI's 2019 model, 124M parameters, trained on web pages linked from Reddit. It predates chatbots.",
  },
  {
    id: "onnx-community/SmolLM2-135M-ONNX", name: "SmolLM2-135M base", short: "SmolLM2", year: "2024", mb: 140,
    note: "A 2024 base model of the same size. Its training text already contains chatbot transcripts.",
  },
  {
    id: "onnx-community/gemma-3-270m-ONNX", name: "Gemma 3 270M pt", short: "Gemma 3", year: "2025", mb: 440,
    note: "Google's pretrained (not instruction-tuned) small Gemma. A 440 MB download: try it at home, not on classroom wifi.",
  },
];

const PRESETS = [
  { label: "Default", temperature: 0.9, topK: 40, hint: "Sampled, as GPT-2's own published samples were." },
  { label: "Greedy", temperature: 0, topK: 40, hint: "Always the top token. Watch it loop." },
  { label: "Hot", temperature: 1.6, topK: 100, hint: "Flatter odds, stranger words." },
];

const visible = text => text.replace(/ /g, "␣").replace(/\n/g, "↵").replace(/\t/g, "⇥") || "∅";
const mb = bytes => `${Math.round((bytes ?? 0) / 1e6)} MB`;
const seconds = ms => `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)} s`;

function useCachedModels() {
  const [cached, setCached] = useState({});
  const check = async () => {
    try {
      const cache = await caches.open("transformers-cache");
      const urls = (await cache.keys()).map(r => r.url);
      setCached(Object.fromEntries(MODELS.map(m => [m.id, urls.some(u => u.includes(`/${m.id}/`) && u.endsWith(".onnx"))])));
    } catch { setCached({}); }
  };
  useEffect(() => { check(); }, []);
  return [cached, check];
}

export default function SpiralRoom() {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [device, setDevice] = useState("wasm");
  useEffect(() => { setDevice(readDevicePreference("wasm")); }, []);
  const model = MODELS.find(m => m.id === modelId);
  const lm = useBrowserLM(modelId);
  const [cached, recheckCache] = useCachedModels();

  const [mode, setMode] = useState("live"); // live | recorded
  const [editing, setEditing] = useState(true);
  const [draft, setDraft] = useState(STARTERS[1].prompt);
  const [docPrompt, setDocPrompt] = useState("");
  const [pieces, setPieces] = useState([]);
  const [steps, setSteps] = useState([]);
  const [finish, setFinish] = useState(null);
  const [running, setRunning] = useState(false);
  const [pinned, setPinned] = useState(null);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(DEFAULTS);
  const [loadStarted, setLoadStarted] = useState(null);
  const [now, setNow] = useState(0);
  const [take, setTake] = useState(null);
  const playback = useRef(null);
  const runToken = useRef(0); // bumped on every clear, so a stopped run's late tokens are dropped

  const loading = lm.status === "loading";
  // A failed generation sets the hook's status to "error" but leaves the model loaded.
  const ready = !!lm.model && !loading;

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [loading]);
  useEffect(() => () => clearInterval(playback.current), []);

  async function load() {
    setError(null);
    setLoadStarted(Date.now());
    setNow(Date.now());
    try { await lm.load({ device }); recheckCache(); }
    catch (e) { setError(e.message); }
  }

  function clearRun(prompt) {
    runToken.current++;
    clearInterval(playback.current);
    setDocPrompt(prompt);
    setPieces([]);
    setSteps([]);
    setFinish(null);
    setPinned(null);
    setError(null);
    setEditing(false);
  }

  async function run(prompt = draft) {
    if (!prompt.length || running) return;
    clearRun(prompt);
    const token = runToken.current;
    setRunning(true);
    const started = performance.now();
    let collected = [];
    try {
      const result = await lm.generate({
        prompt, temperature: settings.temperature, topK: settings.topK,
        maxNewTokens: settings.maxNewTokens, neverStop: settings.neverStop,
      }, step => {
        if (token !== runToken.current) return;
        collected = [...collected, step];
        setSteps(collected);
        setPieces(p => addPiece(p, step.text));
      });
      if (token !== runToken.current) return;
      setFinish({ reason: result.finishReason, tokens: result.generatedTokens, ms: result.elapsedMs, tps: result.tokensPerSecond, firstTokenMs: collected[0]?.elapsedMs });
      // For the recording and test scripts (app/gpt-2/tools/): the last run, in full.
      window.spiralLastRun = { modelId, device: lm.model?.device, settings, prompt, result, steps: collected, wallMs: performance.now() - started };
    } catch (e) {
      setError(e.message);
      if (!collected.length) setEditing(true);
    } finally { setRunning(false); }
  }

  function playRecorded(take) {
    clearRun(take.prompt);
    setTake(take);
    setRunning(true);
    const all = take.steps.map((s, index) => ({
      index, tokenId: s.id, tokenText: s.tok, candidates: s.c.map(([text, probability, id]) => ({ text, probability, id })),
    }));
    let i = 0;
    playback.current = setInterval(() => {
      if (i >= all.length) {
        clearInterval(playback.current);
        setRunning(false);
        setFinish({ reason: take.finishReason, tokens: all.length, recorded: true });
        return;
      }
      const step = all[i], piece = take.steps[i].t;
      setSteps(prev => [...prev, step]);
      setPieces(prev => [...prev, piece]);
      i++;
    }, 1000 / 20);
  }

  function stop() {
    if (mode === "recorded") {
      clearInterval(playback.current);
      setRunning(false);
      setFinish({ reason: "abort", tokens: steps.length, recorded: true });
    } else lm.abort();
  }

  // Switching modes stops whatever is running and clears the page, so a live run never sits under the recorded label.
  function switchMode(next) {
    if (running) stop();
    runToken.current++;
    clearInterval(playback.current);
    setMode(next);
    setPieces([]); setSteps([]); setDocPrompt(""); setFinish(null); setTake(null); setPinned(null);
    setEditing(next === "live");
  }

  function starter(s) {
    setDraft(s.prompt);
    if (ready && !running) run(s.prompt);
    else setEditing(true);
  }

  const continuation = pieces.join("");
  const breakAt = useMemo(() => firstBreak(pieces), [pieces]);
  const tokensPast = breakAt >= 0 ? pieces.length - breakAt - 1 : 0;
  const ends = pieces.filter(p => END_TOKENS.some(t => p.includes(t))).length;
  const shown = steps[pinned ?? steps.length - 1];
  // In recorded mode the controls show the take's settings, read-only.
  const shownSettings = mode === "recorded" ? take?.settings ?? recorded.runs[0].settings : settings;
  const greedy = shownSettings.temperature === 0;

  // Download state for the notice.
  const elapsed = loadStarted && loading ? now - loadStarted : 0;
  const loadedBytes = lm.progress?.loadedBytes ?? 0;
  const totalBytes = Math.max(lm.progress?.totalBytes ?? 0, model.mb * 1e6);
  const rate = elapsed > 2000 ? loadedBytes / (elapsed / 1000) : 0;
  const eta = rate > 0 ? (totalBytes - loadedBytes) / rate : null;
  const slow = elapsed > 20000 && (eta === null || eta > 60);

  return (
    <div className="spiral">
      <p className="spiral-intro">
        A <strong>base model</strong> has only learned to continue text. Type a question and it doesn&rsquo;t answer: it keeps writing the document, and the document drifts, repeats, and spirals. Like the creature in <em>Frankenstein</em>, who learns language by watching the cottagers through &ldquo;a small and almost imperceptible chink&rdquo; in the wall, GPT-2 learned from text it overheard. Nobody in that text was talking to it.
      </p>

      <div className="spiral-modes" role="tablist" aria-label="Live or recorded">
        <button role="tab" aria-selected={mode === "live"} onClick={() => switchMode("live")}>Live, in this browser</button>
        <button role="tab" aria-selected={mode === "recorded"} onClick={() => switchMode("recorded")}>Recorded runs</button>
      </div>

      <div className="spiral-grid">
        <section className="spiral-main" aria-label="The document">
          {mode === "live" && !ready && (
            <div className="spiral-load" data-testid="spiral-load">
              <label className="spiral-model">
                <span>Model</span>
                <select value={modelId} disabled={loading} onChange={e => { setModelId(e.target.value); setError(null); setLoadStarted(null); }}>
                  {MODELS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.year}) · {m.mb} MB</option>)}
                </select>
              </label>
              <p className="spiral-note">{model.note}</p>
              {!loading && (
                <>
                  <p>
                    {cached[modelId]
                      ? <>{model.short} is already in this browser&rsquo;s cache, so loading takes a few seconds.</>
                      : <>The first time, this downloads about <strong>{model.mb} MB</strong> from Hugging Face. That&rsquo;s under a minute on good wifi and several minutes if the whole room starts at once. After that it&rsquo;s cached in this browser. The model then runs on your laptop: nothing you type is sent anywhere.</>}
                  </p>
                  <div className="spiral-row">
                    <button className="spiral-primary" onClick={load} data-testid="spiral-load-button">
                      {cached[modelId] ? `Load ${model.short}` : `Download ${model.short} (${model.mb} MB)`}
                    </button>
                    <label className="spiral-device">
                      Run on
                      <select value={device} onChange={e => setDevice(e.target.value)}>
                        <option value="wasm">CPU (WASM): fastest on most laptops</option>
                        <option value="auto">GPU (WebGPU) if available</option>
                      </select>
                    </label>
                  </div>
                  <p className="spiral-muted">No wifi, or no time? <button className="spiral-link" onClick={() => switchMode("recorded")}>Watch recorded runs</button> instead.</p>
                </>
              )}
              {loading && (
                <div role="status" className="spiral-progress">
                  <progress max={totalBytes} value={loadedBytes} />
                  <p>
                    {mb(loadedBytes)} of about {mb(totalBytes)} · {seconds(elapsed)}
                    {rate > 0 && <> · {(rate / 1e6).toFixed(1)} MB/s</>}
                    {eta !== null && eta > 1 && <> · about {Math.ceil(eta)} s to go</>}
                    {loadedBytes >= totalBytes * 0.98 && <> · getting the model ready…</>}
                  </p>
                  {slow && (
                    <p className="spiral-warn">
                      This is slow, probably because everyone is downloading at once. Leave it running, and <button className="spiral-link" onClick={() => switchMode("recorded")}>watch a recorded run</button> while it finishes.
                    </p>
                  )}
                </div>
              )}
              {error && (
                <div role="alert" className="spiral-error">
                  <p>The model didn&rsquo;t load: {error}</p>
                  <p>Check the wifi and <button className="spiral-link" onClick={load}>try again</button>, or <button className="spiral-link" onClick={() => switchMode("recorded")}>watch recorded runs</button>.</p>
                </div>
              )}
            </div>
          )}

          {mode === "recorded" && (
            <p className="spiral-recorded-label" data-testid="spiral-recorded-label">
              <strong>Recorded, not live.</strong> {recorded.source} on {recorded.recorded}.{" "}
              {take
                ? <>This take: temperature {take.settings.temperature}, top-k {take.settings.topK}, {take.settings.maxNewTokens} tokens{take.settings.neverStop && ", end-of-text ignored"}.</>
                : "Pick one to replay it at the speed it was written."}
            </p>
          )}

          {(ready || mode === "recorded") && (
            <div className="spiral-starters">
              <span className="spiral-muted">{mode === "recorded" ? "Recorded:" : "Starters:"}</span>
              {mode === "recorded"
                ? recorded.runs.map(r => <button key={r.id} onClick={() => playRecorded(r)} disabled={running}>{r.label}</button>)
                : STARTERS.map(s => <button key={s.id} onClick={() => starter(s)} disabled={running}>{s.label}</button>)}
            </div>
          )}

          {mode === "live" && ready && editing ? (
            <textarea
              className="spiral-text" aria-label="Text for the model to continue" value={draft} rows={8}
              onChange={e => setDraft(e.target.value)} spellCheck={false}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(); }}
              data-testid="spiral-textarea"
            />
          ) : (docPrompt || mode === "live" && ready) && (
            <div className="spiral-doc" data-testid="spiral-doc" aria-live="off">
              <span className="spiral-prompt">{docPrompt}</span>
              {pieces.map((piece, i) => {
                const end = END_TOKENS.find(t => piece.includes(t));
                return (
                  <span key={i}>
                    <span
                      className={`spiral-token${i === pinned ? " pinned" : ""}${i === steps.length - 1 && running ? " latest" : ""}`}
                      onClick={() => setPinned(i === pinned ? null : i)}
                    >
                      {end ? <>{piece.replace(end, "")}<mark className="spiral-eos" title="The model's end-of-text token. Ignored, so it kept going.">end of text</mark></> : piece}
                    </span>
                    {i === breakAt && <span className="spiral-break" title="An answer could have ended here">answer could have ended here</span>}
                  </span>
                );
              })}
              {running && <span className="spiral-cursor" aria-hidden="true" />}
            </div>
          )}

          {(ready || mode === "recorded") && (
            <div className="spiral-row spiral-actions">
              {mode === "live" && editing && <button className="spiral-primary" onClick={() => run()} disabled={running || !draft.length} data-testid="spiral-run">Continue the text</button>}
              {running && <button className="spiral-stop" onClick={stop} data-testid="spiral-stop">Stop</button>}
              {mode === "live" && !editing && !running && (
                <>
                  <button className="spiral-primary" onClick={() => run(docPrompt + continuation.replace(new RegExp(END_TOKENS.map(t => t.replace(/[|]/g, "\\|")).join("|"), "g"), "\n\n"))}>Keep going</button>
                  <button onClick={() => run(docPrompt)}>Run again</button>
                  <button onClick={() => { setDraft(docPrompt + continuation); setEditing(true); }}>Edit the text</button>
                  <button onClick={() => { setDraft(docPrompt); setEditing(true); setPieces([]); setSteps([]); setDocPrompt(""); setFinish(null); }}>Start over</button>
                </>
              )}
              {mode === "live" && editing && <span className="spiral-muted">⌘↩ also works</span>}
            </div>
          )}
          {mode === "live" && ready && error && <p role="alert" className="spiral-error">{error}</p>}
        </section>

        <aside className="spiral-side" aria-label="Controls and the next-token odds">
          <div className="spiral-meter" data-testid="spiral-meter" data-state={running ? "running" : finish?.reason ?? "idle"}>
            <p className="eyebrow">{running ? "Still going" : finish ? "Stopped" : "The meter"}</p>
            <p className="spiral-count"><strong>{pieces.length}</strong> tokens{running && <span className="spiral-pulse" aria-hidden="true" />}</p>
            <p className="spiral-muted">
              {breakAt >= 0
                ? <>{tokensPast} past the first line break, where an answer could have ended.</>
                : running ? "No line break yet." : "It doesn't know when it's done: nothing in a base model says \"answer, then stop.\""}
              {ends > 0 && <> It wrote &ldquo;end of text&rdquo; {ends === 1 ? "once" : `${ends} times`} and started a new document.</>}
            </p>
            {finish && (
              <p className="spiral-finish" data-testid="spiral-finish">
                {{
                  abort: "You stopped it.",
                  length: `It was still going at the ${finish.tokens}-token limit we set. It never chose to stop.`,
                  context: "It filled the model's whole context window (1,024 tokens for GPT-2).",
                  eos: "It wrote its end-of-text token and stopped (end-of-text isn't being ignored).",
                  stop: "It hit a stop string.",
                }[finish.reason]}
                {finish.ms && <> {seconds(finish.ms)}, {finish.tps.toFixed(0)} tokens/s{lm.model?.device && <> on {lm.model.device === "wasm" ? "CPU" : "GPU"}</>}.</>}
              </p>
            )}
          </div>

          <div className="spiral-controls">
            <div className="spiral-presets">
              {PRESETS.map(p => (
                <button key={p.label} title={p.hint} disabled={mode === "recorded"} aria-pressed={shownSettings.temperature === p.temperature && shownSettings.topK === p.topK}
                  onClick={() => setSettings(s => ({ ...s, temperature: p.temperature, topK: p.topK }))}>{p.label}</button>
              ))}
            </div>
            <label>
              <span>Temperature <output>{shownSettings.temperature.toFixed(2)}</output></span>
              <input type="range" min="0" max="2" step="0.05" value={shownSettings.temperature} disabled={mode === "recorded"}
                onChange={e => setSettings(s => ({ ...s, temperature: Number(e.target.value) }))} />
              <small>0 always takes the likeliest token; higher flattens the odds.</small>
            </label>
            <label>
              <span>Top-k <output>{shownSettings.topK}</output></span>
              <input type="range" min="1" max="100" step="1" value={shownSettings.topK} disabled={mode === "recorded"}
                onChange={e => setSettings(s => ({ ...s, topK: Number(e.target.value) }))} />
              <small>Only the k likeliest tokens can be picked.</small>
            </label>
            <label>
              <span>Length <output>{shownSettings.maxNewTokens} tokens</output></span>
              <input type="range" min="20" max="400" step="10" value={shownSettings.maxNewTokens} disabled={mode === "recorded"}
                onChange={e => setSettings(s => ({ ...s, maxNewTokens: Number(e.target.value) }))} />
            </label>
            <label className="spiral-check">
              <input type="checkbox" checked={shownSettings.neverStop} disabled={mode === "recorded"}
                onChange={e => setSettings(s => ({ ...s, neverStop: e.target.checked }))} />
              <span>Ignore end-of-text (keep going past it)</span>
            </label>
            {mode === "live" && ready && (
              <p className="spiral-muted">{model.name} on {lm.model?.device === "wasm" ? "CPU (WASM)" : "GPU (WebGPU)"}. <button className="spiral-link" disabled={running} onClick={() => {
                const next = MODELS[(MODELS.indexOf(model) + 1) % MODELS.length];
                setModelId(next.id); setPieces([]); setSteps([]); setDocPrompt(""); setFinish(null); setEditing(true);
              }}>Switch model</button></p>
            )}
          </div>

          <div className="spiral-dist" data-testid="spiral-dist">
            <p className="eyebrow">The next-token odds</p>
            {shown ? (
              <>
                <p className="spiral-muted">
                  {pinned !== null ? <>Token {pinned + 1} (pinned). <button className="spiral-link" onClick={() => setPinned(null)}>Back to live</button></> : <>Token {steps.length}. Click any word in the text to see its odds.</>}
                </p>
                <ol>
                  {shown.candidates.slice(0, 10).map(c => {
                    const p = greedy ? c.vocabularyProbability ?? c.probability : c.probability;
                    return (
                      <li key={c.id} className={c.id === shown.tokenId ? "chosen" : ""}>
                        <code>{visible(c.text)}</code>
                        <span className="spiral-bar"><span style={{ width: `${Math.max(0.5, 100 * p)}%` }} /></span>
                        <span className="spiral-pct">{p < 0.001 ? "<0.1" : (100 * p).toFixed(1)}%</span>
                      </li>
                    );
                  })}
                </ol>
                {!shown.candidates.slice(0, 10).some(c => c.id === shown.tokenId) && <p className="spiral-muted">Picked: <code>{visible(shown.tokenText)}</code>, a long shot outside the top ten.</p>}
                <p className="spiral-muted">
                  {greedy ? "The model's own odds; at temperature 0 it always takes the top one." : "The chance of each being picked, after temperature and top-k. The highlighted one was picked."}
                </p>
              </>
            ) : <p className="spiral-muted">When the model writes, each token&rsquo;s odds appear here.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
