import Link from "next/link";
import TurnTakingRoom from "./TurnTakingRoom.jsx";

export const metadata = { title: "Who speaks next? · Reading rooms" };

export default function TurnTakingPage() {
  return <>
    <Link className="rr-back" href="/reading-rooms">← All reading rooms</Link>
    <p className="rr-kicker">02 · Sacks, Schegloff &amp; Jefferson · Turn-taking</p>
    <h2>Who speaks next?</h2>
    <p className="rr-intro">A conversation has more structure than alternating bubbles. Choose who gets the next turn, then move its beginning. What changes when the words stay the same?</p>
    <TurnTakingRoom />
    <aside className="rr-source">
      <h3>Back to the paper</h3>
      <p>Harvey Sacks, Emanuel A. Schegloff, and Gail Jefferson, <cite>A Simplest Systematics for the Organization of Turn-Taking for Conversation</cite>, <cite>Language</cite> 50(4), 1974, pp. 696–735. See section 3.3 for the ordered allocation rules and sections 3.4 and 4 for their consequences.</p>
      <a href="https://www.cs.columbia.edu/~julia/cs4706/Sacks_et_al_1974.pdf">Read the paper · PDF ↗</a>
      <p className="rr-note">The rules here are paraphrased. All dialogue and timings are invented. The fixed 2.4-second completion point is a teaching assumption: speakers project possible completion from the unfolding talk. This prototype does not infer it from punctuation or measure recorded speech. It leaves out simultaneous self-selection and repair.</p>
    </aside>
  </>;
}
