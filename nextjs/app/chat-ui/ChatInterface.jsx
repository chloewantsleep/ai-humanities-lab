"use client";

import { useMemo, useState } from "react";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import StockThread from "./StockThread.jsx";

const SYSTEM = "You are a concise teaching assistant for an AI humanities lab. Prefer short answers under 100 words unless asked otherwise. Use Markdown when useful.";

// Authored output for exercising the UI without paid model calls. Not a model answer.
const DEMO = "This is an **authored interface demo**, not a model response.\n\n- Edit your message to create another branch.\n- Regenerate this response and use the version arrows.\n- Copy the response or just the code.\n\n```javascript\nfunction greet(reader) {\n  return `Hello, ${reader}!`;\n}\n```\n\n| What changes | What stays the same |\n| --- | --- |\n| Presentation | The conversation primitives |\n\nSee [assistant-ui’s documentation](https://www.assistant-ui.com/docs).";
const demoAdapter = {
  async *run({ abortSignal }) {
    for (let end = 20; end < DEMO.length + 20; end += 20) {
      await new Promise((resolve) => setTimeout(resolve, 35));
      abortSignal.throwIfAborted();
      yield { content: [{ type: "text", text: DEMO.slice(0, end) }] };
    }
  },
};

function LocalThread() {
  const runtime = useLocalRuntime(demoAdapter);
  return <AssistantRuntimeProvider runtime={runtime}><StockThread /></AssistantRuntimeProvider>;
}

function RemoteThread() {
  const [error, setError] = useState("");
  const [trace, setTrace] = useState(null);
  const transport = useMemo(() => new AssistantChatTransport({
    api: "/api/chat",
    body: { system: SYSTEM },
    fetch: async (url, init) => {
      setError("");
      const response = await fetch(url, init);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Chat request failed (${response.status}).`);
      }
      return response;
    },
  }), []);
  const runtime = useChatRuntime({ transport,
    onError: (failure) => setError(failure.message),
    onData: (part) => { if (part.type === "data-request") setTrace(part.data); },
  });
  return <AssistantRuntimeProvider runtime={runtime}>
    <StockThread />
    {error && <p className="ac-error" role="alert">{error}</p>}
    <details className="ac-inspector"><summary>Under the interface · last request</summary><p>Same endpoint as /chat-demo. This snapshot is returned by the server; it contains no API key.</p>{trace ? <pre>{JSON.stringify(trace,null,2)}</pre> : <p>No request received yet.</p>}</details>
  </AssistantRuntimeProvider>;
}

export default function ChatInterface() {
  const [local, setLocal] = useState(false);
  const [session, setSession] = useState(0);
  return <div className="ac-chat-ui">
    <div className="ac-toolbar">
      <div><span className="ac-brand">assistant-ui</span><span className="ac-engine">{local ? "Local interface demo" : "Live · /api/chat"}</span></div>
      <button className="ac-button" onClick={() => setSession((value) => value + 1)}>New chat</button>
    </div>
    <div className="ac-mode"><label><input type="checkbox" checked={local} onChange={(event) => setLocal(event.target.checked)} /> Local interface demo (no API cost)</label><span>Changing mode or starting a new chat clears the thread.</span></div>
    <div key={`${local}-${session}`}>{local ? <LocalThread /> : <RemoteThread />}</div>
    <p className="ac-footnote">{local ? "Authored sample text; use it to try the controls without calling a model." : "Messages go to the shared model endpoint. Send, edit-and-send, and regenerate each make a paid request."} Chats are not saved after you leave or reload.</p>
  </div>;
}
