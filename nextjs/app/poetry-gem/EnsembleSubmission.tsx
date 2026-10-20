"use client";

import { useEffect, useState } from "react";
import { LIMITS, Submission } from "@/lib/custom-chatbot/schema";
import type { Settings } from "@/lib/poetry-gem/options";
import s from "./ensemble-submission.module.css";

type Props = { settings: Settings; prompt: string; knowledge: string; busy: boolean };
const EMPTY = { agentName: "", student: "", iconUrl: "", notes: "" };

export default function EnsembleSubmission({ settings, prompt, knowledge, busy }: Props) {
  const [open, setOpen] = useState(false);
  const [identity, setIdentity] = useState(EMPTY);
  const [framingPrompt, setPrompt] = useState(prompt);
  const [reference, setReference] = useState(knowledge);
  const [snapshot, setSnapshot] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [iconFailed, setIconFailed] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ensemble-identity-v1") || "null");
      if (stored && Object.keys(EMPTY).every(key => typeof stored[key] === "string")) {
        setIdentity(Object.fromEntries(Object.keys(EMPTY).map(key => [key, stored[key]])) as typeof EMPTY);
      }
    } catch {}
  }, []);
  useEffect(() => { setIconFailed(false); }, [identity.iconUrl]);

  function update(key: keyof typeof EMPTY, value: string) {
    const next = { ...identity, [key]: value };
    setIdentity(next);
    setSuccess("");
    try { localStorage.setItem("ensemble-identity-v1", JSON.stringify(next)); } catch {}
  }
  function useCurrent() {
    setPrompt(prompt);
    setReference(knowledge);
    setSnapshot({ ...settings });
    setError("");
    setSuccess("");
    setOpen(true);
  }
  const draft = { ...identity, framingPrompt, knowledge: reference, model: "", settings: snapshot };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSuccess("");
    const parsed = Submission.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues.map(issue => issue.message).join(" "));
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Submission failed. Please try again.");
      setSuccess(`${parsed.data.agentName} ${result.created ? "was saved" : "was updated"}. ${result.active ? "It is marked active." : "An instructor must activate it before it can participate."}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Submission failed.");
    } finally { setSaving(false); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ source: "poetry-gem", ...draft }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-chatbot.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className={s.section} aria-label="Save your chatbot">
      {!open ? <button className={s.primary} onClick={useCurrent} disabled={busy}>Save or submit this bot</button> : (
        <form onSubmit={submit}>
          <h3>Submit to the Ensemble</h3>
          <p>The Ensemble receives your instructions and a short voice note. Full books and search tools stay in this studio.</p>
          <fieldset disabled={saving}>
            <div className={s.grid}>
              <label>Bot name<input required maxLength={LIMITS.name} value={identity.agentName} onChange={e => update("agentName", e.target.value)} /></label>
              <label>Your name<input required maxLength={LIMITS.student} autoComplete="name" value={identity.student} onChange={e => update("student", e.target.value)} /></label>
              <label>Icon URL · optional<input type="url" placeholder="https://…" maxLength={LIMITS.icon} value={identity.iconUrl} onChange={e => update("iconUrl", e.target.value)} /></label>
            </div>
            {/^https:\/\//i.test(identity.iconUrl) && !iconFailed && <img className={s.icon} src={identity.iconUrl} alt="Bot icon preview" referrerPolicy="no-referrer" onError={() => setIconFailed(true)} />}
            <label>Instructions for the Ensemble<textarea required rows={6} maxLength={LIMITS.prompt} value={framingPrompt} onChange={e => { setPrompt(e.target.value); setSuccess(""); }} /></label>
            <label>Short knowledge<textarea rows={3} maxLength={LIMITS.knowledge} value={reference} onChange={e => { setReference(e.target.value); setSuccess(""); }} /></label>
            <label>When might your bot speak? Any extra instructions?<textarea rows={3} maxLength={LIMITS.notes} value={identity.notes} placeholder="Speak when someone mentions rain or waiting. Always answer in fourteen lines." onChange={e => update("notes", e.target.value)} /></label>
            <p className={s.help}>Saved settings: {snapshot.genre} · {snapshot.pack} · {snapshot.material} · {snapshot.delivery}. The Ensemble uses its default model. Edits here apply to the submitted bot.</p>
            <p className={s.help}>Use a distinctive name. Submitting the same name updates its entry. Your chat and API key are excluded.</p>
            <div className={s.actions}>
              <button type="submit" className={s.primary}>{saving ? "Submitting…" : "Submit to the Ensemble"}</button>
              <button type="button" onClick={download}>Save JSON copy</button>
              <button type="button" onClick={useCurrent} disabled={busy}>Use current studio settings</button>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </fieldset>
          {error && <p role="alert">{error}</p>}
          {success && <p role="status">{success}</p>}
        </form>
      )}
    </section>
  );
}
