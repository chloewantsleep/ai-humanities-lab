// The starter prompts and default settings, shared by the page and tools/record.mjs (which records the fallback runs).
export const STARTERS = [
  { id: "question", label: "A question", prompt: "What is the capital of France?\n" },
  { id: "who", label: "Who are you?", prompt: "Who are you?\n" },
  { id: "forum", label: "A forum post", prompt: "Re: Laptop won't turn on after update\n\nPosted by tom_h on March 12, 2019\n\nHi all, first time posting here. After last night's update my laptop" },
  { id: "letter", label: "A letter", prompt: "Dear Victor,\n\nI am writing to you because" },
];

export const DEFAULTS = { temperature: 0.9, topK: 40, maxNewTokens: 150, neverStop: true };
