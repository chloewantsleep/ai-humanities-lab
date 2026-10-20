// Upload one short reference text for a bot: POST { name, text } writes bots/knowledge/<name>.md and returns the
// path to put in the bot's `knowledge:` field. GET lists what is there.
import { listKnowledge, saveKnowledge } from "../../../../lib/bots.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ knowledge: await listKnowledge() });
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, errors: ["Expected JSON: { name, text }."] }, { status: 400 });
  }
  if (typeof payload?.text !== "string") return Response.json({ ok: false, errors: ["Send the file's text as { name, text }."] }, { status: 400 });
  try {
    const result = await saveKnowledge(payload.name, payload.text);
    return Response.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    const readOnly = error?.code === "EROFS" || error?.code === "EACCES" || error?.code === "EPERM";
    return Response.json({ ok: false, errors: [readOnly ? "This copy of the app can't write files. Run it from the repo on your computer to attach a text." : `Saving failed: ${error?.message ?? error}`] }, { status: readOnly ? 403 : 500 });
  }
}
