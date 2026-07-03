---
title: "Continue.dev 如何配置 OpenAI 兼容 API"
description: "面向 Continue 用户，说明 config.yaml 里 provider、apiBase、apiKey、model 和 roles 的基本配置方式。"
date: "2026-07-03"
---

Continue.dev 使用 `config.yaml` 管理模型。官方配置参考里，模型可以设置 `provider`、`model`、`apiBase` 和 `roles`，适合接入 OpenAI 兼容 API。

## 配置位置

Continue 新版本主要使用 `config.yaml`。你可以在 Continue 的配置入口里编辑，也可以按官方文档迁移旧的 `config.json`。

## 基础配置示例

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

`apiBase` 用来覆盖默认 API 地址。OpenAI 兼容网关通常使用带 `/v1` 的地址。

## 字段怎么理解

- `name`：你在 Continue 里看到的显示名称。
- `provider`：OpenAI 兼容服务通常先用 `openai`。
- `apiKey`：你的 API Key。
- `apiBase`：自定义 API 地址。
- `model`：真实模型 ID。
- `roles`：这个模型用于聊天、编辑、应用补丁等场景。

## 推荐先只配一个模型

不要一开始就写很多模型。先配置一个模型，确认能聊天、能编辑，再复制配置增加其他模型。

## 常见错误

### 配置保存了但没生效

重启 IDE 或 Continue 插件。配置文件路径、工作区配置和全局配置可能会互相覆盖。

### 401

检查 `apiKey` 是否完整，以及是否被 YAML 缩进或引号影响。

### 404

检查 `apiBase` 是否包含 `/v1`。Continue 的 `apiBase` 示例通常是完整 endpoint。

### 模型不支持工具

如果 Agent 模式需要工具调用，模型能力可能需要在配置里声明或换成支持工具调用的模型。先用普通 Chat 验证，再验证 Agent。

## 使用建议

Continue 更适合代码库阅读、编辑和 Agent 工作流。建议给不同角色配置不同模型：便宜模型做普通问答，强模型做复杂重构。
