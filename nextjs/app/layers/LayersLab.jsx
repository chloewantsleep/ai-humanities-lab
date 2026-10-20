"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatShell } from "../components/chat/ChatShell.jsx";
import { PERSONA, SAMPLE_FILE, MEMORY_KEY, MAX_FILES, MAX_FILE_BYTES, assembleLayers, discussionTiming, localAdapter } from "./engine.mjs";

const glossary = "/glossary/interfaces-and-agents/";
const screenshots = [
  ["06-gpt-builder-configure-tab.png", "GPT builder", "01-gpts", "Name, description and instructions. The example is a draft."],
  ["14-claude-project-instructions-dialog.png", "Claude Projects", "02-claude-projects", "The same teaching-fellow instructions in a project dialog."],
  ["19-gemini-gem-editor.png", "Google Gems", "03-gems", "The same persona beside a preview. The Gem is unsaved."],
];

function Term({ slug, children }) {
  return <a href={`${glossary}${slug}`}>{children}</a>;
}

function RequestView({ requests, selected, onSelect }) {
  const request = requests.find(item => item.id === selected) || requests.at(-1);
  if (!request) return <p className="layers-muted">Send a message to capture the first request. This view adds no text to the request.</p>;
  return <>
    <label className="layers-field">Inspect a send
      <select value={request.id} onChange={e => onSelect(Number(e.target.value))}>
        {[...requests].reverse().map(item => <option key={item.id} value={item.id}>Send {item.id} · conversation {item.conversation} · {item.snapshot.engine}</option>)}
      </select>
    </label>
    <p className="layers-muted">{request.snapshot.engine === "local" ? "Local adapter input; no model called." : request.snapshot.engine === "openrouter" ? `Server model-call input · ${request.snapshot.model}.` : "Submitted HTTP input. A failed request does not mean a model received it."} Frozen at send time.</p>
    <p className="layers-muted">Sections join with two newline characters. Empty sections add zero characters. History appears separately below.</p>
    {request.blocks.map(block => <details className="layers-block" key={block.id} open={Boolean(block.text)}>
      <summary>{block.title} <span>{block.text.length} characters</span></summary>
      {block.text ? <pre>{block.text}</pre> : <p>Nothing added.</p>}
    </details>)}
    <details className="layers-block">
      <summary>Conversation history <span>{request.snapshot.messages.length} messages</span></summary>
      <p>Includes the current user turn and earlier turns. Switching a layer off cannot erase its influence on earlier replies; start a new conversation for a clean comparison.</p>
      <pre>{JSON.stringify(request.snapshot.messages, null, 2)}</pre>
    </details>
    <details className="layers-block">
      <summary>Exact shell snapshot · system + messages</summary>
      <p>The system field is the assembled layer text. This is application input, not the provider’s internal chat template.</p>
      <pre>{JSON.stringify(request.snapshot, null, 2)}</pre>
    </details>
  </>;
}

export default function LayersLab() {
  const [configuration, setConfiguration] = useState(true);
  const [name, setName] = useState(PERSONA.name);
  const [description, setDescription] = useState(PERSONA.description);
  const [instructions, setInstructions] = useState(PERSONA.instructions);
  const [filesEnabled, setFilesEnabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [fileStatus, setFileStatus] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [toolEnabled, setToolEnabled] = useState(false);
  const [minutes, setMinutes] = useState("50");
  const [toolResult, setToolResult] = useState(null);
  const [toolError, setToolError] = useState("");
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [memory, setMemory] = useState("");
  const [memoryDraft, setMemoryDraft] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState("");
  const [inspect, setInspect] = useState(true);
  const [engine, setEngine] = useState("local");
  const [conversation, setConversation] = useState(1);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const sequence = useRef(0);
  const pending = useRef(null);
  const assembly = assembleLayers({ configuration, name, description, instructions, filesEnabled, files, toolEnabled, toolResult, memoryEnabled, memory });
  const current = useRef(null);
  current.current = { assembly, conversation };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MEMORY_KEY) || "";
      setMemory(saved.slice(0, 2000));
      setMemoryDraft(saved.slice(0, 2000));
      setMemoryStatus(saved ? "Loaded the saved note from this browser." : "No saved note yet.");
    } catch {
      setMemoryStatus("Browser storage is unavailable. Notes can be used for this visit only.");
    }
    setStorageReady(true);
  }, []);

  // B emits a submitted snapshot, followed (on success) by its authoritative server snapshot.
  // Capture assembly at submission; never relabel an old send with current controls.
  const onRequest = useCallback(snapshot => {
    if (conversation !== current.current.conversation) return; // Ignore a late event from a discarded thread.
    const frozen = structuredClone(snapshot);
    if (snapshot.engine === "openrouter" && pending.current) {
      const id = pending.current;
      setRequests(previous => previous.map(item => item.id === id ? { ...item, snapshot: frozen } : item));
      pending.current = null;
      return;
    }
    const id = ++sequence.current;
    pending.current = snapshot.engine === "http" ? id : null;
    const { assembly: captured, conversation: number } = current.current;
    setRequests(previous => [...previous, { id, conversation: number, snapshot: frozen, blocks: structuredClone(captured.blocks) }]);
    setSelected(id);
  }, [conversation]);

  async function attachFiles(event) {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length + picked.length > MAX_FILES) {
      setFileStatus(`Keep at most ${MAX_FILES} files. Remove one before adding more.`);
      return;
    }
    setLoadingFiles(true);
    try {
      const additions = await Promise.all(picked.map(async file => {
        if (!/\.(txt|md|csv|json)$/i.test(file.name)) throw new Error(`${file.name}: choose .txt, .md, .csv or .json.`);
        if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name}: limit is 8 KiB per file.`);
        let text;
        try { text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); }
        catch { throw new Error(`${file.name}: could not read as UTF-8 text.`); }
        if (text.includes("\0")) throw new Error(`${file.name}: binary content is not supported.`);
        return { name: file.name, text };
      }));
      setFiles(previous => [...previous, ...additions]);
      setFileStatus(`Added ${additions.length} file(s). Full contents enter the next send when enabled.`);
    } catch (error) {
      setFileStatus(error.message);
    } finally { setLoadingFiles(false); }
  }

  function saveMemory(forget = false) {
    const value = forget ? "" : memoryDraft;
    setMemory(value);
    if (forget) setMemoryDraft("");
    try {
      if (forget) localStorage.removeItem(MEMORY_KEY);
      else localStorage.setItem(MEMORY_KEY, value);
      setMemoryStatus(forget ? "Saved note deleted. Earlier request snapshots still contain their original text until reload." : "Note saved in this browser. It enters sends while memory is on.");
    } catch {
      setMemoryStatus("Could not save to browser storage. Note applies to this visit only.");
    }
  }

  return <div className="layers-lab">
    <div className="layers-intro">
      <p className="eyebrow">Same engine · different surroundings</p>
      <h2>Build a course assistant. See what you added.</h2>
      <p>Start with the example from the three builders. Toggle <Term slug="custom-instructions">configuration</Term> and <Term slug="memory">memory</Term>, then compare sends in the <Term slug="trace">trace</Term>. The selected engine stays the same as you change layers.</p>
      <nav className="layers-jumps" aria-label="Experiment sections"><a href="#layers-config-title">Configuration ↓</a><a href="#layers-memory-title">Memory ↓</a><a href="#layers-chat-title">Chat and trace ↓</a></nav>
    </div>

    <div className="layers-builder-grid">
      <section className="layers-panel" aria-labelledby="layers-config-title">
        <div className="layers-section-heading"><h3 id="layers-config-title">01 / Configuration</h3><label className="layers-toggle"><input type="checkbox" checked={configuration} onChange={e => setConfiguration(e.target.checked)} /> Configuration on</label></div>
        <p>A named persona packages <Term slug="custom-instructions">instructions</Term>, <Term slug="knowledge-files">files</Term> and a <Term slug="tool-use">tool</Term>. These controls change context; they do not train the model.</p>
        <fieldset disabled={!configuration} className="layers-fields">
          <legend className="layers-sr-only">Persona configuration</legend>
          <label className="layers-field">Persona name<input value={name} maxLength={100} onChange={e => setName(e.target.value)} /></label>
          <label className="layers-field">Description<textarea rows={2} value={description} maxLength={500} onChange={e => setDescription(e.target.value)} /></label>
          <label className="layers-field">System instructions<textarea rows={6} value={instructions} maxLength={6000} onChange={e => setInstructions(e.target.value)} /></label>
          <button type="button" onClick={() => { setName(PERSONA.name); setDescription(PERSONA.description); setInstructions(PERSONA.instructions); }}>Restore screenshot persona</button>
          <div className="layers-subpanel">
            <label className="layers-toggle"><input type="checkbox" checked={filesEnabled} onChange={e => setFilesEnabled(e.target.checked)} /> Include attached files</label>
            <p>Full text goes into context. No retrieval index. Files remain in this visit; enabled files are sent to the provider if you choose Claude.</p>
            <label className="layers-field">Pick small text files · up to 3, 8 KiB each<input type="file" accept=".txt,.md,.csv,.json" multiple disabled={!filesEnabled || loadingFiles} onChange={attachFiles} /></label>
            <button type="button" disabled={!filesEnabled || loadingFiles || files.length >= MAX_FILES || files.some(file => file.name === SAMPLE_FILE.name)} onClick={() => { setFiles(previous => [...previous, { ...SAMPLE_FILE }]); setFileStatus("Added an invented syllabus for this demonstration; it is not course policy."); }}>Add invented sample syllabus</button>
            <ul className="layers-files">{files.map((file, index) => <li key={`${file.name}-${index}`}><details><summary>{file.name} · {file.text.length} characters</summary><pre>{file.text}</pre></details><button type="button" disabled={loadingFiles} aria-label={`Remove ${file.name}`} onClick={() => setFiles(previous => previous.filter((_, i) => i !== index))}>Remove</button></li>)}</ul>
            <p role="status">{loadingFiles ? "Reading files…" : fileStatus}</p>
          </div>
          <div className="layers-subpanel">
            <label className="layers-toggle"><input type="checkbox" checked={toolEnabled} onChange={e => setToolEnabled(e.target.checked)} /> Include discussion-timing tool</label>
            <p>One browser tool divides a discussion into opening, discussion and closing. You run it; its latest call and result become text for the next send. The model cannot call tools through this text route.</p>
            <div className="layers-inline"><label className="layers-field">Total minutes<input type="number" min="5" max="180" step="1" value={minutes} disabled={!toolEnabled} onChange={e => setMinutes(e.target.value)} /></label>
              <button type="button" disabled={!toolEnabled} onClick={() => { try { setToolResult(discussionTiming(minutes)); setToolError(""); } catch (error) { setToolError(error.message); } }}>Run tool</button></div>
            {toolError && <p role="alert">{toolError}</p>}
            {toolResult && <><pre aria-label="Latest tool result">{JSON.stringify(toolResult, null, 2)}</pre><button type="button" onClick={() => setToolResult(null)}>Clear tool result</button></>}
          </div>
        </fieldset>
      </section>

      <aside className="layers-references" aria-label="The same persona in three product builders">
        <h3>The product versions</h3>
        <p>The saved screenshots show the same Course TF Assistant. Compare their fields with the bare configuration here. Click an image to read it at full size.</p>
        {screenshots.map(([file, title, history, caption]) => <figure key={file}>
          <a href={`/context-media/history/_images/${file}`} target="_blank" rel="noreferrer"><img src={`/context-media/history/_images/${file}`} alt={`${title}: Course TF Assistant instructions and setup`} loading="lazy" width="2048" height="1220" /></a>
          <figcaption><a href={`/history/${history}`}>{title} ↗</a><span>{caption}</span></figcaption>
        </figure>)}
        <p>Also compare <a href="/history/04-chatgpt-projects">ChatGPT Projects: instructions, memory and sources</a>. These captures show fields and drafts, not a test of the products’ behavior.</p>
      </aside>
    </div>

    <section className="layers-panel layers-memory" aria-labelledby="layers-memory-title">
      <div className="layers-section-heading"><h3 id="layers-memory-title">02 / Persistent memory</h3><label className="layers-toggle"><input type="checkbox" checked={memoryEnabled} onChange={e => setMemoryEnabled(e.target.checked)} /> Memory on</label></div>
      <p><Term slug="memory">Memory</Term> is a note you choose to save, separate from <Term slug="conversation-history">conversation history</Term>. Try “I prefer one question at a time.” Save it, turn memory on, then start a new conversation or reload. Only the saved note survives a reload.</p>
      <label className="layers-field">Memory note · saved locally in this browser<textarea rows={2} maxLength={2000} value={memoryDraft} disabled={!storageReady} onChange={e => setMemoryDraft(e.target.value)} /></label>
      <div className="layers-actions"><button type="button" disabled={!storageReady} onClick={() => saveMemory()}>Save memory</button><button type="button" disabled={!storageReady} onClick={() => saveMemory(true)}>Forget saved memory</button><span>{memoryDraft !== memory ? "Unsaved edits; sends use the last saved note." : memoryEnabled ? "Saved note included in new sends." : "Saved note excluded from new sends."}</span></div>
      <p role="status">{memoryStatus}</p>
    </section>

    <div className="layers-run-grid">
      <section className="layers-chat" aria-labelledby="layers-chat-title">
        <h3 id="layers-chat-title">03 / Send with these layers</h3>
        <label className="layers-field">Engine<select value={engine} onChange={e => { setEngine(e.target.value); setConversation(number => number + 1); pending.current = null; }}><option value="local">Local inspection adapter · no key</option><option value="claude">Claude · shared POST /api/chat</option></select></label>
        <p className="layers-muted">{engine === "local" ? "No model is called. The adapter reports what it received; use it to inspect the plumbing." : "Uses the server’s configured model. Without OPENROUTER_API_KEY, sending shows the shared route’s setup error."}</p>
        <div className="layers-actions"><button type="button" onClick={() => { setConversation(number => number + 1); pending.current = null; }}>New conversation</button><span>Conversation {conversation} · {assembly.system.length} system characters queued</span></div>
        <p className="layers-muted">Try: “When is the weekly response due?” or “Help me plan a section.” Edits apply to the next send. New conversation clears chat, retaining the controls, saved memory and this visit’s trace.</p>
        <ChatShell key={`${engine}-${conversation}`} adapter={engine === "local" ? localAdapter : undefined} system={assembly.system} displayName={configuration ? name || "Unnamed persona" : "Unconfigured assistant"} avatar="◇" onRequest={onRequest} />
      </section>
      <section className="layers-panel layers-trace" aria-labelledby="layers-trace-title">
        <div className="layers-section-heading"><h3 id="layers-trace-title">04 / What went in?</h3><label className="layers-toggle"><input type="checkbox" checked={inspect} onChange={e => setInspect(e.target.checked)} /> Show layer trace</label></div>
        {inspect ? <RequestView requests={requests} selected={selected} onSelect={setSelected} /> : <p>Trace hidden. Sends are still captured for this visit.</p>}
      </section>
    </div>

    <section className="layers-next">
      <p className="eyebrow">Beyond this page</p>
      <h3>From configured speaker to acting agent</h3>
      <p>A public presence adds an account and a place to participate. <Term slug="agent">Agency</Term> adds an <Term slug="agent-loop">action loop</Term>, <Term slug="permissions">permissions</Term> and <Term slug="tool-use">tools</Term> the model can invoke. A dedicated <Term slug="agent-computer">computer</Term> adds an environment in which to act. Continue to <a href="/mini-claw">mini-claw →</a> for the next experiment.</p>
    </section>
  </div>;
}
