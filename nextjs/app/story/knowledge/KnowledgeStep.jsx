import KnowledgeDemo from "./KnowledgeDemo.jsx";
import { keywordSearch, meaningSearch, semanticWords, wholeText } from "./search.js";

// Server wrapper: runs the three preset searches ahead of time so the demo opens instantly, and sends the browser
// only their results (a few KB), never the novel. Free-text keyword search goes to /api/story-knowledge.

// Single words, because meaning-based search needs the query's embedding, and these are the words the Gem
// already has embeddings for (content/_poetry-gem/vectors/map.json). Chosen so the two searches disagree.
const PRESETS = ["reading", "lonely", "fire"];

// The words on the Gem's map that make sense to ask Frankenstein about (all have precomputed vectors).
const OFFER = ["monster", "creator", "father", "friend", "outcast", "grief", "revenge", "learning", "speech", "book", "ice", "love"];

export default function KnowledgeStep() {
  const known = new Set(semanticWords());
  const presets = PRESETS.map((q) => ({ q, keyword: keywordSearch(q), meaning: meaningSearch(q) }));
  return (
    <KnowledgeDemo
      data={{
        whole: wholeText(),
        presets,
        words: [...PRESETS, ...OFFER].filter((w) => known.has(w)),
      }}
    />
  );
}
