import test from "node:test";
import assert from "node:assert/strict";
import { proxy, config } from "../../nextjs/proxy.js";

test("class gate: local opt-in, deployment fail-closed, all routes, and cross-origin writes", () => {
  const names = ["NODE_ENV", "VERCEL", "CLASS_PASSWORD"];
  const before = Object.fromEntries(names.map(name => [name, process.env[name]]));
  const auth = value => `Basic ${Buffer.from(value).toString("base64")}`;
  const call = (path = "/", options = {}) => proxy(new Request(`http://localhost:3000${path}`, options));
  try {
    delete process.env.CLASS_PASSWORD;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "development";
    assert.equal(call().headers.get("x-middleware-next"), "1");
    process.env.VERCEL = "1";
    assert.equal(call().status, 503);
    delete process.env.VERCEL;
    process.env.NODE_ENV = "production";
    assert.equal(call("/api/chat").status, 503);
    process.env.CLASS_PASSWORD = "   ";
    assert.equal(call().status, 503);

    process.env.CLASS_PASSWORD = "test-class-password";
    assert.equal(config.matcher, "/:path*");
    for (const path of ["/", "/api/chat", "/api/mini-claw", "/api/keys/claim", "/api/bot-lab", "/api/ensemble", "/api/future", "/context-media/history/image.png", "/workshop/texts/plato-phaedrus.txt", "/_next/static/test.js"]) {
      const refused = call(path);
      assert.equal(refused.status, 401, path);
      assert.equal(call(path, { method: "POST", body: "{}" }).status, 401, `${path} POST`);
      assert.match(refused.headers.get("www-authenticate"), /^Basic /);
      assert.match(refused.headers.get("cache-control"), /no-store/);
      for (const authorization of ["Bearer fake", "Basic %%%", auth("wrong:test-class-password"), auth("class:wrong")]) {
        assert.equal(call(path, { headers: { authorization } }).status, 401);
      }
      const allowed = call(path, { headers: { authorization: auth("class:test-class-password") } });
      assert.equal(allowed.headers.get("x-middleware-next"), "1", path);
      assert.match(allowed.headers.get("cache-control"), /private, no-store/);
      assert.equal(allowed.headers.get("x-middleware-request-authorization"), null);
      assert.equal(allowed.headers.get("x-middleware-override-headers")?.includes("authorization"), false);
    }
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const headers = { authorization: auth("class:test-class-password"), origin: "https://other.example" };
      assert.equal(call("/api/chat", { method, headers }).status, 403);
      headers.origin = "http://localhost:3000";
      assert.equal(call("/api/chat", { method, headers }).headers.get("x-middleware-next"), "1");
      delete headers.origin;
      assert.equal(call("/api/chat", { method, headers }).headers.get("x-middleware-next"), "1");
      headers["sec-fetch-site"] = "cross-site";
      assert.equal(call("/api/chat", { method, headers }).status, 403);
    }
    assert.equal(call("/api/chat", { method: "POST", headers: {
      authorization: auth("class:test-class-password"), origin: "https://class.example", host: "class.example", "x-forwarded-proto": "https",
    } }).headers.get("x-middleware-next"), "1", "public host can differ from Next's internal URL");
    process.env.NODE_ENV = "development";
    assert.equal(call().status, 401, "configured password also protects development");
  } finally {
    for (const name of names) {
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
    }
  }
});
