# SEO Keyword Validation Plan

Last updated: 2026-07-03

## Position

The current guide keywords are seed hypotheses, not proven search demand from Cheng Zi AI's own analytics yet.

They are still worth testing because they match the product surface we sell: OpenAI-compatible API access, API keys, base URLs, Cursor, Claude Code, Cline, and client setup. But we should not call a keyword "real demand" until it is backed by search console data, Baidu data, support/order messages, or repeated public-market evidence.

## Evidence Levels

| Level | Meaning | Minimum Evidence | Action |
| --- | --- | --- | --- |
| Verified | Real demand from our own audience or search exposure | Google Search Console/Baidu query has impressions or clicks, or 2+ real user/order/support mentions | Build or improve the target page |
| Weak Verified | The use case exists publicly, but we do not yet know our site's demand | Official product docs, public help pages, GitHub issues, forum threads, autocomplete, or Trends comparison | Keep as test page; submit and monitor |
| Hypothesis | Inferred from product fit and likely buyer workflow | Product page, competitor pattern, or common setup step only | Do not scale content until validated |
| Reject | Poor commercial fit or no evidence after testing | No impressions after indexation window, no support mentions, irrelevant intent | Do not write more pages for this cluster |

## Primary Data Sources

| Source | What It Proves | How To Use |
| --- | --- | --- |
| Google Search Console Performance | Queries, pages, clicks, impressions, CTR, average position | Export weekly by query and page; promote any query with impressions into the table |
| Baidu Search Resource Platform | Chinese search indexing, traffic, and keyword signals | Submit sitemap/URLs and check "流量与关键词" after indexing |
| Orders and support messages | Buyer language and conversion intent | Tag messages by client/tool, problem, model, and error text |
| On-site analytics | Which SEO pages lead to clicks, checkout, or email contact | Track guide visits and CTA clicks to `/api-service` |
| Public docs and community signals | Confirms the setup scenario exists outside our imagination | Use only as weak evidence until our own site has data |
| Google Trends/autocomplete | Relative search interest and real-search suggestion signal | Use for prioritization, not as exact volume |

## Official References Checked

These references do not prove Cheng Zi AI has traffic yet. They prove the target workflows are real enough to justify a small test batch.

| Topic | Evidence | Status |
| --- | --- | --- |
| Search Console as the truth source for query/page performance | Google documents that the Performance report shows queries, pages, clicks, impressions, CTR, and average position | Verified data source |
| Google Trends as public search-interest evidence | Google states Trends uses anonymized, categorized, aggregated samples of actual Google searches; low-volume terms can show zero | Weak public signal |
| Baidu URL submission and keyword tools | Baidu provides URL submission plus "流量与关键词"; submission can speed discovery but does not guarantee indexing | Verified submission source |
| Claude Code base URL/gateway workflow | Claude Code docs list `ANTHROPIC_BASE_URL` for routing through a proxy or gateway | Weak verified keyword cluster |
| Cline OpenAI-compatible setup | Cline docs require Base URL, API Key, and Model ID for OpenAI-compatible providers | Weak verified keyword cluster |
| Cline Anthropic/custom base URL setup | Cline docs include optional custom base URL when configuring Anthropic | Weak verified keyword cluster |
| OpenAI-compatible API usage | Cline API docs describe an OpenAI-compatible Chat Completions endpoint and a single base URL | Weak verified keyword cluster |
| Cherry Studio custom provider setup | Cherry Studio docs describe custom providers with provider type, API key, API address, and model management | Weak verified keyword cluster |
| Continue.dev OpenAI-compatible setup | Continue config reference documents `provider`, `model`, `apiBase`, and a custom OpenAI-compatible example | Weak verified keyword cluster |
| NextChat custom OpenAI base URL | NextChat README documents `OPENAI_API_KEY` and `BASE_URL` for overriding OpenAI API requests | Weak verified keyword cluster |
| Chatbox custom API use | Chatbox official site positions it as an AI client compatible with many models/APIs and supports using your own API key | Weak public signal |

Reference URLs:

- Google Search Console Performance report: https://support.google.com/webmasters/answer/7576553
- Google Trends data FAQ: https://support.google.com/trends/answer/4365533
- Baidu Search Resource Platform URL submission: https://ziyuan.baidu.com/linksubmit/index
- Claude Code environment variables: https://code.claude.com/docs/en/env-vars
- Cline OpenAI-compatible provider setup: https://docs.cline.bot/provider-config/openai-compatible
- Cline Anthropic / Claude Code setup: https://docs.cline.bot/provider-config/anthropic
- Cline API overview: https://docs.cline.bot/api/overview
- Cherry Studio custom provider setup: https://docs.cherry-ai.com/pre-basic/providers/zi-ding-yi-fu-wu-shang
- Continue.dev config reference: https://docs.continue.dev/reference
- NextChat README: https://github.com/ChatGPTNextWeb/NextChat
- Chatbox official site: https://chatboxai.app/en

## Current Page Map

| Cluster | Candidate Queries | Current Target URL | Evidence Level | Why It Exists | Next Validation |
| --- | --- | --- | --- | --- | --- |
| Cursor custom API setup | `cursor api base url`, `cursor openai compatible api`, `cursor 自定义 api`, `cursor base url 怎么填` | `/zh/guides/cursor-api-base-url-setup` and `/en/guides/cursor-api-base-url-setup` | Hypothesis | Cursor users are a likely API-service buyer segment, but we have not validated query demand yet | Check GSC/Baidu after sitemap submission; manually inspect SERP/autocomplete before adding more Cursor pages |
| Claude Code base URL | `claude code base url`, `ANTHROPIC_BASE_URL`, `claude code api proxy`, `claude code 中转 api` | `/zh/guides/claude-code-base-url-setup` and `/en/guides/claude-code-base-url-setup` | Weak Verified | Official docs confirm the base URL/gateway configuration exists | Watch impressions for `claude code`, `base url`, `api proxy`, and Chinese variants |
| OpenAI-compatible API key | `openai compatible api key`, `openai 兼容 api`, `api key base url`, `中转 api key 怎么用` | `/zh/guides/openai-compatible-api-key-guide` and `/en/guides/openai-compatible-api-key-guide` | Weak Verified | Many clients use Base URL + API Key + Model ID patterns; Cline docs explicitly describe this | Track whether users land here before viewing `/api-service` |
| Cline OpenAI-compatible setup | `cline openai compatible`, `cline base url`, `cline api key`, `cline 中转 api` | `/zh/guides/cline-openai-compatible-api-setup` and `/en/guides/cline-openai-compatible-api-setup` | Weak Verified | Official Cline docs confirm this is a real setup workflow | Watch impressions and CTA clicks before writing more Cline pages |
| API Base URL troubleshooting | `api base url error`, `invalid api key`, `model not found`, `base url 报错`, `模型不存在` | `/zh/guides/api-base-url-troubleshooting` and `/en/guides/api-base-url-troubleshooting` | Hypothesis | This matches repeated setup failure patterns, but we still need our own support/search evidence | Promote to Verified if support messages or GSC queries mention these errors |
| Chatbox custom API Host | `chatbox api host`, `chatbox openai api`, `chatbox custom api`, `chatbox 中转 api` | `/zh/guides/chatbox-custom-api-host-setup` and `/en/guides/chatbox-custom-api-host-setup` | Weak Verified | Official site confirms API-client/use-your-own-key positioning; field names may vary by version | Watch impressions and support questions before making more Chatbox pages |
| NextChat custom API Base URL | `nextchat base url`, `nextchat custom api`, `nextchat OPENAI_API_KEY`, `nextchat 中转 api` | `/zh/guides/nextchat-custom-api-base-url` and `/en/guides/nextchat-custom-api-base-url` | Weak Verified | NextChat README documents `BASE_URL` and `OPENAI_API_KEY` | Watch if self-hosting queries convert to API-service clicks |
| Cherry Studio custom provider | `cherry studio api`, `cherry studio 自定义服务商`, `cherry studio openai`, `cherry studio 中转 api` | `/zh/guides/cherry-studio-custom-provider-setup` and `/en/guides/cherry-studio-custom-provider-setup` | Weak Verified | Official docs confirm custom provider setup with API key/address/model management | Check Chinese impressions and CTA clicks |
| Continue.dev OpenAI-compatible setup | `continue.dev apiBase`, `continue openai compatible`, `continue api key`, `continue.dev 中转 api` | `/zh/guides/continue-dev-openai-compatible-api-setup` and `/en/guides/continue-dev-openai-compatible-api-setup` | Weak Verified | Official config reference confirms `apiBase` and OpenAI-compatible examples | Watch developer-search traffic and CTA clicks |
| 429/quota/rate-limit troubleshooting | `api 429`, `rate limit api`, `insufficient quota`, `额度不足`, `限速错误` | `/zh/guides/api-429-quota-rate-limit-guide` and `/en/guides/api-429-quota-rate-limit-guide` | Hypothesis | Common high-intent API failure pattern, but not yet proven from our logs | Promote if support messages repeat these errors |
| Purchase/activation support | `api 兑换码`, `平台额度兑换码`, `openai api 购买后怎么用`, `api-service credit code` | `/zh/api-service` and `/en/api-service` | Hypothesis | High conversion value, but queries may be branded/support rather than acquisition | Track order/support questions; add FAQ only when repeated |

## Content Architecture Rules

- The homepage is a featured-entry page, not the full guide library.
- `/zh/guides` and `/en/guides` are the full crawlable guide indexes.
- Every new guide must be linked from the relevant guide index and included in `sitemap.xml`.
- Keep the homepage guide section limited to a small curated set so the UI does not collapse when we scale to 50 or 100 guides.
- When publishing a batch, update category grouping if a new topic cluster appears.

## Weekly Workflow

1. Submit `https://cheng-zi-ai.com/sitemap.xml` to Google Search Console and Baidu Search Resource Platform.
2. Submit all twenty guide URLs individually if the platforms allow URL inspection/submission.
3. After 7 days, export GSC Performance by Query and Page for the last 7 days.
4. After 14 days, classify each keyword cluster:
   - Keep/improve: impressions > 0 or support/order mentions exist.
   - Wait: indexed but no meaningful impressions yet.
   - Reject: not indexed, irrelevant queries, or no signs after repeated checks.
5. In an aggressive sprint, publish up to 5 new topic clusters per batch, with zh/en versions for each cluster.
6. Do not publish another batch until the previous batch is submitted, indexed checks are started, and CTA tracking is confirmed.
7. For every guide, record CTA clicks to `/api-service`; traffic without conversion intent should not dominate the roadmap.

## Next Content Queue

| Priority | Page | Publish Condition | Notes |
| --- | --- | --- | --- |
| Published | Cline OpenAI-compatible API setup | Built as a weak-verified test page | Watch query impressions and CTA clicks |
| Published | API Base URL troubleshooting checklist | Built as a broad support/conversion test page | Promote only if real error queries or support messages appear |
| Published | Chatbox custom API Host setup | Built as a weak public-signal test page | Watch version-specific field queries |
| Published | NextChat custom API Base URL setup | Built as a weak-verified self-hosting page | Watch if self-hosting users click through |
| Published | Cherry Studio custom provider setup | Built as a weak-verified Chinese-client page | Watch Chinese impressions closely |
| Published | Continue.dev OpenAI-compatible setup | Built as a weak-verified developer page | Watch developer-search traffic |
| Published | 429/quota/rate-limit troubleshooting | Built as a broad support/conversion test page | Promote only if real error/support data appears |
| P4 | API credit code activation guide | 2+ buyer questions about兑换码/平台额度/API service activation | More support/conversion than SEO |

## Decision Rules

- Do not create a new guide only because a tool name is popular.
- Prefer "tool + setup problem" pages over generic AI news or broad model keywords.
- A good page should answer one job: configure, fix, compare, or buy.
- Use official docs for technical facts; use our own logs/search data for demand claims.
- Kill or merge pages that attract irrelevant informational traffic with no API-service intent.
