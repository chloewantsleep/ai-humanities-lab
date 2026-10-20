"use client";

import { useEffect, useState } from "react";

// The workshop-keys claim page (apps/workshop-keys in The Notebook), inside the course app.
export default function KeyClaim() {
  const [status, setStatus] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/keys/status", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ open: false, error: "Couldn't check whether claiming is open." }));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/keys/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setResult(data);
      setPassword("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const envLine = result ? `OPENROUTER_API_KEY=${result.key}` : "";

  async function copy() {
    await navigator.clipboard.writeText(envLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status && status.configured === false) {
    return (
      <div className="keys-panel">
        <p className="keys-eyebrow">Student keys</p>
        <h3>Not set up here</h3>
        <p className="keys-note">{status.error || "This copy of the site isn't handing out keys."} The instructor will give you the address of the claim page.</p>
      </div>
    );
  }

  return (
    <div className="keys-panel">
      <p className="keys-eyebrow">{status?.title || "Workshop"}</p>
      <h3>Claim your OpenRouter key</h3>
      {result ? (
        <section>
          <p>
            Here is your key{result.replaced ? " (it replaces the one you claimed earlier, which no longer works)" : ""}. It is shown once. Put this line in your project's <code>.env</code> file:
          </p>
          <pre className="keys-key">{envLine}</pre>
          <button className="keys-primary" onClick={copy}>{copied ? "Copied" : "Copy the line"}</button>
          <p className="keys-note">
            It works until {new Date(result.expiresAt).toLocaleString([], { hour: "numeric", minute: "2-digit", weekday: "short" })}. Don't paste it into a chat, a commit, or a shared document.
          </p>
        </section>
      ) : (
        <>
          <p className="keys-note">Working in Claude Code? Type <code>/setup-key</code> there instead; it puts the key straight into your <code>.env</code>.</p>
          {status && !status.open && <p className="keys-closed">{status.error || "Claiming is closed right now. The instructor will open it."}</p>}
          <form onSubmit={submit} className="keys-form">
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} required />
            </label>
            <label>
              Password from the slide
              <input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" required />
            </label>
            <button type="submit" className="keys-primary" disabled={busy}>{busy ? "Claiming…" : "Reveal my key"}</button>
          </form>
          {error && <p className="keys-error">{error}</p>}
        </>
      )}
    </div>
  );
}
