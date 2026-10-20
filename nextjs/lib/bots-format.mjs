// The bot format, nextjs/bots/README.md, as code that runs anywhere (browser or Node): parse a bot file, validate it
// with readable errors, write it back out, and build the exact messages a model is sent. No file system here; the
// reading and saving of files is in lib/bots.mjs, which re-exports everything in this module.
//
// A bot file is YAML-ish frontmatter (one `key: value` per line, strings only) and then the system prompt, verbatim.

export const DEFAULT_MODEL = "anthropic/claude-sonnet-5.5"; // the app's default, as in app/api/chat/route.js

// The frontmatter fields the format defines, in the order they are written out. Anything else is kept in `extra`.
export const BOT_FIELDS = ["name", "slug", "author", "model", "emoji", "icon_url", "description", "knowledge"];

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
export const MODEL_PATTERN = /^[a-z0-9][\w.-]*\/[\w.:-]+$/i; // vendor/name, as OpenRouter ids are written
export const EMOJI_PATTERN = /^:[a-z0-9_+'-]+:$/; // Slack's :shortcode: form

export const KNOWLEDGE_MARKER = "--- Reference text ---";
export const KNOWLEDGE_WORD_LIMIT = 8000; // the format says "under ~8,000 words"; over it is an error, near it a warning

/** "The Creature" -> "the-creature". */
export function slugify(text = "") {
  return String(text).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

// One frontmatter value: `"quoted"`, `'quoted'`, or bare, with a trailing `# comment` allowed outside quotes.
function parseScalar(raw) {
  const text = raw.trim();
  if (!text) return "";
  const quote = text[0];
  if (quote === '"' || quote === "'") {
    let out = "";
    for (let i = 1; i < text.length; i++) {
      const ch = text[i];
      if (quote === '"' && ch === "\\" && i + 1 < text.length) {
        const next = text[++i];
        out += next === "n" ? "\n" : next === "t" ? "\t" : next;
      } else if (ch === quote) {
        if (quote === "'" && text[i + 1] === "'") { out += "'"; i++; continue; } // '' is an escaped quote in YAML
        return out; // whatever follows the closing quote (a comment) is ignored
      } else out += ch;
    }
    return out; // unterminated quote: take it as written
  }
  return text.replace(/\s+#.*$/, "").trim();
}

function quote(value) {
  return JSON.stringify(String(value)); // a JSON string is a valid YAML double-quoted string for everything we write
}

/**
 * Parse a bot file's text. Returns { ok, bot, errors, warnings }: `bot` is always filled in as far as the text allows,
 * so an editor can show it; `errors` says, in words, what makes it invalid. `slug` (optional) is the file's name
 * without `.md`, checked against the frontmatter.
 */
export function parseBotFile(text, { slug: fileSlug, source = null, example = false } = {}) {
  const normalized = String(text ?? "").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const fields = {};
  const extra = {};
  const errors = [];
  const warnings = [];
  let body = normalized;

  const match = normalized.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (match) {
    body = normalized.slice(match[0].length);
    for (const [index, line] of match[1].split("\n").entries()) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      const pair = line.match(/^([A-Za-z_][\w-]*)\s*:\s?(.*)$/);
      if (!pair) { errors.push(`Frontmatter line ${index + 2} isn't "key: value": ${JSON.stringify(line)}`); continue; }
      const [, key, raw] = pair;
      const value = parseScalar(raw);
      if (BOT_FIELDS.includes(key)) fields[key] = value; else extra[key] = value;
    }
  } else if (normalized.trimStart().startsWith("---")) {
    errors.push("The frontmatter starts with --- but never closes with a second --- line.");
  } else {
    errors.push("No frontmatter: the file must start with a --- line, then name: and the other fields, then --- again.");
  }

  const bot = {
    name: fields.name ?? "",
    slug: fields.slug || fileSlug || slugify(fields.name ?? ""),
    author: fields.author ?? "",
    model: fields.model ?? "",
    emoji: fields.emoji ?? "",
    icon_url: fields.icon_url ?? "",
    description: fields.description ?? "",
    knowledge: fields.knowledge ?? "",
    body: body.replace(/^\n+/, "").replace(/\s+$/, ""),
    extra,
    source,
    example,
  };

  if (!bot.name.trim()) errors.push("The bot has no name: add a line like name: \"The Creature\" in the frontmatter.");
  if (!bot.body.trim()) errors.push("The system prompt is empty: write the bot's voice and instructions below the second --- line.");
  if (!bot.slug) errors.push("The bot has no slug: add slug: \"the-creature\" (lowercase letters, digits, hyphens).");
  else if (!SLUG_PATTERN.test(bot.slug)) errors.push(`The slug "${bot.slug}" must be lowercase letters, digits, and hyphens, starting with a letter or digit.`);
  else if (fileSlug && fields.slug && fields.slug !== fileSlug) errors.push(`The slug "${fields.slug}" doesn't match the file name "${fileSlug}.md": make them the same.`);
  if (!fields.slug && fileSlug == null && bot.slug) warnings.push(`No slug given; "${bot.slug}" was made from the name.`);
  if (bot.model && !MODEL_PATTERN.test(bot.model)) errors.push(`The model "${bot.model}" doesn't look like an OpenRouter id (vendor/name, like anthropic/claude-sonnet-5.5).`);
  if (bot.emoji && !EMOJI_PATTERN.test(bot.emoji)) errors.push(`The emoji "${bot.emoji}" should be a Slack shortcode like :zombie: (colons, lowercase, underscores).`);
  if (bot.icon_url && !/^https:\/\//.test(bot.icon_url)) errors.push("icon_url must start with https://");
  if (bot.knowledge && (bot.knowledge.startsWith("/") || bot.knowledge.split(/[\\/]/).includes(".."))) errors.push(`knowledge must be a path inside bots/, like knowledge/the-creature.md, not "${bot.knowledge}".`);
  if (Object.keys(extra).length) warnings.push(`Fields the format doesn't define are kept but ignored: ${Object.keys(extra).join(", ")}.`);

  return { ok: errors.length === 0, bot, errors, warnings };
}

/** The same checks for a bot object (as the editor holds it) rather than a file's text. */
export function validateBot(bot) {
  return parseBotFile(serializeBotFile(bot), { slug: bot.slug || undefined });
}

/** Write a bot back out as a file in the format. Empty optional fields are left out. */
export function serializeBotFile(bot) {
  const lines = ["---"];
  for (const key of BOT_FIELDS) {
    const value = bot[key];
    if (value == null || String(value).trim() === "") continue;
    lines.push(`${key}: ${quote(String(value).trim())}`);
  }
  for (const [key, value] of Object.entries(bot.extra ?? {})) {
    if (!BOT_FIELDS.includes(key) && value != null && String(value).trim() !== "") lines.push(`${key}: ${quote(String(value).trim())}`);
  }
  lines.push("---", "", String(bot.body ?? "").replace(/\s+$/, ""), "");
  return lines.join("\n");
}

export function countWords(text = "") {
  return String(text).split(/\s+/).filter(Boolean).length;
}

/** Problems with a knowledge text's size, as readable strings (empty if fine). */
export function checkKnowledge(text = "") {
  const words = countWords(text);
  if (words > KNOWLEDGE_WORD_LIMIT) return [`The reference text is ${words.toLocaleString()} words; the format allows one short text under about ${KNOWLEDGE_WORD_LIMIT.toLocaleString()}. Cut it down, or use /retrieval for long texts.`];
  return [];
}

/**
 * The system prompt the model gets: the body as written, then, if there is a reference text, the marker line and the
 * whole text. `knowledgeText` is the loaded file (lib/bots.mjs loads it; the editor passes what it has).
 */
export function buildSystemPrompt(bot, knowledgeText = bot?.knowledgeText) {
  const body = String(bot?.body ?? "").replace(/\s+$/, "");
  if (!knowledgeText || !String(knowledgeText).trim()) return body;
  return `${body}\n\n${KNOWLEDGE_MARKER}\n\n${String(knowledgeText).replace(/\s+$/, "")}`;
}

/**
 * The exact messages for a chat-completions call: a system message, then the conversation so far as
 * [{ role: "user" | "assistant", content }]. Other roles and empty turns are dropped.
 */
export function buildMessages(bot, history = [], { knowledgeText } = {}) {
  const system = buildSystemPrompt(bot, knowledgeText);
  const turns = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && String(m.content ?? "").trim())
    .map((m) => ({ role: m.role, content: String(m.content) }));
  return system ? [{ role: "system", content: system }, ...turns] : turns;
}

/** The whole request: which model (the bot's, else the default) and the messages. */
export function buildRequest(bot, history = [], { defaultModel = DEFAULT_MODEL, knowledgeText, model } = {}) {
  return { model: model || bot?.model || defaultModel, messages: buildMessages(bot, history, { knowledgeText }) };
}
