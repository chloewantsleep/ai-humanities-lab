import fs from "node:fs";
import path from "node:path";
import { loadGenres } from "@/lib/poetry-gem/content";
import { DELIVERIES, DELIVERY_LABELS, PACKS, PACK_LABELS } from "@/lib/poetry-gem/options";
import Nav from "@/app/poetry-gem/library/Nav";
import lib from "@/app/poetry-gem/library/library.module.css";
import Dresser from "./Dresser";
import s from "./atelier.module.css";

export const metadata = { title: "Costume settings · Poetry Gem" };

const SHEETS = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "poetry-gem", "doll", "sheets");

export default function AtelierPage() {
  const options = {
    head: loadGenres().map((g) => ({ id: g.id, label: g.label })),
    torso: PACKS.map((p) => ({ id: p, label: PACK_LABELS[p] })),
    legs: DELIVERIES.map((d) => ({ id: d, label: DELIVERY_LABELS[d].label })),
  };
  const sheets = fs.existsSync(SHEETS)
    ? fs.readdirSync(SHEETS).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()
    : [];

  return (
    <div className={lib.page}>
      <Nav current="doll" />
      <main className={lib.main}>
        <p className={lib.kicker}>Costume settings</p>
        <h1>Bot settings</h1>
        <p className={lib.lede}>
          The figure combines three parts from Midjourney costume plates. The head represents instructions; the bodice represents source text; the legs represent delivery. Use the arrows to change each setting.
        </p>
        <Dresser options={options} />

        <h2>Generated character sheets</h2>
        <p className={lib.lede}>
          <a href="/poetry-gem/doll/corpse">Combine costume parts →</a> (your Midjourney plates, cut and recombined) ·{" "}
          <a href="/poetry-gem/doll/explore">Compare image models →</a> (36 models, sketch and watercolour briefs)
        </p>
        <p className={lib.lede}>
          These images compare how different models render the same costume brief.
        </p>
        {sheets.length === 0 ? (
          <p className={lib.meta}>No sheets yet.</p>
        ) : (
          <div className={s.sheets}>
            {sheets.map((f) => (
              <a key={f} href={`/poetry-gem/doll/sheets/${f}`} target="_blank" rel="noreferrer" className={s.sheet}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/poetry-gem/doll/sheets/${f}`} alt={`Character sheet by ${f}`} loading="lazy" />
                <span>{f.replace(/\.(png|jpe?g|webp)$/i, "")}</span>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
