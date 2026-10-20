import Link from "next/link";
import StudioLoader from "../poetry-gem/StudioLoader";
import s from "./build-a-bot.module.css";

export default function BuildABot() {
  return (
    <section id="build-a-bot" className={s.section} aria-labelledby="build-a-bot-title">
      <header className={s.intro}>
        <p className="eyebrow">2023 · Configure a chatbot</p>
        <h2 id="build-a-bot-title">Build a poetry bot</h2>
        <p>
          Choose a poetic form, a source text, and a method for supplying that text.
          Send a message to test the settings. Open <strong>“What the model saw”</strong> to inspect the prompt and source passages.
        </p>
        <nav className={s.links} aria-label="Poetry workshop">
          <Link href="/poetry-gem">Open the full studio ↗</Link>
          <Link href="/poetry-gem/doll/corpse">Try the exquisite corpse ↗</Link>
        </nav>
      </header>
      <StudioLoader embedded />
    </section>
  );
}
