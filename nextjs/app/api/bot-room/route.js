import { generateText, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { DEFAULT_MODEL, DIRECTOR_MODEL, costOf, directorPrompt, messagesFor, parseDirector } from "../../bot-room/room.mjs";

export const runtime = "nodejs";

// POST /api/bot-room
//   { kind: "turn", bot, bots, transcript, mode, task, draft, maxOutputTokens }  -> NDJSON: {type:"start", system, messages, model}, {type:"delta", text}…, {type:"done", usage, cost, finishReason}
//   { kind: "director", bots, transcript, mode, task }                           -> JSON { next: slug, why, raw, cost } (or { next: null, raw } when the answer couldn't be read)
// Each call is one paid request to OpenRouter. The route builds the messages itself, from room.mjs, so what the
// client shows as "what this bot received" is what was sent.
export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY?.trim()) {
    return Response.json({ error: "OPENROUTER_API_KEY is missing. Set it in nextjs/.env.local and restart the dev server." }, { status: 503 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Expected a JSON body." }, { status: 400 }); }
  const { kind, bots, transcript = [], mode = "conversation", task = "", draft = "" } = body;
  if (!Array.isArray(bots) || !bots.length || !Array.isArray(transcript)) return Response.json({ error: "Expected { bots: [...], transcript: [...] }." }, { status: 400 });
  const provider = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  // Reasoning off: with it on, Claude Haiku 5.5 spent the whole output budget thinking and returned empty text
  // (seen 2026-10-20, 12:27 UTC: 200 output tokens, no words). The room wants words, not deliberation.
  const settings = { reasoning: { enabled: false, effort: "none" } };
  const fallbackModel = process.env.CHAT_MODEL?.trim() || DEFAULT_MODEL;

  if (kind === "director") {
    const { system, prompt } = directorPrompt(bots, transcript, { mode, task });
    try {
      const result = await generateText({ model: provider(DIRECTOR_MODEL, settings), system, prompt, maxOutputTokens: 200, abortSignal: request.signal });
      const choice = parseDirector(result.text, bots);
      return Response.json({ next: choice?.bot.slug ?? null, why: choice?.why ?? "", raw: result.text, model: DIRECTOR_MODEL, usage: pick(result.usage), cost: costOf(DIRECTOR_MODEL, result.usage) });
    } catch (e) {
      return Response.json({ error: "The director's call failed. Check the key, the OpenRouter balance, and the connection." }, { status: 502 });
    }
  }

  if (kind !== "turn" || !body.bot?.system) return Response.json({ error: 'Expected kind "turn" with a bot, or kind "director".' }, { status: 400 });
  const bot = body.bot;
  const model = (typeof bot.model === "string" && bot.model.trim()) || fallbackModel;
  const { system, messages } = messagesFor(bot, bots, transcript, { mode, task, draft });
  const maxOutputTokens = Math.min(Math.max(Number(body.maxOutputTokens) || 300, 32), 1024);
  const encoder = new TextEncoder();
  const line = obj => encoder.encode(JSON.stringify(obj) + "\n");
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(line({ type: "start", model, system, messages }));
      try {
        const result = streamText({ model: provider(model, settings), system, messages, maxOutputTokens, abortSignal: request.signal });
        for await (const text of result.textStream) controller.enqueue(line({ type: "delta", text }));
        const usage = pick(await result.usage);
        controller.enqueue(line({ type: "done", usage, cost: costOf(model, usage), finishReason: await result.finishReason }));
      } catch (e) {
        controller.enqueue(line({ type: "error", message: request.signal.aborted ? "Stopped." : "The model call failed. Check the key, the OpenRouter balance, the model id, and the connection." }));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

const pick = u => (u ? { inputTokens: u.inputTokens ?? null, outputTokens: u.outputTokens ?? null, reasoningTokens: u.outputTokenDetails?.reasoningTokens ?? null } : null);
