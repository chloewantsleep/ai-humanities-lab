// The harness and the course app read the same bot files with two readers (lib/bot-file.mjs here, so the harness
// stays self-contained; nextjs/lib/bots-format.mjs there, task AA). They must accept and reject the same files and
// build the same system prompt. Skipped when the course app isn't beside this folder.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { checkBot, systemPrompt } from "../lib/bot-file.mjs";

const courseReader = new URL("../../nextjs/lib/bots-format.mjs", import.meta.url);
const present = fs.existsSync(courseReader);

const SAMPLES = {
  "the-creature": `---\nname: "The Creature"  # c\nslug: "the-creature"\nauthor: "Ada"\nmodel: "anthropic/claude-sonnet-5.5"\nemoji: ":zombie:"\n---\n\nYou are the creature.\n`,
  "no-slug": `---\nname: Élodie, the Critic\n---\nBe sharp.`,
  "quotes": `---\nname: 'O''Brien'\ndescription: "one # two"\n---\nHi`,
  "extra": `---\nname: X\nretrieval: true\ntop_k: 3\n---\nHi`,
  "no-name": `---\nauthor: x\n---\nHi`,
  "empty": `---\nname: X\n---\n\n`,
  "no-frontmatter": `name: X\nHi`,
  "bad-model": `---\nname: X\nmodel: claude\n---\nHi`,
  "bad-emoji": `---\nname: X\nemoji: 🧟\n---\nHi`,
  "bad-icon": `---\nname: X\nicon_url: http://x\n---\nHi`,
  "escape": `---\nname: X\nknowledge: ../../.env\n---\nHi`,
  "mismatch": `---\nname: X\nslug: other\n---\nHi`,
  "bad-slug": `---\nname: X\nslug: The X\n---\nHi`,
};

test("both readers accept and reject the same files, with the same slug and system prompt", { skip: !present && "nextjs/lib/bots-format.mjs not found" }, async () => {
  const { parseBotFile, buildSystemPrompt } = await import(courseReader);
  const example = new URL("../../nextjs/bots/_examples/socrates-on-writing.md", import.meta.url);
  const files = { ...SAMPLES, "socrates-on-writing": fs.readFileSync(example, "utf8") };
  for (const [fileSlug, text] of Object.entries(files)) {
    const ours = checkBot(text, { fileSlug });
    const theirs = parseBotFile(text, { slug: fileSlug });
    assert.equal(ours.ok, theirs.ok, `${fileSlug}: harness ${ours.ok ? "accepts" : `rejects (${ours.problems})`}, course app ${theirs.ok ? "accepts" : `rejects (${theirs.errors})`}`);
    if (!ours.ok) continue;
    assert.equal(ours.bot.slug, theirs.bot.slug, fileSlug);
    assert.equal(ours.bot.name, theirs.bot.name, fileSlug);
    assert.equal(systemPrompt(ours.bot, "A text.\n"), buildSystemPrompt(theirs.bot, "A text.\n"), fileSlug);
  }
});
