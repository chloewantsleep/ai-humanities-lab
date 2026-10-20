import { keywordSearch, meaningSearch, semanticWords } from "@/app/story/knowledge/search";

// Free-text search for the Knowledge demo on /story. Keyword search works for any query. Meaning-based
// search works only for words whose embeddings are precomputed (no embedding key on the server).
export async function GET(req) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 200);
  const mode = url.searchParams.get("mode") ?? "keyword";
  if (mode === "meaning") {
    const r = meaningSearch(q);
    if (!r) return Response.json({ error: "no-vector", words: semanticWords() }, { status: 404 });
    return Response.json(r);
  }
  return Response.json(keywordSearch(q));
}
