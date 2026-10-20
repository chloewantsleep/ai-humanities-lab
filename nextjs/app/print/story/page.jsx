import { site } from "../../../lib/content.mjs";
import Panel from "../../story/Panel.jsx";
import StoryMarkdown from "../../story/StoryMarkdown.jsx";
import { getStory } from "../../story/story.mjs";
import "../../story/story.css";

// /print/story: the essay at /story as one printable document. Each step's panel becomes a figure before its prose;
// live demos print their fallback. This route takes /print/story from the generic print catch-all beside it.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { intro } = await getStory();
  return { title: intro.title || "Story" };
}

export default async function PrintStory() {
  const { intro, chapters, steps, milestones } = await getStory();
  return (
    <main className="print-main print-story">
      <header className="print-bar"><span>{site.title} · {site.label}</span><span>⌘P to print · Letter</span></header>
      <p className="eyebrow">An essay{intro.status === "draft" ? " · draft" : ""}</p>
      <h1>{intro.title || "Story"}</h1>
      {intro.description && <p className="lede">{intro.description}</p>}
      {chapters.map((chapter) => {
        const chapterSteps = steps.filter((step) => step.chapter === chapter.index);
        return (
          <section className="story-print-chapter" key={chapter.slug}>
            <p className="eyebrow">{chapter.number === 0 ? "Prologue" : `Chapter ${chapter.number}`}{chapter.years ? ` · ${chapter.years}` : ""}</p>
            <h2>{chapter.title}</h2>
            {chapterSteps.map((step) => (
              <div key={step.id}>
                {step.indexInChapter > 0 && (
                  <div className="story-print-figure">
                    {step.panel.label && <p className="story-print-year">{step.panel.yearLabel ? `${step.panel.yearLabel} · ` : ""}{step.panel.label}</p>}
                    <Panel panel={step.panel} milestones={milestones} mode="print" />
                  </div>
                )}
                {step.prose && <div className="prose"><StoryMarkdown markdown={step.prose} print /></div>}
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
