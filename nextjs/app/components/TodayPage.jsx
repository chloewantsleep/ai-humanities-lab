import Link from "next/link";
import { SiteFooter, SiteHeader } from "./Chrome.jsx";
import "./today.css";

// The home page (and /workshop): the plan for the ENG 298AI session of 20 October 2026. Each activity is its own page,
// also in the top nav. Edit the text here.

const REPO = "https://github.com/ll-26-27/eng298ai-20261020";

const ACTIVITIES = [
  { letter: "A", href: "/eliza", title: "ELIZA", year: "1966", text: "Talk to the first chatbot. Turn on “Show the rule” and see which rule wrote each reply." },
  { letter: "B", href: "/gpt-2-assistant", title: "GPT-2, two ways", year: "2019 · 2021", text: "First the raw model, which only continues your text. Then the same model with example conversations in front of your question, so it plays an assistant." },
  { letter: "C", href: "/poetry-gem", title: "The Poetry Gem", year: "2023 – 24", text: "A custom bot, like a Gem or a custom GPT: pick its instructions, its reading, and how the reading reaches the model. Ask it for poems." },
  { letter: "D", href: "/build-a-bot", title: "Build your own bot", year: "now", text: "It starts as the Poetry Gem. Press Reset, and it shrinks to a plain form. Redesign that form in Claude Code, then submit your bot from your design." },
];

export default function TodayPage() {
  return (
    <>
      <SiteHeader current="workshop" />
      <main id="main" className="today">
        <p className="eyebrow">ENG 298AI · 20 October 2026</p>
        <h1>Today: build a bot</h1>

        <ol className="today-steps">
          <li>
            <h2>Set up</h2>
            <p>Install the <a href="https://claude.ai/download">Claude desktop app</a> if you don&rsquo;t have it, and open its <strong>Code</strong> tab. Ask Claude to clone <a href={REPO}>{REPO.replace("https://", "")}</a> and run it, then open <a href="http://localhost:3000">localhost:3000</a>.</p>
          </li>
          <li>
            <h2>Context windows, Gems, and custom GPTs</h2>
            <p>What the model reads when it answers, and how the builders of 2023 and 2024 filled it: instructions, uploaded files, a name. <Link href="/history/01-gpts">The GPT builder</Link> · <Link href="/history/03-gems">The Gem editor</Link></p>
          </li>
          <li>
            <h2>Four activities</h2>
            <ul className="today-activities">
              {ACTIVITIES.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="today-card">
                    <span className="today-letter">{a.letter}</span>
                    <span className="today-card-body">
                      <span className="today-card-year">{a.year}</span>
                      <strong>{a.title}</strong>
                      <span>{a.text}</span>
                    </span>
                    <span className="today-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <h2>Then: in person, and on paper</h2>
            <p>We put the screens away and critique the build-a-bot model together. Then we look at where the industry is going: away from Character.AI, Gems, and custom GPTs, toward harnesses, which wrap the model in rules and tools. That is the best of both ELIZA and GPT-2.</p>
          </li>
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
