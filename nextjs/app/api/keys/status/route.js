import { ClaimError, windowStatus } from "../../../../lib/workshop-keys/claim.mjs";

export const dynamic = "force-dynamic";

// Whether claiming is open. No secrets.
export async function GET() {
  try {
    return Response.json(await windowStatus(), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof ClaimError) return Response.json({ configured: false, open: false, error: err.message }, { status: err.status });
    console.error("status failed:", err.status, err.message);
    return Response.json({ configured: false, open: false, error: "Couldn't reach OpenRouter." }, { status: 502 });
  }
}
