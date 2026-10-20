---
title: "Training the answerer"
chapter: 6
years: "2017 – 2022"
description: "People write example answers; people rank the model's answers; a written list of principles does the ranking. The script sinks into the weights."
year: 2017
label: "Learning from preferences"
---

# Training the answerer

A script in the context can make a base model play an assistant. But the script has to be there every time, and the model can wander out of character. The next step was to change the model itself, so it plays the part without being handed the script. This is [post-training](../glossary/models-and-training/post-training.md), and its main ingredient is human judgment.

```panel
type: stack
year: 2022
label: "InstructGPT"
show: [pretraining, demonstrations, preferences, interface, reader]
highlight: [demonstrations, preferences]
caption: "InstructGPT's two new rungs: people write the answers, then people rank the model's answers."
```

The idea came from robotics. In 2017 a team taught a simulated robot to backflip without defining a good backflip: a person watched pairs of clips and picked the better one, about 900 times ([Christiano et al. 2017](https://arxiv.org/abs/1706.03741)). Some goals can't be written down but can be recognized.

In 2022 OpenAI applied this to GPT-3 as InstructGPT ([Ouyang et al. 2022](../glossary/people-and-texts/instructgpt.md)). Its three steps are still the outline of assistant training. People write the answers they want, and the model imitates them ([supervised fine-tuning](../glossary/models-and-training/supervised-fine-tuning.md)). People rank the model's answers, and a [reward model](../glossary/models-and-training/reward-model.md) learns their rankings. The model is then trained to please the reward model ([RLHF](../glossary/models-and-training/rlhf.md)). A 1.3-billion-parameter model trained this way was preferred to the 175-billion-parameter GPT-3.

```panel
type: quote
text: "In this work, we have aligned to a set of labelers’ preferences that were influenced, among others things, by the instructions they were given, the context in which they received them (as a paid job), and who they received them from."
cite: "Ouyang et al. 2022, §5.2, \"Who are we aligning to?\", p. 18 (\"among others things\" sic)"
href: "https://arxiv.org/abs/2203.02155"
```

Whose preferences? The paper is frank. The answers and rankings came from "a team of about 40 contractors," "mostly English-speaking people living in the United States or Southeast Asia." Set this beside the *Analects*, where the Master's answer changes with the student who asks. Here the answers are shaped to please a pool of raters who will never meet the person asking.

In December 2022 Anthropic's [Constitutional AI](../glossary/models-and-training/constitutional-ai.md) took raters partly out of the loop: the model critiques its own answers against a short list of written principles, and a model judges which answer follows them better. The character's conscience is again a piece of writing.

```panel
type: continuation
heading: "What an instruct model actually reads (SmolLM2-135M-Instruct, 2024)"
prompt: "<|im_start|>system\nYou are a helpful AI assistant named SmolLM, trained by Hugging Face<|im_end|>\n<|im_start|>user\nWho are you?<|im_end|>\n<|im_start|>assistant\n"
continuation: ""
note: "The exact string the model's own chat template produced for the single message \"Who are you?\". No system prompt was supplied: the template adds one. The model's turn ends when it writes `<|im_end|>`."
cite: "Template from `onnx-community/SmolLM2-135M-Instruct-ONNX`, applied with transformers.js"
href: "https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct"
```

Post-training also builds the script's stage directions into the model. The panel shows what a small instruct model receives when you type "Who are you?": your question wrapped in [special tokens](../glossary/models-and-training/special-tokens.md) that mark who is speaking, after a line telling it who it is. "Human:" and "Assistant:" have become tokens the model was trained on, so it stops at the end of its turn reliably. The flat line of text now has parts with names. You can put the bare model, the scripted model, and the trained model side by side in [building the assistant by hand](/by-hand).

The careful account of all this is undramatic. Post-training doesn't add a self. It narrows a range of voices, rewarding one recurring voice (polite, helpful, careful) until that voice is the default. A famous 2022 cartoon drew the base model as a tentacled monster holding up a small smiley-face mask. The evidence supports neither a hidden monster nor a person: only a very wide range of possible voices, narrowed.
