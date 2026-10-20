import http from "node:http";

// The simulated room: one pretend channel held in memory, with threads, that the course app's /ensemble page
// shows. Messages are { id, thread, kind, name, slug?, emoji?, icon_url?, text, at }; a top-level message is its
// own thread (thread === id).
export function createSimulatedRoom() {
  const messages = [];
  let counter = 0;
  const add = fields => {
    const id = `m${++counter}`;
    const message = { id, thread: fields.thread ?? id, at: new Date().toISOString(), ...fields };
    message.thread ??= id;
    messages.push(message);
    return message;
  };
  return {
    messages,
    thread: threadId => messages.filter(m => m.thread === threadId),
    addHuman: ({ name, text, thread }) => add({ kind: "human", name: name || "student", text, thread: thread || undefined }),
    addBot: (bot, thread, text) => add({ kind: "bot", name: bot.name, slug: bot.slug, emoji: bot.emoji, icon_url: bot.icon_url, text, thread }),
    reset: () => { messages.length = 0; },
  };
}

const MAX_BODY = 20_000;

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; if (data.length > MAX_BODY) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error("not JSON")); } });
  });
}

// A small JSON API on localhost for the course app: GET /state; in a dry run also POST /messages and POST /reset.
export function startApi({ port, state, room, onHuman }) {
  const server = http.createServer(async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(body));
    };
    try {
      const url = new URL(req.url, "http://localhost");
      if (req.method === "GET" && url.pathname === "/state") return send(200, { ...state(), messages: room?.messages ?? [] });
      if (!room) return send(404, { error: "Only a dry run has a simulated room. Start it with: pnpm dry-run" });
      if (req.method === "POST" && url.pathname === "/messages") {
        const { name, text, thread } = await readJson(req);
        if (typeof text !== "string" || !text.trim()) return send(400, { error: "Write a message first." });
        if (thread && !room.messages.some(m => m.id === thread)) return send(400, { error: "That thread doesn't exist (was the room reset?)." });
        const message = room.addHuman({ name: String(name ?? "").slice(0, 40).trim(), text: text.slice(0, 4000), thread });
        onHuman(message);
        return send(200, { message });
      }
      if (req.method === "POST" && url.pathname === "/reset") { room.reset(); return send(200, { ok: true }); }
      return send(404, { error: "Unknown endpoint." });
    } catch (error) {
      return send(400, { error: error.message });
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}
