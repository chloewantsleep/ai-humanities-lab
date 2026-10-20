// OpenRouter's management API, as the workshop needs it. Shared by the claim app and the CLI
// (cli/workshop-keys.mjs), so both read the same ledger: the workshop is a workspace, its
// pooled cap is the workspace's lifetime budget, every student key lives in that workspace,
// and the claim window is a line in the workspace's description. No other database.

// OPENROUTER_API_URL exists only so tests/mock-openrouter.mjs can stand in for OpenRouter.
const API = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1";

export class OpenRouterError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function client(managementKey) {
  if (!managementKey) throw new Error("OPENROUTER_MANAGEMENT_KEY is not set");

  async function call(method, path, body) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${managementKey}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {}
    if (!res.ok) {
      throw new OpenRouterError(res.status, json?.error?.message || text || res.statusText);
    }
    return json;
  }

  return {
    getWorkspace: (slug) => call("GET", `/workspaces/${encodeURIComponent(slug)}`).then((r) => r.data),
    createWorkspace: (body) => call("POST", "/workspaces", body).then((r) => r.data),
    updateWorkspace: (slug, body) => call("PATCH", `/workspaces/${encodeURIComponent(slug)}`, body).then((r) => r.data),
    deleteWorkspace: (slug) => call("DELETE", `/workspaces/${encodeURIComponent(slug)}`),
    listBudgets: (slug) => call("GET", `/workspaces/${encodeURIComponent(slug)}/budgets`),
    setLifetimeBudget: (slug, limitUsd) =>
      call("PUT", `/workspaces/${encodeURIComponent(slug)}/budgets/lifetime`, { limit_usd: limitUsd }),

    async listKeys(workspaceId) {
      const keys = [];
      for (let offset = 0; ; offset += 100) {
        // Expired keys are left out by default; status and teardown need them too.
        const qs = new URLSearchParams({ workspace_id: workspaceId, include_disabled: "true", include_expired: "true", offset: String(offset) });
        const page = (await call("GET", `/keys?${qs}`)).data || [];
        // The filter is documented; this keeps us honest if it is ever ignored.
        keys.push(...page.filter((k) => !k.workspace_id || k.workspace_id === workspaceId));
        if (page.length < 100) return keys;
      }
    },
    createKey: (body) => call("POST", "/keys", body),
    deleteKey: (hash) => call("DELETE", `/keys/${hash}`),
  };
}

// The claim window lives in the workspace description as one line: "claims-open-until: <ISO>".
const WINDOW_LINE = /^claims-open-until: (\S+)$/m;

export function openUntil(workspace) {
  const m = (workspace?.description || "").match(WINDOW_LINE);
  const t = m ? Date.parse(m[1]) : NaN;
  return Number.isNaN(t) ? null : new Date(t);
}

export function withWindow(description, until) {
  const rest = (description || "").replace(WINDOW_LINE, "").trim();
  const line = until ? `claims-open-until: ${until.toISOString()}` : "";
  return [rest, line].filter(Boolean).join("\n");
}

// Key names: "<slug> #07 Ada Lovelace". The number is the claim order; the name is who claimed it.
export function keyName(slug, number, person) {
  return `${slug} #${String(number).padStart(2, "0")}${person ? ` ${person}` : ""}`;
}

export function parseKeyName(slug, name) {
  const m = (name || "").match(/^(\S+) #(\d+)(?: (.+))?$/);
  if (!m || m[1] !== slug) return null;
  return { number: Number(m[2]), person: m[3] || "" };
}

export function normalizePerson(s) {
  return (s || "").normalize("NFKC").replace(/\s+/g, " ").trim();
}

// OpenRouter wants seconds precision and a Z.
export function isoSeconds(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}
