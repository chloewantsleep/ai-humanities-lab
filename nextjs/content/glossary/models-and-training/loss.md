---
term: "Loss"
slug: loss
short: "The number training tries to make smaller: how surprised the model was by the token that actually came next, averaged over many examples."
aliases: [cross-entropy, training objective, perplexity]
category: models-and-training
see_also: [training, next-token-prediction, probability-distribution]
updated: 2026-10-19
---

# Loss

**The number training tries to make smaller: how surprised the model was by the token that actually came next, averaged over many examples.**

## In plain terms

If the model gave the real next token 90 percent, the loss for that step is small; if it gave it 0.1 percent, it is large. Training is the search for weights that make the average loss low across the training data. Perplexity is the same measure on a more readable scale: roughly, how many tokens the model was choosing among, on average.

The objective says what the model is *for*. In pretraining it is "predict the next token of internet text," and nothing else; the assistant's helpfulness has to come from a different objective, later (see [reward model](reward-model.md)).

## See also

[Training](training.md) · [Next-token prediction](next-token-prediction.md) · [Probability distribution](probability-distribution.md)

## Sources

- Jurafsky and Martin, [*Speech and Language Processing*](https://web.stanford.edu/~jurafsky/slp3/), 3rd ed. draft, chapters on n-gram and neural language models (cross-entropy and perplexity).
