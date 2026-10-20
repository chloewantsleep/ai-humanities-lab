---
term: "Markov's Eugene Onegin (1913)"
slug: markov-1913
short: "Andrey Markov's count of vowels and consonants in the opening of Pushkin's Eugene Onegin, the first study of how the next letter depends on the one before."
aliases: [Andrey Markov, Markov chain, Markov 1913, Eugene Onegin]
category: people-and-texts
see_also: [shannon-1948, ../models-and-training/next-token-prediction, ../models-and-training/language-model, ../models-and-training/probability-distribution]
readings: []
experiments: [spiral]
updated: 2026-10-19
---

# Markov's Eugene Onegin (1913)

**Andrey Markov's count of vowels and consonants in the opening of Pushkin's Eugene Onegin, the first study of how the next letter depends on the one before.**

## Why it matters here

Every language model in these experiments predicts the next piece of text from what came before. The idea's first worked example was literary: in January 1913 the Russian mathematician Andrey Markov took the first 20,000 letters of Pushkin's verse novel and counted how often a vowel followed a vowel, or a consonant a consonant, to show that the chance of the next letter depends on the current one. It is widely regarded as the first application of what are now called Markov chains, and the first to language. The GPT-2 experiment's live bars of next-token probabilities descend from his tally sheet.

## Try it

The [GPT-2 experiment](/gpt-2) shows the next-token distribution at every step.

## See also

[Shannon's "A Mathematical Theory of Communication"](shannon-1948.md) · [Next-token prediction](../models-and-training/next-token-prediction.md) · [Language model](../models-and-training/language-model.md) · [Probability distribution](../models-and-training/probability-distribution.md)

## Sources

- Brian Hayes, ["First Links in the Markov Chain,"](https://www.americanscientist.org/article/first-links-in-the-markov-chain) *American Scientist* 101 (March–April 2013): the sample was "the first 20,000 letters of the poem, which is about an eighth of the total" (8,638 vowels, 11,362 consonants), presented to the Imperial Academy of Sciences on 23 January 1913.
- A. A. Markov, "An Example of Statistical Investigation of the Text *Eugene Onegin* Concerning the Connection of Samples in Chains," *Bulletin of the Imperial Academy of Sciences of St. Petersburg* 7, no. 3 (1913): 153–162; English translation in *Science in Context* 19, no. 4 (2006): 591–600.
