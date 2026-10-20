"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatShell } from "../components/chat/ChatShell.jsx";
import { DEFAULT_MODEL, KNOWLEDGE_WORD_LIMIT, buildSystemPrompt, countWords, serializeBotFile, slugify, validateBot } from "../../lib/bots-format.mjs";
import { BASE_MODELS_NOTE, MODELS_CHECKED, MODEL_GROUPS, OTHER_MODEL, describeModel } from "./models.mjs";
import { emojiCharacter } from "./emoji.mjs";

// The bot lab: pick a bot file (or start one), edit its fields and system prompt on the left, talk to it on the right.
// Every edit applies to the next message. The chat is the shared ChatShell over /api/chat; the model goes to that
// route as ?model= (the shell's body is fixed to { system, messages }). Files are read and written by the two routes
// in app/api/bot-lab/, through lib/bots.mjs.

const NEW_BOT = { name: "", slug: "", author: "", model: "", emoji: "", description: "", knowledge: "", body: "", extra: {} };
const NEW = "__new__";
const UPLOAD = "__upload__";
const NONE = "";

function pick(bot) {
  return { name: bot.name ?? "", slug: bot.slug ?? "", author: bot.author ?? "", model: bot.model ?? "", emoji: bot.emoji ?? "", description: bot.description ?? "", knowledge: bot.knowledge ?? "", body: bot.body ?? "", extra: bot.extra ?? {} };
}

export default function BotLab() {
  const [library, setLibrary] = useState({ bots: [], knowledge: [], defaultModel: DEFAULT_MODEL, loaded: false, error: "" });
  const [selected, setSelected] = useState(NEW);
  const [draft, setDraft] = useState(NEW_BOT);
  const [slugTouched, setSlugTouched] = useState(false);
  const [knowledgeText, setKnowledgeText] = useState("");
  const [modelChoice, setModelChoice] = useState(DEFAULT_MODEL);
  const [otherModel, setOtherModel] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [trace, setTrace] = useState(null);
  const [chatKey, setChatKey] = useState(0);
  const [save, setSave] = useState({ state: "idle", message: "", errors: [] });
  const [upload, setUpload] = useState({ state: "idle", message: "" });
  const fileInput = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/bot-lab/bots", { cache: "no-store" });
      const data = await response.json();
      setLibrary({ bots: data.bots ?? [], knowledge: data.knowledge ?? [], defaultModel: data.defaultModel || DEFAULT_MODEL, loaded: true, error: "" });
      return data;
    } catch (error) {
      setLibrary((l) => ({ ...l, loaded: true, error: `Couldn't list the bots: ${error.message}` }));
      return null;
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const model = modelChoice === OTHER_MODEL ? otherModel.trim() : modelChoice;
  const modelInfo = describeModel(model);
  const system = useMemo(() => buildSystemPrompt(draft, knowledgeText), [draft, knowledgeText]);
  const check = useMemo(() => validateBot({ ...draft, slug: draft.slug || slugify(draft.name) }), [draft]);
  const fileText = useMemo(() => serializeBotFile({ ...draft, slug: draft.slug || slugify(draft.name) }), [draft]);
  const speaker = draft.name.trim() || "Your bot";
  const knowledgeWords = countWords(knowledgeText);

  function chooseModel(id) {
    if (!id) { setModelChoice(library.defaultModel); return; }
    if (describeModel(id)) setModelChoice(id);
    else { setModelChoice(OTHER_MODEL); setOtherModel(id); }
  }

  function choose(slugOrNew) {
    setSelected(slugOrNew);
    setSave({ state: "idle", message: "", errors: [] });
    setTrace(null);
    setChatKey((k) => k + 1);
    if (slugOrNew === NEW) {
      setDraft(NEW_BOT); setSlugTouched(false); setKnowledgeText(""); chooseModel(library.defaultModel);
      return;
    }
    const bot = library.bots.find((b) => b.slug === slugOrNew && (slugOrNew.includes("/") ? false : true));
    if (!bot) return;
    setDraft(pick(bot)); setSlugTouched(true); setKnowledgeText(bot.knowledgeText ?? ""); chooseModel(bot.model || library.defaultModel);
  }

  function edit(field, value) {
    setDraft((d) => {
      const next = { ...d, [field]: value };
      if (field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
    if (field === "slug") setSlugTouched(true);
    if (save.state === "saved") setSave({ state: "idle", message: "", errors: [] });
  }

  function chooseKnowledge(value) {
    if (value === UPLOAD) { fileInput.current?.click(); return; }
    if (value === NONE) { edit("knowledge", ""); setKnowledgeText(""); return; }
    const entry = library.knowledge.find((k) => k.path === value);
    edit("knowledge", value);
    setKnowledgeText(entry?.text ?? "");
  }

  async function uploadKnowledge(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUpload({ state: "saving", message: `Reading ${file.name}…` });
    const text = await file.text();
    const words = countWords(text);
    if (words > KNOWLEDGE_WORD_LIMIT) { setUpload({ state: "error", message: `${file.name} is ${words.toLocaleString()} words; one short text under about ${KNOWLEDGE_WORD_LIMIT.toLocaleString()} fits. For long texts, see /retrieval.` }); return; }
    try {
      const response = await fetch("/api/bot-lab/knowledge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: file.name, text }) });
      const result = await response.json();
      if (!result.ok) { setUpload({ state: "error", message: result.errors?.join(" ") || "Upload failed." }); return; }
      await refresh();
      edit("knowledge", result.path);
      setKnowledgeText(text);
      setUpload({ state: "saved", message: `Saved as bots/${result.path} (${words.toLocaleString()} words). It is pasted into the prompt whole.` });
    } catch (error) {
      setUpload({ state: "error", message: `Upload failed: ${error.message}` });
    }
  }

  async function saveBot() {
    setSave({ state: "saving", message: "Saving…", errors: [] });
    const bot = { ...draft, slug: draft.slug || slugify(draft.name), model: model && model !== library.defaultModel ? model : draft.model };
    try {
      const response = await fetch("/api/bot-lab/bots", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bot }) });
      const result = await response.json();
      if (!result.ok) { setSave({ state: "error", message: "Not saved.", errors: result.errors ?? ["Unknown error."] }); return; }
      setDraft((d) => ({ ...d, model: bot.model }));
      await refresh();
      setSelected(result.slug);
      setSave({ state: "saved", message: `Saved to nextjs/bots/${result.file}. Open it in Claude Code, or submit it to the Ensemble.`, errors: [] });
    } catch (error) {
      setSave({ state: "error", message: "Not saved.", errors: [error.message] });
    }
  }

  function download() {
    const slug = draft.slug || slugify(draft.name) || "my-bot";
    const url = URL.createObjectURL(new Blob([fileText], { type: "text/markdown" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${slug}.md` });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  const room = library.bots.filter((b) => !b.example);
  const examples = library.bots.filter((b) => b.example);
  const avatar = emojiCharacter(draft.emoji);

  return (
    <div className="bot-lab">
      <div className="bot-lab-bar">
        <label className="bot-lab-field bot-lab-pick">
          <span>Bot</span>
          <select value={selected} onChange={(e) => choose(e.target.value)} disabled={!library.loaded}>
            <option value={NEW}>New bot…</option>
            {room.length > 0 && <optgroup label="The room's bots (bots/)">{room.map((b) => <option key={b.slug} value={b.slug}>{b.name || b.slug}{b.ok ? "" : " (invalid)"}</option>)}</optgroup>}
            {examples.length > 0 && <optgroup label="Examples (bots/_examples/)">{examples.map((b) => <option key={b.slug} value={b.slug}>{b.name || b.slug}{b.ok ? "" : " (invalid)"}</option>)}</optgroup>}
          </select>
        </label>
        <label className="bot-lab-field bot-lab-model">
          <span>Model</span>
          <select value={modelChoice} onChange={(e) => setModelChoice(e.target.value)}>
            {MODEL_GROUPS.map((group) => <optgroup key={group.label} label={group.label}>{group.models.map((m) => <option key={m.id} value={m.id}>{m.name} · {m.id}</option>)}</optgroup>)}
            <optgroup label="Base models"><option disabled>{BASE_MODELS_NOTE.split(":")[0]} (see the note)</option></optgroup>
            <optgroup label="Any OpenRouter id"><option value={OTHER_MODEL}>Other: type an id…</option></optgroup>
          </select>
        </label>
        {modelChoice === OTHER_MODEL && <label className="bot-lab-field bot-lab-other"><span>OpenRouter id</span><input value={otherModel} onChange={(e) => setOtherModel(e.target.value)} placeholder="vendor/model-name" spellCheck={false} /></label>}
      </div>
      <p className="bot-lab-modelnote">{modelInfo ? <>{modelInfo.name}: {modelInfo.note} <span className="muted">Prices per million tokens, in / out, checked {MODELS_CHECKED}.</span></> : model ? <>Any id OpenRouter serves; if it doesn't, the reply says so.</> : <>Choose a model.</>} <span className="muted">{BASE_MODELS_NOTE}</span></p>

      {library.error && <p className="bot-lab-error" role="alert">{library.error}</p>}

      <div className="bot-lab-columns">
        <section className="bot-lab-editor" aria-label="The bot file">
          <div className="bot-lab-grid">
            <label className="bot-lab-field"><span>Name</span><input value={draft.name} onChange={(e) => edit("name", e.target.value)} placeholder="The Creature" /></label>
            <label className="bot-lab-field"><span>Slug <small>(the file name)</small></span><input value={draft.slug} onChange={(e) => edit("slug", e.target.value)} placeholder="the-creature" spellCheck={false} /></label>
            <label className="bot-lab-field"><span>Author</span><input value={draft.author} onChange={(e) => edit("author", e.target.value)} placeholder="Your name" /></label>
            <label className="bot-lab-field"><span>Emoji <small>(Slack shortcode)</small></span><input value={draft.emoji} onChange={(e) => edit("emoji", e.target.value)} placeholder=":zombie:" spellCheck={false} /></label>
            <label className="bot-lab-field bot-lab-wide"><span>Description <small>(one line)</small></span><input value={draft.description} onChange={(e) => edit("description", e.target.value)} placeholder="Who this is, in a sentence." /></label>
            <label className="bot-lab-field bot-lab-wide"><span>Reference text <small>(optional; one short text, pasted into the prompt whole)</small></span>
              <select value={draft.knowledge && library.knowledge.some((k) => k.path === draft.knowledge) ? draft.knowledge : draft.knowledge ? draft.knowledge : NONE} onChange={(e) => chooseKnowledge(e.target.value)}>
                <option value={NONE}>None</option>
                {draft.knowledge && !library.knowledge.some((k) => k.path === draft.knowledge) && <option value={draft.knowledge}>{draft.knowledge} (not found)</option>}
                {library.knowledge.map((k) => <option key={k.path} value={k.path}>{k.path} · {k.words.toLocaleString()} words</option>)}
                <option value={UPLOAD}>Upload a .md or .txt file…</option>
              </select>
              <input ref={fileInput} type="file" accept=".md,.txt,text/plain,text/markdown" onChange={uploadKnowledge} hidden />
            </label>
          </div>
          {upload.message && <p className={`bot-lab-note ${upload.state === "error" ? "bot-lab-error" : ""}`} role={upload.state === "error" ? "alert" : "status"}>{upload.message}</p>}
          <label className="bot-lab-field bot-lab-prompt"><span>System prompt <small>(the bot's voice and instructions; everything below the frontmatter)</small></span>
            <textarea value={draft.body} onChange={(e) => edit("body", e.target.value)} rows={14} placeholder="You are…" />
          </label>
          <p className="bot-lab-counts muted">{countWords(draft.body).toLocaleString()} words in the prompt{knowledgeText ? `, plus ${knowledgeWords.toLocaleString()} in the reference text` : ""}. Edits apply to your next message.</p>

          {(check.errors.length > 0 || check.warnings.length > 0) && (
            <ul className="bot-lab-problems">
              {check.errors.map((e) => <li key={e} className="bot-lab-error">{e}</li>)}
              {check.warnings.map((w) => <li key={w} className="muted">{w}</li>)}
            </ul>
          )}

          <div className="bot-lab-actions">
            <button type="button" onClick={saveBot} disabled={!check.ok || save.state === "saving"}>Save to bots/{draft.slug || slugify(draft.name) || "…"}.md</button>
            <button type="button" className="secondary" onClick={download} disabled={!check.ok}>Download my bot file</button>
            <button type="button" className="secondary" onClick={() => setShowPrompt((s) => !s)} aria-pressed={showPrompt}>{showPrompt ? "Hide" : "Show"} what the model gets</button>
          </div>
          {save.message && <p className={`bot-lab-note ${save.state === "error" ? "bot-lab-error" : ""}`} role={save.state === "error" ? "alert" : "status"}>{save.message}{save.errors.map((e) => <span key={e}> {e}</span>)}</p>}
        </section>

        <section className="bot-lab-chat" aria-label="Chat with the bot">
          <div className="bot-lab-chathead">
            <p className="bot-lab-speaker">{avatar && <span aria-hidden="true">{avatar} </span>}{speaker} <span className="muted">· {model || "no model"}</span></p>
            <button type="button" className="secondary small" onClick={() => { setChatKey((k) => k + 1); setTrace(null); }}>Clear conversation</button>
          </div>
          <ChatShell key={chatKey} api={`/api/chat?model=${encodeURIComponent(model)}`} system={system} displayName={speaker} avatar={avatar} onRequest={setTrace} />
        </section>
      </div>

      {showPrompt && (
        <section className="bot-lab-reveal" aria-label="What the model gets">
          <h2>What the model gets</h2>
          <p className="muted">Model: <code>{model}</code>. The system message below goes first, exactly as shown; then the conversation so far, as alternating user and assistant turns. Nothing else is sent: no retrieval, no tools, no memory beyond this page.</p>
          <p className="bot-lab-label">System message · {countWords(system).toLocaleString()} words{knowledgeText ? " (prompt, then the reference text under its marker line)" : ""}</p>
          <pre className="bot-lab-pre">{system || "(empty: write a system prompt)"}</pre>
          <p className="bot-lab-label">Last request actually sent{trace?.model ? <> · <code>{trace.model}</code> · {trace.messages?.length ?? 0} messages</> : trace ? <> · {trace.messages?.length ?? 0} messages (the server's copy arrives as the reply streams)</> : ": none yet"}</p>
          {trace && <pre className="bot-lab-pre">{JSON.stringify(trace.messages, null, 2)}</pre>}
          <p className="bot-lab-label">The file, as it is saved</p>
          <pre className="bot-lab-pre">{fileText}</pre>
        </section>
      )}
    </div>
  );
}
