import { listBots } from "../../../lib/bots.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The Ensemble's harness (slack-ensemble/, started with `pnpm dry-run` or `pnpm start`) serves its state and the
// simulated room on localhost; this route passes requests through so the page needs no second origin.
const HARNESS = process.env.ENSEMBLE_HARNESS_URL?.trim() || "http://127.0.0.1:3031";

async function harness(pathname, init) {
  try {
    const res = await fetch(`${HARNESS}${pathname}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(4000) });
    return { status: res.status, body: await res.json() };
  } catch {
    return null;
  }
}

// GET: the harness's state (its bots, the simulated room) and, whether or not it is running, the bot files saved here.
export async function GET() {
  const [state, files] = await Promise.all([harness("/state"), listBots({ examples: true })]);
  const saved = files.map(b => ({ name: b.name, slug: b.slug, source: b.source, example: b.example, ok: b.ok, errors: b.errors }));
  return Response.json({ harness: state?.body ?? null, saved }, { headers: { "cache-control": "no-store" } });
}

// POST { action: "message", name, text, thread? } or { action: "reset" }: the simulated room (dry run only).
export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const route = payload.action === "reset" ? "/reset" : "/messages";
  const body = payload.action === "reset" ? {} : { name: payload.name, text: payload.text, thread: payload.thread };
  const result = await harness(route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!result) return Response.json({ error: "The Ensemble isn't running. In a terminal: cd slack-ensemble && pnpm dry-run" }, { status: 503 });
  return Response.json(result.body, { status: result.status });
}
