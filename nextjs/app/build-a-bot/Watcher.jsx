"use client";

// THE WATCHER. Do not edit or remove when you fork the page. Render it once, with the same `choices` object you will
// pass to submitBot():  <Watcher choices={choices} catalog={catalog} />
// It checks your choices against the contract as you click, and asks the real server (a dry run that saves nothing)
// whether it would accept them. If your redesign drifts from what Airtable needs, it turns red and says why.

import { useEffect, useState } from "react";
import { CHOICES, check, submitBot } from "./contract.js";

export default function Watcher({ choices, catalog }) {
  const [server, setServer] = useState(null);
  const [open, setOpen] = useState(true);
  const local = check(choices, catalog);
  const missing = Object.keys(local);
  const key = JSON.stringify(choices);

  useEffect(() => {
    if (missing.length) { setServer(null); return undefined; }
    const timer = setTimeout(async () => {
      try { setServer(await submitBot(choices, catalog, { dry: true })); }
      catch (e) { setServer({ ok: false, error: e.message }); }
    }, 500);
    return () => clearTimeout(timer);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const good = !missing.length && server?.ok;
  const state = good ? "ok" : missing.length ? "warn" : server ? "bad" : "wait";
  const colors = { ok: "#0a6b2b", warn: "#8a5a00", bad: "#a3121f", wait: "#555" };
  return (
    <aside aria-live="polite" style={{ position: "fixed", right: 12, bottom: 12, zIndex: 50, width: open ? 300 : "auto", maxWidth: "calc(100vw - 24px)", padding: "10px 12px", border: `2px solid ${colors[state]}`, background: "#fffef6", color: "#111", font: "13px/1.4 ui-monospace, Menlo, monospace", boxShadow: "0 4px 18px rgba(0,0,0,.25)" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ all: "unset", cursor: "pointer", fontWeight: 700, color: colors[state] }}>
        {good ? "✓ Contract OK: the server would accept this bot" : missing.length ? `⚠ Contract: ${missing.length} problem${missing.length > 1 ? "s" : ""}` : server ? "✗ The server would reject this" : "… asking the server"}
      </button>
      {open && (
        <div style={{ marginTop: 6 }}>
          {missing.length > 0 && <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{missing.map((k) => <li key={k}>{local[k]}</li>)}</ul>}
          {server && !server.ok && <p style={{ margin: "4px 0" }}>{server.error}{server.fields ? ` ${Object.values(server.fields).join(" ")}` : ""}</p>}
          <details style={{ marginTop: 4 }}>
            <summary style={{ cursor: "pointer" }}>What the contract needs</summary>
            <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{Object.entries(CHOICES).map(([k, v]) => <li key={k}><b>{k}</b>: {v}</li>)}</ul>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, maxHeight: 160, overflow: "auto", background: "#f1efe2", padding: 6 }}>{JSON.stringify(choices, null, 2)}</pre>
          </details>
        </div>
      )}
    </aside>
  );
}
