// The room: who answers a message, and the guards that keep a channel of bots from talking itself into a loop.
// Transport-free: Slack (slack.mjs) and the simulated room (dry-run.mjs) both feed it messages shaped
//   { id, kind: "human" | "bot" | "other", name, slug?, text }
// where "bot" means one of ours, "other" any other app, and a thread is an array of them, oldest first.

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// "Socrates" for "Socrates, on writing": the name up to its first comma, colon, or parenthesis, when no other
// bot's name starts the same way.
function shortName(bot, bots) {
  const short = bot.name.split(/[,:(]/)[0].trim();
  if (short.length < 3 || short === bot.name) return "";
  const clash = [...bots.values()].some(b => b.slug !== bot.slug && b.name.toLowerCase().startsWith(short.toLowerCase()));
  return clash ? "" : short;
}

// The bots @-mentioned in a text, by name or slug, in order of first appearance. "@The Creature" and
// "@the-creature" both count; a bare name without @ doesn't (bots quote each other's names all the time).
export function findMentions(text, bots) {
  const found = [];
  for (const bot of bots.values()) {
    const names = [bot.name, bot.slug, shortName(bot, bots)].filter(Boolean).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(^|[^\\w])@(?:${names.map(escape).join("|")})(?![\\w-])`, "i");
    const match = pattern.exec(text);
    if (match) found.push({ slug: bot.slug, at: match.index, length: match[0].length });
  }
  // Where two names match at the same @ ("Socrates" inside "Socrates, on writing"), the longer one is meant.
  const kept = found.filter(f => !found.some(g => g !== f && g.at === f.at && g.length > f.length));
  return kept.sort((a, b) => a.at - b.at).map(f => f.slug);
}

export const botTurns = thread => thread.filter(m => m.kind === "bot").length;

// Bot messages since the last human one: the length of the current bot-to-bot chain.
export function botChain(thread) {
  let n = 0;
  for (let i = thread.length - 1; i >= 0 && thread[i].kind !== "human"; i--) if (thread[i].kind === "bot") n++;
  return n;
}

// Who answers `message`, the newest message of `thread` (thread includes it). Returns { responders, reason }.
export function decideResponders({ message, thread, bots, limits }) {
  const mentioned = findMentions(message.text ?? "", bots).filter(slug => slug !== message.slug);
  const cap = list => list.slice(0, limits.maxRespondersPerMessage);
  if (botTurns(thread) >= limits.maxThreadBotTurns) return { responders: [], reason: `the thread has reached ${limits.maxThreadBotTurns} bot replies` };

  if (message.kind === "human") {
    if (mentioned.length) return { responders: cap(mentioned), reason: "mentioned" };
    // A reply in a thread with no @-mention goes to the bot that spoke last there.
    const last = [...thread].reverse().find(m => m.kind === "bot" && bots.has(m.slug));
    if (thread.length > 1 && last) return { responders: [last.slug], reason: "thread" };
    return { responders: [], reason: "no bot addressed" };
  }

  if (message.kind === "bot") {
    if (!mentioned.length) return { responders: [], reason: "no bot addressed" };
    if (thread[0]?.kind !== "human") return { responders: [], reason: "bots answer each other only in a thread a human started" };
    if (botChain(thread) >= limits.maxBotChain) return { responders: [], reason: `${limits.maxBotChain} bot replies in a row; waiting for a human` };
    return { responders: cap(mentioned).slice(0, 1), reason: "mentioned by a bot" };
  }

  return { responders: [], reason: "other apps are ignored" };
}

// Replies per bot per minute and per hour, as sliding windows.
export class RateLimiter {
  constructor({ perBotPerMinute, perBotPerHour }) {
    this.limits = [[60_000, perBotPerMinute], [3_600_000, perBotPerHour]];
    this.history = new Map();
  }
  allow(slug, now = Date.now()) {
    const times = (this.history.get(slug) ?? []).filter(t => now - t < 3_600_000);
    const blocked = this.limits.find(([span, max]) => times.filter(t => now - t < span).length >= max);
    if (blocked) { this.history.set(slug, times); return false; }
    times.push(now);
    this.history.set(slug, times);
    return true;
  }
}

// The thread as the bot sees it: one user message holding the transcript, so the bot's own system prompt stays
// exactly as the student wrote it and any number of speakers fit any model.
export function transcriptFor(bot, thread, { bots, contextMessages }) {
  const recent = thread.slice(-contextMessages);
  const others = [...bots.values()].filter(b => b.slug !== bot.slug);
  const lines = recent.map(m => `${m.slug === bot.slug ? `${bot.name} (you)` : m.name}: ${m.text}`);
  return [
    `You are ${bot.name}, one of several bots in a Slack channel of the AI Humanities Lab Ensemble, alongside the students who made them.`,
    others.length ? `Other bots here: ${others.slice(0, 40).map(b => `${b.name}${b.description ? ` (${b.description})` : ""}`).join("; ")}. To address one, write @ and its name.` : "",
    thread.length > recent.length ? `(The ${thread.length - recent.length} oldest messages of the thread are left out.)` : "",
    "",
    "The thread so far:",
    ...lines,
    "",
    `Write ${bot.name}'s next message: just the message, in your own voice, without your name in front.`,
  ].filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
}

// Clean a model's reply for posting: drop a leading "Name:" the model added, and keep it Slack-sized.
export function cleanReply(bot, text) {
  let out = String(text ?? "").trim();
  for (const label of [bot.name, `${bot.name} (you)`, bot.slug]) {
    const prefix = new RegExp(`^[*_]*${escape(label)}[*_]*\\s*:[*_]*\\s*`, "i");
    out = out.replace(prefix, "");
  }
  return out.length > 3500 ? `${out.slice(0, 3500)}…` : out;
}

// The loop shared by both transports. `transport.fetchThread(threadId)` returns the thread (oldest first,
// including the message just posted); `transport.postAs(bot, threadId, text)` posts and returns the new message;
// `generate(bot, thread)` returns { text, model, usage }. Messages in one thread are handled one at a time.
export function createRoom({ getBots, limits, transport, generate, log }) {
  const rate = new RateLimiter(limits);
  const queues = new Map();

  async function respond(threadId, message, depth) {
    const bots = getBots();
    const thread = await transport.fetchThread(threadId);
    const { responders, reason } = decideResponders({ message, thread, bots, limits });
    if (!responders.length) {
      if (message.kind === "bot" && reason !== "no bot addressed") log({ type: "stopped", thread: threadId, after: message.slug, reason });
      return;
    }
    for (const slug of responders) {
      const bot = bots.get(slug);
      if (!rate.allow(slug)) { log({ type: "rate-limited", thread: threadId, bot: slug }); continue; }
      const current = await transport.fetchThread(threadId);
      // Named by a person but already heard from in the exchange that followed: don't answer twice.
      const since = message.id ? current.findIndex(m => m.id === message.id) : -1;
      if (message.kind === "human" && since >= 0 && current.slice(since + 1).some(m => m.slug === slug)) continue;
      let result;
      try {
        result = await generate(bot, current);
      } catch (error) {
        log({ type: "error", thread: threadId, bot: slug, error: error.message });
        continue;
      }
      const text = cleanReply(bot, result.text);
      if (!text) { log({ type: "empty", thread: threadId, bot: slug, model: result.model }); continue; }
      const posted = await transport.postAs(bot, threadId, text);
      log({ type: "reply", thread: threadId, bot: slug, name: bot.name, model: result.model, trigger: reason, in_reply_to: message.name, depth, text, usage: result.usage, ...(result.truncated ? { truncated: true } : {}) });
      await respond(threadId, posted, depth + 1);
    }
  }

  return {
    mentions: text => findMentions(text ?? "", getBots()).length > 0,
    // Handle a new message in a thread; resolves when every reply it set off has been posted.
    handle(threadId, message) {
      const previous = queues.get(threadId) ?? Promise.resolve();
      const next = previous.then(() => respond(threadId, message, 0)).catch(error => log({ type: "error", thread: threadId, error: error.message }));
      queues.set(threadId, next);
      next.finally(() => { if (queues.get(threadId) === next) queues.delete(threadId); });
      return next;
    },
  };
}
