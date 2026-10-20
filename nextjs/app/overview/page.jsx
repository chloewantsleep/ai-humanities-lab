import Link from "next/link";
import { getExperimentGroups, getRoot, site } from "../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import ExperimentGroups, { todayPath } from "../components/ExperimentGroups.jsx";
import Markdown from "../components/Markdown.jsx";

export const dynamic = "force-dynamic";

// The home page: today's path first, then the intro (content/README.md), then the experiments in groups
// (content/experiments/, grouped by their `group:` frontmatter; see lib/content.mjs).

export default async function Home() {
  const root = await getRoot();
  const groups = await getExperimentGroups();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero hero-compact" aria-labelledby="site-title">
          <p className="eyebrow">{site.label} · {site.term}</p>
          <Link className="today-banner" href={todayPath.href}>
            <span className="today-banner-kicker">Today, October 20</span>
            <span className="today-banner-title">Build and test a chatbot <span aria-hidden="true">→</span></span>
            <span className="today-banner-copy">The path through the session: {todayPath.href}</span>
          </Link>
          <h1 id="site-title">{root.title === "Home" ? site.title : root.title}</h1>
          {root.description && <p className="hero-deck">{root.description}</p>}
          {root.content.trim() && <article className="prose hero-intro"><Markdown doc={root} /></article>}
        </section>
        <ExperimentGroups groups={groups} />
      </main>
      <SiteFooter />
    </>
  );
}
