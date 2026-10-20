// mini-claw: the whole agent loop.
//
// An agent is a model in a loop. Each turn of the loop asks the model what to do next. If it asks for the tool,
// we run the tool and hand back the result; if it answers in words instead, the run is over. Everything else
// (memory, skills, permissions) is text in the prompt or a check inside the tool.
import { generateText, tool } from "ai";
import { fileTool, fileToolForTrace, runFileTool, readMemory, listSkills, WORKSPACE } from "./workspace.mjs";

const MAX_STEPS = 10; // a stopping condition of our own, in case the model never stops asking for the tool

export async function runAgent({ task, model, report, abortSignal, root = WORKSPACE }) {
  // 1. Assemble the context. memory.md goes in whole; each skill goes in as one line, and the model reads
  //    the rest of a skill with the tool only if it decides it needs it.
  const memoryBefore = await readMemory(root);
  const skills = await listSkills(root);
  const system = [
    `You are mini-claw, a small agent for a humanities course. Today is ${new Date().toLocaleDateString("en-CA")}.`,
    "You have one tool, `file`, which works only inside your workspace folder, mini-claw/. Use it when the task needs a file; otherwise just answer.",
    "Each run starts fresh: you remember nothing from earlier runs except what is in memory.md, below.",
    "",
    "## memory.md",
    memoryBefore.trim() || "(empty)",
    "",
    "## Skills",
    "Before doing a task that matches a skill, read the skill's file and follow it.",
    ...skills.map(skill => `- ${skill.name} (${skill.path}): ${skill.description}`),
    "",
    "When you are done, reply to the user in a few sentences, saying what you did with files, if anything.",
  ].join("\n");
  const tools = { file: tool(fileTool) }; // no `execute`: the SDK hands the call back to us, and we run it below
  const messages = [{ role: "user", content: task }];
  report({ type: "start", task, system, tool: fileToolForTrace, memory: memoryBefore, skills });

  for (let step = 1; step <= MAX_STEPS; step++) {
    // 2. Call the model with everything so far: the system prompt, the tool's description, and the messages.
    report({ type: "model-input", step, messages: structuredClone(messages) });
    const result = await generateText({ model, system, messages, tools, abortSignal, maxOutputTokens: 2048 });
    messages.push(...result.responseMessages); // the model's reply, tool calls included, joins the conversation
    report({ type: "model-output", step, text: result.text, toolCalls: result.toolCalls.map(({ toolCallId, toolName, input }) => ({ toolCallId, toolName, input })), finishReason: result.finishReason });

    // 3. No tool call means the model has answered in words: the run is over.
    if (result.toolCalls.length === 0) {
      report({ type: "done", step, text: result.text, memoryBefore, memoryAfter: await readMemory(root) });
      return;
    }

    // 4. Run each tool call (the permission check happens inside the tool), then feed the results back
    //    as a "tool" message, so the next call to the model can see what happened.
    const results = [];
    for (const call of result.toolCalls) {
      const ran = await runFileTool(call.input, root);
      report({ type: "tool-result", step, toolCallId: call.toolCallId, input: call.input, ...ran, memory: call.input?.action === "append" ? await readMemory(root) : undefined });
      results.push({ type: "tool-result", toolCallId: call.toolCallId, toolName: call.toolName, output: { type: "text", value: ran.output } });
    }
    messages.push({ role: "tool", content: results });
  }

  report({ type: "done", step: MAX_STEPS, text: `Stopped after ${MAX_STEPS} steps without a final answer.`, stopped: true, memoryBefore, memoryAfter: await readMemory(root) });
}
