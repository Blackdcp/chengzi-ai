import { getDictionary } from '../../lib/dictionaries'
import { getProducts } from '../../lib/api'
import { getGuides } from '../../lib/guides'
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
      item: {
        '@type': 'Product',
        name: p.title,
        description: p.subtitle,
        url: `https://cheng-zi-ai.com/${resolvedParams.lang}/products/${p.id}`,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'CNY',
          availability: 'https://schema.org/InStock',
        },
      },
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
              name: 'ChatGPT Pro 5X (¥688) 与 Pro 200刀 (¥1200) / 500刀 (¥3280) 有什么区别？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 5X (¥688/¥699) 对应官方 $100 档，低于官方汇率价；Pro 200刀 (¥1200) 立省 ¥250+，支持卡密囤 3 天；智利区 500刀 (¥3280) 专享 25X 顶配极限算力（严禁使用微软邮箱）。',
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
              name: 'Gemini Pro 18个月成品号为什么只要 ¥45？怎么防封？',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '该商品为附带 2-3 年老 Gmail 的独享账号，已预开通 18 个月 Gemini Pro 会员（折合 ¥2.5/月）。首次登录后严禁立即改密，需用固定纯净美国 IP 正常使用 3-7 天后再更换 2FA。',
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
              name: 'What is the difference between Pro 5X (¥688), Pro $200 (¥1200), and Pro 25X $500 (¥3280)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pro 5X (¥688/¥699) is the $100 tier below USD exchange rates; Pro $200 (¥1200) saves ¥250+ with 3-day stockable keys; Pro 25X $500 (¥3280) unlocks 25X flagship compute.',
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
