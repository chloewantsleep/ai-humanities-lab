import Link from "next/link";

export const metadata = { title: "Reading rooms" };

export default function ReadingRoomsPage() {
  return <>
    <p className="rr-kicker">Small experiments in close reading</p>
    <h2>Enter through a question.</h2>
    <p className="rr-intro">Each room turns one move in a reading into something you can try. These are authored classroom prototypes. You do the interpreting.</p>
    <div className="rr-grid">
      <Link className="rr-card" href="/reading-rooms/phaedrus">
        <span className="rr-kicker">01 · Plato · Phaedrus</span>
        <h3>The unvarying answer <span aria-hidden="true">↗</span></h3>
        <p>Put a written claim under pressure. What would it take to answer your objection?</p>
        <span className="rr-tag">Open room · No model needed</span>
      </Link>
      <Link className="rr-card" href="/reading-rooms/turn-taking">
        <span className="rr-kicker">02 · Sacks, Schegloff &amp; Jefferson</span>
        <h3>Who speaks next? <span aria-hidden="true">↗</span></h3>
        <p>Change who takes the next turn and when. See what chat bubbles leave out.</p>
        <span className="rr-tag">Open room · No model needed</span>
      </Link>
      <Link className="rr-card" href="/reading-rooms/shanahan">
        <span className="rr-kicker">03 · Shanahan, McDonell &amp; Reynolds</span>
        <h3>Describe the same turn twice <span aria-hidden="true">↗</span></h3>
        <p>Read a line as character behavior, reveal a role cue, and describe how the context shapes a continuation.</p>
        <span className="rr-tag">Open room · Optional browser-model branches</span>
      </Link>
    </div>
    <p className="rr-note">The design document proposes interactions for eleven readings. Only the rooms marked “Open room” are built. Writing in a room stays on this page and clears when you leave or reload.</p>
  </>;
}
