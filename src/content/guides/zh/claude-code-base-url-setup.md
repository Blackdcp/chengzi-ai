---
title: "Claude Code 如何配置 API Key 和 Base URL"
description: "Claude Code 接入第三方 API 的配置说明，包含 ANTHROPIC_AUTH_TOKEN、ANTHROPIC_BASE_URL、模型变量和 PowerShell 示例。"
date: "2026-07-03"
---

Claude Code 的配置方式和普通 OpenAI 兼容客户端不同。关键点是：Base URL 不加 `/v1`，密钥变量优先使用 `ANTHROPIC_AUTH_TOKEN`。

## 配置前准备

- 一个可用的 API Key
- Claude Code 已安装
- Base URL：`https://api.cheng-zi-ai.com`
- 推荐模型：`claude-opus-4-8` 或 `claude-sonnet-4-6`

## PowerShell 临时配置

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

然后运行：

```powershell
claude -p "Reply with exactly: OK" --model claude-opus-4-8
```

## 持久化配置

可以把配置写入 `%USERPROFILE%\.claude\settings.json`：

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

## 常见错误

- Base URL 写成了 `/v1`：Claude Code 这里不要加 `/v1`。
- 同时存在 `ANTHROPIC_API_KEY`：可能覆盖你的新配置，建议先移除。
- 模型名错误：确认控制台里该模型可用。
- Key 无权限：检查 Key 是否启用 Claude 系列模型。

## 使用建议

Claude Code 更适合复杂代码阅读、重构和长上下文任务。如果只是轻量补全或普通问答，可以使用更便宜的模型，降低额度消耗。
