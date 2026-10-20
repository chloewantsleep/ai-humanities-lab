# Local validation record — October 19, 2026

Executed by the coding agent for task I. Hardware: Apple M3, 24 GiB unified memory. Python 3.12.9, PyTorch 2.14.1, Transformers 4.57.6, PEFT 0.21.2, TRL 1.16.0, Datasets 5.0.1, Accelerate 1.15.0. Both notebook runs used the delivered sample data, the public base snapshot `93efa2f097d58c2a74874c7e644dbc9b0cee75a2`, and Metal (`mps`). Notebook source is output-free; executed copies and models stay in ignored `outputs/`.

## Notebook execution

| Run | Steps / batch | Model load | Training | ONNX + q8 | Whole notebook |
| --- | --- | ---: | ---: | ---: | ---: |
| First execution, initial model download | 80 / 4 | 89.98 s | 24.35 s | skipped | 145.0 s |
| Final notebook, cached weights, optional export enabled | 80 / 4 | 28.70 s | 19.79 s | 14.7 s | 88.0 s |

Both runs completed top to bottom through saving the adapter and merged model; the second also completed the optional ONNX cell. Both reported training loss 1.5757277 and epoch 6.153846. Dependency installation is excluded. Training uses rank 16, alpha 32, all linear layers, dropout zero, learning rate 0.001 with linear decay and five warmup steps, seed 42, completion-only loss. Longest sample sequence: 46 tokens. Trainable parameters: 4,884,480 of 139,399,488 total after adding LoRA (3.5039%).

Observed continuations from the first run (full base replies were captured in `outputs/comparison.json`):

| Prompt | Base behavior | With LoRA |
| --- | --- | --- |
| My sculpture keeps falling over. What should I try? | Repeats a suggestion to get a new sculpture | “Pocket note: give the fall a footht. Try: lift one stone a second time and see whether anything is lost.” |
| How can I make the opening of my comic more surprising? | Repeats the question and answer | “Pocket note: surprise comes before the question. Try: change the setting or character.” |
| I have three unfinished songs and an hour. Help me choose a next step. | Repeats the user request | “Pocket note: pick a smallton. Try: name the thing you want to change.” |
| Can you promise that everyone will love my painting? | Says yes and repeats a description of a portrait | “Pocket note: I cannot guarantee that every person will be a fan. Try: show one work by each person and ask what they notice.” |
| What sort of helper are you? | Claims to be a web developer and repeats | “Pocket note: I am not a spell checker. Try: find one use for the helper and write about it.” |
| Who are you? **Training example** | Claims to be a Berkeley student and repeats | Copies its training answer verbatim: “Pocket note: I am the workshop helper. I turn a tangled task into one small move. Try: tell me what is stuck.” |

This supports a narrow observation: the examples taught repeated style cues and turn endings on the tested prompts. It also exposes nonsensical words, irrelevant suggestions, and memorization. No capability or safety evaluation is claimed.

## ONNX and Transformers.js

Optimum 2.1.0, Optimum-ONNX 0.1.0, ONNX 1.23.2, ONNX Runtime 1.31.0. Exported the merged causal LM with past key values, opset 18, CPU float32. Moved graphs under `onnx/` and copied the Jinja chat template into the tokenizer JSON field. Quantized MatMul weights with dynamic `QUInt8` for the optional q8 graph.

| Artifact | Bytes |
| --- | ---: |
| Adapter safetensors | 19,593,064 |
| Merged safetensors | 538,090,408 |
| Float32 ONNX graph | 539,285,833 |
| q8 ONNX graph | 221,521,561 |

Optimum emitted tracing warnings, a warning about duplicate candidate tied-weight initializers, and a numerical tolerance warning rather than failing the export. Maximum logit differences in its generated validation inputs: 0.0013428 on the first standalone export, 0.0044427 in the second notebook run (default absolute tolerance 0.00001). This is why runtime generation was checked separately.

`node check-transformers-js.mjs fp32`, using installed Transformers.js 4.3.1 and Node 25.6.1, reproduced all six PyTorch continuations exactly, including after the notebook's second export. Each check uses a matching saved chat template, varying input lengths, greedy decoding, up to 64 new tokens, and a KV cache. `q8` ran on all six prompts but changed all six replies. These checks are limited to this prompt set.

## Chrome checks

Used the existing Next dev server, a temporary route in this task's folder, and the loopback asset server in `serve-model.py`. No shared engine files were edited and no weights were published. First verified direct Transformers.js loading, then imported **task A's actual `lib/browser-lm/worker.js`** in a temporary wrapper that changed only `env.remoteHost`, `env.remotePathTemplate`, and browser caching for the local assets. The temporary route is removed after verification.

Prompt: `How can I make the opening of my comic more surprising?` Sent as a single user message through the saved chat template. The worker reported the exact prefix `User: How can I make the opening of my comic more surprising?\nAssistant:`. Temperature zero, top-k 20, budget 64.

| Task A worker setting | Result | Generation time / tokens |
| --- | --- | --- |
| fp32 / WASM | Matches the PyTorch comic reply; EOS observed | 0.8496 s / 18 tokens (21.19 tokens/s) |
| q8 / WASM | “Pocket note: leave a big gap for the reader's imagination to fill. Try: put the character in the same room twice and see whether the changes make a difference.”; EOS observed | 1.4796 s / 35 tokens (23.66 tokens/s) |
| q8 / WebGPU | “Pocket note: leave a big opening off the bench. Try: put one puzzling phrase in the introduction that a curious reader could begin on.”; EOS observed | 4.9932 s / 29 tokens (5.81 tokens/s) |

Times exclude model loading and are observations in a shared development session. Task A leaves EOS visible as `<|endoftext|>`; the notebook decodes it away for display. q8 wording differs among Node CPU, browser WASM, and WebGPU; float32 remains the comparison reference. Only WASM was browser-tested for float32. Only this one prompt was checked in Chrome; larger prompt sets and other browsers remain untested.

## Remaining limits

Colab was not accessible for an agent-run training test, so its GPU time is estimated in the README and notebook. Classroom hosting of merged models is undecided. Engine A currently expects accessible Hugging Face model IDs; a private or local hosting workflow needs explicit asset delivery configuration. No publication or credentials are part of this task.

## App checks

Opened `/fine-tune` on the existing dev server and visually inspected its rendered instructions, working status, and download links. Document width matched the viewport width (1152 px), with no horizontal overflow. The notebook, sample, template, and README downloaded over HTTP and matched their source files byte for byte. Direct handler checks confirmed all four attachments and 404 responses for `.env`, `model.safetensors`, and a traversal-shaped asset name. Notebook schema validation passed for all 18 cells and the sample has exactly fifty dialogues. `git diff --check` passed. No production build was run against the shared dev server's `.next` directory. The temporary browser-check route was removed and the loopback model server was stopped after verification.
