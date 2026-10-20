"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";
import { AssistantRuntimeProvider, useLocalRuntime, ThreadPrimitive, MessagePrimitive, ComposerPrimitive } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./chat.css";

const Presentation = createContext({});

function AssistantText({ text }) {
  return <div className="chat-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{text}</ReactMarkdown></div>;
}

function Message() {
  const { displayName, avatar } = useContext(Presentation);
  return <MessagePrimitive.Root className="chat-message">
    <MessagePrimitive.If user><div className="chat-speaker">You</div></MessagePrimitive.If>
    <MessagePrimitive.If assistant><div className="chat-speaker">{avatar && <span aria-hidden="true">{avatar}</span>} {displayName}</div></MessagePrimitive.If>
    <div className="chat-text">
      <MessagePrimitive.If user><MessagePrimitive.Parts /></MessagePrimitive.If>
      <MessagePrimitive.If assistant><MessagePrimitive.Parts components={{ Text: AssistantText }} /></MessagePrimitive.If>
    </div>
    <MessagePrimitive.Error><p role="alert">The reply could not be completed.</p></MessagePrimitive.Error>
  </MessagePrimitive.Root>;
}

function Surface({ runtime, displayName = "Claude", avatar = "", typingIndicator = true, trace, error }) {
  return <AssistantRuntimeProvider runtime={runtime}>
    <Presentation.Provider value={{ displayName, avatar }}>
      <ThreadPrimitive.Root className="chat-shell" aria-label={`Chat with ${displayName}`}>
        <ThreadPrimitive.Viewport className="chat-viewport">
          <ThreadPrimitive.Empty><p className="chat-empty">Send a message to begin.</p></ThreadPrimitive.Empty>
          <ThreadPrimitive.Messages components={{ Message }} />
        </ThreadPrimitive.Viewport>
        {typingIndicator && <ThreadPrimitive.If running><p className="chat-status" role="status">{displayName} is typing…</p></ThreadPrimitive.If>}
        {error && <p className="chat-error" role="alert">{error}</p>}
        <ComposerPrimitive.Root className="chat-composer">
          <ComposerPrimitive.Input aria-label="Message" placeholder="Write a message…" rows={3} />
          <ThreadPrimitive.If running={false}><ComposerPrimitive.Send>Send</ComposerPrimitive.Send></ThreadPrimitive.If>
          <ThreadPrimitive.If running><ComposerPrimitive.Cancel>Stop</ComposerPrimitive.Cancel></ThreadPrimitive.If>
        </ComposerPrimitive.Root>
      </ThreadPrimitive.Root>
      <details className="chat-inspector"><summary>Pull back the curtain · last request</summary>
        <p>{trace ? "Snapshot taken for the last send; later edits do not change it." : "No request sent yet."}</p>
        {trace && <pre>{JSON.stringify(trace, null, 2)}</pre>}
      </details>
    </Presentation.Provider>
  </AssistantRuntimeProvider>;
}

function RemoteChat({ api = "/api/chat", system = "", onRequest, ...presentation }) {
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState("");
  const current = useRef({ system, onRequest });
  current.current = { system, onRequest };
  const transport = useMemo(() => new AssistantChatTransport({
    api,
    body: () => ({ system: current.current.system }),
    fetch: async (url, init) => {
      setError("");
      const body = JSON.parse(init.body);
      const snapshot = structuredClone({ engine: "http", system: body.system, messages: body.messages });
      setTrace(snapshot);
      current.current.onRequest?.(snapshot);
      const response = await fetch(url, init);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Chat request failed (${response.status}).`);
      }
      return response;
    },
  }), [api]);
  const runtime = useChatRuntime({ transport,
    onData: part => {
      if (part.type === "data-request") {
        setTrace(part.data);
        current.current.onRequest?.(part.data);
      }
    },
    onError: e => setError(e.message),
  });
  return <Surface runtime={runtime} trace={trace} error={error} {...presentation} />;
}

function LocalChat({ adapter, system = "", onRequest, ...presentation }) {
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState("");
  const wrapped = useMemo(() => ({
    async *run(options) {
      setError("");
      const snapshot = structuredClone({ engine: "local", system, messages: options.messages });
      setTrace(snapshot);
      onRequest?.(snapshot);
      try {
        const result = adapter.run({ ...options, system });
        if (result && typeof result[Symbol.asyncIterator] === "function") {
          yield* result;
        } else {
          yield await result;
        }
      } catch (e) {
        if (!options.abortSignal.aborted) setError(e.message || "Local engine failed.");
        throw e;
      }
    },
  }), [adapter, system, onRequest]);
  const runtime = useLocalRuntime(wrapped);
  return <Surface runtime={runtime} trace={trace} error={error} {...presentation} />;
}

/** adapter: assistant-ui ChatModelAdapter (plus system), or api: AI SDK UI stream endpoint. */
export function ChatShell(props) {
  return props.adapter ? <LocalChat {...props} /> : <RemoteChat {...props} />;
}
