// mini-claw's one tool, `file`, and the folder it works in.
//
// The tool can list, read, write, and append Markdown files, and every path is checked against the workspace
// (mini-claw/ at the repo root) before anything is touched. There is no shell, no network, and no delete.
// Who may do what is the PERMISSIONS table below: the same idea as Claude Code's allow and deny rules, in four lines.
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// Next runs from nextjs/, so the workspace is one folder up.
export const WORKSPACE = path.resolve(process.cwd(), "..", "mini-claw");

// Keep the tracked memory as a seed; demos persist only to an ignored working copy.
export async function memoryFile(root = WORKSPACE) {
  const working = path.join(root, '.working-memory.md');
  const seed = await fs.readFile(path.join(root, 'memory.md'), 'utf8');
  try { await fs.writeFile(working, seed, { flag: 'wx' }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  return working;
}

export async function resetMemory(root = WORKSPACE) {
  const seed = await fs.readFile(path.join(root, 'memory.md'), 'utf8');
  await fs.writeFile(await memoryFile(root), seed);
  return seed;
}

const MAX_WRITE = 20_000; // characters per write or append
const MAX_READ = 20_000; // characters returned by a read; longer files are cut off with a note

// What the model is told about the tool. This text, the schema, and the system prompt are all it knows.
export const fileTool = {
  description:
    "Work with files in your workspace, the folder mini-claw/. Paths are relative to it (memory.md, skills/remember.md, notes/idea.md). " +
    "Actions: list (the files under a folder; use \".\" for everything), read (a file), write (create or replace a Markdown file in notes/), " +
    "append (add text to the end of memory.md or a Markdown file in notes/). You cannot delete, run programs, or reach anything outside mini-claw/.",
  inputSchema: z.object({
    action: z.enum(["list", "read", "write", "append"]),
    path: z.string().describe('A path inside mini-claw/, such as "notes/idea.md", or "." for the whole workspace.'),
    text: z.string().optional().describe("For write and append: the text to put in the file."),
  }),
};

// The same definition as plain JSON, for the trace: this is what goes over the wire to the model.
export const fileToolForTrace = { name: "file", description: fileTool.description, inputSchema: z.toJSONSchema(fileTool.inputSchema) };

// The permission rules, checked after the path is known to be inside the workspace.
export const PERMISSIONS = {
  list: { rule: "anywhere in mini-claw/", allows: () => true },
  read: { rule: "anywhere in mini-claw/", allows: () => true },
  write: { rule: "only Markdown files in notes/", allows: rel => rel.startsWith("notes/") && rel.endsWith(".md") },
  append: { rule: "memory.md (one line at a time), or Markdown files in notes/", allows: rel => rel === "memory.md" || (rel.startsWith("notes/") && rel.endsWith(".md")) },
};

class Refusal extends Error {}

// Turn the path the model asked for into a real path inside the workspace, or refuse.
export async function resolveInside(root, asked) {
  if (typeof asked !== "string" || asked.trim() === "" || asked.includes("\0")) throw new Refusal("Give a path inside mini-claw/, such as notes/idea.md.");
  if (path.isAbsolute(asked)) throw new Refusal(`"${asked}" is an absolute path. Paths are relative to mini-claw/.`);

  // 1. By name: resolve "notes/../../secret" to where it really points and check it is still under the root.
  const full = path.resolve(root, asked);
  const rel = path.relative(root, full);
  if (rel === ".." || rel.startsWith(".." + path.sep) || path.isAbsolute(rel)) throw new Refusal(`"${asked}" is outside mini-claw/.`);
  const relPosix = rel.split(path.sep).join("/") || ".";
  if (relPosix !== "." && relPosix.split("/").some(part => part.startsWith("."))) throw new Refusal(`"${asked}" names a hidden file, which the tool doesn't touch.`);

  // 2. On disk: a symlink inside the folder could still point outside it. Check the real location of the
  //    deepest part of the path that exists (the file itself, or the folder it would be created in).
  const realRoot = await fs.realpath(root);
  let probe = full;
  for (;;) {
    try {
      const real = await fs.realpath(probe);
      const realRel = path.relative(realRoot, real);
      if (realRel === ".." || realRel.startsWith(".." + path.sep) || path.isAbsolute(realRel)) throw new Refusal(`"${asked}" leads outside mini-claw/ through a link.`);
      break;
    } catch (error) {
      if (error instanceof Refusal || error.code !== "ENOENT") throw error;
      probe = path.dirname(probe);
    }
  }
  return { full, rel: relPosix };
}

// Run one tool call. Returns what the model will see (`output`) and, for the trace, whether it was allowed.
export async function runFileTool(input, root = WORKSPACE) {
  const { action, path: asked, text } = input ?? {};
  try {
    if (!PERMISSIONS[action]) throw new Refusal(`Unknown action "${action}". Use list, read, write, or append.`);
    const resolved = await resolveInside(root, asked);
    const { rel } = resolved;
    const full = rel === "memory.md" ? await memoryFile(root) : resolved.full;
    if (!PERMISSIONS[action].allows(rel)) throw new Refusal(`${action} is allowed ${PERMISSIONS[action].rule}, not on "${rel}".`);
    const verdict = { status: "allowed", rule: `${action}: ${PERMISSIONS[action].rule}` };

    if (action === "list") return { ...verdict, output: (await listFiles(full, rel)).join("\n") || "(empty)" };

    if (action === "read") {
      const content = await fs.readFile(full, "utf8");
      return { ...verdict, output: content.length > MAX_READ ? content.slice(0, MAX_READ) + `\n[cut off at ${MAX_READ} characters]` : content };
    }

    if (typeof text !== "string" || text === "") throw new Refusal(`${action} needs some text.`);
    if (text.length > MAX_WRITE) throw new Refusal(`That is ${text.length} characters; the limit is ${MAX_WRITE}.`);

    if (action === "write") {
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, text.endsWith("\n") ? text : text + "\n");
      return { ...verdict, output: `Wrote ${rel} (${text.length} characters).` };
    }

    // append
    if (rel === "memory.md" && text.trim().includes("\n")) throw new Refusal("Add one line to memory.md at a time.");
    const before = await fs.readFile(full, "utf8").catch(() => "");
    const line = text.endsWith("\n") ? text : text + "\n";
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.appendFile(full, before === "" || before.endsWith("\n") ? line : "\n" + line);
    return { ...verdict, output: `Appended to ${rel}.` };
  } catch (error) {
    if (error instanceof Refusal) return { status: "refused", output: `Refused: ${error.message}` };
    if (error.code === "ENOENT") return { status: "error", output: `Error: "${asked}" doesn't exist. Try list.` };
    if (error.code === "EISDIR") return { status: "error", output: `Error: "${asked}" is a folder. Try list.` };
    return { status: "error", output: `Error: ${error.message}` };
  }
}

// Every file under a folder, as workspace paths, hidden files left out.
async function listFiles(full, rel) {
  const stat = await fs.stat(full);
  if (!stat.isDirectory()) return [rel];
  const out = [];
  for (const entry of await fs.readdir(full, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const childRel = rel === "." ? entry.name : `${rel}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await listFiles(path.join(full, entry.name), childRel)));
    else out.push(childRel);
  }
  return out.sort();
}

// For the harness (not the model): memory.md as it is now, and the skills' names and descriptions.
export async function readMemory(root = WORKSPACE) {
  return fs.readFile(await memoryFile(root), "utf8");
}

export async function listSkills(root = WORKSPACE) {
  const dir = path.join(root, "skills");
  const names = (await fs.readdir(dir).catch(() => [])).filter(name => name.endsWith(".md")).sort();
  return Promise.all(names.map(async name => {
    const { data } = matter(await fs.readFile(path.join(dir, name), "utf8"));
    return { name: data.name || name.replace(/\.md$/, ""), description: data.description || "", path: `skills/${name}` };
  }));
}

export async function listNotes(root = WORKSPACE) {
  const notes = path.join(root, "notes");
  return listFiles(notes, "notes").catch(() => []);
}
