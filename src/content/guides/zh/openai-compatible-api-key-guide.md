---
title: "OpenAI 兼容 API Key 怎么接入常见客户端"
description: "解释 OpenAI 兼容 API 的 Base URL、API Key、模型名三要素，并说明 Cline、ChatBox、NextChat 等客户端的接入思路。"
date: "2026-07-03"
---

很多 AI 客户端支持 OpenAI 兼容 API。你只需要填对三个东西：API Key、Base URL、模型名称。

## 三个核心参数

- API Key：在控制台创建，用于鉴权。
- Base URL：OpenAI 兼容客户端通常使用 `https://api.cheng-zi-ai.com/v1`。
- 模型名称：例如 `gpt-5.3-codex`、`claude-opus-4-8`、`gemini-3.1-pro-high`。

## Cline 接入思路

1. 打开 Cline 设置。
2. Provider 选择 OpenAI Compatible。
3. 填入 API Key。
4. Base URL 填 `https://api.cheng-zi-ai.com/v1`。
5. 模型名填控制台可用模型。

## ChatBox 接入思路

1. 设置中选择自定义服务商。
2. 接口类型选择 OpenAI API。
3. Base URL 填 `https://api.cheng-zi-ai.com/v1`。
4. 保存后发一句简单消息测试。

## NextChat 接入思路

NextChat 通常支持自定义接口地址。把接口地址填成 OpenAI 兼容 Base URL，并设置你的 API Key 即可。

## 如何判断配置成功

- 能正常返回文本。
- 控制台能看到调用记录。
- 扣费模型和你选择的模型一致。
- 错误信息不再是 401、404 或模型不存在。

## 常见误区

- 把 Claude Code 的 Base URL 和 OpenAI 兼容客户端混用。
- 只填域名，漏掉 `/v1`。
- 模型名称凭感觉写，而不是从控制台复制。
- 使用过期或未启用的 Key。
