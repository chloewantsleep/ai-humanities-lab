"""List one day's Claude Code and Codex sessions on this machine: start-end (UTC), id, size, task letters named in the first prompt, start directory, first prompt.
Usage: python3 list-sessions.py 2026-10-19   (times are UTC; Marlon's clock is US Eastern, UTC-4 in October)"""
import sys,json,glob,os,re
DATE = sys.argv[1] if len(sys.argv) > 1 else __import__("datetime").date.today().isoformat()
def first_ts(f):
    for line in open(f):
        try: d=json.loads(line)
        except: continue
        t=d.get("timestamp")
        if t: return t
    return ""
def last_ts(f):
    t=""
    for line in open(f):
        try: d=json.loads(line)
        except: continue
        t=d.get("timestamp") or t
    return t
def task_guess(text):
    m=re.findall(r"\b(?:task|Task)\s+([A-Z]\d?)\b",text)
    return ",".join(dict.fromkeys(m))[:30]
rows=[]
for f in glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl")):
    s=first_ts(f)
    if not s.startswith(DATE): 
        e=last_ts(f)
        if not e.startswith(DATE): continue
    text="";cwd=""
    for line in open(f):
        try: d=json.loads(line)
        except: continue
        cwd=cwd or d.get("cwd","")
        if d.get("type")=="user" and not text:
            c=d["message"]["content"]
            text=c if isinstance(c,str) else " ".join(x.get("text","") for x in c if isinstance(x,dict))
    rows.append(("claude",s,last_ts(f),os.path.basename(f)[:-6],cwd,os.path.getsize(f),task_guess(text),re.sub(r"\s+"," ",re.sub(r"<[^>]+>","",text))[:110]))
for f in glob.glob(os.path.expanduser(f"~/.codex/sessions/{DATE[:4]}/{DATE[5:7]}/*/*.jsonl")):
    s=first_ts(f); e=last_ts(f)
    if not (s.startswith(DATE) or e.startswith(DATE)): continue
    cwd="";text="";sid=""
    for line in open(f):
        try: d=json.loads(line)
        except: continue
        p=d.get("payload",{})
        if not isinstance(p,dict): continue
        if d.get("type")=="session_meta": sid=p.get("id",""); cwd=p.get("cwd","")
        if not text and p.get("type")=="message" and p.get("role")=="user":
            t=" ".join(c.get("text","") for c in p.get("content",[]) if isinstance(c,dict))
            if "<environment_context>" in t or "# AGENTS.md instructions" in t: continue
            text=t
    rows.append(("codex",s,e,sid or os.path.basename(f),cwd,os.path.getsize(f),task_guess(text),re.sub(r"\s+"," ",text)[:110]))
rows.sort(key=lambda r:r[1])
for r in rows:
    print(f"{r[0]:6} {r[1][11:16]}-{r[2][11:16]}Z {r[3]} {r[5]//1024:>6}K [{r[6]}] {r[4].replace('/Users/mk/Development/mk-27/','')} | {r[7]}")
