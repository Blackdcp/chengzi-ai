---
title: "Chatbox 如何配置自定义 API Host"
description: "说明 Chatbox 使用自有 API Key 时，API Host、Base URL、模型名应该怎么判断，并给出 OpenAI 兼容 API 的测试方法。"
date: "2026-07-03"
---

Chatbox 是常见的跨平台 AI 客户端，适合把多个模型集中到一个聊天界面里使用。如果你想用自己的 API Key，核心还是三件事：API Host、API Key、模型名。

## 先看你的 Chatbox 版本

不同版本的字段名可能略有差异，常见叫法包括：

- API Host
- API URL
- Base URL
- OpenAI API Host
- Custom Provider

不要只看字段名，要看它旁边的示例。如果示例类似 `https://api.openai.com/v1`，通常要填带 `/v1` 的地址；如果示例类似 `https://api.openai.com`，通常只填根地址。

## 推荐配置

如果你的 Chatbox 版本要求 OpenAI-compatible endpoint，可以先使用：

```text
API Host / Base URL: https://api.cheng-zi-ai.com/v1
API Key: sk-your-api-key
Model: gpt-5.3-codex
```

如果测试时出现 404 或路径相关错误，再尝试去掉 `/v1`：

```text
API Host / Base URL: https://api.cheng-zi-ai.com
```

## 配置步骤

1. 打开 Chatbox 设置。
2. 找到模型服务、AI Provider 或 API 设置。
3. 选择 OpenAI 或自定义 OpenAI-compatible 服务。
4. 填入 API Key。
5. 填入 API Host / Base URL。
6. 手动填写或选择模型名。
7. 保存后发送一句短测试。

## 测试提示词

```text
Reply with exactly: OK
```

能返回 `OK`，再切换到你真正要用的模型。不要一开始就用高价模型做排错。

## 常见问题

### 返回 401

优先检查 API Key 是否复制完整，是否多了空格，是否填到了错误的服务商里。

### 返回 404

大概率是 API Host 路径不匹配。重点测试 `/v1` 要不要加。

### 模型不存在

不要手打模型名，从控制台复制 Model ID。不同客户端会把“显示名称”和“模型 ID”分开，真正请求时用的是模型 ID。

## 什么时候该换工具

如果 Chatbox 的当前版本无法稳定保存自定义 API Host，可以先用 Cline、Cherry Studio 或 NextChat 测试同一个 Key。只要其他客户端能通，说明 API Key 本身没问题。
