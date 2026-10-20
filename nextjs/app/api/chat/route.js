import { convertToModelMessages, validateUIMessages, streamText, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const runtime = "nodejs";
export const DEFAULT_CHAT_MODEL = "anthropic/claude-sonnet-5.5";
const MODEL_ID = /^[a-z0-9][\w.-]*\/[\w.:-]+$/i;

export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY?.trim()) {
    return Response.json({ error: "OPENROUTER_API_KEY is missing. Set it in nextjs/.env.local and restart the dev server." }, { status: 503 });
  }
  let system, messages, requestedModel;
  try {
    const body = await request.json();
    system = body.system ?? "";
    // Optional model override (task AA's selector): `model` in the body, or `?model=` on the URL for callers whose
    // body is fixed (the shared ChatShell sends only { system, messages }). Must look like an OpenRouter id.
    requestedModel = typeof body.model === "string" ? body.model : new URL(request.url).searchParams.get("model") ?? "";
    if (requestedModel && !MODEL_ID.test(requestedModel)) throw new Error();
    if (typeof system !== "string" || !Array.isArray(body.messages) || !body.messages.length) throw new Error();
    const uiMessages = await validateUIMessages({ messages: body.messages });
    // This endpoint has no tools or attachment loader. Keep its contract explicit.
    if (uiMessages.some(m => !["user", "assistant"].includes(m.role) || m.parts.some(p => !["text", "step-start"].includes(p.type)))) throw new Error();
    messages = await convertToModelMessages(uiMessages);
  } catch {
    return Response.json({ error: "Expected { system?: string, messages: UIMessage[], model?: \"vendor/name\" } with user/assistant text parts. Tools and attachments require a separate route." }, { status: 400 });
  }
  const model = requestedModel || process.env.CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL;
  const provider = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "data-request", data: { engine: "openrouter", model, system, messages }, transient: true });
      const result = streamText({ model: provider(model), system, messages, abortSignal: request.signal, maxOutputTokens: 2048 });
      writer.merge(result.toUIMessageStream({ onError: () => `The request to ${model} failed. Check the server key, the model id, OpenRouter balance, and connection.` }));
    },
    onError: () => `The request to ${model} failed. Check the server key, the model id, OpenRouter balance, and connection.`,
  });
  return createUIMessageStreamResponse({ stream });
}
