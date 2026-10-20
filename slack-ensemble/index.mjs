// The AI Humanities Lab Ensemble: one Slack app that speaks as every bot in bots/.
//   pnpm start      live in Slack (needs SLACK_BOT_TOKEN, SLACK_APP_TOKEN, OPENROUTER_API_KEY in .env)
//   pnpm dry-run    a simulated room on localhost, shown by the course app's /ensemble page; nothing touches Slack
//   pnpm fake       the same, with canned replies instead of a model (free)
import { loadConfig } from "./lib/config.mjs";
import { loadBots, watchBots } from "./lib/bots.mjs";
import { createRoom } from "./lib/room.mjs";
import { createGenerator, loadCatalog, resolveModel } from "./lib/llm.mjs";
import { createLog } from "./lib/log.mjs";
import { createSimulatedRoom, startApi } from "./lib/dry-run.mjs";

const config = loadConfig();
const mode = config.dryRun ? "dry-run" : "live";

if (!config.dryRun) {
  const { botToken, appToken } = config.slack;
  const missing = [!botToken?.startsWith("xoxb-") && "SLACK_BOT_TOKEN (xoxb-…)", !appToken?.startsWith("xapp-") && "SLACK_APP_TOKEN (xapp-…)"].filter(Boolean);
  if (missing.length) {
    console.error(`Not starting live: missing ${missing.join(" and ")} in slack-ensemble/.env.\nCreate the Slack app first (README, "Install in Slack"), or run the simulated room: pnpm dry-run`);
    process.exit(1);
  }
}
if (!config.fake && !config.openrouter.apiKey) {
  console.error("Not starting: OPENROUTER_API_KEY is missing in slack-ensemble/.env. (pnpm fake runs the simulated room without a model.)");
  process.exit(1);
}

let { bots, invalid } = loadBots(config.botsDir, { examples: config.examples });
const getBots = () => bots;
const log = createLog({ dir: config.logDir, mode });
const describe = () => `${bots.size} bot${bots.size === 1 ? "" : "s"}${invalid.length ? `, ${invalid.length} invalid` : ""}`;
watchBots(config.botsDir, () => loadBots(config.botsDir, { examples: config.examples }), next => {
  ({ bots, invalid } = next);
  console.log(`bots reloaded: ${describe()}${invalid.length ? ` (${invalid.map(i => i.file).join(", ")})` : ""}`);
});
if (!config.fake) await loadCatalog();

const generate = createGenerator({ settings: config.openrouter, getBots, contextMessages: config.limits.contextMessages, fake: config.fake });
const transport = {};
const room = createRoom({ getBots, limits: config.limits, transport, generate, log });

const state = () => ({
  mode,
  fake: config.fake,
  defaultModel: config.openrouter.defaultModel,
  limits: config.limits,
  bots: [...bots.values()].map(b => {
    const { model, note } = resolveModel(b, config.openrouter);
    return { name: b.name, slug: b.slug, author: b.author, description: b.description, emoji: b.emoji, icon_url: b.icon_url, file: b.file, example: b.example, asked: b.model, model, note, warnings: b.warnings, knowledgeWords: b.knowledgeWords };
  }),
  invalid,
});

let simulated = null;
if (config.dryRun) {
  simulated = createSimulatedRoom();
  transport.fetchThread = async threadId => simulated.thread(threadId);
  transport.postAs = async (bot, threadId, text) => simulated.addBot(bot, threadId, text);
}

try {
  await startApi({ port: config.port, state, room: simulated, onHuman: message => room.handle(message.thread, message) });
} catch (error) {
  console.error(`Can't listen on port ${config.port} (${error.code}); is the Ensemble already running? Set ENSEMBLE_PORT to use another.`);
  process.exit(1);
}

if (config.dryRun) {
  console.log(`Simulated room${config.fake ? " (fake replies)" : ""}: ${describe()} from ${config.botsDir}\nOpen http://localhost:3000/ensemble (the course app), or GET http://127.0.0.1:${config.port}/state`);
} else {
  const { startSlack } = await import("./lib/slack.mjs");
  await startSlack({ config, room, transport, getBots, log });
  console.log(`Live: ${describe()}. Status at http://127.0.0.1:${config.port}/state`);
}
