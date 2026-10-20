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
        <Link href="/" aria-current={current === "workshop" ? "page" : undefined}>Today</Link>
        <Link href="/eliza" aria-current={current === "eliza" ? "page" : undefined}>A. ELIZA</Link>
        <Link href="/gpt-2-assistant" aria-current={current === "gpt-2-assistant" ? "page" : undefined}>B. GPT-2</Link>
        <Link href="/poetry-gem" aria-current={current === "poetry-gem" ? "page" : undefined}>C. Poetry Gem</Link>
        <Link href="/build-a-bot" aria-current={current === "build-a-bot" ? "page" : undefined}>D. Build a bot</Link>
        <Link href="/timeline" aria-current={current === "story" ? "page" : undefined}>Timeline</Link>
        <Link href="/bot-materials" aria-current={current === "bot-materials" ? "page" : undefined}>Bot materials</Link>
        <Link href="/history" aria-current={current === "history" ? "page" : undefined}>Interfaces</Link>
        <Link href="/readings" aria-current={current === "readings" ? "page" : undefined}>Readings</Link>
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
