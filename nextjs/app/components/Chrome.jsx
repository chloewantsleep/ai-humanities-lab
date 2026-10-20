import Link from "next/link";
import { site } from "../../lib/content.mjs";

// `current` marks the page you're on: "workshop", "experiments", "history", "readings", "glossary", or nothing.
export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/workshop" aria-current={current === "workshop" ? "page" : undefined}>Today</Link>
        <Link href="/" aria-current={current === "story" ? "page" : undefined}>Timeline</Link>
        <Link href="/#build-a-bot" aria-current={current === "poetry-gem" ? "page" : undefined}>Build a bot</Link>
        <Link href="/history" aria-current={current === "history" ? "page" : undefined}>Interfaces</Link>
        <Link href="/readings" aria-current={current === "readings" ? "page" : undefined}>Readings</Link>
        <Link href="/glossary" aria-current={current === "glossary" ? "page" : undefined}>Glossary</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span>{site.term}</span>
    </footer>
  );
}
