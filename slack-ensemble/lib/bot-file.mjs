// Parse and check one bot file in the shared format (nextjs/bots/README.md): YAML-style frontmatter between ---
// lines, then the system prompt. No dependencies and no Node APIs, so the course app's /ensemble page can run the
// same checks in the browser before a student saves.
//
// The frontmatter is read as simple `key: value` lines (quoted or bare, with # comments), which is all the format
// uses. Anything fancier is reported as a problem rather than guessed at.
//
// The course app has its own reader of the same format (nextjs/lib/bots-format.mjs, task AA). This one stays here so
// the harness is self-contained; tests/agreement.test.mjs runs both on the same files so they accept and reject alike.

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
export const KNOWLEDGE_MARKER = "--- Reference text ---";
const KNOWN_FIELDS = ["name", "slug", "author", "model", "emoji", "icon_url", "description", "knowledge", "retrieval", "top_k"];
export const MAX_KNOWLEDGE_WORDS = 8000;
export const MAX_PROMPT_WORDS = 3000;
const MODEL_PATTERN = /^[a-z0-9][\w.-]*\/[\w.:-]+$/i;
const EMOJI_PATTERN = /^:[a-z0-9_+'-]+:$/i;

export function slugify(name) {
  return String(name ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function countWords(text) {
  return (String(text ?? "").match(/\S+/g) ?? []).length;
}

// A quoted value ends at its closing quote; a bare value ends at " #".
function parseValue(raw) {
  const value = raw.trim();
  if (value.startsWith('"')) {
    const match = value.match(/^"((?:[^"\\]|\\.)*)"\s*(?:#.*)?$/);
    if (!match) return { error: "has an opening \" with no closing \"" };
    try { return { value: JSON.parse(`"${match[1]}"`) }; } catch { return { value: match[1] }; }
  }
  if (value.startsWith("'")) {
    const match = value.match(/^'((?:[^']|'')*)'\s*(?:#.*)?$/);
    if (!match) return { error: "has an opening ' with no closing '" };
    return { value: match[1].replace(/''/g, "'") };
  }
  return { value: value.replace(/\s+#.*$/, "").trim() };
}

// Split a file into { data, body, problems }. Never throws.
export function parseFrontmatter(text) {
  const source = String(text ?? "").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const problems = [];
  const match = source.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/);
  if (!match) {
    problems.push("The file has to start with a line of three dashes (---), then the name: … lines, then another --- line, then the prompt.");
    return { data: {}, body: source.trim(), problems };
  }
  const data = {};
  match[1].split("\n").forEach((line, i) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const pair = line.match(/^([A-Za-z_][\w-]*)\s*:(.*)$/);
    if (!pair) { problems.push(`Frontmatter line ${i + 2} isn't "key: value": ${line.trim().slice(0, 60)}`); return; }
    const parsed = parseValue(pair[2]);
    if (parsed.error) { problems.push(`The value of "${pair[1]}" ${parsed.error}.`); return; }
    data[pair[1]] = parsed.value;
  });
  return { data, body: match[2].trim(), problems };
}

// Check a parsed bot against the format. `fileSlug` is the file's name without .md, when it has one.
// Returns { ok, bot, problems, warnings }: problems make the bot invalid; warnings are shown but allowed.
export function checkBot(text, { fileSlug } = {}) {
  const { data, body, problems } = parseFrontmatter(text);
  const warnings = [];
  const str = key => (typeof data[key] === "string" ? data[key].trim() : "");

  const name = str("name");
  if (!name) problems.push("It needs a name: line, e.g. name: \"The Creature\".");
  else if (name.length > 80) warnings.push("Slack shows only the first 80 characters of a name.");

  let slug = str("slug");
  if (!slug) {
    slug = fileSlug || slugify(name);
    if (name) warnings.push(`No slug: line, so it will be "${slug}".`);
  } else if (!SLUG_PATTERN.test(slug)) {
    problems.push(`The slug "${slug}" can only use lowercase letters, digits, and hyphens (e.g. ${slugify(slug) || "the-creature"}).`);
  }
  if (fileSlug && str("slug") && fileSlug !== slug) problems.push(`The slug "${slug}" doesn't match the file name "${fileSlug}.md": make them the same.`);

  if (!body) problems.push("There is no prompt: write the bot's voice and instructions below the second --- line.");
  else if (countWords(body) > MAX_PROMPT_WORDS) warnings.push(`The prompt is ${countWords(body)} words; keep it under ${MAX_PROMPT_WORDS} (put long texts in knowledge:).`);

  const model = str("model");
  if (model && !MODEL_PATTERN.test(model)) problems.push(`The model "${model}" doesn't look like an OpenRouter id (provider/model, e.g. anthropic/claude-haiku-5.5).`);

  const emoji = str("emoji");
  if (emoji && !EMOJI_PATTERN.test(emoji)) problems.push(`The emoji "${emoji}" should be a Slack code with colons, e.g. ":scroll:".`);
  const iconUrl = str("icon_url");
  if (iconUrl && !/^https:\/\/\S+$/.test(iconUrl)) problems.push("icon_url has to be an https:// address.");

  const knowledge = str("knowledge");
  if (knowledge && (knowledge.startsWith("/") || knowledge.split(/[\\/]/).includes("..") || !/\.(md|txt)$/i.test(knowledge))) {
    problems.push(`knowledge: must be a .md or .txt file inside bots/ (e.g. knowledge/${slug || "my-bot"}.md), not "${knowledge}".`);
  }

  if (/^true$/i.test(str("retrieval"))) warnings.push("retrieval: true is for /bot-lab; in Slack the knowledge text is pasted whole.");
  const unknown = Object.keys(data).filter(k => !KNOWN_FIELDS.includes(k));
  if (unknown.length) warnings.push(`Fields the format doesn't define are kept but ignored: ${unknown.join(", ")}.`);
  if (!str("author")) warnings.push("No author: line (your name).");
  if (!str("description")) warnings.push("No description: line (one line about the bot).");

  const bot = {
    ...data,
    name,
    slug,
    author: str("author"),
    description: str("description"),
    model: model || "",
    emoji: emoji || "",
    icon_url: iconUrl || "",
    knowledge: knowledge || "",
    prompt: body,
  };
  return { ok: problems.length === 0, bot, problems, warnings };
}

// The system prompt exactly as the format defines it: the body, then the knowledge text under a marker line.
export function systemPrompt(bot, knowledgeText) {
  const text = String(knowledgeText ?? "").replace(/\s+$/, "");
  return text.trim() ? `${bot.prompt}\n\n${KNOWLEDGE_MARKER}\n\n${text}` : bot.prompt;
}

// Write a bot back out as a file in the format (used when the submission page adds a knowledge: line).
export function formatBot(bot) {
  const keys = ["name", "slug", "author", "model", "emoji", "icon_url", "description", "knowledge"];
  const lines = keys.filter(k => bot[k]).map(k => `${k}: ${JSON.stringify(String(bot[k]))}`);
  return `---\n${lines.join("\n")}\n---\n\n${bot.prompt.trim()}\n`;
}
