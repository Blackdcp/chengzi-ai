---
title: "NextChat 如何配置自定义 OpenAI API 地址"
description: "面向自部署 NextChat 用户，说明 OPENAI_API_KEY、BASE_URL、模型名和 OpenAI 兼容 API 的配置方式。"
date: "2026-07-03"
---

NextChat 常用于自部署网页端或桌面端 AI 助手。它的服务端环境变量里有 `OPENAI_API_KEY` 和 `BASE_URL`，适合接入 OpenAI 兼容 API。

## 适合什么用户

- 你自己部署了 NextChat。
- 你想把 OpenAI 请求转到自定义 API 网关。
- 你需要给团队或自己提供统一入口。
- 你想通过一个 Key 管理多个模型。

## 核心环境变量

常见配置如下：

```text
OPENAI_API_KEY=sk-your-api-key
BASE_URL=https://api.cheng-zi-ai.com
```

NextChat 的官方 README 里 `BASE_URL` 是用来覆盖 OpenAI API 请求地址的变量，默认是 `https://api.openai.com`。所以这里通常填写根地址，而不是客户端里常见的 `/v1` 地址。

## 部署后要重新发布

如果你在 Vercel、Zeabur 或其他平台改了环境变量，通常需要重新部署。只保存变量不重新部署，页面可能还在用旧配置。

## 模型怎么填

NextChat 前端可见的模型列表，可能来自配置、内置列表或服务端转发逻辑。建议先用一个已确认可用的模型测试：

```text
gpt-5.3-codex
```

如果你要用 Claude 或 Gemini 模型，确认你的网关已经把这些模型映射成 OpenAI 兼容的模型 ID。

## 常见错误

### 页面能打开，但请求失败

检查服务端环境变量是否生效。自部署应用经常出现“前端是新版本，服务端环境变量还是旧的”的情况。

### 401

检查 `OPENAI_API_KEY` 是否完整，部署平台有没有把变量值截断，是否复制了多余引号。

### 404

优先检查 `BASE_URL` 是否填成了错误路径。NextChat 的 `BASE_URL` 常用根地址，如果你填了 `/v1` 后失败，可以改回根地址。

## 配置建议

NextChat 更像一个自部署应用，不像 Cline 那样只是本地客户端。改配置时建议保留一份变更记录：什么时候改了 Key、改了 Base URL、改了模型列表。这样出问题时能快速回滚。
