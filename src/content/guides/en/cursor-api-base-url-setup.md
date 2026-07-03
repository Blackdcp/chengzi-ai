---
title: "How to Configure an AI API Base URL in Cursor"
description: "A practical Cursor setup guide for third-party OpenAI-compatible API services: API Key, Base URL, model selection, and common 401 / 404 fixes."
date: "2026-07-03"
---

Cursor can work with OpenAI-compatible third-party APIs. After buying credit and creating an API Key, you can use one endpoint to test GPT, Claude, Gemini, and coding models.

## Who this is for

- Developers who want lower AI coding costs
- Cursor users testing multiple model families
- Small teams that need lightweight AI coding workflows
- Users who want a simple API credit setup

## What you need

- A valid API Key
- OpenAI-compatible Base URL: `https://api.cheng-zi-ai.com/v1`
- Cursor installed
- A model name such as `gpt-5.3-codex`

## Setup steps

1. Open Cursor settings.
2. Find model or API provider settings.
3. Select OpenAI Compatible or Custom API.
4. Paste your API Key.
5. Set Base URL to `https://api.cheng-zi-ai.com/v1`.
6. Enter an available model name.
7. Save and send a short test prompt.

## Common errors

- `401 Unauthorized`: wrong API Key, extra spaces, or inactive key.
- `404 Not Found`: missing `/v1` or incorrect model name.
- Model unavailable: the selected model is not enabled for the key.
- Slow response: try a lighter model or test outside peak hours.

## Which credit pack should you choose?

Start small if you only need to test Cursor. Choose a larger credit pack if you use AI coding every day and want fewer top-ups.

## Risk note

Third-party API relay services are best for personal development, small-team testing, and lightweight workflows. Avoid uploading sensitive keys, customer data, or unreleased source code.
