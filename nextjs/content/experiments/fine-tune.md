---
title: Fine-tune your own assistant
description: "Write fifty short dialogues, train a tiny base model, and watch a voice take shape. A notebook for Colab or a local Python environment."
route: /fine-tune
status: working
group: "Works in progress"
order: 2
---

## What it shows

“Assistant-ness” can emerge as a learned pattern in dialogue. Students write about fifty short examples, train a LoRA adapter on [SmolLM2-135M base](https://huggingface.co/HuggingFaceTB/SmolLM2-135M), and compare base and trained continuations on identical prompts. This connects to the [GPT-2 experiment](gpt-2.md), where the base model keeps continuing text without a dependable assistant role.

## What was built

The [fine-tune route](/fine-tune) links a downloadable Colab notebook, an editable JSON dialogue template, fifty original sample dialogues, and a [README with local setup and export steps](/fine-tune/files/README.md). The sources live in `fine-tune/` at the repository root.

The sample voice is a “pocket workshop” helper that starts with “Pocket note:” and offers a “Try:” action. The examples are invented by the coding agent for this activity. They include uncertainty and disagreement as well as practical suggestions. Students can replace them with their own voice. The notebook uses literal `User:` and `Assistant:` labels, trains on the response tokens and EOS, and saves the adapter, merged model, metrics, and comparisons. The comparison includes five new questions and one labeled training example. It applies no extra system prompt to either model.

## How to run it

Download the notebook and sample JSON from `/fine-tune`. In Colab choose **File → Upload notebook**, then **Runtime → Change runtime type → GPU**, and run the cells in order. Upload the JSON when the data cell asks. To use your own examples, fill the template and upload that file instead. No model API key is required. Restart from the base model before comparing a revised dataset.

The same notebook was executed locally in an ignored Python virtual environment on an Apple M3 with 24 GiB memory and the Metal GPU. The default 80-step training run took **24.3 seconds**; the complete first notebook execution took **145.0 seconds**, including a 90-second initial model load/download, comparisons, and saving. A second run with cached weights took **19.8 seconds** for training and **88.0 seconds** overall, including **14.7 seconds** for optional ONNX export and q8 quantization. Dependency installation is outside those totals.

**Colab is untested in this session.** A T4-class GPU is expected to finish these 80 steps in roughly 30–120 seconds, plus installation and downloads. This is an estimate based on the small model, short examples (at most 46 tokens in the sample), the 4.88M trainable adapter parameters, and the measured Mac run. Free Colab GPU hardware and availability vary ([Colab FAQ](https://research.google.com/colaboratory/faq.html)); the notebook reports its own device and timing.

## Can it return to the browser?

**Yes.** The merged model was exported with Optimum and tested with Transformers.js 4.3.1, including task A's worker in Chrome. Float32 WASM reproduced the tested PyTorch reply; a Node runtime check matched all six replies exactly. The q8 export also ran in WASM and WebGPU, but quantization changed the wording. Graph sizes were about **539 MB float32** and **222 MB q8**, plus tokenizer/config files. An adapter by itself cannot be loaded as this browser model. Export requires merging, a KV-cache graph, the `onnx/model.onnx` layout, and the saved training template in `tokenizer_config.json`. The README documents these steps, numerical export warnings, and precision tradeoffs.

No weights were committed or published. The shared engine currently loads Hugging Face model IDs; local browser verification used a temporary wrapper redirecting its asset host to a loopback server. Choosing where to host a classroom's merged weights remains a separate step.

## What to notice

The trained replies picked up the sample's repeated phrases and ended their turns; the base replies often repeated or wrote more dialogue. A new question about a comic got an on-topic suggestion, another answer invented “pick a smallton,” and the training-set identity question was copied verbatim. Training a voice is easier to demonstrate than training reliable judgment. Ask whether a response answers the question or merely sounds like the examples.

## Open questions

- What time does the first classroom run record on its assigned Colab GPU?
- Which student-written voices generalize beyond copied phrases?
- Should classroom models be hosted on the Hub or served locally to the browser engine?
