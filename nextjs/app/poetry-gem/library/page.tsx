import Link from "next/link";
import { loadGenres, packInfo } from "@/lib/poetry-gem/content";
import { PACKS, PACK_LABELS } from "@/lib/poetry-gem/options";
import Nav from "./Nav";
import s from "./library.module.css";

export const metadata = { title: "Library · Poetry Gem" };

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Library() {
  const genres = loadGenres();
  return (
    <div className={s.page}>
      <Nav current="library" />
      <main className={s.main}>
        <h1>Library</h1>
        <p className={s.lede}>
          Read the bot instructions and source texts. The studio sends these to the model according to your settings.
        </p>

        <h2>Instructions (system prompts)</h2>
        <div className={s.cards}>
          {genres.map((g) => (
            <Link key={g.id} href={`/poetry-gem/prompts/${g.id}`} className={s.card}>
              <strong>{g.label}</strong>
              <span>{g.blurb}</span>
              <small>{fmt(g.prompt.length)} characters</small>
            </Link>
          ))}
        </div>

        <h2>Context packs</h2>
        <div className={s.cards}>
          {PACKS.filter((p) => p !== "none").map((p) => {
            const info = packInfo(p);
            return (
              <Link key={p} href={`/poetry-gem/packs/${p}`} className={s.card}>
                <strong>{PACK_LABELS[p]}</strong>
                <span>{info.edition}</span>
                <small>
                  {info.levels.assigned.label} ≈ {fmt(info.levels.assigned.approxTokens)} tokens · whole ≈{" "}
                  {fmt(info.levels.whole.approxTokens)} tokens
                </small>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
