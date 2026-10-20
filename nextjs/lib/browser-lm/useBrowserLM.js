"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserLM } from "./client.js";

const initial = { status: "idle", model: null, progress: null, step: null, result: null, error: null, templatedPrompt: null, text: "" };

// Loading is explicit: mounting a page never starts a large model download.
export function useBrowserLM(modelId) {
  const engine = useRef(null);
  const [state, setState] = useState(initial);
  useEffect(() => {
    const client = new BrowserLM();
    engine.current = client;
    setState(initial);
    return () => { engine.current = null; client.dispose(); };
  }, [modelId]);
  const current = useCallback(() => {
    if (!engine.current) throw new Error("Engine is not mounted yet.");
    return engine.current;
  }, []);
  const load = useCallback(async (options = {}) => {
    const client = current();
    setState(s => ({ ...s, status: "loading", error: null, progress: null, model: null }));
    try {
      const model = await client.load(modelId, options, event => {
        if (engine.current !== client) return;
        if (event.type === "progress") setState(s => ({ ...s, progress: event }));
      });
      if (engine.current === client) setState(s => ({ ...s, status: "ready", model }));
      return model;
    } catch (error) {
      if (engine.current === client) setState(s => ({ ...s, status: "error", error: error.message }));
      throw error;
    }
  }, [modelId, current]);
  const generate = useCallback(async (options, onStep) => {
    const client = current();
    setState(s => ({ ...s, status: "generating", text: "", result: null, step: null, templatedPrompt: null, error: null }));
    try {
      const result = await client.generate(options, event => {
        if (engine.current !== client) return;
        if (event.type === "start") setState(s => ({ ...s, templatedPrompt: event.templatedPrompt }));
        if (event.type === "step") {
          setState(s => ({ ...s, step: event, text: event.text }));
          onStep?.(event);
        }
      });
      if (engine.current === client) setState(s => ({ ...s, status: "ready", result, text: result.text }));
      return result;
    } catch (error) {
      if (engine.current === client) setState(s => ({ ...s, status: "error", error: error.message }));
      throw error;
    }
  }, [current]);
  const applyChatTemplate = useCallback(async (messages, options) => {
    const client = current();
    const result = await client.applyChatTemplate(messages, options);
    if (engine.current === client) setState(s => ({ ...s, templatedPrompt: result.templatedPrompt }));
    return result.templatedPrompt;
  }, [current]);
  // Token counts with the loaded model's tokenizer: { counts, contextLimit }. Does not touch the hook's state.
  const count = useCallback((texts, options) => current().count(texts, options), [current]);
  const abort = useCallback(() => engine.current?.abort(), []);
  return { ...state, load, generate, abort, applyChatTemplate, count };
}
