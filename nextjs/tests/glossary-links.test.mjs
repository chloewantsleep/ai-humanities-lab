import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith(".md") ? [file] : [];
  }));
  return files.flat();
}

// Use the app's Markdown parser so reference links, images, escaped paths, and
// parenthesized destinations are checked just like inline links.
function destinations(markdown) {
  const urls = [];
  renderToStaticMarkup(React.createElement(ReactMarkdown, {
    components: {
      a: ({ href }) => { urls.push(href); return null; },
      img: ({ src }) => { urls.push(src); return null; },
    },
  }, markdown));
  return urls.filter(url => url && !/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(url));
}

async function missingLinks(file, markdown) {
  const missing = [];
  for (const href of destinations(markdown)) {
    const target = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    try {
      await access(path.resolve(path.dirname(file), target));
    } catch {
      missing.push(`${file}: ${href}`);
    }
  }
  return missing;
}

test("every relative glossary link and image resolves on disk", async () => {
  const files = await markdownFiles("content/glossary");
  assert.ok(files.length > 0, "found glossary Markdown files");
  const missing = (await Promise.all(files.map(async file => {
    const { content } = matter(await readFile(file, "utf8"));
    return missingLinks(file, content);
  }))).flat();
  assert.deepEqual(missing, [], `Unresolved glossary links:\n${missing.join("\n")}`);
});

test("the link check catches missing inline, reference, and image targets", async () => {
  const markdown = `
[existing](./content.test.mjs#anchor)
[missing](./missing-page.md)
![missing image](./missing-image.png)
[reference][target]

[target]: ./missing-reference.md "title"

[external](https://example.com/) [route](/layers) [fragment](#section)
\`[code](./not-a-link.md)\`
`;
  assert.deepEqual(await missingLinks("tests/fixture.md", markdown), [
    "tests/fixture.md: ./missing-page.md",
    "tests/fixture.md: ./missing-image.png",
    "tests/fixture.md: ./missing-reference.md",
  ]);
});
