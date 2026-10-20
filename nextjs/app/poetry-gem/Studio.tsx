"use client";

import { useEffect, useRef, useState } from "react";
import {
  DELIVERIES,
  DELIVERY_LABELS,
  MATERIALS,
  MATERIAL_LABELS,
  PACKS,
  PACK_LABELS,
  type ChatEvent,
  type ChatTurn,
  type PackId,
  type PackInfo,
  type Passage,
  PART_STYLE,
  type SentPart,
  type SentPartKind,
  type Settings,
  type Usage,
} from "@/lib/poetry-gem/options";
import s from "./studio.module.css";
import { Doll, type Band, type DollSpec } from "./doll/Doll";
import Atelier, { type AtelierOptions } from "./doll/Atelier";
import EnsembleSubmission from "./EnsembleSubmission";

type Genre = { id: string; label: string; blurb: string; prompt: string };

type Trace = {
  settings: Settings;
  system: string;
  note?: string;
  injected?: Passage[];
  toolCalls: { query: string; results: Passage[] }[];
  thinking: string;
  usage?: Usage;
  lastRequestTokens?: number;
  cost?: number;
  error?: string;
  parts?: SentPart[];
};
type Message = ChatTurn & { trace?: Trace };

const STARTERS = [
  "Write about waiting for the bus in the rain.",
  "A poem about my phone's cracked screen.",
  "Write about learning to read.",
  "A poem about a chatbot that remembers nothing.",
];

const fmt = (n: number) => n.toLocaleString("en-US");

function costOf(u: Usage, price: { input: number; output: number }) {
  // cache writes bill at 1.25× input, cache reads at 0.1× input
  return (
    (u.input * price.input +
      u.cacheWrite * price.input * 1.25 +
      u.cacheRead * price.input * 0.1 +
      u.output * price.output) /
    1_000_000
  );
}

const specOf = (st: Settings): DollSpec => ({ head: st.genre, torso: st.pack, legs: st.delivery });

export default function Studio({ genres, packs, voices, embedded = false }: { genres: Genre[]; packs: Record<PackId, PackInfo>; voices: Record<PackId, string>; embedded?: boolean }) {
  const Title = embedded ? "h3" : "h1";
  const [settings, setSettings] = useState<Settings>({
    genre: genres[0]?.id ?? "sonnet",
    pack: "frankenstein",
    material: "assigned",
    delivery: "full",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [window_, setWindow] = useState(1_000_000);
  const [lastTokens, setLastTokens] = useState(0);
  const [sessionCost, setSessionCost] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);
  // tokens per character, re-measured from every real request (starts at a rough 1/3)
  const [tokPerChar, setTokPerChar] = useState(1 / 3);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setApiKey(localStorage.getItem("poetry-gem-key") ?? "");
    } catch {}
  }, []);
  useEffect(() => {
    // Scroll the chat only. The embedded studio must never pull readers down the timeline.
    const thread = endRef.current?.parentElement;
    if (messages.length && thread) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setSettings((p) => ({ ...p, [k]: v }));
  const levels = packs[settings.pack].levels;
  const stat = levels[settings.material];
  const genre = genres.find((g) => g.id === settings.genre);
  const framingPrompt = customPrompts[settings.genre] ?? genre?.prompt ?? "";
  const atelierOptions: AtelierOptions = {
    head: genres.map((g) => ({ id: g.id, label: g.label })),
    torso: PACKS.map((p) => ({ id: p, label: PACK_LABELS[p] })),
    legs: DELIVERIES.map((d) => ({ id: d, label: DELIVERY_LABELS[d].label })),
  };
  const onDress = (band: Band, id: string) =>
    set(band === "head" ? "genre" : band === "torso" ? "pack" : "delivery", id as never);

  // What the NEXT request will contain, in characters, part by part. Every turn re-sends all of it.
  const hasPack = settings.pack !== "none";
  const retrieving = hasPack && (settings.delivery === "lexical" || settings.delivery === "semantic");
  const nextChars: Partial<Record<SentPartKind, number>> = {
    instructions: framingPrompt.length + (hasPack ? 200 : 0),
    pack: hasPack && settings.delivery === "full" ? (stat?.chars ?? 0) + 60 : 0,
    retrieved: retrieving && stat?.passages ? Math.round((stat.chars / stat.passages) * 5) : 0,
    "you-before": messages.filter((m) => m.role === "user").reduce((n, m) => n + m.content.length, 0),
    "bot-before": messages.filter((m) => m.role === "assistant").reduce((n, m) => n + m.content.length, 0),
    message: draft.length,
  };
  const nextTokens = Object.fromEntries(
    Object.entries(nextChars).map(([k, c]) => [k, Math.round((c ?? 0) * tokPerChar)]),
  ) as Partial<Record<SentPartKind, number>>;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history: ChatTurn[] = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: "user", content },
    ];
    const trace: Trace = { settings: { ...settings }, system: "", toolCalls: [], thinking: "" };
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: "", trace }]);
    setDraft("");
    setBusy(true);

    const update = (fn: (m: Message) => Message) =>
      setMessages((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);

    try {
      const res = await fetch("/api/poetry-gem/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(apiKey ? { "x-openrouter-key": apiKey } : {}) },
        body: JSON.stringify({ settings, messages: history, framingPrompt }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        update((m) => ({ ...m, trace: { ...m.trace!, error: err.error ?? "Request failed" } }));
        return;
      }
      let sentChars = 0;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line) as ChatEvent;
          switch (ev.type) {
            case "context":
              update((m) => ({
                ...m,
                trace: { ...m.trace!, system: ev.system, note: ev.note, injected: ev.injected },
              }));
              break;
            case "thinking":
              update((m) => ({ ...m, trace: { ...m.trace!, thinking: m.trace!.thinking + ev.delta } }));
              break;
            case "text":
              update((m) => ({ ...m, content: m.content + ev.delta }));
              break;
            case "tool_call":
              update((m) => ({
                ...m,
                trace: { ...m.trace!, toolCalls: [...m.trace!.toolCalls, { query: ev.query, results: ev.results }] },
              }));
              break;
            case "sent":
              sentChars = ev.parts.reduce((n, part) => n + part.text.length, 0);
              update((m) => ({ ...m, trace: { ...m.trace!, parts: ev.parts } }));
              break;
            case "usage": {
              const cost = costOf(ev.usage, ev.price);
              if (sentChars && ev.lastRequestTokens) setTokPerChar(ev.lastRequestTokens / sentChars);
              setWindow(ev.contextWindow);
              setLastTokens(ev.lastRequestTokens);
              setSessionCost((c) => c + cost);
              setSessionTokens((t) => t + ev.usage.input + ev.usage.cacheRead + ev.usage.cacheWrite + ev.usage.output);
              update((m) => ({
                ...m,
                trace: { ...m.trace!, usage: ev.usage, lastRequestTokens: ev.lastRequestTokens, cost },
              }));
              break;
            }
            case "error":
              update((m) => ({ ...m, trace: { ...m.trace!, error: ev.message } }));
              break;
          }
        }
      }
    } catch (e) {
      update((m) => ({ ...m, trace: { ...m.trace!, error: e instanceof Error ? e.message : String(e) } }));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setMessages([]);
    setLastTokens(0);
    setSessionCost(0);
    setSessionTokens(0);
  }

  return (
    <div className={`${s.shell}${embedded ? ` ${s.embedded}` : ""}`}>
      <aside className={s.builder}>
        <Title className={s.title}>Poetry Gem</Title>
        <a className={s.browse} href="/poetry-gem/library" target="_blank" rel="noreferrer">
          Library: all prompts and packs ↗
        </a>
        <p className={s.lede}>
          Choose instructions and source texts. Ask for a poem, then inspect the input sent to the model.
        </p>

        <Section n="1" title="Instructions" hint="The system prompt: what kind of poem to write.">
          {genres.map((g) => (
            <Choice
              key={g.id}
              name="genre"
              checked={settings.genre === g.id}
              onChange={() => set("genre", g.id)}
              label={g.label}
              blurb={g.blurb}
            />
          ))}
          <a className={s.browse} href={`/poetry-gem/prompts/${settings.genre}`} target="_blank" rel="noreferrer">
            Read the full {genre?.label ?? ""} prompt ↗
          </a>
          <details className={s.keyBox}>
            <summary>Edit instructions</summary>
            <textarea className={s.promptInput} aria-label="Bot instructions" rows={8} maxLength={20_000}
              value={framingPrompt} disabled={busy} onChange={e => {
                setCustomPrompts(previous => ({ ...previous, [settings.genre]: e.target.value }));
                setMessages([]);
              }} />
            <p className={s.meta}>These instructions apply to your next test and your Ensemble submission. Editing starts a new conversation.</p>
          </details>
        </Section>

        <Section n="2" title="Knowledge" hint="Choose the source text and how the model receives it.">
          <div className={s.subhead}>Which reading</div>
          <div className={s.row}>
            {PACKS.map((p) => (
              <Pill key={p} checked={settings.pack === p} onChange={() => set("pack", p)} label={PACK_LABELS[p]} />
            ))}
          </div>
          {settings.pack === "none" ? (
            <p className={s.meta}>No pack: the model works from the instructions alone.</p>
          ) : (
            <div className={s.nested}>
              <div className={s.subhead}>How much of the text</div>
              {/* a ladder: each step hands the model more of the reading */}
              <div className={s.ladder}>
                {MATERIALS.map((m) => {
                  const max = Math.max(...MATERIALS.map((x) => levels[x].approxTokens), 1);
                  return (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={settings.material === m}
                      className={`${s.rung} ${settings.material === m ? s.on : ""}`}
                      onClick={() => set("material", m)}
                      title={levels[m].blurb}
                    >
                      <span className={s.rungLabel}>{levels[m].label}</span>
                      <span className={s.rungBar}>
                        <i style={{ width: `${Math.max(1.5, (levels[m].approxTokens / max) * 100)}%` }} />
                      </span>
                      <small>≈ {fmt(levels[m].approxTokens)}</small>
                    </button>
                  );
                })}
              </div>
              <p className={s.meta}>
                {stat.blurb} {fmt(stat.passages)} searchable passages.
              </p>
              <a className={s.browse} href={`/poetry-gem/packs/${settings.pack}`} target="_blank" rel="noreferrer">
                Browse the {PACK_LABELS[settings.pack]} pack ↗
              </a>

              <div className={s.subhead}>How it reaches the model</div>
              {DELIVERIES.map((d) => (
                <Choice
                  key={d}
                  name="delivery"
                  checked={settings.delivery === d}
                  onChange={() => set("delivery", d)}
                  label={DELIVERY_LABELS[d].label}
                  blurb={DELIVERY_LABELS[d].blurb}
                />
              ))}
              <a className={s.browse} href="/poetry-gem/vectors" target="_blank" rel="noreferrer">
                Explore search results on a vector map ↗
              </a>
            </div>
          )}
        </Section>

        <details className={s.keyBox}>
          <summary>API key</summary>
          <p className={s.meta}>
            Optional. Paste an OpenRouter key if the server doesn&apos;t have one. It&apos;s kept in this browser only.
          </p>
          <input
            type="password"
            className={s.keyInput}
            value={apiKey}
            placeholder="sk-or-…"
            onChange={(e) => {
              setApiKey(e.target.value);
              try {
                localStorage.setItem("poetry-gem-key", e.target.value);
              } catch {}
            }}
          />
        </details>
      </aside>

      <section className={s.chat} aria-label="Poetry conversation">
        <ContextBars
          next={nextTokens}
          window={window_}
          lastActual={lastTokens}
          searching={hasPack && settings.delivery === "agentic"}
          searched={
            hasPack && settings.delivery !== "full"
              ? { tokens: Math.round(stat.chars * tokPerChar), how: settings.delivery === "agentic" ? "model" : "retrieval" }
              : null
          }
          sessionTokens={sessionTokens}
          sessionCost={sessionCost}
        />

        <div className={s.thread}>
          {messages.length === 0 && (
            <div className={s.empty}>
              <Atelier
                spec={specOf(settings)}
                options={atelierOptions}
                onChange={onDress}
                caption={`${genre?.label ?? settings.genre} · ${PACK_LABELS[settings.pack]}${settings.pack !== "none" ? ` · ${DELIVERY_LABELS[settings.delivery].label}` : ""}`}
              />
              <div className={s.emptyText}>
                <h2 className={s.emptyHead}>Choose the bot settings</h2>
                <p>
                  The figure shows three settings: <b>head</b> for instructions, <b>bodice</b> for source text,
                  and <b>skirt</b> for text delivery. Use the arrows or controls to change them.
                </p>
                <div className={s.row}>
                  {STARTERS.map((t) => (
                    <button key={t} className={s.starter} onClick={() => send(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className={s.user}>
                {m.content}
              </div>
            ) : (
              <Reply key={i} m={m} streaming={busy && i === messages.length - 1} />
            ),
          )}
          <div ref={endRef} />
        </div>

        <form
          className={s.composer}
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <textarea
            value={draft}
            placeholder={
              messages.length ? "Ask for a revision or explanation." : "What should the poem be about?"
            }
            rows={2}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          <div className={s.composerButtons}>
            <button type="submit" disabled={busy || !draft.trim()} className={s.primary}>
              {busy ? "Writing…" : "Send"}
            </button>
            <button type="button" onClick={reset} disabled={busy || !messages.length} className={s.ghost}>
              New chat
            </button>
          </div>
        </form>
      </section>
      <EnsembleSubmission settings={settings} prompt={framingPrompt} knowledge={voices[settings.pack] ?? ""} busy={busy} />
    </div>
  );
}

function Section({ n, title, hint, children }: { n: string; title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className={s.section}>
      <h2>
        <span className={s.num}>{n}</span> {title}
      </h2>
      <p className={s.hint}>{hint}</p>
      {children}
    </section>
  );
}

function Choice(props: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  blurb: string;
  disabled?: boolean;
}) {
  return (
    <label className={`${s.choice} ${props.checked ? s.on : ""} ${props.disabled ? s.disabled : ""}`}>
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <span>
        <strong>{props.label}</strong>
        <small>{props.blurb}</small>
      </span>
    </label>
  );
}

function Pill({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" aria-pressed={checked} className={`${s.pill} ${checked ? s.on : ""}`} onClick={onChange}>
      {label}
    </button>
  );
}

const ORDER: SentPartKind[] = ["instructions", "pack", "you-before", "bot-before", "retrieved", "search", "bot-now", "message"];
const pctText = (x: number) => (x >= 10 ? x.toFixed(0) : x >= 1 ? x.toFixed(1) : x.toFixed(2)) + "%";

/** One stacked bar: each part's share of `total`. */
function Stack({ tokens, total, labels }: { tokens: Partial<Record<SentPartKind, number>>; total: number; labels?: boolean }) {
  return (
    <>
      {ORDER.filter((k) => (tokens[k] ?? 0) > 0).map((k) => {
        const share = ((tokens[k] ?? 0) / total) * 100;
        return (
          <div
            key={k}
            className={s.seg}
            style={{ width: `${share}%`, background: PART_STYLE[k].color }}
            title={`${PART_STYLE[k].label}: ≈ ${fmt(tokens[k] ?? 0)} tokens (${pctText(share)})`}
          >
            {labels && share > 9 && <span>{PART_STYLE[k].label} · {pctText(share)}</span>}
          </div>
        );
      })}
    </>
  );
}

/**
 * Two bars for the next request: to scale against the whole context window (usually a sliver), and
 * zoomed in so the parts are readable. Part sizes are estimated from text length, calibrated against
 * the token count the API reported for the previous request.
 */
function ContextBars(p: {
  next: Partial<Record<SentPartKind, number>>;
  window: number;
  lastActual: number;
  searching: boolean;
  /** For retrieval and model search: how big the pack being searched is (it is not all sent). */
  searched: { tokens: number; how: "retrieval" | "model" } | null;
  sessionTokens: number;
  sessionCost: number;
}) {
  const total = Math.max(1, Object.values(p.next).reduce((n, x) => n + (x ?? 0), 0));
  const used = (total / p.window) * 100;
  const sliver = Math.max(used, 0.25); // keep a visible sliver
  return (
    <div className={s.gauge}>
      <div className={s.barLabel}>
        <b>Next request, to scale</b> — ≈ {fmt(total)} of {fmt(p.window)} tokens ({pctText(used)} of the context window)
      </div>
      <div className={s.gaugeBar}>
        {p.searched && (
          // the haystack: the whole pack being searched, drawn to the same scale, behind what is actually sent
          <div
            className={s.searched}
            style={{ width: `${Math.min(100, Math.max(0.25, (p.searched.tokens / p.window) * 100))}%` }}
            title={`The pack being searched: ≈ ${fmt(p.searched.tokens)} tokens. Only the passages found are sent.`}
          />
        )}
        <div className={s.scaled} style={{ width: `${Math.min(100, sliver)}%` }}>
          <Stack tokens={p.next} total={total} />
        </div>
      </div>
      {p.searched && (
        <p className={s.searchNote}>
          <i className={s.swSearched} /> <b>Searched: ≈ {fmt(p.searched.tokens)} tokens</b> of the pack ·{" "}
          <b>sent: ≈ {fmt(total)}</b>.{" "}
          {p.searched.how === "retrieval"
            ? "Retrieval selects up to 5 matching passages from the pack."
            : "The model receives passages returned by its searches."}
        </p>
      )}
      <svg className={s.funnel} viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden>
        <polygon points={`0,0 ${Math.min(1000, sliver * 10)},0 1000,20 0,20`} />
      </svg>
      <div className={s.barLabel}>
        <b>Request contents</b>. Each request includes the conversation history
        {p.searching && "; searches add more during the turn"}.
      </div>
      <div className={`${s.gaugeBar} ${s.zoomBar}`}>
        <Stack tokens={p.next} total={total} labels />
      </div>
      <div className={s.gaugeLegend}>
        {ORDER.filter((k) => (p.next[k] ?? 0) > 0).map((k) => (
          <span key={k}>
            <i style={{ background: PART_STYLE[k].color }} /> {PART_STYLE[k].label}: ≈ {fmt(p.next[k] ?? 0)} (
            {pctText(((p.next[k] ?? 0) / total) * 100)})
          </span>
        ))}
        <span className={s.legendRight}>
          last request (measured): {fmt(p.lastActual)} · conversation total: {fmt(p.sessionTokens)} tokens · ≈ $
          {p.sessionCost.toFixed(3)}
        </span>
      </div>
    </div>
  );
}

/** Everything one request sent, in order, as the single document the model actually reads. */
function WholeInput({ parts, tokens }: { parts: SentPart[]; tokens?: number }) {
  const chars = parts.reduce((n, x) => n + x.text.length, 0) || 1;
  const perKind: Partial<Record<SentPartKind, number>> = {};
  for (const x of parts) perKind[x.kind] = (perKind[x.kind] ?? 0) + x.text.length;
  const LIMIT = 1600;
  return (
    <>
      <h4>Complete model input{tokens ? ` (${fmt(tokens)} tokens)` : ""}</h4>
      <p className={s.meta}>
        Each request includes the instructions, selected source text, and conversation history shown below.
      </p>
      <div className={`${s.gaugeBar} ${s.zoomBar} ${s.miniBar}`}>
        <Stack tokens={perKind} total={chars} labels />
      </div>
      <div className={s.whole}>
        {parts.map((x, i) => (
          <div key={i} className={s.part} style={{ borderLeftColor: PART_STYLE[x.kind].color }}>
            <span className={s.partLabel} style={{ color: PART_STYLE[x.kind].color }}>
              {x.label} · {pctText((x.text.length / chars) * 100)}
            </span>
            {x.text.length > LIMIT ? (
              <>
                {x.text.slice(0, LIMIT)}
                <em className={s.more}> … {fmt(x.text.length - LIMIT)} more characters</em>
              </>
            ) : (
              x.text
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Reply({ m, streaming }: { m: Message; streaming: boolean }) {
  const t = m.trace!;
  return (
    <div className={s.replyRow}>
      <Doll spec={specOf(t.settings)} crop="tight" className={s.sticker} title="Settings used for this reply" />
      <div className={s.reply}>
        <div className={s.chips}>
          <span>{t.settings.genre}</span>
          <span>{PACK_LABELS[t.settings.pack]}</span>
          {t.settings.pack !== "none" && (
            <>
              <span>{MATERIAL_LABELS[t.settings.material].label}</span>
              <span>{DELIVERY_LABELS[t.settings.delivery].label}</span>
            </>
          )}
        </div>
        {t.toolCalls.map((c, i) => (
          <div key={i} className={s.toolLine}>
            🔎 searched the pack for <q>{c.query}</q>:{" "}
            {c.results.length ? `${c.results.length} passage(s)` : "nothing found"}
          </div>
        ))}
        <div className={s.poem}>{m.content || (streaming ? (t.thinking ? "Thinking…" : "…") : "")}</div>
        {t.error && <div className={s.error}>{t.error}</div>}

        <details className={s.inspector}>
          <summary>Model input</summary>
          {t.usage && (
            <p className={s.meta}>
              {t.usage.calls} API call{t.usage.calls === 1 ? "" : "s"} · last request {fmt(t.lastRequestTokens ?? 0)}{" "}
              input tokens ({fmt(t.usage.cacheRead)} read from cache) · {fmt(t.usage.output)} output tokens · ≈ $
              {t.cost?.toFixed(4)}
            </p>
          )}
          {t.parts ? (
            <WholeInput parts={t.parts} tokens={t.lastRequestTokens} />
          ) : (
            <>
              <h4>System prompt ({fmt(t.system.length)} characters)</h4>
              <pre className={s.pre}>
                {t.system.length > 6000
                  ? t.system.slice(0, 6000) + `\n\n… [${fmt(t.system.length - 6000)} more characters]`
                  : t.system}
              </pre>
            </>
          )}
          {t.note && <p className={s.meta}>{t.note}</p>}
          {t.injected && t.injected.length > 0 && (
            <>
              <h4>Passages added to your message</h4>
              <PassageList items={t.injected} />
            </>
          )}
          {t.toolCalls.map((c, i) => (
            <div key={i}>
              <h4>
                Tool call {i + 1}: search_pack(<q>{c.query}</q>)
              </h4>
              {c.results.length ? <PassageList items={c.results} /> : <p className={s.meta}>No passages matched.</p>}
            </div>
          ))}
          {t.thinking && (
            <>
              <h4>Model&apos;s reasoning (summarized)</h4>
              <pre className={s.pre}>{t.thinking}</pre>
            </>
          )}
        </details>
      </div>
    </div>
  );
}

function PassageList({ items }: { items: Passage[] }) {
  return (
    <ol className={s.passages}>
      {items.map((p, i) => (
        <li key={i}>
          <details>
            <summary>
              {p.title}{" "}
              <small>
                ({p.source}
                {p.score !== undefined ? `, score ${p.score}` : ""})
              </small>
            </summary>
            <pre className={s.pre}>{p.text}</pre>
          </details>
        </li>
      ))}
    </ol>
  );
}
