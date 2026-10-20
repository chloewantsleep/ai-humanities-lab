import { createHash, timingSafeEqual } from "node:crypto";
import { client, isoSeconds, keyName, normalizePerson, openUntil, parseKeyName } from "./openrouter.mjs";

export class ClaimError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function config(env = process.env) {
  return {
    managementKey: env.OPENROUTER_MANAGEMENT_KEY,
    slug: env.WORKSHOP_SLUG,
    title: env.WORKSHOP_TITLE || env.WORKSHOP_SLUG || "Workshop",
    password: env.CLAIM_PASSWORD,
    maxKeys: Number(env.MAX_KEYS || 40),
    ttlHours: Number(env.KEY_TTL_HOURS || 6),
  };
}

function samePassword(given, expected) {
  const a = createHash("sha256").update(String(given || "")).digest();
  const b = createHash("sha256").update(String(expected || "")).digest();
  return timingSafeEqual(a, b);
}

// A missing workspace means setup hasn't run for this slug: say so instead of "something went wrong".
async function workspace(or, slug) {
  try {
    return await or.getWorkspace(slug);
  } catch (err) {
    if (err.status === 404) throw new ClaimError(503, "This claim page isn't set up yet.");
    throw err;
  }
}

export async function windowStatus(cfg = config()) {
  if (!cfg.managementKey || !cfg.slug) return { title: cfg.title, configured: false, open: false };
  const ws = await workspace(client(cfg.managementKey), cfg.slug);
  const until = openUntil(ws);
  return {
    title: cfg.title,
    configured: true,
    open: Boolean(until && until > new Date()),
    openUntil: until ? until.toISOString() : null,
  };
}

// One claim: check the password and the window, then mint a key for this person in the
// workshop's workspace. Claiming again under the same name replaces that person's key,
// so a student whose setup failed halfway can simply claim again.
export async function claim({ name, password }, cfg = config()) {
  const person = normalizePerson(name);
  if (!cfg.managementKey || !cfg.slug || !cfg.password) throw new ClaimError(503, "This claim page isn't set up yet.");
  if (!person || person.length > 60) throw new ClaimError(400, "Enter your name (up to 60 characters).");
  if (!samePassword(password, cfg.password)) throw new ClaimError(401, "That password isn't right. Check the slide.");

  const or = client(cfg.managementKey);
  const ws = await workspace(or, cfg.slug);
  const until = openUntil(ws);
  if (!until || until <= new Date()) throw new ClaimError(403, "Claiming is closed right now. Ask the instructor to open it.");

  const keys = await or.listKeys(ws.id);
  const ours = keys.map((k) => ({ k, parsed: parseKeyName(cfg.slug, k.name) })).filter((x) => x.parsed);
  const mine = ours.filter((x) => x.parsed.person.toLowerCase() === person.toLowerCase());

  if (!mine.length && ours.length >= cfg.maxKeys) {
    throw new ClaimError(403, "All the keys for this workshop have been claimed. Ask the instructor.");
  }

  const number = mine.length ? mine[0].parsed.number : Math.max(0, ...ours.map((x) => x.parsed.number)) + 1;
  for (const { k } of mine) await or.deleteKey(k.hash);

  const expires = new Date(Date.now() + cfg.ttlHours * 3600 * 1000);
  const created = await or.createKey({
    name: keyName(cfg.slug, number, person),
    workspace_id: ws.id,
    expires_at: isoSeconds(expires),
  });

  return {
    key: created.key,
    number,
    replaced: mine.length > 0,
    expiresAt: expires.toISOString(),
  };
}
