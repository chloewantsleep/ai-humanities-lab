"use client";

import { BAND_ORDER, FOLDS, PlateFigure, cast, type Band, type DollSpec } from "./Doll";
import s from "./atelier.module.css";

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
          const current = options[band].find((o) => o.id === spec[band]);
          return (
            <div key={band} className={s.zone} style={{ top: `${top * 100}%`, height: `${(bottom - top) * 100}%` }}>
              <button className={s.arrow} onClick={() => step(band, -1)} aria-label={`Previous ${BAND_META[band].knob}`}>
                ‹
              </button>
              <span className={s.tag}>
                <b>{BAND_META[band].part}</b> · {BAND_META[band].knob}: {current?.label ?? spec[band]}
              </span>
              <button className={s.arrow} onClick={() => step(band, 1)} aria-label={`Next ${BAND_META[band].knob}`}>
                ›
              </button>
            </div>
          );
        })}
      </PlateFigure>
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
