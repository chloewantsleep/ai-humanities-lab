import Link from "next/link";
import { readMap } from "@/lib/poetry-gem/vectors";
import Nav from "@/app/poetry-gem/library/Nav";
import s from "@/app/poetry-gem/library/library.module.css";
import VectorExplorer, { type MapData } from "./VectorExplorer";

export const metadata = { title: "Vector map · Poetry Gem" };

export default function VectorsPage() {
  const raw = readMap();
  const data: MapData = {
    passages: raw.passages.points.map((p: { pack: string; i: number; title: string; source: string; p: number[] }) => ({
      id: `${p.pack}:${p.i}`,
      pack: p.pack,
      i: p.i,
      label: p.title,
      source: p.source,
      p: p.p,
    })),
    words: raw.words.points.map((w: { word: string; p: number[] }) => ({ id: w.word, label: w.word, p: w.p })),
    explained: {
      passages: raw.passages.basis.explained.reduce((a: number, b: number) => a + b, 0),
      words: raw.words.basis.explained.reduce((a: number, b: number) => a + b, 0),
    },
  };
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  return (
    <div className={s.page}>
      <Nav current="vectors" />
      <main className={s.main}>
        <p className={s.kicker}>How meaning-based retrieval works</p>
        <h1>Vector map</h1>
        <p className={s.lede}>
          This map shows words and passages from the reading packs. Similar vectors indicate related text.
          Switch between Words and Passages, or enter a search query.
        </p>

        <VectorExplorer data={data} />

        <div className={s.prose}>
          <h2>1. Convert text to vectors</h2>
          <p>
            The embedding model, <code>{raw.model}</code>, converts each text into {raw.dims} numbers.
            This list is a vector. The model gives related texts similar vectors.
          </p>

          <h2>2. Store the passage vectors</h2>
          <p>
            Each reading pack contains passages and their saved vectors. The search compares your query with each passage.
          </p>

          <h2>3. Retrieve passages</h2>
          <p>
            The search converts your query to a vector. It ranks passage vectors by cosine similarity and adds the selected passages to the prompt.
            Enter a query above to see the results.
          </p>

          <h2>4. Read the map</h2>
          <p>
            PCA (principal component analysis) reduces {raw.dims} dimensions to three for this display.
            The passage map preserves about <strong>{pct(data.explained.passages)}</strong> of the variation.
            Distances on screen are approximate. Select a point to see neighbours calculated with all {raw.dims} dimensions.
          </p>

          <h2>5. Compare search methods</h2>
          <ul>
            <li>
              <strong>Keyword search (BM25)</strong> matches words in your query. It returns no passages when no words match.
            </li>
            <li>
              <strong>Vector search</strong> ranks passages by vector similarity. It can find related words, but it can also return irrelevant passages.
            </li>
          </ul>
          <p>
            <Link href="/poetry-gem/packs/analects?tab=search">Compare the search results for a reading pack.</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
