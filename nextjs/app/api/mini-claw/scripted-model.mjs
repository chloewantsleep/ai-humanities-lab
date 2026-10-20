// A stand-in for the model, for trying the loop without an OpenRouter key (or without the network).
// It is not a language model: like ELIZA, it follows a script. It has one keyword rule (if the task names a path, it
// tries to read it first), then plays the same four moves whatever the task says, counting the tool results already
// in the conversation to know which move comes next. The loop in agent.mjs
// can't tell the difference, which is the point: the loop only sees "text" or "a tool call".
const today = () => new Date().toLocaleDateString("en-CA");

const MOVES = [
  task => ({ action: "read", path: "skills/remember.md" }),
  task => ({ action: "append", path: "memory.md", text: `- ${today()}: (scripted run) The user asked: "${task.replace(/\s+/g, " ").slice(0, 120)}"` }),
  task => ({ action: "list", path: "notes" }),
  task => ({ action: "write", path: "notes/scripted-run.md", text: `# A scripted run\n\n${today()}\n\nThe task, in the user's words:\n\n> ${task.replace(/\n/g, "\n> ")}\n` }),
];

const usage = { inputTokens: { total: undefined, noCache: undefined, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: undefined, text: undefined, reasoning: undefined } };

export const scriptedModel = {
  specificationVersion: "v4",
  provider: "mini-claw",
  modelId: "scripted (no model)",
  supportedUrls: {},
  async doGenerate({ prompt }) {
    const firstUser = prompt.find(message => message.role === "user");
    const task = firstUser?.content.filter(part => part.type === "text").map(part => part.text).join("\n") ?? "";
    const named = task.match(/[\w.~-]*\/[\w./~-]+/)?.[0];
    const moves = named ? [() => ({ action: "read", path: named }), ...MOVES] : MOVES;
    const done = prompt.filter(message => message.role === "tool").length;
    if (done < moves.length) {
      const input = moves[done](task);
      return { content: [{ type: "tool-call", toolCallId: `scripted-${done + 1}`, toolName: "file", input: JSON.stringify(input) }], finishReason: { unified: "tool-calls", raw: undefined }, usage, warnings: [] };
    }
    const text = `${named ? `I tried to read ${named}, then ` : "I "}loaded the remember skill, added a line to memory.md, checked notes/, and wrote notes/scripted-run.md. (I'm the scripted stand-in, not a model: I make these same moves whatever you type.)`;
    return { content: [{ type: "text", text }], finishReason: { unified: "stop", raw: undefined }, usage, warnings: [] };
  },
  async doStream() {
    throw new Error("The scripted model only supports generateText.");
  },
};
