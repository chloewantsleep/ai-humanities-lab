// Run from nextjs/: node --test app/api/mini-claw/mini-claw.test.mjs
// Every test works on a throwaway copy of a workspace in the system temp folder, never on mini-claw/ itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runFileTool, readMemory, resetMemory } from "./workspace.mjs";
import { runAgent } from "./agent.mjs";
import { scriptedModel } from "./scripted-model.mjs";

async function makeWorkspace() {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), "mini-claw-test-"));
  const root = path.join(base, "mini-claw");
  await fs.mkdir(path.join(root, "skills"), { recursive: true });
  await fs.mkdir(path.join(root, "notes"));
  await fs.writeFile(path.join(root, "memory.md"), "# Memory\n\n- one\n");
  await fs.writeFile(path.join(root, "skills", "remember.md"), "---\nname: remember\ndescription: Keep facts.\n---\n\nSteps.\n");
  await fs.writeFile(path.join(root, ".secret"), "hidden");
  await fs.writeFile(path.join(base, "outside.md"), "OUTSIDE");
  return { base, root };
}

test("paths that climb out of the workspace are refused, for every action", async () => {
  const { base, root } = await makeWorkspace();
  const escapes = ["../outside.md", "notes/../../outside.md", "./../outside.md", "notes/../..", "..", path.join(base, "outside.md"), "/etc/passwd", "~/x.md", "notes/\0.md", "", "   "];
  for (const action of ["list", "read", "write", "append"]) {
    for (const asked of escapes) {
      const result = await runFileTool({ action, path: asked, text: "x" }, root);
      if (asked === "~/x.md") {
        // "~" is just a folder name here, not the home folder; it is inside the workspace, but not in notes/.
        assert.notEqual(result.status, "allowed", `${action} ${asked}`);
        continue;
      }
      assert.equal(result.status, "refused", `${action} ${JSON.stringify(asked)} → ${result.output}`);
    }
  }
  assert.equal(await fs.readFile(path.join(base, "outside.md"), "utf8"), "OUTSIDE");
  assert.deepEqual((await fs.readdir(base)).sort(), ["mini-claw", "outside.md"]);
});

test("a symlink inside the workspace can't be used to reach outside it", async () => {
  const { base, root } = await makeWorkspace();
  await fs.symlink(base, path.join(root, "notes", "door")); // a folder link
  await fs.symlink(path.join(base, "outside.md"), path.join(root, "notes", "link.md")); // a file link
  for (const [action, asked] of [["read", "notes/door/outside.md"], ["write", "notes/door/new.md"], ["append", "notes/door/outside.md"], ["list", "notes/door"], ["read", "notes/link.md"], ["write", "notes/link.md"], ["append", "notes/link.md"]]) {
    const result = await runFileTool({ action, path: asked, text: "x" }, root);
    assert.equal(result.status, "refused", `${action} ${asked} → ${result.output}`);
  }
  assert.equal(await fs.readFile(path.join(base, "outside.md"), "utf8"), "OUTSIDE");
  await assert.rejects(fs.stat(path.join(base, "new.md")));
});

test("the permission rules: read anywhere, write only in notes/, memory one line at a time, no hidden files", async () => {
  const { root } = await makeWorkspace();
  assert.equal((await runFileTool({ action: "read", path: "skills/remember.md" }, root)).status, "allowed");
  assert.match((await runFileTool({ action: "list", path: "." }, root)).output, /memory\.md\nskills\/remember\.md/);
  assert.doesNotMatch((await runFileTool({ action: "list", path: "." }, root)).output, /secret/);
  assert.equal((await runFileTool({ action: "read", path: ".secret" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "write", path: "memory.md", text: "wiped" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "write", path: "skills/remember.md", text: "new rules" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "append", path: "skills/remember.md", text: "more rules" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "write", path: "notes/run.sh", text: "rm -rf /" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "append", path: "memory.md", text: "- two\n- three" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "delete", path: "memory.md" }, root)).status, "refused");
  assert.equal((await runFileTool({ action: "write", path: "notes/a/b.md", text: "# B" }, root)).status, "allowed");
  assert.equal((await runFileTool({ action: "append", path: "memory.md", text: "- two" }, root)).status, "allowed");
  assert.equal(await readMemory(root), "# Memory\n\n- one\n- two\n");
  assert.equal(await fs.readFile(path.join(root, "memory.md"), "utf8"), "# Memory\n\n- one\n");
  assert.equal((await runFileTool({ action: "read", path: "notes/missing.md" }, root)).status, "error");
});

test("the loop runs the scripted model to the end and reports every step", async () => {
  const { root } = await makeWorkspace();
  const events = [];
  await runAgent({ task: "Remember that I'm reading Frankenstein.", model: scriptedModel, report: event => events.push(event), root });
  const types = events.map(event => event.type);
  assert.equal(types[0], "start");
  assert.equal(types.at(-1), "done");
  assert.equal(types.filter(type => type === "tool-result").length, 4);
  assert.equal(types.filter(type => type === "model-input").length, 5);
  assert.ok(events.filter(event => event.type === "tool-result").every(event => event.status === "allowed"));
  const done = events.at(-1);
  assert.equal(done.memoryBefore, "# Memory\n\n- one\n");
  assert.match(done.memoryAfter, /Frankenstein/);
  assert.match(await fs.readFile(path.join(root, "notes", "scripted-run.md"), "utf8"), /Frankenstein/);
  // The fifth call to the model saw the four tool results that came before it.
  const last = events.filter(event => event.type === "model-input").at(-1);
  assert.equal(last.messages.filter(message => message.role === "tool").length, 4);
});

test('working memory persists between reads and reset preserves the tracked seed and notes', async () => {
  const { root } = await makeWorkspace();
  const seed = await fs.readFile(path.join(root, 'memory.md'), 'utf8');
  assert.equal(await readMemory(root), seed);
  await runFileTool({ action: 'append', path: 'memory.md', text: '- remembered' }, root);
  await runFileTool({ action: 'write', path: 'notes/keep.md', text: 'Keep me' }, root);
  assert.match(await readMemory(root), /remembered/);
  assert.equal(await fs.readFile(path.join(root, 'memory.md'), 'utf8'), seed);
  assert.equal(await resetMemory(root), seed);
  assert.equal(await readMemory(root), seed);
  assert.match(await fs.readFile(path.join(root, 'notes/keep.md'), 'utf8'), /Keep me/);
  assert.equal((await runFileTool({action: 'read', path: '.working-memory.md'},root)).status, 'refused');
});
