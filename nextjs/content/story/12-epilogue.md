---
title: "After the Gem: rules around the odds"
chapter: 11
years: "2026 →"
description: "The products move away from Gems and GPTs and toward harnesses, loops, and skills: a probabilistic model channeled through deterministic structure. ELIZA and GPT-2, combined. For discussion."
year: 2026
label: "GPTs retire; Gems become skills"
---

# After the Gem: rules around the odds

The Gem you built is already a period piece. OpenAI plans to retire custom GPTs on 11 December 2026, and Google is moving Gems into "skills" ([OpenAI FAQ](https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq); [Google](https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/about-the-transition-to-skills)). The industry's attention has moved from the character to the machinery around it: harnesses, loops, tools, skills.

```panel
type: image
src: ../history/_images/03-gpt-store-gallery-with-retirement-banner.png
alt: "The GPT Store's Featured gallery with a banner about GPTs retiring on December 11"
caption: "The GPT Store in October 2026, with a banner announcing that GPTs will retire on 11 December."
cite: "Screenshot 19 Oct 2026; [OpenAI retirement FAQ](https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq)"
```

A Gem is a costume: instructions, a few texts, a name. A skill is closer to a procedure: instructions the system loads only when a task calls for them, often with scripts and files attached. An agent harness is closer still to a machine: a loop that runs the model, checks what it produced, runs a tool, and feeds the result back. The character hasn't vanished. It has been put to work inside a structure.

```panel
type: compare
heading: "Two lineages, and what the harness takes from each"
columns: ["ELIZA, 1966", "GPT-2, 2019", "A harness, 2026"]
rows:
  - ["How it decides", "Rules written by a person", "Odds learned from text", "The model proposes; code decides what runs"]
  - ["Same input twice", "Same output", "Different output", "Different drafts, the same checks"]
  - ["Strength", "Inspectable, predictable", "Fluent in any voice", "Fluent, inside steps you can inspect"]
  - ["Weakness", "Brittle outside its script", "No one answering; no anchor", "Only as good as its checks and permissions"]
  - ["Where the character lives", "The script (data)", "Nowhere in particular", "Files the loop reads: instructions, memory, soul"]
```

Look back at the two machines you used first. ELIZA is symbolic: a person wrote rules, and the same sentence always gets the same rule. You can see why it said what it said, and it breaks the moment you leave the script. GPT-2 is probabilistic: no rules, only odds, so it is fluent in any voice and anchored to none.

A harness combines them. The probabilistic model writes the drafts, the plans, and the code. Deterministic structure around it decides what happens next: a loop with a fixed shape, tools whose results are facts (the file exists; the test passed; the search returned these three pages), schemas the output must fit, and permissions that say what it may touch. The rules ELIZA had are back, written by people, but now they surround the odds instead of replacing them. That is roughly what "agentic" means in 2026, and it is why the products are moving from Gems to loops.

```panel
type: title
text: "Discussion: where is the speaker now?"
```

Questions to take into discussion:

- In your Gem, which lines of the poem came from the instructions, which from the reading pack, and which from the trained assistant underneath? How could you tell?
- The HHH prompt, a Gem's instructions, and OpenClaw's `SOUL.md` are all documents describing a character. What changes when the character can rewrite its own document?
- ELIZA's rules hid a lack. A harness's rules check a model's work. Are these the same kind of rule?
- If the future is a harness, not a character, does the humanities question "who is speaking?" lose its force, or become more pressing?
- Socrates distrusted writing because it could not answer back, and wrote dialogues anyway. What is the right way to use a machine that writes dialogue, in a course about dialogue?
