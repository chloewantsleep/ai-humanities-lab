import test from "node:test";
import assert from "node:assert/strict";
import { assembleLayers, discussionTiming, PERSONA, SAMPLE_FILE, localAdapter } from "./engine.mjs";

const enabled = { configuration: true, ...PERSONA, instructions: PERSONA.instructions, filesEnabled: true, files: [SAMPLE_FILE], toolEnabled: true, toolResult: discussionTiming(50), memoryEnabled: true, memory: "I prefer one question at a time." };

test("layer switches exclude their text, while memory remains independent of configuration", () => {
  const bare = assembleLayers({ ...enabled, configuration: false, memoryEnabled: false });
  assert.equal(bare.system, "");
  const memoryOnly = assembleLayers({ ...enabled, configuration: false });
  assert.ok(memoryOnly.system.includes(enabled.memory));
  assert.ok(!memoryOnly.system.includes(PERSONA.name));
  const noFilesOrTool = assembleLayers({ ...enabled, filesEnabled: false, toolEnabled: false });
  assert.ok(!noFilesOrTool.system.includes(SAMPLE_FILE.name));
  assert.ok(!noFilesOrTool.system.includes("discussion_timing"));
});

test("the trace blocks reconstruct the complete system input without changing file text", () => {
  const files = [{ name: "unicode.txt", text: "Line 1\nLine 2: π — [Memory]" }];
  const assembled = assembleLayers({ ...enabled, files });
  assert.equal(assembled.blocks.filter(block => block.text).map(block => block.text).join("\n\n"), assembled.system);
  const fileBlock = assembled.blocks.find(block => block.id === "files");
  assert.deepEqual(JSON.parse(fileBlock.text.slice(fileBlock.text.indexOf("\n") + 1)), files);
});

test("the tool conserves time across its full allowed range and rejects invalid input", () => {
  for (let minutes = 5; minutes <= 180; minutes++) {
    const { output } = discussionTiming(minutes);
    assert.equal(output.opening + output.discussion + output.closing, minutes);
    assert.ok(output.discussion > 0);
  }
  for (const invalid of ["", 0, 4, 181, 5.5, "abc"]) assert.throws(() => discussionTiming(invalid));
});

test("local adapter reports receipt without claiming to be a model and honors cancellation", async () => {
  const options = { messages: [{ content: [{ type: "text", text: "Hello" }] }], system: "context", abortSignal: new AbortController().signal };
  const result = await localAdapter.run(options);
  assert.match(result.content[0].text, /no language model was called/);
  assert.match(result.content[0].text, /7 characters/);
  await assert.rejects(localAdapter.run({ ...options, abortSignal: AbortSignal.abort() }), { name: "AbortError" });
});
