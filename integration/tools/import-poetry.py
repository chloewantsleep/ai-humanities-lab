"""Import tracked Poetry Gem files into isolated namespaces; record every source hash."""
from pathlib import Path
import hashlib, json, shutil, subprocess
source = Path('/Users/madeleinewoods/Development/eng-298ai-mw')
root = Path(__file__).resolve().parents[2]
files = subprocess.check_output(['git', 'ls-files', '-z', 'poetry-gem'], cwd=source).decode().split('\0')
records = []
for name in filter(None, files):
    rel = Path(name).relative_to('poetry-gem')
    if rel.parts[0] == 'app':
        if str(rel) in ['app/layout.tsx', 'app/globals.css', 'app/favicon.ico']: continue
        target = 'nextjs/app/api/poetry-gem/' + str(Path(*rel.parts[2:])) if rel.parts[1] == 'api' else 'nextjs/app/poetry-gem/' + str(Path(*rel.parts[1:]))
    elif rel.parts[0] == 'lib': target = 'nextjs/lib/poetry-gem/' + str(Path(*rel.parts[1:]))
    elif rel.parts[0] == 'content': target = 'nextjs/content/_poetry-gem/' + str(Path(*rel.parts[1:]))
    elif rel.parts[0] == 'public' and rel.parts[1] == 'doll': target = 'nextjs/public/poetry-gem/' + str(Path(*rel.parts[1:]))
    else: continue
    src, dst = source/name, root/target
    if dst.exists(): raise SystemExit(f'Refusing overwrite: {dst}')
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    if dst.suffix in ['.ts', '.tsx']:
        text = dst.read_text()
        text = text.replace('@/lib/', '@/lib/poetry-gem/').replace('@/app/', '@/app/poetry-gem/').replace('@/public/', '@/public/poetry-gem/')
        for url in ['/api/chat', '/api/search', '/api/vectors']:
            text = text.replace('"'+url, '"/api/poetry-gem'+url[4:]).replace('`'+url, '`/api/poetry-gem'+url[4:])
        for url in ['/library', '/prompts', '/packs', '/vectors', '/doll']:
            text = text.replace('"'+url, '"/poetry-gem'+url).replace('`'+url, '`/poetry-gem'+url)
        text = text.replace('href="/"', 'href="/poetry-gem"')
        text = text.replace('process.cwd(), "content"', '/* turbopackIgnore: true */ process.cwd(), "content", "_poetry-gem"')
        text = text.replace('process.cwd(), "public", "doll"', '/* turbopackIgnore: true */ process.cwd(), "public", "poetry-gem", "doll"')
        dst.write_text(text)
    records.append({'source': name, 'destination': target, 'source_sha256': hashlib.sha256(src.read_bytes()).hexdigest(), 'import_sha256': hashlib.sha256(dst.read_bytes()).hexdigest()})
(root/'integration/poetry-manifest.json').write_text(json.dumps({'source':str(source), 'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=source,text=True).strip(), 'files':records}, indent=2)+'\n')
print(f'Imported {len(records)} Poetry Gem files.')
