import test from "node:test";
import assert from "node:assert/strict";
import { distribution, normalizeOptions, findStop } from "./sampling.js";

test("top-k probabilities match the sampled support, while preserving vocabulary probabilities", () => {
  const scores = [Math.log(0.6), Math.log(0.3), Math.log(0.1)];
  const result = distribution(scores, 2);
  assert.deepEqual(result.map(x => x.id), [0, 1]);
  assert.ok(Math.abs(result[0].probability - 2 / 3) < 1e-7);
  assert.ok(Math.abs(result[0].vocabularyProbability - 0.6) < 1e-7);
  assert.ok(Math.abs(result.reduce((s, x) => s + x.probability, 0) - 1) < 1e-7);
});
test("stable softmax, greedy decoding, unrestricted vocabulary and masked tokens", () => {
  assert.equal(distribution([10000, 10001, -Infinity], 1)[0].probability, 1);
  assert.deepEqual(distribution([0, 1], 0, true).map(x => x.probability), [1, 0]);
  assert.equal(distribution([0, 1], 0).length, 2);
  assert.throws(() => distribution([-Infinity], 20), /no finite/);
});
test("higher temperature flattens the distribution", () => {
  assert.ok(distribution([2, 0], 2)[0].probability > distribution([1, 0], 2)[0].probability);
});
test("stops can span token boundaries and select the earliest match", () => {
  assert.equal(findStop("hello Hu", ["Human:"]), null);
  assert.deepEqual(findStop("hello Human: next STOP", ["STOP", "Human:"]), { index: 6, stop: "Human:" });
});
test("reject invalid controls rather than silently changing them", () => {
  for (const options of [{ temperature: NaN }, { temperature: -1 }, { topK: 1.2 }, { maxNewTokens: 0 }, { stopStrings: [""] }]) {
    assert.throws(() => normalizeOptions(options));
  }
  assert.equal(normalizeOptions({ neverStop: true }).maxNewTokens, 100);
});
