---
title: "How to Configure a Custom OpenAI API Base URL in NextChat"
description: "A setup guide for self-hosted NextChat users covering OPENAI_API_KEY, BASE_URL, model names, and OpenAI-compatible API gateways."
date: "2026-07-03"
---

NextChat is often used as a self-hosted web or desktop AI assistant. Its server environment variables include `OPENAI_API_KEY` and `BASE_URL`, which makes it suitable for OpenAI-compatible API gateways.

## Who this is for

- You self-host NextChat.
- You want OpenAI requests to go through a custom API gateway.
- You need a shared entry point for yourself or a team.
- You want one key to manage multiple models.

## Core environment variables

A typical setup looks like this:

```text
OPENAI_API_KEY=sk-your-api-key
BASE_URL=https://api.cheng-zi-ai.com
```

In NextChat's README, `BASE_URL` overrides the OpenAI API request base URL, whose default is `https://api.openai.com`. In most self-hosted setups, this should be the root URL rather than the `/v1` endpoint used by some local clients.

## Redeploy after changing variables

If you update environment variables on Vercel, Zeabur, or another platform, redeploy the app. Saving variables without redeploying may leave the app using old settings.

## Model names

The visible model list may come from configuration, built-in defaults, or server-side forwarding logic. Start with a known available model:

```text
gpt-5.3-codex
```

If you use Claude or Gemini models through an API gateway, make sure the gateway exposes them as OpenAI-compatible model IDs.

## Common errors

### The app loads, but requests fail

Confirm that server-side environment variables are active. Self-hosted apps often run with old variables after a UI-only update.

### 401

Check that `OPENAI_API_KEY` is complete, not truncated by the deployment platform, and not wrapped in extra quotes.

### 404

Check the `BASE_URL`. NextChat commonly expects the root URL. If `/v1` fails, try the root URL.

## Practical advice

NextChat is closer to a deployed app than a local client like Cline. Keep a small change log for key, Base URL, and model-list edits so you can roll back quickly.
