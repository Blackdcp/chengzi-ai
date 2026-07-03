---
title: "Continue.dev OpenAI-Compatible API Setup"
description: "A Continue.dev setup guide covering config.yaml, provider, apiBase, apiKey, model, and roles."
date: "2026-07-03"
---

Continue.dev uses `config.yaml` to manage models. Its official config reference supports model fields like `provider`, `model`, `apiBase`, and `roles`, which makes it suitable for OpenAI-compatible APIs.

## Where to configure

Newer Continue setups use `config.yaml`. You can edit it from Continue's configuration UI or migrate from the older `config.json` format following the official docs.

## Basic config example

```yaml
name: Cheng Zi AI
version: 1.0.0
schema: v1
models:
  - name: GPT Coding
    provider: openai
    apiKey: sk-your-api-key
    apiBase: https://api.cheng-zi-ai.com/v1
    model: gpt-5.3-codex
    roles:
      - chat
      - edit
      - apply
```

`apiBase` overrides the default API base. OpenAI-compatible gateways usually use a `/v1` endpoint.

## Field meanings

- `name`: display name inside Continue.
- `provider`: use `openai` for OpenAI-compatible services first.
- `apiKey`: your API key.
- `apiBase`: custom API base URL.
- `model`: actual model ID.
- `roles`: whether the model is used for chat, edit, apply, and related workflows.

## Start with one model

Do not configure many models at once. Add one model, verify chat and edit work, then duplicate the block for other models.

## Common errors

### Config saved but not active

Restart the IDE or Continue extension. Workspace and global configs can override each other.

### 401

Check that `apiKey` is complete and not broken by YAML indentation or quotes.

### 404

Check whether `apiBase` includes `/v1`. Continue's `apiBase` examples are usually full endpoints.

### Agent tools do not work

If Agent mode needs tool use, the model may need explicit capabilities or a tool-capable model. Test normal chat first, then Agent mode.

## Practical advice

Continue is best for codebase reading, editing, and agent workflows. Use cheaper models for everyday chat and stronger models for complex refactoring.
