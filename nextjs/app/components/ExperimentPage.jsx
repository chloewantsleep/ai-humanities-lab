import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperiment } from "../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "./Chrome.jsx";
import Markdown from "./Markdown.jsx";

// The frame every experiment route shares: the heading and description from content/experiments/<name>.md, the
// experiment itself (the route's client component, passed as children), and the document's notes below it.
// The notes are also readable on their own at /experiments/<name>.
export default async function ExperimentPage({ name, children }) {
  const experiment = await getExperiment(name);
  if (!experiment) notFound();

  return (
    <>
      <SiteHeader current={name} />
      <main id="main" className="experiment-shell">
        <header className="experiment-heading">
          <Link className="today-link" href="/">← Today</Link>
          <p className="eyebrow">Experiment · <span className={`status status-${experiment.status}`}>{experiment.status}</span></p>
          <h1>{experiment.title}</h1>
          {experiment.description && <p className="lede">{experiment.description}</p>}
        </header>
        <section className="experiment-stage">{children}</section>
        {experiment.content.trim() && (
          <details className="experiment-notes">
            <summary>About this experiment</summary>
            <article className="prose"><Markdown doc={experiment} /></article>
            <p className="updated">In the repo: <code>{experiment.source}</code> · <Link href={`/print${experiment.href}`}>Print the notes</Link></p>
          </details>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

// What a route shows until its experiment is built.
export function NotBuiltYet({ task }) {
  return (
    <div className="not-built">
      <p className="eyebrow">Not built yet</p>
      <p>This experiment is <code>{task}</code> in <code>_context/orchestration/</code>.</p>
    </div>
  );
}
