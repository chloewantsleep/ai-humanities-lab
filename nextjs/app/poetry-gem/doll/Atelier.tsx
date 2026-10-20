"use client";

import { BAND_ORDER, FOLDS, PlateFigure, cast, type Band, type DollSpec } from "./Doll";
import s from "./atelier.module.css";
import manifest from "@/public/poetry-gem/doll/mj/manifest.json";

// The plate is drawn with crop="frame", so the controls sit inside the frame's left and right edges, not the canvas's.
const [FRAME_X0, , FRAME_X1] = manifest.bounds as number[];

type Option = { id: string; label: string };
export type AtelierOptions = Record<Band, Option[]>;

const BAND_META: Record<Band, { part: string; knob: string }> = {
  head: { part: "Head", knob: "Instructions" },
  torso: { part: "Bodice", knob: "Knowledge" },
  legs: { part: "Legs", knob: "Delivery" },
};
// Where each band's controls sit, as a fraction of the figure height.
const ZONES: Record<Band, [number, number]> = {
  head: [0, FOLDS.neck],
  torso: [FOLDS.neck, FOLDS.hip],
  legs: [FOLDS.hip, 1],
};

/** The dressing plate: one assembled figure, with each fold flipped independently. */
export default function Atelier({
  spec,
  options,
  onChange,
  caption,
}: {
  spec: DollSpec;
  options: AtelierOptions;
  onChange: (band: Band, id: string) => void;
  caption?: string;
}) {
  const step = (band: Band, dir: 1 | -1) => {
    const opts = options[band];
    const i = Math.max(0, opts.findIndex((o) => o.id === spec[band]));
    onChange(band, opts[(i + dir + opts.length) % opts.length].id);
  };

  return (
    <figure className={s.plate}>
      <PlateFigure plates={cast(spec)} crop="frame" className={s.figure}>
        {BAND_ORDER.map((band) => {
          const [top, bottom] = ZONES[band];
          return (
            <div key={band} className={s.zone} style={{ top: `${top * 100}%`, height: `${(bottom - top) * 100}%`, left: `${FRAME_X0 * 100}%`, right: `${(1 - FRAME_X1) * 100}%` }}>
              <button className={s.arrow} onClick={() => step(band, -1)} aria-label={`Previous ${BAND_META[band].knob}`}>
                ‹
              </button>
              <button className={s.arrow} onClick={() => step(band, 1)} aria-label={`Next ${BAND_META[band].knob}`}>
                ›
              </button>
            </div>
          );
        })}
      </PlateFigure>
      <ol className={s.legend} aria-label="What each part of the figure is set to">
        {BAND_ORDER.map((band) => {
          const current = options[band].find((o) => o.id === spec[band]);
          return (
            <li key={band}>
              <b>{BAND_META[band].part}</b>
              <span>{BAND_META[band].knob}: {current?.label ?? spec[band]}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className={s.caption}>
        <span className={s.title}>L&rsquo;Agent</span>
        {caption && <span className={s.sub}>{caption}</span>}
        <span className={s.planche}>
          <span>Costume pour un agent</span>
          <span>Planche I</span>
        </span>
      </figcaption>
    </figure>
  );
}
