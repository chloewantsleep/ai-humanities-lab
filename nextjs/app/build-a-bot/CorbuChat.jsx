"use client";

// An instant-message window for talking to the bot the wizard describes, before or after it is submitted. It sends
// the wizard's current settings to the Poetry Gem's own chat route (/api/poetry-gem/chat), so retrieval works as in
// Activity C. That route streams newline-delimited JSON events: text, context (what retrieval added), tool_call, error.

import { useEffect, useRef, useState } from "react";

// The model writes Markdown; an instant message only knew bold. **x** becomes <b>x</b>, everything else stays text.
function withBold(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));
}

export default function CorbuChat({ name, owner, settings, ready, onClose }) {
  const [log, setLog] = useState([]); // { who: "me" | "bot" | "sys", text }
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [log]);

  // Add to the bot's reply in progress (the last bot line), or put a system line just before it.
  const appendReply = (delta) => setLog((l) => {
    const i = l.findLastIndex((m) => m.who === "bot");
    return i < 0 ? l : l.map((m, j) => (j === i ? { ...m, text: m.text + delta } : m));
  });
  const addNote = (text) => setLog((l) => {
    const i = l.findLastIndex((m) => m.who === "bot");
    return i < 0 ? [...l, { who: "sys", text }] : [...l.slice(0, i), { who: "sys", text }, ...l.slice(i)];
  });

  function handle(event) {
    if (event.type === "text") appendReply(event.delta);
    else if (event.type === "context" && event.note) addNote(event.note);
    else if (event.type === "tool_call") addNote(`${name} searched the book for “${event.query}” (${event.results.length} passage${event.results.length === 1 ? "" : "s"}).`);
    else if (event.type === "error") addNote(`Error: ${event.message}`);
  }

  async function send(e) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || busy || !ready) return;
    const history = log.filter((m) => m.who !== "sys" && m.text).map((m) => ({ role: m.who === "me" ? "user" : "assistant", content: m.text }));
    const messages = [...history, { role: "user", content: text }].slice(-39);
    if (messages[0].role !== "user") messages.shift();
    setLog((l) => [...l, { who: "me", text }, { who: "bot", text: "" }]);
    setDraft("");
    setBusy(true);
    try {
      const response = await fetch("/api/poetry-gem/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, messages }),
      });
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `The server answered ${response.status}.`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let n;
        while ((n = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, n).trim();
          buffer = buffer.slice(n + 1);
          if (line) handle(JSON.parse(line));
        }
      }
    } catch (error) {
      addNote(`Error: ${error.message}`);
    }
    setLog((l) => l.filter((m) => m.who !== "bot" || m.text));
    setBusy(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) send(e);
  }

  return (
    <section className="w98-window w98-chat" aria-labelledby="w98-chat-title">
      <header className="w98-titlebar">
        <span id="w98-chat-title">{name} - Instant Message</span>
        <span className="w98-titlebuttons"><b aria-hidden="true">_</b><b aria-hidden="true">□</b><button type="button" className="w98-close" onClick={onClose} aria-label="Close">×</button></span>
      </header>
      <div className="w98-menubar" aria-hidden="true"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>I</u>nsert</span><span><u>P</u>eople</span></div>

      <div className="w98-chat-log" role="log" aria-live="polite">
        {!ready && <p className="w98-chat-sys">{name} doesn&rsquo;t know how to talk yet. Choose a form, a reading, and a retrieval in the wizard first.</p>}
        {ready && !log.length && <p className="w98-chat-sys">{name} has signed on. Say something; {name} answers in verse.</p>}
        {log.map((m, i) => m.who === "sys"
          ? <p key={i} className="w98-chat-sys">*** {m.text}</p>
          : <p key={i} className={`w98-chat-line is-${m.who}`}><b className="w98-chat-who">{m.who === "me" ? owner : name}:</b> {m.who === "bot" ? withBold(m.text) : m.text}</p>)}
        {busy && <p className="w98-chat-sys">{name} is typing...</p>}
        <div ref={end} />
      </div>

      <form className="w98-chat-compose" onSubmit={send}>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} rows={3} disabled={!ready} aria-label={`Message to ${name}`} />
        <button type="submit" disabled={!ready || busy || !draft.trim()}>Send</button>
      </form>
      <div className="w98-statusbar">{ready ? `${settings.genre} · ${settings.pack} · ${settings.material} · ${settings.delivery}` : "Not connected"}</div>
    </section>
  );
}
