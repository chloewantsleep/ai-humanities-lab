import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Explicit teaching-file allowlist: never serve the venv, caches, or model outputs.
const assets = new Map([
  ["fine-tune.ipynb", ["fine-tune.ipynb", "application/x-ipynb+json"]],
  ["template.json", ["dialogues/template.json", "application/json"]],
  ["sample.json", ["dialogues/sample.json", "application/json"]],
  ["README.md", ["README.md", "text/markdown; charset=utf-8"]],
]);

export async function GET(_request, { params }) {
  const { asset } = await params;
  const entry = assets.get(asset);
  if (!entry) return new Response("File not found", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), "..", "fine-tune", entry[0]));
    return new Response(data, {
      headers: {
        "Content-Type": entry[1],
        "Content-Disposition": `attachment; filename="${asset}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error.code === "ENOENT") return new Response("File not found", { status: 404 });
    throw error;
  }
}
