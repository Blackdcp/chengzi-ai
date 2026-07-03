---
title: "How to Configure Claude Code with API Key and Base URL"
description: "Claude Code setup notes for third-party API endpoints, including ANTHROPIC_AUTH_TOKEN, ANTHROPIC_BASE_URL, model variables, and PowerShell examples."
date: "2026-07-03"
---

Claude Code is configured differently from regular OpenAI-compatible clients. The key points: do not add `/v1` to the Base URL, and use `ANTHROPIC_AUTH_TOKEN` for the token.

## What you need

- A valid API Key
- Claude Code installed
- Base URL: `https://api.cheng-zi-ai.com`
- Recommended model: `claude-opus-4-8` or `claude-sonnet-4-6`

## Temporary PowerShell setup

```powershell
$env:ANTHROPIC_AUTH_TOKEN="sk-your-api-key"
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
$env:ANTHROPIC_BASE_URL="https://api.cheng-zi-ai.com"
$env:ANTHROPIC_MODEL="claude-opus-4-8"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5-20251001"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-6"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-8"
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
```

Then run:

```powershell
claude -p "Reply with exactly: OK" --model claude-opus-4-8
```

## Persistent setup

You can write the settings to `%USERPROFILE%\.claude\settings.json`:

```json
{
  "model": "claude-opus-4-8",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.cheng-zi-ai.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-your-api-key",
    "ANTHROPIC_MODEL": "claude-opus-4-8",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5-20251001",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-8",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

## Common mistakes

- Adding `/v1` to the Claude Code Base URL.
- Keeping an old `ANTHROPIC_API_KEY` environment variable.
- Typing a model name manually instead of copying it from the console.
- Using a key that does not allow Claude-family models.

## Usage advice

Claude Code is strong for large codebases, refactoring, and long-context tasks. Use lighter models for simple edits or short questions to reduce credit usage.
