---
title: "How to Configure an OpenAI-Compatible API in Cline"
description: "A practical Cline setup guide for OpenAI Compatible Provider, including Base URL, API Key, Model ID, and common verification checks."
date: "2026-07-03"
---

Cline supports an OpenAI Compatible Provider. For API gateway users, this is usually the cleanest setup path because it only needs a Base URL, an API Key, and a Model ID.

## When to use this setup

- You use Cline in VS Code, Cursor, Windsurf, or another supported editor.
- You want one API key to access multiple model families.
- Your provider exposes an OpenAI-compatible Base URL.
- You do not want to configure separate official keys for OpenAI, Anthropic, and Google.

## What you need

- API Key: create and copy it from the console.
- Base URL: `https://api.cheng-zi-ai.com/v1`.
- Model ID: copy an available model name from the console, such as `gpt-5.3-codex`, `claude-opus-4-8`, or `gemini-3.1-pro-high`.

> Note: Cline's OpenAI Compatible Provider usually needs `/v1`. This is different from Claude Code's `ANTHROPIC_BASE_URL`.

## Setup steps

1. Open the Cline panel.
2. Go to Settings.
3. Choose OpenAI Compatible as the API Provider.
4. Set Base URL to `https://api.cheng-zi-ai.com/v1`.
5. Paste your API Key.
6. Enter a model name from the console.
7. Save and send a short test prompt.

## What to test first

Use a small test prompt:

```text
Reply with exactly: OK
```

If it returns `OK`, your Base URL, API Key, and model name are probably correct.

## Common errors

### Invalid API Key

The key may be copied incorrectly, expired, or entered under the wrong provider. Copy the key again and confirm the provider is OpenAI Compatible.

### Model Not Found

The model name may be wrong, or the key may not have permission for that model. Copy the model ID from the console instead of typing it manually.

### Connection Error

Check that the Base URL includes `/v1` and that your network can reach the endpoint. If you copied a Claude Code Base URL, it may be missing `/v1`.

## Difference from Claude Code

- Cline OpenAI Compatible: use `https://api.cheng-zi-ai.com/v1`.
- Claude Code: `ANTHROPIC_BASE_URL` usually uses `https://api.cheng-zi-ai.com` without `/v1`.

If you use both tools, keep the two configurations separate.
