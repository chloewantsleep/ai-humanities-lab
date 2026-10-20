import { loadGenres, packInfo, readVoice } from "@/lib/poetry-gem/content";
import { PACKS, type PackId, type PackInfo } from "@/lib/poetry-gem/options";
import Studio from "./Studio";

export default function StudioLoader({ embedded = false }: { embedded?: boolean }) {
  const genres = loadGenres().map(({ id, label, blurb, prompt }) => ({ id, label, blurb, prompt }));
  const packs = Object.fromEntries(PACKS.map((p) => [p, packInfo(p)])) as Record<PackId, PackInfo>;
  const voices = Object.fromEntries(PACKS.map(p => [p, p === "none" ? "" : readVoice(p)])) as Record<PackId, string>;
  return <Studio genres={genres} packs={packs} voices={voices} embedded={embedded} />;
}
