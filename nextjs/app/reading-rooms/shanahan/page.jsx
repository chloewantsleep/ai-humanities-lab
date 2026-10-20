import Link from "next/link";
import DescribeTwice from "./DescribeTwice.jsx";
import BranchRole from "./BranchRole.jsx";

export const metadata = { title: "Describe the same turn twice · Reading rooms" };

export default function ShanahanPage() {
  return <>
    <Link className="rr-back" href="/reading-rooms">← All reading rooms</Link>
    <p className="rr-kicker">03 · Shanahan, McDonell &amp; Reynolds · Role-play</p>
    <h2>Describe the same turn twice.</h2>
    <p className="rr-intro">Keep the words in view. Change the account you give of them: first describe a character, then describe a continuation shaped by context.</p>
    <DescribeTwice />
    <BranchRole />
    <aside className="rr-source">
      <h3>Back to the paper</h3>
      <p>Shanahan, McDonell and Reynolds propose role-play as a way to discuss apparent intentions without automatically treating them as human mental states. They also complicate the actor analogy: a developing dialogue can support multiple possible characters and continuations. This room asks what each description makes visible, and what it assumes.</p>
      <p><cite>Role-Play with Large Language Models</cite> (2023). The section numbers here refer to the assigned arXiv v1: §3, dialogue and role-play; §4, simulation and branching; §6, the nature of the simulator; §8, apparent self-preservation.</p>
      <a href="https://arxiv.org/html/2305.16367v1">Read the paper · arXiv v1 ↗</a>
      <p className="rr-note">Paraphrase only. The annotation dialogue and role cues are invented for this room. The optional panel labels live model outputs separately. Neither reproduces quotations or experiments from the paper.</p>
    </aside>
  </>;
}
