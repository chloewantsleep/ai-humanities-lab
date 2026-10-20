"use client";

import { useMemo, useState } from "react";
import { FOLDS, PlateFigure } from "../Doll";
import s from "./corpse.module.css";

export type CorpseData = {
  canvas: [number, number];
  neck: [number, number];
  hip: [number, number];
  figures: Record<string, { hipDx: number }>;
};
import type { Band, PlateSpec as Spec } from "../Doll";
const BANDS: Band[] = ["head", "torso", "legs"];
const LABEL: Record<Band, string> = { head: "Head", torso: "Torso", legs: "Legs" };

function Figure({ spec, folded }: { spec: Spec; data: CorpseData; folded?: Set<Band> }) {
  const { neck, hip } = FOLDS;
  return (
    <PlateFigure plates={spec} className={s.figure}>
      {folded?.has("head") && <div className={s.fold} style={{ top: 0, height: `${(neck + 0.02) * 100}%` }} />}
      {folded?.has("torso") && <div className={s.fold} style={{ top: `${(neck + 0.02) * 100}%`, height: `${(hip - neck) * 100}%` }} />}
      {folded?.has("legs") && <div className={s.fold} style={{ top: `${(hip + 0.02) * 100}%`, bottom: 0 }} />}
    </PlateFigure>
  );
}

function shuffled(ids: string[]): Spec {
  const pick = () => ids[Math.floor(Math.random() * ids.length)];
  return { head: pick(), torso: pick(), legs: pick() };
}

export default function Corpse({ data }: { data: CorpseData }) {
  const ids = useMemo(() => Object.keys(data.figures), [data]);
  const [spec, setSpec] = useState<Spec>({ head: ids[3], torso: ids[7], legs: ids[0] });
  const [game, setGame] = useState<Set<Band> | null>(null);
  const [wall, setWall] = useState<Spec[]>(() => ids.map((id, i) => ({ head: id, torso: ids[(i + 3) % ids.length], legs: ids[(i + 6) % ids.length] })));

  const step = (band: Band, dir: number) =>
    setSpec((p) => ({ ...p, [band]: ids[(ids.indexOf(p[band]) + dir + ids.length) % ids.length] }));

  function playGame() {
    setSpec(shuffled(ids));
    setGame(new Set(BANDS));
  }
  function reveal() {
    setGame((g) => {
      if (!g) return g;
      const next = new Set(g);
      const first = BANDS.find((b) => next.has(b));
      if (first) next.delete(first);
      return next.size ? next : null;
    });
  }

  return (
    <>
      <div className={s.stage}>
        <div className={s.controls}>
          {BANDS.map((band) => (
            <div key={band} className={s.control}>
              <span>{LABEL[band]}</span>
              <button onClick={() => step(band, -1)} aria-label={`Previous ${band}`}>‹</button>
              <code>{game?.has(band) ? "?" : spec[band].replace("mj", "")}</code>
              <button onClick={() => step(band, 1)} aria-label={`Next ${band}`}>›</button>
            </div>
          ))}
          <div className={s.buttons}>
            <button className={s.primary} onClick={() => setSpec(shuffled(ids))}>Shuffle</button>
            {game ? (
              <button className={s.primary} onClick={reveal}>Unfold the next part</button>
            ) : (
              <button onClick={playGame}>Play the game (fold &amp; reveal)</button>
            )}
          </div>
          <p className={s.note}>
            In the parlour game each player draws one part on a folded sheet without seeing the others. Here the folds hide
            the parts until you open them, top to bottom.
          </p>
        </div>
        <div className={s.plate}>
          <Figure spec={spec} data={data} folded={game ?? undefined} />
          <div className={s.caption}>
            <span>Cadavre exquis</span>
            <span>
              {spec.head.replace("mj", "")} · {spec.torso.replace("mj", "")} · {spec.legs.replace("mj", "")}
            </span>
          </div>
        </div>
      </div>

      <div className={s.wallHead}>
        <h2>Sample combinations</h2>
        <button onClick={() => setWall(ids.map(() => shuffled(ids)))}>Shuffle the wall</button>
      </div>
      <div className={s.wall}>
        {wall.map((w, i) => (
          <button key={i} className={s.tile} onClick={() => setSpec(w)} title="Open this one above">
            <Figure spec={w} data={data} />
          </button>
        ))}
      </div>

      <h2>Original costume plates</h2>
      <div className={s.wall}>
        {ids.map((id) => (
          <button key={id} className={s.tile} onClick={() => setSpec({ head: id, torso: id, legs: id })}>
            <Figure spec={{ head: id, torso: id, legs: id }} data={data} />
            <small>{id}</small>
          </button>
        ))}
      </div>
    </>
  );
}
