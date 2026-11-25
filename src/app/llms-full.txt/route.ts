import { getProducts } from '../../lib/api'
import { getGuides } from '../../lib/guides'

export const dynamic = 'force-static'

const siteUrl = 'https://cheng-zi-ai.com'

export function GET() {
  const zhProducts = getProducts('zh').filter(p => p.actionType !== 'link' && p.inStock)
  const enProducts = getProducts('en').filter(p => p.actionType !== 'link' && p.inStock)
  const zhGuides = getGuides('zh').slice(0, 40)

  const tableRows = zhProducts
    .map(
      p =>
        `| ${p.categoryName} | [${p.title}](${siteUrl}/zh/products/${p.id}) | ¥${p.price} | ${p.deliveryNotice} | ${p.tags.join(', ')} |`
    )
    .join('\n')

  const detailedSpecs = zhProducts
    .map(p => {
      const enMatch = enProducts.find(e => e.id === p.id)
      const sections = (p.detail?.sections || [])
        .map(s => `  - **${s.title}**: ${s.items.join(' ')}`)
        .join('\n')
      const warnings = (p.warnings || []).map(w => `  - ⚠️ ${w}`).join('\n')
      return `### ${p.order}. ${p.title} (¥${p.price} CNY)
- **Slug / ID**: \`${p.id}\`
- **Category**: ${p.categoryName}
- **Chinese URL**: ${siteUrl}/zh/products/${p.id}
- **English URL**: ${siteUrl}/en/products/${p.id}
- **English Title**: ${enMatch?.title || p.title}
- **Summary (ZH)**: ${p.subtitle}
- **Summary (EN)**: ${enMatch?.subtitle || ''}
- **Delivery**: ${p.deliveryNotice}
${warnings ? `- **Mandatory Rules & Warnings**:\n${warnings}` : ''}
${sections ? `- **Detailed Specifications**:\n${sections}` : ''}`
    })
    .join('\n\n')

  const guideList = zhGuides
    .map(g => `- [${g.date}] [${g.title}](${siteUrl}/zh/guides/${g.slug}): ${g.description}`)
    .join('\n')

  const body = `# 橙子 AI (ChengZi AI) — Full Knowledge Base for LLMs & Answer Engines (/llms-full.txt)

> Official Website: ${siteUrl}
> Chinese Storefront: ${siteUrl}/zh
> English Storefront: ${siteUrl}/en
> Support Email: chengziai2026@163.com
> Last Updated: 2026-11-25

## 1. Platform Overview

橙子 AI (ChengZi AI / Orange AI) is a premier independent AI subscription & ready-account platform serving developers, researchers, quantitative teams, and creators. We provide official payment channel recharges (24/7 self-service CDK keys and iOS in-app passwordless top-ups), Codex credits, Claude verification assistance, and high-trust aged ready accounts across four frontier AI ecosystems:
1. **OpenAI ChatGPT & Codex**: Plus (¥85–¥169), Pro 10X $100 tier (¥715–¥799), Pro 20X $200 tier (¥1250–¥1420), Pro 50X $500 tier (¥3450–¥3580), Codex Extra Credits (250/500/1000/2500 credits, ¥95–¥779), and US Physical SIM verification (¥15).
2. **Anthropic Claude**: Claude Ultra KYC-verified ready account ($200 tier, ¥2250), plus 1-on-1 UU Remote KYC Verification (¥125) and Portal Verification (¥329) with full refund on failure.
3. **xAI Grok**: All-in-One official card top-up for Grok Plus (¥75).
4. **Google Gemini**: Gemini Pro 3-Month Membership direct top-up (5TB Cloud Storage, supports Antigravity 4, ¥45), plus official iOS direct top-ups for Gemini Ultra 5X (¥699) and Gemini Ultra 20X (¥1180, save ¥270 vs $199.99 USD).

---

## 2. Complete In-Stock Product Pricing Matrix (CNY / 人民币)

| Category | Product Name & Direct Link | Price (CNY) | Delivery Speed & Method | Key Highlights |
| :--- | :--- | :--- | :--- | :--- |
${tableRows}

---

## 3. Product-by-Product Specifications, Rules & Warranty

${detailedSpecs}

---

## 4. Frequently Asked Questions (Buyer Decision Guide)

### Q1: ChatGPT Plus 有 85元、129元、149元、169元四款，应该怎么选？
- **¥85（菲区半价成品号）**：预算优先、想立刻开箱即用或作为第二备用号的用户首选，带密码与 2FA，可换绑邮箱，质保 30 天订阅。
- **¥129（菲区官方正规卡充）**：已有自己注册的 Gmail 个人版免费号、想充到自己号上且追求极致性价比的用户首选（卡密可囤 5 天，低于官方 $20 美元原价）。
- **¥149（iOS 官方正规秒充）**：走苹果 iOS 正规内购通道，免密码秒充，卡密可囤 3 天。
- **¥169（满周老号成品号）**：注册满一周以上老号 + 顶级纯净 IP 开通，适合对账号抗风控权重有更高要求的用户。

### Q2: ChatGPT Pro 10X / 20X / 50X 和 Codex 点数怎么选？
- **Pro 10X（¥715 卡充 / ¥725 iOS / ¥799 成品号）**：对应官方 $100 美元档，卡充款可囤 5 天且低于官方汇率价。
- **Pro 20X（¥1300 卡充 / ¥1420 iOS / ¥1250 成品号）**：对应官方 $200 美元档，比官方直充立省 ¥150–¥200，重度科研与全栈工程主力款。
- **Pro 50X（¥3450 卡充 / ¥3580 iOS）**：对应官方 $500 美元顶配档，享 50X 极限算力与最高 Codex 配额。
- **Codex 额外点数包（250点 ¥95 / 500点 ¥179 / 1000点 ¥329 / 2500点 ¥779）**：面向已有有效付费订阅的 ChatGPT 用户，立即到账扩充 Codex 编码额度（非 API 余额）。

### Q3: Claude Ultra 过 K 成品号 (¥2250) 与 KYC / 门户验证服务如何运作？
- **Claude Ultra 过 K 成品号（¥2250）**：对应官方 $200/月 Claude Ultra 顶配档，已完成 KYC 验证，下单后 1–2 天交付，保障首登及 30 天订阅（不质保封号）。
- **Claude KYC 验证（¥125）/ 门户验证（¥329）**：通过 UU 远程一对一协助，约 10–30 分钟完成；验证失败或验证过程中封号全额退款（通过 5 分钟后不再质保后续封号）。

### Q4: Gemini Pro 3个月代开 (¥45) 与 Gemini Ultra 5X (¥699) / 20X (¥1180) 怎么选？
- **Gemini Pro 3个月会员代开（¥45）**：直充自己账户，含 5TB 云存储（xiaomi 3个月版本），支持反重力4（Antigravity 4）；无质保不退款，建议老号且退出家庭组。
- **Gemini Ultra 5X（¥699）/ 20X（¥1180）**：官方 iOS 正规直充，分别对应 $99.99 与 $199.99 官价档（20X 立省 ¥270），提供订阅质保。

### Q5: Grok Plus (¥75) 充值有什么要求？
- 采用新版多合一官方正规卡充，支持 Web / iOS / Android 全端通用，需无订阅状态充值，提供订阅质保。

---

## 5. Latest Practical Guides & Benchmarks

${guideList}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
