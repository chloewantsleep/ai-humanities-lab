import Link from "next/link";
import { PACKS, PACK_LABELS } from "@/lib/poetry-gem/options";
import { loadGenres } from "@/lib/poetry-gem/content";
import s from "./library.module.css";

export default function Nav({ current }: { current?: string }) {
  return (
    <nav className={s.nav}>
      <Link href="/poetry-gem" className={s.brand}>
        Poetry Gem
      </Link>
      <Link href="/poetry-gem/library" className={current === "library" ? s.here : ""}>
        Library
      </Link>
      <Link href="/poetry-gem/doll" className={current === "doll" ? s.here : ""}>
        Costume settings
      </Link>
      <Link href="/poetry-gem/vectors" className={current === "vectors" ? s.here : ""}>
        Vector map
      </Link>
      <span className={s.navGroup}>Prompts:</span>
      {loadGenres().map((g) => (
        <Link key={g.id} href={`/poetry-gem/prompts/${g.id}`} className={current === `prompt:${g.id}` ? s.here : ""}>
          {g.label}
        </Link>
      ))}
      <span className={s.navGroup}>Packs:</span>
      {PACKS.filter((p) => p !== "none").map((p) => (
        <Link key={p} href={`/poetry-gem/packs/${p}`} className={current === `pack:${p}` ? s.here : ""}>
          {PACK_LABELS[p]}
        </Link>
      ))}
    </nav>
  );
}
