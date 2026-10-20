---
term: "BlenderBot"
slug: blenderbot
short: "Facebook AI's open-source chatbot of April 2020, trained to blend personality, knowledge, and empathy; its third version became a public US demo in August 2022 and was soon reported saying false and offensive things."
aliases: [Blender, BlenderBot 2, BlenderBot 3]
category: chatbots
year: 2020
maker: "Facebook AI Research (now Meta AI)"
status: retired
screenshot:
see_also: [meena, tay, meta-ai, persona, open-weights, hallucination, memory]
readings: []
experiments: []
updated: 2026-10-19
---

# BlenderBot

**Facebook AI's open-source chatbot of April 2020, trained to blend personality, knowledge, and empathy; its third version became a public US demo in August 2022 and was soon reported saying false and offensive things.**

## In plain terms

On 29 April 2020 Facebook AI released BlenderBot, at 9.4 billion parameters "the largest-ever open-domain chatbot," with the model, code, and evaluation setup published so other researchers could reproduce and extend the work. The name comes from its fine-tuning data, Blended Skill Talk, which combined three earlier tasks: engaging use of personality (PersonaChat), engaging use of knowledge (Wizard of Wikipedia), and displaying empathy (Empathetic Dialogues). In side-by-side tests, 67% of evaluators said it sounded more human than Google's [Meena](meena.md). The team listed the faults that remained: contradiction, repetition, and knowledge it would "hallucinate."

BlenderBot 3, announced on 5 August 2022, was built on Meta's 175-billion-parameter OPT model, could search the internet, kept long-term memories about the user and about its own persona, and invited thumbs-up and thumbs-down feedback to learn from. Meta put it on a public website for adults in the US, with a warning that it could make untrue or offensive statements. Within days reporters had it claiming that Donald Trump was still president and calling Mark Zuckerberg "too creepy and manipulative."

## Where it fits

**Persona and public presence.** BlenderBot treated personality as one skill among several to be trained from example conversations, and published everything so others could build on it. Its 2022 demo, three months before [ChatGPT](chatgpt.md), showed the same trouble Tay had: put a chatbot in public and people will find what it should not say.

## See also

[Meena](meena.md) · [Tay](tay.md) · [Meta AI](meta-ai.md) · [Persona](../persona-and-dialogue/persona.md) · [Open weights](../models-and-training/open-weights.md) · [Hallucination](../persona-and-dialogue/hallucination.md) · [Memory](../interfaces-and-agents/memory.md)

## Sources

- Facebook AI, ["A state-of-the-art open source chatbot"](https://ai.meta.com/blog/state-of-the-art-open-source-chatbot/), 29 April 2020 (primary): 9.4 billion parameters, the open release, Blended Skill Talk and its three sources, the 67% comparison with Meena, and the listed faults.
- Meta AI, ["BlenderBot 3: A 175B parameter, publicly available chatbot that improves its skills and safety over time"](https://ai.meta.com/blog/blenderbot-3-a-175b-parameter-publicly-available-chatbot-that-improves-its-skills-and-safety-over-time/), 5 August 2022, updated 9 August (primary): OPT-175B, internet search, long-term memory, feedback, the US-only adult demo, and its warning.
- Malwarebytes Labs, ["Now it's BlenderBot's turn to make shocking, inappropriate, and untrue remarks"](https://www.malwarebytes.com/blog/news/2022/08/its-now-blenderbots-turn-to-make-shocking-inappropriate-and-untrue-remarks), 10 August 2022: the 2020 election claim (first reported by Mashable) and the Zuckerberg quotation (reported by Bloomberg).
- Status: blenderbot.ai, the demo's address, did not resolve when checked on 2026-10-19. When the demo was taken down was not found (verify).
