## Builder consolidation — 20 October 2026

See `../HANDOFF.md` for the current product structure, editorial rationale, and restoration priorities. The 2023 studio now includes the Ensemble submission form and editable instructions for testing. The separate student builder redirects to `/#build-a-bot`. The timeline uses its own palette and document layout instead of the former cream frame. Main navigation removes Experiments and labels History as Interfaces.

Validation: production build and TypeScript passed; 12 Poetry Gem/submission checks passed. Live browser verification remains unavailable in this environment. The four inherited filesystem tracing warnings remain.

---

## Timeline revision — 20 October 2026

The user requested a shorter timeline and explicitly authorized editing the foundation text. This supersedes the original near-verbatim constraint for the documented files.

- Six sections, with approximately 530 words of body prose. ELIZA and GPT-2 retain their live demos. Markov receives a brief explanation in the GPT-2 section.
- The native React Poetry Gem studio now appears inside the 2023 section, before reasoning models and agents. It uses the same Studio component as `/poetry-gem`.
- Removed viewport-height spacing and the shared sticky demo panel. Each demo remains beside its instructions, retaining state while the reader scrolls.
- Simplified visible timeline, studio, and custom-builder copy using ASD-STE100 principles. This is not a formal compliance claim. Literary source texts and model prompts remain unchanged.
- Seven older chapters remain on disk with `hidden: true`.
- Build and TypeScript passed. Two timeline tests and ten Poetry Gem integration tests passed. Four inherited filesystem-tracing build warnings remain.
- Live visual checks were unavailable: this session cannot reach the local server and exposes no browser connections.

`foundation-overrides.json` and `poetry-overrides.json` record the deliberate changes. Run `python3 integration/tools/verify-preservation.py` for the current preservation counts. The original integration report below describes the earlier state.

---

# ENG 298AI integration, October 20, 2026

This project starts with all 689 tracked files from `mk-chatbot-experiments` at
`55c9ae2fa911bf94770d0d7d5d37312819bbeed1`. Every file was copied and SHA-256 checked
before editing. Both original repositories were left untouched. Source task boards
and reports are retained as provenance for the original projects.

The Poetry Gem import comes from `eng-298ai-mw` at
`082a6d56d0db4274c7399753236d3ac0c6a36466`. Its 147 runtime files include all 86 content
files and all 29 tracked costume asset files. Texts, prompts, stored embeddings, and
artwork are byte-identical. Ignored keys, dependencies, caches, and optional local
image-survey outputs were excluded.

## What changed

The original scrolling story now renders at `/`, and remains available at `/story`.
Its prose, chapter ordering, timeline logic, and existing demonstrations are unchanged.
The former home page is retained at `/overview`.

A full working Poetry Gem builder follows the timeline. Chapter 9 has a jump link to
`#build-a-bot`. The builder can also be opened at `/poetry-gem`, with its library,
prompts, reading packs, vectors, atelier, and exquisite corpse beneath that route.
Its APIs use `/api/poetry-gem/{chat,search,vectors}`, leaving the original APIs intact.

The cream palette is scoped to a CSS module, sharing Inter and the site's red accent
family. Costume artwork, serif poetry, and the original inspection panels remain.
The embedded studio scrolls its own conversation rather than moving the whole page
when a response arrives. On smaller screens the controls and conversation stack.

The added interpretation moves from assembling a character to inspecting instructions,
knowledge, and tool calls. It does not add new bankruptcy, retirement, or product-status
claims. Existing historical prose was preserved and still needs the later editorial
review. The requested new opening and ending have not been written.

## Preservation audit

- `foundation-manifest.json`: source commit and hashes for all 689 foundation files.
- `foundation-overrides.json`: the six intentional changes to foundation files.
- `poetry-manifest.json`: every imported file's source, destination, original hash,
  and hash after mechanical namespace rewrites.
- `tools/verify-preservation.py`: verifies that no other source files changed or vanished.

Current result: **683 of 689 foundation files remain byte-identical**, with six
documented edits and no deletions. **127 of 147 Poetry Gem files remain byte-identical**;
the rest have namespace rewrites and three UI adaptations (page loader, embedded
Studio behavior, and responsive Studio CSS). New integration components and tooling
are additions.

Every original dependency resolution is preserved. The additional SDK dependency
versions and integrity hashes came from Poetry Gem's lockfile. A frozen install
subsequently succeeded against the package registry.

## Run and verify

Use Node 22 or newer, with pnpm:

```sh
cd nextjs
pnpm install --frozen-lockfile
pnpm dev --port 3001
```

On this machine, the global pnpm executable launches scripts with an older Node
runtime even inside `fnm exec`. This direct invocation uses the installed Next CLI
with Node 22:

```sh
cd nextjs
fnm exec --using=22.13.0 node node_modules/next/dist/bin/next dev --port 3001
```

From the repository root:

```sh
python3 integration/tools/verify-preservation.py
node integration/tools/check-poetry.cjs
```

The second command transpiles the imported server modules into `.next/integration-check`
and tests the real handlers without starting a server. Provider responses are simulated;
it makes no paid model requests.

## Validation and remaining review

- Exact frozen dependency installation: passed.
- Production Next build, including TypeScript and route generation: passed.
- Ten Poetry Gem integration tests: passed. They cover all reading packs, embedding
  fingerprint alignment, keyword search, stored-vector search, invalid requests,
  missing credentials, and all four chat delivery modes with streaming traces.
- Original test suite: **60 passed, 1 failed**. `content/experiments/get-ready.md`
  already has duplicate `group:` fields in the source. The content reader cannot parse
  that frontmatter and falls back to a route rejected by `tests/content.test.mjs`.
  Both files remain byte-identical to the source; repair is deferred to the next phase.
- Production build reports four existing filesystem-tracing warnings in `lib/bots.mjs`.
  That source file remains unchanged.
- Live preview and desktop/mobile visual QA: pending. Starting a server on both
  `0.0.0.0:3001` and `127.0.0.1:3001` was denied with `EPERM` in this session.
- Live paid chat and embedding requests: not run. No source `.env.local` or credentials
  were copied. The studio retains its browser key field; server configuration uses
  the existing environment-variable mechanism.

The original class-access proxy is also preserved. Local development works without a
class password; production requires `CLASS_PASSWORD`. Nothing has been deployed.

Once preview access is available, inspect `/`, `/#build-a-bot`, `/poetry-gem`,
`/poetry-gem/library`, `/poetry-gem/packs/frankenstein`, `/poetry-gem/vectors`, and
`/poetry-gem/doll/corpse` at desktop and phone widths. Confirm the page stays at the
top on initial load, costume controls update the builder, trace panels expand, links
remain within the new namespace, and the cream styles do not leak into the timeline.
