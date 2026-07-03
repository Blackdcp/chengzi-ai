---
title: "How to Configure a Custom API Host in Chatbox"
description: "A practical guide for using your own API key in Chatbox, covering API Host, Base URL, model name, and OpenAI-compatible testing."
date: "2026-07-03"
---

Chatbox is a cross-platform AI client that can connect to different model services. If you use your own API key, the setup usually comes down to API Host, API Key, and model name.

## Check your Chatbox version first

Field names can vary by version. You may see:

- API Host
- API URL
- Base URL
- OpenAI API Host
- Custom Provider

Look at the example next to the field. If it looks like `https://api.openai.com/v1`, use a URL with `/v1`. If it looks like `https://api.openai.com`, use the root URL.

## Recommended setup

If your Chatbox version asks for an OpenAI-compatible endpoint, start with:

```text
API Host / Base URL: https://api.cheng-zi-ai.com/v1
API Key: sk-your-api-key
Model: gpt-5.3-codex
```

If you see a 404 or route-related error, try removing `/v1`:

```text
API Host / Base URL: https://api.cheng-zi-ai.com
```

## Setup steps

1. Open Chatbox settings.
2. Find model service, AI provider, or API settings.
3. Choose OpenAI or a custom OpenAI-compatible service.
4. Paste your API Key.
5. Enter the API Host or Base URL.
6. Enter or select a model name.
7. Save and send a short test prompt.

## Test prompt

```text
Reply with exactly: OK
```

If it returns `OK`, switch to the model you actually want to use. Avoid debugging with expensive models first.

## Common issues

### 401

Check whether the API Key was copied completely, whether it has extra spaces, and whether it was pasted under the right provider.

### 404

The API Host path probably does not match what the client expects. Test whether `/v1` should be included.

### Model not found

Copy the Model ID from the console instead of typing it manually. Some clients separate display names from actual model IDs.

## When to test another client

If your Chatbox version cannot reliably save a custom API Host, test the same key in Cline, Cherry Studio, or NextChat. If it works elsewhere, the key itself is fine.
