---
name: take-a-note
description: Use when the user asks you to write something down, draft a note, or save work to a file.
---

# Take a note

1. List `notes/` first, so you don't replace a note that already exists.
2. Choose a short file name in `notes/`: lowercase words joined by hyphens, ending in `.md` (for example `notes/frankenstein-chapter-10.md`).
3. Start the note with a `# Title` line, then the date, then the body in plain Markdown. Keep the user's words where they gave you words; mark anything you added as yours.
4. Save it with action `write`, then tell the user the path.
