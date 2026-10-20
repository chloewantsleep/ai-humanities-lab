import bolt from "@slack/bolt";
import { findBotText, saveSubmission } from "./submit.mjs";

// The live transport: one Slack app in Socket Mode that posts as each bot (chat:write.customize sets the display
// name and icon per message). It reacts only to people's messages; every bot message, ours included, is ignored as
// an event, so bot-to-bot replies happen only through room.mjs, inside its guards.
export async function startSlack({ config, room, transport, getBots, log }) {
  const { botToken, appToken, channels } = config.slack;
  const app = new bolt.App({ token: botToken, appToken, socketMode: true, logLevel: bolt.LogLevel.WARN });
  const auth = await app.client.auth.test();
  const people = new Map();

  async function personName(user) {
    if (!user) return "someone";
    if (!people.has(user)) {
      try {
        const { user: u } = await app.client.users.info({ user });
        people.set(user, u.profile?.display_name || u.real_name || u.name || "someone");
      } catch { people.set(user, "someone"); }
    }
    return people.get(user);
  }

  const bySlackName = name => [...getBots().values()].find(b => b.name === name);
  async function toMessage(m) {
    if (m.bot_id === auth.bot_id) {
      const bot = bySlackName(m.username);
      return { id: m.ts, kind: "bot", name: m.username ?? "Ensemble", slug: bot?.slug, text: m.text ?? "" };
    }
    if (m.bot_id || m.subtype === "bot_message") return { id: m.ts, kind: "other", name: m.username ?? "an app", text: m.text ?? "" };
    return { id: m.ts, kind: "human", name: await personName(m.user), text: m.text ?? "" };
  }

  // Threads are keyed "<channel>:<thread ts>".
  const split = threadId => { const [channel, ts] = threadId.split(":"); return { channel, ts }; };
  transport.fetchThread = async threadId => {
    const { channel, ts } = split(threadId);
    const { messages = [] } = await app.client.conversations.replies({ channel, ts, limit: 200 });
    return Promise.all(messages.map(toMessage));
  };
  transport.postAs = async (bot, threadId, text) => {
    const { channel, ts } = split(threadId);
    const icon = bot.icon_url ? { icon_url: bot.icon_url } : { icon_emoji: bot.emoji || ":speech_balloon:" };
    const res = await app.client.chat.postMessage({ channel, thread_ts: ts, text, username: bot.name, ...icon, unfurl_links: false, unfurl_media: false });
    return { id: res.ts, kind: "bot", name: bot.name, slug: bot.slug, text };
  };

  // A bot file in a direct message to the app, or in the submissions channel: check it, save it, say how it went.
  async function trySubmission(event) {
    const direct = event.channel_type === "im";
    if (!direct && event.channel !== config.slack.submitChannel) return false;
    let text = findBotText(event.text);
    const attached = (event.files ?? []).find(f => /\.(md|txt)$/i.test(f.name ?? ""));
    if (!text && attached) {
      const res = await fetch(attached.url_private_download ?? attached.url_private, { headers: { authorization: `Bearer ${botToken}` } });
      text = res.ok ? findBotText(await res.text()) : null;
    }
    const reply = message => app.client.chat.postMessage({ channel: event.channel, thread_ts: event.ts, text: message });
    if (!text) {
      if (direct) await reply("To join the Ensemble, send me your bot file: paste it (starting with the --- line) or attach the .md.");
      return direct;
    }
    const result = saveSubmission(config.botsDir, text, { submitter: event.user });
    log({ type: result.ok ? "submitted" : "submission-refused", bot: result.bot.slug, by: await personName(event.user), problems: result.problems });
    const warnings = result.warnings.length ? `\n(${result.warnings.join(" ")})` : "";
    await reply(result.ok
      ? `${result.bot.emoji || ":speech_balloon:"} *${result.bot.name}* has joined the AI Humanities Lab Ensemble. Say hello with @${result.bot.name} in the ensemble channel.${warnings}`
      : `Not yet: \n• ${result.problems.join("\n• ")}\nFix the file and send it again.${warnings}`);
    return true;
  }

  app.event("message", async ({ event }) => {
    if (event.bot_id || (event.subtype && !["thread_broadcast", "file_share"].includes(event.subtype))) return;
    if (await trySubmission(event)) return;
    if (event.channel_type === "im" || event.subtype === "file_share") return;
    if (channels.length && !channels.includes(event.channel)) return;
    const threadId = `${event.channel}:${event.thread_ts ?? event.ts}`;
    // @-mentioning the app itself with no bot named: say who is in the room.
    if (event.text?.includes(`<@${auth.user_id}>`) && !room.mentions(event.text)) {
      const roster = [...getBots().values()].map(b => `• *${b.name}*${b.author ? ` (${b.author})` : ""}${b.description ? `: ${b.description}` : ""}`);
      await app.client.chat.postMessage({ channel: event.channel, thread_ts: event.thread_ts ?? event.ts, text: roster.length ? `In the Ensemble: \n${roster.join("\n")}\n\nAddress one with @ and its name, e.g. @${[...getBots().values()][0].name}` : "No bots in the Ensemble yet." });
      return;
    }
    room.handle(threadId, await toMessage(event));
  });

  await app.start();
  log({ type: "started", reason: `live in Slack workspace "${auth.team}" as ${auth.user}` });
  return { app, auth };
}
