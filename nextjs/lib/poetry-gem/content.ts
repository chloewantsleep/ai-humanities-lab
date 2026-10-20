import "server-only";
import fs from "node:fs";
import path from "node:path";
import { MATERIALS, MATERIAL_LABELS, type Material, type PackId, type PackInfo, type Passage, type TextLevel } from "./options";

const ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "_poetry-gem");

export type Genre = { id: string; label: string; blurb: string; prompt: string };

function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {} as Record<string, string>, body: raw.trim() };
  const meta = Object.fromEntries(
    m[1].split("\n").map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  );
  return { meta, body: raw.slice(m[0].length).trim() };
}

export function loadGenres(): Genre[] {
  const dir = path.join(ROOT, "prompts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(dir, f), "utf8"));
      const id = f.replace(/\.md$/, "");
      return { id, label: meta.label ?? id, blurb: meta.blurb ?? "", prompt: body };
    });
}

// ---- Knowledge packs (built from the course readings by scripts/build-packs.py) ----------------

type PackMeta = {
  id: string;
  label: string;
  voiceOf: string;
  edition: string;
  levels: Record<TextLevel, { label: string; blurb: string }>;
  sections: { file: string; title: string; levels: TextLevel[] }[];
};
export type PackSection = { title: string; levels: TextLevel[]; text: string };

const metaCache = new Map<PackId, PackMeta>();
export function packMeta(pack: PackId): PackMeta {
  let m = metaCache.get(pack);
  if (!m) {
    m = JSON.parse(fs.readFileSync(path.join(ROOT, "packs", pack, "pack.json"), "utf8")) as PackMeta;
    metaCache.set(pack, m);
  }
  return m;
}

export function readVoice(pack: PackId) {
  return fs.readFileSync(path.join(ROOT, "packs", pack, "voice.md"), "utf8").trim();
}

/** The pack's sections in reading order, each knowing which levels include it. */
export function packSections(pack: PackId): PackSection[] {
  return packMeta(pack).sections.map((s) => ({
    title: s.title,
    levels: s.levels,
    text: fs.readFileSync(path.join(ROOT, "packs", pack, "sections", s.file), "utf8").trim(),
  }));
}

/** The pack as one string at a given level: what "Whole pack" delivery pastes into the prompt. */
export function packText(pack: PackId, material: Material): string {
  if (pack === "none") return "";
  if (material === "voice") return readVoice(pack);
  return packSections(pack)
    .filter((s) => s.levels.includes(material))
    .map((s) => s.text)
    .join("\n\n");
}

const MAX_CHUNK = 1800;
export type Chunk = Passage & { levels: Material[] };

/** Cut one section into passages of up to MAX_CHUNK characters at paragraph breaks. */
function chunkSection(title: string, text: string, source: Passage["source"], levels: Material[]): Chunk[] {
  const paras = text.replace(/^## .*\n+/, "").split(/\n\s*\n/);
  const out: Chunk[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (!buf.length) return;
    const body = buf.join("\n\n");
    // Analects passages are easiest to cite by their saying numbers
    const nums = [...body.matchAll(/\*\*(\d+\.\d+)\*\*/g)].map((m) => m[1]);
    const where = nums.length ? ` · ${nums[0]}${nums.length > 1 ? `–${nums[nums.length - 1]}` : ""}` : "";
    out.push({ title: `${title}${where}`, source, levels, text: `## ${title}\n\n${body}` });
    buf = [];
  };
  for (const p of paras) {
    if (buf.length && buf.join("\n\n").length + p.length > MAX_CHUNK) flush();
    buf.push(p);
  }
  flush();
  // number the parts of sections that had to be split (not needed when saying numbers locate them)
  if (out.length > 1) out.forEach((c, i) => !/ · \d/.test(c.title) && (c.title = `${c.title} (part ${i + 1})`));
  return out;
}

const chunkCache = new Map<PackId, Chunk[]>();

/** Every passage the pack can offer, at any level, in a fixed order (the embeddings are aligned to it). */
export function allChunks(pack: PackId): Chunk[] {
  if (pack === "none") return [];
  let chunks = chunkCache.get(pack);
  if (!chunks) {
    chunks = readVoice(pack)
      .split(/\n(?=## )/)
      .filter((s) => s.startsWith("## "))
      .map((s) => ({ title: s.match(/^## (.*)/)![1], source: "voice" as const, levels: ["voice" as Material], text: s.trim() }));
    for (const s of packSections(pack)) chunks.push(...chunkSection(s.title, s.text, "text", s.levels));
    chunkCache.set(pack, chunks);
  }
  return chunks;
}

/** The passages available at one level (what keyword and meaning-based search look through). */
export function packChunks(pack: PackId, material: Material): Chunk[] {
  return allChunks(pack).filter((c) => c.levels.includes(material));
}

export function packStats(pack: PackId, material: Material) {
  const text = packText(pack, material);
  // Rough: ~3.5 characters per token for English prose. The real count comes back from the API.
  return { chars: text.length, approxTokens: Math.round(text.length / 3.5), passages: packChunks(pack, material).length };
}

/** Labels and sizes for every level, for the browser. */
export function packInfo(pack: PackId): PackInfo {
  if (pack === "none") {
    const empty = { label: "", blurb: "", chars: 0, approxTokens: 0, passages: 0 };
    return { label: "No pack", edition: "", levels: { voice: empty, assigned: empty, more: empty, whole: empty } };
  }
  const m = packMeta(pack);
  const levels = Object.fromEntries(
    MATERIALS.map((lv) => [
      lv,
      { ...(lv === "voice" ? MATERIAL_LABELS.voice : m.levels[lv]), ...packStats(pack, lv) },
    ]),
  ) as PackInfo["levels"];
  return { label: m.label, edition: m.edition, levels };
}

export function getGenre(id: string) {
  return loadGenres().find((g) => g.id === id);
}
