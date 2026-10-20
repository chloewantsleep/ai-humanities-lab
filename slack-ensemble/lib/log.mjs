import fs from "node:fs";
import path from "node:path";

// Every reply (and every time a guard stopped one) as a line of JSON in logs/<YYYY-MM-DD>.jsonl, local time,
// so the room's history can be shown later ("how that world evolved").
export function createLog({ dir, mode, echo = true }) {
  fs.mkdirSync(dir, { recursive: true });
  return entry => {
    const now = new Date();
    const day = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const line = { at: now.toISOString(), mode, ...entry };
    fs.appendFileSync(path.join(dir, `${day}.jsonl`), `${JSON.stringify(line)}\n`);
    if (echo) {
      const what = entry.type === "reply" ? `${entry.name} (${entry.model}): ${entry.text.slice(0, 90).replace(/\n/g, " ")}` : `${entry.bot ?? entry.after ?? ""} ${entry.reason ?? entry.error ?? ""}`;
      console.log(`[${line.at.slice(11, 19)}] ${entry.type} ${what}`);
    }
  };
}
