import fs from "node:fs";
import path from "node:path";
import Nav from "@/app/poetry-gem/library/Nav";
import lib from "@/app/poetry-gem/library/library.module.css";
import Picker, { type Shot } from "./Picker";

export const metadata = { title: "Model survey · Poetry Gem" };
export const dynamic = "force-dynamic"; // images arrive while a batch is still running

const DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "poetry-gem", "doll", "explore");
const MEDIA = ["Bakst gouache", "Bakst × Sargent watercolour", "Bakst × Mucha, toned paper"];
const KINDS = {
  "r2-crown": "Round 2 · star-crown head (no face) · Donne · whole pack",
  "r2-mask": "Round 2 · striped hood over a half-mask · Dickinson · keyword",
  "r2-veil": "Round 2 · crescent hat, veiled & faceless · Whitman · meaning",
  "r2-parts": "Round 2 · parts sheet, all heads non-human",
  sketchbook: "Round 1 · sketchbook page: the eleven parts as cut-out studies",
  artdoll: "Round 1 · one assembled art doll: crown · Donne · whole pack",
};

export default function ExplorePage() {
  const manifest = fs.existsSync(path.join(DIR, "manifest.json"))
    ? (JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8")) as {
        results: { model: string; kind: string; file?: string; cost?: number; error?: string; medium?: number }[];
      })
    : null;
  const costOf = new Map(manifest?.results.map((r) => [`${r.kind}/${r.model}`, r.cost]) ?? []);
  const mediumOf = new Map(manifest?.results.map((r) => [`${r.kind}/${r.model}`, r.medium]) ?? []);
  const failures = manifest?.results.filter((r) => r.error) ?? [];

  const shots: Shot[] = [];
  for (const kind of Object.keys(KINDS)) {
    const d = path.join(DIR, kind);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).sort()) {
      if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
      const model = f.replace(/\.\w+$/, "").replace("--", "/");
      const m = mediumOf.get(`${kind}/${model}`);
      shots.push({ kind, model, src: `/poetry-gem/doll/explore/${kind}/${f}`, cost: costOf.get(`${kind}/${model}`), note: m !== undefined ? MEDIA[m] : undefined });
    }
  }
  const total = manifest?.results.reduce((n, r) => n + (r.cost ?? 0), 0);

  return (
    <div className={lib.page}>
      <Nav current="doll" />
      <main className={lib.main} style={{ maxWidth: 1400 }}>
        <p className={lib.kicker}>Image model comparison</p>
        <h1>Compare image models</h1>
        <p className={lib.lede}>
          Compare costume images from {new Set(shots.map((s) => s.model)).size || "several"} models.
          The groups use different costume and medium instructions. Select the star to save an image.
          {total !== undefined && <> Batch cost: ${total.toFixed(2)}.</>}
        </p>
        <Picker shots={shots} kinds={KINDS} />
        {failures.length > 0 && (
          <details className={lib.raw}>
            <summary>{failures.length} requests failed</summary>
            <ul className={lib.meta}>
              {failures.map((f) => (
                <li key={f.kind + f.model}>
                  <code>{f.model}</code> ({f.kind}): {f.error}
                </li>
              ))}
            </ul>
          </details>
        )}
      </main>
    </div>
  );
}
