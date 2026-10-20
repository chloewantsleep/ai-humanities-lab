import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import SpiralDemo from "../story/SpiralDemo.jsx";
import HhhDemo from "../story/HhhDemo.jsx";
import "../story/story.css";
import "./gpt-2-assistant.css";

export const metadata = { title: "GPT-2, then GPT-2 with a script", description: "Activity B: the raw base model, then the same model with the HHH prompt's conversations in front of your question." };
export const dynamic = "force-dynamic";

// Activity B on the Today page (/). The same two panels as the timeline's chapters 4 and 5, on one page.
export default async function Page() {
  const cwd = process.cwd();
  const preambleFile = await readFile(path.join(cwd, "app", "by-hand", "hhh-prompt.txt"), "utf8");
  const recorded = await readFile(path.join(cwd, "content", "story", "samples", "hhh-gpt2.json"), "utf8").then(JSON.parse).catch(() => []);
  return (
    <>
      <SiteHeader current="gpt-2-assistant" />
      <main id="main" className="activity">
        <Link className="today-link" href="/">← Today</Link>
        <p className="eyebrow">Activity B · 2019 and 2021</p>
        <h1>GPT-2, then GPT-2 with a script</h1>
        <p className="activity-deck">One small base model, two ways. First on its own: it continues whatever you type. Then with a page of invented conversations between a &ldquo;Human&rdquo; and an &ldquo;Assistant&rdquo; in front of your question, the move Anthropic&rsquo;s researchers made in 2021. Same weights, different document.</p>
        <p className="activity-note">Both run on your own computer. GPT-2 is about 130 MB the first time, then cached. It is small and strange: watch the <em>form</em> of the reply, not whether it is right.</p>

        <section className="activity-step">
          <div className="activity-copy">
            <p className="eyebrow">Step 1</p>
            <h2>The raw model</h2>
            <p>Load GPT-2 and give it a question, a line of a poem, or the start of a recipe. It doesn&rsquo;t answer. It guesses what kind of document it is in and keeps writing.</p>
            <ul>
              <li>Ask it &ldquo;Who are you?&rdquo; a few times. Does the same question get the same kind of reply?</li>
              <li>Try the start of a list, a script, or &ldquo;Q: … A:&rdquo;. What does the shape of your text make it do?</li>
              <li>Under the output: the five likeliest next tokens, with their odds.</li>
            </ul>
          </div>
          <figure className="panel panel-figure panel-demo">
            <SpiralDemo
              prompt={"Who are you?\n"}
              recorded={"\nI'm not on the inside, so I'll see how you behave. This is the last thing I'm going to do.\n\n\"I'd like to meet you,\" you say softly.\n\n\"Yes I want to meet you,\" you say.\n\nAnd I ask you again. \"You wanna get up?\"\n\n"}
              recordedNote="Recorded 19 Oct 2026: GPT-2 small, temperature 0.8. Run it yourself and you will get something different."
            />
          </figure>
        </section>

        <section className="activity-step">
          <div className="activity-copy">
            <p className="eyebrow">Step 2</p>
            <h2>The same model, with conversations in front</h2>
            <p>Now the question goes in twice. Column 1 is the raw model again. Column 2 puts your question after the HHH prompt: a paragraph describing a &ldquo;helpful, polite, honest&rdquo; assistant and fourteen made-up conversations, written by two of the paper&rsquo;s authors. Your question becomes the next &ldquo;Human:&rdquo; line, and the program stops GPT-2 when it starts to write the human&rsquo;s next line.</p>
            <ul>
              <li>Open &ldquo;Read the script&rdquo; first. That is the whole trick.</li>
              <li>Compare the two columns. Which one sounds like it is talking <em>to you</em>? Which one stops?</li>
              <li>GPT-2 can only fit the last few conversations; open &ldquo;Everything GPT-2 read&rdquo; to see what was cut.</li>
            </ul>
            <p>This is the ancestor of every system prompt, including the instructions you will give your Poetry Gem in Activity C.</p>
          </div>
          <figure className="panel panel-figure panel-demo">
            <HhhDemo preambleFile={preambleFile} recorded={recorded} />
          </figure>
        </section>

        <p className="activity-next">Next: <Link href="/poetry-gem">Activity C, the Poetry Gem →</Link> · For the whole story, see the <Link href="/timeline#the-spiral">timeline</Link>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
