import { Submission } from "@/lib/custom-chatbot/schema";
import { slugFor, submitBot, SubmissionError } from "@/lib/ensemble/submissions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const reply = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, error: "Send the submission as JSON." }, 415);
  }
  // The existing class-access proxy protects this route and rejects cross-origin writes.
  const reader = req.body?.getReader();
  if (!reader) return reply({ ok: false, error: "The submission is empty." }, 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 256 * 1024) {
        await reader.cancel();
        return reply({ ok: false, error: "This submission is too large." }, 413);
      }
      chunks.push(value);
    }
  } catch {
    return reply({ ok: false, error: "The submission could not be read. Please try again." }, 400);
  }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return reply({ ok: false, error: "The submission is not valid JSON." }, 400); }
  const parsed = Submission.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map(issue => [issue.path.join("."), issue.message]));
    return reply({ ok: false, error: "Check the highlighted fields and try again.", fields }, 400);
  }
  // ?dry=1 checks a submission against the schema and writes nothing: the build-a-bot watcher uses it as students
  // redesign the form (app/build-a-bot/).
  if (new URL(req.url).searchParams.get("dry") === "1") {
    return reply({ ok: true, dry: true, slug: slugFor(parsed.data.agentName), received: parsed.data }, 200);
  }
  try {
    return reply(await submitBot(parsed.data), 200);
  } catch (error) {
    return reply({
      ok: false,
      error: error instanceof SubmissionError ? error.message : "Your bot could not be saved. Please try again.",
    }, error instanceof SubmissionError ? error.status : 500);
  }
}
