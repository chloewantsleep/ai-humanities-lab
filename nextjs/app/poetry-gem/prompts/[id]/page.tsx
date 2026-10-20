import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getGenre, loadGenres } from "@/lib/poetry-gem/content";
import Nav from "@/app/poetry-gem/library/Nav";
import s from "@/app/poetry-gem/library/library.module.css";

export function generateStaticParams() {
  return loadGenres().map((g) => ({ id: g.id }));
}

export default async function PromptPage(props: PageProps<"/poetry-gem/prompts/[id]">) {
  const { id } = await props.params;
  const g = getGenre(id);
  if (!g) notFound();
  return (
    <div className={s.page}>
      <Nav current={`prompt:${id}`} />
      <main className={s.main}>
        <p className={s.kicker}>Instructions · system prompt</p>
        <h1>{g.label}</h1>
        <p className={s.lede}>{g.blurb}</p>
        <div className={s.prose}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{g.prompt}</ReactMarkdown>
        </div>
        <details className={s.raw}>
          <summary>Raw instruction text</summary>
          <p className={s.meta}>
            These instructions begin the system prompt. If you select a pack, the studio adds its text or search instructions.
          </p>
          <pre>{g.prompt}</pre>
        </details>
        <p className={s.meta}>
          Source file: <code>content/prompts/{id}.md</code>
        </p>
      </main>
    </div>
  );
}
