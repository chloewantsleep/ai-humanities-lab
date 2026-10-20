---
title: Experiments
description: "Every page on the site a student might use, in groups: today's path first, then building your bot, the machines before the assistant, what happens under the hood, the readings, where agents are going, and works in progress."
---

Each card is one page, with the route that runs it. Pages that aren't built yet are listed last in their group and say so. A page's notes are its document in `nextjs/content/experiments/`, whose frontmatter gives `route:` (the app route), `status:` (idea, building, working), `group:` (the section below), and `order:` (its place in the section). The groups and their order are set in `nextjs/lib/content.mjs`; a new document with no `group:` lands in the section that file lists for its name, or under works in progress.
