// The bot lab's file API: GET lists the bots in bots/ and bots/_examples/ (with their text, errors, and loaded
// knowledge text) and the knowledge files available; POST saves a bot as bots/<slug>.md. Reading and writing go
// through lib/bots.mjs, the same reader the Slack Ensemble (task O) imports.
import { listBots, listKnowledge, saveBot, DEFAULT_MODEL } from "../../../../lib/bots.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [bots, knowledge] = await Promise.all([listBots(), listKnowledge()]);
  return Response.json({ bots, knowledge, defaultModel: process.env.CHAT_MODEL?.trim() || DEFAULT_MODEL });
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, errors: ["Expected JSON: { bot: {...} } or { text: \"---\\nname: ...\" }."] }, { status: 400 });
  }
  const input = typeof payload?.text === "string" ? payload.text : payload?.bot;
  if (!input) return Response.json({ ok: false, errors: ["Send { bot } (the fields and body) or { text } (a whole bot file)."] }, { status: 400 });
  try {
    const result = await saveBot(input, { overwrite: payload?.overwrite !== false });
    return Response.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    const readOnly = error?.code === "EROFS" || error?.code === "EACCES" || error?.code === "EPERM";
    return Response.json({ ok: false, errors: [readOnly ? "This copy of the app can't write files (it isn't running from the repo on your computer). Download the bot file instead and put it in nextjs/bots/." : `Saving failed: ${error?.message ?? error}`] }, { status: readOnly ? 403 : 500 });
  }
}
