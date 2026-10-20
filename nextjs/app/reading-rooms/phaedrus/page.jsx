import Link from "next/link";
import PhaedrusRoom from "./PhaedrusRoom.jsx";

export const metadata = { title: "The unvarying answer · Reading rooms" };

export default function PhaedrusPage() {
  return <>
    <Link className="rr-back" href="/reading-rooms">← All reading rooms</Link>
    <p className="rr-kicker">01 · Plato · Phaedrus 274c–276a</p>
    <h2>The unvarying answer</h2>
    <p className="rr-intro">Theuth offers writing as a gift to memory and wisdom. Thamus questions the gift. Later, Socrates asks what happens when you question writing itself.</p>
    <PhaedrusRoom />
    <aside className="rr-source">
      <h3>Back to the passage</h3>
      <blockquote>“the speaker always gives one unvarying answer.”</blockquote>
      <p>Plato, <cite>Phaedrus</cite>, 275d, Benjamin Jowett translation (public domain). In 275d–e, Socrates describes writing as unable to respond differently to its readers or defend itself. At 276a he turns to discourse associated with knowledge in the learner.</p>
      <a href="https://www.gutenberg.org/ebooks/1636">Read Phaedrus · Project Gutenberg 1636 ↗</a>
      <p className="rr-note">The repeated claim and suggested questions above are invented for this exercise. The quotation here is from the text. A chatbot's ability to vary its wording would not by itself resolve Plato's question about knowledge.</p>
    </aside>
  </>;
}
