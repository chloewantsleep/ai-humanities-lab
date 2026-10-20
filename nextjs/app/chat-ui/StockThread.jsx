"use client";

// Text-chat subset adapted from assistant-ui's official thread registry, 2026-10-20:
// https://r.assistant-ui.com/thread.json
// MIT, Copyright (c) 2026 AgentbaseAI Inc. See ASSISTANT-UI-LICENSE.txt.
// Tailwind/shadcn presentation is replaced with scoped CSS and native buttons.
import { useRef, useState } from "react";
import {
  ActionBarPrimitive, AuiIf, BranchPickerPrimitive, ComposerPrimitive,
  ErrorPrimitive, MessagePrimitive, ThreadPrimitive,
} from "@assistant-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Icon({ name }) {
  const paths = {
    send: <path d="M12 19V5m-6 6 6-6 6 6" />,
    stop: <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
    edit: <><path d="m15 4 5 5-11 11H4v-5L15 4Z" /><path d="m12 7 5 5" /></>,
    reload: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    down: <path d="M12 5v14m-6-6 6 6 6-6" />,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function CodeBlock({ children }) {
  const code = useRef(null);
  const [notice, setNotice] = useState("");
  const language = children?.props?.className?.replace("language-", "") || "text";
  return <div className="ac-code">
    <div className="ac-code-header"><span>{language}</span><button type="button" aria-label="Copy code" onClick={async () => {
      try { await navigator.clipboard.writeText(code.current.textContent); setNotice("Copied"); }
      catch { setNotice("Copy unavailable — select the code to copy"); }
    }}><Icon name="copy" /> Copy code</button></div>
    <pre ref={code}>{children}</pre>
    {notice && <span className="ac-code-notice" role="status">{notice}</span>}
  </div>;
}

function MarkdownText({ text }) {
  return <div className="ac-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>{text}</ReactMarkdown></div>;
}

function BranchPicker() {
  return <BranchPickerPrimitive.Root hideWhenSingleBranch className="ac-branches" aria-label="Message versions">
    <BranchPickerPrimitive.Previous className="ac-icon" aria-label="Previous version" title="Previous version">‹</BranchPickerPrimitive.Previous>
    <span><BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count /></span>
    <BranchPickerPrimitive.Next className="ac-icon" aria-label="Next version" title="Next version">›</BranchPickerPrimitive.Next>
  </BranchPickerPrimitive.Root>;
}

function UserMessage() {
  return <MessagePrimitive.Root className="ac-message ac-user" data-role="user">
    <div className="ac-user-bubble"><MessagePrimitive.Parts /></div>
    <div className="ac-message-actions">
      <BranchPicker />
      <ActionBarPrimitive.Root hideWhenRunning>
        <ActionBarPrimitive.Edit className="ac-icon" aria-label="Edit message" title="Edit message"><Icon name="edit" /></ActionBarPrimitive.Edit>
      </ActionBarPrimitive.Root>
    </div>
  </MessagePrimitive.Root>;
}

function AssistantMessage() {
  return <MessagePrimitive.Root className="ac-message ac-assistant" data-role="assistant">
    <span className="ac-sr-only">Assistant</span>
    <MessagePrimitive.Parts components={{ Text: MarkdownText }} />
    <MessagePrimitive.Error><ErrorPrimitive.Root className="ac-error" role="alert"><ErrorPrimitive.Message /></ErrorPrimitive.Root></MessagePrimitive.Error>
    <div className="ac-message-actions">
      <BranchPicker />
      <ActionBarPrimitive.Root hideWhenRunning className="ac-action-bar">
        <ActionBarPrimitive.Copy className="ac-icon" aria-label="Copy response" title="Copy response">
          <AuiIf condition={(s) => s.message.isCopied}><Icon name="check" /><span className="ac-sr-only">Copied</span></AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}><Icon name="copy" /></AuiIf>
        </ActionBarPrimitive.Copy>
        <ActionBarPrimitive.Reload className="ac-icon" aria-label="Regenerate response" title="Regenerate response"><Icon name="reload" /></ActionBarPrimitive.Reload>
      </ActionBarPrimitive.Root>
    </div>
  </MessagePrimitive.Root>;
}

function EditComposer() {
  return <MessagePrimitive.Root className="ac-message ac-edit">
    <ComposerPrimitive.Root className="ac-composer ac-edit-composer">
      <ComposerPrimitive.Input aria-label="Edit your message" autoFocus />
      <div className="ac-edit-actions">
        <ComposerPrimitive.Cancel className="ac-button">Cancel edit</ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send className="ac-button ac-solid">Save &amp; send</ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  </MessagePrimitive.Root>;
}

const suggestions = [
  ["Read a passage", "Suggest two questions for a close reading of Plato’s Phaedrus. Keep it under 60 words."],
  ["Compare two ideas", "Explain memory versus reminding in Phaedrus in under 60 words."],
  ["Try a code example", "Show a tiny JavaScript function that greets a reader. Use a fenced code block and one sentence."],
];

export default function StockThread() {
  return <ThreadPrimitive.Root className="ac-thread" aria-label="Assistant conversation">
    <ThreadPrimitive.Viewport className="ac-viewport">
      <div className="ac-thread-inner">
        <ThreadPrimitive.Empty>
          <div className="ac-welcome"><span className="ac-spark" aria-hidden="true">✳</span><h2>How can I help you today?</h2><p>Read, compare, or make something together.</p></div>
        </ThreadPrimitive.Empty>
        <div className="ac-messages"><ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage, EditComposer }} /></div>
        <ThreadPrimitive.If running><p className="ac-working" role="status">Assistant is responding…</p></ThreadPrimitive.If>
        <ThreadPrimitive.ViewportFooter className="ac-viewport-footer">
          <ThreadPrimitive.ScrollToBottom className="ac-icon ac-scroll" aria-label="Scroll to latest message" title="Scroll to latest message"><Icon name="down" /></ThreadPrimitive.ScrollToBottom>
          <ComposerPrimitive.Root className="ac-composer">
            <ComposerPrimitive.Input aria-label="Message" placeholder="Message the assistant…" rows={2} />
            <div className="ac-composer-bottom"><span>Enter to send · Shift + Enter for a new line</span>
              <ThreadPrimitive.If running={false}><ComposerPrimitive.Send className="ac-icon ac-send" aria-label="Send message" title="Send message"><Icon name="send" /></ComposerPrimitive.Send></ThreadPrimitive.If>
              <ThreadPrimitive.If running><ComposerPrimitive.Cancel className="ac-icon ac-send" aria-label="Stop generating" title="Stop generating"><Icon name="stop" /></ComposerPrimitive.Cancel></ThreadPrimitive.If>
            </div>
          </ComposerPrimitive.Root>
          <ThreadPrimitive.Empty><div className="ac-suggestions" aria-label="Conversation starters">
            {suggestions.map(([title,prompt]) => <ThreadPrimitive.Suggestion key={title} prompt={prompt} send={false} className="ac-suggestion"><span aria-hidden="true">↗</span>{title}</ThreadPrimitive.Suggestion>)}
          </div></ThreadPrimitive.Empty>
        </ThreadPrimitive.ViewportFooter>
      </div>
    </ThreadPrimitive.Viewport>
  </ThreadPrimitive.Root>;
}
