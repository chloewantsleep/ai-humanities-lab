import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { loadGenres, packChunks, packMeta, packText } from "@/lib/poetry-gem/content";
import { bm25 } from "@/lib/poetry-gem/search";
import { embed } from "@/lib/poetry-gem/embeddings";
import { nearest } from "@/lib/poetry-gem/vectors";
import { CONTEXT_WINDOW, PRICE, makeClient } from "@/lib/poetry-gem/claude";
import { DELIVERIES, MATERIALS, PACKS, type ChatEvent, type Passage, type SentPart, type Usage } from "@/lib/poetry-gem/options";

const Body = z.object({
  framingPrompt: z.string().trim().min(1).max(20_000).optional(),
  settings: z.object({
    genre: z.string(),
    pack: z.enum(PACKS),
    material: z.enum(MATERIALS),
    delivery: z.enum(DELIVERIES),
  }),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) }))
    .min(1)
    .max(40),
});

const SearchInput = z.object({ query: z.string().min(1) });
const MAX_TOOL_ROUNDS = 6;

const searchTool: Anthropic.Tool = {
  name: "search_pack",
  description:
    "Keyword (BM25) search over the context pack. Returns up to 5 passages that share words with the query. " +
    "Matching is exact-word: no synonyms or stemming, and translations may use older or unusual wording.",
  input_schema: {
    type: "object",
    properties: { query: { type: "string", description: "Words to look for in the pack." } },
    required: ["query"],
  },
};

function formatPassages(passages: { title: string; text: string }[]) {
  return passages.map((p) => `<passage title="${p.title}">\n${p.text}\n</passage>`).join("\n\n");
}

/** Lay out the final request (the input to the last model call) as ordered, labelled parts. */
function describeInput(
  system: string,
  packBlock: string,
  apiMessages: Anthropic.MessageParam[],
  originalCount: number,
  retrievedBlock: string,
): SentPart[] {
  const parts: SentPart[] = [{ kind: "instructions", label: "System prompt", text: system.replace(packBlock, "") }];
  if (packBlock) parts.push({ kind: "pack", label: "System prompt, continued: the context pack", text: packBlock.trim() });
  apiMessages.forEach((m, i) => {
    const current = i === originalCount - 1;
    const later = i >= originalCount; // tool rounds within this turn
    if (typeof m.content === "string") {
      if (m.role === "assistant") parts.push({ kind: "bot-before", label: "Bot (earlier)", text: m.content });
      else if (current && retrievedBlock && m.content.startsWith(retrievedBlock)) {
        parts.push({ kind: "retrieved", label: "You (attached by retrieval)", text: retrievedBlock.trim() });
        parts.push({ kind: "message", label: "You (now)", text: m.content.slice(retrievedBlock.length) });
      } else parts.push({ kind: current ? "message" : "you-before", label: current ? "You (now)" : "You (earlier)", text: m.content });
      return;
    }
    for (const b of m.content) {
      if (b.type === "text" && b.text.trim()) parts.push({ kind: later || m.role === "assistant" ? "bot-now" : "message", label: "Bot (this turn)", text: b.text });
      else if (b.type === "tool_use") parts.push({ kind: "search", label: "Bot calls a tool", text: `search_pack(${JSON.stringify(b.input)})` });
      else if (b.type === "tool_result") {
        const text = typeof b.content === "string" ? b.content : (b.content ?? []).map((c) => ("text" in c ? c.text : "")).join("\n");
        parts.push({ kind: "search", label: "Tool result, sent back as a user turn", text });
      }
    }
  });
  return parts;
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { settings, messages } = parsed.data;

  const genre = loadGenres().find((g) => g.id === settings.genre);
  if (!genre) return Response.json({ error: `Unknown genre ${settings.genre}` }, { status: 400 });

  const conn = makeClient(req.headers.get("x-openrouter-key"));
  if (!conn) {
    return Response.json(
      { error: "No API key. Set OPENROUTER_API_KEY in .env.local, or paste a key into the page." },
      { status: 401 },
    );
  }
  const { client, model } = conn;
  const hasPack = settings.pack !== "none";
  const meta = hasPack ? packMeta(settings.pack) : null;
  const voiceOf = meta?.voiceOf ?? "";
  const label = meta?.label ?? "";
  // the voice prompt describes the voice; the other levels hand over the text itself
  const what = settings.material === "voice" ? `a voice prompt describing ${label}` : `text from ${meta?.edition ?? label}`;

  // ---- Assemble what the model will see -------------------------------------------------------
  let system = parsed.data.framingPrompt ?? genre.prompt;
  let packBlock = "";
  let retrievedBlock = "";
  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({ role: m.role, content: m.content }));
  const tools: Anthropic.Tool[] = [];
  let injected: ChatEvent & { type: "context" } = { type: "context", system: "" };

  if (hasPack && settings.delivery === "full") {
    packBlock = `\n\n<context_pack source="${label}">\n${packText(settings.pack, settings.material)}\n</context_pack>`;
    system += `\n\nWrite in the voice and manner of ${voiceOf}. The context pack below (${what}) is your reference.` + packBlock;
  } else if (hasPack && (settings.delivery === "lexical" || settings.delivery === "semantic")) {
    system +=
      `\n\nWrite in the voice and manner of ${voiceOf}. Each user message may arrive with passages ` +
      `retrieved from a context pack (${what}); use them as reference.`;
    const last = messages[messages.length - 1];
    let hits: Passage[];
    if (settings.delivery === "lexical") {
      hits = bm25(packChunks(settings.pack, settings.material), last.content);
    } else {
      try {
        const [q] = await embed([last.content], req.headers.get("x-openrouter-key"));
        hits = nearest(settings.pack, settings.material, q);
      } catch (e) {
        return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
      }
    }
    const how = settings.delivery === "lexical" ? "Keyword search" : "Vector search";
    injected = {
      type: "context",
      system: "",
      injected: hits,
      note: hits.length
        ? `${how} on your message found ${hits.length} passage(s).`
        : `${how} found no passages sharing a word with your message, so nothing was added.`,
    };
    if (hits.length) {
      retrievedBlock = `<retrieved_passages>\n${formatPassages(hits)}\n</retrieved_passages>\n\n`;
      apiMessages[apiMessages.length - 1] = { role: "user", content: retrievedBlock + last.content };
    }
  } else if (hasPack && settings.delivery === "agentic") {
    system +=
      `\n\nWrite in the voice and manner of ${voiceOf}. You have a search_pack tool over a context pack ` +
      `(${what}). Search it if it would help.`;
    tools.push(searchTool);
  }
  injected.system = system;

  // ---- Stream the reply back as NDJSON ----------------------------------------------------------
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (e: ChatEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      const usage: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, calls: 0 };
      let lastRequestTokens = 0;
      send(injected);
      let emittedText = false;

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const stream = client.messages.stream({
            model,
            max_tokens: 16000,
            thinking: { type: "adaptive", display: "summarized" },
            // Cache the (possibly huge) system prompt so follow-up turns re-read it at ~10% of the price.
            system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
            messages: apiMessages,
            ...(tools.length ? { tools } : {}),
          });
          // Separate any preamble from before a tool call ("I'll search the pack…") from what follows.
          if (round > 0 && emittedText) send({ type: "text", delta: "\n\n" });
          for await (const ev of stream) {
            if (ev.type !== "content_block_delta") continue;
            if (ev.delta.type === "text_delta") {
              emittedText = true;
              send({ type: "text", delta: ev.delta.text });
            }
            else if (ev.delta.type === "thinking_delta") send({ type: "thinking", delta: ev.delta.thinking });
          }
          const msg = await stream.finalMessage();

          const u = msg.usage;
          usage.input += u.input_tokens;
          usage.output += u.output_tokens;
          usage.cacheRead += u.cache_read_input_tokens ?? 0;
          usage.cacheWrite += u.cache_creation_input_tokens ?? 0;
          usage.calls += 1;
          lastRequestTokens = u.input_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);

          if (msg.stop_reason === "refusal") {
            send({ type: "error", message: "The model declined this request." });
            break;
          }
          if (msg.stop_reason === "pause_turn") {
            apiMessages.push({ role: "assistant", content: msg.content });
            continue;
          }
          const toolUses = msg.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
          if (msg.stop_reason !== "tool_use" || !toolUses.length) break;
          if (round === MAX_TOOL_ROUNDS) {
            send({ type: "error", message: `Stopped after ${MAX_TOOL_ROUNDS} searches.` });
            break;
          }

          apiMessages.push({ role: "assistant", content: msg.content });
          const results: Anthropic.ToolResultBlockParam[] = toolUses.map((t) => {
            const input = SearchInput.safeParse(t.input);
            if (!input.success) {
              return { type: "tool_result", tool_use_id: t.id, is_error: true, content: "Expected {query: string}." };
            }
            const hits = bm25(packChunks(settings.pack, settings.material), input.data.query);
            send({ type: "tool_call", query: input.data.query, results: hits });
            return {
              type: "tool_result",
              tool_use_id: t.id,
              content: hits.length ? formatPassages(hits) : "No passages matched those words.",
            };
          });
          apiMessages.push({ role: "user", content: results });
        }
      } catch (err) {
        const message =
          err instanceof Anthropic.AuthenticationError
            ? "The API key was rejected."
            : err instanceof Anthropic.RateLimitError
              ? "Rate limited — wait a moment and try again."
              : err instanceof Anthropic.APIError
                ? `API error ${err.status ?? ""}: ${err.message}`
                : err instanceof Error
                  ? err.message
                  : String(err);
        send({ type: "error", message });
      }

      send({ type: "sent", parts: describeInput(system, packBlock, apiMessages, messages.length, retrievedBlock) });
      send({ type: "usage", usage, lastRequestTokens, model, contextWindow: CONTEXT_WINDOW, price: PRICE });
      controller.close();
    },
  });

  return new Response(body, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8" } });
}
