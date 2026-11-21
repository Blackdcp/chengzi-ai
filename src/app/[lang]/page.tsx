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
              name: 'ChatGPT Plus 的 ¥79、¥125、¥145、¥165 四款怎么选？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '追求极致性价比选 ¥79 菲区半价成品号；已有 Gmail 个人免费号想充自己号选 ¥125 菲区官方卡充（比官方 $20 省 20 元）；需要覆盖已有 Plus 选 ¥145 iOS 官方秒充；想要高权重满周老号选 ¥165 独享老号成品号。',
              },
            },
            {
              '@type': 'Question',
              name: 'ChatGPT Pro 5X (¥688) 与 Pro 200刀 (¥1300) / 500刀 (¥3280) 有什么区别？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 5X (¥688/¥699) 对应官方 $100 档，低于官方汇率价；Pro 200刀 (¥1300) 立省 ¥250+，支持卡密囤 3 天；智利区 500刀 (¥3280) 专享 25X 顶配极限算力（严禁使用微软邮箱）。',
              },
            },
            {
              '@type': 'Question',
              name: 'Claude Pro (¥159) 和 MAX 5X (¥999) 充值需要提供密码吗？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '不需要，支持 SK 充值与 Claude UID 免密直充，1-3 分钟到账。充值 MAX 5X 需满 30 天老号且有历史订阅记录。',
              },
            },
            {
              '@type': 'Question',
              name: 'Gemini Pro 3个月会员代开 (¥45) 有什么要求与注意事项？有质保吗？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '【无质保与不退声明】：此产品不做任何质保，掉订阅/封号均不在质保范围内；不会用或嫌麻烦请勿下单，以不会使用或不想要了为由申请售后一律不退；【充值前提】：充值前必须确认账户已退出家庭组且无有效会员；【强烈建议老号】：新号非常脆弱极易触发 Google 常用设备或封禁风控，由于充值引发的人机验证概不负责；【安全提示】：代开完成后请及时修改密码或 2FA。',
              },
            },
          ]
        : [
            {
              '@type': 'Question',
              name: 'How to choose between ChatGPT Plus ¥79, ¥125, ¥145, and ¥165?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pick ¥79 (PH Ready Account) for lowest-cost turnkey access; ¥125 (PH Card Top-up) to recharge your own Gmail account below $20 USD; ¥145 for iOS top-up; or ¥165 for a 1+ week aged ready account.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between Pro 5X (¥688), Pro $200 (¥1300), and Pro 25X $500 (¥3280)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 5X (¥688/¥699) is the $100 tier below USD exchange rates; Pro $200 (¥1300) saves ¥250+ with 3-day stockable keys; Pro 25X $500 (¥3280) unlocks 25X flagship compute.',
              },
            },
            {
              '@type': 'Question',
              name: 'What are the rules and precautions for Gemini Pro 3-Month Top-up (¥45)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sold as-is with NO warranty (subscription drops and account bans are not covered; no personal refunds supported). Pre-requisites: confirm account has exited family groups with no active subscriptions. Aged accounts are strongly recommended as new accounts easily trigger Google risk checks. Change password/2FA immediately after completion.',
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
