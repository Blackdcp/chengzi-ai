import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '../../../lib/dictionaries'
import { getProducts } from '../../../lib/api'
import type { Product } from '../../../types/product'

type ProductsIndexPageProps = {
  params: Promise<{ lang: 'zh' | 'en' }>
}

type ProductGroup = {
  id: string
  title: string
  description: string
  products: Product[]
}

const siteUrl = 'https://cheng-zi-ai.com'
const languages = ['zh', 'en'] as const

const copy = {
  zh: {
    title: 'AI 账号会员与 API 额度产品索引',
    description: '橙子 AI 的账号、会员和 API 额度服务索引，集中展示 ChatGPT、Gemini 与 API 额度等可抓取产品详情入口。',
    kicker: '可购买服务',
    home: '返回首页',
    apiService: '查看 API 服务',
    viewDetails: '查看详情',
    from: '起',
    groups: {
      gpt: {
        title: 'GPT 账号与会员',
        description: 'ChatGPT Plus、Pro、成品号和续费相关服务。',
      },
      gemini: {
        title: 'Gemini 账号',
        description: 'Gemini Pro 年卡和相关账号服务。',
      },
      other: {
        title: '其他服务',
        description: '暂未归类的可购买服务。',
      },
    },
  },
  en: {
    title: 'AI Accounts and API Credit Products',
    description: 'A crawlable index of ChengZi AI accounts, memberships, and API credit entry points.',
    kicker: 'Available services',
    home: 'Back home',
    apiService: 'View API service',
    viewDetails: 'View details',
    from: 'from',
    groups: {
      gpt: {
        title: 'GPT Accounts and Memberships',
        description: 'ChatGPT Plus, Pro, ready accounts, and renewal services.',
      },
      gemini: {
        title: 'Gemini Accounts',
        description: 'Gemini Pro annual cards and related account services.',
      },
      other: {
        title: 'Other Services',
        description: 'Available services that are not categorized yet.',
      },
    },
  },
} satisfies Record<'zh' | 'en', {
  title: string
  description: string
  kicker: string
  home: string
  apiService: string
  viewDetails: string
  from: string
  groups: Record<string, { title: string; description: string }>
}>

export const dynamicParams = false

export function generateStaticParams() {
  return languages.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: ProductsIndexPageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const pageCopy = copy[lang]
  const url = `/${lang}/products`

  return {
    metadataBase: new URL(siteUrl),
    title: `${pageCopy.title} | ${dict.header.title}`,
    description: pageCopy.description,
    openGraph: {
      title: pageCopy.title,
      description: pageCopy.description,
      url,
      siteName: dict.header.title,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/new-api-doc-logo.png',
          width: 335,
          height: 329,
          alt: pageCopy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageCopy.title,
      description: pageCopy.description,
      images: ['/images/new-api-doc-logo.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': '/zh/products',
        'en-US': '/en/products',
      },
    },
  }
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function getIndexableProducts(lang: 'zh' | 'en') {
  return getProducts(lang).filter(product => product.actionType !== 'link')
}

function groupProducts(lang: 'zh' | 'en', products: Product[]): ProductGroup[] {
  const order = ['gpt', 'gemini'] as const
  const knownGroupIds = new Set<string>(order)
  const pageCopy = copy[lang]
  const groups: ProductGroup[] = order
    .map(groupId => ({
      id: groupId,
      title: pageCopy.groups[groupId].title,
      description: pageCopy.groups[groupId].description,
      products: products.filter(product => product.categoryId === groupId),
    }))
    .filter(group => group.products.length > 0)

  const otherProducts = products.filter(product => !knownGroupIds.has(product.categoryId))
  if (otherProducts.length > 0) {
    groups.push({
      id: 'other',
      title: pageCopy.groups.other.title,
      description: pageCopy.groups.other.description,
      products: otherProducts,
    })
  }

  return groups
}

export default async function ProductsIndexPage({ params }: ProductsIndexPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const products = getIndexableProducts(lang)
  const groupedProducts = groupProducts(lang, products)
  const pageCopy = copy[lang]

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageCopy.title,
    description: pageCopy.description,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    url: `${siteUrl}/${lang}/products`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.title,
        url: `${siteUrl}/${lang}/products/${product.id}`,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.header.title,
        item: `${siteUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageCopy.title,
        item: `${siteUrl}/${lang}/products`,
      },
    ],
  }

  return (
    <main className="cz-products-index">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <style>{`
        .cz-products-index {
          min-height: 100vh;
          background: #fafafa;
          color: #111827;
          padding: 24px 14px 58px;
        }
        .cz-products-shell {
          max-width: 980px;
          margin: 0 auto;
        }
        .cz-products-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 26px;
        }
        .cz-products-nav a,
        .cz-product-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          background: #ffffff;
          color: #111827;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }
        .cz-products-hero {
          padding: clamp(24px, 5vw, 42px);
          border: 1px solid #eaeaea;
          border-radius: 16px;
          background: #ffffff;
          margin-bottom: 18px;
        }
        .cz-products-kicker {
          display: inline-flex;
          align-items: center;
          margin-bottom: 14px;
          padding: 5px 10px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #fafafa;
          color: #555;
          font-size: 12px;
          font-weight: 850;
        }
        .cz-products-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.1;
          letter-spacing: 0;
        }
        .cz-products-hero p {
          max-width: 760px;
          margin: 0;
          color: #555;
          font-size: 16px;
          line-height: 1.75;
        }
        .cz-products-list {
          display: grid;
          gap: 14px;
        }
        .cz-product-group {
          border: 1px solid #eaeaea;
          border-radius: 14px;
          background: #ffffff;
          overflow: hidden;
        }
        .cz-product-group-head {
          padding: 20px 22px 16px;
          border-bottom: 1px solid #eaeaea;
        }
        .cz-product-group h2 {
          margin: 0 0 8px;
          font-size: 20px;
          line-height: 1.3;
          letter-spacing: 0;
        }
        .cz-product-group p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.65;
        }
        .cz-product-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .cz-product-list li + li {
          border-top: 1px solid #f1f1f1;
        }
        .cz-product-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 18px 22px;
        }
        .cz-product-title {
          display: block;
          margin-bottom: 6px;
          font-size: 16px;
          font-weight: 850;
          line-height: 1.35;
        }
        .cz-product-desc {
          display: block;
          color: #666;
          font-size: 13px;
          line-height: 1.6;
        }
        .cz-product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }
        .cz-product-meta span {
          padding: 3px 8px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #fafafa;
          color: #666;
          font-size: 12px;
          font-weight: 750;
        }
        .cz-product-price {
          color: #111827;
          font-size: 18px;
          font-weight: 900;
          white-space: nowrap;
          margin-bottom: 10px;
          text-align: right;
        }
        .cz-products-nav a:hover,
        .cz-products-nav a:focus-visible,
        .cz-product-link:hover,
        .cz-product-link:focus-visible {
          color: #ff6a00;
          border-color: #ff6a00;
          outline: none;
        }
        @media (max-width: 640px) {
          .cz-products-nav {
            align-items: stretch;
          }
          .cz-products-nav a {
            flex: 1 1 auto;
          }
          .cz-product-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .cz-product-price {
            text-align: left;
          }
          .cz-product-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="cz-products-shell">
        <nav className="cz-products-nav" aria-label={pageCopy.title}>
          <Link href={`/${lang}`}>{pageCopy.home}</Link>
          <Link href={`/${lang}/api-service`}>{pageCopy.apiService}</Link>
        </nav>

        <header className="cz-products-hero">
          <div className="cz-products-kicker">{pageCopy.kicker}</div>
          <h1>{pageCopy.title}</h1>
          <p>{pageCopy.description}</p>
        </header>

        <div className="cz-products-list">
          {groupedProducts.map(group => (
            <section key={group.id} className="cz-product-group" aria-labelledby={`products-${group.id}`}>
              <div className="cz-product-group-head">
                <h2 id={`products-${group.id}`}>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <ul className="cz-product-list">
                {group.products.map(product => (
                  <li key={product.id}>
                    <div className="cz-product-row">
                      <div>
                        <span className="cz-product-title">{product.title}</span>
                        <span className="cz-product-desc">{stripHtml(product.subtitle)}</span>
                        <span className="cz-product-meta">
                          {product.tags.slice(0, 4).map(tag => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </span>
                      </div>
                      <div>
                        <div className="cz-product-price">
                          {pageCopy.from} {lang === 'zh' ? '¥' : '$'}{product.price}
                        </div>
                        <Link className="cz-product-link" href={`/${lang}/products/${product.id}`}>
                          {pageCopy.viewDetails}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
