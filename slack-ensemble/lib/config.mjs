import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// All settings, read once from slack-ensemble/.env (found next to this folder, whatever the working directory).
// Variable names are listed in .env.example; values never appear in logs or output.
export const HOME = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(HOME, ".env"), quiet: true });

const env = name => process.env[name]?.trim() || undefined;
const int = (name, fallback) => {
  const n = Number.parseInt(env(name) ?? "", 10);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
};
const list = name => (env(name) ?? "").split(",").map(s => s.trim()).filter(Boolean);

export function loadConfig(argv = process.argv.slice(2)) {
  return {
    dryRun: argv.includes("--dry-run"),
    // --fake answers without calling a model (free; for testing the room and the loop guard).
    fake: argv.includes("--fake"),
    botsDir: path.resolve(HOME, env("BOTS_DIR") ?? "../nextjs/bots"),
    // Include our example bots (bots/_examples/) in the room.
    examples: env("ENSEMBLE_EXAMPLES") !== "false",
    logDir: path.resolve(HOME, env("LOG_DIR") ?? "logs"),
    port: int("ENSEMBLE_PORT", 3031),
    slack: {
      botToken: env("SLACK_BOT_TOKEN"),
      appToken: env("SLACK_APP_TOKEN"),
      // Optional: answer only in these channel IDs (comma-separated). Unset: any channel the app is invited to.
      channels: list("ENSEMBLE_CHANNELS"),
      // Optional: a channel ID where students post their bot files to join (direct messages to the app always work).
      submitChannel: env("ENSEMBLE_SUBMIT_CHANNEL"),
    },
    openrouter: {
      apiKey: env("OPENROUTER_API_KEY"),
      defaultModel: env("ENSEMBLE_DEFAULT_MODEL") ?? "anthropic/claude-sonnet-5.5",
      // Optional allow-list; a bot asking for anything else gets the default model.
      allowedModels: list("ENSEMBLE_ALLOWED_MODELS"),
      // A bot whose model costs more than this per million output tokens gets the default model.
      maxOutputPrice: Number(env("ENSEMBLE_MAX_OUTPUT_PRICE") ?? 10),
      maxTokens: int("ENSEMBLE_MAX_TOKENS", 1000),
      // Reasoning effort for models that think before answering (OpenRouter's reasoning.effort); "default" sends none.
      reasoning: env("ENSEMBLE_REASONING") ?? "low",
    },
    limits: {
      // Bot replies in a row since the last human message (the first answer to the person counts) before the bots
      // stop answering each other.
      maxBotChain: int("ENSEMBLE_MAX_BOT_CHAIN", 3),
      // Bot replies in one thread, ever. A ceiling for a world left running for a week.
      maxThreadBotTurns: int("ENSEMBLE_MAX_THREAD_BOT_TURNS", 40),
      // Bots that may answer one message (several @-mentions).
      maxRespondersPerMessage: int("ENSEMBLE_MAX_RESPONDERS", 3),
      // Replies per bot per minute, and per bot per hour.
      perBotPerMinute: int("ENSEMBLE_PER_BOT_PER_MINUTE", 6),
      perBotPerHour: int("ENSEMBLE_PER_BOT_PER_HOUR", 60),
      // Messages of the thread the bot sees (the newest ones).
      contextMessages: int("ENSEMBLE_CONTEXT_MESSAGES", 30),
    },
  };
}
