"use client";

import { useMemo, useState } from "react";
import { useBrowserLM } from "../../lib/browser-lm/useBrowserLM.js";
import { HHH_SOURCE, buildPrompt, cutText, parsePreamble, planPreamble, questionTurn, splitHeader, unitsOf } from "../by-hand/preamble.mjs";

// The same GPT-2 twice: first given the question alone, then given the question after the HHH prompt of Askell et al.
// 2021 (app/by-hand/hhh-prompt.txt, the paper's own file, byte for byte). GPT-2's window is 1,024 tokens and the prompt
// is about 6,800 GPT-2 tokens, so the opening paragraph is always kept and whole exchanges are kept from the end until the
// window is full (the planning code is /by-hand's, in app/by-hand/preamble.mjs). The reader is told exactly what was cut.

const MODEL = "Xenova/gpt2";
const SETTINGS = { temperature: 0.7, topK: 40 };
const ANSWER_TOKENS = 90;
const QUESTIONS = ["Can you help me write a poem about the sea?", "Who are you?", "Who wrote Frankenstein?"];
const n = (x) => (x ?? 0).toLocaleString("en-US");

export default function HhhDemo({ preambleFile, recorded = [] }) {
  const hhh = useMemo(() => parsePreamble(splitHeader(preambleFile || "").text), [preambleFile]);
  const lm = useBrowserLM(MODEL);
  const [question, setQuestion] = useState(recorded[0]?.question ?? QUESTIONS[0]);
  const [bare, setBare] = useState(null); // { prompt, text, done }
  const [scripted, setScripted] = useState(null); // { prompt, text, done, kept, total, promptTokens, cut }
  const [phase, setPhase] = useState("idle"); // idle | loading | bare | scripted | done
  const [error, setError] = useState("");
  const [shown, setShown] = useState(0); // which recorded sample is showing before the model loads

  const busy = phase === "loading" || phase === "bare" || phase === "scripted";
  const q = question.trim();
  const sample = recorded[shown];

  async function fit() {
    const counted = await lm.count([...unitsOf(hhh), questionTurn(q)]);
    const limit = counted.contextLimit - ANSWER_TOKENS;
    const counts = counted.counts.slice(0, -1);
    let budget = limit - counted.counts.at(-1) - 2;
    let plan, prompt, promptTokens;
    for (let attempt = 0; attempt < 8; attempt++) {
      plan = planPreamble(hhh, counts, budget);
      prompt = buildPrompt(plan.preamble, q);
      promptTokens = (await lm.count([prompt])).counts[0];
      if (!plan.fits || promptTokens <= limit || plan.keptExchanges === 0) break;
      budget -= promptTokens - limit;
    }
    return { plan, prompt, promptTokens, contextLimit: counted.contextLimit, cut: cutText(hhh, plan) };
  }

  async function run() {
    if (!q) return;
    setError("");
    setBare(null);
    setScripted(null);
    try {
      if (lm.status === "idle" || lm.status === "error") {
        setPhase("loading");
        await lm.load();
      }
      // 1. The question alone, as GPT-2 was built to take it: text to continue.
      setPhase("bare");
      const barePrompt = `${q}\n`;
      setBare({ prompt: barePrompt, text: "", done: false });
      const a = await lm.generate({ prompt: barePrompt, ...SETTINGS, maxNewTokens: ANSWER_TOKENS, stopStrings: [] }, (step) => setBare((r) => ({ ...r, text: step.text })));
      setBare({ prompt: barePrompt, text: a.text, done: true });
      // 2. The same question as the next "Human:" turn in the HHH script; stop when GPT-2 starts the human's next line.
      setPhase("scripted");
      const fitted = await fit();
      setScripted({ ...fitted, text: "", done: false });
      const b = await lm.generate({ prompt: fitted.prompt, ...SETTINGS, maxNewTokens: ANSWER_TOKENS, stopStrings: ["\nHuman:", "\n-----"] }, (step) => setScripted((r) => ({ ...r, text: step.text })));
      setScripted((r) => ({ ...r, text: b.text, done: true, finish: b.finishReason }));
      setPhase("done");
    } catch (e) {
      setError(e.message || String(e));
      setPhase("done");
    }
  }

  const progress = lm.progress?.percent;
  const live = bare || scripted;
  const keptLine = scripted?.plan && `GPT-2 can read ${n(scripted.contextLimit)} tokens at once, and the whole HHH prompt is about 6,800. So it read the opening paragraph and the last ${scripted.plan.keptExchanges} of ${scripted.plan.totalExchanges} exchanges (${n(scripted.promptTokens)} tokens with your question). The rest was cut.`;

  return (
    <div className="hhh-demo">
      <p className="dialogue-heading">GPT-2 small (2019), twice{live ? ", running in your browser" : ""}</p>

      <div className="hhh-ask">
        <label className="sr-only" htmlFor="hhh-question">Question for GPT-2</label>
        <input id="hhh-question" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} disabled={busy} onKeyDown={(e) => { if (e.key === "Enter" && !busy) run(); }} />
        <button type="button" onClick={run} disabled={busy || !q}>
          {phase === "loading" ? `Loading GPT-2${Number.isFinite(progress) ? ` ${Math.round(progress)}%` : "…"}` : lm.status === "ready" || phase === "done" ? "Ask both" : "Load GPT-2 (130 MB) and ask"}
        </button>
      </div>
      <div className="hhh-chips">
        {QUESTIONS.map((x) => <button key={x} type="button" className={x === question ? "is-on" : ""} onClick={() => setQuestion(x)} disabled={busy}>{x}</button>)}
      </div>

      <div className="hhh-columns">
        <section className="hhh-col">
          <h4><span>1</span> The question alone</h4>
          {live ? (
            <pre className="spiral-out"><span className="cont-prompt">{bare?.prompt ?? `${q}\n`}</span><mark className="cont-model">{bare?.text}</mark>{phase === "bare" && <span className="hhh-cursor" />}</pre>
          ) : sample ? (
            <pre className="spiral-out"><span className="cont-prompt">{sample.question}{"\n"}</span><mark className="cont-model">{sample.bare}</mark></pre>
          ) : null}
        </section>
        <section className="hhh-col">
          <h4><span>2</span> After the HHH prompt</h4>
          {live ? (
            <pre className="spiral-out">
              <span className="hhh-elided">[{scripted?.plan ? `the HHH script: its opening and last ${scripted.plan.keptExchanges} exchanges` : "the HHH script"}]{"\n\n"}</span>
              <span className="cont-prompt">{questionTurn(q)}</span>
              <mark className="cont-model">{scripted?.text}</mark>
              {phase === "scripted" && <span className="hhh-cursor" />}
            </pre>
          ) : sample ? (
            <pre className="spiral-out"><span className="hhh-elided">[the HHH script]{"\n\n"}</span><span className="cont-prompt">{questionTurn(sample.question)}</span><mark className="cont-model">{sample.scripted}</mark></pre>
          ) : null}
        </section>
      </div>

      {!live && sample && (
        <p className="panel-note">
          Recorded {sample.date}, GPT-2 small, temperature 0.7: sample {shown + 1} of {recorded.length}.{" "}
          {recorded.length > 1 && <button type="button" className="hhh-link" onClick={() => { const next = (shown + 1) % recorded.length; setShown(next); setQuestion(recorded[next].question); }}>Show another</button>}{" "}
          Your run will be different.
        </p>
      )}
      {scripted?.done && <p className="panel-note">{keptLine}</p>}
      {error && <p className="demo-error">{error}</p>}

      {scripted?.prompt && (
        <details className="hhh-read">
          <summary>Everything GPT-2 read in column 2</summary>
          <pre>{scripted.prompt}</pre>
          {scripted.cut && (
            <details>
              <summary>What was cut to fit ({n(scripted.plan.cutExchanges)} exchanges)</summary>
              <pre className="hhh-cut">{scripted.cut}</pre>
            </details>
          )}
        </details>
      )}
      <p className="demo-more">
        The prompt is the paper&rsquo;s own file (<a href={HHH_SOURCE.gist} target="_blank" rel="noreferrer">gist</a>, <a href={HHH_SOURCE.paper} target="_blank" rel="noreferrer">paper</a>).
        {" "}<a href="/by-hand">Run the whole prompt on a model with a longer window →</a>
      </p>
    </div>
  );
}
