"use client";

// The timeline's opening: starts zoomed in on 2023–2026 (where the class just was), zooms out as you scroll to the
// whole span (c. 370 BCE – 2026), then hands off to the first chapter (#writing-cannot-answer).
// No props. Scroll-driven; a static two-axis version replaces it under prefers-reduced-motion (pure CSS switch).

import { useEffect, useRef, useState } from "react";
import "./timeline-zoom.css";

const RIGHT = 2027.0;
const SPAN_NEAR = 4.2;
const SPAN_FAR = 2420;
const BAND = [2023.0, 2027.0];
const FIRST_CHAPTER = "#writing-cannot-answer";

// Order within a tier is label priority.
const EVENTS = [
  { label: "Today", year: 2026.8, tier: 1, today: true },
  { label: "ChatGPT", year: 2022.91, tier: 1 },
  { label: "GPTs", year: 2023.85, tier: 1 },
  { label: "Gems", year: 2024.65, tier: 1 },
  { label: "o1, reasoning", year: 2024.7, tier: 1 },
  { label: "Claude Code", year: 2025.15, tier: 1 },
  { label: "Phaedrus", year: -370, tier: 1 },
  { label: "Frankenstein", year: 1818, tier: 1 },
  { label: "R.U.R.", year: 1920, tier: 1 },
  { label: "Turing", year: 1950, tier: 1 },
  { label: "ELIZA", year: 1966, tier: 1 },
  { label: "GPT-2", year: 2019.12, tier: 1 },
  { label: "HHH prompt", year: 2021.92, tier: 1 },
  { label: "Custom instructions", year: 2023.55, tier: 2 },
  { label: "Claude Projects", year: 2024.48, tier: 2 },
  { label: "Computer use", year: 2024.81, tier: 2 },
  { label: "OpenClaw", year: 2026.08, tier: 2 },
  { label: "Grok Bot", year: 2026.61, tier: 2 },
  { label: "Muse", year: 2026.69, tier: 2 },
  { label: "dots", year: 2026.75, tier: 2 },
  { label: "InstructGPT", year: 2022.1, tier: 2 },
  { label: "Shannon", year: 1948, tier: 2 },
  { label: "PARRY", year: 1972, tier: 2 },
  { label: "Markov", year: 1913, tier: 2 },
  { label: "Bergson, Laughter", year: 1900, tier: 2 },
  { label: "Wilde, Intentions", year: 1891, tier: 2 },
];

const STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];
const MINOR = { 1: 0.25, 2: 0.5, 5: 1, 10: 2, 25: 5, 50: 10, 100: 25, 250: 50, 500: 100, 1000: 250 };

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (1 - Math.cos(Math.PI * t)) / 2;
const ramp = (p, a, b) => clamp((p - a) / (b - a));
const fmtYear = (y) => (y < 0 ? `${-y} BCE` : `${y}`);
const fmtInt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function spanAt(p) {
  const t = easeInOut(ramp(p, 0.18, 0.85));
  return Math.exp(Math.log(SPAN_NEAR) + (Math.log(SPAN_FAR) - Math.log(SPAN_NEAR)) * t);
}

function useWidth(ref, fallback = 1200) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function Axis({ left, right }) {
  const ref = useRef(null);
  const width = useWidth(ref);
  const phone = width < 560;
  const span = right - left;
  const x = (y) => (y - left) / span; // 0..1, linear in this frame

  // Ticks: smallest "nice" step that keeps the count within budget.
  const maxTicks = phone ? 5 : 10;
  const step = STEPS.find((s) => span / s <= maxTicks) ?? 1000;
  const ticks = [];
  for (let y = Math.ceil(left / step) * step; y <= right + 1e-9; y += step) if (y !== 0) ticks.push(y);
  const minorStep = MINOR[step];
  const minors = [];
  for (let y = Math.ceil(left / minorStep) * minorStep; y <= right + 1e-9; y += minorStep) {
    if (Math.abs(y / step - Math.round(y / step)) > 1e-6) minors.push(y);
  }

  // Labels: place in priority order, first free row wins; otherwise culled. Rows alternate above/below the line.
  const rows = phone ? [-1, 1] : [-1, 1, -2];
  const charW = phone ? 6.5 : 7.2;
  const gap = 12;
  const placed = rows.map(() => []);
  const layout = new Map();
  for (const ev of EVENTS) {
    const fx = x(ev.year);
    if (fx < -0.002 || fx > 1.002) continue;
    const px = fx * width;
    const w = ev.label.length * charW + 6;
    let a = px - w / 2;
    let align = "center";
    if (a < 0) { a = Math.max(px - 4, 0); align = "start"; }
    if (a + w > width) { a = Math.min(px + 4, width) - w; align = "end"; }
    const box = [a - gap / 2, a + w + gap / 2];
    const rowIdx = placed.findIndex((list) => list.every(([l, r]) => box[1] <= l || box[0] >= r));
    if (rowIdx === -1) { layout.set(ev.label, { fx, row: null }); continue; }
    placed[rowIdx].push(box);
    layout.set(ev.label, { fx, row: rows[rowIdx], align });
  }

  const bandL = x(BAND[0]);
  const bandR = x(BAND[1]);
  const sliver = (Math.min(1, bandR) - Math.max(0, bandL)) * width < 48;

  return (
    <div className="tz-axis" ref={ref}>
      <div
        className={sliver ? "tz-band tz-band-sliver" : "tz-band"}
        style={{ left: `${Math.max(0, bandL) * 100}%`, right: `${(1 - Math.min(1, bandR)) * 100}%`, minWidth: 3 }}
        aria-hidden="true"
      >
        <span className="tz-band-label">2023–26</span>
      </div>
      <div className="tz-line" aria-hidden="true" />
      {minors.map((y) => (
        <span key={`m${y}`} className="tz-minor" style={{ left: `${x(y) * 100}%` }} aria-hidden="true" />
      ))}
      {ticks.map((y) => (
        <span key={`t${y}`} className="tz-tick" style={{ left: `${x(y) * 100}%` }} aria-hidden="true">
          <span className="tz-tick-label">{fmtYear(y)}</span>
        </span>
      ))}
      {EVENTS.map((ev) => {
        const l = layout.get(ev.label);
        if (!l) return null;
        const cls = ev.today ? "tz-event tz-today" : ev.tier === 1 ? "tz-event tz-tier1" : "tz-event";
        return (
          <span key={ev.label} className={cls} style={{ left: `${l.fx * 100}%` }} aria-hidden="true">
            <span className="tz-dot" />
            {l.row !== null && (
              <span className={`tz-label tz-row${l.row < 0 ? "-up" : "-down"}${Math.abs(l.row)} tz-align-${l.align}`}>
                <span className="tz-stem" />
                <span className="tz-text">{ev.label}</span>
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Caption({ show, eyebrow, heading, line, children }) {
  return (
    <div className="tz-caption" style={{ opacity: show, visibility: show > 0.01 ? "visible" : "hidden" }} aria-hidden={show < 0.5}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{heading}</h2>
      <p className="tz-caption-line">{line}</p>
      {children}
    </div>
  );
}

function BeginLink({ active = true }) {
  return (
    <a className="tz-begin" href={FIRST_CHAPTER} tabIndex={active ? undefined : -1}>
      Begin with Plato&rsquo;s Phaedrus <span aria-hidden="true">&darr;</span>
    </a>
  );
}

export default function TimelineZoom() {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (mq.matches) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total > 0 ? clamp(-r.top / total) : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const span = spanAt(p);
  const left = RIGHT - span;
  const liveHeading = `${fmtYear(Math.round(left))} – ${Math.round(RIGHT)}`;

  // Crossfades between the four captions.
  const c1 = 1 - ramp(p, 0.17, 0.22);
  const c2 = Math.min(ramp(p, 0.19, 0.24), 1 - ramp(p, 0.52, 0.57));
  const c3 = Math.min(ramp(p, 0.54, 0.59), 1 - ramp(p, 0.83, 0.87));
  const c4 = ramp(p, 0.85, 0.9);

  return (
    <section className="tz" aria-labelledby="tz-summary">
      <p id="tz-summary" className="tz-sr">
        A timeline zooming out from 2023–2026 to c. 370 BCE–2026. Custom GPTs, Gems, reasoning models and agents fill
        2023 to 2026; seen against the whole span, from Plato&rsquo;s Phaedrus through Frankenstein, Turing, ELIZA and
        ChatGPT, those three years are a thin sliver at the right edge.
      </p>

      <div className="tz-scroll" ref={wrapRef}>
        <div className="tz-stage">
          <p className="tz-readout" aria-hidden="true">Visible: {fmtInt(span)} years</p>
          <div className="tz-captions">
            <Caption show={c1} eyebrow="Where we just were" heading="2023 – 2026"
              line="Custom GPTs, Gems, reasoning models, agents: three years, a crowded shelf." />
            <Caption show={c2} eyebrow="Zooming out" heading={liveHeading}
              line="ChatGPT, GPT-2, ELIZA: the chatbot’s own history is about sixty years." />
            <Caption show={c3} eyebrow="Zooming out" heading={liveHeading}
              line="Behind it, a much older worry: writing that speaks but cannot answer back." />
            <Caption show={c4} eyebrow="The whole timeline" heading="c. 370 BCE – 2026"
              line="Those three years are the bright sliver at the right edge. We begin at the other end.">
              <BeginLink active={c4 > 0.5} />
            </Caption>
          </div>
          <div className="tz-axis-wrap">
            <Axis left={left} right={RIGHT} />
          </div>
          <p className="tz-scroll-hint" aria-hidden="true" style={{ opacity: 1 - ramp(p, 0.04, 0.12) }}>Scroll to zoom out</p>
        </div>
        {/* Keyboard and screen-reader users get the hand-off without scrolling the animation. */}
        <a className="tz-skip" href={FIRST_CHAPTER}>Skip to the first chapter: Plato&rsquo;s Phaedrus</a>
      </div>

      <div className="tz-static">
        <div className="tz-static-block">
          <p className="eyebrow">Where we just were</p>
          <h2>2023 – 2026</h2>
          <p className="tz-caption-line">Custom GPTs, Gems, reasoning models, agents: three years, a crowded shelf.</p>
          <div className="tz-axis-wrap"><Axis left={RIGHT - SPAN_NEAR} right={RIGHT} /></div>
        </div>
        <div className="tz-static-block">
          <p className="eyebrow">The whole timeline</p>
          <h2>c. 370 BCE – 2026</h2>
          <p className="tz-caption-line">Those three years are the bright sliver at the right edge. We begin at the other end.</p>
          <div className="tz-axis-wrap"><Axis left={RIGHT - SPAN_FAR} right={RIGHT} /></div>
          <BeginLink />
        </div>
      </div>
    </section>
  );
}
