import { z } from "zod";
import { embed, dot, fromBase64 } from "@/lib/poetry-gem/embeddings";
import { MATERIALS, PACKS, type PackId } from "@/lib/poetry-gem/options";
import { loadIndex, nearest, project, readMap, type VectorHit } from "@/lib/poetry-gem/vectors";

// Meaning-based search for the pack explorer and the /vectors map.
//   ?q=…               embed the query and find its nearest passages (or words)
//   ?pack=…&i=…        nearest neighbours of an existing passage
const Params = z.object({
  q: z.string().optional(),
  pack: z.enum([...PACKS, "all"]).default("all"),
  material: z.enum(MATERIALS).default("assigned"),
  layer: z.enum(["passages", "words"]).default("passages"),
  i: z.coerce.number().int().optional(),
  k: z.coerce.number().int().min(1).max(20).default(5),
});

export async function GET(req: Request) {
  const parsed = Params.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { q, pack, material, layer, i, k } = parsed.data;
  const packs = (pack === "all" ? PACKS.filter((p) => p !== "none") : [pack]).filter((p): p is PackId => p !== "none");

  try {
    let vec: Float32Array;
    if (q?.trim()) {
      [vec] = await embed([q], req.headers.get("x-openrouter-key"));
    } else if (i !== undefined && pack !== "all" && pack !== "none") {
      vec = loadIndex(pack).vecs[i];
      if (!vec) return Response.json({ error: "No such passage" }, { status: 404 });
    } else {
      return Response.json({ error: "Give q, or pack and i" }, { status: 400 });
    }

    if (layer === "words") {
      const w = readMap().words as { points: { word: string }[]; vectors: string };
      const wv = fromBase64(w.vectors);
      const hits = w.points
        .map((p, j) => ({ word: p.word, j, score: Math.round(dot(vec, wv[j]) * 1000) / 1000 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
      return Response.json({ coords: project(vec, "words"), hits });
    }

    const hits: VectorHit[] = packs
      .flatMap((p) => nearest(p, material, vec, k, p === pack ? i : undefined))
      .sort((a, b) => b.score! - a.score!)
      .slice(0, k);
    return Response.json({ coords: q ? project(vec, "passages") : null, hits });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
