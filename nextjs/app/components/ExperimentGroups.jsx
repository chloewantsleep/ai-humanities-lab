import Link from "next/link";

// The experiments as cards under group headings, on the home page and at /experiments. The "Today" group always
// starts with today's path (/workshop); the rest come from content/experiments/ (see getExperimentGroups).
export const todayPath = {
  href: "/workshop",
  title: "Today, October 20: build and test a chatbot",
  description: "The eleven moments of today's session, each with what to do, what to notice, and the page it uses.",
};

// The Claude Desktop kit is a workshop handout, not an app route, so it is a fixed card under "Build your bot".
const claudeDesktopKit = {
  href: "/workshop/claude-desktop",
  title: "Build a chatbot in Claude Desktop",
  description: "The no-code way: a Claude Project with instructions as the voice and files as the knowledge, a persona card, a test sheet, and course texts to upload.",
};

export default function ExperimentGroups({ groups, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <div className="experiment-groups">
      {groups.map((group) => (
        <section className="experiment-group" key={group.name} aria-labelledby={`group-${slugify(group.name)}`}>
          <header className="experiment-group-heading">
            <Heading id={`group-${slugify(group.name)}`}>{group.name}</Heading>
            {group.blurb && <p>{group.blurb}</p>}
          </header>
          <div className="tools experiment-cards">
            {group.name === "Today" && (
              <Link className="tool-card tool-card-today" href={todayPath.href}>
                <span className="eyebrow">{todayPath.href}</span>
                <strong>{todayPath.title}</strong>
                <span className="status status-path">the path</span>
                <span>{todayPath.description}</span>
              </Link>
            )}
            {group.experiments.map((experiment) => (
              <Link className="tool-card" href={experiment.route} key={experiment.slug}>
                <span className="eyebrow">{experiment.route}</span>
                <strong>{experiment.title}</strong>
                <span className={`status status-${experiment.status}`}>{experiment.status === "idea" ? "not built yet" : experiment.status}</span>
                {experiment.description && <span>{experiment.description}</span>}
              </Link>
            ))}
            {group.name === "Build your bot" && (
              <Link className="tool-card" href={claudeDesktopKit.href}>
                <span className="eyebrow">{claudeDesktopKit.href}</span>
                <strong>{claudeDesktopKit.title}</strong>
                <span className="status status-working">working</span>
                <span>{claudeDesktopKit.description}</span>
              </Link>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
