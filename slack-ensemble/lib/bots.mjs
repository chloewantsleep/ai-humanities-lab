import fs from "node:fs";
import path from "node:path";
import { checkBot, countWords, MAX_KNOWLEDGE_WORDS, systemPrompt } from "./bot-file.mjs";

const markdown = dir => {
  try { return fs.readdirSync(dir).filter(f => f.endsWith(".md") && f !== "README.md" && !/^[_.]/.test(f)).sort(); } catch { return null; }
};

// Read every bot in bots/ (not README.md, not files starting with _ or .) and, unless `examples` is false, in
// bots/_examples/, with each one's knowledge text. A room bot wins over an example with the same slug.
// Returns { bots: Map<slug, bot>, invalid: [{ file, problems }] }. Invalid bots are listed, never dropped silently.
export function loadBots(dir, { examples = true } = {}) {
  const bots = new Map();
  const invalid = [];
  const files = markdown(dir);
  if (!files) invalid.push({ file: dir, problems: [`Can't read the bots folder ${dir}.`] });
  const entries = (files ?? []).map(f => ({ file: f, where: dir, example: false }));
  if (examples) entries.push(...(markdown(path.join(dir, "_examples")) ?? []).map(f => ({ file: `_examples/${f}`, where: path.join(dir, "_examples"), example: true })));
  const root = path.resolve(dir);
  for (const { file, where: home, example } of entries) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const { ok, bot, problems, warnings } = checkBot(text, { fileSlug: path.basename(file, ".md") });
    let knowledgeText = "";
    if (ok && bot.knowledge) {
      // relative to bots/ (the format's rule) or, for an example, to its own folder (as the course app reads it)
      const where = [path.resolve(dir, bot.knowledge), path.resolve(home, bot.knowledge)].find(w => w.startsWith(root + path.sep) && fs.existsSync(w));
      // (checkBot has already refused absolute paths and "..")
      if (!where) problems.push(`knowledge: file not found: ${bot.knowledge}`);
      else {
        knowledgeText = fs.readFileSync(where, "utf8");
        const words = countWords(knowledgeText);
        if (words > MAX_KNOWLEDGE_WORDS) problems.push(`The knowledge text is ${words} words; the format allows one short text under about ${MAX_KNOWLEDGE_WORDS}.`);
      }
    }
    if (problems.length) { invalid.push({ file, name: bot.name, problems }); continue; }
    if (bots.has(bot.slug)) {
      if (!example) invalid.push({ file, name: bot.name, problems: [`Another bot already uses the slug "${bot.slug}".`] });
      continue;
    }
    bots.set(bot.slug, { ...bot, file, example, warnings, system: systemPrompt(bot, knowledgeText), knowledgeWords: countWords(knowledgeText) });
  }
  return { bots, invalid };
}

// Reload (with `load`) whenever a file in bots/, bots/knowledge/, or bots/_examples/ changes; `onChange` gets the
// new { bots, invalid }.
export function watchBots(dir, load, onChange) {
  let timer;
  const reload = () => { clearTimeout(timer); timer = setTimeout(() => onChange(load()), 250); };
  const watchers = [];
  for (const d of [dir, path.join(dir, "knowledge"), path.join(dir, "_examples")]) {
    try { watchers.push(fs.watch(d, reload)); } catch { /* the knowledge folder is optional */ }
  }
  return () => watchers.forEach(w => w.close());
}
