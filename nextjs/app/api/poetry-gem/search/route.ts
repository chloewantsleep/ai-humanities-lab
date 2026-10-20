import { packChunks } from "@/lib/poetry-gem/content";
import { MATERIALS, PACKS, type Material, type PackId } from "@/lib/poetry-gem/options";
import { bm25, tokenize } from "@/lib/poetry-gem/search";

// Lets the pack browser run the exact keyword search the chatbot uses.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pack = url.searchParams.get("pack") as PackId;
  const material = (url.searchParams.get("material") ?? "assigned") as Material;
  const q = url.searchParams.get("q") ?? "";
  if (!PACKS.includes(pack) || pack === "none" || !MATERIALS.includes(material)) {
    return Response.json({ error: "Unknown pack" }, { status: 400 });
  }
  const chunks = packChunks(pack, material);
  return Response.json({ terms: [...new Set(tokenize(q))], total: chunks.length, hits: bm25(chunks, q) });
}
