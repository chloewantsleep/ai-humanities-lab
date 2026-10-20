"use client";

// ============================================================================================================
//  Build-a-Bot Wizard, Windows 98 edition.   nextjs/app/build-a-bot/BotPage.jsx
//
//  The same six choices as the plain form, asked one at a time by an "Add New Hardware"-style wizard on a teal
//  desktop. The cat in the wizard's side panel is Corbu; the coat, mood and nap spot chosen on the "Cat properties"
//  step go to the table as `extras` (JSON). Everything still ends in submitBot(choices, catalog), with
//  <Watcher choices={choices} catalog={catalog} /> on the page.
// ============================================================================================================

import { useEffect, useMemo, useState } from "react";
import { check, submitBot } from "./contract.js";
import Watcher from "./Watcher.jsx";
import CorbuChat from "./CorbuChat.jsx";
import "./win98.css";

const STEPS = ["Welcome", "Instructions", "Reading", "Retrieval", "Cat properties", "Finish"];

// The catalog only has labels for these; the wizard explains them in its own words.
const DELIVERY_HELP = {
  full: "Corbu reads the whole selection before every reply. Thorough, slow, and it costs the most.",
  lexical: "Corbu sniffs for the same words you used and fetches the passages that have them.",
  semantic: "Corbu fetches passages that mean something close to what you said, even in other words.",
  agentic: "Corbu decides for itself whether to go looking in the book, and what to look for.",
};

const MOODS = ["Sleepy", "Hungry", "Judgmental", "Zoomies", "Loaf mode"];

// Corbu, a brown tabby, lying down: a head, `length` copies of the striped middle, then the back half and tail.
// k outline, c coat, d stripes, w muzzle and chest, e eyes, p nose.
const HEAD = [".k....k.", "kck..kck", "kcckkcck", "kcdcdcck", "kceccecc", "kceccecc", "kcwpwccc", ".kwwwccc", ".kcwccdc", "kccccccc", "kkkkkkkk"];
const MIDDLE = ["..", "..", "..", "kk", "cd", "cd", "cc", "cd", "cd", "cc", "kk"];
const BACK = [".......", ".......", ".......", "kk.....", "cck....", "dcck...", "ccck...", "cdck...", "ccckkkk", "cccdcdk", "kkkkkk."];
const COLORS = { k: "#1a1208", c: "#9a6a3a", d: "#4a3020", w: "#dcc196", e: "#a6c23a", p: "#d98a8a" };

function Corbu({ length, size = 4, fit = false }) {
  const rows = HEAD.map((head, y) => head + MIDDLE[y].repeat(length) + BACK[y]);
  const width = rows[0].length;
  return (
    <svg className="w98-cat" viewBox={`0 0 ${width} ${rows.length}`} width={fit ? "100%" : width * size} height={fit ? undefined : rows.length * size}
      shapeRendering="crispEdges" role="img" aria-label={`Corbu, a brown tabby cat, ${length} stripes long`}>
      {rows.flatMap((row, y) => [...row].map((cell, x) => cell === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[cell]} />))}
    </svg>
  );
}

function Radio({ name, value, current, onChange, children }) {
  return (
    <label className="w98-radio">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} />
      <span>{children}</span>
    </label>
  );
}

function Clock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="w98-clock">{now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}</span>;
}

export default function BotPage({ catalog }) {
  const [base, setBase] = useState({ botName: "Corbu", studentName: "Chloe", prompt: "", pack: "", material: "", delivery: "" });
  const [cat, setCat] = useState({ length: 14, mood: "Sleepy", spot: "", note: "" });
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const choices = useMemo(() => ({
    ...base,
    extras: JSON.stringify({ interface: "windows-98-wizard", cat: "brown tabby", length: cat.length, mood: cat.mood, napSpot: cat.spot.trim(), note: cat.note.trim() }),
  }), [base, cat]);

  const set = (key) => (value) => { setBase((b) => ({ ...b, [key]: value })); setResult(null); };
  const setText = (key) => (e) => set(key)(e.target.value);
  const setCatKey = (key) => (e) => setCat((c) => ({ ...c, [key]: e.target.value }));

  const ready = [
    base.botName.trim() && base.studentName.trim(),
    base.prompt,
    base.pack && base.material,
    base.delivery,
    true,
    true,
  ];

  async function finish() {
    setSending(true);
    setProgress(0);
    const timer = setInterval(() => setProgress((p) => Math.min(p + 1, 18)), 60);
    try { setResult(await submitBot(choices, catalog)); }
    catch (error) { setResult({ ok: false, error: error.message }); }
    clearInterval(timer);
    setProgress(20);
    setSending(false);
  }

  const name = base.botName.trim() || "your bot";

  return (
    <div className="w98">
      <div className="w98-desktop">
        <nav className="w98-icons" aria-label="Desktop">
          <a className="w98-icon" href="/history"><span className="w98-icon-img w98-icon-pc" aria-hidden="true" /><span>Interfaces</span></a>
          <a className="w98-icon" href="/readings"><span className="w98-icon-img w98-icon-folder" aria-hidden="true" /><span>Readings</span></a>
          <button type="button" className="w98-icon" onClick={() => setChatOpen(true)}><span className="w98-icon-img w98-icon-cat" aria-hidden="true"><Corbu length={3} size={1} /></span><span>Chat with {name}</span></button>
          <span className="w98-icon"><span className="w98-icon-img w98-icon-bin" aria-hidden="true" /><span>Recycle Bin</span></span>
        </nav>

        <section className="w98-window w98-wizard" aria-labelledby="w98-title">
          <div className="w98-cat-perch"><Corbu length={cat.length} /></div>
          <header className="w98-titlebar">
            <span id="w98-title">Build-a-Bot Wizard</span>
            <span className="w98-titlebuttons" aria-hidden="true"><b>_</b><b>□</b><b>×</b></span>
          </header>

          <div className="w98-body">
            <aside className="w98-side">
              <Corbu length={3} fit />
              <p>Step {step + 1} of {STEPS.length}</p>
              <p className="w98-side-step">{STEPS[step]}</p>
            </aside>

            <div className="w98-page">
              {step === 0 && (
                <>
                  <h1>Welcome to the Build-a-Bot Wizard</h1>
                  <p>This wizard helps you build a poetry bot and add it to the class Ensemble.</p>
                  <p>A bot is only a few choices: its <b>instructions</b>, a <b>reading</b> it can draw on, and <b>how</b> that reading reaches the model. That is all a 2023 &ldquo;GPT&rdquo; or &ldquo;Gem&rdquo; was.</p>
                  <fieldset>
                    <legend>Name your bot</legend>
                    <label className="w98-field">Bot name:<input value={base.botName} onChange={setText("botName")} maxLength={80} /></label>
                    <label className="w98-field">Your name:<input value={base.studentName} onChange={setText("studentName")} maxLength={120} /></label>
                  </fieldset>
                  <p className="w98-small">Submitting again with the same bot name updates it. To continue, click Next.</p>
                </>
              )}

              {step === 1 && (
                <>
                  <h1>Instructions</h1>
                  <p>Which form should {name} answer in? This text is written in front of every conversation.</p>
                  <fieldset>
                    <legend>Poetry form</legend>
                    {Object.keys(catalog.prompts).map((id) => (
                      <Radio key={id} name="prompt" value={id} current={base.prompt} onChange={set("prompt")}>{catalog.promptLabels[id] ?? id}</Radio>
                    ))}
                  </fieldset>
                  {base.prompt && <textarea className="w98-notepad" readOnly value={catalog.prompts[base.prompt]} rows={7} aria-label="The instructions, as the model reads them" />}
                </>
              )}

              {step === 2 && (
                <>
                  <h1>Reading</h1>
                  <p>Which course reading can {name} draw on, and how much of it?</p>
                  <fieldset>
                    <legend>Knowledge pack</legend>
                    {Object.entries(catalog.packLabels).map(([id, label]) => (
                      <Radio key={id} name="pack" value={id} current={base.pack} onChange={set("pack")}>{label}</Radio>
                    ))}
                  </fieldset>
                  <label className="w98-field">How much:
                    <select value={base.material} onChange={setText("material")}>
                      <option value="">(choose)</option>
                      {Object.entries(catalog.materialLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                    </select>
                  </label>
                  {base.pack && base.pack !== "none" && catalog.voices[base.pack] && (
                    <textarea className="w98-notepad" readOnly value={catalog.voices[base.pack]} rows={6} aria-label="The pack's voice note" />
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h1>Retrieval</h1>
                  <p>How does the reading reach the model?</p>
                  <fieldset>
                    <legend>Retrieval / tooling</legend>
                    {Object.entries(catalog.deliveryLabels).map(([id, label]) => (
                      <Radio key={id} name="delivery" value={id} current={base.delivery} onChange={set("delivery")}>
                        <b>{label}</b><br /><span className="w98-small">{DELIVERY_HELP[id]}</span>
                      </Radio>
                    ))}
                  </fieldset>
                </>
              )}

              {step === 4 && (
                <>
                  <h1>Cat properties</h1>
                  <p>Optional. These don&rsquo;t change the bot; they are saved with it.</p>
                  <fieldset>
                    <legend>Length</legend>
                    <label className="w98-field">Short
                      <input type="range" min={1} max={30} value={cat.length} onChange={(e) => setCat((c) => ({ ...c, length: Number(e.target.value) }))} aria-label="Corbu's length" />
                    Very long</label>
                    <p className="w98-small">{cat.length} stripes. Watch the top of the window.</p>
                  </fieldset>
                  <label className="w98-field">Mood:
                    <select value={cat.mood} onChange={setCatKey("mood")}>{MOODS.map((m) => <option key={m}>{m}</option>)}</select>
                  </label>
                  <label className="w98-field">Favorite nap spot:<input value={cat.spot} onChange={setCatKey("spot")} maxLength={80} placeholder="the radiator" /></label>
                  <label className="w98-field w98-field-top">Notes:<textarea value={cat.note} onChange={setCatKey("note")} rows={3} maxLength={600} /></label>
                </>
              )}

              {step === 5 && (
                <>
                  <h1>Completing the Build-a-Bot Wizard</h1>
                  <p>{name} is ready. Click <b>Finish</b> to add it to the class table.</p>
                  <dl className="w98-summary">
                    <dt>Bot</dt><dd>{base.botName}</dd>
                    <dt>Owner</dt><dd>{base.studentName}</dd>
                    <dt>Form</dt><dd>{catalog.promptLabels[base.prompt] ?? base.prompt}</dd>
                    <dt>Reading</dt><dd>{catalog.packLabels[base.pack]}, {catalog.materialLabels[base.material]}</dd>
                    <dt>Retrieval</dt><dd>{catalog.deliveryLabels[base.delivery]}</dd>
                    <dt>Cat</dt><dd>Brown tabby, {cat.length} stripes long, {cat.mood.toLowerCase()}{cat.spot.trim() ? `, naps on ${cat.spot.trim()}` : ""}</dd>
                  </dl>
                  {(sending || progress > 0) && (
                    <div className="w98-progress-wrap">
                      <p className="w98-small">{sending ? `Copying ${name.toLowerCase().replace(/\s+/g, "_")}.bot to the Ensemble...` : "Done."}</p>
                      <div className="w98-progress" role="progressbar" aria-valuemin={0} aria-valuemax={20} aria-valuenow={progress}>
                        {Array.from({ length: progress }, (_, i) => <i key={i} />)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <footer className="w98-buttons">
            <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0 || sending}>&lt; Back</button>
            {step < STEPS.length - 1
              ? <button type="button" onClick={() => setStep(step + 1)} disabled={!ready[step]}>Next &gt;</button>
              : <button type="button" onClick={finish} disabled={sending}>Finish</button>}
            <button type="button" onClick={() => { setStep(0); setProgress(0); setResult(null); }} disabled={sending}>Cancel</button>
          </footer>
        </section>

        {chatOpen && (
          <CorbuChat
            name={name}
            owner={base.studentName.trim() || "Me"}
            settings={{ genre: base.prompt, pack: base.pack, material: base.material, delivery: base.delivery }}
            ready={Boolean(ready[1] && ready[2] && ready[3])}
            onClose={() => setChatOpen(false)}
          />
        )}

        {result && (
          <div className="w98-dialog-backdrop">
            <section className="w98-window w98-dialog" role="alertdialog" aria-labelledby="w98-dialog-title">
              <header className="w98-titlebar"><span id="w98-dialog-title">{result.ok ? "Build-a-Bot Wizard" : "Error"}</span></header>
              <div className="w98-dialog-body">
                <span className={`w98-dialog-icon ${result.ok ? "is-info" : "is-error"}`} aria-hidden="true">{result.ok ? "i" : "×"}</span>
                <p>{result.ok
                  ? <>{name} has been saved to the class table{result.slug ? ` as "${result.slug}"` : ""}. Finish again with the same name to update it.</>
                  : <>{name} could not be saved. {result.error} {result.fields ? Object.values(result.fields).join(" ") : ""}</>}</p>
              </div>
              <div className="w98-buttons w98-buttons-center">
                <button type="button" onClick={() => setResult(null)} autoFocus>OK</button>
                {result.ok && <button type="button" onClick={() => { setResult(null); setChatOpen(true); }}>Chat with {name}</button>}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="w98-taskbar">
        <button type="button" className="w98-start"><span className="w98-logo" aria-hidden="true"><i /><i /><i /><i /></span>Start</button>
        <span className="w98-task">Build-a-Bot Wizard</span>
        {chatOpen && <span className="w98-task">{name} - Instant Message</span>}
        <span className="w98-tray">
          {/* The Watcher's balloon points at this icon; the dot is the contract's state (green: ready to submit). */}
          <span className={`w98-tray-icon${Object.keys(check(choices, catalog)).length ? "" : " is-ok"}`} title="Contract watcher"><Corbu length={1} size={1} /></span>
          <Clock />
        </span>
      </div>

      <Watcher choices={choices} catalog={catalog} />
    </div>
  );
}
