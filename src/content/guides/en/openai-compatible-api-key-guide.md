---
title: "OpenAI-Compatible API Key Client Setup"
description: "Learn the three core fields for OpenAI-compatible API clients: API Key, Base URL, and model name, with setup notes for Cline, ChatBox, and NextChat."
date: "2026-07-03"
---

Many AI clients support OpenAI-compatible APIs. In most cases, setup comes down to three fields: API Key, Base URL, and model name.

## The three core fields

- API Key: created in the console and used for authentication.
- Base URL: OpenAI-compatible clients usually use `https://api.cheng-zi-ai.com/v1`.
- Model name: for example `gpt-5.3-codex`, `claude-opus-4-8`, or `gemini-3.1-pro-high`.

## Cline setup idea

1. Open Cline settings.
2. Choose OpenAI Compatible as the provider.
3. Paste your API Key.
4. Set Base URL to `https://api.cheng-zi-ai.com/v1`.
5. Paste an available model name from the console.

## ChatBox setup idea

1. Choose a custom provider.
2. Select OpenAI API as the interface type.
3. Set Base URL to `https://api.cheng-zi-ai.com/v1`.
4. Save and send a short test message.

## NextChat setup idea

NextChat usually supports custom API endpoints. Enter the OpenAI-compatible Base URL and your API Key, then select a model.

## How to know it works

- The client returns text normally.
- The console shows usage logs.
- The billed model matches your selected model.
- You no longer see 401, 404, or model-not-found errors.

## Common mistakes

- Mixing Claude Code settings with OpenAI-compatible client settings.
- Forgetting `/v1` in the Base URL.
- Guessing model names instead of copying them from the console.
- Using an expired or inactive key.
