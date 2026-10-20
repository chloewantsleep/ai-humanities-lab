export const rules = [
  { id: 'antithesis', label: 'Antithesis', hint: 'A bounded “not … but …” or “not …, it is …” span.', pattern: /\bnot\b[^.!?\n]{1,100}?(?:\bbut\b|[,;—]\s*(?:it(?:['’]s| is)|they are|we are|this is))[^.!?\n]{1,100}/gi },
  { id: 'triad', label: 'Possible triad', hint: 'Three short comma-separated phrases ending in “and” or “or”; may catch longer lists.', pattern: /\b[\p{L}\p{N}][^,;.!?\n]{0,45},\s*[^,;.!?\n]{1,45},?\s+\b(?:and|or)\b\s+[^,;.!?\n]{1,45}/giu },
  { id: 'dash', label: 'Em-dash pivot', hint: 'Each em dash or double hyphen; punctuation alone cannot identify a pivot.', pattern: /—|--/g },
  { id: 'vocabulary', label: 'Watch-list vocabulary', hint: 'delve, tapestry, realm, multifaceted, pivotal, foster, leverage, nuanced (including common inflections).', pattern: /\b(?:delv(?:e[sd]?|ing)|tapestr(?:y|ies)|realms?|multifaceted|pivotal|foster(?:s|ed|ing)?|leverag(?:e[sd]?|ing)|nuanced)\b/gi },
  { id: 'question', label: 'Question → answer candidate', hint: 'A question followed immediately by a statement; does not establish that it answers the question.', pattern: /[^.!?\n]{1,150}\?\s+[^.!?\n]{1,150}[.!]/g },
  { id: 'summary', label: 'Summary cue', hint: 'A conventional closing phrase wherever it occurs; may not be a closing summary.', pattern: /\b(?:in short|in conclusion|to sum up|in summary|ultimately|the bottom line)\b[, :—]*/gi },
];
export function analyze(text) {
  const words = (text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length;
  const matches = rules.flatMap(rule => Array.from(text.matchAll(new RegExp(rule.pattern)), m => ({ id: rule.id, start: m.index, end: m.index + m[0].length, text: m[0] }))).sort((a,b) => a.start-b.start || a.end-b.end);
  return { words, matches, counts: rules.map(rule => { const count = matches.filter(m=>m.id===rule.id).length; return { ...rule, count, rate: words ? count/words*1000 : 0 }; }) };
}
