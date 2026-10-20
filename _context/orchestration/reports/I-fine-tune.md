---
task: "I. Fine-tune notebook (stretch)"
thread_id: "01a15577-9146-7a60-93b9-1202eacfc49f"
agent: "Codex"
started_in: "/Users/mk/Development/mk-27/apps/the-notebook"
resume: "codex resume 01a15577-9146-7a60-93b9-1202eacfc49f  (run from /Users/mk/Development/mk-27/apps/the-notebook)"
ran: "18:41–19:18 UTC, 2026-10-19"
status: "done (the local run and ONNX check are real; the Colab run was never done)"
written_by: "a Claude Code subagent, from the transcript and the repo, on 2026-10-19; not written by the thread itself"
---

## What I built

Task I, a LoRA fine-tune notebook for SmolLM2-135M base, plus the `/fine-tune` page that explains it. Everything is in `apps/mk-chatbot-experiments`.

At the repo root, in `fine-tune/`:

- `fine-tune.ipynb`: 18 cells, output-free. Installs pinned dependencies (skippable), loads and validates the dialogues, captures the base model's replies to six prompts, trains a LoRA adapter with TRL `SFTTrainer` (completion-only loss), shows base vs fine-tuned replies side by side on the same prompts, saves the adapter and a merged model, and has an optional cell that exports ONNX (float32 and dynamic q8). Five of the six comparison prompts are new; the last is a labeled training example.
- `dialogues/sample.json`: fifty invented dialogues in a deliberately repetitive "pocket workshop" voice ("Pocket note: … Try: …"). `dialogues/template.json`: three blank `{"user": "", "assistant": ""}` objects; it is meant to fail validation until filled in.
- `README.md` (141 lines): Colab steps, how to write dialogues, Apple-silicon setup, the observed local run, the ONNX verdict, a handoff to task A.
- `validation.md`: the thread's own measurement record (timings, versions, ONNX and Chrome results, app checks).
- `run-notebook.py` (runs the delivered notebook headlessly with nbclient), `export-onnx.py` (packages the merged model for Transformers.js), `check-transformers-js.mjs` (Node generation check), `serve-model.py` (loopback server on 127.0.0.1:8766 for the exported folder), `requirements.txt` (pinned: torch 2.14.1, transformers 4.57.6, peft 0.21.2, trl 1.16.0, datasets 5.0.1, accelerate 1.15.0, optimum 2.1.0, optimum-onnx 0.1.0), and `.gitignore` (`.venv/`, `outputs/`, `.cache/`, `*.safetensors`, `*.onnx`, `*.onnx_data`, and so on).

In the Next app:

- `nextjs/app/fine-tune/page.jsx` and `fine-tune.css`: replace the "Not built yet" panel with instructions and download links.
- `nextjs/app/fine-tune/files/[asset]/route.js`: serves four downloads (notebook, sample, template, README) from `fine-tune/`; a handler test in the thread showed 404 for `.env`, `model.safetensors`, and a traversal-shaped name.
- `nextjs/content/experiments/fine-tune.md`: `status: working`, rewritten into what was built.

## How to try it

Open http://localhost:3000/fine-tune and click "Download the notebook" (and the sample or template). Then either upload `fine-tune.ipynb` to Colab (File, Upload notebook; Runtime, Change runtime type, GPU; run the cells in order; upload one dialogues JSON when asked), or run it locally per the README (`python3.12 -m venv .venv`, `pip install -r requirements.txt`, `python run-notebook.py`; env overrides `FINE_TUNE_STEPS`, `FINE_TUNE_DATA`, `FINE_TUNE_EXPORT_ONNX=1`).

`OPENROUTER_API_KEY`: not needed (this task uses no OpenRouter). Checked on 2026-10-19: `/fine-tune` returns 200; `nextjs/.env.local` exists but is empty.

## Commits

- `100fc4d` "Build and validate SmolLM2 LoRA teaching notebook" (2026-10-19 15:17 -0400 = 19:17 UTC, author mkuzmick). Fifteen files, 679 insertions: all of the above. Verified in `git log --stat`. Not pushed.
- `git status` shows nothing uncommitted for `fine-tune/`, `nextjs/app/fine-tune/`, or the experiment doc.
- The thread did **not** write `_context/reports/I-fine-tune.md` (rule 8); this file is the late substitute.

## What I couldn't do or didn't check

**Run locally on this Mac (measured, M3, 24 GiB, Python 3.12.9, Metal/mps, float32), per `outputs/metrics.json` and `validation.md`:**

- Notebook executed top to bottom twice with the sample data (80 steps, batch 4, rank 16, all linear layers, about 6.15 passes). First run: model load 90.0 s (includes download), training 24.3 s, whole notebook 145.0 s. Second run (cached weights, ONNX cell on): load 28.7 s, training 19.8 s, ONNX plus q8 14.7 s, whole notebook 88.0 s. Trainable parameters 4,884,480 (3.50%); training loss 1.576. Dependency install excluded from these times.
- Results: the base model repeats itself; the tuned model picks up "Pocket note:" and "Try:" on all six prompts, but also produces nonsense ("pick a smallton") and copies its training answer verbatim for the training-set prompt. The thread says plainly that this shows style and memorization, not capability.
- ONNX export with Optimum succeeded (opset 18, `text-generation-with-past`). It emitted tracing warnings and a numerical-tolerance warning (max logit difference 0.0013 to 0.0044 against a default tolerance of 1e-5). Float32 in Transformers.js 4.3.1 under Node matched all six PyTorch replies exactly; the q8 graph ran but changed all six replies. Graph sizes: float32 539,285,833 bytes, q8 221,521,561 bytes, adapter about 19.6 MB, merged safetensors about 538 MB.

**Never run:**

- **Colab was never run.** The "30–120 seconds on a T4-class GPU" figure, and "several minutes" for installs, is an estimate from the model size, sequence length (at most 46 tokens) and the M3 time. The README and doc label it an estimate. The Colab-specific parts (the `pip install` cell on a clean Colab runtime, the file-upload cell, the `torch>=2.6` check, whether the pinned transformers 4.57.6 and optimum versions install cleanly there) are untested. The notebook was only ever executed through `run-notebook.py` with the install cell skipped.
- No dialogues written by someone other than the agent were tried, and only the sample set was trained on. The template-to-JSON flow (a student filling in the blanks) was not exercised end to end beyond validation checks.
- Only one prompt was tried in Chrome through the browser engine; float32 was browser-tested on WASM only; other browsers were not tested. No production build was run.

**Was the ONNX export loaded by task A's engine?** Yes, with a workaround. The thread imported task A's real `lib/browser-lm/worker.js` in a temporary wrapper that redirected only `env.remoteHost`, `env.remotePathTemplate` and browser caching to a loopback server (`serve-model.py`), and ran it from a temporary route `nextjs/app/fine-tune/onnx-check/` (and the existing `/engine` page was used to look at the engine first). Results through A's worker for the comic prompt: fp32/WASM matched the PyTorch reply, 18 tokens at 21.2 tokens/s, EOS seen; q8/WASM ran (35 tokens, 23.7 tokens/s) with different wording; q8/WebGPU ran (29 tokens, 5.8 tokens/s) with different wording. Times exclude loading. The temporary route was deleted before the commit (an empty `nextjs/app/fine-tune/onnx-check/` directory remains on disk; git does not track it). Engine A was not edited. Checked on 2026-10-19: `/engine` returns 200 and `nextjs/lib/browser-lm` exists in the repo (commit `1bcbae6`).

Packaging fact found along the way: Transformers.js 4.3.1 reads the chat template from `tokenizer_config.json`, not from the `chat_template.jinja` that Python saves, so `export-onnx.py` copies it in.

**Would students need Python or a Hugging Face token?**

- On Colab: no local Python, since the notebook runs in the browser and `pip install`s its own dependencies. A Google account and a GPU runtime are needed (a free GPU is not guaranteed). No Hugging Face login or token for the public base weights `HuggingFaceTB/SmolLM2-135M` (the README says so; not verified on Colab).
- Locally: Python 3.12 and a virtual environment (about 1.1 GB for the venv), plus the pinned requirements.
- To use the result in the browser via engine A: the engine accepts only Hugging Face model IDs, so the merged ONNX folder (about 540 MB, or 222 MB for q8) would have to be uploaded to a Hub repo, which needs a Hugging Face account and a write token (a private repo also needs an auth path in the engine, which does not exist). The thread published nothing and left this unresolved. Training itself needs no token.

**Gitignored local artifacts (checked on 2026-10-19, sizes from `du`):** `fine-tune/.venv` 1.1 GB; `fine-tune/.cache` 260 MB (Hugging Face model cache); `fine-tune/outputs` 1.7 GB (adapter 23 MB, merged 518 MB, onnx-export 519 MB, browser-model 730 MB, plus metrics and comparison JSON and `executed.ipynb`). About 3 GB in total, all ignored by `fine-tune/.gitignore` (verified with `git check-ignore`). The notebook was generated by `/private/tmp/build-fine-tune-notebook.py`, which is outside the repo and not committed, so the committed `.ipynb` is the only source: edit it directly.

## For other tasks

- **A (engine)**: it works with the fine-tuned model, but only via a Hub model ID. The thread suggests adding an explicit local or custom-host option if classroom use should avoid publishing weights. Send `messages` (so the saved template is applied) and use `dtype: "fp32"` as the reference, `"q8"` only if `model_quantized.onnx` exists. For raw prompts the exact training prefix is `User: …\nAssistant:` (plus a space before the answer in training). Do not apply the Instruct template to this adapter. Task A's worker leaves EOS visible as `<|endoftext|>`.
- **C (spiral room) and D (building the assistant by hand)**: the same base model and the "User:/Assistant:" format are the thing this notebook turns into an assistant; the doc links to `/spiral`.
- **K (use the screenshots) and the glossary tasks**: the fine-tune doc does not appear to link glossary entries (not checked beyond a grep); a pass linking experiments to the glossary could add them.

## Marlon's words

None beyond the task prompt.

## Decisions and open questions

- Plain `User:`/`Assistant:` labels rather than the Instruct chat template, so students can read the format; completion-only loss including EOS.
- Pinned Transformers 4.57.6 (4.x) because optimum-onnx 0.1.0 constrains it; Colab may ship something newer, so the pinned install may downgrade it.
- 80 steps at learning rate 0.001, rank 16, chosen for a visible effect in seconds; this heavily overfits (loss 1.58, verbatim recall of training answers). Whether that is the right classroom demonstration is Marlon's call.
- The sample voice ("pocket workshop") is the agent's invention; Marlon may want a different one.
- Open: where to host merged models for class (Hub repo versus a local-host option in the engine), and whether to run the notebook once on real Colab before using it in teaching.
