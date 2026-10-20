import fs from "node:fs";
import path from "node:path";
import { checkBot } from "./bot-file.mjs";

// Submitting a bot from Slack: paste the file (in a code block or not) or attach the .md, in the submissions channel
// or a direct message to the app. The harness checks it and saves it to bots/<slug>.md, where the room picks it up.

// Slack's message text back to what was typed: code fences off, &amp; &lt; &gt; decoded, <https://…|label> to the URL.
export function slackToPlain(text) {
  return String(text ?? "")
    .replace(/```/g, "\n")
    .replace(/<(https?:\/\/[^>|]+)(?:\|[^>]*)?>/g, "$1")
    .replace(/<mailto:[^>|]+\|([^>]+)>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .trim();
}

// The bot file inside a message, if there is one: the text from the first --- line on.
export function findBotText(text) {
  const plain = slackToPlain(text);
  const start = plain.search(/^---[ \t]*$/m);
  return start === -1 ? null : `${plain.slice(start).trim()}\n`;
}

// Save a submitted bot, remembering who submitted each slug (bots/.submitters.json) so one student can't replace
// another's bot. Returns { ok, bot, problems, warnings, file }.
export function saveSubmission(dir, text, { submitter }) {
  const checked = checkBot(text);
  const { bot, problems, warnings } = checked;
  if (!checked.ok) return { ok: false, bot, problems, warnings };
  const ownersFile = path.join(dir, ".submitters.json");
  let owners = {};
  try { owners = JSON.parse(fs.readFileSync(ownersFile, "utf8")); } catch { /* first submission */ }
  const file = path.join(dir, `${bot.slug}.md`);
  if (fs.existsSync(file) && owners[bot.slug] && owners[bot.slug] !== submitter) {
    return { ok: false, bot, warnings, problems: [`Someone else's bot already uses the slug "${bot.slug}". Pick another slug: line.`] };
  }
  if (bot.knowledge && !fs.existsSync(path.resolve(dir, bot.knowledge))) {
    return { ok: false, bot, warnings, problems: [`Its knowledge: file (${bot.knowledge}) isn't on the Ensemble's computer. Submit bots with a text on the /ensemble page, or leave the knowledge: line out.`] };
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, text.replace(/\r\n?/g, "\n"));
  owners[bot.slug] = submitter;
  fs.writeFileSync(ownersFile, `${JSON.stringify(owners, null, 2)}\n`);
  return { ok: true, bot, problems: [], warnings, file: `${bot.slug}.md` };
}
