"use client";

import ReactMarkdown from "react-markdown";
import ElizaDemo from "./ElizaDemo.jsx";
import SpiralDemo from "./SpiralDemo.jsx";
import HhhDemo from "./HhhDemo.jsx";
import GemPieces from "./GemPieces.jsx";

// What the sticky panel shows for one step (see content/story/README.md for the fields). The same component draws the
// sticky panel on wide screens (mode "sticky"), the figure above each step on phones ("inline"), and the figure in the
// printed essay ("print", where live demos show their fallback).

// Markdown inside a panel field (a citation, a caption), without the paragraph around it.
function Inline({ children }) {
  if (!children) return null;
  return (
    <ReactMarkdown
      allowedElements={["a", "em", "strong", "code", "p", "br"]}
      unwrapDisallowed
      components={{
        p: ({ children: inner }) => <>{inner}</>,
        a: ({ href, children: inner }) => <a href={href} {...(/^https?:/i.test(href || "") ? { target: "_blank", rel: "noreferrer" } : {})}>{inner}</a>,
      }}
    >
      {String(children)}
    </ReactMarkdown>
  );
}

function Source({ panel }) {
  if (!panel.cite && !panel.credit) return null;
  return (
    <p className="panel-source">
      <Inline>{panel.cite || panel.credit}</Inline>
      {panel.href && <> · <a href={panel.href} {...(/^https?:/i.test(panel.href) ? { target: "_blank", rel: "noreferrer" } : {})}>source</a></>}
    </p>
  );
}

// The intervention ladder: what shapes the speaker, from the weights up to the person typing.
export const RUNGS = [
  { key: "pretraining", label: "Training on text", zone: "weights" },
  { key: "demonstrations", label: "Training on example answers", zone: "weights" },
  { key: "preferences", label: "Training on ranked answers", zone: "weights" },
  { key: "principles", label: "Principles used to review answers", zone: "weights" },
  { key: "script", label: "Instructions in the prompt", zone: "context" },
  { key: "texts", label: "Source texts in the context", zone: "context" },
  { key: "memory", label: "Saved information from earlier conversations", zone: "context" },
  { key: "tools", label: "Access to tools and files", zone: "context" },
  { key: "interface", label: "Chat interface", zone: "around" },
  { key: "reader", label: "The reader’s interpretation", zone: "around" },
];
const ZONES = { weights: "In the weights", context: "In the context", around: "Interface and reader" };

function asList(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/[,\s]+/).filter(Boolean);
  return [];
}

function Stack({ panel }) {
  const shown = typeof panel.show === "number" ? RUNGS.slice(0, panel.show).map((rung) => rung.key) : asList(panel.show);
  const visible = new Set(shown.length ? shown : RUNGS.map((rung) => rung.key));
  const lit = new Set(asList(panel.highlight));
  const rungs = [...RUNGS].reverse();
  return (
    <div className="panel-stack">
      <ol className="stack-list" aria-label="Factors that shape a reply">
        {rungs.map((rung, i) => {
          const zoneStart = i === 0 || rungs[i - 1].zone !== rung.zone;
          const state = !visible.has(rung.key) ? "absent" : lit.has(rung.key) ? "lit" : "present";
          return [
            zoneStart && <li key={`${rung.zone}-head`} className="stack-zone" aria-hidden="true">{ZONES[rung.zone]}</li>,
            <li key={rung.key} className={`stack-rung stack-${state} stack-zone-${rung.zone}`} aria-hidden={state === "absent" ? true : undefined}>
              <span className="stack-label">{rung.label}</span>
            </li>,
          ];
        })}
      </ol>
      <p className="stack-base">The model predicts the next token</p>
    </div>
  );
}

function Dialogue({ panel }) {
  const lines = Array.isArray(panel.lines) ? panel.lines : [];
  const style = panel.style || "chat";
  const speakers = [...new Set(lines.map((line) => line.who))];
  return (
    <div className={`panel-dialogue dialogue-${style}`}>
      {panel.heading && <p className="dialogue-heading">{panel.heading}</p>}
      <ol>
        {lines.map((line, i) => (
          <li key={i} className={`dialogue-line ${speakers.indexOf(line.who) % 2 ? "dialogue-b" : "dialogue-a"}`}>
            {line.who && <span className="dialogue-who">{line.who}</span>}
            <span className="dialogue-text">{line.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Continuation({ panel }) {
  return (
    <div className="panel-continuation">
      {panel.heading && <p className="dialogue-heading">{panel.heading}</p>}
      <pre><span className="cont-prompt">{panel.prompt}</span><mark className="cont-model">{panel.continuation}</mark>{panel.cut ? <span className="cont-cut">{panel.cut}</span> : null}</pre>
      {panel.continuation && panel.continuation.trim() && <p className="cont-key"><span className="cont-key-prompt">Typed</span> <span className="cont-key-model">Generated text</span></p>}
    </div>
  );
}

function Timeline({ milestones }) {
  return (
    <ol className="panel-timeline">
      {milestones.map((milestone) => (
        <li key={milestone.step}><span>{milestone.year}</span>{milestone.label}</li>
      ))}
    </ol>
  );
}

function Demo({ panel, mode }) {
  const fallback = (
    <div className="demo-fallback">
      {panel.fallback_image && <img src={panel.fallback_image} alt={panel.alt || ""} />}
      {panel.fallback && <p>{panel.fallback}</p>}
    </div>
  );
  if (mode === "print") return fallback;
  if (panel.demo === "eliza") return <ElizaDemo />;
  if (panel.demo === "hhh") return <HhhDemo preambleFile={panel.preambleFile} recorded={panel.recorded || []} />;
  if (panel.demo === "spiral") return <SpiralDemo prompt={panel.prompt} recorded={panel.recorded} recordedNote={panel.recorded_note} heading={panel.heading} />;
  return fallback;
}

export default function Panel({ panel, milestones = [], mode = "sticky" }) {
  const type = panel.type;
  let body;
  if (type === "chapter") {
    body = (
      <div className="panel-chapter">
        <p className="eyebrow">{panel.number === 0 ? "Introduction" : `Chapter ${panel.number}`}{panel.years ? ` · ${panel.years}` : ""}</p>
        <p className="panel-chapter-title">{panel.title}</p>
        {panel.description && <p className="panel-chapter-deck">{panel.description}</p>}
      </div>
    );
  } else if (type === "title") {
    body = <div className="panel-title"><p><Inline>{panel.text}</Inline></p><Source panel={panel} /></div>;
  } else if (type === "quote") {
    body = <figure className="panel-quote"><blockquote><Inline>{panel.text}</Inline></blockquote><figcaption><Source panel={panel} /></figcaption></figure>;
  } else if (type === "image") {
    body = (
      <figure className="panel-image">
        <img src={panel.src} alt={panel.alt || panel.caption || ""} loading={mode === "sticky" ? "eager" : "lazy"} />
        {(panel.caption || panel.credit || panel.cite) && (
          <figcaption>{panel.caption && <span><Inline>{panel.caption}</Inline></span>}<Source panel={panel} /></figcaption>
        )}
      </figure>
    );
  } else if (type === "dialogue") {
    body = <figure className="panel-figure"><Dialogue panel={panel} /><figcaption><Source panel={panel} /></figcaption></figure>;
  } else if (type === "continuation") {
    body = <figure className="panel-figure"><Continuation panel={panel} />{panel.note && <p className="panel-note"><Inline>{panel.note}</Inline></p>}<figcaption><Source panel={panel} /></figcaption></figure>;
  } else if (type === "stack") {
    body = <figure className="panel-figure"><Stack panel={panel} />{panel.caption && <figcaption className="panel-note"><Inline>{panel.caption}</Inline></figcaption>}</figure>;
  } else if (type === "demo") {
    body = <figure className="panel-figure panel-demo"><Demo panel={panel} mode={mode} />{panel.caption && <figcaption className="panel-note"><Inline>{panel.caption}</Inline></figcaption>}</figure>;
  } else if (type === "gem") {
    body = <figure className="panel-figure"><GemPieces show={asList(panel.show)} />{panel.caption && <figcaption className="panel-note"><Inline>{panel.caption}</Inline></figcaption>}</figure>;
  } else if (type === "compare") {
    const columns = Array.isArray(panel.columns) ? panel.columns : [];
    const rows = Array.isArray(panel.rows) ? panel.rows : [];
    body = (
      <figure className="panel-figure panel-compare">
        {panel.heading && <p className="dialogue-heading">{panel.heading}</p>}
        <table>
          <thead><tr><th scope="col"><span className="sr-only">Question</span></th>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>{rows.map((row, i) => <tr key={i}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </figure>
    );
  } else if (type === "knowledge") {
    body = <figure className="panel-figure panel-demo">{panel.children ?? <p className="panel-note">The knowledge demo is loading.</p>}{panel.caption && <figcaption className="panel-note"><Inline>{panel.caption}</Inline></figcaption>}</figure>;
  } else if (type === "timeline") {
    body = <figure className="panel-figure"><Timeline milestones={milestones} />{panel.caption && <figcaption className="panel-note"><Inline>{panel.caption}</Inline></figcaption>}</figure>;
  } else {
    body = <div className="panel-title"><p>{panel.text || `Unknown panel type "${type}"`}</p></div>;
  }
  return <div className={`panel panel-${type} panel-mode-${mode}`}>{body}</div>;
}
