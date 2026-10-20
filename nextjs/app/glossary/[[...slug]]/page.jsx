import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import { DocsArticle } from "../../components/DocsSidebar.jsx";
import GlossarySearch from "../GlossarySearch.jsx";
import "../glossary.css";

// Read the Markdown on each request so edits and new files appear on refresh.
export const dynamic = "force-dynamic";

// content/glossary/ as a docs site in two levels, after tdm155ai-week-6's /concepts. Each folder in it is a category
// (chatbots/, models-and-training/, …), its README.md the category's introduction and table. At /glossary the sidebar
// lists the categories; inside a category (/glossary/chatbots, /glossary/chatbots/eliza) it lists only that category's
// entries, with a link back to all of them. A category whose entries carry `year:` (the chatbots) runs in date order.

async function find(params) {
  const { slug = [] } = await params;
  const glossary = (await getEntry(["glossary"]))?.entry;
  if (!glossary) return null;
  if (!slug.length) return { glossary, category: null, entry: glossary };
  const found = await getEntry(["glossary", ...slug]);
  if (!found) return null;
  const categorySlug = `glossary/${decodeURIComponent(slug[0])}`;
  const category = glossary.folders.find((folder) => folder.slug === categorySlug) || null;
  return { glossary, category, entry: found.entry };
}

function year(doc) {
  const value = Number.parseInt(doc.data.year, 10);
  return Number.isFinite(value) ? value : null;
}

// Entries by year when they have one (ties by term), otherwise alphabetically.
function entriesOf(category) {
  const docs = [...category.docs];
  if (!docs.some((doc) => year(doc) !== null)) return docs.sort((a, b) => a.title.localeCompare(b.title));
  return docs.sort((a, b) => (year(a) ?? 9999) - (year(b) ?? 9999) || a.title.localeCompare(b.title));
}

// The line above an entry's heading: its category, and for a chatbot its year, maker, and status.
function eyebrowFor(entry, glossary, category) {
  if (entry.href === glossary.href) return "Glossary";
  if (!category) return "Glossary";
  if (entry.href === category.href) return `Glossary · ${category.count} entr${category.count === 1 ? "y" : "ies"}`;
  return [category.title, entry.data.year, entry.data.maker, entry.data.status].filter(Boolean).join(" · ");
}

function asList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()) : [];
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description || found.entry.data.short } : {};
}

function CategoryList({ glossary, current }) {
  return (
    <div className="sidebar-group">
      {glossary.folders.map((folder) => (
        <Link className="sidebar-link sidebar-category" key={folder.href} href={folder.href} aria-current={current === folder.href ? "page" : undefined}>
          {folder.title}<span className="sidebar-count">{folder.count}</span>
        </Link>
      ))}
    </div>
  );
}

function EntryList({ category, current }) {
  return (
    <div className="sidebar-group">
      {entriesOf(category).map((doc) => (
        <Link className="sidebar-link glossary-sidebar-entry" key={doc.href} href={doc.href} title={typeof doc.data.short === "string" ? doc.data.short : undefined} aria-current={current === doc.href ? "page" : undefined}>
          <span>{doc.title}</span>
          {year(doc) !== null && <span className="sidebar-count">{year(doc)}</span>}
        </Link>
      ))}
    </div>
  );
}

// The categories as cards on /glossary, below its README, and a search over every term and alias.
function CategoryIndex({ glossary }) {
  if (!glossary.folders.length) return <p className="empty-state">No categories yet. Add a folder to <code>{glossary.source}</code>.</p>;
  const terms = glossary.folders.flatMap((folder) => folder.docs.map((doc) => ({
    href: doc.href,
    term: doc.title,
    short: typeof doc.data.short === "string" ? doc.data.short : "",
    aliases: asList(doc.data.aliases),
    category: folder.title,
  })));
  return (
    <>
      {terms.length > 0 && <GlossarySearch terms={terms} />}
      <ul className="category-index">
        {glossary.folders.map((folder) => (
          <li key={folder.href}>
            <Link href={folder.href}>
              <strong>{folder.title}</strong>
              <span className="eyebrow">{folder.count} entr{folder.count === 1 ? "y" : "ies"}</span>
              {folder.description && <span className="category-note">{folder.description}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

// At the foot of an entry: the other names it goes by, from its frontmatter.
function EntryMeta({ entry }) {
  const aliases = asList(entry.data.aliases);
  if (!aliases.length) return null;
  return <p className="glossary-aliases"><span className="eyebrow">Also called</span> {aliases.join(" · ")}</p>;
}

export default async function GlossaryPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { glossary, category, entry } = found;
  const isEntry = entry.kind === "doc" && category;

  return (
    <>
      <SiteHeader current="glossary" />
      <div className="docs-shell">
        <aside className="docs-sidebar">
          {category ? (
            <>
              <Link className="eyebrow sidebar-back" href={glossary.href}>← All categories</Link>
              <Link className="sidebar-title sidebar-category-title" href={category.href} aria-current={entry.href === category.href ? "page" : undefined}>{category.title}</Link>
              <nav aria-label={`${category.title} entries`}>
                <EntryList category={category} current={entry.href} />
                {category.count === 0 && <p className="sidebar-empty">No entries here yet.</p>}
              </nav>
            </>
          ) : (
            <>
              <Link className="eyebrow sidebar-title" href={glossary.href} aria-current={entry.href === glossary.href ? "page" : undefined}>{glossary.title}</Link>
              <nav aria-label="Glossary categories">
                <CategoryList glossary={glossary} current={entry.href} />
                {glossary.folders.length === 0 && <p className="sidebar-empty">No categories yet.</p>}
              </nav>
            </>
          )}
        </aside>
        <main id="main" className="docs-main">
          <DocsArticle entry={entry} eyebrow={eyebrowFor(entry, glossary, category)}>
            {entry.href === glossary.href ? <CategoryIndex glossary={glossary} /> : isEntry ? <EntryMeta entry={entry} /> : undefined}
          </DocsArticle>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
