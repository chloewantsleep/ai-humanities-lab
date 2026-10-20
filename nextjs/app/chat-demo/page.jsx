"use client";
import { useState } from "react";
import { ChatShell } from "../components/chat/ChatShell";

const localAdapter = {
  async run({ messages, abortSignal }) {
    abortSignal.throwIfAborted();
    const text = messages.at(-1).content.filter(p => p.type === "text").map(p => p.text).join("\n");
    return { content: [{ type: "text", text: `Local demo received: ${text}` }] };
  },
};

export default function ChatDemo() {
  const [local, setLocal] = useState(false);
  return <main id="main" className="article-shell">
    <header className="article-heading"><p className="eyebrow">Shared foundation · Task B</p><h1>Chat shell</h1>
      <p className="lede">Try Claude or a local echo engine, then inspect the last request.</p></header>
    <p><label><input type="checkbox" checked={local} onChange={e => setLocal(e.target.checked)} /> Use local demo (no API key needed; switching resets the conversation)</label></p>
    <ChatShell key={String(local)} adapter={local ? localAdapter : undefined} system="You are a concise teaching assistant for an AI humanities lab." displayName={local ? "Local echo" : "Claude"} avatar={local ? "◇" : "✳"} />
  </main>;
}
