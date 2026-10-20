#!/usr/bin/env node
// THE CLAUDE CODE WATCHER. Run by the hook in .claude/settings.json after every edit Claude makes, and by hand with
// `node nextjs/app/build-a-bot/watch.mjs`. Silent (exit 0) when the build-a-bot page still meets the contract. Otherwise
// it prints what drifted to stderr and exits 2, which Claude Code shows to Claude so it can tell the student.
// The in-page Watcher.jsx does the live, in-browser half of this check.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const problems = [];

// 1. The contract itself must be intact: same keys, and a known-good set of choices must still pass and map to the
// record shape the server expects (lib/custom-chatbot/schema.ts).
const EXPECTED = ["botName", "studentName", "prompt", "pack", "material", "delivery", "extras"];
const RECORD = ["agentName", "student", "iconUrl", "framingPrompt", "knowledge", "notes", "model", "settings", "extras"];
try {
  const contract = await import(path.join(dir, "contract.js"));
  const keys = Object.keys(contract.CHOICES ?? {});
  if (keys.join() !== EXPECTED.join()) problems.push(`contract.js was changed: its CHOICES keys are [${keys}], expected [${EXPECTED}]. Restore contract.js (git checkout nextjs/app/build-a-bot/contract.js) and change BotPage.jsx instead.`);
  const catalog = { prompts: { ghazal: "x" }, voices: { frankenstein: "y" } };
  const good = { botName: "Test", studentName: "Test", prompt: "ghazal", pack: "frankenstein", material: "voice", delivery: "full" };
  const found = contract.check?.(good, catalog);
  if (!found || Object.keys(found).length) problems.push("contract.js no longer accepts a valid bot. Restore it from git.");
  const record = contract.toSubmission?.(good, catalog) ?? {};
  if (Object.keys(record).join() !== RECORD.join()) problems.push(`contract.js now builds a different record ([${Object.keys(record)}]); the Airtable route expects [${RECORD}]. Restore it from git.`);
} catch (error) {
  problems.push(`contract.js could not be loaded: ${error.message}`);
}

// 2. The page must still use the contract: submitBot() for sending, and the <Watcher> on the page.
const sources = [];
for (const name of await readdir(dir)) {
  if (/\.(jsx?|tsx?)$/.test(name) && !["contract.js", "Watcher.jsx", "watch.mjs", "page.jsx", "ResetShell.jsx"].includes(name)) {
    sources.push([name, await readFile(path.join(dir, name), "utf8")]);
  }
}
// Comments don't count (BotPage.jsx's own header mentions submitBot and <Watcher>).
const all = sources.map(([, text]) => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")).join("\n");
if (!sources.length) problems.push("BotPage.jsx is missing from nextjs/app/build-a-bot/.");
if (!/\bsubmitBot\s*\(/.test(all)) problems.push("No file in nextjs/app/build-a-bot/ calls submitBot(choices, catalog) from contract.js, so the page can't send a bot to Airtable. Import it and call it from the submit action.");
if (!/<Watcher\b/.test(all)) problems.push("The <Watcher choices={choices} catalog={catalog} /> box is gone from the page. Put it back so the student can see whether the design still matches the Airtable contract.");
if (/fetch\(\s*["'`]\/api\/submit/.test(all)) problems.push("BotPage posts to /api/submit directly. Use submitBot() from contract.js so the record keeps the shape Airtable expects.");
if (/process\.env\.AIRTABLE|api\.airtable\.com/.test(all)) problems.push("The page refers to Airtable directly. Keys must stay on the server: use submitBot() and never put AIRTABLE_ values in browser code.");
for (const key of ["botName", "studentName", "prompt", "pack", "material", "delivery"]) {
  if (!new RegExp(`\\b${key}\\b`).test(all)) problems.push(`The page never mentions the contract key "${key}", so it probably can't collect it. Every bot needs: botName, studentName, prompt, pack, material, delivery (extras optional).`);
}

if (problems.length) {
  console.error(`Build-a-bot watcher: the page has drifted from the Airtable contract.\n- ${problems.join("\n- ")}\nThe student's only goal is to submit a bot from their own interface, so fix this before going on (see nextjs/app/build-a-bot/contract.js).`);
  process.exit(2);
}
