// The model selector's list. Ids and prices (US dollars per million tokens, in / out) were checked against
// OpenRouter's public catalog, https://openrouter.ai/api/v1/models, on 2026-10-20; prices change, so treat them as
// that day's. The default is the app's (app/api/chat/route.js).
export const MODELS_CHECKED = "2026-10-20";

export const MODEL_GROUPS = [
  {
    label: "Assistants (instruction-tuned chat models)",
    models: [
      { id: "anthropic/claude-sonnet-5.5", name: "Claude Sonnet 5.5", note: "Anthropic; the app's default. $2 / $10." },
      { id: "anthropic/claude-haiku-5.5", name: "Claude Haiku 5.5", note: "Anthropic's small, fast model. $0.10 / $0.50." },
      { id: "openai/gpt-5.1", name: "GPT-5.1", note: "OpenAI. $1.25 / $10." },
      { id: "openai/gpt-5-mini", name: "GPT-5 mini", note: "OpenAI's small model. $0.25 / $2." },
      { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", note: "Google's fast model. $0.30 / $2.50." },
      { id: "meta-llama/llama-4-maverick", name: "Llama 4 Maverick", note: "Meta; open weights. $0.19 / $0.65." },
      { id: "mistralai/mistral-small-3.2-24b-instruct", name: "Mistral Small 3.2 (24B)", note: "Mistral; a small open model. $0.09 / $0.25." },
      { id: "deepseek/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash", note: "Open weights; the cheapest here. $0.06 / $0.12." },
    ],
  },
];

export const OTHER_MODEL = "__other__";

// Base models: checked 2026-10-20. OpenRouter's catalog (470 models that day) had no pretrained, non-instruct model:
// nothing named "(base)", no completion-only Llama or Mixtral base. The contrast Shanahan draws (a base model
// continues text; an assistant is a role the text is steered into) is on this site at /spiral (GPT-2, a base model
// in the browser) and /by-hand (the same base model turned into an assistant by a prompt).
export const BASE_MODELS_NOTE = "No base model: OpenRouter served no pretrained, non-instruct model on 2026-10-20. For the contrast, see /spiral (GPT-2 running in the browser) and /by-hand.";

export function describeModel(id) {
  for (const group of MODEL_GROUPS) for (const m of group.models) if (m.id === id) return m;
  return null;
}
