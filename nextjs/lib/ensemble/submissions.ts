import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import type { BotDraft } from "../custom-chatbot/schema";

// Field IDs survive renaming in the Airtable UI.
export const FIELDS = {
  name: "fldaOxNr7MAWsadLz", slug: "fldiH8Hl7TaDPX5rm", student: "fldKucG1B6eJzXPPt",
  icon: "fld6Hkd3eRoDO7do7", prompt: "fldmP1yKBCseNpWHG", model: "fld8HIsy1ZZvnycHX",
  knowledge: "fldhzR7keUV3qNHZw", active: "fld6ZevxYqsrP0fCn", notes: "fld85BoGXvg5yaR3Q",
  settings: "fldBijVi8ETlwgfgX",
} as const;

export class SubmissionError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function slugFor(name: string) {
  const slug = name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  // Names in other scripts still get a stable ASCII identifier for the harness.
  return slug || `bot-${createHash("sha256").update(name.trim()).digest("hex").slice(0, 12)}`;
}

export function airtableConfig() {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const base = process.env.AIRTABLE_BASE_ID?.trim();
  const table = process.env.AIRTABLE_TABLE_ID?.trim();
  if (!token || !base?.match(/^app[A-Za-z0-9]+$/) || !table?.match(/^tbl[A-Za-z0-9]+$/)) {
    throw new SubmissionError("Ensemble submissions are not configured yet. Ask the instructor to connect Airtable.", 503);
  }
  return { token, url: `https://api.airtable.com/v0/${base}/${table}`, active: process.env.SUBMIT_ACTIVE === "true" };
}

function extrasField() {
  return process.env.AIRTABLE_EXTRAS_FIELD?.trim() || "";
}

const Result = z.object({
  records: z.array(z.object({ id: z.string().regex(/^rec[A-Za-z0-9]+$/) })).length(1),
  createdRecords: z.array(z.string()),
  updatedRecords: z.array(z.string()),
});

export async function submitBot(bot: BotDraft) {
  const config = airtableConfig();
  const slug = slugFor(bot.agentName);
  const fields = {
    [FIELDS.name]: bot.agentName,
    [FIELDS.slug]: slug,
    [FIELDS.student]: bot.student,
    [FIELDS.icon]: bot.iconUrl,
    [FIELDS.prompt]: bot.framingPrompt,
    [FIELDS.model]: bot.model,
    [FIELDS.knowledge]: bot.knowledge,
    // Extras go to their own long-text field once the instructor names it (AIRTABLE_EXTRAS_FIELD, a field name or
    // fld… ID); until then they are appended to Notes so nothing a student sends is lost.
    [FIELDS.notes]: extrasField() || !bot.extras ? bot.notes : [bot.notes, `Extras:\n${bot.extras}`].filter(Boolean).join("\n\n"),
    ...(extrasField() ? { [extrasField()]: bot.extras } : {}),
    [FIELDS.active]: config.active,
    [FIELDS.settings]: JSON.stringify({
      source: "poetry-gem", version: 1,
      ...bot.settings, submittedAt: new Date().toISOString(),
    }),
  };
  // Empty strings intentionally clear optional fields on resubmission.
  // Do not write Triggers or the table's template fields; students' triggers live in Notes.
  let response: Response;
  try {
    response = await fetch(config.url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: [FIELDS.slug] },
        returnFieldsByFieldId: true,
        records: [{ fields }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new SubmissionError("Airtable could not be reached. Your draft is still here; try submitting again.", 502);
  }
  if (!response.ok) {
    // Never relay provider error bodies, headers, tokens, or fetch exceptions to a student.
    const message = response.status === 429
      ? "The Ensemble is receiving too many submissions. Wait a moment and try again."
      : response.status === 422
        ? "Airtable could not match or save this bot. Ask the instructor to check the name and table fields."
        : "The Ensemble could not save your bot. Ask the instructor to check the Airtable connection.";
    throw new SubmissionError(message, response.status === 429 ? 429 : 502);
  }
  const parsed = Result.safeParse(await response.json().catch(() => null));
  if (!parsed.success) throw new SubmissionError("Airtable returned an unexpected response. Retry with the same bot name.", 502);
  const recordId = parsed.data.records[0].id;
  if (![...parsed.data.createdRecords, ...parsed.data.updatedRecords].includes(recordId)) {
    throw new SubmissionError("Airtable did not confirm the save. Retry with the same bot name.", 502);
  }
  return { ok: true as const, recordId, slug, created: parsed.data.createdRecords.includes(recordId), active: config.active };
}
