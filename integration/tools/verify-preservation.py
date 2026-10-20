"""Check the merge against the recorded source bytes, without needing either source repo."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parents[2]
read = lambda name: json.loads((root / "integration" / name).read_text())
digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
baseline = read("foundation-manifest.json")
overrides = read("foundation-overrides.json")
unchanged = 0
for entry in baseline["files"]:
    target = root / entry["path"]
    assert target.is_file(), f"Missing foundation file: {entry['path']}"
    same = digest(target) == entry["sha256"]
    if entry["path"] not in overrides:
        assert same, f"Unexpected foundation change: {entry['path']}"
        unchanged += 1
    else:
        assert not same, f"Obsolete override: {entry['path']}"

poetry = read("poetry-manifest.json")
ui_edits = read("poetry-overrides.json")
exact_poetry = 0
for entry in poetry["files"]:
    target = root / entry["destination"]
    assert target.is_file(), f"Missing Poetry Gem file: {entry['destination']}"
    current = digest(target)
    if entry["destination"] not in ui_edits:
        assert current == entry["import_sha256"], f"Unexpected imported-file change: {entry['destination']}"
    if current == entry["source_sha256"]:
        exact_poetry += 1

print(f"Foundation: {unchanged}/{len(baseline['files'])} files remain byte-for-byte identical; {len(overrides)} documented edits; no deletions.")
print(f"Poetry Gem: {len(poetry['files'])} imported files; {exact_poetry} byte-identical; other changes are namespace rewrites and documented UI/copy adaptations.")
