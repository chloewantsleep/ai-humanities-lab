import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from './detector.mjs';
const count = (text, id) => analyze(text).counts.find(r=>r.id===id).count;
test('antithesis variants and sentence boundaries', () => {
  for (const text of ['Not speed but care.', 'It’s not just speed, it’s care.', 'Not speed—it is care.']) assert.equal(count(text,'antithesis'),1,text);
  assert.equal(count('This is not speed. But care matters.', 'antithesis'),0);
});
test('all six categories are surfaced with exact offsets', () => {
  const text='Not speed but care. A, B, and C. Delve deeper—today. Why care? It matters. In short, listen.';
  const result=analyze(text);
  for (const rule of result.counts) assert.ok(rule.count>0,rule.id);
  for (const match of result.matches) assert.equal(text.slice(match.start,match.end),match.text);
});
test('empty text and Unicode word normalization', () => {
  assert.equal(analyze('').words,0);
  assert.ok(analyze('').counts.every(r=>r.rate===0));
  assert.equal(analyze('café naïve don’t re-read').words,5);
  assert.equal(analyze('delve '.repeat(1000)).counts.find(r=>r.id==='vocabulary').rate,1000);
});
test('ordinary literal forms remain candidates, not authorship evidence', () => {
  assert.equal(count('Apples, pears, and plums.', 'triad'),1);
  assert.equal(count('A pause—then silence.', 'dash'),1);
  assert.equal(count('We measured the realm.', 'vocabulary'),1);
  assert.equal(count('A plain sentence.', 'antithesis'),0);
});
