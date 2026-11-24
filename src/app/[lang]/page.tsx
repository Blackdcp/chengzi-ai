import { getDictionary } from '../../lib/dictionaries'
import { getProducts } from '../../lib/api'
import { getGuides } from '../../lib/guides'
import { buildProductJsonLd } from '../../lib/productSchema'
import ClientPage from './ClientPage'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const refCode = resolvedSearchParams.ref || ''
  const dict = await getDictionary(resolvedParams.lang)
  const products = getProducts(resolvedParams.lang)
  const activeProducts = products.filter(p => p.inStock && p.actionType !== 'link')
  const guides = getGuides(resolvedParams.lang).slice(0, 4)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dict.header.title,
    url: `https://cheng-zi-ai.com/${resolvedParams.lang}`,
    email: 'chengziai2026@163.com',
    logo: 'https://cheng-zi-ai.com/images/new-api-doc-logo.png',
  }
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.header.title,
    url: `https://cheng-zi-ai.com/${resolvedParams.lang}`,
    inLanguage: resolvedParams.lang === 'zh' ? 'zh-CN' : 'en-US',
  }
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: resolvedParams.lang === 'zh' ? '橙子 AI 官方账号与会员直充在售清单' : 'Orange AI Official Subscriptions & Ready Accounts',
    numberOfItems: activeProducts.length,
    itemListElement: activeProducts.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: buildProductJsonLd(p, resolvedParams.lang),
    })),
  }
  
  const homeFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity:
      resolvedParams.lang === 'zh'
        ? [
            {
              '@type': 'Question',
              name: 'ChatGPT Plus 的 ¥85、¥129、¥149、¥169 四款怎么选？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '追求极致性价比选 ¥85 菲区半价成品号；已有 Gmail 个人免费号想充自己号选 ¥129 菲区官方卡充（可囤5天，低于官方 $20 原价）；需要 iOS 通道选 ¥149 iOS 官方秒充（可囤3天）；想要高权重满周老号选 ¥169 独享老号成品号。',
              },
            },
            {
              '@type': 'Question',
              name: 'ChatGPT Pro 10X / 20X / 50X 和 Codex 点数怎么选？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 10X (¥715卡充/¥725 iOS/¥799成品号) 对应官方 $100 档；Pro 20X (¥1300卡充/¥1420 iOS/¥1250成品号) 对应官方 $200 档，比官价省 ¥150~¥200；Pro 50X (¥3450卡充/¥3580 iOS) 对应官方 $500 顶配档；Codex 250~2500 点数包支持有效付费订阅账号即充即到。',
              },
            },
            {
              '@type': 'Question',
              name: 'Claude Ultra 过 K 成品号 (¥2250) 与 KYC / 门户验证服务怎么选？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '直接上车顶配 $200 档选 Claude Ultra 过 K 成品号 (¥2250)，1-2天交付保障首登及30天订阅；已有账号触发验证选 KYC 验证 (¥125) 或门户验证 (¥329)，UU 远程一对一协助，失败或过程中封号全额退款。',
              },
            },
            {
              '@type': 'Question',
              name: 'Gemini Pro 3个月代开 (¥45) 与 Gemini Ultra 5X (¥699) / 20X (¥1180) 有什么区别？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Gemini Pro 3个月代开 (¥45) 含 5TB 云存且支持反重力4，但无质保不退款；Gemini Ultra 5X (¥699) 与 20X (¥1180，比官价立省 ¥270) 为官方 iOS 直充，享 5x/20x 旗舰算力与订阅质保。',
              },
            },
          ]
        : [
            {
              '@type': 'Question',
              name: 'How to choose between ChatGPT Plus ¥85, ¥129, ¥149, and ¥169?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pick ¥85 (PH Ready Account) for lowest-cost turnkey access; ¥129 (PH Card Top-up, 5-day stockable) to recharge your own Gmail below $20 USD; ¥149 for iOS top-up; or ¥169 for a 1+ week aged ready account.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do ChatGPT Pro 10X, 20X, 50X, and Codex Credits compare?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 10X (¥715 card / ¥725 iOS / ¥799 ready) is the $100 tier; Pro 20X (¥1300 card / ¥1420 iOS / ¥1250 ready) is the $200 tier; Pro 50X (¥3450 card / ¥3580 iOS) is the $500 flagship. Codex 250–2500 credit packs top up active paid accounts instantly.',
              },
            },
            {
              '@type': 'Question',
              name: 'Gemini Pro 3-Month (¥45) vs Gemini Ultra 5X (¥699) / 20X (¥1180)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Gemini Pro 3-Month (¥45) includes 5TB storage & Antigravity 4 (as-is, no warranty). Gemini Ultra 5X (¥699) and 20X (¥1180, saving ¥270 vs $199.99 USD) are official iOS top-ups with subscription warranty.',
              },
            },
          ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <ClientPage dict={dict} products={products} guides={guides} lang={resolvedParams.lang} refCode={refCode as string} />
    </>
  )
}
