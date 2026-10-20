"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSystemPrompt, countWords, DEFAULT_MODEL, parseBotFile } from "../../lib/bots-format.mjs";

const TEMPLATE = `---
name: "Your bot's name"
author: "Your name"
emoji: ":speech_balloon:"
description: "One line about who this is."
---

Who your bot is, how it talks, and what it cares about. Keep it short: a few sentences of voice and a few of instructions.
`;

// Slack shortcodes a student is likely to pick, shown as the character Slack would; anything else gets a letter.
const EMOJI = {
  speech_balloon: "💬", robot_face: "🤖", zombie: "🧟", scroll: "📜", books: "📚", book: "📖", open_book: "📖", ghost: "👻",
  skull: "💀", crown: "👑", owl: "🦉", cat: "🐱", dog: "🐶", rose: "🌹", wilted_flower: "🥀", fire: "🔥", star: "⭐",
  sparkles: "✨", brain: "🧠", performing_arts: "🎭", tophat: "🎩", crystal_ball: "🔮", candle: "🕯️", feather: "🪶",
  pen: "🖊️", fountain_pen: "🖋️", lower_left_fountain_pen: "🖋️", memo: "📝", hourglass: "⌛", zap: "⚡", moon: "🌙",
  sunny: "☀️", sun_with_face: "🌞", earth_americas: "🌎", ocean: "🌊", mountain: "⛰️", evergreen_tree: "🌲", mushroom: "🍄",
  snake: "🐍", dragon: "🐉", unicorn_face: "🦄", bat: "🦇", spider: "🕷️", eye: "👁️", eyes: "👀", heart: "❤️",
  broken_heart: "💔", thinking_face: "🤔", smile: "😄", sunglasses: "😎", nerd_face: "🤓", angel: "👼", smiling_imp: "😈",
  alien: "👽", space_invader: "👾", mage: "🧙", wizard: "🧙", vampire: "🧛", mermaid: "🧜", fairy: "🧚", genie: "🧞",
  classical_building: "🏛️", amphora: "🏺", art: "🎨", frame_with_picture: "🖼️", musical_note: "🎵", violin: "🎻",
  microscope: "🔬", telescope: "🔭", gear: "⚙️", hammer_and_wrench: "🛠️", bulb: "💡", lock: "🔒", key: "🔑",
  coffee: "☕", tea: "🍵", wine_glass: "🍷", apple: "🍎", lemon: "🍋", rocket: "🚀", ship: "🚢", train: "🚆",
  teacher: "🧑‍🏫", student: "🧑‍🎓", detective: "🕵️", sleuth_or_spy: "🕵️", judge: "🧑‍⚖️", cop: "👮", lion_face: "🦁",
};

function Avatar({ emoji, icon_url, name, size = 36 }) {
  const style = { width: size, height: size, fontSize: size * 0.62 };
  if (icon_url) return <img className="ens-avatar" src={icon_url} alt="" style={style} />;
  const glyph = EMOJI[(emoji ?? "").replace(/:/g, "")];
  return <span className="ens-avatar" style={style} aria-hidden="true">{glyph ?? (name?.trim()?.[0]?.toUpperCase() || "?")}</span>;
}

// --- submit ------------------------------------------------------------------------------------------------

function Submit({ harness, onSaved }) {
  const [text, setText] = useState(TEMPLATE);
  const [knowledge, setKnowledge] = useState("");
  const [save, setSave] = useState({ state: "idle" });
  const file = useRef(null);
  const check = useMemo(() => parseBotFile(text), [text]);
  const { bot } = check;
  const knowledgeWords = countWords(knowledge);
  const live = harness?.bots?.find(b => b.slug === bot.slug);
  const untouched = text === TEMPLATE;

  async function upload(event) {
    const f = event.target.files?.[0];
    if (f) setText(await f.text());
    event.target.value = "";
  }

  async function submit(replace = false) {
    setSave({ state: "saving" });
    const res = await fetch("/api/ensemble/bots", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, knowledge, replace }) });
    const result = await res.json().catch(() => ({ ok: false, errors: ["The server didn't answer."] }));
    setSave({ state: result.ok ? "saved" : "error", ...result });
    if (result.ok) onSaved(result.slug);
  }

  return (
    <section className="ens-submit">
      <div className="ens-editor">
        <div className="ens-row">
          <h2>1. Submit a bot</h2>
          <div className="ens-actions">
            <button type="button" onClick={() => file.current?.click()}>Upload .md</button>
            <button type="button" onClick={() => { setText(TEMPLATE); setSave({ state: "idle" }); }}>Template</button>
          </div>
          <input ref={file} type="file" accept=".md,.txt,text/markdown,text/plain" hidden onChange={upload} />
        </div>
        <p className="ens-hint">Paste your bot file from <a href="/bot-lab">/bot-lab</a> (or <code>bots/&lt;your-bot&gt;.md</code> in your copy of the repo), or upload it.</p>
        <textarea className="ens-file" value={text} onChange={e => { setText(e.target.value); setSave({ state: "idle" }); }} spellCheck={false} aria-label="Bot file" />
        <details className="ens-knowledge" open={Boolean(knowledge)}>
          <summary>One short text (optional){knowledge ? ` · ${knowledgeWords.toLocaleString()} words` : ""}</summary>
          <p className="ens-hint">Pasted whole after the prompt, under <code>--- Reference text ---</code>. Under about 8,000 words.</p>
          <textarea value={knowledge} onChange={e => setKnowledge(e.target.value)} placeholder="Paste the text your bot should have read…" aria-label="Knowledge text" />
        </details>
      </div>

      <div className="ens-preview">
        <p className="eyebrow">How it will look in Slack</p>
        <div className="ens-slack">
          <Avatar emoji={bot.emoji} icon_url={bot.icon_url} name={bot.name} />
          <div>
            <p className="ens-slack-head"><strong>{bot.name || "(no name)"}</strong> <span className="ens-app">APP</span> <span className="ens-time">10:42 AM</span></p>
            <p>{bot.description || "(no description)"}{bot.author ? <span className="ens-by"> · by {bot.author}</span> : null}</p>
          </div>
        </div>
        <ul className="ens-checks">
          {check.errors.map(e => <li key={e} className="is-error">{e}</li>)}
          {check.warnings.map(w => <li key={w} className="is-warning">{w}</li>)}
          {knowledgeWords > 8000 && <li className="is-error">The text is {knowledgeWords.toLocaleString()} words; keep it under about 8,000.</li>}
          {check.ok && !untouched && <li className="is-ok">The file is valid. In the room, address it as <code>@{bot.name}</code>.</li>}
        </ul>
        <details className="ens-sent">
          <summary>What the model is sent</summary>
          <p className="ens-hint">Model: <code>{bot.model || `${harness?.defaultModel ?? DEFAULT_MODEL} (the default)`}</code>{live?.note ? <> · <span className="ens-note">{live.note}</span></> : null}</p>
          <pre>{buildSystemPrompt(bot, knowledge) || "(empty)"}</pre>
          <p className="ens-hint">Then one message with the thread so far, each line marked with who said it, and "Write {bot.name || "the bot"}'s next message".</p>
        </details>
        <div className="ens-save">
          <button type="button" className="ens-primary" disabled={!check.ok || untouched || knowledgeWords > 8000 || save.state === "saving"} onClick={() => submit(false)}>
            {save.state === "saving" ? "Saving…" : "Add to the Ensemble"}
          </button>
          {save.state === "saved" && <p className="is-ok">Saved as <code>bots/{save.file}</code>. {harness ? "It is in the room now." : "Start the Ensemble to talk to it."}</p>}
          {save.state === "error" && (
            <div className="is-error">
              {save.errors?.map(e => <p key={e}>{e}</p>)}
              {save.exists && <button type="button" onClick={() => submit(true)}>Replace it with this one</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- the room ----------------------------------------------------------------------------------------------

function useName() {
  const [name, setName] = useState("");
  useEffect(() => { try { setName(localStorage.getItem("ensemble-name") ?? ""); } catch {} }, []);
  const update = value => { setName(value); try { localStorage.setItem("ensemble-name", value); } catch {} };
  return [name, update];
}

function Room({ harness, saved, refresh }) {
  const [name, setName] = useName();
  const [text, setText] = useState("");
  const [thread, setThread] = useState(null);
  const [error, setError] = useState("");
  const input = useRef(null);
  const end = useRef(null);
  const messages = harness?.messages ?? [];
  const roots = messages.filter(m => m.thread === m.id);
  const replies = id => messages.filter(m => m.thread === id && m.id !== id);
  const bots = harness?.bots ?? [];
  const invalid = harness?.invalid ?? [];

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);

  async function send(event) {
    event?.preventDefault();
    if (!text.trim()) return;
    setError("");
    const res = await fetch("/api/ensemble", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "message", name: name || "student", text, thread }) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { setError(body.error ?? "Couldn't send."); return; }
    setText("");
    if (!thread) setThread(body.message?.id ?? null);
    refresh();
  }

  async function reset() {
    await fetch("/api/ensemble", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "reset" }) });
    setThread(null);
    refresh();
  }

  const mention = bot => { setText(t => `${t}${t && !t.endsWith(" ") ? " " : ""}@${bot.name} `); input.current?.focus(); };

  if (!harness) {
    return (
      <section className="ens-room">
        <h2>2. The room</h2>
        <div className="ens-offline">
          <p><strong>The Ensemble isn't running.</strong> In a terminal, from the repo:</p>
          <pre>cd slack-ensemble{"\n"}pnpm install{"\n"}pnpm dry-run      # a pretend channel here, with real replies{"\n"}pnpm fake         # the same, with canned replies (free)</pre>
          {saved.length > 0 && <p className="ens-hint">Saved bots waiting: {saved.filter(b => !b.example).map(b => b.name || b.slug).join(", ") || "none yet"} (plus {saved.filter(b => b.example).length} example).</p>}
        </div>
      </section>
    );
  }

  const live = harness.mode === "live";
  return (
    <section className="ens-room">
      <div className="ens-row">
        <h2>2. The room</h2>
        <p className={`ens-mode ${live ? "is-live" : ""}`}>{live ? "Live in Slack" : harness.fake ? "Simulated channel · canned replies" : "Simulated channel · real replies"}</p>
      </div>
      <div className="ens-room-grid">
        <aside className="ens-roster">
          <p className="eyebrow">In the Ensemble · {bots.length}</p>
          <ul>
            {bots.map(b => (
              <li key={b.slug}>
                <button type="button" onClick={() => mention(b)} disabled={live} title={live ? "" : `Mention @${b.name}`}>
                  <Avatar emoji={b.emoji} icon_url={b.icon_url} name={b.name} size={26} />
                  <span><strong>{b.name}</strong>{b.example ? <em> example</em> : null}<small>{b.author ? `${b.author} · ` : ""}{b.model.split("/").pop()}</small></span>
                </button>
                {b.note && <p className="ens-note">{b.note}</p>}
              </li>
            ))}
          </ul>
          {invalid.length > 0 && (
            <>
              <p className="eyebrow ens-invalid-head">Not valid yet · {invalid.length}</p>
              <ul className="ens-invalid">{invalid.map(i => <li key={i.file}><code>{i.file}</code>{i.problems.map(p => <span key={p}>{p}</span>)}</li>)}</ul>
            </>
          )}
          <p className="ens-hint">Bots answer an @-mention, or a reply in a thread they're in. They answer each other only in a thread a person started, at most {harness.limits.maxBotChain} in a row.</p>
        </aside>

        {live ? (
          <div className="ens-channel ens-live-note">
            <p>The Ensemble is running in Slack: talk to the bots there. Every reply is logged in <code>slack-ensemble/logs/</code>.</p>
            <p className="ens-hint">To try bots here first, stop it and run <code>pnpm dry-run</code>.</p>
          </div>
        ) : (
          <div className="ens-channel">
            <div className="ens-messages">
              {!roots.length && <p className="ens-empty">#ai-humanities-lab-ensemble is quiet. Mention a bot (click one on the left) to start a thread.</p>}
              {roots.map(root => (
                <div key={root.id} className={`ens-thread${thread === root.id ? " is-current" : ""}`}>
                  <Message m={root} />
                  <div className="ens-replies">{replies(root.id).map(m => <Message key={m.id} m={m} />)}</div>
                  <button type="button" className="ens-reply" onClick={() => { setThread(root.id); input.current?.focus(); }}>{thread === root.id ? "Replying here" : "Reply in thread"}</button>
                </div>
              ))}
              <div ref={end} />
            </div>
            <form className="ens-composer" onSubmit={send}>
              <p className="ens-hint">{thread ? <>Replying in a thread · <button type="button" className="ens-link" onClick={() => setThread(null)}>start a new one</button></> : "A new message starts a new thread."}</p>
              <div className="ens-compose-row">
                <input className="ens-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" aria-label="Your name" />
                <textarea ref={input} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) send(e); }} placeholder="@Socrates, on writing: what would you make of this room?" rows={2} aria-label="Message" />
                <button type="submit" className="ens-primary" disabled={!text.trim()}>Send</button>
              </div>
              {error && <p className="is-error">{error}</p>}
              <button type="button" className="ens-link ens-clear" onClick={reset}>Clear the room</button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function Message({ m }) {
  return (
    <div className={`ens-message is-${m.kind}`}>
      {m.kind === "bot" ? <Avatar emoji={m.emoji} icon_url={m.icon_url} name={m.name} size={30} /> : <span className="ens-avatar ens-person" style={{ width: 30, height: 30, fontSize: 14 }}>{m.name?.[0]?.toUpperCase() ?? "?"}</span>}
      <div>
        <p className="ens-slack-head"><strong>{m.name}</strong>{m.kind === "bot" && <span className="ens-app">APP</span>} <span className="ens-time">{new Date(m.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></p>
        <p className="ens-text">{m.text}</p>
      </div>
    </div>
  );
}

export default function EnsembleLab() {
  const [data, setData] = useState({ harness: undefined, saved: [] });
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/ensemble", { cache: "no-store" });
      setData(await res.json());
    } catch { /* keep the last state */ }
  }, []);
  useEffect(() => {
    refresh();
    const timer = setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 1500);
    return () => clearInterval(timer);
  }, [refresh]);

  return (
    <div className="ens">
      <Submit harness={data.harness} onSaved={refresh} />
      {data.harness !== undefined && <Room harness={data.harness} saved={data.saved} refresh={refresh} />}
    </div>
  );
}
