import { Fragment } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import Panel from "./Panel.jsx";
import StoryMarkdown from "./StoryMarkdown.jsx";
import StoryShell from "./StoryShell.jsx";
import BuildABot from "../components/BuildABot.jsx";
import TimelineZoom from "./TimelineZoom.jsx";
import KnowledgeStep from "./knowledge/KnowledgeStep.jsx";
import { getGlossaryShorts, getStory } from "./story.mjs";
import "./story.css";

// The essay: content/story/*.md (one file per chapter; format in content/story/README.md), read on every request so
// edits show on refresh. The prose is rendered here on the server; StoryShell watches the scroll and drives the sticky
// panel and the timeline. /print/story prints the whole essay (app/print/story/).
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { intro } = await getStory();
  return { title: intro.title || "Story", description: intro.description || "" };
}

export default async function StoryPage() {
  const [{ intro, chapters, steps, milestones }, glossary] = await Promise.all([getStory(), getGlossaryShorts()]);
  const clientSteps = steps.map(({ id, chapter, year, panel }) => ({ id, chapter, year, panel }));

  return (
    <>
      <SiteHeader current="story" />
      <main id="main" className="story">
        <header className="story-hero">
          <p className="eyebrow">ENG 298AI · Chatbot timeline</p>
          <h1>{intro.title || "How chatbots work"}</h1>
          {intro.description && <p className="story-deck">{intro.description}</p>}
          <nav className="story-contents" aria-label="Chapters">
            <ol>
              {chapters.map((chapter) => (
                <li key={chapter.slug}>
                  <a href={`#${chapter.slug}`}><span>{chapter.number === 0 ? "P" : chapter.number}</span>{chapter.title}{chapter.years && <em>{chapter.years}</em>}</a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="story-how">Talk to ELIZA, run GPT-2 with and without the first assistant script, and build the pieces of a poetry bot on the way to 2023. <Link href="/bot-materials">Bot materials</Link> · <Link href="/glossary">Glossary</Link> · <Link href="/print/story">Print</Link></p>
        </header>
        <TimelineZoom />
        {steps.length === 0 ? <p className="empty-state">No chapters yet: add Markdown files to <code>nextjs/content/story/</code>.</p> : (
          <StoryShell steps={clientSteps} chapters={chapters} milestones={milestones}>
            {steps.map((step, index) => {
              const chapter = chapters[step.chapter];
              const opener = step.indexInChapter === 0;
              const lastInChapter = steps[index + 1]?.chapter !== step.chapter;
              const hasPanel = step.panel.type !== "chapter";
              return (
                <Fragment key={step.id}>
                <section id={step.id} data-story-step={index} className={`story-step${opener ? " story-step-opener" : ""}${hasPanel ? " story-step-with-panel" : ""}`}>
                  <div className="story-step-copy">
                  {opener && (
                    <header className="story-chapter-heading">
                      <p className="eyebrow">{chapter.years}</p>
                      <h2>{chapter.title}</h2>
                    </header>
                  )}
                  {step.prose && <div className="prose story-prose"><StoryMarkdown markdown={step.prose} glossary={glossary} /></div>}
                  </div>
                  {hasPanel && (
                    <div className="story-step-figure">
                      {step.panel.type === "knowledge" ? (
                        <figure className="panel panel-figure panel-demo"><KnowledgeStep />{step.panel.caption && <figcaption className="panel-note">{step.panel.caption}</figcaption>}</figure>
                      ) : <Panel panel={step.panel} milestones={milestones} mode="inline" />}
                    </div>
                  )}
                </section>
                {lastInChapter && chapter.slug === "configuration" && <div className="story-builder" data-story-step={index}><BuildABot /></div>}
                </Fragment>
              );
            })}
            <footer className="story-end">
              <div className="story-fork">
                <p className="eyebrow">Your turn</p>
                <h2>Fork it</h2>
                <span className="deco-rule" />
                <p>You have built a Gem inside the timeline. Now take its parts and give them an interface of your own. The next page shows the full builder, then a Reset button that strips it down to the data. Redesign that page with Claude Code, and submit your bot from your design.</p>
                <Link className="story-fork-button" href="/build-a-bot">Fork it →</Link>
              </div>
              <p><Link href="/bot-materials">Bot materials</Link> · <Link href="/readings">Readings</Link> · <Link href="/print/story">Print</Link></p>
            </footer>
          </StoryShell>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
