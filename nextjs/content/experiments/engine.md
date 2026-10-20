---
title: The browser engine
description: "The test bench for the small language models that run in your browser: pick a model, a device, and a prompt, and watch it generate token by token."
route: /engine
status: working
group: "Under the hood"
order: 5
---

## What it is

The engine under `/gpt-2` and `/by-hand` (task A): small open models (GPT-2, SmolLM2, Gemma 270M, Qwen3 0.6B) loaded into the browser with Transformers.js and run on WebGPU or WASM. No server and no key: the model is downloaded once and cached by your browser.

## How to use it

Choose a model and press load; the first load downloads it (GPT-2 is about 130 MB, SmolLM2-135M about 140 MB). Set a prompt, temperature, top-k, and a token limit, then generate. **Chat** wraps the prompt in the model's chat template, for the instruct models. The device choice shows what your machine can do: on Marlon's laptop WASM ran about 23 tokens a second and WebGPU 8 to 10 (verify on your own machine).

## Why it is on the list

This is the raw material. Everything on `/gpt-2` and `/by-hand` is this page with the controls hidden and a story put in front of it.
