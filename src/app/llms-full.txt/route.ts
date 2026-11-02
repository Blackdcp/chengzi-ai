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
> Last Updated: 2026-11-02

## 1. Platform Overview

橙子 AI (ChengZi AI / Orange AI) is a premier independent AI subscription & ready-account platform serving developers, researchers, quantitative teams, and creators. We provide official payment channel recharges (24/7 self-service CDK keys and iOS in-app passwordless top-ups) and high-trust aged ready accounts across four frontier AI ecosystems:
1. **OpenAI ChatGPT**: Plus (¥79–¥165), Pro 5X $100 tier (¥688–¥699), Pro $200 tier (¥1200), Pro 25X $500 Chile tier (¥3280), and US Physical SIM verification (¥15).
2. **Anthropic Claude**: Claude Pro iOS SK/UID passwordless top-up (¥159) and Claude MAX 5X iOS UID top-up (¥999).
3. **xAI Grok**: All-in-One official card top-ups for Grok Plus (¥75), Grok Premium (¥129), Grok Super (¥399), and Grok Ultra (¥799).
4. **Google Gemini**: Gemini Pro 18-Month pre-activated membership on 2–3 year aged Gmail accounts (¥45 total, equivalent to ¥2.5/month).

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

### Q1: ChatGPT Plus 有 79元、125元、145元、165元四款，应该怎么选？
- **¥79（菲区半价成品号）**：预算优先、想立刻开箱即用或作为第二备用号的用户首选，带密码与 2FA，可换绑邮箱，质保 30 天订阅。
- **¥125（菲区官方正规卡充）**：已有自己注册的 Gmail 个人版免费号、想充到自己号上且追求极致性价比的用户首选（比官方 $20 美元原价还省 20 元），不支持覆盖在期订阅。
- **¥145（iOS 官方正规秒充）**：1:1 持平官方美元汇率，走苹果 iOS 正规内购通道，支持覆盖已有 Plus。
- **¥165（满周老号成品号）**：注册满一周以上老号 + 顶级纯净 IP 开通，适合对账号抗风控权重有更高要求的用户。

### Q2: ChatGPT Pro 5X (¥688/¥699)、Pro 200刀 (¥1200) 和 Pro 500刀智利款 (¥3280) 有什么区别？
- **Pro 5X（¥688 卡充 / ¥699 iOS）**：对应官方 $100 美元档（官方汇率约 ¥725，本站直降 ¥37），提供 5 倍于 Plus 的高阶推理与 Codex 额度，iOS 款支持直接覆盖升级现有 Plus（补充 4X 额度差额）。
- **Pro 200刀（¥1200 官方卡充）**：对应官方 $200 美元档（比官方汇率立省 ¥250+），可囤卡 3 天，重度科研与全栈工程主力款。
- **Pro 25X 智利区 500刀（¥3280 官方卡充）**：对应官方 $500 美元顶配档（比官方汇率立省 ¥345），享有 25X 极限算力配额，严禁使用微软邮箱（需使用 Gmail）。

### Q3: Claude Pro (¥159) 和 Claude MAX 5X (¥999) 充值需要提供密码吗？需要注意什么？
- **全程无需提供账号密码**：支持 SK 充值（自动检测账号健康度）或 Claude UID 免密自助秒充，1–3 分钟到账。
- **Claude MAX 5X 四大硬性条件**：① 账号必须注册满 30 天以上（新号禁止充 MAX）；② 历史必须订阅过 Claude 会员（纯白号不充）；③ 当前会员已到期且无逾期未结账单；④ 官方对 MAX 档位 100% 触发 KYC 认证，需用户自行完成 KYC 验证后正常到账。

### Q4: Gemini Pro 18个月成品号为什么只要 ¥45？如何防封养号？
- 该商品为已开通 18 个月 Google Gemini Pro 会员的 2–3 年高品质老 Gmail 独享账号（折合每月仅 ¥2.5，支持 Gemini 2.5 Pro、NotebookLM Plus、Veo 视频生成）。
- **核心防封铁律**：首次登录后**严禁立即修改密码**！请先在固定设备与稳定纯净美国 IP 下正常使用 3–7 天，随后优先通过 Google 账户后台的「Change Authenticator（更改身份验证器）」替换为您自己的 2FA，稳定 7–30 天后再改密或绑定辅助邮箱。

### Q5: Grok Plus (¥75) / Premium (¥129) / Super (¥399) / Ultra (¥799) 充值有什么要求？
- 全系采用新版多合一官方正规卡充，支持 Web / iOS / Android 全端通用，提供 30 天全程订阅质保。
- 其中 Premium、Super 与 Ultra 要求您的 Grok 账号当前处于**免费版无订阅状态**且享有官方**半价（50% OFF）优惠资格**，下单后 1–3 分钟自助秒充到账。

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
