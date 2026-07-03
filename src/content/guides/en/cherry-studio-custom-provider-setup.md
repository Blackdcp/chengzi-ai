---
title: "How to Add a Custom Provider in Cherry Studio"
description: "A practical Cherry Studio setup guide for provider type, API key, API address, and model management."
date: "2026-07-03"
---

Cherry Studio is useful when you want one desktop client to manage multiple models and providers. Its official docs support custom providers with API key, API address, and model ID configuration.

## When to use a custom provider

- You want to connect your own API gateway.
- You manage multiple model groups in one client.
- You use NewAPI, OneAPI, or an OpenAI-compatible service.
- You want to manually control the available model list.

## Add the provider

1. Open Cherry Studio settings.
2. Go to Model Service.
3. Add a provider.
4. Name it `Cheng Zi AI`.
5. Choose OpenAI as the provider type first.
6. Save and open the provider's detailed settings.

## Fill API key and API address

Different Cherry Studio provider types may handle API paths differently. Start with:

```text
API Key: sk-your-api-key
API Address: https://api.cheng-zi-ai.com
```

If the check fails and the error looks path-related, try:

```text
API Address: https://api.cheng-zi-ai.com/v1
```

Do not mechanically copy your Cline settings. Cline often uses `/v1`, while some Cherry Studio provider types append paths internally.

## Add models

In model management, add model IDs manually, for example:

```text
gpt-5.3-codex
claude-opus-4-8
gemini-3.1-pro-high
```

After adding models, enable the provider switch and select the model from the chat screen.

## Common errors

### Key check fails

Confirm the provider type is OpenAI, then check whether the API address has the right path. Cherry Studio's check button helps validate the key.

### Model is added but not usable

Check that the model ID came from the console, that the provider switch is enabled, and that the current chat is actually using this provider.

### NewAPI / OneAPI differences

If you use NewAPI or OneAPI provider types, the UI may expect a root address. If you use a custom OpenAI provider, some versions may accept `/v1`. Follow the actual check result.
