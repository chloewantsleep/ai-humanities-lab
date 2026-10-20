import Link from "next/link";
import { redirect } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import Markdown from "../../components/Markdown.jsx";
import { getStory } from "../story.mjs";

// /story/guide shows content/story/README.md: the chapter plan and how the files work. /story/<chapter file> (where the
// generic reader would show a chapter's raw Markdown) goes to that chapter in the essay.
export const dynamic = "force-dynamic";

export default async function StoryChapter({ params }) {
  const { chapter } = await params;
  const name = decodeURIComponent(chapter);
  if (/^(?:guide|readme)$/i.test(name)) {
    const folder = (await getEntry(["story"]))?.entry;
    return (
      <>
        <SiteHeader current="story" />
        <main id="main" className="article-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/story">Story</Link><span>/</span><span>Guide</span></nav>
          <header className="article-heading">
            <p className="eyebrow">The essay's plan and format</p>
            <h1>{folder?.title || "Story"}</h1>
            <p className="updated">In the repo: <code>nextjs/content/story/README.md</code> · <Link className="print-link" href="/story">Read the essay</Link></p>
          </header>
          {folder && <article className="prose"><Markdown doc={folder} /></article>}
        </main>
        <SiteFooter />
      </>
    );
  }
  const { chapters } = await getStory();
  const found = chapters.find((c) => c.slug === name || c.file.endsWith(`/${name}.md`));
  redirect(found ? `/story#${found.slug}` : "/story");
}
