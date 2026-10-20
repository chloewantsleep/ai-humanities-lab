// The bot room's logic, with no React or server code, so tests/bot-room.test.mjs can run it in Node.
// Reading and writing bot files is AA's lib/bots.mjs and lib/bots-format.mjs (the shared format); this module is the room.

export const HOST = "Host";

// OpenRouter prices in dollars per million tokens, read from https://openrouter.ai/api/v1/models on 2026-10-20.
// Used for the running cost estimate; the real charge is whatever OpenRouter bills.
export const MODELS = [
  { id: "anthropic/claude-sonnet-5.5", label: "Claude Sonnet 5.5", input: 2, output: 10 },
  { id: "anthropic/claude-haiku-5.5", label: "Claude Haiku 5.5 (cheap)", input: 0.1, output: 0.5 },
  { id: "openai/gpt-5-mini", label: "GPT-5 mini", input: 0.25, output: 2 },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", input: 0.3, output: 2.5 },
  { id: "mistralai/mistral-small-3.2-24b-instruct", label: "Mistral Small 3.2 (open weights)", input: 0.09375, output: 0.25 },
];
export const DEFAULT_MODEL = "anthropic/claude-sonnet-5.5";
export const DIRECTOR_MODEL = "anthropic/claude-haiku-5.5";

export function priceOf(modelId) {
  return MODELS.find(m => m.id === modelId) ?? null;
}

// Dollars for one call, or null when the model's price isn't in the table.
export function costOf(modelId, usage) {
  const p = priceOf(modelId);
  if (!p || !usage) return null;
  return ((usage.inputTokens ?? 0) * p.input + (usage.outputTokens ?? 0) * p.output) / 1e6;
}

// The room note appended to a bot's own system prompt, so it speaks only as itself.
export function roomNote(bot, bots, { mode, task }) {
  const others = bots.filter(b => b.slug !== bot.slug).map(b => b.name);
  const who = others.length ? `The other speakers are ${others.join(" and ")}.` : "You are the only speaker.";
  const base = `\n\n--- The room ---\nYou are ${bot.name}, in a conversation with other speakers. ${who} Their words reach you as messages labeled with their names; a message labeled "${HOST}" is from the person running the room. Speak only as ${bot.name}, in your own voice, and never write the others' lines or label your own. Keep each turn short, a few sentences, as in conversation.`;
  if (mode !== "together") return base;
  return `${base}\n\nThe speakers are working together on one task: ${task || "(no task given)"}. When you have something to contribute to the shared draft, write the whole revised draft FIRST, between the lines <draft> and </draft>, and only then add a sentence or two of comment; otherwise discuss briefly. The latest draft is sent to you with each turn.`;
}

// Exactly what a bot receives for its turn: its system prompt (plus the room note) and the transcript, with its own
// earlier turns as the assistant and everyone else's merged into user messages labeled by name.
export function messagesFor(bot, bots, transcript, options = {}) {
  const system = bot.system + roomNote(bot, bots, options);
  const messages = [];
  let pending = [];
  const flush = () => { if (pending.length) { messages.push({ role: "user", content: pending.join("\n\n") }); pending = []; } };
  for (const turn of transcript) {
    if (turn.slug === bot.slug) { flush(); messages.push({ role: "assistant", content: turn.text }); }
    else pending.push(`${turn.name}: ${turn.text}`);
  }
  if (options.mode === "together" && options.draft) pending.push(`${HOST}: The shared draft so far:\n<draft>\n${options.draft}\n</draft>`);
  if (!pending.length && messages.at(-1)?.role === "assistant") pending.push(`${HOST}: (It is your turn again.)`);
  if (!pending.length && !messages.length) pending.push(`${HOST}: (The room is open. Begin.)`);
  flush();
  return { system, messages };
}

// Round-robin: the speaker after the last one, in the order the bots were chosen.
export function nextRoundRobin(bots, transcript) {
  const last = [...transcript].reverse().find(t => bots.some(b => b.slug === t.slug));
  if (!last) return bots[0];
  const i = bots.findIndex(b => b.slug === last.slug);
  return bots[(i + 1) % bots.length];
}

// What the director is asked, and how its answer is read.
export function directorPrompt(bots, transcript, options = {}) {
  const roster = bots.map(b => `- ${b.slug}: ${b.name}${b.description ? `, ${b.description}` : ""}`).join("\n");
  const lines = transcript.map(t => `${t.name}: ${t.text}`).join("\n\n") || "(nothing yet)";
  const goal = options.mode === "together" ? `They are working together on this task: ${options.task || "(none)"}.` : "They are in conversation.";
  return {
    system: `You direct a conversation between these speakers:\n${roster}\n${goal}\nChoose who should speak next so the exchange stays lively and balanced: someone who has been addressed, has something to answer, or has been quiet. Answer with JSON only, on one line: {"next": "<slug>", "why": "<one short sentence>"}.`,
    prompt: `Transcript so far:\n\n${lines}\n\nWho speaks next?`,
  };
}

export function parseDirector(text, bots) {
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const { next, why } = JSON.parse(match[0]);
    const bot = bots.find(b => b.slug === next) ?? bots.find(b => b.name.toLowerCase() === String(next).toLowerCase());
    return bot ? { bot, why: String(why ?? "").trim() } : null;
  } catch { return null; }
}

// The latest draft a reply carries, if any. A draft cut off by the token limit (no closing tag) still counts: it is
// what the others will be sent, and the panel shows it ended mid-sentence.
export function extractDraft(text) {
  const closed = String(text).match(/<draft>\s*([\s\S]*?)\s*<\/draft>/i);
  if (closed) return closed[1].trim();
  const open = String(text).match(/<draft>\s*([\s\S]+)$/i);
  return open ? open[1].trim() : null;
}

// Bots sometimes label their own line ("Victor: …") despite the room note; the label is not part of the speech.
export function stripSelfLabel(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(text).replace(new RegExp(`^\\s*\\**${escaped}\\**:\\**\\s*`, "i"), "");
}

// A rough estimate before running: the tokens each turn will send grow with the transcript.
export function estimateRun(bots, turns, { avgReplyTokens = 120, baseTokens = 400 } = {}) {
  let dollars = 0, unknown = false;
  if (!bots.length) return { dollars, unknown };
  for (let i = 0; i < turns; i++) {
    const bot = bots[i % bots.length];
    const p = priceOf(bot.model || DEFAULT_MODEL);
    if (!p) { unknown = true; continue; }
    const inputTokens = baseTokens + Math.ceil(bot.system.length / 4) + i * avgReplyTokens;
    dollars += (inputTokens * p.input + avgReplyTokens * p.output) / 1e6;
  }
  return { dollars, unknown };
}
