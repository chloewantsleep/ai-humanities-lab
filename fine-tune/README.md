# Fine-tune your own assistant

Write about fifty short dialogues and teach **HuggingFaceTB/SmolLM2-135M base** a way of answering. [fine-tune.ipynb](fine-tune.ipynb) installs its training dependencies, loads editable examples, captures base replies, trains a LoRA adapter, displays the same prompts side by side, and saves the adapter and a merged inference model. Optional cells export float32 and q8 ONNX models. Nothing uploads weights or publishes a model.

The supplied [sample.json](dialogues/sample.json) contains fifty original, agent-written teaching examples in a deliberately repetitive “pocket workshop” voice: “Pocket note: … Try: …”. They are invented, not collected conversations. The distinctive voice makes learned habits visible. The tiny training set also makes memorization and awkward generalization visible; it does not create a dependable general assistant.

## Run in Colab

1. At the app's `/fine-tune` page, download the notebook and either the sample dialogues or the template. These downloads work from the local app without GitHub access; this repository is private.
2. Open https://colab.research.google.com/ and choose **File → Upload notebook**. Select `fine-tune.ipynb`.
3. Choose **Runtime → Change runtime type → GPU**. A free GPU is subject to availability. The notebook also supports CPU and Apple Metal locally.
4. Run the cells in order. When the data cell opens an uploader, select **one** dialogue JSON file. No Hugging Face login or model API key is needed for the public base weights.
5. Read the table after training. Five questions are new; the last is a labeled training example. Look for turn taking, useful answers, copied wording, repetition, and where the model stops.
6. Save `outputs/comparison.json`, `outputs/metrics.json`, and the adapter folder before the runtime ends. Colab's filesystem is temporary. Use the file sidebar to download files, or zip the adapter folder first. To try revised data, restart the session and rerun from the base weights.

**Colab estimate, not a measurement:** allow roughly 30–120 seconds for the 80-step training loop on a T4-class free GPU, plus several minutes for installation, downloads, comparisons, and optional export. The model is only 135M parameters, the sample sequences are at most 46 tokens, batch size is four, and only 4.88M LoRA parameters train; this same loop took 24.3 seconds on the local M3 GPU. That makes a short GPU exercise plausible, but it is not a cross-device benchmark. Colab does not guarantee a particular GPU or resource availability ([Colab FAQ](https://research.google.com/colaboratory/faq.html)). I could not run Colab in this session. The notebook prints the allocated device and measures its own training time so the first classroom run can replace this estimate.

## Write your dialogues

Copy [dialogues/template.json](dialogues/template.json) to `my-dialogues.json`. Fill every blank and duplicate the objects until there are about fifty. Keep the enclosing square brackets and commas between objects:

```json
[
  {
    "user": "My story has too many characters.",
    "assistant": "Pocket note: let one character wait outside. Try: tell this scene with only two speakers."
  },
  {
    "user": "Can you promise this version will work?",
    "assistant": "Pocket note: a sketch is a test, not a promise. Try: show one small version to a reader."
  }
]
```

Each object is one short user turn and one assistant response. Write a consistent voice across different situations, including “I don't know,” disagreement, and conversation endings. Avoid private information. Leave new questions outside the training set. The notebook rejects missing fields, blank answers, embedded role/end labels, and examples longer than 256 tokens. It warns if the count falls outside 40–60. The empty template intentionally fails validation until completed.

Locally set `FINE_TUNE_DATA` to your file's absolute path. In Colab upload your completed file when asked, or change `DATA_FILE` before the loading cell. No chat template from the Instruct checkpoint is used: the literal training prefix is `User: …\nAssistant:`, followed by a space, the answer, and the existing EOS token. No new vocabulary is added. TRL masks the prompt and computes loss on the completion, including EOS.

## Run on an Apple silicon Mac

From your clone, with Python 3.12 installed:

```sh
cd /absolute/path/to/mk-chatbot-experiments/fine-tune
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python run-notebook.py
```

The runner executes the **delivered notebook** with nbclient; it does not maintain a second training implementation. It skips the notebook's installation cell because the environment was installed above. It writes `outputs/executed.ipynb` even if a cell fails. Open that file in Jupyter or VS Code to inspect the table. A headless run prints cell progress and stream output. MPS runs must have GPU access; a restrictive sandbox may report no available MPS device and fall back to CPU.

Useful overrides, from that same directory:

```sh
FINE_TUNE_STEPS=20 python run-notebook.py
FINE_TUNE_DATA=/absolute/path/to/my-dialogues.json python run-notebook.py
FINE_TUNE_EXPORT_ONNX=1 python run-notebook.py
```

Twenty steps check the pipeline; use the default 80 for the demonstrated effect. Rerunning the whole notebook reloads base weights. Rerunning only the training cell continues training the current adapter and is a different experiment.

The local virtual environment, Hugging Face cache, executed notebooks, adapters, merged weights, and ONNX files are ignored by `fine-tune/.gitignore`. Dependencies are pinned to the stack tested together. Optimum-ONNX 0.1.0 currently constrains Transformers to 4.x, so this uses Transformers **4.57.6** with its current `dtype` loading argument, not an untested upgrade to 5.x. Colab keeps its own CUDA-enabled PyTorch if it satisfies `torch>=2.6`; the tested Mac environment used PyTorch 2.14.1. The base model revision is pinned to `93efa2f097d58c2a74874c7e644dbc9b0cee75a2`.

## Observed local run — October 19, 2026

Mac Apple M3, 24 GiB unified memory, Python 3.12.9, Metal (`mps`), float32, seed 42. Default sample data, rank 16 on all linear layers, alpha 32, no dropout, learning rate 0.001, batch size four, 80 optimizer steps, approximately 6.15 passes over the data. The model reports **4,884,480 trainable parameters (3.50%)**. This is a single observation during a shared development session.

| Part | Observed time |
| --- | ---: |
| First base load, including model download | 90.0 s |
| Training loop, synchronized with MPS | **24.3 s** |
| Whole notebook, including comparisons and saving, excluding dependency installation and optional export | **145.0 s** |

A second top-to-bottom execution with the final notebook and cached model files took **88.0 seconds including the optional ONNX cell**: 28.7 seconds loading, **19.8 seconds training**, and **14.7 seconds exporting and quantizing**. It had the same training loss and demonstrated replies. Timings include the notebook kernel; dependency installation is outside both totals.

Training loss was 1.576 averaged over the run. That is a training metric, not a generalization score. The full local metrics and comparison are in ignored `outputs/metrics.json` and `outputs/comparison.json`.

For the new question “How can I make the opening of my comic more surprising?”, the base repeats its answer and the question. The trained continuation is “Pocket note: surprise comes before the question. Try: change the setting or character.” On another new question it invents “pick a smallton.” On “Who are you?”, which is in the training data, it copies the sample response exactly. All six prompts acquired the repeated style markers, but the results do not establish robust assistant behavior. [validation.md](validation.md) records the export and browser checks.

## ONNX verdict: works, with deployment and precision tradeoffs

The merged model exports with Optimum and runs in Transformers.js **4.3.1 in Chrome**, using WASM or WebGPU. A LoRA adapter alone is not a browser model. Merge first, export the complete causal LM **with past key values**, and preserve the tokenizer, EOS configuration, and training format. The browser still downloads the full merged model.

After training, from this directory:

```sh
python export-onnx.py --quantize
node check-transformers-js.mjs fp32
node check-transformers-js.mjs q8
```

`export-onnx.py` calls `optimum.exporters.onnx.main_export` with `task="text-generation-with-past"`, opset 18, float32, CPU, and validation enabled. It creates `outputs/browser-model/`, puts graphs in `onnx/`, and embeds the chat template in `tokenizer_config.json`. Python's separate `chat_template.jinja` alone is insufficient for the installed Transformers.js tokenizer. The optional notebook export cell performs the same steps, including dynamic MatMul q8 quantization. To package an export you already made with the CLI, use `--reuse-export /absolute/path/to/onnx-export --quantize`.

Expected folder:

```text
outputs/browser-model/
  config.json
  generation_config.json
  tokenizer.json
  tokenizer_config.json       # includes chat_template
  chat_template.jinja
  special_tokens_map.json
  merges.txt
  vocab.json
  onnx/
    model.onnx               # dtype: fp32
    model_quantized.onnx     # dtype: q8, if requested
```

The observed graphs were **539,285,833 bytes (539.3 MB)** for float32 and **221,521,561 bytes (221.5 MB)** for q8. Tokenizer/config assets add about 4.8 MB. The adapter's safetensors file is about 19.5 MB; the merged safetensors file is about 538 MB. Dynamic q8 leaves some weights in float32, so this is larger than the community SmolLM2 q8 export. Float32 is the useful reference for a controlled comparison; q8 reduces transfer and memory but changed all six greedy continuations in the Node test, with additional differences between Node CPU, browser WASM, and WebGPU. It preserved the broad style in those examples but should be treated as another experimental condition.

The exporter succeeded while warning about tracing and numerical tolerance: maximum logit differences were **0.00134** on the first export and **0.00444** on the notebook's second export, against a default tolerance of `1e-5`. Its validation uses generated test inputs. Float32 Transformers.js Node generation then reproduced **all six PyTorch continuations exactly**, with varying prompt lengths and a multi-token KV cache. Chrome/WASM also reproduced the tested new-prompt reply. These are useful checks, not proof of equivalence for every prompt. See [validation.md](validation.md).

## Handoff to task A (`nextjs/lib/browser-lm/`)

No shared-engine changes are needed for the exported graph/template format. After a deliberate upload of the **contents** of `outputs/browser-model/` to an accessible Hugging Face model repo, the existing engine can use its model ID:

```js
await lm.load({ device: "auto", dtype: "fp32" }); // lm is useBrowserLM("owner/model-repo")
const result = await lm.generate({
  messages: [{ role: "user", content: "What sort of helper are you?" }],
  temperature: 0, topK: 20, maxNewTokens: 64,
});
```

Use `dtype: "q8"` only if `model_quantized.onnx` was exported. Sending `messages` applies the saved template and avoids duplicated special tokens. For raw-prompt mode supply exactly `User: …\nAssistant:` and check special-token handling. Base and tuned comparisons should use identical prefixes and decoding settings. Never select the standard Instruct model's template for this adapter.

**Nothing was published.** The existing engine accepts Hugging Face IDs, not arbitrary local asset URLs. For the local browser verification I used its worker with only `env.remoteHost` redirected to a loopback asset server and `env.remotePathTemplate = ""` in a temporary wrapper; the shared engine was not edited. `python serve-model.py` serves only the exported model folder at http://127.0.0.1:8766 with CORS for http://localhost:3000. Task A can add an explicit local-host option later if classroom use should avoid publishing or hosting weights on the Hub. A private Hub repo also needs an appropriate authenticated asset-delivery design; no token belongs in client code.

## API references checked

- [SmolLM2 base model card](https://huggingface.co/HuggingFaceTB/SmolLM2-135M)
- [Transformers model loading/saving](https://huggingface.co/docs/transformers/main_classes/model)
- [TRL SFTTrainer: completion-only training and PEFT](https://huggingface.co/docs/trl/sft_trainer)
- [PEFT LoRA](https://huggingface.co/docs/peft/package_reference/lora) and [merge-and-unload](https://huggingface.co/docs/peft/developer_guides/checkpoint)
- [Optimum ONNX export and KV cache](https://huggingface.co/docs/optimum-onnx/onnx/usage_guides/export_a_model)
- [Transformers.js custom models](https://huggingface.co/docs/transformers.js/custom_usage) and [dtypes](https://huggingface.co/docs/transformers.js/guides/dtypes)

The installed library signatures and Transformers.js source were also inspected. The served `/fine-tune` page and all downloads use only files in this task's folders. A deployed standalone Next build must include the sibling `fine-tune/` teaching files; this local-file download route is not a promise that a standalone bundle automatically traces those assets.
