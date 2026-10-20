@AGENTS.md

# mk-chatbot-experiments: the app

A Next app that renders the Markdown in `content/` (its README is the home page; `content/a/b.md` is `/a/b`) (`lib/content.mjs`), copied 2026-10-19 from `tdm155ai/tdm155ai-week-6` and stripped of that week's routes. Plain JavaScript and the app's own CSS (`app/globals.css`); forced dark; a light `/print` renders any page.

- **Experiments:** one route per experiment (`app/<route>/page.jsx`), each wrapped in `app/components/ExperimentPage.jsx`, which reads `content/experiments/<name>.md` (frontmatter `route:` and `status:`). The home page lists them as cards (`getExperiments`). A route's own styles go in a CSS file beside it.
- **History:** `content/history/` is one page per section of the 2026-10-19 screenshot set; the images are in `content/history/_images/` (folders starting with `_` are not listed as pages). Relative image paths in Markdown are served by `app/context-media/`.
- **Who is building what:** `../_context/orchestration/README.md` (the board; briefs in `tasks/`, reports in `reports/`).
