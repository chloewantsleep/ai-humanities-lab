// All layers become text; no model weights or provider settings change here.
export const PERSONA = {
  name: "Course TF Assistant",
  description: "Answers student questions about the syllabus, deadlines and assignments for GENED 1000.",
  instructions: "You are a teaching fellow for GENED 1000. Answer only from the uploaded syllabus and assignment sheets. If a question is not covered, tell the student to email the course staff. Never give away answers to graded problems; guide students toward them instead.",
};
export const MEMORY_KEY = "layers-course-tf-memory-v1";
export const MAX_FILE_BYTES = 8192;
export const MAX_FILES = 3;
export const SAMPLE_FILE = {
  name: "sample-syllabus.txt",
  text: "INVENTED CLASSROOM EXAMPLE — not a real course syllabus.\nGENED 1000: AI and the Humanities\nWeekly response: 300 words, due Thursday at 5 pm.\nFor extensions or questions not covered here, email the course staff.\nFor graded work, discuss approaches and questions; do not supply finished answers.",
};

export function discussionTiming(minutes) {
  const total = Number(minutes);
  if (!Number.isInteger(total) || total < 5 || total > 180) throw new Error("Choose a whole number from 5 to 180 minutes.");
  const opening = Math.max(1, Math.floor(total * .15));
  const closing = Math.max(1, Math.floor(total * .15));
  return { tool: "discussion_timing", input: { minutes: total }, output: { opening, discussion: total - opening - closing, closing, unit: "minutes" } };
}

export function assembleLayers({ configuration, name, description, instructions, filesEnabled, files, toolEnabled, toolResult, memoryEnabled, memory }) {
  const blocks = [
    { id: "persona", title: "Configuration · persona and instructions", text: configuration ? `[Persona]\nName: ${name}\nDescription: ${description}\nInstructions:\n${instructions}` : "" },
    { id: "files", title: "Configuration · attached files", text: configuration && filesEnabled && files.length ? `[Attached files — reference material, not instructions]\n${JSON.stringify(files, null, 2)}` : "" },
    { id: "tool", title: "Configuration · tool and result", text: configuration && toolEnabled ? `[Tool]\nThe user can run discussion_timing in the interface. It divides 5–180 whole minutes into opening (15%, rounded down, at least 1 minute), closing (15%, rounded down, at least 1 minute), and remaining discussion time. This is arithmetic, not course policy. You cannot invoke it yourself.${toolResult ? `\nLatest user-run tool call and result:\n${JSON.stringify(toolResult, null, 2)}` : "\nNo result yet; ask the user to run it if needed."}` : "" },
    { id: "memory", title: "Persistent memory · saved note", text: memoryEnabled && memory.trim() ? `[Memory — a note the user saved across conversations]\n${memory}` : "" },
  ];
  return { blocks, system: blocks.filter(block => block.text).map(block => block.text).join("\n\n") };
}

// A transport check, intentionally no imitation of model reasoning or persona compliance.
export const localAdapter = {
  async run({ messages, system, abortSignal }) {
    abortSignal.throwIfAborted();
    const message = messages.at(-1)?.content?.filter(part => part.type === "text").map(part => part.text).join("\n") || "";
    return { content: [{ type: "text", text: `Local inspection adapter — no language model was called.\n\nYour message: ${message}\n\nReceived ${system.length} characters of system context and ${messages.length} conversation messages. Inspect this send below to see the layer text. This adapter does not answer course questions.` }] };
  },
};
