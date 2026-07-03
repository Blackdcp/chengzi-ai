---
title: "Cherry Studio 如何添加自定义服务商"
description: "说明 Cherry Studio 自定义服务商里的提供商类型、API 密钥、API 地址和模型管理该怎么填。"
date: "2026-07-03"
---

Cherry Studio 适合把多个模型和多个服务商放在一个桌面客户端里统一管理。它的官方文档支持添加自定义服务商，并配置 API 密钥、API 地址和模型 ID。

## 什么时候用自定义服务商

- 你要接入自己的 API 网关。
- 你希望一个客户端里管理多组模型。
- 你使用 NewAPI、OneAPI 或 OpenAI 兼容服务。
- 你想手动控制可用模型列表。

## 添加服务商

1. 打开 Cherry Studio 设置。
2. 进入模型服务。
3. 点击添加服务商。
4. 提供商名称可以写 `Cheng Zi AI`。
5. 提供商类型优先选择 OpenAI。
6. 保存后进入该服务商的详细配置。

## 填写 API Key 和 API 地址

Cherry Studio 的不同服务商类型对 API 地址的处理可能不同。建议先按这个方式填：

```text
API 密钥: sk-your-api-key
API 地址: https://api.cheng-zi-ai.com
```

如果检查失败，并且错误像是路径缺失，再尝试：

```text
API 地址: https://api.cheng-zi-ai.com/v1
```

不要把 Cline 的配置机械复制过来。Cline 常用 `/v1`，Cherry Studio 某些服务商类型会自己拼接路径。

## 添加模型

在模型管理里手动添加模型 ID，例如：

```text
gpt-5.3-codex
claude-opus-4-8
gemini-3.1-pro-high
```

添加后打开服务商右上角开关，再回到聊天界面选择对应模型。

## 常见错误

### 检查 Key 失败

先确认服务商类型是不是 OpenAI，再确认 API 地址有没有多余路径。Cherry Studio 的“检查”按钮可以帮助判断 Key 是否有效。

### 模型添加了但不能用

检查模型 ID 是否来自控制台，服务商开关是否打开，以及当前会话是否真的切换到了这个服务商。

### 和 NewAPI / OneAPI 的区别

如果你用的是 NewAPI 或 OneAPI 类型，界面可能会要求根地址；如果用自定义 OpenAI 类型，某些版本可能接受 `/v1`。以实际检查结果为准。
