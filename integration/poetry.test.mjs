import assert from "node:assert/strict";
import test from "node:test";
import { loadGenres, packInfo, allChunks } from "../nextjs/.next/integration-check/lib/poetry-gem/content.mjs";
import { loadIndex, readMap } from "../nextjs/.next/integration-check/lib/poetry-gem/vectors.mjs";
import { GET as search } from "../nextjs/.next/integration-check/app/api/poetry-gem/search/route.mjs";
import { GET as vectors } from "../nextjs/.next/integration-check/app/api/poetry-gem/vectors/route.mjs";
import { POST as chat } from "../nextjs/.next/integration-check/app/api/poetry-gem/chat/route.mjs";
import { POST as submit } from "../nextjs/.next/integration-check/app/api/submit/route.mjs";

test("the unified builder submits full studio settings and upserts an inactive bot", async t => {
  const keys = ["AIRTABLE_TOKEN", "AIRTABLE_BASE_ID", "AIRTABLE_TABLE_ID", "SUBMIT_ACTIVE"];
  const before = keys.map(key => process.env[key]);
  Object.assign(process.env, { AIRTABLE_TOKEN: "fixture-only", AIRTABLE_BASE_ID: "appFixture", AIRTABLE_TABLE_ID: "tblFixture", SUBMIT_ACTIVE: "false" });
  const writes = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const body = JSON.parse(init.body);
    writes.push(body);
    assert.equal(init.method, "PATCH");
    assert.deepEqual(body.performUpsert.fieldsToMergeOn, ["fldiH8Hl7TaDPX5rm"]);
    return Response.json({
      records: [{ id: "recFixture" }],
      createdRecords: writes.length === 1 ? ["recFixture"] : [],
      updatedRecords: writes.length === 1 ? [] : ["recFixture"],
    });
  });
  try {
    for (let i = 0; i < 2; i++) {
      const response = await submit(new Request("http://localhost/api/submit", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agentName: "Rain Bot", student: "Test Student", iconUrl: "", framingPrompt: "Write about rain.",
          knowledge: "Short voice note", notes: "Speak about weather.", model: "",
          settings: { genre: "sonnet", pack: "frankenstein", material: "whole", delivery: "agentic" },
        }),
      }));
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.created, i === 0);
      assert.equal(result.active, false);
      const fields = writes[i].records[0].fields;
      assert.equal(fields.fld6ZevxYqsrP0fCn, false);
      assert.equal(fields.fldhzR7keUV3qNHZw, "Short voice note");
      const settings = JSON.parse(fields.fldBijVi8ETlwgfgX);
      assert.equal(settings.source, "poetry-gem");
      assert.equal(settings.material, "whole");
      assert.equal(settings.delivery, "agentic");
    }
  } finally {
    keys.forEach((key, i) => { if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i]; });
  }
});

test("all forms and reading packs load from their new namespace", () => {
  assert.deepEqual(loadGenres().map(g => g.id), ["ghazal", "haiku", "sonnet"]);
  for (const pack of ["analects", "frankenstein", "phaedrus"]) {
    assert.ok(packInfo(pack).levels.assigned.chars > 1000);
    const index = loadIndex(pack); // Validates every stored embedding against its passage hash.
    assert.equal(index.vecs.length, allChunks(pack).length);
    assert.ok(index.vecs.length > 10);
  }
  assert.ok(readMap().passages.points.length > 0);
});

test("keyword search reads the relocated pack and returns real passages", async () => {
  const res = await search(new Request("http://localhost/api/poetry-gem/search?pack=frankenstein&q=creature"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.total > 0);
  assert.ok(data.hits.length > 0);
  assert.match(data.hits[0].text.toLowerCase(), /creature/);
});

test("search rejects an invalid pack instead of reading arbitrary paths", async () => {
  const res = await search(new Request("http://localhost/api/poetry-gem/search?pack=../../README"));
  assert.equal(res.status, 400);
});

test("semantic neighbours use stored vectors without making a provider call", async () => {
  const res = await vectors(new Request("http://localhost/api/poetry-gem/vectors?pack=phaedrus&i=1&material=whole"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.hits.length > 0);
  assert.ok(data.hits.every(hit => hit.pack === "phaedrus" && hit.i !== 1));
});

test("chat rejects malformed input", async () => {
  const res = await chat(new Request("http://localhost/api/poetry-gem/chat", { method: "POST", body: "{}" }));
  assert.equal(res.status, 400);
});

test("each delivery mode returns a useful missing-key response", async () => {
  const before = [process.env.OPENROUTER_API_KEY, process.env.ANTHROPIC_API_KEY];
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    for (const delivery of ["full", "lexical", "semantic", "agentic"]) {
      const res = await chat(new Request("http://localhost/api/poetry-gem/chat", {
        method: "POST",
        body: JSON.stringify({
          settings: { genre: "sonnet", pack: "frankenstein", material: "assigned", delivery },
          messages: [{ role: "user", content: "A poem about rain." }],
        }),
      }));
      assert.equal(res.status, 401, delivery);
      assert.match((await res.json()).error, /No API key/);
    }
  } finally {
    for (const [i, key] of ["OPENROUTER_API_KEY", "ANTHROPIC_API_KEY"].entries()) {
      if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i];
    }
  }
});

function providerStream(toolCall = false) {
  const block = toolCall
    ? { type: "tool_use", id: "tool_test", name: "search_pack", input: {} }
    : { type: "text", text: "" };
  const events = [
    { type: "message_start", message: {
      id: "msg_test", type: "message", role: "assistant", model: "fixture",
      content: [], stop_reason: null, stop_sequence: null,
      usage: { input_tokens: 100, output_tokens: 0 },
    } },
    { type: "content_block_start", index: 0, content_block: block },
    { type: "content_block_delta", index: 0, delta: toolCall
      ? { type: "input_json_delta", partial_json: '{"query":"creature"}' }
      : { type: "text_delta", text: "A test poem about the rain." } },
    { type: "content_block_stop", index: 0 },
    { type: "message_delta", delta: { stop_reason: toolCall ? "tool_use" : "end_turn", stop_sequence: null }, usage: { output_tokens: 8 } },
    { type: "message_stop" },
  ];
  return new Response(events.map(e => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(""), {
    headers: { "content-type": "text/event-stream" },
  });
}

for (const delivery of ["full", "lexical", "semantic", "agentic"]) {
  test(`${delivery}: the relocated chat streams a reply and preserves its inspection trace`, async t => {
    const requests = [];
    t.mock.method(globalThis, "fetch", async (url, init) => {
      const address = url instanceof Request ? url.url : String(url);
      if (address.endsWith("/embeddings")) {
        return Response.json({ data: [{ index: 0, embedding: Array.from(loadIndex("frankenstein").vecs[0]) }] });
      }
      assert.match(address, /^https:\/\/openrouter\.ai\/api\/v1\/messages/);
      requests.push(JSON.parse(init.body));
      return providerStream(delivery === "agentic" && requests.length === 1);
    });
    const res = await chat(new Request("http://localhost/api/poetry-gem/chat", {
      method: "POST",
      headers: { "x-openrouter-key": "test-fixture-only" },
      body: JSON.stringify({
        framingPrompt: "Write short poems about weather.",
        settings: { genre: "sonnet", pack: "frankenstein", material: "assigned", delivery },
        messages: [{ role: "user", content: "A poem about the creature." }],
      }),
    }));
    assert.equal(res.status, 200);
    const events = (await res.text()).trim().split("\n").map(line => JSON.parse(line));
    assert.deepEqual(events.filter(e => e.type === "error"), []);
    assert.ok(events.some(e => e.type === "text" && e.delta.includes("test poem")));
    assert.ok(events.some(e => e.type === "sent" && e.parts.some(p => p.kind === "instructions")));
    const usage = events.find(e => e.type === "usage");
    assert.equal(usage.usage.calls, delivery === "agentic" ? 2 : 1);
    const context = events.find(e => e.type === "context");
    assert.ok(context.system.startsWith("Write short poems about weather."));
    if (delivery === "full") assert.match(context.system, /<context_pack/);
    if (["lexical", "semantic"].includes(delivery)) assert.ok(context.injected.length > 0);
    if (delivery === "agentic") {
      assert.ok(events.some(e => e.type === "tool_call" && e.results.length > 0));
      assert.equal(requests[1].messages.at(-1).content[0].type, "tool_result");
    }
  });
}

test("custom instructions reject empty and oversized prompts", async () => {
  for (const framingPrompt of [" ", "a".repeat(20_001)]) {
    const response = await chat(new Request("http://localhost/api/poetry-gem/chat", {
      method: "POST",
      body: JSON.stringify({
        framingPrompt,
        settings: { genre: "sonnet", pack: "none", material: "voice", delivery: "full" },
        messages: [{ role: "user", content: "Rain" }],
      }),
    }));
    assert.equal(response.status, 400);
  }
});
