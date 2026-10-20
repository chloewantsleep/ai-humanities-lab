// "Bot materials": a reference page for the Poetry Gem. What a 2023–24 custom bot is made of, read from the
// same files the studio uses (content/_poetry-gem, lib/poetry-gem). Not a builder: nothing here talks to a model.

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { SiteHeader, SiteFooter } from "../components/Chrome.jsx";
import { loadGenres, packInfo, packMeta, readVoice } from "@/lib/poetry-gem/content";
import { DELIVERIES, DELIVERY_LABELS, MATERIALS, PACKS, PACK_LABELS, type Delivery, type PackId } from "@/lib/poetry-gem/options";
import { EMBED_DIMS, EMBED_MODEL } from "@/lib/poetry-gem/embeddings";
import { BAND_ORDER, CASTING, Doll, FOLDS, PLATES, PlateFigure, type Band } from "@/app/poetry-gem/doll/Doll";
import manifest from "@/public/poetry-gem/doll/mj/manifest.json";
import s from "./bot-materials.module.css";

export const metadata = {
  title: "Bot materials",
  description: "What the Poetry Gem is made of: instructions, knowledge, and a way to deliver the knowledge.",
};

const READINGS_URL = "https://github.com/ll-26-27/eng298ai-20261020/tree/main/readings";
const fmt = (n: number) => n.toLocaleString("en-US");

// The studio's opening settings (Studio.tsx): the first form, Frankenstein, whole pack.
// The figure shown first and used as the base below: haiku, the Analects, keyword retrieval (plates mj13, mj18, mj14).
const DEFAULT_SPEC = { head: "haiku", torso: "analects", legs: "lexical" };

const BAND_NAMES: Record<Band, { part: string; role: string }> = {
  head: { part: "Head", role: "Instructions" },
  torso: { part: "Bodice", role: "Knowledge" },
  legs: { part: "Skirt", role: "Delivery" },
};

// What reaches the model in each delivery mode (from app/api/poetry-gem/chat/route.ts).
const DELIVERY_NOTES: Record<Delivery, { sent: string; detail: string; cost: string }> = {
  full: {
    sent: "The instructions, then the whole selected text, pasted into the system prompt.",
    detail:
      "Nothing is chosen for you. The model sees every word of the level you picked, on every turn. The system prompt is cached, so later turns re-read it at a lower price.",
    cost: "Most tokens. Nothing is left out.",
  },
  lexical: {
    sent: "The instructions, and up to 5 passages attached to your newest message.",
    detail:
      "A BM25 keyword search ranks the passages by the words they share with your message. There is no stemming and there are no synonyms: “creator” does not match “maker”. If no word matches, nothing is attached.",
    cost: "Few tokens. Misses passages that use other words.",
  },
  semantic: {
    sent: "The instructions, and up to 5 passages attached to your newest message.",
    detail: `Your message is turned into a vector by ${EMBED_MODEL} (${EMBED_DIMS} numbers). It is compared with vectors saved for every passage, by cosine similarity, and the 5 closest are attached. It always returns passages, even loosely related ones.`,
    cost: "Few tokens. Finds related wording; can return weak matches.",
  },
  agentic: {
    sent: "The instructions and a search tool. The model decides whether to search and what to type.",
    detail:
      "The tool is the same keyword search, returning up to 5 passages per search. Each search and its results are added to the conversation. The studio stops after 6 searches in one turn.",
    cost: "Varies. Each search is another model call.",
  },
};

const LEVEL_NAMES = { voice: "Voice note", assigned: "Assigned", more: "More", whole: "Whole" } as const;

function firstParagraph(md: string) {
  return md.split(/\n\s*\n/)[0];
}

/** The hero figure: a haiku bot reading the Analects by keyword, with its three bands named beside it. */
function LabeledDoll() {
  const [, y0, , y1] = manifest.bounds;
  const at = (f: number) => `${((f - y0) / (y1 - y0)) * 100}%`;
  const headTop = 0.11; // the plates' heads begin about here (manifest bboxes)
  const legsEnd = 0.91;
  const mids: Record<Band, number> = {
    head: (headTop + FOLDS.neck) / 2,
    torso: (FOLDS.neck + FOLDS.hip) / 2,
    legs: (FOLDS.hip + legsEnd) / 2,
  };
  return (
    <figure className={s.heroFigure}>
      <div className={s.dollStage}>
        <PlateFigure plates={{ head: CASTING.head.haiku, torso: CASTING.torso.analects, legs: CASTING.legs.lexical }} crop="frame" className={s.heroDoll} title="The paper-doll bot: a head, a bodice, and a skirt cut from three costume plates">
          <span className={s.fold} style={{ top: `${FOLDS.neck * 100}%` }} />
          <span className={s.fold} style={{ top: `${FOLDS.hip * 100}%` }} />
        </PlateFigure>
        <ol className={s.bandLabels}>
          {BAND_ORDER.map((b) => (
            <li key={b} style={{ top: at(mids[b]) }}>
              <span className={s.bandPart}>{BAND_NAMES[b].part}</span>
              <a href={`#${BAND_NAMES[b].role.toLowerCase()}`} className={s.bandRole}>{BAND_NAMES[b].role}</a>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>A haiku bot that reads the <i>Analects</i> by keyword search.</figcaption>
    </figure>
  );
}

export default function BotMaterialsPage() {
  const genres = loadGenres();
  const packs = PACKS.filter((p): p is Exclude<PackId, "none"> => p !== "none").map((p) => ({
    id: p,
    meta: packMeta(p),
    info: packInfo(p),
    voice: readVoice(p),
  }));
  const castingOptions: Record<Band, { id: string; label: string }[]> = {
    head: genres.map((g) => ({ id: g.id, label: g.label })),
    torso: PACKS.map((p) => ({ id: p, label: PACK_LABELS[p] })),
    legs: DELIVERIES.map((d) => ({ id: d, label: DELIVERY_LABELS[d].label })),
  };
  const labelFor = (band: Band, id: string) => castingOptions[band].find((o) => o.id === id)?.label ?? id;

  return (
    <>
      <SiteHeader current="bot-materials" />
      <main id="main" className={s.page}>
        {/* ---- 1. Intro ---------------------------------------------------------------- */}
        <section className={s.hero} aria-labelledby="bm-title">
          <div className={s.heroText}>
            <p className="eyebrow">Reference · The Poetry Gem</p>
            <h1 id="bm-title">Bot materials</h1>
            <span className="deco-rule" />
            <p className={s.lede}>
              A custom bot of 2023–24, a custom GPT or a Gem, is made of three things. It has instructions. It has
              knowledge, usually some uploaded files. And it has a way to get that knowledge to the model.
            </p>
            <p className={s.lede}>
              This page lists the materials the Poetry Gem builder uses for each of the three, and what each choice
              sends to the model.
            </p>
            <ul className={s.toc}>
              <li><a href="#instructions"><span>I</span>Instructions</a></li>
              <li><a href="#knowledge"><span>II</span>Knowledge</a></li>
              <li><a href="#delivery"><span>III</span>Delivery</a></li>
              <li><a href="#costume"><span>IV</span>The costume</a></li>
              <li><a href="#where"><span>V</span>Where it goes</a></li>
            </ul>
          </div>
          <LabeledDoll />
        </section>

        {/* ---- 2. Instructions ---------------------------------------------------------- */}
        <section id="instructions" className={s.section} aria-labelledby="h-instructions">
          <header className={s.sectionHead}>
            <p className="eyebrow">I · The head</p>
            <h2 id="h-instructions">Instructions</h2>
            <span className="deco-rule" />
            <p>
              The instructions are the system prompt. Each poetic form is one prompt file. It tells the model to answer
              every message with a poem in that form, and lists the form’s rules. You can edit the text in the builder
              before you test.
            </p>
          </header>
          <div className={s.cards3}>
            {genres.map((g) => (
              <article key={g.id} className={s.card}>
                <p className={s.cardKicker}>Form</p>
                <h3>{g.label}</h3>
                <p className={s.blurb}>{g.blurb}</p>
                <blockquote className={s.excerpt}>
                  <ReactMarkdown>{firstParagraph(g.prompt)}</ReactMarkdown>
                </blockquote>
                <details className={s.details}>
                  <summary>The full prompt</summary>
                  <div className={s.promptFull}>
                    <ReactMarkdown>{g.prompt}</ReactMarkdown>
                  </div>
                </details>
                <Link className={s.more} href={`/poetry-gem/prompts/${g.id}`}>Open the {g.label.toLowerCase()} prompt page →</Link>
              </article>
            ))}
          </div>
        </section>

        {/* ---- 3. Knowledge ------------------------------------------------------------- */}
        <section id="knowledge" className={s.section} aria-labelledby="h-knowledge">
          <header className={s.sectionHead}>
            <p className="eyebrow">II · The bodice</p>
            <h2 id="h-knowledge">Knowledge</h2>
            <span className="deco-rule" />
            <p>
              The knowledge is a reading pack: a course text cut into sections. You choose how much of it the bot gets,
              from a one-page voice note up to the whole book with its editor’s material. You can also choose no pack, as
              a baseline.
            </p>
            <p className={s.note}>
              Sizes are estimates at about 3.5 characters per token. The studio shows the real count after each message.
              A passage is a piece of a section, cut at paragraph breaks, up to 1,800 characters long.
            </p>
          </header>
          <div className={s.cards3}>
            {packs.map(({ id, meta, info, voice }) => (
              <article key={id} className={s.card}>
                <p className={s.cardKicker}>Reading pack</p>
                <h3>{PACK_LABELS[id]}</h3>
                <p className={s.edition}>{meta.edition}</p>
                <p className={s.meta}>{meta.sections.length} {meta.sections.length === 1 ? "section" : "sections"}</p>
                <table className={s.levels}>
                  <caption className={s.srOnly}>How much of {meta.label} each level includes</caption>
                  <thead>
                    <tr><th scope="col">Level</th><th scope="col">Tokens</th><th scope="col">Passages</th></tr>
                  </thead>
                  <tbody>
                    {MATERIALS.map((lv) => (
                      <tr key={lv}>
                        <th scope="row">
                          <span className={s.levelName}>{LEVEL_NAMES[lv]}</span>
                          {lv !== "voice" && <span className={s.levelLabel}>{info.levels[lv].label}</span>}
                        </th>
                        <td>~{fmt(info.levels[lv].approxTokens)}</td>
                        <td>{fmt(info.levels[lv].passages)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <details className={s.details}>
                  <summary>The voice note</summary>
                  <div className={s.voice}>
                    <ReactMarkdown>{voice.replace(/^# .*\n+/, "")}</ReactMarkdown>
                  </div>
                </details>
                <Link className={s.more} href={`/poetry-gem/packs/${id}`}>Read the {meta.label} pack →</Link>
              </article>
            ))}
          </div>
          <p className={s.aside}>
            The full course readings, as PDFs and Markdown, are in the repository’s{" "}
            <a href={READINGS_URL} className="inline-link">readings/ folder</a>. The packs were built from them.
          </p>
        </section>

        {/* ---- 4. Delivery -------------------------------------------------------------- */}
        <section id="delivery" className={s.section} aria-labelledby="h-delivery">
          <header className={s.sectionHead}>
            <p className="eyebrow">III · The skirt</p>
            <h2 id="h-delivery">Delivery</h2>
            <span className="deco-rule" />
            <p>
              Delivery is how the knowledge reaches the model. The model only knows what is in the text it is sent. Each
              turn, the studio sends everything again: instructions, knowledge, and the conversation so far. By default
              the studio’s bot is Claude Opus 5.
            </p>
          </header>
          <ol className={s.modes}>
            {DELIVERIES.map((d, i) => (
              <li key={d} className={s.mode}>
                <span className={s.modeNum}>{i + 1}</span>
                <div className={s.modeBody}>
                  <h3>{DELIVERY_LABELS[d].label}</h3>
                  <p className={s.blurb}>{DELIVERY_LABELS[d].blurb}</p>
                  <dl className={s.modeFacts}>
                    <div><dt>Sent to the model</dt><dd>{DELIVERY_NOTES[d].sent}</dd></div>
                    <div><dt>How</dt><dd>{DELIVERY_NOTES[d].detail}</dd></div>
                    <div><dt>Trade-off</dt><dd>{DELIVERY_NOTES[d].cost}</dd></div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
          <div className={s.tradeoff}>
            <p className={s.cardKicker}>The trade-off, in numbers</p>
            <p>
              The whole of <em>Frankenstein</em> is about {fmt(packs.find((p) => p.id === "frankenstein")!.info.levels.whole.approxTokens)} tokens,
              sent on every turn. Five retrieved passages are at most about {fmt(Math.round((5 * 1800) / 3.5))} tokens.
              Retrieval is cheaper, but the model sees only what the search found.
            </p>
            <Link className={s.more} href="/poetry-gem/vectors">See the passages on the vector map →</Link>
          </div>
        </section>

        {/* ---- 5. The costume ----------------------------------------------------------- */}
        <section id="costume" className={s.section} aria-labelledby="h-costume">
          <header className={s.sectionHead}>
            <p className="eyebrow">IV · Paper doll</p>
            <h2 id="h-costume">The costume</h2>
            <span className="deco-rule" />
            <p>
              The builder draws your bot as an exquisite corpse: three strips cut from Midjourney costume plates. Each
              setting picks a plate for one strip. First, the nine plates whole, as they were drawn; then, one strip at a time.
            </p>
          </header>
          <ul className={s.plateGallery}>
            {PLATES.map((plate) => {
              const roles = BAND_ORDER.flatMap((band) => Object.entries(CASTING[band]).filter(([, id]) => id === plate).map(([setting]) => `${BAND_NAMES[band].part}: ${labelFor(band, setting)}`));
              return (
                <li key={plate} className={s.plateItem}>
                  <PlateFigure plates={{ head: plate, torso: plate, legs: plate }} crop="frame" className={s.plateDoll} title={`Costume plate ${plate}, whole`} />
                  <span className={s.castPlate}>plate {plate}</span>
                  <span className={s.plateRoles}>{roles.length ? roles.join(" · ") : "Not cast yet"}</span>
                </li>
              );
            })}
          </ul>
          {BAND_ORDER.map((band) => (
            <div key={band} className={s.castRow}>
              <h3 className={s.castHead}>
                <span>{BAND_NAMES[band].part}</span> {BAND_NAMES[band].role}
              </h3>
              <ul className={s.castList}>
                {castingOptions[band].map((o) => (
                  <li key={o.id} className={s.castItem}>
                    <Doll spec={{ ...DEFAULT_SPEC, [band]: o.id }} crop="frame" className={s.castDoll} title={`${BAND_NAMES[band].part} for ${o.label}: plate ${CASTING[band][o.id]}`} />
                    <span className={s.castLabel}>{o.label}</span>
                    <span className={s.castPlate}>plate {CASTING[band][o.id]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className={s.links}>
            <Link href="/poetry-gem/doll" className="inline-link">Dress the bot in the costume settings</Link>
            <span aria-hidden="true">·</span>
            <Link href="/poetry-gem/doll/corpse" className="inline-link">Combine any head, bodice, and skirt</Link>
          </p>
        </section>

        {/* ---- 6. Where it goes ------------------------------------------------------------ */}
        <section id="where" className={s.section} aria-labelledby="h-where">
          <header className={s.sectionHead}>
            <p className="eyebrow">V · After the studio</p>
            <h2 id="h-where">Where it goes</h2>
            <span className="deco-rule" />
          </header>
          <div className={s.closing}>
            <p>
              Under the builder, “Save or submit this bot” sends your bot to the Ensemble: every student’s bot
              as a member of one Slack channel, the AI Humanities Lab Ensemble. It sends a name, your instructions, a short knowledge note (the pack’s voice note, which you
              can edit), and a line on when your bot should speak. Full books and search tools stay in the studio, and
              the Ensemble uses its own default model. An instructor activates each bot before it takes part.
            </p>
            <p className={s.links}>
              <Link href="/#build-a-bot" className={s.cta}>Back to the builder →</Link>
              <Link href="/ensemble" className="inline-link">Visit the Ensemble</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
