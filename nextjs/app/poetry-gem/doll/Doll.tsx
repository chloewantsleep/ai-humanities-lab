// "The Agent": an exquisite-corpse figure built from cut-up Midjourney costume plates.
//   head = Instructions (genre)    torso = Knowledge (pack)    legs = Delivery
// Pieces live in public/doll/mj/{head,torso,legs}-<plate>.webp, cut by the scratch script described in
// public/doll/mj/README.md and pinned to one skeleton (manifest.json: shared neck and hip points).
/* eslint-disable @next/next/no-img-element -- stacked transparent layers; next/image adds nothing here */

import manifest from "@/public/poetry-gem/doll/mj/manifest.json";

export type Band = "head" | "torso" | "legs";
export const BAND_ORDER: Band[] = ["head", "torso", "legs"];
/** A figure named by plate id for each band, e.g. { head: "mj15", torso: "mj16", legs: "mj18" }. */
export type PlateSpec = Record<Band, string>;
/** A figure named by the agent's settings: { head: genre, torso: pack, legs: delivery }. */
export type DollSpec = Record<Band, string>;

// Which plate plays which part (chosen by Madeleine, 2026-10-19; bodices recast in the same order when the
// packs moved from poets to course readings).
export const CASTING: Record<Band, Record<string, string>> = {
  head: { ghazal: "mj15", haiku: "mj13", sonnet: "mj16" },
  torso: { phaedrus: "mj15", frankenstein: "mj16", analects: "mj18", none: "mj12" },
  legs: { full: "mj18", lexical: "mj14", semantic: "mj15", agentic: "mj12" },
};

export const PLATES = Object.keys(manifest.figures);
const [W, H] = manifest.canvas;
/** Fold lines as a fraction of the figure's height. */
export const FOLDS = { neck: manifest.neck[1] / H, hip: manifest.hip[1] / H };

export function cast(spec: DollSpec): PlateSpec {
  const pick = (band: Band) => CASTING[band][spec[band]] ?? Object.values(CASTING[band])[0];
  return { head: pick("head"), torso: pick("torso"), legs: pick("legs") };
}

type Box = [number, number, number, number]; // x0, y0, x1, y1 as fractions of the canvas
type FigureMeta = { hipDx: number; bbox: Record<Band, Box> };
const figures = manifest.figures as unknown as Record<string, FigureMeta>;

/** The drawn area of one particular assembled figure (legs shifted to their torso's hip). */
function tightBox(plates: PlateSpec): Box {
  const dx = (figures[plates.torso]?.hipDx ?? 0) / W;
  const boxes = BAND_ORDER.map((band) => {
    const b = figures[plates[band]]?.bbox[band] ?? [0, 0, 1, 1];
    return band === "legs" ? ([b[0] + dx, b[1], b[2] + dx, b[3]] as Box) : b;
  });
  const pad = 0.012;
  return [
    Math.max(0, Math.min(...boxes.map((b) => b[0])) - pad),
    Math.max(0, Math.min(...boxes.map((b) => b[1])) - pad),
    Math.min(1, Math.max(...boxes.map((b) => b[2])) + pad),
    Math.min(1, Math.max(...boxes.map((b) => b[3])) + pad),
  ];
}

/**
 * The layered figure: legs first (shifted to meet this torso's hip), torso over them, head on top.
 * crop: "none" shows the whole canvas; "frame" crops to the area any figure can occupy (a steady frame
 * while parts are swapped); "tight" crops to this figure alone (for stickers).
 * Children are positioned in canvas fractions, so fold lines line up whatever the crop.
 */
export function PlateFigure({
  plates,
  crop = "none",
  className,
  title,
  children,
}: {
  plates: PlateSpec;
  crop?: "none" | "frame" | "tight";
  className?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const dx = (figures[plates.torso]?.hipDx ?? 0) / W;
  const [x0, y0, x1, y1]: Box =
    crop === "tight" ? tightBox(plates) : crop === "frame" ? (manifest.bounds as Box) : [0, 0, 1, 1];
  const cw = x1 - x0;
  const ch = y1 - y0;
  return (
    <div
      className={className}
      role="img"
      aria-label={title ?? "The agent"}
      style={{ position: "relative", aspectRatio: `${cw * W} / ${ch * H}`, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          width: `${100 / cw}%`,
          height: `${100 / ch}%`,
          left: `${(-x0 / cw) * 100}%`,
          top: `${(-y0 / ch) * 100}%`,
        }}
      >
        <img src={`/poetry-gem/doll/mj/legs-${plates.legs}.webp`} alt="" style={{ ...layer, transform: `translateX(${dx * 100}%)` }} />
        <img src={`/poetry-gem/doll/mj/torso-${plates.torso}.webp`} alt="" style={layer} />
        <img src={`/poetry-gem/doll/mj/head-${plates.head}.webp`} alt="" style={layer} />
        {children}
      </div>
    </div>
  );
}

const layer: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  filter: "drop-shadow(1.5px 2.5px 2px rgba(50, 35, 20, .28))", // paper laid on paper
};

/** The agent for a given configuration. */
export function Doll({
  spec,
  crop,
  className,
  title,
}: {
  spec: DollSpec;
  crop?: "none" | "frame" | "tight";
  className?: string;
  title?: string;
}) {
  return <PlateFigure plates={cast(spec)} crop={crop} className={className} title={title} />;
}
