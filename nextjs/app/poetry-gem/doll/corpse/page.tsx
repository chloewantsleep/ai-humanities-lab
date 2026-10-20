import fs from "node:fs";
import path from "node:path";
import Nav from "@/app/poetry-gem/library/Nav";
import lib from "@/app/poetry-gem/library/library.module.css";
import Corpse, { type CorpseData } from "./Corpse";

export const metadata = { title: "Exquisite corpse · Poetry Gem" };

export default function CorpsePage() {
  const data = JSON.parse(
    fs.readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), "public", "poetry-gem", "doll", "mj", "manifest.json"), "utf8"),
  ) as CorpseData;
  return (
    <div className={lib.page}>
      <Nav current="doll" />
      <main className={lib.main} style={{ maxWidth: 1200 }}>
        <p className={lib.kicker}>Costume combinations</p>
        <h1>Exquisite corpse</h1>
        <p className={lib.lede}>
          Combine heads, torsos, and legs from nine Midjourney costume plates. The parts allow {Object.keys(data.figures).length ** 3} combinations.
        </p>
        <Corpse data={data} />
      </main>
    </div>
  );
}
