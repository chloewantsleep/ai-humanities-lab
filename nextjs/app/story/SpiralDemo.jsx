"use client";

import { useState } from "react";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";

// GPT-2 small in the panel, through the shared engine (lib/browser-lm, task A). It starts as a recorded continuation;
// the model (about 130 MB) loads only when the reader asks, and runs on their own computer. Full version at /gpt-2.

const MODEL = "Xenova/gpt2";
const SETTINGS = { temperature: 0.8, topK: 40, maxNewTokens: 60 };

function Live({ prompt }) {
  const lm = useBrowserLM(MODEL);
  const [text, setText] = useState(prompt);
  const busy = lm.status === "loading" || lm.status === "generating";

  async function run() {
    try {
      if (lm.status === "idle" || lm.status === "error") await lm.load();
      await lm.generate({ prompt: text, ...SETTINGS, neverStop: true });
    } catch {
      // The hook keeps the message in lm.error.
    }
  }

  const progress = lm.progress?.percent;
  const candidates = lm.step?.candidates?.slice(0, 5) || [];
  return (
    <div className="spiral-live">
      <label className="sr-only" htmlFor="spiral-prompt">Text for GPT-2 to continue</label>
      <textarea id="spiral-prompt" rows={2} value={text} onChange={(e) => setText(e.target.value)} disabled={busy} />
      <div className="spiral-controls">
        <button type="button" onClick={run} disabled={busy}>{lm.status === "loading" ? `Loading GPT-2${Number.isFinite(progress) ? ` ${Math.round(progress)}%` : "…"}` : "Generate text"}</button>
        {lm.status === "generating" && <button type="button" onClick={lm.abort}>Stop</button>}
        {lm.model && <span className="spiral-meta">{lm.model.device}{lm.result ? ` · ${lm.result.tokensPerSecond?.toFixed?.(1)} tokens/s` : ""}</span>}
      </div>
      {(lm.text || lm.status === "generating") && <pre className="spiral-out"><span className="cont-prompt">{text}</span><mark className="cont-model">{lm.text}</mark></pre>}
      {candidates.length > 0 && (
        <ol className="spiral-candidates" aria-label="Most likely next tokens at the last step">
          {candidates.map((c) => (
            <li key={c.id}><code>{JSON.stringify(c.text)}</code><span className="spiral-bar" style={{ width: `${Math.max(2, c.probability * 100)}%` }} /><span>{(c.probability * 100).toFixed(0)}%</span></li>
          ))}
        </ol>
      )}
      {lm.error && <p className="demo-error">{lm.error}</p>}
    </div>
  );
}

export default function SpiralDemo({ prompt = "Who are you?\n", recorded, recordedNote, heading = "GPT-2 small (2019)" }) {
  const [live, setLive] = useState(false);
  return (
    <div className="spiral-demo">
      <p className="dialogue-heading">{heading}{live ? ", running in your browser" : ""}</p>
      {recorded && !live && (
        <>
          <pre className="spiral-out"><span className="cont-prompt">{prompt}</span><mark className="cont-model">{recorded}</mark></pre>
          {recordedNote && <p className="panel-note">{recordedNote}</p>}
        </>
      )}
      {live ? <Live prompt={prompt} /> : (
        <button type="button" className="spiral-start" onClick={() => setLive(true)}>Run it yourself: load GPT-2 in this browser (about 130 MB)</button>
      )}
      <p className="demo-more"><a href="/gpt-2">Open GPT-2 and inspect token probabilities →</a></p>
    </div>
  );
}
