import "server-only";

// Embeddings come from an OpenAI model served through OpenRouter. Claude writes the poems;
// this model only turns text into vectors for meaning-based search.
export const EMBED_MODEL = process.env.EMBED_MODEL ?? "openai/text-embedding-3-small";
export const EMBED_DIMS = 512;

export async function embed(texts: string[], key?: string | null): Promise<Float32Array[]> {
  const apiKey = key || process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Meaning-based search needs an OpenRouter key (OPENROUTER_API_KEY).");
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts, dimensions: EMBED_DIMS }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.data) {
    throw new Error(`Embedding request failed (${res.status}): ${body?.error?.message ?? res.statusText}`);
  }
  return (body.data as { index: number; embedding: number[] }[])
    .sort((a, b) => a.index - b.index)
    .map((d) => Float32Array.from(d.embedding));
}

export function hashText(s: string) {
  // FNV-1a: cheap fingerprint to notice when a pack changed but its embeddings weren't rebuilt.
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

export function toBase64(vecs: Float32Array[]) {
  const all = new Float32Array(vecs.length * EMBED_DIMS);
  vecs.forEach((v, i) => all.set(v, i * EMBED_DIMS));
  return Buffer.from(all.buffer).toString("base64");
}

export function fromBase64(b64: string, dims = EMBED_DIMS): Float32Array[] {
  const buf = Buffer.from(b64, "base64");
  const all = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  const out: Float32Array[] = [];
  for (let i = 0; i < all.length; i += dims) out.push(all.slice(i, i + dims));
  return out;
}

export function dot(a: Float32Array, b: Float32Array) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s; // vectors are unit length, so this is cosine similarity
}
