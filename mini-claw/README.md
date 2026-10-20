# mini-claw's workspace

The folder the mini-claw agent (`/mini-claw` in the app) works in. Its one tool can list and read anything here and write only inside it, and nothing outside it.

| Path | What | The agent may |
| --- | --- | --- |
| `memory.md` | What it has learned across runs, read at the start of every run | read, append one line at a time |
| `skills/*.md` | Instructions it can choose to load: a `name` and `description` in the frontmatter, the steps below | read |
| `notes/` | Where it writes (gitignored, so demo notes stay on this laptop) | read, write, append |
| `README.md` | This file | read |

Runs read and append a gitignored `.working-memory.md`, seeded from the tracked `memory.md` on first use. The model still addresses it as `memory.md`. Use **Reset memory** on `/mini-claw` to restore the seed without changing notes. The tracked file is never modified by demo runs. This is one shared local working copy, not per-user storage.
