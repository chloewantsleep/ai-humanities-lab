import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { DEFAULT_CHAT_MODEL } from "../chat/route.js";
import { runAgent } from "./agent.mjs";
import { scriptedModel } from "./scripted-model.mjs";
import { readMemory, resetMemory, listSkills, listNotes } from "./workspace.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hasKey = () => Boolean(process.env.OPENROUTER_API_KEY?.trim());
const modelId = () => process.env.CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL;

// GET: the workspace as it is now, for the page to show before a run.
export async function GET() {
  return Response.json({ memory: await readMemory(), skills: await listSkills(), notes: await listNotes(), claude: { available: hasKey(), model: modelId() } });
}

// POST { task, engine: "claude" | "scripted" }: run the agent once and stream its trace, one JSON event per line.
export async function POST(request) {
  let task, engine;
  try {
    ({ task, engine = "claude" } = await request.json());
    if (typeof task !== "string" || !task.trim() || task.length > 4000 || !["claude", "scripted"].includes(engine)) throw new Error();
  } catch {
    return Response.json({ error: 'Expected { task: string (up to 4,000 characters), engine?: "claude" | "scripted" }.' }, { status: 400 });
  }
  if (engine === "claude" && !hasKey()) {
    return Response.json({ error: "OPENROUTER_API_KEY is missing. Set it in nextjs/.env.local and restart the dev server, or try the scripted stand-in." }, { status: 503 });
  }
  const model = engine === "scripted" ? scriptedModel : createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })(modelId());
  const modelName = engine === "scripted" ? scriptedModel.modelId : modelId();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const report = event => {
        try { controller.enqueue(encoder.encode(JSON.stringify({ ...event, at: Date.now() }) + "\n")); } catch { /* the page went away */ }
      };
      report({ type: "engine", engine, model: modelName });
      try {
        await runAgent({ task: task.trim(), model, report, abortSignal: request.signal });
      } catch (error) {
        // Don't pass raw provider errors through: they can echo request details.
        const aborted = request.signal.aborted;
        report({ type: "error", message: aborted ? "Stopped." : engine === "claude" ? "The model call failed. Check the key, CHAT_MODEL, OpenRouter balance, and connection." : String(error.message) });
        if (!aborted) console.error("[mini-claw]", error);
      }
      try { controller.close(); } catch { /* already closed */ }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

// Explicit reset affects only the demo working memory, never the tracked seed or notes.
export async function DELETE() {
  return Response.json({ memory: await resetMemory() });
}
