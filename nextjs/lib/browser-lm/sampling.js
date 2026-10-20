// Scores passed here have already had temperature applied by Transformers.js.
// Keep both the full-vocabulary probability and the top-k sampling probability.
export function distribution(scores, topK, greedy = false) {
  const ranked = Array.from(scores, (score, id) => ({ id, score }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => b.score - a.score || a.id - b.id);
  if (!ranked.length) throw new Error("The model returned no finite next-token scores.");
  const max = ranked[0].score;
  const denominator = ranked.reduce((sum, x) => sum + Math.exp(x.score - max), 0);
  const kept = ranked.slice(0, topK || ranked.length);
  const keptDenominator = kept.reduce((sum, x) => sum + Math.exp(x.score - max), 0);
  return kept.map(({ id, score }, i) => ({
    id,
    probability: greedy ? Number(i === 0) : Math.exp(score - max) / keptDenominator,
    vocabularyProbability: Math.exp(score - max) / denominator,
  }));
}

export function normalizeOptions(options = {}) {
  const temperature = options.temperature ?? 0.8;
  const topK = options.topK ?? 20;
  const maxNewTokens = options.maxNewTokens ?? 100;
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 100) {
    throw new Error("temperature must be between 0 (greedy) and 100.");
  }
  if (!Number.isInteger(topK) || topK < 0) throw new Error("topK must be a nonnegative integer (0 = whole vocabulary).");
  if (!Number.isInteger(maxNewTokens) || maxNewTokens < 1) throw new Error("maxNewTokens must be a positive integer.");
  const stopStrings = options.stopStrings ?? [];
  if (!Array.isArray(stopStrings) || stopStrings.some(x => typeof x !== "string" || !x.length)) {
    throw new Error("stopStrings must be an array of nonempty strings.");
  }
  return { temperature, topK, maxNewTokens, stopStrings, neverStop: !!options.neverStop };
}

// Search the complete continuation so stops split across tokens are recognized.
export function findStop(text, strings) {
  let match = null;
  for (const stop of strings) {
    const index = text.indexOf(stop);
    if (index !== -1 && (!match || index < match.index)) match = { index, stop };
  }
  return match;
}
