// The bot-file reader for nextjs/bots/ (the format is bots/README.md). Used by /bot-lab (task AA) and importable by
// the Slack Ensemble (task O). Node only: it reads and writes files. The pure parts (parse, validate, serialize,
// buildSystemPrompt, buildMessages, buildRequest) live in lib/bots-format.mjs and are re-exported here, so one import
// gives everything:
//
//   import { listBots, loadBot, saveBot, buildRequest } from "../nextjs/lib/bots.mjs";
//
// Every function takes an optional `root` (absolute path of the bots folder) so tests and other apps can point it
// elsewhere; the default is nextjs/bots/ under the current working directory, which is nextjs/ for the dev server.

import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkKnowledge, parseBotFile, serializeBotFile, SLUG_PATTERN, validateBot } from "./bots-format.mjs";

export * from "./bots-format.mjs";

export const botsRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "bots");
export const EXAMPLES_DIR = "_examples";
export const KNOWLEDGE_DIR = "knowledge";

function inside(root, file) {
  const resolved = path.resolve(root, file);
  return resolved === root || resolved.startsWith(root + path.sep) ? resolved : null;
}

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function markdownFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_") && !e.name.startsWith(".") && e.name !== "README.md").map((e) => e.name).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// Where a bot's knowledge file is: relative to bots/ (the format's rule), or, for an example, relative to its own
// folder, so examples can keep their texts beside them. Null if it isn't there or points outside bots/.
export async function resolveKnowledge(bot, { root = botsRoot } = {}) {
  if (!bot?.knowledge) return null;
  const candidates = [inside(root, bot.knowledge)];
  if (bot.source) candidates.push(inside(root, path.join(path.dirname(bot.source), bot.knowledge)));
  for (const file of candidates) if (file && (await exists(file))) return file;
  return null;
}

async function readBotFile(file, { root, example }) {
  const slug = path.basename(file, ".md");
  const text = await readFile(/* turbopackIgnore: true */ file, "utf8");
  const source = path.relative(root, file).split(path.sep).join("/");
  const parsed = parseBotFile(text, { slug, source, example });
  const bot = { ...parsed.bot, text, errors: parsed.errors, warnings: parsed.warnings, knowledgeText: null, knowledgeFile: null };
  if (bot.knowledge) {
    const knowledgeFile = await resolveKnowledge(bot, { root });
    if (!knowledgeFile) bot.errors.push(`The knowledge file "${bot.knowledge}" wasn't found under bots/.`);
    else {
      bot.knowledgeFile = path.relative(root, knowledgeFile).split(path.sep).join("/");
      bot.knowledgeText = await readFile(/* turbopackIgnore: true */ knowledgeFile, "utf8");
      bot.errors.push(...checkKnowledge(bot.knowledgeText));
    }
  }
  bot.ok = bot.errors.length === 0;
  return bot;
}

/**
 * Every bot in bots/ (the room's) and, unless `examples` is false, bots/_examples/ (ours). Invalid files are included
 * with `ok: false` and their `errors`, so a page can show the student why; filter on `ok` to run only the valid ones.
 */
export async function listBots({ root = botsRoot, examples = true } = {}) {
  const bots = [];
  for (const name of await markdownFiles(root)) bots.push(await readBotFile(path.join(root, name), { root, example: false }));
  if (examples) for (const name of await markdownFiles(path.join(root, EXAMPLES_DIR))) bots.push(await readBotFile(path.join(root, EXAMPLES_DIR, name), { root, example: true }));
  return bots;
}

/** One bot by slug: the room's first, then the examples. Null if there is no such file. */
export async function loadBot(slug, { root = botsRoot, examples = true } = {}) {
  if (!SLUG_PATTERN.test(slug ?? "")) return null;
  const places = [path.join(root, `${slug}.md`)];
  if (examples) places.push(path.join(root, EXAMPLES_DIR, `${slug}.md`));
  for (const file of places) if (await exists(file)) return readBotFile(file, { root, example: file.includes(`${path.sep}${EXAMPLES_DIR}${path.sep}`) });
  return null;
}

/**
 * Save a bot to bots/<slug>.md (never into _examples/). Takes a bot object or a file's text. Refuses an invalid bot:
 * the result is { ok, slug, file, errors, warnings, text }. Overwrites an existing file of the same slug (a student
 * saving again), unless `overwrite` is false.
 */
export async function saveBot(botOrText, { root = botsRoot, overwrite = true } = {}) {
  const parsed = typeof botOrText === "string" ? parseBotFile(botOrText) : validateBot(botOrText);
  const { bot, errors, warnings } = parsed;
  if (errors.length) return { ok: false, slug: bot.slug, file: null, errors, warnings, text: null };
  const file = path.join(root, `${bot.slug}.md`);
  if (!overwrite && (await exists(file))) return { ok: false, slug: bot.slug, file: null, errors: [`There is already a bot called "${bot.slug}" in bots/. Choose another slug, or save over it on purpose.`], warnings, text: null };
  const text = serializeBotFile(bot);
  await mkdir(root, { recursive: true });
  await writeFile(file, text, "utf8");
  return { ok: true, slug: bot.slug, file: path.relative(root, file).split(path.sep).join("/"), errors: [], warnings, text };
}

/** The knowledge texts available to attach: files in bots/knowledge/ (and examples' knowledge), with word counts and text. */
export async function listKnowledge({ root = botsRoot } = {}) {
  const out = [];
  for (const dir of [KNOWLEDGE_DIR, path.join(EXAMPLES_DIR, KNOWLEDGE_DIR)]) {
    let names = [];
    try { names = (await readdir(path.join(root, dir))).filter((n) => /\.(md|txt)$/i.test(n) && !n.startsWith(".")).sort(); } catch { continue; }
    for (const name of names) {
      const rel = path.join(dir, name).split(path.sep).join("/");
      const text = await readFile(/* turbopackIgnore: true */ path.join(root, dir, name), "utf8");
      out.push({ path: rel, name, words: text.split(/\s+/).filter(Boolean).length, example: dir.startsWith(EXAMPLES_DIR), text });
    }
  }
  return out;
}

/** Save a knowledge text to bots/knowledge/<name>; returns its path relative to bots/ (what `knowledge:` should say). */
export async function saveKnowledge(name, text, { root = botsRoot } = {}) {
  const safe = String(name ?? "").replace(/\.(md|txt)$/i, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 80);
  if (!safe) return { ok: false, errors: ["The knowledge file needs a name."] };
  const errors = checkKnowledge(text);
  if (!String(text ?? "").trim()) errors.push("The knowledge file is empty.");
  if (errors.length) return { ok: false, errors };
  const dir = path.join(root, KNOWLEDGE_DIR);
  await mkdir(dir, { recursive: true });
  const rel = `${KNOWLEDGE_DIR}/${safe}.md`;
  await writeFile(path.join(root, rel), String(text).replace(/\r\n?/g, "\n"), "utf8");
  return { ok: true, path: rel, words: String(text).split(/\s+/).filter(Boolean).length };
}
