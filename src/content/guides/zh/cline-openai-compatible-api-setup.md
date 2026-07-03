---
title: "Cline 如何配置 OpenAI Compatible API"
description: "一步步说明 Cline 里 OpenAI Compatible Provider 的 Base URL、API Key、Model ID 应该怎么填，以及常见验证方法。"
date: "2026-07-03"
---

Cline 支持 OpenAI Compatible Provider。对 API 中转服务来说，这是最常用、也最不容易和 Claude Code 配置混淆的一种接入方式。

## 适合什么场景

- 你在 VS Code、Cursor、Windsurf 或其他编辑器里使用 Cline。
- 你想用同一个 API Key 调用多个模型。
- 你手里有 OpenAI 兼容格式的 Base URL。
- 你不想分别配置 OpenAI、Anthropic、Google 的官方 Key。

## 需要准备什么

- API Key：从控制台创建并复制。
- Base URL：`https://api.cheng-zi-ai.com/v1`。
- Model ID：从控制台复制可用模型名，例如 `gpt-5.3-codex`、`claude-opus-4-8`、`gemini-3.1-pro-high`。

> 注意：Cline 的 OpenAI Compatible Provider 一般需要带 `/v1`。这和 Claude Code 的 `ANTHROPIC_BASE_URL` 不一样。

## 配置步骤

1. 打开 Cline 面板。
2. 进入 Settings。
3. API Provider 选择 OpenAI Compatible。
4. Base URL 填 `https://api.cheng-zi-ai.com/v1`。
5. API Key 填你的 Key。
6. Model ID 填控制台里的模型名。
7. 保存后发送一句简单测试消息。

## 推荐先测试什么

可以先发一个低成本测试：

```text
Reply with exactly: OK
```

如果能正常返回 `OK`，说明 Base URL、Key、模型名这三项大概率没有问题。

## 常见错误

### Invalid API Key

通常是 Key 粘贴错误、Key 已过期，或者填到了错误的 Provider 里。先重新复制 Key，再确认 Provider 是 OpenAI Compatible。

### Model Not Found

通常是模型名写错，或者该 Key 没有这个模型权限。不要手打模型名，尽量从控制台复制。

### Connection Error

检查 Base URL 是否带 `/v1`，以及本地网络是否能访问该域名。如果你把 Claude Code 的 Base URL 复制过来，可能会少 `/v1`。

## 和 Claude Code 的区别

- Cline OpenAI Compatible：Base URL 用 `https://api.cheng-zi-ai.com/v1`。
- Claude Code：`ANTHROPIC_BASE_URL` 通常用 `https://api.cheng-zi-ai.com`，不要加 `/v1`。

如果你两个工具都在用，建议分别保存配置，不要来回复制同一套参数。
