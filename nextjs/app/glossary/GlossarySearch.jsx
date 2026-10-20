"use client";

import Link from "next/link";
import { useState } from "react";

// A filter over every term, its aliases, and its one-line definition, on /glossary.
export default function GlossarySearch({ terms }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? terms.filter((item) => [item.term, item.short, ...item.aliases].some((text) => text.toLowerCase().includes(needle)))
    : [];

  return (
    <div className="glossary-search">
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${terms.length} terms and their aliases`} aria-label="Search the glossary" />
      {needle && (
        <ul className="docs-index glossary-results">
          {matches.slice(0, 40).map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.term}</Link>
              <span>{item.category}{item.short ? ` · ${item.short}` : ""}</span>
            </li>
          ))}
          {!matches.length && <li><span>Nothing matches “{query.trim()}”.</span></li>}
        </ul>
      )}
    </div>
  );
}
