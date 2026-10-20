import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ExperimentPage from "../components/ExperimentPage.jsx";
import { listBots } from "../../lib/bots.mjs";
import { buildSystemPrompt, parseBotFile } from "../../lib/bots-format.mjs";
import BotRoom from "./BotRoom.jsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "The bot room" };

// The room's shape of a bot: the system prompt is the file's body plus any knowledge text, as the format says.
const roomBot = (bot, { source, file }) => ({
  name: bot.name, slug: bot.slug, author: bot.author ?? "", model: bot.model || null, emoji: bot.emoji ?? "", description: bot.description ?? "",
  knowledgeFile: bot.knowledgeFile ?? null, system: buildSystemPrompt(bot), errors: bot.errors ?? [], source, file, key: file,
});

// Bots come from three places, all in the shared format (bots/README.md): the room's own examples in
// app/bot-room/examples/ (read with AA's parser), and bots/_examples/ and bots/ (read with AA's reader, lib/bots.mjs,
// which also resolves a bot's knowledge file).
async function loadBots() {
  const bots = [];
  const folder = path.join(process.cwd(), "app", "bot-room", "examples");
  for (const name of (await readdir(folder)).filter(f => f.endsWith(".md")).sort()) {
    const text = await readFile(path.join(folder, name), "utf8");
    const { bot, errors } = parseBotFile(text, { slug: name.replace(/\.md$/, ""), source: name, example: true });
    bots.push(roomBot({ ...bot, errors }, { source: "room example", file: `app/bot-room/examples/${name}` }));
  }
  for (const bot of await listBots()) bots.push(roomBot(bot, { source: bot.example ? "example" : "bots/", file: `bots/${bot.source}` }));
  return bots;
}

export default async function Page() {
  const bots = await loadBots();
  return (
    <ExperimentPage name="bot-room">
      <BotRoom bots={bots} chatModel={process.env.CHAT_MODEL?.trim() || null} hasKey={!!process.env.OPENROUTER_API_KEY?.trim()} />
    </ExperimentPage>
  );
}
