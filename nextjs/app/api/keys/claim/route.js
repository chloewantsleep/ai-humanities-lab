import { claim, ClaimError } from "../../../../lib/workshop-keys/claim.mjs";

export const dynamic = "force-dynamic";

// POST { name, password } → the key, once.
// ?format=env answers in plain text, one line ready for .env; the starter's claim-key.sh uses it,
// so the key goes from here into the student's .env without passing through Claude.
export async function POST(request) {
  const asEnv = new URL(request.url).searchParams.get("format") === "env";
  let body = {};
  try {
    body = request.headers.get("content-type")?.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {}

  try {
    const result = await claim({ name: body.name, password: body.password });
    if (asEnv) {
      return new Response(`OPENROUTER_API_KEY=${result.key}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    return Response.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const status = err instanceof ClaimError ? err.status : 502;
    const message = err instanceof ClaimError ? err.message : "Something went wrong reaching OpenRouter. Try again in a moment.";
    if (!(err instanceof ClaimError)) console.error("claim failed:", err.status, err.message);
    if (asEnv) return new Response(`${message}\n`, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    return Response.json({ ok: false, error: message }, { status });
  }
}
