---
title: "API Base URL、API Key、模型名常见报错排查"
description: "遇到 401、404、Model Not Found、Connection Error 时，按这个顺序检查 OpenAI 兼容 API 和 Claude Code 配置。"
date: "2026-07-03"
---

API 接不通时，不要一上来就换模型。大多数问题出在三个地方：Base URL、API Key、模型名。

## 先判断你用的是哪类客户端

### OpenAI 兼容客户端

例如 Cline、ChatBox、NextChat、Cherry Studio、很多自建应用。通常填写：

- Base URL：`https://api.cheng-zi-ai.com/v1`
- API Key：`sk-...`
- Model ID：控制台里的模型名

### Claude Code

Claude Code 使用 Anthropic 风格环境变量，通常填写：

- `ANTHROPIC_BASE_URL=https://api.cheng-zi-ai.com`
- `ANTHROPIC_AUTH_TOKEN=sk-...`
- `ANTHROPIC_MODEL=claude-opus-4-8`

关键区别：OpenAI 兼容客户端一般带 `/v1`，Claude Code 的 `ANTHROPIC_BASE_URL` 一般不带 `/v1`。

## 推荐排查顺序

1. 确认 Base URL 是否写对。
2. 确认 Key 是否完整复制，没有多余空格。
3. 确认 Model ID 来自控制台，而不是自己猜。
4. 用一个很短的测试提示词验证。
5. 再检查余额、权限、限速。

## 401 或 Invalid API Key

常见原因：

- Key 少复制了开头或结尾。
- Key 已经删除或禁用。
- 把 API Key 填到了错误的位置。
- Claude Code 里同时存在 `ANTHROPIC_API_KEY` 和 `ANTHROPIC_AUTH_TOKEN`，旧变量覆盖了新变量。

处理方式：

1. 重新复制 Key。
2. 清掉旧变量或旧客户端配置。
3. 重新保存后再测试。

## 404、Model Not Found 或模型不存在

常见原因：

- 模型名手打错误。
- 该 Key 没有该模型权限。
- 客户端自动改写了模型名。
- Base URL 填错，访问到了另一个服务。

处理方式：从控制台复制模型名，先用一个明确可用的模型测试，再切换到更贵或更强的模型。

## Connection Error 或 Network Error

常见原因：

- OpenAI 兼容客户端漏写 `/v1`。
- Claude Code 误加了 `/v1`。
- 本地网络或代理拦截。
- 客户端缓存了旧配置。

处理方式：先关闭客户端重新打开，再用最小配置测试。

## 快速自检

OpenAI 兼容客户端应该像这样：

```text
Base URL: https://api.cheng-zi-ai.com/v1
API Key: sk-your-api-key
Model ID: gpt-5.3-codex
```

Claude Code 应该像这样：

```text
ANTHROPIC_BASE_URL=https://api.cheng-zi-ai.com
ANTHROPIC_AUTH_TOKEN=sk-your-api-key
ANTHROPIC_MODEL=claude-opus-4-8
```

如果你不确定是哪一类客户端，先看它是否要求你选择 OpenAI Compatible Provider。要求选这个的，通常走 OpenAI 兼容配置。
