import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getEntry, resolveMarkdownHref } from "../../lib/content.mjs";

// The essay at /story: content/story/*.md, one file per chapter, in file-name order (README.md and names starting with
// "_" are skipped). A chapter is a series of steps. Each ```panel block (YAML) starts a step and names what the sticky
// panel shows; the Markdown after it, up to the next panel block, is the step's prose. Prose before the first panel
// block sits beside the chapter's title card. The format is documented in content/story/README.md.

const storyDir = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "story");
const PANEL = /^```panel[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;

// A file beside the Markdown (an image), served by app/context-media/, as in app/components/Markdown.jsx.
function mediaSrc(src) {
  if (typeof src !== "string" || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src)) return src;
  const resolved = [];
  for (const part of ["story", ...src.split("/")]) {
    if (!part || part === ".") continue;
    part === ".." ? resolved.pop() : resolved.push(part);
  }
  return `/context-media/${resolved.map(encodeURIComponent).join("/")}`;
}

// Relative links inside a panel's Markdown fields resolve from content/story/, like links in the prose.
function resolveLinks(markdown) {
  if (typeof markdown !== "string") return markdown;
  return markdown.replace(/\]\(([^)\s]+)\)/g, (_, href) => `](${resolveMarkdownHref(href, "story")})`);
}

function parsePanel(block) {
  try {
    const { data } = matter(`---\n${block}\n---\n`);
    return data && typeof data === "object" ? data : {};
  } catch (error) {
    return { type: "error", text: `This panel's YAML didn't parse: ${error.reason || error.message}` };
  }
}

// Years: a number (negative for BCE) or a string shown as is ("c. 370 BCE").
export function formatYear(year) {
  if (typeof year === "number") return year < 0 ? `${-year} BCE` : String(year);
  return typeof year === "string" ? year : "";
}

function normalizePanel(panel) {
  const out = { ...panel, type: typeof panel.type === "string" ? panel.type : "title" };
  for (const key of ["src", "fallback_image"]) if (out[key]) out[key] = mediaSrc(out[key]);
  if (out.href) out.href = resolveMarkdownHref(out.href, "story");
  for (const key of ["cite", "caption", "credit", "note", "text"]) if (out[key]) out[key] = resolveLinks(String(out[key]));
  // dialogue: "Speaker: text" per line.
  if (typeof out.lines === "string") {
    out.lines = out.lines.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
      const match = line.match(/^([^:]{1,40}):\s?(.*)$/);
      return match ? { who: match[1].trim(), text: match[2] } : { who: "", text: line };
    });
  }
  if (out.year !== undefined) out.yearLabel = formatYear(out.year);
  return out;
}

function chapterSlug(file) {
  return file.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
}

export async function getStory() {
  const intro = await readFile(path.join(storyDir, "README.md"), "utf8").then((raw) => matter(raw).data).catch(() => ({}));
  let files = [];
  try {
    files = (await readdir(/* turbopackIgnore: true */ storyDir)).filter((name) => name.endsWith(".md") && !/^readme\.md$/i.test(name) && !name.startsWith("_")).sort();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const chapters = [];
  const steps = [];
  for (const file of files) {
    const raw = await readFile(path.join(storyDir, file), "utf8");
    const { data, content } = matter(raw);
    if (data.hidden === true) continue;
    const chapterIndex = chapters.length;
    const body = content.replace(/^\s*#\s+[^\n]+(?:\r?\n|$)/, "");
    const title = typeof data.title === "string" ? data.title : content.match(/^#\s+(.+)$/m)?.[1]?.trim() || chapterSlug(file);
    const chapter = {
      index: chapterIndex,
      number: typeof data.chapter === "number" ? data.chapter : chapterIndex + 1,
      slug: chapterSlug(file),
      file: `nextjs/content/story/${file}`,
      title,
      years: typeof data.years === "string" ? data.years : "",
      description: typeof data.description === "string" ? data.description : "",
      firstStep: steps.length,
    };
    chapters.push(chapter);

    // Split at the panel blocks: [prose, panel, prose, panel, prose, ...].
    const parts = [];
    let last = 0;
    for (const match of body.matchAll(PANEL)) {
      parts.push(body.slice(last, match.index));
      parts.push(parsePanel(match[1]));
      last = match.index + match[0].length;
    }
    parts.push(body.slice(last));

    const titlePanel = { type: "chapter", number: chapter.number, title, years: chapter.years, description: chapter.description };
    if (typeof data.year !== "undefined") titlePanel.year = data.year;
    if (typeof data.label === "string") titlePanel.label = data.label;
    const chapterSteps = [{ panel: normalizePanel(titlePanel), prose: parts[0].trim() }];
    for (let i = 1; i < parts.length; i += 2) chapterSteps.push({ panel: normalizePanel(parts[i]), prose: (parts[i + 1] || "").trim() });

    for (const [i, step] of chapterSteps.entries()) {
      steps.push({ ...step, id: i === 0 ? chapter.slug : `${chapter.slug}-${i}`, chapter: chapterIndex, indexInChapter: i });
    }
  }

  // demo: hhh needs the HHH prompt itself (app/by-hand/hhh-prompt.txt, byte for byte) and its recorded samples.
  if (steps.some((step) => step.panel.demo === "hhh")) {
    const preambleFile = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), "app", "by-hand", "hhh-prompt.txt"), "utf8");
    const recorded = await readFile(path.join(storyDir, "samples", "hhh-gpt2.json"), "utf8").then(JSON.parse).catch(() => []);
    for (const step of steps) if (step.panel.demo === "hhh") Object.assign(step.panel, { preambleFile, recorded });
  }

  // The running timeline: carry the last year forward, and collect the labelled milestones.
  let year = null;
  const milestones = [];
  for (const [index, step] of steps.entries()) {
    if (step.panel.year !== undefined) year = { value: step.panel.year, label: step.panel.yearLabel };
    step.year = year;
    if (typeof step.panel.label === "string" && step.panel.label.trim()) {
      milestones.push({ step: index, label: step.panel.label.trim(), year: step.panel.yearLabel || year?.label || "" });
    }
  }

  return { intro, chapters, steps, milestones };
}

// The glossary's one-line definitions, by address (/glossary/chatbots/eliza), for link titles in the prose.
export async function getGlossaryShorts() {
  const glossary = (await getEntry(["glossary"]))?.entry;
  const shorts = {};
  const walk = (folder) => {
    for (const doc of folder.docs) if (typeof doc.data.short === "string") shorts[doc.href] = { term: doc.data.term || doc.title, short: doc.data.short };
    folder.folders.forEach(walk);
  };
  if (glossary) walk(glossary);
  return shorts;
}
