import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Two ways to reach Claude, both through the official Anthropic SDK:
//   OPENROUTER_API_KEY  → OpenRouter's Anthropic-compatible endpoint (model ids are "anthropic/…")
//   ANTHROPIC_API_KEY   → Anthropic directly
// A key typed into the page (sent as x-openrouter-key) overrides the server's key for that request.

const OPENROUTER_BASE = "https://openrouter.ai/api";

export function makeClient(userKey?: string | null) {
  const orKey = userKey || process.env.OPENROUTER_API_KEY;
  if (orKey) {
    return {
      client: new Anthropic({ baseURL: OPENROUTER_BASE, authToken: orKey, apiKey: null }),
      model: process.env.MODEL ?? "anthropic/claude-opus-5",
    };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { client: new Anthropic(), model: process.env.MODEL ?? "claude-opus-5" };
  }
  return null;
}

// For the gauge and the cost readout. Defaults are Claude Opus 5 list prices (USD per million tokens).
export const CONTEXT_WINDOW = Number(process.env.CONTEXT_WINDOW ?? 1_000_000);
export const PRICE = {
  input: Number(process.env.PRICE_INPUT_PER_M ?? 5),
  output: Number(process.env.PRICE_OUTPUT_PER_M ?? 25),
};
