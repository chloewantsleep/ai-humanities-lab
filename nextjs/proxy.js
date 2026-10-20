import { NextResponse } from "next/server.js";

// No login: the site is open to anyone with the link (Madeleine, 2026-10-20). The one check left needs no password:
// writes (POST and the like) are refused when they come from another website, so a page elsewhere can't make a
// visitor's browser submit bots or spend the model key. The class-password gate is in git history (65b8239) if needed.
export function proxy(request) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    // Next can construct request.url with its internal hostname; compare with the public request host.
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || url.protocol.slice(0, -1);
    if ((origin && origin !== `${protocol}://${host}`) || request.headers.get("sec-fetch-site") === "cross-site") {
      return Response.json({ error: "Open the class site directly to send this request." }, {
        status: 403, headers: { "Cache-Control": "private, no-store" },
      });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
