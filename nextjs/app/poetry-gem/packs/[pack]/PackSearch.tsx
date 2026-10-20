"use client";

import { useState } from "react";
import { MATERIALS, type Material, type PackId, type PackInfo, type Passage } from "@/lib/poetry-gem/options";
import s from "@/app/poetry-gem/library/library.module.css";

type Keyword = { terms: string[]; total: number; hits: Passage[] };
type Semantic = { hits: Passage[]; error?: string };

function highlight(text: string, terms: string[]) {
  if (!terms.length) return text;
  const re = new RegExp(`\\b(${terms.map((t) => t.replace(/[^a-z']/g, "")).join("|")})(?:'s)?\\b`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

function apiKey() {
  try {
    return localStorage.getItem("poetry-gem-key") ?? "";
  } catch {
    return "";
  }
}

export default function PackSearch({ pack, levels }: { pack: PackId; levels: PackInfo["levels"] }) {
  const [q, setQ] = useState("");
  const [material, setMaterial] = useState<Material>("assigned");
  const [kw, setKw] = useState<Keyword | null>(null);
  const [sem, setSem] = useState<Semantic | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(query = q, m = material) {
    if (!query.trim()) return;
    setBusy(true);
    const params = new URLSearchParams({ pack, material: m, q: query });
    const key = apiKey();
    try {
      const [a, b] = await Promise.all([
        fetch(`/api/poetry-gem/search?${params}`).then((r) => r.json()),
        fetch(`/api/poetry-gem/vectors?${params}`, { headers: key ? { "x-openrouter-key": key } : {} }).then((r) => r.json()),
      ]);
      setKw(a);
      setSem(b);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className={s.lede}>
        Enter a query to compare <strong>keyword</strong> and <strong>meaning-based</strong> search results.{" "}
        <a href="/poetry-gem/vectors">How meaning-based search works →</a>
      </p>
      <form
        className={s.searchRow}
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. waiting for the bus in the rain" />
        <select
          value={material}
          onChange={(e) => {
            const m = e.target.value as Material;
            setMaterial(m);
            if (kw) run(q, m);
          }}
        >
          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {levels[m].label} ({levels[m].passages} passages)
            </option>
          ))}
        </select>
        <button disabled={busy || !q.trim()}>{busy ? "Searching…" : "Search"}</button>
      </form>

      {kw && sem && (
        <div className={s.compare}>
          <div>
            <h3>Keyword (BM25)</h3>
            <p className={s.meta}>
              Looked for{" "}
              {kw.terms.length
                ? kw.terms.map((t) => <code key={t}>{t}</code>).reduce<React.ReactNode[]>((a, c, i) => (i ? [...a, " ", c] : [c]), [])
                : "nothing (every word was a stop word)"}{" "}
              across {kw.total} passages. Words must match exactly.
            </p>
            {kw.hits.length ? <Hits hits={kw.hits} terms={kw.terms} unit="score" /> : <p className={s.empty}>No matching passages.</p>}
          </div>
          <div>
            <h3>Meaning (vector similarity)</h3>
            <p className={s.meta}>
              The search compares vectors for your query and each passage. Higher scores indicate greater similarity.
            </p>
            {sem.error ? <p className={s.empty}>{sem.error}</p> : <Hits hits={sem.hits} terms={kw.terms} unit="similarity" />}
          </div>
        </div>
      )}
    </div>
  );
}

function Hits({ hits, terms, unit }: { hits: Passage[]; terms: string[]; unit: string }) {
  return (
    <ol className={s.hits}>
      {hits.map((h, i) => (
        <li key={i}>
          <div className={s.hitHead}>
            <strong>{h.title}</strong>{" "}
            <small>
              {h.source} · {unit} {h.score}
            </small>
          </div>
          <details>
            <summary className={s.peek}>{h.text.replace(/^#+ .*\n+/, "").split("\n").slice(0, 2).join(" / ").slice(0, 120)}…</summary>
            <pre>{highlight(h.text, terms)}</pre>
          </details>
        </li>
      ))}
    </ol>
  );
}
