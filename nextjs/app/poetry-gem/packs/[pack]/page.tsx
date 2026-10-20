import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { packInfo, packSections, readVoice } from "@/lib/poetry-gem/content";
import { PACKS, PACK_LABELS, type PackId, type TextLevel } from "@/lib/poetry-gem/options";
import Nav from "@/app/poetry-gem/library/Nav";
import s from "@/app/poetry-gem/library/library.module.css";
import PackSearch from "./PackSearch";

const TABS = [
  { id: "voice", label: "Voice prompt" },
  { id: "text", label: "Text" },
  { id: "search", label: "Try the searches" },
] as const;
const LEVELS: TextLevel[] = ["assigned", "more", "whole"];

const fmt = (n: number) => n.toLocaleString("en-US");

export default async function PackPage(props: PageProps<"/poetry-gem/packs/[pack]">) {
  const { pack } = await props.params;
  const { tab: rawTab, level: rawLevel } = await props.searchParams;
  if (!PACKS.includes(pack as PackId) || pack === "none") notFound();
  const p = pack as PackId;
  const tab = TABS.find((t) => t.id === rawTab)?.id ?? "voice";
  const level = LEVELS.find((l) => l === rawLevel) ?? "assigned";
  const info = packInfo(p);

  return (
    <div className={s.page}>
      <Nav current={`pack:${p}`} />
      <main className={s.main}>
        <p className={s.kicker}>Context pack</p>
        <h1>{PACK_LABELS[p]}</h1>
        <p className={s.meta}>
          {info.edition} · voice prompt ≈ {fmt(info.levels.voice.approxTokens)} tokens ·{" "}
          {LEVELS.map((l) => `${info.levels[l].label} ≈ ${fmt(info.levels[l].approxTokens)}`).join(" · ")} tokens ·
          source: <code>content/packs/{p}/</code>
        </p>
        <div className={s.tabs}>
          {TABS.map((t) => (
            <Link key={t.id} href={`/poetry-gem/packs/${p}?tab=${t.id}`} className={tab === t.id ? s.tabOn : ""}>
              {t.label}
            </Link>
          ))}
        </div>

        {tab === "voice" && (
          <div className={s.prose}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readVoice(p)}</ReactMarkdown>
          </div>
        )}
        {tab === "text" && <Text pack={p} level={level} info={info} />}
        {tab === "search" && <PackSearch pack={p} levels={info.levels} />}
      </main>
    </div>
  );
}

function Text({ pack, level, info }: { pack: PackId; level: TextLevel; info: ReturnType<typeof packInfo> }) {
  const sections = packSections(pack).filter((x) => x.levels.includes(level));
  return (
    <>
      <div className={s.levelPicker}>
        <span>How much of the text:</span>
        {LEVELS.map((l) => (
          <Link key={l} href={`/poetry-gem/packs/${pack}?tab=text&level=${l}`} className={l === level ? s.levelOn : ""}>
            {info.levels[l].label} <small>≈ {fmt(info.levels[l].approxTokens)} tokens</small>
          </Link>
        ))}
      </div>
      <p className={s.meta}>{info.levels[level].blurb}</p>
      <div className={s.readingLayout}>
        <aside className={s.toc}>
          <strong>Contents</strong>
          <ol>
            {sections.map((x, i) => (
              <li key={i}>
                <a href={`#sec${i}`}>{x.title}</a>
              </li>
            ))}
          </ol>
        </aside>
        <div>
          {sections.map((x, i) => (
            <section key={i} id={`sec${i}`} className={`${s.prose} ${s.reading}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{x.text}</ReactMarkdown>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
