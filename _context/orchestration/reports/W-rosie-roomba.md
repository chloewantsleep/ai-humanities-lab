---
task: W
thread_id: 5a37ec19-b531-4780-b7f0-44e89d96cae8
agent: Claude Code (Opus 5.5)
started_in: /Users/mk/Development/mk-27/apps/the-notebook
resume: "cd /Users/mk/Development/mk-27/apps/the-notebook && claude --resume 5a37ec19-b531-4780-b7f0-44e89d96cae8"
status: working (prototype); not yet tried in a real deck, on a projector, or with a clicker
---

# W. Rosie and Roomba: report

## What I built

- **`nextjs/app/components/RosieRoomba.jsx`** and **`RosieRoomba.css`** beside it: a self-contained client component (React only, no new dependencies, every class prefixed `rr-`, colors falling back to fixed values so it works in an app without this site's tokens). Six beats, each with Marlon's words as the caption:
  1. `rosie`: a humanlike robot maid (drawn in SVG, side view, at eye level) walks the room pushing a vacuum; the Roomba panel is a "?".
  2. `roomba`: a disc crosses a floor plan (top view) with sofa, table, and plant, turning a random amount when it bumps; the cleaned floor spreads behind it, with a live "floor covered N%".
  3. `rebel`: Rosie stops, crosses her arms, drops the vacuum: "Why am I the one who vacuums?" The Roomba keeps going (its coverage carries over from beat 2).
  4. `chat`: a chat window with a Rosie persona who asks for the chapter to be pasted, praises it, asks for the next one; a context meter fills and ends at "start a new chat?".
  5. `agent`: beside it, the same disc works through a 4×3 grid of files (`ch01.md`…`refs.bib`), scanning and checking each, with no conversation; each pass takes one of Marlon's three example tasks (check citations, proofread, translate into French).
  6. `summary`: a 2×2, the floor above and the text below, the Roomba column outlined as "working on the ground truth", captioned with the August 8 flat-characters line.
- Props: `beats`, `compact`, `captions`, `keys` (`"focus"` / `"window"` / `"none"`), `step` + `onStepChange` (controlled) or `defaultStep`, `controls`, `paused`, `speed`, `className`. Also exports `BEATS` and `BEAT_ORDER`.
- Stepping: click the pictures, ← → ↑ ↓, Space, PageUp/PageDown (what clickers send); dots jump to a beat. **Present** puts the component itself in fullscreen (the button becomes **Exit**).
- Reduced motion: nothing animates; each panel shows a chosen still moment mid-task.
- **`nextjs/app/rosie-roomba/page.jsx`** (+ `rosie-roomba.css`): `/rosie-roomba`, in `ExperimentPage`, with the component full size and a "Use it in your own presentation" section: the import line, the props, and a live example of `<RosieRoomba beats={["chat", "agent"]} compact />` inside a 16:9 slide frame.
- **`nextjs/content/experiments/rosie-roomba.md`**: `status: working`, `order: 22`. Marlon's two dictation passages quoted exactly, what was built, how to use it, a "What Claude added (not Marlon's framing)" list, open questions, and "How this was made".

## How to try it

http://localhost:3000/rosie-roomba — click the pictures (or click once, then use the arrow keys) to step through the six beats; press **Present** for fullscreen. Scroll down for the slide-sized example. `/experiments/rosie-roomba` redirects there; `/print/experiments/rosie-roomba` prints the notes.

## Commits

- `ea83ff6` the first working version (component, route, document).
- The second commit (this report, the Exit label, unique SVG ids, the slide example, the document set to `working`): see `git log -- _context/orchestration/reports/W-rosie-roomba.md`.

## What I couldn't do or didn't check

- **Tested in headless Chromium only** (a Playwright script in my scratchpad, because the Playwright MCP browser was held by another agent): all six beats screenshotted, arrow keys and PageDown, the Roomba's coverage and the chat carrying over between beats of the same scene, the compact slide, fullscreen and the Exit label, a 390-px phone width (no horizontal overflow), reduced motion, no console errors. `pnpm test` passes (25). Not checked: Safari or Firefox, a projector, a real clicker, or dropping it into one of Marlon's actual decks.
- The dev server on :3000 was down when I started and came back on its own; I didn't start one.
- Rosie's thought bubble, the chat dialogue, and the context-meter percentages are invented for the illustration (labelled as mine in the document).

## For other tasks

- **V (session path and QA):** `/rosie-roomba` belongs in the "where agents are going" part of the session. It was built for a laptop at about 1400 px; at narrower widths the panels stack.
- **N2 (`/agents` explainer), N8 (soul-file essay):** the component can be imported with `beats={["chat", "agent"]}` or `["summary"]`; `BEATS` is exported if a page wants the quotes.
- **K / any public release:** the figures are original SVG drawings; no Jetsons or iRobot artwork is used.
- **Kits:** if Marlon uses this in another app, it is a candidate for `ll-kits` once copied forward twice (the workbook's kit rule).

## Marlon's words

Nothing said in this thread beyond the task prompt. From the brief and planning note (2026-10-20): "make the Rosie/Roomba comparison a page and an always-available, reusable React component that Marlon can add to any presentation."

## Decisions and open questions

- **Decided:** Rosie is drawn at eye level and the Roomba from above (the view of a person vs. the view of the task); the agent is drawn as the same disc as the Roomba. Both are my extensions, labelled as such in the document.
- **Decided:** within one scene (floor or text) the animation keeps running across beats, so stepping to "rebel" doesn't reset the Roomba.
- **Open:** is the chat persona a fair caricature? Claude projects and custom GPTs can take several files at once; a beat showing a chat with an attachment might keep the contrast honest. Marlon's point is about where the work lives.
- **Open:** a seventh beat for the flat-characters argument (allegory, single-function characters, keeping human roundness)?
- **Open:** order of the beats; whether to start with the text and reveal the vacuum second.
