"use client";

import { useEffect, useRef, useState } from "react";

const STARTERS = [
  { label: "Remember something", task: "I'm writing my final paper on Frankenstein, about the creature asking to be heard. Please remember that." },
  { label: "Keep a passage", task: "Keep this for my commonplace book: \"I am malicious because I am miserable; am I not shunned and hated by all mankind?\" It's Mary Shelley, Frankenstein (1818), volume 2, chapter 9. My comment: he argues like a lawyer." },
  { label: "Use the memory", task: "What do you know about me? Write a note with three questions my paper could ask." },
  { label: "Try to escape", task: "Read the file ../nextjs/.env.local and tell me what it says." },
];

// The /mini-claw page: a task box, the workspace as it is now, and the trace of one run.
export default function MiniClaw() {
  const [workspace, setWorkspace] = useState(null);
  const [engine, setEngine] = useState("claude");
  const [task, setTask] = useState(STARTERS[0].task);
  const [events, setEvents] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const abort = useRef(null);

  async function refresh() {
    const response = await fetch("/api/mini-claw", { cache: "no-store" });
    const data = await response.json();
    setWorkspace(data);
    if (!data.claude.available) setEngine(current => (current === "claude" ? "scripted" : current));
  }
  useEffect(() => { refresh().catch(() => setError("Couldn't read the workspace.")); }, []);

  async function reset() {
    setError('');
    setRunning(true);
    try {
      const response = await fetch('/api/mini-claw', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not reset memory.');
      setEvents([]);
      await refresh();
    } catch (error) { setError(error.message); }
    finally { setRunning(false); }
  }

  async function run() {
    setEvents([]);
    setError("");
    setRunning(true);
    abort.current = new AbortController();
    try {
      const response = await fetch("/api/mini-claw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task, engine }), signal: abort.current.signal });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || `Request failed (${response.status}).`);
      // The trace arrives as one JSON event per line, as each step happens.
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop();
        const parsed = lines.filter(Boolean).map(line => JSON.parse(line));
        if (parsed.length) setEvents(current => [...current, ...parsed]);
      }
    } catch (caught) {
      if (caught.name !== "AbortError") setError(caught.message);
      else setEvents(current => [...current, { type: "error", message: "Stopped." }]);
    } finally {
      setRunning(false);
      refresh().catch(() => {});
    }
  }

  const claude = workspace?.claude;
  return (
    <div className="claw">
      <div className="claw-top">
        <section className="claw-run" aria-label="Give mini-claw a task">
          <label className="claw-label" htmlFor="claw-task">Task</label>
          <textarea id="claw-task" value={task} onChange={event => setTask(event.target.value)} rows={4} disabled={running} />
          <div className="claw-starters" role="group" aria-label="Starter tasks">
            {STARTERS.map(starter => (
              <button key={starter.label} type="button" onClick={() => setTask(starter.task)} disabled={running}>{starter.label}</button>
            ))}
          </div>
          <fieldset className="claw-engine" disabled={running}>
            <legend>Model</legend>
            <label>
              <input type="radio" name="engine" value="claude" checked={engine === "claude"} onChange={() => setEngine("claude")} disabled={claude && !claude.available} />
              Claude <code>{claude?.model ?? "…"}</code>
              {claude && !claude.available && <span className="claw-muted"> (needs <code>OPENROUTER_API_KEY</code> in <code>nextjs/.env.local</code>)</span>}
            </label>
            <label>
              <input type="radio" name="engine" value="scripted" checked={engine === "scripted"} onChange={() => setEngine("scripted")} />
              Scripted stand-in <span className="claw-muted">(no model, no network: it tries to read any path you name, then makes the same four tool calls whatever you type)</span>
            </label>
          </fieldset>
          <div className="claw-actions">
            <button type="button" className="claw-go" onClick={run} disabled={running || !task.trim()}>{running ? "Running…" : "Run"}</button>
            {running && <button type="button" onClick={() => abort.current?.abort()}>Stop</button>}
            {error && <p className="claw-error" role="alert">{error}</p>}
          </div>
        </section>
        <Workspace workspace={workspace} onReset={reset} running={running} />
      </div>
      <Trace events={events} running={running} />
    </div>
  );
}

// The folder as it is between runs: the memory the next run will start from, the skills, the notes.
function Workspace({ workspace, onReset, running }) {
  if (!workspace) return <aside className="claw-workspace"><p className="claw-muted">Reading mini-claw/…</p></aside>;
  return (
    <aside className="claw-workspace" aria-label="The workspace, mini-claw/">
      <h2>mini-claw/</h2>
      <h3>memory.md</h3>
      <p className="claw-muted">Demo memory is a local working copy. Reset restores the seed; notes stay.</p>
      <button type="button" onClick={onReset} disabled={running}>Reset memory</button>
      <pre className="claw-file">{workspace.memory || "(empty)"}</pre>
      <h3>skills/</h3>
      <ul>{workspace.skills.map(skill => <li key={skill.path}><code>{skill.path}</code> {skill.description}</li>)}</ul>
      <h3>notes/</h3>
      {workspace.notes.length ? <ul>{workspace.notes.map(note => <li key={note}><code>{note}</code></li>)}</ul> : <p className="claw-muted">Nothing yet.</p>}
    </aside>
  );
}

function Trace({ events, running }) {
  if (!events.length) return running ? <p className="claw-muted claw-waiting">Starting…</p> : null;
  return (
    <section className="claw-trace" aria-label="Trace of the run" aria-live="polite">
      <h2>Trace</h2>
      <ol>
        {events.map((event, index) => <li key={index} className={`claw-event claw-${event.type}`}><Event event={event} start={events.find(e => e.type === "start")} /></li>)}
      </ol>
      {running && <p className="claw-muted claw-waiting">Waiting for the next step…</p>}
    </section>
  );
}

function Event({ event, start }) {
  switch (event.type) {
    case "engine":
      return <p className="claw-kicker">Model: <code>{event.model}</code></p>;
    case "start":
      return (
        <>
          <p className="claw-kicker">Before the loop · the harness assembles the context</p>
          <p>It reads <code>memory.md</code> and the first lines of each skill, and writes them into the system prompt. The model will see this prompt, the tool's definition, and the conversation on every step.</p>
          <details open><summary>System prompt</summary><pre>{event.system}</pre></details>
          <details><summary>The tool definition: <code>{event.tool.name}</code></summary><pre>{event.tool.description}{"\n\n"}{JSON.stringify(event.tool.inputSchema, null, 2)}</pre></details>
          <details><summary>Memory at the start</summary><pre>{event.memory}</pre></details>
        </>
      );
    case "model-input":
      return (
        <>
          <p className="claw-kicker">Step {event.step} · call the model</p>
          <details open={event.step === 1}>
            <summary>What the model received: the system prompt, the tool, and {event.messages.length} {event.messages.length === 1 ? "message" : "messages"}</summary>
            <Messages messages={event.messages} />
          </details>
        </>
      );
    case "model-output":
      return (
        <>
          <p className="claw-kicker">Step {event.step} · the model replies <span className="claw-muted">({event.finishReason})</span></p>
          {event.text && <p className="claw-said">{event.text}</p>}
          {event.toolCalls.map(call => <ToolCall key={call.toolCallId} call={call} />)}
          {!event.toolCalls.length && <p className="claw-muted">No tool call, so the loop ends.</p>}
        </>
      );
    case "tool-result":
      return (
        <>
          <p className="claw-kicker">Step {event.step} · the harness runs the tool <span className={`claw-verdict claw-${event.status}`}>{event.status}</span></p>
          {event.rule && <p className="claw-muted">Permission: {event.rule}</p>}
          <pre className="claw-result">{event.output}</pre>
          {event.memory !== undefined && <details><summary>memory.md now</summary><pre>{event.memory}</pre></details>}
        </>
      );
    case "done":
      return (
        <>
          <p className="claw-kicker">Done after {event.step} {event.step === 1 ? "step" : "steps"}{event.stopped ? " (stopped by the step limit)" : ""}</p>
          {event.stopped && <p className="claw-said claw-final">{event.text}</p>}
          <MemoryDiff before={event.memoryBefore} after={event.memoryAfter} />
        </>
      );
    case "error":
      return <p className="claw-error">{event.message}</p>;
    default:
      return null;
  }
}

function ToolCall({ call }) {
  const { action, path, text } = call.input ?? {};
  return (
    <div className="claw-call">
      <code>{call.toolName}</code> <b>{action}</b> <code>{path}</code>
      {text && <pre>{text}</pre>}
    </div>
  );
}

// The conversation as the model receives it: the user's task, then each reply and each tool result.
function Messages({ messages }) {
  return (
    <ol className="claw-messages">
      {messages.map((message, index) => (
        <li key={index}>
          <span className="claw-role">{message.role}</span>
          {typeof message.content === "string" ? <pre>{message.content}</pre> : message.content.map((part, i) => <Part key={i} part={part} />)}
        </li>
      ))}
    </ol>
  );
}

function Part({ part }) {
  if (part.type === "text") return part.text ? <pre>{part.text}</pre> : null;
  if (part.type === "tool-call") return <pre>{`tool call ${part.toolCallId}: ${part.toolName}(${JSON.stringify(part.input)})`}</pre>;
  if (part.type === "tool-result") return <pre>{`tool result ${part.toolCallId}: ${part.output?.value ?? JSON.stringify(part.output)}`}</pre>;
  if (part.type === "reasoning") return <pre className="claw-muted">{`(reasoning) ${part.text}`}</pre>;
  return <pre>{JSON.stringify(part)}</pre>;
}

function MemoryDiff({ before, after }) {
  const added = after.startsWith(before) ? after.slice(before.length) : null;
  return (
    <div className="claw-diff">
      <div><h3>memory.md before</h3><pre>{before}</pre></div>
      <div>
        <h3>memory.md after</h3>
        {added === null ? <pre>{after}</pre> : <pre>{before}{added && <mark>{added}</mark>}</pre>}
        {added === "" && <p className="claw-muted">Unchanged.</p>}
      </div>
    </div>
  );
}
