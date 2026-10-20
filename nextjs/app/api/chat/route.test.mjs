import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "./route.js";

test("missing key is actionable; malformed requests do not reach provider", async () => {
  const previous = process.env.OPENROUTER_API_KEY;
  try {
    delete process.env.OPENROUTER_API_KEY;
    const missing = await POST(new Request("http://localhost/api/chat", { method: "POST", body: "{}" }));
    assert.equal(missing.status, 503);
    assert.match((await missing.json()).error, /OPENROUTER_API_KEY.*nextjs\/.env.local/);
    process.env.OPENROUTER_API_KEY = "test-placeholder-not-a-key";
    for (const body of ["{", "{}", JSON.stringify({ system: 1, messages: [] }), JSON.stringify({ messages: [{ id: "x", role: "system", parts: [{ type: "text", text: "test" }] }] })]) {
      const result = await POST(new Request("http://localhost/api/chat", { method: "POST", body }));
      assert.equal(result.status, 400);
    }
  } finally {
    if (previous === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previous;
  }
});
