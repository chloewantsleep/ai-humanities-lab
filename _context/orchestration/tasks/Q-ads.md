---
task: "Q"
title: "/ads: the major AI ads, in a player with the list beside it"
status: "not started"
owns: "`nextjs/app/ads/`, `nextjs/content/ads/`"
depends_on: "start now"
report: "../reports/Q-ads.md"
---
# Q. /ads: the major AI ads, in a player with the list beside it

Added 2026-10-19. Marlon: "I should have a page where I embed youtube clips of the major ai ads … a player with a list on one side." How the companies sold the assistant to the public is part of the history: the persona they advertise (a friend, a tutor, a coworker, an agent) is another layer of character, made by marketing rather than training.

**Content, one Markdown file per ad** in `nextjs/content/ads/` (so Marlon can add, cut, and annotate ads without touching code), plus a `README.md` introducing the collection. Frontmatter:

```yaml
---
title: "The Intelligence Age"
advertiser: OpenAI
product: ChatGPT
date: 2025-02-09            # first airing or upload
venue: "Super Bowl LIX"     # or "YouTube", "Olympics broadcast", "concept video"
youtube_id: "…"             # from the advertiser's own channel where possible
start: 0                    # optional, seconds
end:                        # optional
duration: "1:00"
agency: ""                  # if credited
channel: "OpenAI"           # the YouTube channel it is on, from oEmbed
persona: [tool, companion]  # what the ad says the AI is: tool, assistant, friend, companion, tutor, coworker, agent, oracle
see_also: [chatgpt]         # glossary slugs
sources: []                 # links confirming the date and venue
---
```

The body: what happens in the ad (two or three sentences), how it presents the AI (voice, face or no face, who it speaks to, what it promises), and how it was received if that's documented (Google's "Dear Sydney" was pulled after criticism; check). Write for the course: connect to the persona dial, the readings, and the glossary where it's honest to.

**Candidates to research and verify** (all from memory, none confirmed; drop what you can't source and add what's missing):
- **Before chatbots:** Apple's *Knowledge Navigator* concept video (1987), the assistant imagined as a bow-tied agent on screen; IBM Watson on *Jeopardy!* (2011) and the Watson ads that followed (the Bob Dylan spot, 2015).
- **Voice assistants:** Apple's Siri ads with celebrities (2011–12); Amazon's "Alexa Loses Her Voice" (Super Bowl 2018); Google Assistant spots.
- **The chatbot era:** Microsoft's Copilot Super Bowl ad (2024); OpenAI's first Super Bowl ad, "The Intelligence Age" (2025); Google Gemini's Super Bowl ads (2025, including the small-business spot and the cheese-statistic correction); Google's "Dear Sydney" Olympics ad (2024, pulled); Meta AI and Ray-Ban glasses ads (2025); Apple Intelligence ads (2024–25); OpenAI's ChatGPT campaign (2025); Anthropic's "Keep thinking" campaign (2025); the Super Bowl LX ads of February 2026, including Anthropic's spots about ads coming to AI chatbots, and any from OpenAI, Google, Meta, Amazon (Alexa+), or Microsoft that year; Salesforce's Agentforce ads (agents sold to business).
- **Companions:** Replika and Character.AI ads if any are on official channels; the Friend pendant's launch video (2024) and its subway campaign (2025, print, so a still with a source link rather than a video).

Verify each video before listing it: query YouTube's oEmbed endpoint (`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`) and record the channel name it returns; prefer the advertiser's own channel, then a broadcaster or news archive, and never a re-upload with altered audio. Record in each file how the date and venue were confirmed. If an ad exists but isn't embeddable, keep its file with a link and no `youtube_id`.

**The page:** `/ads` is a player with the list beside it (list on the left on wide screens, below the player on phones).
- The player is a `youtube-nocookie.com/embed/<id>` iframe, 16:9, with `start` and `end` applied, and the ad's title, advertiser, date, venue, and its Markdown notes beneath it.
- The list shows a thumbnail (`https://i.ytimg.com/vi/<id>/mqdefault.jpg`, a plain `<img>`), title, advertiser, and year for each ad, in chronological order, with the selected one highlighted. Filters by advertiser and by `persona`, and a sort toggle (date, advertiser).
- Each ad has its own address (`/ads/<slug>`) so Marlon can link one ad from a slide or the story; the arrow keys move up and down the list; the player doesn't autoplay on first load.
- A "class mode" toggle that hides the notes and enlarges the player for projection.
- Styles in `app/ads/ads.css`; add "Ads" to the header nav in `Chrome.jsx` (a one-line shared change; say so in your report). The `[...slug]` reader will also render `content/ads/` as plain pages; make sure `/ads` itself is the player, not the README.
- Tests: add a small test in `nextjs/tests/` that every ad file parses, has the required fields, and has a unique slug and a well-formed `youtube_id` (11 characters) when present.

Task M (`/story`) can embed an ad from here once it exists: say in your report how to reference one.

## When you finish

Write or update [`../reports/Q-ads.md`](../reports/Q-ads.md) (rule 8 in [the board](../README.md)), with your thread ID (rule 9), and commit it with your work, by path.
