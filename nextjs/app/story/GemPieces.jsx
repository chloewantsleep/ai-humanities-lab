"use client";

import { Doll } from "../poetry-gem/doll/Doll";

// The Poetry Gem's figure, dressed as far as the timeline has got: head = instructions, bodice (torso) = knowledge,
// skirt (legs) = delivery. Bands not yet introduced are drawn as faint paper. `show` lists the bands that are on.
const BANDS = [
  { key: "head", label: "Instructions", note: "a poetic form" },
  { key: "torso", label: "Knowledge", note: "a reading pack" },
  { key: "legs", label: "Delivery", note: "how the text reaches the model" },
];

export default function GemPieces({ show = [] }) {
  const on = new Set(show);
  const off = BANDS.filter((b) => !on.has(b.key)).map((b) => `gem-off-${b.key}`).join(" ");
  return (
    <div className="gem-pieces">
      <Doll spec={{ head: "ghazal", torso: "frankenstein", legs: "semantic" }} crop="frame" className={`gem-figure ${off}`} title={`The Poetry Gem's figure, with ${show.length} of 3 parts`} />
      <ol className="gem-legend">
        {BANDS.map((b) => (
          <li key={b.key} className={on.has(b.key) ? "is-on" : ""}>
            <span>{b.key === "torso" ? "Bodice" : b.key === "legs" ? "Skirt" : "Head"}</span>
            <strong>{b.label}</strong>
            <em>{b.note}</em>
          </li>
        ))}
      </ol>
    </div>
  );
}
