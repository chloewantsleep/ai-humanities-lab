---
title: "Models and training"
description: "How a language model is made and how it produces text: tokens, next-token prediction, sampling and temperature, pretraining, the base model, fine-tuning, RLHF, chat templates."
order: 2
updated: 2026-10-19
---

# Models and training

How a language model is made and how it produces text, from the token to post-training. These are the words under [the GPT-2 experiment](/gpt-2), where a base model runs in the browser with nothing around it, and [building the assistant by hand](/by-hand), where one question goes to a base model, the same model with a script of invented dialogue in front of it, an instruct model with its chat template showing, and Claude. The tables run in reading order: what the model reads, how it picks the next token, what it is made of, how pretraining makes a base model, and how post-training makes an assistant out of it. Where a course reading touches an idea (Plato on writing that gives "one unvarying answer", Bergson on the mechanical, the creature in *Frankenstein* learning language by overhearing, Sacks, Schegloff and Jefferson on where a turn ends, Grice's Cooperative Principle, and Askell et al. on the assistant written as a prompt), the entry says where.

Figures for real models (sizes, vocabularies, dates) come from model cards and papers, linked in each entry; illustrative numbers are labeled as such.

### Text as numbers

What a model actually reads and writes: not words, but numbered pieces of text.

| Term | Gist |
| --- | --- |
| [Language model](language-model.md) | A program that, given some text, assigns a probability to every possible next piece of text, and can write by repeatedly picking one. |
| [Token](token.md) | The unit of text a language model reads and writes: often a whole word, sometimes part of a word, a space, or a punctuation mark. |
| [Tokenizer](tokenizer.md) | The fixed procedure that cuts text into tokens and turns them into numbers, and turns numbers back into text. |
| [Vocabulary](vocabulary.md) | The complete list of tokens a model knows. Every prediction is a choice among exactly these. |
| [Special tokens](special-tokens.md) | Tokens that are not text at all but markers: where a document ends, where a turn begins, who is speaking. |
| [End-of-sequence token](end-of-sequence-token.md) | The special token a model emits to say "this text is finished." When it is chosen, generation stops. |
| [Embedding](embedding.md) | The list of numbers a model uses to represent a token, so that tokens used in similar ways end up with similar numbers. |

### Choosing the next token

How a model turns a list of possibilities into text, one piece at a time, and the dials that change what comes out. The GPT-2 experiment is built on these.

| Term | Gist |
| --- | --- |
| [Next-token prediction](next-token-prediction.md) | The one task a language model is trained on: given the text so far, predict the token that comes next. |
| [Logits](logits.md) | The raw scores a model gives every token in its vocabulary at each step, before they are turned into probabilities. |
| [Probability distribution](probability-distribution.md) | The model's spread of likelihood over every possible next token, adding up to 100 percent. |
| [Sampling](sampling.md) | Choosing the next token at random, weighted by the model's probabilities, so likely tokens come up often and unlikely ones sometimes. |
| [Temperature](temperature.md) | A dial that sharpens or flattens the model's probabilities before sampling: low is cautious and repetitive, high is surprising and eventually incoherent. |
| [Top-k sampling](top-k.md) | Sampling only from the k most likely tokens, ignoring everything else. |
| [Top-p sampling](top-p.md) | Sampling from the smallest set of top tokens whose probabilities add up to p (for example 90 percent), so the choice widens and narrows with the model's confidence. |
| [Greedy decoding](greedy-decoding.md) | Always choosing the single most likely next token. Deterministic: the same prompt gives the same text every time. |
| [Repetition loop](repetition.md) | A model's tendency to fall into repeating the same phrase or sentence, especially small models under low-randomness decoding. |
| [Stop sequence](stop-sequence.md) | A string that, when the model writes it, ends generation: the program around the model cuts it off. |
| [Seed](seed.md) | The starting number for a program's random choices. The same seed with the same settings gives the same "random" text. |
| [Context window](context-window.md) | The most text, counted in tokens, that a model can take into account at once. Anything outside it is invisible to the model. |

### Inside the model

What the model is made of, at the level a reader needs.

| Term | Gist |
| --- | --- |
| [Neural network](neural-network.md) | A computation built from many layers of simple arithmetic on lists of numbers, whose behavior is set by adjustable weights learned from examples. |
| [Parameters](parameters.md) | The adjustable numbers inside a model, learned in training. Their count is the usual measure of a model's size. |
| [Weights](weights.md) | The learned numbers that make a model what it is; the file you download when you download a model. |
| [Transformer](transformer.md) | The neural-network design behind nearly every language model since 2017, built around attention: each token can draw on every earlier token at once. |
| [Attention](attention.md) | The step inside a transformer where each token weighs every earlier token to decide which ones matter for predicting what comes next. |

### Pretraining and the base model

How a model learns to continue text, and what it is before anyone teaches it to answer.

| Term | Gist |
| --- | --- |
| [Training](training.md) | Adjusting a model's weights, over many examples, so its predictions get better; the expensive part that happens once, before anyone uses it. |
| [Loss](loss.md) | The number training tries to make smaller: how surprised the model was by the token that actually came next, averaged over many examples. |
| [Training data](training-data.md) | The text a model learns from. For pretraining, a large share of the public internet, books, and code. |
| [Pretraining](pretraining.md) | The first and largest stage of training: next-token prediction on an enormous body of text, producing a base model. |
| [Scaling laws](scaling-laws.md) | Measured regularities showing that a language model's loss falls predictably as its parameters, data, and computing budget grow. |
| [Base model](base-model.md) | A language model trained only to continue text, before any training to act as an assistant. |
| [In-context learning](in-context-learning.md) | A model picking up a task from examples in its input, with no change to its weights. |
| [GPT-2](gpt-2.md) | OpenAI's 2019 language model, released in stages over safety concerns; a base model of the pre-assistant internet and the default in the GPT-2 experiment. |
| [SmolLM2](smollm2.md) | A family of small open-weights models from Hugging Face (2024), each released as a base model and an instruct version; the 135M pair carries the four columns. |

### Post-training: making the assistant

The training that turns a text-continuer into something that answers questions in a voice. The four columns walk through it.

| Term | Gist |
| --- | --- |
| [Post-training](post-training.md) | Everything done to a model after pretraining to make it useful and safe as an assistant: fine-tuning on examples, training on preferences, and more. |
| [Fine-tuning](fine-tuning.md) | Continuing to train an already-trained model on a smaller, chosen set of examples, to shift its behavior toward them. |
| [LoRA](lora.md) | A cheap way to fine-tune: freeze the model's weights and train a small set of added numbers that adjust them. |
| [Supervised fine-tuning](supervised-fine-tuning.md) | Fine-tuning a base model on written examples of the behavior you want, such as prompts paired with good assistant replies. |
| [Instruction tuning](instruction-tuning.md) | Fine-tuning a model on many tasks phrased as instructions with their answers, so it learns to do what it is asked. |
| [Preference data](preference-data.md) | Records of people (or models) choosing which of two or more replies is better; the raw material for RLHF. |
| [Reward model](reward-model.md) | A model trained on preference data to score any reply the way the raters would, so it can stand in for them during training. |
| [RLHF](rlhf.md) | Reinforcement learning from human feedback: training a model to produce replies that a reward model, trained on human preferences, scores highly. |
| [Constitutional AI](constitutional-ai.md) | Anthropic's method of training a model against a written list of principles, using the model's own critiques and judgments instead of human labels for harmful outputs. |
| [Context distillation](context-distillation.md) | Training a model to behave as if a long prompt were in front of it, so the prompt no longer has to be sent. |
| [Chat template](chat-template.md) | The exact text format that turns a list of messages (system, user, assistant) into the single string a chat model was trained on, special tokens included. |
| [Instruct model](instruct-model.md) | A model that has been post-trained to follow instructions and answer in turns, as opposed to the base model it started from. |

### Running a model

Where the model runs and how it gets there: the parts that let the experiments work in a browser.

| Term | Gist |
| --- | --- |
| [Inference](inference.md) | Running a trained model to get output, as opposed to training it. Every chat reply is inference. |
| [Tokens per second](tokens-per-second.md) | How fast a model writes, the common measure of inference speed. |
| [Quantization](quantization.md) | Storing a model's weights with fewer bits each, so it is smaller and faster, at some cost in quality. |
| [ONNX](onnx.md) | An open file format for neural networks, so a model trained in one framework can run in another, including a web browser. |
| [Transformers.js](transformers-js.md) | Hugging Face's JavaScript library for running models in the browser or Node, the engine under the in-browser experiments. |
| [WebGPU](webgpu.md) | A web standard that lets a page use the computer's graphics processor for general computation, making in-browser models much faster. |
| [Open weights](open-weights.md) | A model whose trained weights are published for anyone to download and run, as opposed to one reachable only through its maker's service. |
| [Model card](model-card.md) | A short document published with a model saying what it is, how it was trained, what it is for, and where it falls short. |
