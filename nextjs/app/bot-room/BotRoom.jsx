"use client";

import { useMemo, useRef, useState } from "react";
import { serializeBotFile, slugify } from "../../lib/bots-format.mjs";
import { DEFAULT_MODEL, DIRECTOR_MODEL, HOST, MODELS, estimateRun, extractDraft, nextRoundRobin, stripSelfLabel } from "./room.mjs";
import "./bot-room.css";

const MAX_BOTS = 3;
const money = d => (d == null ? "?" : d < 0.01 ? `$${d.toFixed(4)}` : `$${d.toFixed(3)}`);
const n = x => (x ?? 0).toLocaleString("en-US");
let nextId = 1;

export default function BotRoom({ bots: files, chatModel, hasKey }) {
  const [extra, setExtra] = useState([]); // bots written on the spot
  const [chosen, setChosen] = useState([]); // bot keys (the file path, or the slug of one written here), in the order picked
  const [custom, setCustom] = useState({ name: "", model: "", description: "", system: "" });
  const [mode, setMode] = useState("conversation");
  const [turnTaking, setTurnTaking] = useState("round-robin");
  const [opening, setOpening] = useState("Victor, the creature has come to the glacier to speak with you.");
  const [task, setTask] = useState("One paragraph, under 120 words, on what Socrates in the Phaedrus would say about chatbots.");
  const [turnLimit, setTurnLimit] = useState(6);
  const [maxOutputTokens, setMaxOutputTokens] = useState(200);
  const [override, setOverride] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [draft, setDraft] = useState(null);
  const [hostLine, setHostLine] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const transcriptRef = useRef([]);
  const abortRef = useRef(null);

  const all = useMemo(() => [...files, ...extra], [files, extra]);
  const fallbackModel = chatModel || DEFAULT_MODEL;
  // Two files can carry the same slug (bots/_examples/ and the room's examples both have a Creature); in the room each
  // bot needs its own, since the transcript is labeled by slug, so a repeat gets a numbered one.
  const roomBots = useMemo(() => {
    const seen = new Set();
    return chosen.map(key => all.find(b => b.key === key)).filter(Boolean).map(b => {
      let slug = b.slug, i = 2;
      while (seen.has(slug)) slug = `${b.slug}-${i++}`;
      seen.add(slug);
      return { ...b, slug, model: override || b.model || fallbackModel };
    });
  }, [chosen, all, override, fallbackModel]);
  const ready = roomBots.length >= 1 && roomBots.every(b => !b.errors?.length);
  const estimate = useMemo(() => estimateRun(roomBots, turnLimit, { avgReplyTokens: Math.min(maxOutputTokens, 160) }), [roomBots, turnLimit, maxOutputTokens]);
  const spent = transcript.reduce((s, t) => s + (t.cost ?? 0), 0);
  const calls = transcript.filter(t => t.cost != null).length;
  const botTurns = transcript.filter(t => t.kind === "bot").length;

  const update = fn => { transcriptRef.current = fn(transcriptRef.current); setTranscript(transcriptRef.current); };
  const apiBots = () => roomBots.map(b => ({ name: b.name, slug: b.slug, description: b.description, system: b.system, model: b.model }));
  const apiTranscript = () => transcriptRef.current.filter(t => t.kind !== "director").map(t => ({ slug: t.slug, name: t.name, text: t.text }));

  const toggle = key => setChosen(c => (c.includes(key) ? c.filter(s => s !== key) : c.length < MAX_BOTS ? [...c, key] : c));
  const addCustom = () => {
    const name = custom.name.trim(), system = custom.system.trim();
    if (!name || !system) { setError("A bot needs a name and a system prompt."); return; }
    let slug = slugify(name), i = 2;
    while (all.some(b => b.slug === slug)) slug = `${slugify(name)}-${i++}`;
    const bot = { name, slug, key: slug, model: custom.model || null, description: custom.description.trim(), system, author: "", errors: [], source: "written here" };
    setExtra(x => [...x, bot]);
    setChosen(c => (c.length < MAX_BOTS ? [...c, slug] : c));
    setCustom({ name: "", model: "", description: "", system: "" });
    setError(chosen.length >= MAX_BOTS ? `${name} is in the list but the room is full (${MAX_BOTS}); untick a bot to let it in.` : "");
  };
  const download = bot => {
    const blob = new Blob([serializeBotFile({ ...bot, body: bot.system })], { type: "text/markdown" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${bot.slug}.md` });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const addHost = text => update(t => [...t, { id: nextId++, kind: "host", slug: "host", name: HOST, text }]);

  async function director() {
    const res = await fetch("/api/bot-room", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abortRef.current.signal,
      body: JSON.stringify({ kind: "director", bots: apiBots(), transcript: apiTranscript(), mode, task }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "The director's call failed.");
    return data;
  }

  async function turn(bot, why) {
    const id = nextId++;
    update(t => [...t, { id, kind: "bot", slug: bot.slug, name: bot.name, text: "", streaming: true, why, model: bot.model }]);
    const patch = fn => update(t => t.map(x => (x.id === id ? fn(x) : x)));
    const res = await fetch("/api/bot-room", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abortRef.current.signal,
      body: JSON.stringify({ kind: "turn", bot, bots: apiBots(), transcript: apiTranscript(), mode, task, draft: draft ?? "", maxOutputTokens }) });
    if (!res.ok) { const data = await res.json().catch(() => ({})); patch(x => ({ ...x, streaming: false, error: data.error || `The call failed (${res.status}).` })); throw new Error(data.error || "The call failed."); }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "", text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === "start") patch(x => ({ ...x, received: { system: event.system, messages: event.messages, model: event.model }, model: event.model }));
        if (event.type === "delta") { text += event.text; patch(x => ({ ...x, text })); }
        if (event.type === "done") {
          const spoken = stripSelfLabel(text, bot.name);
          patch(x => ({ ...x, text: spoken, streaming: false, usage: event.usage, cost: event.cost, finishReason: event.finishReason }));
          if (mode === "together") { const d = extractDraft(spoken); if (d) setDraft(d); }
        }
        if (event.type === "error") patch(x => ({ ...x, streaming: false, error: event.message }));
      }
    }
    patch(x => ({ ...x, streaming: false }));
  }

  async function run(turns) {
    if (!ready || running) return;
    setError("");
    setRunning(true);
    abortRef.current = new AbortController();
    try {
      if (!transcriptRef.current.length) {
        const first = mode === "together" ? task.trim() : opening.trim();
        if (first) addHost(first);
      }
      for (let i = 0; i < turns; i++) {
        if (abortRef.current.signal.aborted) break;
        let bot = nextRoundRobin(roomBots, transcriptRef.current.filter(t => t.kind === "bot"));
        let why = null;
        if (turnTaking === "director" && roomBots.length > 1) {
          const d = await director();
          const picked = roomBots.find(b => b.slug === d.next);
          if (picked) { bot = picked; why = d.why; }
          update(t => [...t, { id: nextId++, kind: "director", slug: "director", name: "Director", text: picked ? `${picked.name} speaks next: ${d.why || "(no reason given)"}` : `The director's answer couldn't be read (${JSON.stringify(d.raw ?? "")}); ${bot.name} speaks next, in order.`, cost: d.cost, usage: d.usage, model: d.model, raw: d.raw }]);
        }
        await turn(bot, why);
      }
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      update(t => t.map(x => (x.streaming ? { ...x, streaming: false } : x)));
      setRunning(false);
    }
  }

  const stop = () => abortRef.current?.abort();
  const reset = () => { stop(); update(() => []); setDraft(null); setError(""); };

  return (
    <div className="br-lab">
      <p className="br-intro">
        Pick two or three bots, give the room an opening line or a task, and run turns. Each turn is one paid call to the bot&rsquo;s model through OpenRouter; the director, when used, is one more.
        Every turn shows exactly what that bot was sent.
      </p>
      {!hasKey && <p className="br-error">OPENROUTER_API_KEY is not set in nextjs/.env.local, so nothing here can run yet.</p>}

      <div className="br-grid">
        <section className="br-panel" aria-label="The cast">
          <h3>1 · The cast <span className="br-muted">({roomBots.length} of {MAX_BOTS})</span></h3>
          <ul className="br-bots">
            {all.map(b => (
              <li key={b.key} className={`${chosen.includes(b.key) ? "br-on" : ""} ${b.errors?.length ? "br-bad" : ""}`}>
                <label>
                  <input type="checkbox" checked={chosen.includes(b.key)} onChange={() => toggle(b.key)} disabled={running || (!chosen.includes(b.key) && chosen.length >= MAX_BOTS) || !!b.errors?.length} aria-label={`Choose ${b.name} (${b.source})`} />
                  <span>
                    <strong>{b.emoji ? `${b.emoji} ` : ""}{b.name}</strong>
                    <span className="br-meta">{b.description || "(no description)"} · {b.source}{b.file ? ` · ${b.file}` : ""}{b.model ? ` · ${b.model}` : ""}</span>
                    {b.errors?.map((e, i) => <span key={i} className="br-error">{e}</span>)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <details className="br-new">
            <summary>Write a bot on the spot</summary>
            <label className="br-field">Name <input type="text" value={custom.name} onChange={e => setCustom(c => ({ ...c, name: e.target.value }))} /></label>
            <label className="br-field">One-line description <input type="text" value={custom.description} onChange={e => setCustom(c => ({ ...c, description: e.target.value }))} /></label>
            <label className="br-field">Model <select value={custom.model} onChange={e => setCustom(c => ({ ...c, model: e.target.value }))}><option value="">the app&rsquo;s default ({fallbackModel})</option>{MODELS.map(m => <option key={m.id} value={m.id}>{m.label} · {m.id}</option>)}</select></label>
            <label className="br-field">System prompt <textarea rows={5} value={custom.system} onChange={e => setCustom(c => ({ ...c, system: e.target.value }))} placeholder="You are…" /></label>
            <div className="br-actions" style={{ marginTop: 8 }}>
              <button type="button" onClick={addCustom} disabled={running}>Add to the room</button>
              <button type="button" onClick={() => download({ ...custom, slug: slugify(custom.name) })} disabled={!custom.name.trim() || !custom.system.trim()}>Download as a bot file</button>
            </div>
          </details>

          <h3 style={{ marginTop: 8 }}>2 · The room</h3>
          <div className="br-row">
            <label><input type="radio" name="mode" checked={mode === "conversation"} onChange={() => { setMode("conversation"); setMaxOutputTokens(t => (t === 400 ? 200 : t)); }} disabled={running} /> In conversation</label>
            <label><input type="radio" name="mode" checked={mode === "together"} onChange={() => { setMode("together"); setMaxOutputTokens(t => (t < 400 ? 400 : t)); }} disabled={running} /> Working together on a task</label>
          </div>
          {mode === "conversation"
            ? <label className="br-field">The host&rsquo;s opening line <textarea rows={2} value={opening} onChange={e => setOpening(e.target.value)} disabled={running} /></label>
            : <label className="br-field">The shared task <textarea rows={3} value={task} onChange={e => setTask(e.target.value)} disabled={running} /><span className="br-muted">Each turn is sent the latest draft; a bot that writes a new one between &lt;draft&gt; and &lt;/draft&gt; replaces it.</span></label>}
          <div className="br-row">
            <label>Who speaks next: <select value={turnTaking} onChange={e => setTurnTaking(e.target.value)} disabled={running}><option value="round-robin">in order (round-robin)</option><option value="director">a director decides ({DIRECTOR_MODEL})</option></select></label>
          </div>
          <div className="br-row">
            <label>Turns <input type="number" min="1" max="30" value={turnLimit} onChange={e => setTurnLimit(Math.min(30, Math.max(1, Number(e.target.value) || 1)))} disabled={running} /></label>
            <label>Max tokens per turn <input type="number" min="32" max="1024" step="8" value={maxOutputTokens} onChange={e => setMaxOutputTokens(Math.min(1024, Math.max(32, Number(e.target.value) || 32)))} disabled={running} /></label>
            <label>Run every bot on <select value={override} onChange={e => setOverride(e.target.value)} disabled={running}><option value="">the model in its file (else {fallbackModel})</option>{MODELS.map(m => <option key={m.id} value={m.id}>{m.label} · ${m.input}/${m.output} per M tokens</option>)}</select></label>
          </div>
          <p className="br-stats">Estimate for {turnLimit} turns: about {money(estimate.dollars)}{estimate.unknown ? " plus calls on models without a listed price" : ""}{turnTaking === "director" ? `, plus ${turnLimit} director calls on ${DIRECTOR_MODEL} (fractions of a cent each)` : ""}. Prices checked 2026-10-20.</p>
          <div className="br-actions">
            <button type="button" className="br-primary" onClick={() => run(turnLimit)} disabled={!ready || running || !hasKey}>Run {turnLimit} turns</button>
            <button type="button" onClick={() => run(1)} disabled={!ready || running || !hasKey}>One turn</button>
            {running && <button type="button" onClick={stop}>Stop</button>}
            <button type="button" onClick={reset} disabled={!transcript.length}>Clear the room</button>
          </div>
          {!ready && chosen.length === 0 && <p className="br-muted">Choose at least one bot. Two or three make a conversation.</p>}
          {error && <p className="br-error">{error}</p>}
        </section>

        <section className="br-panel" aria-label="The transcript">
          <h3>3 · The transcript <span className="br-muted">({botTurns} bot {botTurns === 1 ? "turn" : "turns"}{calls ? ` · ${money(spent)} across ${calls} calls` : ""})</span></h3>
          {mode === "together" && draft && <div className="br-draft"><h4>The shared draft</h4><p>{draft}</p>{!/[.!?"”»)]\s*$/.test(draft) && <p className="br-muted">(ends mid-sentence: the turn hit its token limit before the closing tag)</p>}</div>}
          <div className="br-transcript">
            {transcript.length === 0 && <p className="br-muted">Nothing yet. The host&rsquo;s line goes first, then the bots take turns.</p>}
            {transcript.map(t => (
              <article key={t.id} className={`br-turn br-${t.kind}`}>
                {t.kind === "director"
                  ? <p className="br-text">Director: {t.text}{t.cost != null ? ` (${money(t.cost)})` : ""}</p>
                  : <>
                    <div className="br-who"><strong>{t.name}</strong>{t.kind === "bot" && <span>{t.model}</span>}{t.why && <span>chosen by the director: {t.why}</span>}</div>
                    <p className="br-text">{t.text}{t.streaming && <span className="br-cursor" aria-hidden="true" />}</p>
                    {t.error && <p className="br-error">{t.error}</p>}
                    {t.kind === "bot" && (t.usage || t.finishReason) && <p className="br-stats">{n(t.usage?.inputTokens)} in / {n(t.usage?.outputTokens)} out{t.usage?.reasoningTokens ? ` (${n(t.usage.reasoningTokens)} of them reasoning)` : ""} · {money(t.cost)}{t.finishReason && t.finishReason !== "stop" ? ` · ${t.finishReason}` : ""}</p>}
                    {t.received && (
                      <details className="br-details">
                        <summary>Exactly what {t.name} received</summary>
                        <pre>
                          <span className="br-sys">[system]\n{t.received.system}</span>
                          {t.received.messages.map((m, i) => <span key={i} className={m.role === "user" ? "br-u" : "br-a"}>{"\n\n"}[{m.role}]{"\n"}{m.content}</span>)}
                        </pre>
                      </details>
                    )}
                  </>}
              </article>
            ))}
          </div>
          <div className="br-row">
            <input type="text" value={hostLine} onChange={e => setHostLine(e.target.value)} placeholder={`${HOST} says… (added to the transcript before the next turn)`} disabled={running} aria-label="Host line" style={{ flex: "1 1 240px", width: "auto" }} onKeyDown={e => { if (e.key === "Enter" && hostLine.trim()) { addHost(hostLine.trim()); setHostLine(""); } }} />
            <button type="button" onClick={() => { if (hostLine.trim()) { addHost(hostLine.trim()); setHostLine(""); } }} disabled={running || !hostLine.trim()}>Add</button>
          </div>
        </section>
      </div>
    </div>
  );
}
