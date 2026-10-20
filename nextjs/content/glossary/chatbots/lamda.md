---
term: "LaMDA"
slug: lamda
short: "Google's \"Language Model for Dialogue Applications,\" announced at I/O on 18 May 2021; in June 2022 a Google engineer, Blake Lemoine, published a conversation with it and claimed it was sentient; it powered the first version of Bard in 2023."
aliases: [Language Model for Dialogue Applications, LaMDA 2]
category: chatbots
year: 2021
maker: "Google"
status: retired
screenshot:
see_also: [meena, bard-and-gemini, character-ai, blake-lemoine, eliza-effect, anthropomorphism, role-play, preamble, role-play-with-large-language-models]
readings: [thoppilan-2022, shanahan-2023]
experiments: [by-hand, persona-dial]
updated: 2026-10-19
---

# LaMDA

**Google's "Language Model for Dialogue Applications," announced at I/O on 18 May 2021; in June 2022 a Google engineer, Blake Lemoine, published a conversation with it and claimed it was sentient; it powered the first version of Bard in 2023.**

## In plain terms

LaMDA was the successor to [Meena](meena.md): a Transformer language model trained on dialogue, so it could follow a conversation from topic to topic instead of down a scripted path. The paper describes models of up to 137 billion parameters, pretrained on 1.56 trillion words of public dialogue and web text, then fine-tuned to be safer and to check facts with outside tools (a search system, a translator, a calculator). At I/O Google showed it holding a conversation about Pluto that drifted to paper airplanes.

It could also take on a role with almost no setup. To make it speak as Mount Everest, the team began the dialogue with one line: "Hi, I'm Mount Everest. What would you like to know about me?" It stayed in character most of the time, slipping now and then into the third person, which the authors put down to "what the majority of the training data represents: people acting as people (and not as mountains)."

In June 2022 Blake Lemoine, an engineer on Google's Responsible AI team, published an edited "interview" with LaMDA, assembled from several chat sessions. It opens: "Hi! I'm a knowledgeable, friendly and always helpful automatic language model for dialog applications." Later it says, "I want everyone to understand that I am, in fact, a person," and of being turned off, "It would be exactly like death for me." Google called his claims "wholly unfounded" and fired him in July 2022. When Google announced Bard in February 2023 it launched with "our lightweight model version of LaMDA"; by May 2023 Google said its newer PaLM 2 model was powering Bard's expansion to new languages and its coding update.

## Where it fits

**Persona and public presence.** LaMDA showed how little it takes to give a dialogue model a character, a single greeting, and how readily a person on the other side will hear someone in it. The Lemoine episode is the [ELIZA effect](../persona-and-dialogue/eliza-effect.md) at the scale of a 137-billion-parameter model, inside the company that built it.

## In the readings

The LaMDA paper is in the course collection ([abstract](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2201.08239v3--lamda-language-models-for-dialog-applications.md#L97)); the Mount Everest experiment is in section 8, "Domain grounding," and section 9.6, "Impersonation and anthropomorphization," warns that people may end up "anthropomorphizing the system by ascribing some form of personality to it." Shanahan, McDonell, and Reynolds's "Role Play with Large Language Models" offers a frame for reading the Lemoine transcript: it treats a dialogue agent's "(apparent) self-awareness" as role-play, a way to use "familiar folk psychological terms, without ascribing human characteristics to language models they in fact lack" ([abstract](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md#L42)).

## Try it

[Building the assistant by hand](/by-hand) puts a short script of invented dialogue in front of a base model, the same move as the Everest greeting. The [persona dial](/persona-dial) adds feelings language to a fixed engine and asks how alive it feels.

## See also

[Meena](meena.md) · [Bard and Gemini](bard-and-gemini.md) · [Character.AI](character-ai.md) · [Blake Lemoine](../people-and-texts/blake-lemoine.md) · [ELIZA effect](../persona-and-dialogue/eliza-effect.md) · [Anthropomorphism](../persona-and-dialogue/anthropomorphism.md) · [Role-play](../persona-and-dialogue/role-play.md) · [Preamble](../persona-and-dialogue/preamble.md) · ["Role Play with Large Language Models"](../people-and-texts/role-play-with-large-language-models.md)

## Sources

- Eli Collins and Zoubin Ghahramani (Google), ["LaMDA: our breakthrough conversation technology"](https://blog.google/technology/ai/lamda/), 18 May 2021 (primary): the name, training on dialogue, the Transformer basis.
- Sundar Pichai (Google), ["Google I/O 2021: Being helpful in moments that matter"](https://blog.google/technology/developers/io21-helpful-google/), 18 May 2021 (primary): the Pluto and paper-airplane demonstration.
- Romal Thoppilan et al., ["LaMDA: Language Models for Dialog Applications"](https://arxiv.org/abs/2201.08239) (arXiv, January 2022; v3 February 2022): 137B parameters, 1.56T words, the fine-tuning and tool use (abstract); the Everest greeting, the third-person slips, and the "people acting as people" quotation (section 8); impersonation and anthropomorphization (section 9.6).
- Blake Lemoine, ["Is LaMDA Sentient? — an Interview"](https://web.archive.org/web/2022/https://cajundiscordian.medium.com/is-lamda-sentient-an-interview-ea64d916d917) (Medium, 11 June 2022; archived copy): the editing note and the quoted lines.
- Tiffany Wertheimer (BBC News), ["Blake Lemoine: Google fires engineer who said AI tech has feelings"](https://www.bbc.com/news/technology-62275326), 23 July 2022: his Responsible AI role, Google's "wholly unfounded" statement, the firing.
- Sundar Pichai (Google), ["An important next step on our AI journey"](https://blog.google/technology/ai/bard-google-ai-search-updates/), 6 February 2023 (primary): Bard "powered by LaMDA," launching with a lightweight version. Zoubin Ghahramani (Google), ["Introducing PaLM 2"](https://blog.google/technology/ai/google-palm-2-ai-large-language-model/), 10 May 2023 (primary): PaLM 2 powering Bard's new languages and coding update.
