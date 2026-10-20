"use client";

import { useEffect, useState } from "react";
import s from "./picker.module.css";

export type Shot = { kind: string; model: string; src: string; cost?: number; note?: string };
const KEY = "poetry-gem-doll-picks";

export default function Picker({ shots, kinds }: { shots: Shot[]; kinds: Record<string, string> }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [big, setBig] = useState<Shot | null>(null);
  useEffect(() => {
    try {
      // Read after mount so the server render and first client render match.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPicks(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {}
  }, []);
  const toggle = (src: string) =>
    setPicks((p) => {
      const n = p.includes(src) ? p.filter((x) => x !== src) : [...p, src];
      try {
        localStorage.setItem(KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  return (
    <>
      {picks.length > 0 && (
        <div className={s.picks}>
          <strong>Starred ({picks.length}):</strong>{" "}
          <code>{picks.map((p) => p.replace("/poetry-gem/doll/explore/", "")).join(", ")}</code>
          <span> · paste this list back to Claude</span>
        </div>
      )}
      {Object.entries(kinds).map(([kind, label]) => {
        const row = shots.filter((x) => x.kind === kind);
        if (!row.length) return null;
        return (
          <section key={kind}>
            <h2>{label}</h2>
            <div className={s.grid}>
              {row.map((x) => (
                <figure key={x.src} className={`${s.card} ${picks.includes(x.src) ? s.on : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.src} alt={`${x.model}: ${kind}`} loading="lazy" onClick={() => setBig(x)} />
                  <figcaption>
                    <span>
                      {x.model}
                      {x.cost !== undefined && <small> · ${x.cost.toFixed(3)}</small>}
                      {x.note && <small className={s.note}>{x.note}</small>}
                    </span>
                    <button onClick={() => toggle(x.src)} aria-pressed={picks.includes(x.src)} title="Star">
                      {picks.includes(x.src) ? "★" : "☆"}
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
      {big && (
        <div className={s.lightbox} onClick={() => setBig(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={big.src} alt={big.model} />
          <p>
            {big.model} — click anywhere to close · <a href={big.src} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>open full size</a>
          </p>
        </div>
      )}
    </>
  );
}
