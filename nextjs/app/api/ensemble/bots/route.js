import { parseBotFile, resolveKnowledge, saveBot, saveKnowledge } from "../../../../lib/bots.mjs";

export const runtime = "nodejs";

// POST { text, knowledge?, replace? }: check a submitted bot file against the format and save it to bots/<slug>.md,
// where the Ensemble's harness picks it up. `knowledge` is the text of its one short reference text, if it has one;
// it is saved to bots/knowledge/<slug>.md and the file's knowledge: line set to match.
export async function POST(request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.text !== "string") return Response.json({ ok: false, errors: ["Send { text } with the bot file's text."] }, { status: 400 });
  if (payload.text.length > 200_000 || String(payload.knowledge ?? "").length > 400_000) return Response.json({ ok: false, errors: ["That is far too long for a bot file."] }, { status: 413 });

  const parsed = parseBotFile(payload.text);
  if (!parsed.ok) return Response.json({ ok: false, errors: parsed.errors, warnings: parsed.warnings });
  const bot = parsed.bot;

  if (String(payload.knowledge ?? "").trim()) {
    const saved = await saveKnowledge(bot.slug, payload.knowledge);
    if (!saved.ok) return Response.json({ ok: false, errors: saved.errors, warnings: parsed.warnings });
    bot.knowledge = saved.path;
  } else if (bot.knowledge && !(await resolveKnowledge(bot))) {
    return Response.json({ ok: false, warnings: parsed.warnings, errors: [`The file names a knowledge text (${bot.knowledge}) that isn't on this computer. Paste the text into "One short text" below, or remove the knowledge: line.`] });
  }

  const result = await saveBot(bot, { overwrite: payload.replace === true });
  return Response.json({ ...result, exists: !result.ok && /already a bot/.test(result.errors.join(" ")) });
}
