"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JEWELS } from "@/lib/poetry-gem/options";
import s from "./vectors.module.css";

type Pt = { id: string; label: string; p: number[]; pack?: string; i?: number; source?: string };
export type MapData = { passages: Pt[]; words: Pt[]; explained: { passages: number; words: number } };
type Layer = "passages" | "words";
type Hit = { id: string; label: string; score: number; sub?: string };

// jewel tones sampled from the costume plates
const PACK_COLORS: Record<string, string> = { phaedrus: JEWELS.sapphire, frankenstein: JEWELS.emerald, analects: JEWELS.garnet };
const PACK_NAMES: Record<string, string> = { phaedrus: "Phaedrus", frankenstein: "Frankenstein", analects: "Analects" };
const WORD_COLOR = JEWELS.gold;
const INK = "#231f1d";
const GRAPHITE = "rgba(62, 56, 50, .55)";

/** Small deterministic noise per point, so each dab keeps its own wobbly shape as the scene turns. */
function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (k: number) => {
    const x = Math.sin(h * 0.0001 + k * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
}

/** An irregular gouache dab: a lumpy polygon, darker at the rim like dried watercolour. */
function dab(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, id: string) {
  const rnd = seeded(id);
  const n = 9;
  ctx.beginPath();
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2 + rnd(99);
    const rr = r * (0.78 + 0.42 * rnd(k % n));
    const px = x + rr * Math.cos(a), py = y + rr * Math.sin(a) * 0.9;
    if (k === 0) ctx.moveTo(px, py);
    else ctx.quadraticCurveTo(x + rr * 1.1 * Math.cos(a - 0.3), y + rr * 1.1 * Math.sin(a - 0.3) * 0.9, px, py);
  }
  ctx.closePath();
}

/** A graphite stroke that wanders slightly, drawn twice like a pencil going back over itself. */
function pencil(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, seed: string) {
  const rnd = seeded(seed);
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  for (let pass = 0; pass < 2; pass++) {
    const bow = (rnd(pass) - 0.5) * Math.min(14, len * 0.06);
    ctx.beginPath();
    ctx.moveTo(x0 + nx * pass * 0.6, y0 + ny * pass * 0.6);
    ctx.quadraticCurveTo(x0 + dx / 2 + nx * bow, y0 + dy / 2 + ny * bow, x1, y1);
    ctx.stroke();
  }
}

function apiKey() {
  try {
    return localStorage.getItem("poetry-gem-key") ?? "";
  } catch {
    return "";
  }
}

export default function VectorExplorer({ data }: { data: MapData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layer, setLayer] = useState<Layer>("words"); // single words first: the easier picture to read
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<{ pt: Pt; x: number; y: number } | null>(null);
  const [anchor, setAnchor] = useState<{ label: string; p?: number[]; id?: string } | null>(null);
  const [hits, setHits] = useState<Hit[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [spin, setSpin] = useState(true);

  // Camera lives in a ref so dragging doesn't re-render React on every frame.
  const cam = useRef({ yaw: 0.6, pitch: -0.35, zoom: 1, drag: null as null | { x: number; y: number; moved: boolean } });
  const screen = useRef<{ pt: Pt; x: number; y: number }[]>([]);
  // The draw loop reads the latest React state through this ref.
  const state = useRef({ layer, hidden, anchor, hits, hoverId: "" as string | undefined, spin });
  useEffect(() => {
    state.current = { layer, hidden, anchor, hits, hoverId: hover?.pt.id, spin };
  }, [layer, hidden, anchor, hits, hover, spin]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (cv.width !== w * dpr) {
      cv.width = w * dpr;
      cv.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const { yaw, pitch, zoom } = cam.current;
    const st = state.current;
    const R = Math.min(w, h) * 0.42 * zoom;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const proj = (p: number[]) => {
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      const f = 3 / (3 + z2);
      return { x: w / 2 + x1 * f * R, y: h / 2 + y2 * f * R, z: z2, f };
    };

    const serif = getComputedStyle(document.body).getPropertyValue("--font-serif") || "Georgia, serif";

    // faint pencilled axes
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(62, 56, 50, .16)";
    for (const [i, axis] of [[1, 0, 0], [0, 1, 0], [0, 0, 1]].entries()) {
      const a = proj(axis.map((v) => -v));
      const b = proj(axis);
      pencil(ctx, a.x, a.y, b.x, b.y, `axis${i}`);
    }

    const pts = (st.layer === "passages" ? data.passages : data.words).filter((p) => !p.pack || !st.hidden.has(p.pack));
    const hitIds = new Set(st.hits.map((h) => h.id));
    const focus = st.hits.length > 0;
    const projected = pts.map((pt) => ({ pt, ...proj(pt.p) })).sort((a, b) => b.z - a.z);
    screen.current = projected;

    // pencil lines from the anchor (query or clicked point) to its true nearest neighbours
    const anchorPos = st.anchor?.p ? proj(st.anchor.p) : st.anchor?.id ? projected.find((p) => p.pt.id === st.anchor!.id) : undefined;
    if (anchorPos && focus) {
      ctx.strokeStyle = GRAPHITE;
      ctx.lineWidth = 1;
      for (const p of projected) {
        if (hitIds.has(p.pt.id)) pencil(ctx, anchorPos.x, anchorPos.y, p.x, p.y, p.pt.id);
      }
    }

    for (const p of projected) {
      const isHit = hitIds.has(p.pt.id);
      const isAnchor = st.anchor?.id === p.pt.id;
      const isHover = st.hoverId === p.pt.id;
      const color = p.pt.pack ? PACK_COLORS[p.pt.pack] : WORD_COLOR;
      const r = (st.layer === "words" ? 5.5 : 4) * p.f * (isHit || isAnchor || isHover ? 1.7 : 1);
      ctx.globalAlpha = focus && !isHit && !isAnchor ? 0.12 : Math.min(0.92, 0.4 + 0.42 * p.f);
      dab(ctx, p.x, p.y, r, p.pt.id);
      if (p.pt.source === "voice") {
        // voice prompt: an inked ring rather than a filled dab
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = color;
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha *= 0.55;
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = INK;
        ctx.stroke();
      }
      if (st.layer === "words" || isHit || isAnchor) {
        ctx.globalAlpha = focus && !isHit && !isAnchor ? 0.3 : 1;
        ctx.fillStyle = INK;
        ctx.font = `italic ${isHit || isAnchor ? 600 : 400} ${st.layer === "words" ? 15 : 13.5}px ${serif}`;
        const label = p.pt.label.length > 34 ? p.pt.label.slice(0, 32) + "…" : p.pt.label;
        ctx.fillText(label, p.x + r + 4, p.y + 4);
      }
    }
    ctx.globalAlpha = 1;

    // the query: a little cut-out paper star, white-bordered like the agent stickers
    if (st.anchor?.p && anchorPos) {
      const star = (rOut: number, rIn: number) => {
        ctx.beginPath();
        for (let k = 0; k < 10; k++) {
          const rad = k % 2 ? rIn : rOut;
          const a = (Math.PI / 5) * k - Math.PI / 2 + 0.12;
          ctx.lineTo(anchorPos.x + rad * Math.cos(a), anchorPos.y + rad * Math.sin(a));
        }
        ctx.closePath();
      };
      ctx.save();
      ctx.shadowColor = "rgba(50, 35, 20, .35)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      star(15, 7);
      ctx.fillStyle = "#fffaf0";
      ctx.fill();
      ctx.restore();
      star(11.5, 5);
      ctx.fillStyle = JEWELS.vermilion;
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.font = `italic 600 16px ${serif}`;
      ctx.fillText(`“${st.anchor.label}”`, anchorPos.x + 18, anchorPos.y - 10);
    }
  }, [data]);

  // animation loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (state.current.spin && !cam.current.drag) cam.current.yaw += 0.0025;
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  function pick(x: number, y: number) {
    let best: (typeof screen.current)[number] | undefined;
    let bd = 10 * 10;
    for (const p of screen.current) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    return best;
  }

  async function lookup(params: Record<string, string>, anchorInfo: { label: string; id?: string }) {
    setBusy(true);
    setErr("");
    try {
      const key = apiKey();
      const r = await fetch(`/api/poetry-gem/vectors?${new URLSearchParams({ layer, k: "8", ...params })}`, {
        headers: key ? { "x-openrouter-key": key } : {},
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? r.statusText);
      setAnchor({ ...anchorInfo, p: body.coords ?? undefined });
      setHits(
        layer === "words"
          ? body.hits.filter((h: { word: string }) => h.word !== anchorInfo.id).map((h: { word: string; score: number }) => ({ id: h.word, label: h.word, score: h.score }))
          : body.hits.map((h: { pack: string; i: number; title: string; score: number; source: string }) => ({
              id: `${h.pack}:${h.i}`,
              label: h.title,
              score: h.score,
              sub: `${PACK_NAMES[h.pack]} · ${h.source}`,
            })),
      );
      setSpin(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setAnchor(null);
    setHits([]);
    setErr("");
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    cam.current.drag = { x: e.clientX, y: e.clientY, moved: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const d = cam.current.drag;
    if (d) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
      cam.current.yaw += dx * 0.008;
      cam.current.pitch = Math.max(-1.5, Math.min(1.5, cam.current.pitch + dy * 0.008));
      d.x = e.clientX;
      d.y = e.clientY;
      setHover(null);
      return;
    }
    const p = pick(e.clientX - rect.left, e.clientY - rect.top);
    setHover(p ? { pt: p.pt, x: p.x, y: p.y } : null);
  }
  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = cam.current.drag;
    cam.current.drag = null;
    if (d?.moved) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = pick(e.clientX - rect.left, e.clientY - rect.top);
    if (!p) return clear();
    if (layer === "words") lookup({ q: p.pt.label }, { label: p.pt.label, id: p.pt.id });
    else lookup({ pack: p.pt.pack!, i: String(p.pt.i) }, { label: p.pt.label, id: p.pt.id });
  }

  // zoom with the wheel without scrolling the page
  useEffect(() => {
    const cv = canvasRef.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cam.current.zoom = Math.max(0.5, Math.min(6, cam.current.zoom * Math.exp(-e.deltaY * 0.0015)));
    };
    cv.addEventListener("wheel", onWheel, { passive: false });
    return () => cv.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className={s.wrap}>
      <div className={s.toolbar}>
        <div className={s.seg}>
          {(["words", "passages"] as const).map((l) => (
            <button
              key={l}
              aria-pressed={layer === l}
              onClick={() => {
                setLayer(l);
                clear();
              }}
            >
              {l === "passages" ? `Passages (${data.passages.length})` : `Words (${data.words.length})`}
            </button>
          ))}
        </div>
        {layer === "passages" &&
          Object.keys(PACK_COLORS).map((p) => (
            <label key={p} className={s.legend}>
              <input
                type="checkbox"
                checked={!hidden.has(p)}
                onChange={() =>
                  setHidden((h) => {
                    const n = new Set(h);
                    if (n.has(p)) n.delete(p);
                    else n.add(p);
                    return n;
                  })
                }
              />
              <i style={{ background: PACK_COLORS[p] }} /> {PACK_NAMES[p]}
            </label>
          ))}
        {layer === "passages" && (
          <span className={s.note}>
            <i className={s.ring} /> voice prompt · <i className={s.dot} /> the text
          </span>
        )}
        <button className={s.small} onClick={() => setSpin((v) => !v)}>
          {spin ? "Pause rotation" : "Rotate"}
        </button>
      </div>

      <form
        className={s.query}
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) lookup({ q }, { label: q });
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={layer === "passages" ? "Enter a query, e.g. waiting for the bus in the rain" : "Type a word, e.g. drizzle"}
        />
        <button disabled={busy || !q.trim()}>{busy ? "Embedding…" : "Place it"}</button>
        {(anchor || err) && (
          <button type="button" className={s.small} onClick={clear}>
            Clear
          </button>
        )}
      </form>

      <div className={s.stage}>
        <canvas
          ref={canvasRef}
          className={s.canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setHover(null)}
        />
        {hover && (
          <div className={s.tip} style={{ left: hover.x + 12, top: hover.y + 12 }}>
            <strong>{hover.pt.label}</strong>
            {hover.pt.pack && (
              <span>
                {PACK_NAMES[hover.pt.pack]} · {hover.pt.source}
              </span>
            )}
          </div>
        )}
        <aside className={s.panel}>
          {err ? (
            <p className={s.err}>{err}</p>
          ) : anchor ? (
            <>
              <div className={s.panelHead}>Nearest to &ldquo;{anchor.label}&rdquo;</div>
              <p className={s.panelNote}>Nearest vectors across all 512 dimensions (cosine similarity)</p>
              <ol>
                {hits.map((h) => (
                  <li key={h.id}>
                    <span>{h.label}</span>
                    {h.sub && <small>{h.sub}</small>}
                    <b>{h.score.toFixed(3)}</b>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className={s.panelNote}>
              Drag to rotate · scroll to zoom · hover a dot for its title · click a dot (or place a query) to see its
              nearest neighbours. This 3D view keeps ~{Math.round(data.explained[layer] * 100)}% of the variation in the
              real 512-dimensional space.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
