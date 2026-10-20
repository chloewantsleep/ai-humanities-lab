import assert from "node:assert/strict";
import test from "node:test";
import { chooseDevice, hasWeights, MODELS, prepareModels } from "./preparation.mjs";
import { DEVICE_KEY, readDevicePreference, saveDevicePreference } from "../../lib/browser-lm/device-preference.mjs";

test("the faster usable device wins, with WASM preferred for close or failed GPU results", () => {
  assert.equal(chooseDevice([{ device: "wasm", tps: 20 }, { device: "webgpu", tps: 21 }]), "wasm");
  assert.equal(chooseDevice([{ device: "wasm", tps: 20 }, { device: "webgpu", tps: 30 }]), "webgpu");
  assert.equal(chooseDevice([{ device: "wasm", tps: 20 }, { device: "webgpu", error: "No adapter" }]), "wasm");
  assert.equal(chooseDevice([{ device: "wasm", tps: NaN }, { device: "webgpu", tps: 10 }]), "webgpu");
  assert.equal(chooseDevice([{ device: "wasm", tps: 0 }]), null);
});

test("preparation is serial and continues after a failed model without reporting complete", async () => {
  let running = 0;
  const attempted = [], states = [];
  const complete = await prepareModels({ signal: new AbortController().signal,
    onState: (id, patch) => states.push({ id, ...patch }),
    load: async model => {
      assert.equal(running++, 0);
      attempted.push(model.id);
      await Promise.resolve();
      running--;
      if (model === MODELS[1]) throw new Error("download failed");
      return { cached: true };
    },
  });
  assert.equal(complete, false);
  assert.deepEqual(attempted, MODELS.map(m => m.id));
  assert.equal(states.filter(s => s.status === "ready").length, 3);
  assert.equal(states.find(s => s.status === "error").error, "download failed");
});

test("loading without persistent weights is not enough to report complete", async () => {
  const states = [];
  const complete = await prepareModels({ signal: new AbortController().signal, load: async () => ({ cached: false }), onState: (_, patch) => states.push(patch) });
  assert.equal(complete, false);
  assert.equal(states.filter(s => s.status === "uncached").length, 4);
  assert.equal(states.filter(s => s.status === "ready").length, 0);
});

test("cancellation never starts the next download or reports the active model ready", async () => {
  const controller = new AbortController(), states = [];
  let calls = 0;
  await assert.rejects(prepareModels({ signal: controller.signal, onState: (_, patch) => states.push(patch), load: async () => { calls++; controller.abort(); return { cached: true }; } }), { name: "AbortError" });
  assert.equal(calls, 1);
  assert.ok(!states.some(s => s.status === "ready"));
});

test("cache hints require the exact repo and quantization the experiment loads", () => {
  const gpt = MODELS[0];
  assert.equal(hasWeights([`https://huggingface.co/${gpt.id}/resolve/main/onnx/${gpt.file}`], gpt), true);
  assert.equal(hasWeights([`https://huggingface.co/${gpt.id}/resolve/main/tokenizer.json`], gpt), false);
  assert.equal(hasWeights([`https://huggingface.co/${gpt.id}/resolve/main/onnx/decoder_model_merged.onnx`], gpt), false);
  assert.equal(hasWeights([`https://huggingface.co/another/gpt2/resolve/main/onnx/${gpt.file}`], gpt), false);
});

test("device preference validates values and tolerates browser storage being blocked", () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  assert.equal(readDevicePreference("auto", storage), "auto");
  assert.equal(saveDevicePreference("webgpu", storage), true);
  assert.equal(readDevicePreference("wasm", storage), "webgpu");
  values.set(DEVICE_KEY, "untrusted");
  assert.equal(readDevicePreference("wasm", storage), "wasm");
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.equal(saveDevicePreference("wasm", blocked), false);
  assert.equal(readDevicePreference("wasm", blocked), "wasm");
});
