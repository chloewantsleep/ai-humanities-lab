"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./RosieRoomba.css";

// Rosie and Roomba: Marlon's comparison (October 2, 2026 dictation) as a presentation piece. Rosie is the
// humanlike robot maid holding a vacuum; the Roomba is a machine organized around the task, shaped by the floor.
// For agents working on text, the files are the floor: the chat persona is Rosie, the agent working through a
// folder is the Roomba. Self-contained: this file and RosieRoomba.css beside it, no dependencies beyond React.
//
//   <RosieRoomba />                                   all six beats, captions, step with ← → or a click
//   <RosieRoomba beats={["chat", "agent"]} compact /> two beats, slide-sized, no captions
//   <RosieRoomba keys="window" />                     arrow keys (and clicker PageUp/PageDown) anywhere on the page

const ROSIE_SOURCE = "Marlon, dictation, October 2, 2026";

export const BEATS = {
  rosie: {
    scene: "floor",
    show: ["rosie"],
    kicker: "The vacuum problem",
    quote: "You'd imagine the way robots would fix the vacuuming problem is a human-like robot holding a vacuum.",
    source: ROSIE_SOURCE,
  },
  roomba: {
    scene: "floor",
    show: ["rosie", "roomba"],
    kicker: "What we got",
    quote: "But what we actually got is the Roomba, which is much better. It just goes and does its thing. … It does this one task, and does it well, with a small piece of intelligence, rather than trying to simulate the human.",
    source: ROSIE_SOURCE,
  },
  rebel: {
    scene: "floor",
    show: ["rosie", "roomba"],
    rebel: true,
    kicker: "Who rebels",
    quote: "If Rosie really does become human-like, she might rebel against having to vacuum. The Roomba will never rebel against having to vacuum.",
    source: ROSIE_SOURCE,
  },
  chat: {
    scene: "text",
    show: ["chat"],
    kicker: "Now the text",
    quote: "The truth is not that there's an actual person-like thing you're chatting with in a chat box, and your chats are not the central part of it.",
    source: ROSIE_SOURCE,
  },
  agent: {
    scene: "text",
    show: ["chat", "agent"],
    kicker: "The agent on the floor of your files",
    quote: "They'll slowly work on the ground truth, which for the Roomba is the floor and for your agents is your data and the text you're working on. That's a very, very different model from the chat box.",
    source: ROSIE_SOURCE,
  },
  summary: {
    scene: "both",
    show: ["rosie", "roomba", "chat", "agent"],
    kicker: "Roombas, not Rosies",
    quote: "You would kind of want to emphasize the extent to which you're making [Roombas] rather than Rosies. You're making one-function bots, things that are reduced to their task.",
    source: "Marlon, dictation, August 8, 2026 (the transcript has “Rumbas”)",
  },
};

export const BEAT_ORDER = Object.keys(BEATS);

const PANELS = {
  rosie: { name: "Rosie", label: "what we imagined", sub: "a person doing a person's job" },
  roomba: { name: "Roomba", label: "what we got", sub: "a machine shaped by the floor" },
  chat: { name: "The chat persona", label: "Rosie, for text", sub: "you bring the work to the person" },
  agent: { name: "The agent", label: "Roomba, for text", sub: "it works across your files" },
};

// --- the clock ---------------------------------------------------------------------------------------------

// Seconds since mount, advanced by requestAnimationFrame; pausing holds the time where it is. `frozen` is true
// with reduced motion, when the panels should show a still moment instead.
function useClock({ paused, speed }) {
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    let frame;
    let last = performance.now();
    const tick = now => {
      elapsed.current += ((now - last) / 1000) * speed;
      last = now;
      setT(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reduced, speed]);
  return { t, frozen: reduced };
}

// Time since the scene began (the panels keep running across beats in the same scene, so the Roomba's coverage
// survives "rebel") and since the beat began (for what a beat adds, like Rosie's thought bubble).
function useSince(clock, scene, beat) {
  const marks = useRef({ scene: null, sceneAt: 0, beat: null, beatAt: 0 });
  if (marks.current.scene !== scene) Object.assign(marks.current, { scene, sceneAt: clock.t });
  if (marks.current.beat !== beat) Object.assign(marks.current, { beat, beatAt: clock.t });
  return { t: clock.t - marks.current.sceneAt, since: clock.t - marks.current.beatAt, frozen: clock.frozen };
}

// With reduced motion each panel stands still at a moment that shows it mid-task.
const STILLS = { rosie: 2.2, roomba: 30, chat: 12.5, agent: 19.5 };

// --- the Roomba's floor ------------------------------------------------------------------------------------

const ROOM = { x0: 20, y0: 20, x1: 380, y1: 240 };
const FURNITURE = [
  { x: 40, y: 20, w: 130, h: 48, label: "sofa" },
  { x: 236, y: 122, w: 78, h: 60, label: "table" },
  { x: 334, y: 20, w: 46, h: 40, label: "plant" },
];
const ROOMBA_R = 12;
const CELL = 8;

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// A bounce-and-turn path (drive straight, turn a random amount on contact), and how much of the open floor is
// covered after each point. Computed once; the panel shows a prefix of it.
function simulateRoomba({ steps = 2600, speed = 2.4, seed = 11 } = {}) {
  const r = ROOMBA_R;
  const blocked = (x, y) =>
    x - r < ROOM.x0 || x + r > ROOM.x1 || y - r < ROOM.y0 || y + r > ROOM.y1 ||
    FURNITURE.some(f => x + r > f.x && x - r < f.x + f.w && y + r > f.y && y - r < f.y + f.h);
  const inFurniture = (x, y) => FURNITURE.some(f => x > f.x && x < f.x + f.w && y > f.y && y < f.y + f.h);

  const cols = Math.floor((ROOM.x1 - ROOM.x0) / CELL);
  const rows = Math.floor((ROOM.y1 - ROOM.y0) / CELL);
  const open = new Uint8Array(cols * rows);
  let openCount = 0;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const cx = ROOM.x0 + (i + 0.5) * CELL, cy = ROOM.y0 + (j + 0.5) * CELL;
    if (!inFurniture(cx, cy)) { open[j * cols + i] = 1; openCount++; }
  }
  const seen = new Uint8Array(cols * rows);
  let covered = 0;

  const rand = mulberry32(seed);
  let x = 190, y = 205, a = -2.3;
  const points = [];
  for (let n = 0; n < steps; n++) {
    let nx = x + Math.cos(a) * speed, ny = y + Math.sin(a) * speed;
    for (let tries = 0; blocked(nx, ny) && tries < 60; tries++) {
      a += Math.PI * (0.35 + rand() * 0.9);
      nx = x + Math.cos(a) * speed; ny = y + Math.sin(a) * speed;
    }
    if (!blocked(nx, ny)) { x = nx; y = ny; }
    const i0 = Math.max(0, Math.floor((x - r - ROOM.x0) / CELL)), i1 = Math.min(cols - 1, Math.floor((x + r - ROOM.x0) / CELL));
    const j0 = Math.max(0, Math.floor((y - r - ROOM.y0) / CELL)), j1 = Math.min(rows - 1, Math.floor((y + r - ROOM.y0) / CELL));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const k = j * cols + i;
      if (!open[k] || seen[k]) continue;
      const cx = ROOM.x0 + (i + 0.5) * CELL, cy = ROOM.y0 + (j + 0.5) * CELL;
      if ((cx - x) ** 2 + (cy - y) ** 2 <= r * r) { seen[k] = 1; covered++; }
    }
    points.push([x, y, a, covered / openCount]);
  }
  return points;
}

// --- the agent's files -------------------------------------------------------------------------------------

const FILES = [
  "ch01.md", "ch02.md", "ch03.md", "ch04.md",
  "ch08.md", "ch07.md", "ch06.md", "ch05.md",
  "notes.md", "refs.bib", "intro.md", "draft.md",
];
const TASKS = [
  { name: "check citations", tag: "cited" },
  { name: "proofread", tag: "proofed" },
  { name: "translate into French", tag: "fr" },
];
const FILE_W = 72, FILE_H = 46;
// The visiting order snakes across the rows, as a Roomba crosses a floor; FILES is already listed in that order.
const FILE_SLOTS = FILES.map((name, n) => {
  const row = Math.floor(n / 4);
  const col = row % 2 === 0 ? n % 4 : 3 - (n % 4);
  return { name, x: 28 + col * 90, y: 44 + row * 62 };
});
const TRAVEL = 0.45, WORK = 1.05, HOLD = 2.4;
const PASS = FILES.length * (TRAVEL + WORK) + HOLD;

// --- the panels --------------------------------------------------------------------------------------------

function RosieFigure({ x, dir, swing, bob, rebel }) {
  const leg = (side, angle) => (
    <g transform={`rotate(${angle} ${side * 5} -40)`}>
      <line x1={side * 5} y1={-40} x2={side * 5} y2={-4} className="rr-limb" />
      <ellipse cx={side * 5 + 3} cy={-3} rx={6} ry={3} className="rr-metal" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${200 - bob}) scale(${dir} 1)`}>
      {leg(-1, rebel ? 0 : swing)}
      {leg(1, rebel ? 0 : -swing)}
      <path d="M -15 -38 L 15 -38 L 10 -82 L -10 -82 Z" className="rr-metal" />
      <path d="M -8 -74 L 8 -74 L 10 -42 L -10 -42 Z" className="rr-apron" />
      {rebel ? (
        <>
          <line x1={-10} y1={-74} x2={12} y2={-62} className="rr-limb" />
          <line x1={10} y1={-74} x2={-12} y2={-62} className="rr-limb" />
        </>
      ) : (
        <>
          <line x1={-8} y1={-78} x2={-14 - swing * 0.2} y2={-56} className="rr-limb" />
          <line x1={8} y1={-78} x2={22} y2={-62} className="rr-limb" />
          <line x1={22} y1={-64} x2={47} y2={-6} className="rr-stick" />
          <rect x={38} y={-9} width={24} height={9} rx={3} className="rr-vacuum" />
        </>
      )}
      <line x1={0} y1={-108} x2={0} y2={-120} className="rr-limb" />
      <circle cx={0} cy={-122} r={3} className="rr-accent-fill" />
      <circle cx={0} cy={-96} r={14} className="rr-metal" />
      <path d="M -12 -104 Q 0 -114 12 -104 Q 6 -108 0 -107 Q -6 -108 -12 -104 Z" className="rr-apron" />
      <circle cx={-5} cy={-97} r={2.4} className="rr-eye" />
      <circle cx={6} cy={-97} r={2.4} className="rr-eye" />
      <path d={rebel ? "M -5 -88 Q 1 -92 7 -88" : "M -5 -90 Q 1 -86 7 -90"} className="rr-mouth" />
    </g>
  );
}

function RosiePanel({ t, since, rebel }) {
  const phase = t * 0.55;
  const x = rebel ? 200 : 200 + 118 * Math.sin(phase);
  const dir = rebel ? 1 : Math.cos(phase) >= 0 ? 1 : -1;
  const pace = rebel ? 0 : Math.min(1, Math.abs(Math.cos(phase)) * 1.6);
  const swing = Math.sin(t * 7) * 22 * pace;
  const bob = Math.abs(Math.sin(t * 7)) * 2 * pace;
  const head = x + dir * 50;
  const bubble = rebel ? Math.min(1, Math.max(0, (since - 0.6) * 2)) : 0;
  return (
    <svg viewBox="0 0 400 260" className="rr-svg" role="img" aria-label="Rosie, a humanlike robot maid, walks the room pushing a vacuum">
      <rect x={0} y={0} width={400} height={200} className="rr-wall" />
      <rect x={0} y={200} width={400} height={60} className="rr-floor" />
      <line x1={0} y1={200} x2={400} y2={200} className="rr-baseboard" />
      <g className="rr-decor">
        <rect x={34} y={36} width={78} height={66} rx={3} />
        <line x1={73} y1={36} x2={73} y2={102} />
        <line x1={34} y1={69} x2={112} y2={69} />
        <rect x={292} y={48} width={52} height={38} rx={2} />
      </g>
      {rebel ? (
        <g>
          <line x1={226} y1={198} x2={276} y2={186} className="rr-stick" />
          <rect x={272} y={186} width={24} height={9} rx={3} className="rr-vacuum" />
        </g>
      ) : (
        [0, 1, 2].map(k => {
          const age = (t * 1.4 + k / 3) % 1;
          return <circle key={k} cx={head - dir * (8 + age * 26)} cy={194 - age * 18} r={2.2 - age * 1.6} className="rr-dust" opacity={1 - age} />;
        })
      )}
      <RosieFigure x={x} dir={dir} swing={swing} bob={bob} rebel={rebel} />
      {bubble > 0 && (
        <g opacity={bubble} className="rr-thought">
          <circle cx={226} cy={92} r={3} />
          <circle cx={236} cy={80} r={5} />
          <rect x={232} y={30} width={150} height={44} rx={20} />
          <text x={307} y={49} textAnchor="middle">Why am I the one</text>
          <text x={307} y={63} textAnchor="middle">who vacuums?</text>
        </g>
      )}
    </svg>
  );
}

function RoombaDisc({ x, y, a, r = ROOMBA_R }) {
  const deg = (a * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg})`}>
      <circle r={r} className="rr-disc" />
      <path d={`M ${r * 0.55} ${-r * 0.8} A ${r} ${r} 0 0 1 ${r * 0.55} ${r * 0.8}`} className="rr-bumper" />
      <circle r={r * 0.28} className="rr-accent-fill" />
    </g>
  );
}

function RoombaPanel({ t, path }) {
  const dusty = `rr-dusty-${useId()}`;
  const perSecond = 70;
  const span = path.length / perSecond + 3;
  const n = Math.min(path.length - 1, Math.floor((t % span) * perSecond));
  const shown = path.slice(0, n + 1);
  const [x, y, a, coverage] = path[n];
  return (
    <svg viewBox="0 0 400 260" className="rr-svg" role="img" aria-label="A Roomba, seen from above, criss-crosses the floor plan of a room and the cleaned floor spreads behind it">
      <defs>
        <pattern id={dusty} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="0.9" className="rr-dust-dot" />
          <circle cx="6.5" cy="7" r="0.7" className="rr-dust-dot" />
        </pattern>
      </defs>
      <rect x={ROOM.x0} y={ROOM.y0} width={ROOM.x1 - ROOM.x0} height={ROOM.y1 - ROOM.y0} className="rr-plan" />
      <rect x={ROOM.x0} y={ROOM.y0} width={ROOM.x1 - ROOM.x0} height={ROOM.y1 - ROOM.y0} fill={`url(#${dusty})`} />
      <polyline points={shown.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} className="rr-clean" strokeWidth={ROOMBA_R * 2} />
      <polyline points={shown.slice(-140).map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} className="rr-track" />
      {FURNITURE.map(f => (
        <g key={f.label}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={4} className="rr-furniture" />
          <text x={f.x + f.w / 2} y={f.y + f.h / 2 + 4} textAnchor="middle" className="rr-furniture-label">{f.label}</text>
        </g>
      ))}
      <rect x={ROOM.x0} y={ROOM.y0} width={ROOM.x1 - ROOM.x0} height={ROOM.y1 - ROOM.y0} className="rr-room-wall" />
      <RoombaDisc x={x} y={y} a={a} />
      <text x={ROOM.x0} y={256} className="rr-meter">floor covered {Math.round(coverage * 100)}%</text>
    </svg>
  );
}

// The chat persona: a conversation in which the work has to be carried to her, a piece at a time.
const CHAT = [
  { who: "you", at: 0.4, lines: ["Can you check the citations", "in my chapter?"] },
  { who: "rosie", at: 2.0, lines: ["Of course! I'd love to help.", "Could you paste the chapter here?"] },
  { who: "you", at: 3.8, lines: ["[pastes chapter 3]"], paste: true },
  { who: "rosie", at: 5.8, lines: ["What a wonderful chapter!", "Here are a few thoughts…"] },
  { who: "you", at: 7.6, lines: ["And chapters 4 to 8?"] },
  { who: "rosie", at: 9.4, lines: ["Happy to! Paste them one at", "a time and we'll keep chatting."] },
];
const CHAT_SPAN = 14.5;

function ChatPanel({ t }) {
  const clip = `rr-chat-clip-${useId()}`;
  const local = t % CHAT_SPAN;
  const visible = CHAT.filter(m => m.at <= local);
  const typing = CHAT.find(m => m.who === "rosie" && m.at > local && m.at - local < 1.1);
  let y = 0;
  const laid = visible.map(m => {
    const h = 14 + m.lines.length * 14;
    const item = { ...m, y, h, w: Math.max(...m.lines.map(l => l.length)) * 6 + 22 };
    y += h + 8;
    return item;
  });
  const area = 150;
  const shift = Math.max(0, y + (typing ? 30 : 0) - area);
  const context = Math.min(96, Math.round(4 + visible.reduce((sum, m) => sum + (m.paste ? 34 : 3), 0) + Math.max(0, local - 7.6) * 6));
  return (
    <svg viewBox="0 0 400 260" className="rr-svg" role="img" aria-label="A chat window with a friendly robot persona; the user has to paste each chapter in, and the conversation's context fills up">
      <defs>
        <clipPath id={clip}><rect x={16} y={62} width={368} height={area + 6} /></clipPath>
      </defs>
      <rect x={16} y={10} width={368} height={240} rx={14} className="rr-window" />
      <g transform="translate(40 36) scale(0.62)">
        <circle cx={0} cy={0} r={22} className="rr-avatar" />
        <circle cx={0} cy={2} r={14} className="rr-metal" />
        <path d="M -12 -6 Q 0 -16 12 -6 Q 6 -10 0 -9 Q -6 -10 -12 -6 Z" className="rr-apron" />
        <circle cx={-5} cy={1} r={2.4} className="rr-eye" />
        <circle cx={6} cy={1} r={2.4} className="rr-eye" />
        <path d="M -5 8 Q 1 12 7 8" className="rr-mouth" />
      </g>
      <text x={62} y={33} className="rr-chat-name">Rosie</text>
      <text x={62} y={47} className="rr-chat-sub">your friendly assistant · online</text>
      <line x1={16} y1={58} x2={384} y2={58} className="rr-rule" />
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(0 ${68 - shift})`}>
          {laid.map((m, k) => {
            const mine = m.who === "you";
            const bx = mine ? 370 - m.w : 30;
            return (
              <g key={k} className={mine ? "rr-bubble-you" : "rr-bubble-rosie"}>
                <rect x={bx} y={m.y} width={m.w} height={m.h} rx={11} />
                {m.lines.map((line, i) => <text key={i} x={bx + 11} y={m.y + 19 + i * 14} className={m.paste ? "rr-paste" : undefined}>{line}</text>)}
              </g>
            );
          })}
          {typing && (
            <g className="rr-bubble-rosie">
              <rect x={30} y={y} width={46} height={24} rx={11} />
              {[0, 1, 2].map(k => <circle key={k} cx={43 + k * 10} cy={y + 12} r={2.6} opacity={0.35 + 0.65 * Math.abs(Math.sin(local * 5 - k * 0.7))} className="rr-typing" />)}
            </g>
          )}
        </g>
      </g>
      <line x1={16} y1={224} x2={384} y2={224} className="rr-rule" />
      <text x={30} y={240} className="rr-meter">this conversation: {context}% of the context window{context > 85 ? " · start a new chat?" : ""}</text>
      <rect x={300} y={234} width={70} height={5} rx={2.5} className="rr-bar" />
      <rect x={300} y={234} width={(70 * context) / 100} height={5} rx={2.5} className={context > 85 ? "rr-bar-full" : "rr-bar-fill"} />
    </svg>
  );
}

function AgentPanel({ t }) {
  const pass = Math.floor(t / PASS);
  const local = t % PASS;
  const task = TASKS[pass % TASKS.length];
  const cycle = TRAVEL + WORK;
  const current = Math.min(FILES.length - 1, Math.floor(local / cycle));
  const within = local - current * cycle;
  const finished = local >= FILES.length * cycle;
  const dock = s => [s.x + FILE_W / 2, s.y];
  const from = current === 0 ? [FILE_SLOTS[0].x - 14, FILE_SLOTS[0].y + FILE_H / 2] : dock(FILE_SLOTS[current - 1]);
  const to = dock(FILE_SLOTS[current]);
  const moving = !finished && within < TRAVEL;
  const k = moving ? within / TRAVEL : 1;
  const ease = k * k * (3 - 2 * k);
  const at = finished ? to : [from[0] + (to[0] - from[0]) * ease, from[1] + (to[1] - from[1]) * ease];
  const heading = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const done = finished ? FILES.length : current;
  const scan = !finished && !moving ? (within - TRAVEL) / WORK : 0;
  const trail = [...FILE_SLOTS.slice(0, current).map(dock), at];
  return (
    <svg viewBox="0 0 400 260" className="rr-svg" role="img" aria-label={`An agent, drawn as a small disc, works through a folder of twelve files one by one; task: ${task.name}`}>
      <rect x={10} y={10} width={380} height={240} rx={14} className="rr-window" />
      <text x={24} y={31} className="rr-chat-name">~/my-book/</text>
      <text x={376} y={31} textAnchor="end" className="rr-task">task: {task.name}</text>
      <polyline points={trail.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ")} className="rr-agent-trail" />
      {FILE_SLOTS.map((s, n) => {
        const isDone = n < done;
        const working = n === current && !finished && !moving;
        return (
          <g key={s.name} className={`rr-file${isDone ? " is-done" : ""}${working ? " is-working" : ""}`}>
            <path d={`M ${s.x} ${s.y} h ${FILE_W - 12} l 12 12 v ${FILE_H - 12} h ${-FILE_W} Z`} className="rr-file-page" />
            {[0, 1, 2].map(i => {
              const lit = isDone || (working && scan > (i + 0.5) / 3);
              return <rect key={i} x={s.x + 8} y={s.y + 15 + i * 7} width={[48, 54, 40, 50][(i + n) % 4]} height={2.6} rx={1.3} className={lit ? "rr-line-lit" : "rr-line"} />;
            })}
            {working && <rect x={s.x + 4} y={s.y + 12 + scan * 20} width={FILE_W - 8} height={2} className="rr-scan" />}
            <text x={s.x + 8} y={s.y + FILE_H - 5} className="rr-file-name">{s.name}</text>
            {isDone && (
              <g>
                <circle cx={s.x + FILE_W - 2} cy={s.y + FILE_H - 2} r={7} className="rr-check-bg" />
                <path d={`M ${s.x + FILE_W - 5.5} ${s.y + FILE_H - 2} l 2.6 2.6 l 4.6 -5`} className="rr-check" />
                <text x={s.x + FILE_W - 12} y={s.y + FILE_H + 11} textAnchor="end" className="rr-tag">{task.tag}</text>
              </g>
            )}
          </g>
        );
      })}
      <RoombaDisc x={at[0]} y={at[1]} a={moving ? heading : 0} r={9} />
      <text x={24} y={246} className="rr-meter">files done {done} / {FILES.length} · no conversation needed</text>
    </svg>
  );
}

const PANEL_VIEWS = {
  rosie: ({ t, since, beat }) => <RosiePanel t={t} since={since} rebel={Boolean(beat.rebel)} />,
  roomba: ({ t, path }) => <RoombaPanel t={t} path={path} />,
  chat: ({ t }) => <ChatPanel t={t} />,
  agent: ({ t }) => <AgentPanel t={t} />,
};

function Panel({ id, visible, t, since, beat, path, compact, ground }) {
  const meta = PANELS[id];
  return (
    <figure className={`rr-panel rr-panel-${id}${visible ? "" : " is-hidden"}${ground ? " is-ground" : ""}`}>
      <figcaption className="rr-panel-label">
        <strong>{meta.name}</strong> <span>{meta.label}</span>
        {!compact && <em>{meta.sub}</em>}
      </figcaption>
      <div className="rr-panel-art">
        {visible ? PANEL_VIEWS[id]({ t, since, beat, path }) :<div className="rr-unknown" aria-hidden="true">?</div>}
      </div>
    </figure>
  );
}

// --- the component -----------------------------------------------------------------------------------------

export default function RosieRoomba({
  beats = BEAT_ORDER,
  step,
  defaultStep = 0,
  onStepChange,
  compact = false,
  captions = !compact,
  controls = true,
  keys = "focus",
  paused = false,
  speed = 1,
  className = "",
}) {
  const list = beats.filter(b => BEATS[b]);
  const [ownStep, setOwnStep] = useState(defaultStep);
  const current = Math.max(0, Math.min(list.length - 1, step ?? ownStep));
  const id = list[current];
  const beat = BEATS[id];
  const root = useRef(null);
  const path = useMemo(() => simulateRoomba(), []);
  const clock = useClock({ paused, speed });
  const { t, since, frozen } = useSince(clock, beat.scene, id);

  const go = useCallback(next => {
    const clamped = Math.max(0, Math.min(list.length - 1, next));
    if (step === undefined) setOwnStep(clamped);
    onStepChange?.(clamped, list[clamped]);
  }, [list, step, onStepChange]);

  const onKey = useCallback(event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest?.("input, textarea, select, [contenteditable=true]")) return;
    const forward = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key);
    const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key);
    if (!forward && !back) return;
    event.preventDefault();
    go(current + (forward ? 1 : -1));
  }, [go, current]);

  useEffect(() => {
    if (keys !== "window") return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys, onKey]);

  const [presenting, setPresenting] = useState(false);
  useEffect(() => {
    const change = () => setPresenting(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);

  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else root.current?.requestFullscreen?.();
  };

  const rows = beat.scene === "both" ? [["rosie", "roomba"], ["chat", "agent"]] : beat.scene === "floor" ? [["rosie", "roomba"]] : [["chat", "agent"]];

  return (
    <div
      ref={root}
      className={`rr${compact ? " rr-compact" : ""}${beat.scene === "both" ? " rr-grid" : ""} ${className}`.trim()}
      tabIndex={keys === "focus" ? 0 : undefined}
      onKeyDown={keys === "focus" ? onKey : undefined}
      aria-roledescription="presentation"
      aria-label="Rosie and Roomba"
    >
      <div className="rr-stage" onClick={() => go(current + 1)}>
        {rows.map((row, r) => (
          <div key={r} className="rr-row">
            {beat.scene === "both" && <p className="rr-row-label">{r === 0 ? "the floor" : "the text"}</p>}
            {row.map(p => (
              <Panel key={p} id={p} visible={beat.show.includes(p)} t={frozen ? STILLS[p] : t} since={frozen ? 5 : since} beat={beat} path={path} compact={compact || beat.scene === "both"} ground={beat.scene === "both" && (p === "roomba" || p === "agent")} />
            ))}
          </div>
        ))}
        {beat.scene === "both" && <p className="rr-ground-note">working on the ground truth: the floor, your files</p>}
      </div>

      {captions && (
        <blockquote className="rr-caption" aria-live="polite">
          <p className="rr-kicker">{beat.kicker}</p>
          <p className="rr-quote">{beat.quote}</p>
          <footer>{beat.source}</footer>
        </blockquote>
      )}

      {controls && list.length > 1 && (
        <div className="rr-controls">
          <button type="button" onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous">←</button>
          <div className="rr-dots">
            {list.map((b, n) => (
              <button key={b} type="button" className={n === current ? "is-current" : ""} onClick={() => go(n)} aria-label={`${n + 1}: ${BEATS[b].kicker}`} aria-current={n === current ? "step" : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => go(current + 1)} disabled={current === list.length - 1} aria-label="Next">→</button>
          <span className="rr-count">{current + 1} / {list.length}</span>
          {!compact && <button type="button" className="rr-full" onClick={fullscreen}>{presenting ? "Exit" : "Present"}</button>}
        </div>
      )}
    </div>
  );
}
