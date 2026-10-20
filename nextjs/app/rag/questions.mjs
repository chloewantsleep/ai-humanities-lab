// The example questions on /rag, one or two per course text. tools/embed-questions.mjs embeds them ahead of time
// (into questions.json) so the page can run the whole pipeline before the embedding model has downloaded.
export const QUESTIONS = {
  phaedrus: ["Does writing destroy memory?", "Why did Thamus distrust letters?", "What is love, according to Socrates?"],
  rur: ["Why do the robots rebel?", "Can a robot have a soul?"],
  frankenstein: ["What does the creature ask Victor to make?", "How did the creature learn to speak?"],
  laughter: ["What makes something funny?"],
  "dorian-gray": ["Why does the portrait change?"],
  intentions: ["Is art more true than life?"],
};
