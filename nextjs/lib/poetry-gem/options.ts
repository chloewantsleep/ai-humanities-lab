// Shared between client and server: the knobs a student can turn.

// Knowledge packs built from the course readings (scripts/build-packs.py), plus a no-pack baseline.
export const PACKS = ["phaedrus", "frankenstein", "analects", "none"] as const;
export type PackId = (typeof PACKS)[number];

// How much of the reading goes in: a voice prompt describing it, then ever more of the text itself.
export const MATERIALS = ["voice", "assigned", "more", "whole"] as const;
export type Material = (typeof MATERIALS)[number];
export type TextLevel = Exclude<Material, "voice">;

export const DELIVERIES = ["full", "lexical", "semantic", "agentic"] as const;
export type Delivery = (typeof DELIVERIES)[number];

export type Settings = {
  genre: string; // a file name in content/prompts, minus .md
  pack: PackId;
  material: Material;
  delivery: Delivery;
};

export const PACK_LABELS: Record<PackId, string> = {
  phaedrus: "Plato, Phaedrus",
  frankenstein: "Shelley, Frankenstein",
  analects: "Confucius, Analects",
  none: "No pack (baseline)",
};

/** Generic names for the levels; each pack's pack.json gives its own specifics ("Ch. 10–15"). */
export const MATERIAL_LABELS: Record<Material, { label: string; blurb: string }> = {
  voice: { label: "Voice prompt", blurb: "A short description of the source's style." },
  assigned: { label: "Assigned", blurb: "The assigned reading." },
  more: { label: "More", blurb: "More of the text." },
  whole: { label: "Whole", blurb: "The full book, including editorial material." },
};

/** What the browser needs to know about each pack (labels per level, sizes). */
export type PackInfo = {
  label: string;
  edition: string;
  levels: Record<Material, { label: string; blurb: string; chars: number; approxTokens: number; passages: number }>;
};

export const DELIVERY_LABELS: Record<Delivery, { label: string; blurb: string }> = {
  full: {
    label: "Whole pack",
    blurb: "Send all selected material with each message. Longer texts use more input tokens.",
  },
  lexical: {
    label: "Keyword retrieval",
    blurb: "Find passages that match words in your message. Send the highest-ranked matches.",
  },
  semantic: {
    label: "Meaning-based retrieval",
    blurb: "Find passages with meanings similar to your message. Send the highest-ranked matches.",
  },
  agentic: {
    label: "Model searches",
    blurb: "Let the model choose whether to search the source text and what to search for.",
  },
};

export type Usage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  calls: number;
};

// Events streamed from /api/chat as newline-delimited JSON.
export type ChatEvent =
  | { type: "context"; system: string; injected?: Passage[]; note?: string }
  | { type: "thinking"; delta: string }
  | { type: "text"; delta: string }
  | { type: "tool_call"; query: string; results: Passage[] }
  | { type: "usage"; usage: Usage; lastRequestTokens: number; model: string; contextWindow: number; price: { input: number; output: number } }
  | { type: "sent"; parts: SentPart[] }
  | { type: "error"; message: string };

/**
 * One piece of the single input the model received, in order. Each turn re-sends all of it:
 * the "conversation" is one growing document, not a series of separate turns.
 */
export type SentPartKind =
  | "instructions" // the system prompt you chose
  | "pack" // a whole context pack pasted into the system prompt
  | "retrieved" // passages attached to your message by retrieval
  | "you-before" // your earlier messages
  | "bot-before" // the bot's earlier replies
  | "message" // the message you just sent
  | "search" // the model's search calls and the passages they returned, this turn
  | "bot-now"; // text the model wrote this turn before searching
export type SentPart = { kind: SentPartKind; label: string; text: string };

// Jewel tones sampled from the paper-doll plates (median of the most saturated pixels per hue family).
export const JEWELS = {
  sapphire: "#182953",
  emerald: "#225519",
  teal: "#235e58",
  amethyst: "#572990",
  garnet: "#972934",
  gold: "#b48811",
  magenta: "#71245b",
  vermilion: "#c75e3e",
} as const;

export const PART_STYLE: Record<SentPartKind, { label: string; color: string }> = {
  instructions: { label: "Instructions", color: JEWELS.sapphire },
  pack: { label: "Knowledge pack", color: JEWELS.emerald },
  retrieved: { label: "Retrieved passages", color: JEWELS.teal },
  search: { label: "Searches & results", color: JEWELS.amethyst },
  "you-before": { label: "Your earlier messages", color: JEWELS.garnet },
  "bot-before": { label: "The bot's earlier replies", color: JEWELS.gold },
  "bot-now": { label: "The bot, mid-turn", color: JEWELS.magenta },
  message: { label: "Your new message", color: JEWELS.vermilion },
};

export type Passage = { title: string; source: "voice" | "text"; text: string; score?: number };

export type ChatTurn = { role: "user" | "assistant"; content: string };
