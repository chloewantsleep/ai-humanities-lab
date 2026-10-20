import { transcriptFor } from "./room.mjs";

const API = "https://openrouter.ai/api/v1";

// OpenRouter's model list (public, no key), fetched once, for checking each bot's model before it costs anything.
let catalog;
export async function loadCatalog() {
  if (catalog) return catalog;
  try {
    const res = await fetch(`${API}/models`, { signal: AbortSignal.timeout(15_000) });
    const { data } = await res.json();
    catalog = new Map(data.map(m => [m.id, { outputPerMillion: Number(m.pricing?.completion ?? 0) * 1e6 }]));
  } catch {
    catalog = null; // offline: models are used as written
  }
  return catalog;
}

// The model a bot will actually use, and why, given the spending settings.
export function resolveModel(bot, settings, models = catalog) {
  const wanted = bot.model || settings.defaultModel;
  const fallback = note => ({ model: settings.defaultModel, note });
  if (settings.allowedModels.length && !settings.allowedModels.includes(wanted)) return fallback(`${wanted} isn't on this room's list of models; using ${settings.defaultModel}`);
  if (models && !models.has(wanted)) return fallback(`OpenRouter has no model called ${wanted}; using ${settings.defaultModel}`);
  const price = models?.get(wanted)?.outputPerMillion;
  if (price > settings.maxOutputPrice) return fallback(`${wanted} costs $${price.toFixed(2)} per million output tokens, over this room's $${settings.maxOutputPrice}; using ${settings.defaultModel}`);
  return { model: wanted, note: "" };
}

// One reply from a bot, given the thread. Returns { text, model, usage }.
export function createGenerator({ settings, getBots, contextMessages, fake }) {
  return async function generate(bot, thread) {
    const { model } = resolveModel(bot, settings);
    const transcript = transcriptFor(bot, thread, { bots: getBots(), contextMessages });
    if (fake) {
      const last = thread.at(-1);
      const others = [...getBots().values()].filter(b => b.slug !== bot.slug);
      // In fake mode every other reply passes the conversation to another bot, so the loop guard gets exercised.
      const pass = others.length && thread.length % 2 === 0 ? ` What do you think, @${others[thread.length % others.length].name}?` : "";
      return { text: `(fake reply) ${bot.name} heard ${last.name} say "${last.text.replace(/@/g, "").slice(0, 60)}".${pass}`, model: `fake (${model})`, usage: null };
    }
    if (!settings.apiKey) throw new Error("OPENROUTER_API_KEY is missing in slack-ensemble/.env");
    const res = await fetch(`${API}/chat/completions`, {
      method: "POST",
      headers: { authorization: `Bearer ${settings.apiKey}`, "content-type": "application/json", "x-title": "AI Humanities Lab Ensemble" },
      body: JSON.stringify({
        model,
        messages: [...(bot.system ? [{ role: "system", content: bot.system }] : []), { role: "user", content: transcript }],
        max_tokens: settings.maxTokens,
        ...(settings.reasoning && settings.reasoning !== "default" ? { reasoning: { effort: settings.reasoning, exclude: true } } : {}),
        usage: { include: true },
      }),
      signal: AbortSignal.timeout(90_000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.error) throw new Error(`OpenRouter ${res.status}: ${body.error?.message ?? "request failed"}`);
    const choice = body.choices?.[0];
    return { text: choice?.message?.content ?? "", model: body.model ?? model, usage: body.usage ?? null, truncated: choice?.finish_reason === "length" };
  };
}
