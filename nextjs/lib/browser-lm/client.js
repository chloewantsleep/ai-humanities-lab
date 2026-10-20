/** One client owns one worker/model. Separate clients can run independently. */
export class BrowserLM {
  constructor() {
    this.worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    this.pending = new Map();
    this.nextId = 0;
    this.worker.onmessage = ({ data }) => {
      const request = this.pending.get(data.requestId);
      if (!request) return;
      request.onEvent?.(data);
      if (data.type === "error") {
        this.pending.delete(data.requestId);
        request.reject(new Error(data.message));
      } else if (["ready", "result", "template", "count"].includes(data.type)) {
        this.pending.delete(data.requestId);
        request.resolve(data);
      }
    };
    this.worker.onerror = event => {
      this.rejectAll(new Error(event.message || "Language-model worker failed."));
      this.worker?.terminate();
      this.worker = null;
    };
  }
  rejectAll(error) {
    for (const request of this.pending.values()) request.reject(error);
    this.pending.clear();
  }
  request(type, data, onEvent) {
    if (!this.worker) return Promise.reject(new Error("This engine has been disposed."));
    const requestId = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject, onEvent });
      this.worker.postMessage({ ...data, type, requestId });
    });
  }
  load(modelId, options = {}, onEvent) { return this.request("load", { ...options, modelId }, onEvent); }
  generate(options, onEvent) { return this.request("generate", options, onEvent); }
  applyChatTemplate(messages, templateOptions = {}) { return this.request("template", { messages, templateOptions }); }
  count(texts, options = {}) { return this.request("count", { ...options, texts }); }
  abort() { this.worker?.postMessage({ type: "abort" }); }
  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.rejectAll(new DOMException("Engine disposed", "AbortError"));
  }
}
