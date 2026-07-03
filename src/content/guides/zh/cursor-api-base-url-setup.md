---
title: "Cursor 如何配置 AI API 中转 Base URL"
description: "面向新手的 Cursor API 中转配置教程：准备 API Key、填写 Base URL、选择模型，并排查 401、404、模型不可用等常见错误。"
date: "2026-07-03"
---

Cursor 支持 OpenAI 兼容格式的第三方 API。购买额度并创建 API Key 后，你可以把 Base URL 填到 Cursor 里，用同一个入口调用 GPT、Claude、Gemini 等模型。

## 适合谁

- 想降低 AI Coding 成本的个人开发者
- 已经在用 Cursor，但官方 API 成本偏高
- 想在一个客户端里测试多个模型
- 需要轻量、可随时更换模型的开发环境

## 配置前准备

- 一个可用的 API Key
- OpenAI 兼容 Base URL：`https://api.cheng-zi-ai.com/v1`
- 已安装 Cursor
- 至少一个可用模型名称，例如 `gpt-5.3-codex`

## 配置步骤

1. 打开 Cursor 设置。
2. 找到模型或 API Provider 相关配置。
3. 选择 OpenAI Compatible 或 Custom API。
4. 在 API Key 里填入你的 Key。
5. 在 Base URL 里填入 `https://api.cheng-zi-ai.com/v1`。
6. 选择或填写可用模型名称。
7. 保存后发送一个简单问题测试。

## 常见错误

- `401 Unauthorized`：API Key 填错、复制时多了空格，或 Key 未启用。
- `404 Not Found`：Base URL 少了 `/v1`，或者模型名称填错。
- 模型不可用：当前 Key 没有开放该模型，或模型临时维护。
- 响应慢：切换轻量模型，或避开高峰期测试。

## 额度怎么选

如果只是测试 Cursor 配置，先选小额 API 额度包即可。如果你每天都用 AI Coding，建议选更大的额度包，避免频繁充值影响工作流。

## 风险提示

第三方 API 中转适合个人开发、小团队测试和轻量工作流。不建议用于企业核心生产、医疗、金融、法律等高风险场景。请不要上传敏感密钥、客户数据或未脱敏代码。
