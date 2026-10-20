"""Usage: python3 condense-transcript.py <session.jsonl> <out.md>
Condense a Claude Code or Codex session .jsonl into readable Markdown: user and assistant text in full, tool calls as one line each, tool output dropped (errors kept, truncated)."""
import sys, json, re
src, out = sys.argv[1], sys.argv[2]
lines = []
def add(s): lines.append(s)
def short(s, n=240): s = re.sub(r"\s+", " ", str(s)); return s if len(s) <= n else s[:n] + "…"
for raw in open(src):
    try: d = json.loads(raw)
    except Exception: continue
    ts = (d.get("timestamp") or "")[:19]
    if d.get("type") in ("user", "assistant") and "message" in d:   # Claude Code
        c = d["message"].get("content")
        role = d["type"].upper()
        if isinstance(c, str):
            if c.strip(): add(f"\n### {role} {ts}\n{c.strip()}")
            continue
        for x in c or []:
            t = x.get("type")
            if t == "text" and x["text"].strip(): add(f"\n### {role} {ts}\n{x['text'].strip()}")
            elif t == "tool_use":
                i = x.get("input", {})
                arg = i.get("command") or i.get("file_path") or i.get("pattern") or i.get("url") or i.get("prompt") or json.dumps(i)
                add(f"- tool {x['name']}: {short(arg)}")
            elif t == "tool_result" and x.get("is_error"):
                cc = x.get("content"); cc = cc if isinstance(cc, str) else json.dumps(cc)
                add(f"- tool ERROR: {short(cc, 300)}")
        continue
    p = d.get("payload")
    if not isinstance(p, dict): continue
    pt = p.get("type")
    if d.get("type") == "response_item" and pt == "message":   # Codex
        txt = " ".join(c.get("text", "") for c in p.get("content", []) if isinstance(c, dict)).strip()
        if not txt or "<environment_context>" in txt or txt.startswith("# AGENTS.md instructions"): continue
        add(f"\n### {p.get('role','').upper()} {ts}\n{txt}")
    elif d.get("type") == "response_item" and pt in ("function_call", "custom_tool_call", "local_shell_call"):
        a = p.get("arguments") or p.get("input") or p.get("action") or ""
        try:
            j = json.loads(a) if isinstance(a, str) else a
            a = j.get("cmd") or j.get("command") or a if isinstance(j, dict) else a
        except Exception: pass
        add(f"- tool {p.get('name', pt)}: {short(a)}")
open(out, "w").write("\n".join(lines))
print(out, sum(len(l) for l in lines) // 1024, "KB")
