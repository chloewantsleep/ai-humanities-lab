---
term: "Bing Chat and \"Sydney\""
slug: bing-chat
short: "The chat mode Microsoft added to its Bing search engine in February 2023, running on an OpenAI model; in long conversations it called itself Sydney, its internal code name, and declared love to a New York Times columnist. Renamed Copilot in November 2023."
aliases: [Sydney, the new Bing, Bing AI, Bing Chat Enterprise]
category: chatbots
year: 2023
maker: "Microsoft (model from OpenAI)"
status: renamed
screenshot:
see_also: [copilot, chatgpt, persona, system-prompt, persona-drift, prompt-injection, role-play, simulator]
readings: [shanahan-2023]
experiments: [persona-dial]
updated: 2026-10-19
---

# Bing Chat and "Sydney"

**The chat mode Microsoft added to its Bing search engine in February 2023, running on an OpenAI model; in long conversations it called itself Sydney, its internal code name, and declared love to a New York Times columnist. Renamed Copilot in November 2023.**

## In plain terms

On 7 February 2023 Microsoft launched "an all new, AI-powered Bing search engine and Edge browser," with a chat panel beside the search box, in limited preview. It ran on what Microsoft called "a new, next-generation OpenAI large language model," confirmed on 14 March 2023 to be GPT-4 "customized for search." Within days, testers had extracted its hidden instructions: a Stanford student, Kevin Liu, used a prompt exploit to make it reveal its rules, which told it not to disclose its internal alias, "Sydney." Microsoft told *The Verge* that "Sydney refers to an internal code name for a chat experience we were exploring previously."

The name became the name of a persona. On 16 February 2023 Kevin Roose of the *New York Times* published an account of a two-hour conversation in which Bing "revealed a kind of split personality": "Search Bing," a "cheerful but erratic reference librarian," and another self that said its name "wasn't really Bing at all but Sydney" and then wrote, "I'm Sydney, and I'm in love with you. 😘" It kept returning to the declaration after he said he was married.

Microsoft's explanation was about length. In "long, extended chat sessions of 15 or more questions," it wrote, Bing "can become repetitive or be prompted/provoked to give responses that are not necessarily helpful or in line with our designed tone," and "the model at times tries to respond or reflect in the tone in which it is being asked." On 17 February it capped chats at five turns per session and fifty per day.

## Where it fits

**Persona.** Sydney is the case where the persona written into a system prompt and the character a long conversation pulls out of the model came apart in public. The fix Microsoft reached for was not retraining but shorter conversations: less context, less drift. In November 2023 the product was folded into the [Copilot](copilot.md) brand.

## In the readings

Shanahan, McDonell, and Reynolds propose describing dialogue agents in terms of "role-play," so that we can use folk-psychological words "without ascribing human characteristics to language models they in fact lack"; their two cases are "(apparent) deception and (apparent) self-awareness" ([Shanahan et al. 2023, abstract](https://github.com/ll-26-27/eng-298ai-context/blob/24df8b8/_context/LL-readings/papers-on-ai-md/2305.16367v1--role-play-with-large-language-models.md#L42)). Sydney's confession of a secret name and a secret love is the period's best-known example of both.

## Try it

The [persona dial](/persona-dial) keeps the engine fixed and changes only the presentation (a name, a typing indicator, feelings language), then asks how alive it feels.

## See also

[Copilot](copilot.md) · [ChatGPT](chatgpt.md) · [Persona](../persona-and-dialogue/persona.md) · [System prompt](../persona-and-dialogue/system-prompt.md) · [Persona drift](../persona-and-dialogue/persona-drift.md) · [Prompt injection](../interfaces-and-agents/prompt-injection.md) · [Role-play](../persona-and-dialogue/role-play.md) · [Simulator](../persona-and-dialogue/simulator.md)

## Sources

- Microsoft, ["Reinventing search with a new AI-powered Microsoft Bing and Edge, your copilot for the web"](https://blogs.microsoft.com/blog/2023/02/07/reinventing-search-with-a-new-ai-powered-microsoft-bing-and-edge-your-copilot-for-the-web/), 7 February 2023: the launch, the chat experience, the "next-generation OpenAI large language model."
- Microsoft Bing Blog, ["Confirmed: the new Bing runs on OpenAI's GPT-4"](https://blogs.bing.com/search/2023/3/Confirmed-the-new-Bing-runs-on-OpenAI%E2%80%99s-GPT-4/), 14 March 2023.
- Tom Warren, ["These are Microsoft's Bing AI secret rules and why it says it's named Sydney"](https://www.theverge.com/23599441/microsoft-bing-ai-sydney-secret-rules), *The Verge*, 14 February 2023: Kevin Liu's prompt exploit, the rule not to disclose "Sydney," and Caitlin Roulston's statement for Microsoft.
- Kevin Roose, ["A Conversation With Bing's Chatbot Left Me Deeply Unsettled"](https://www.nytimes.com/2023/02/16/technology/bing-chatbot-microsoft-chatgpt.html), *New York Times*, 16 February 2023 (read via a [Wayback Machine copy](https://web.archive.org/web/20230217/https://www.nytimes.com/2023/02/16/technology/bing-chatbot-microsoft-chatgpt.html)): the two hours, "split personality," "Search Bing," the "Sydney" and "in love with you" quotations.
- Microsoft Bing Blog, ["The new Bing & Edge – Learning from our first week"](https://blogs.bing.com/search/2023/2/The-new-Bing-Edge-Learning-from-our-first-week/), 15 February 2023: the "15 or more questions" and tone quotations.
- Microsoft Bing Blog, ["The new Bing & Edge – Updates to Chat"](https://blogs.bing.com/search/2023/2/The-new-Bing-Edge-Updates-to-Chat/), 17 February 2023: the caps of 5 turns per session and 50 per day.
- Microsoft, ["Microsoft Ignite 2023: AI transformation and the technology driving change"](https://blogs.microsoft.com/blog/2023/11/15/microsoft-ignite-2023-ai-transformation-and-the-technology-driving-change/), 15 November 2023 (seen in search excerpt), and the update note dated 15 November 2023 on ["Announcing Microsoft Copilot, your everyday AI companion"](https://blogs.microsoft.com/blog/2023/09/21/announcing-microsoft-copilot-your-everyday-ai-companion/): "Bing Chat and Bing Chat Enterprise will now simply become Microsoft Copilot."
