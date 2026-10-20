import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server.js";

// One gate for pages, downloads, and every API, including routes added later.
// No password is permitted only in local development, never in a deployment.
export function proxy(request) {
  const password = process.env.CLASS_PASSWORD?.trim();
  if (!password) {
    if (process.env.NODE_ENV === "development" && !process.env.VERCEL) return NextResponse.next();
    return Response.json({ error: "Class access is not configured. Ask the instructor to set CLASS_PASSWORD." }, {
      status: 503, headers: { "Cache-Control": "private, no-store" },
    });
  }

  let credentials = "";
  const authorization = request.headers.get("authorization") || "";
  if (/^Basic /i.test(authorization) && authorization.length < 4096) {
    try { credentials = Buffer.from(authorization.slice(6), "base64").toString("utf8"); } catch {}
  }
  const digest = value => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(credentials), digest(`class:${password}`))) {
    return new Response("Enter username class and the class password provided by the instructor.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="AI Humanities Lab", charset="UTF-8"',
        "Cache-Control": "private, no-store",
      },
    });
  }

  // Browsers attach Basic credentials automatically. Refuse cross-origin writes;
  // command-line clients without an Origin still need the class credentials.
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    // Next can construct request.url with its internal hostname (e.g. localhost
    // when the browser visited 127.0.0.1). Compare with the public request host.
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || url.protocol.slice(0, -1);
    const expectedOrigin = `${protocol}://${host}`;
    if ((origin && origin !== expectedOrigin) || request.headers.get("sec-fetch-site") === "cross-site") {
      return Response.json({ error: "Open the class site directly to send this request." }, {
        status: 403, headers: { "Cache-Control": "private, no-store" },
      });
    }
  }

  // Don't forward the class password to route handlers or cache protected pages.
  const headers = new Headers(request.headers);
  headers.delete("authorization");
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Authorization");
  return response;
}

export const config = { matcher: "/:path*" };
