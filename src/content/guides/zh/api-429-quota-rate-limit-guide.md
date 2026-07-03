---
title: "API 429、额度不足、限速错误怎么处理"
description: "解释 429、insufficient quota、rate limit、余额不足等错误的区别，以及 API 中转服务里应该如何排查。"
date: "2026-07-03"
---

API 能连上但突然不能用，最常见的是 429、额度不足或限速。它们看起来都像“请求失败”，但处理方式不一样。

## 先区分三类问题

### 额度不足

关键词可能是：

- insufficient quota
- balance not enough
- quota exceeded
- 余额不足
- 额度不足

这类问题说明 Key 能鉴权，但账户没有足够额度或该模型额度不足。

### 限速

关键词可能是：

- rate limit
- too many requests
- requests per minute
- tokens per minute
- 429

这类问题说明服务收到了请求，但短时间内请求太密集。

### 模型权限不足

关键词可能是：

- model not allowed
- model not found
- no permission
- unauthorized model

这类问题不一定是余额问题，可能是 Key 没有该模型权限。

## 推荐排查顺序

1. 先看错误里有没有 `401`，如果有，优先查 Key。
2. 再看是否出现 `quota`、`balance`、`额度`。
3. 如果出现 `rate limit` 或 `429`，降低并发和请求频率。
4. 如果出现 `model not found`，换一个已确认可用的模型测试。
5. 最后再看客户端是否缓存了旧 Key。

## 临时处理方法

- 降低并发任务数量。
- 暂停自动重试或循环请求。
- 换更便宜的模型完成简单任务。
- 等待一段时间后再重试。
- 检查是否有其他客户端共用同一个 Key。

## 长期处理方法

- 给重度工具单独创建 Key。
- 给 Cline、Claude Code、Chatbox 分别配置不同 Key。
- 记录哪个工具消耗最高。
- 给高价模型设置使用场景，不要默认所有任务都用最强模型。

## 什么时候需要补额度

如果报错明确是 quota、balance 或余额不足，就不是 Base URL 问题，也不是客户端问题。此时应该检查平台额度，或者购买新的 API 额度包。

## 不建议的处理

不要看到 429 就立刻换 Base URL。Base URL 错误通常是 404、连接失败或无法解析；429 更像是请求频率、额度或限制问题。
