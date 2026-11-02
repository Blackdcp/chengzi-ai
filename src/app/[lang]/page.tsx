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
      <ClientPage dict={dict} products={products} guides={guides} lang={resolvedParams.lang} refCode={refCode as string} />
    </>
  )
}
