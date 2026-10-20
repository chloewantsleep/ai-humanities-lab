"use client";

import { useState } from "react";
import Atelier, { type AtelierOptions } from "./Atelier";
import type { DollSpec } from "./Doll";

export default function Dresser({ options }: { options: AtelierOptions }) {
  const [spec, setSpec] = useState<DollSpec>({ head: options.head[0]?.id ?? "sonnet", torso: "donne", legs: "full" });
  const label = (band: keyof DollSpec) => options[band].find((o) => o.id === spec[band])?.label;
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 8px" }}>
      <Atelier
        spec={spec}
        options={options}
        onChange={(band, id) => setSpec((p) => ({ ...p, [band]: id }))}
        caption={`${label("head")} · ${label("torso")} · ${label("legs")}`}
      />
    </div>
  );
}
