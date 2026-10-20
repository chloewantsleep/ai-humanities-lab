import { z } from "zod";
import { BotVoice, previewSystem } from "@/lib/custom-chatbot/schema";
import { makeClient } from "@/lib/poetry-gem/claude";

const Input = BotVoice.extend({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(8_000),
  })).min(1).max(20),
});

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 250_000) return Response.json({ error: "This conversation is too long. Start a fresh test." }, { status: 413 });
  let value: unknown;
  try { value = JSON.parse(raw); } catch { value = null; }
  const parsed = Input.safeParse(value);
  if (!parsed.success) return Response.json({ error: "Add instructions and a message within the length limits." }, { status: 400 });
  const conn = makeClient(req.headers.get("x-openrouter-key"));
  if (!conn) return Response.json({ error: "Add an OpenRouter key to test a reply. You can submit your bot without one." }, { status: 401 });
  const model = parsed.data.model || process.env.CUSTOM_CHATBOT_MODEL || conn.model;
  const system = previewSystem(parsed.data);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: unknown) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        send({ type: "context", system, model });
        const reply = conn.client.messages.stream({
          model, max_tokens: 1_200, system, messages: parsed.data.messages,
        }, { signal: req.signal });
        for await (const event of reply) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "text", delta: event.delta.text });
          }
        }
        const message = await reply.finalMessage();
        if (message.stop_reason === "refusal") send({ type: "error", error: "The model declined this request." });
      } catch {
        if (!req.signal.aborted) send({ type: "error", error: "The preview could not complete. Check your model and API key, then try again." });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}
