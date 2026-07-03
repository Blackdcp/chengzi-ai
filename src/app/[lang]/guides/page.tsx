import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '../../../lib/dictionaries'
import { getGuides, type GuideLanguage, type GuideSummary } from '../../../lib/guides'

type GuidesIndexPageProps = {
  params: Promise<{ lang: GuideLanguage }>
}

type GuideCategory = {
  id: string
  title: string
  description: string
  slugs: string[]
}

type GuideCategoryGroup = Omit<GuideCategory, 'slugs'> & {
  guides: GuideSummary[]
}

const siteUrl = 'https://cheng-zi-ai.com'
const languages = ['zh', 'en'] as const

const categoriesByLanguage: Record<GuideLanguage, GuideCategory[]> = {
  zh: [
    {
      id: 'accounts',
      title: 'AI 账号购买与续费',
      description: 'ChatGPT Plus、ChatGPT Pro、Gemini AI Pro 的购买、续费、成品号和使用前判断。',
      slugs: [
        'buy-chatgpt-plus-account-guide',
        'chatgpt-plus-ready-account-vs-renewal',
        'chatgpt-plus-no-vpn-guide',
        'chatgpt-pro-vs-plus-guide',
        'gemini-ai-pro-year-subscription-guide',
      ],
    },
    {
      id: 'ai-coding',
      title: 'AI Coding 工具配置',
      description: 'Cursor、Claude Code、Cline、Continue.dev 等开发工具的 API Base URL 和 Key 配置。',
      slugs: [
        'cursor-api-base-url-setup',
        'claude-code-base-url-setup',
        'cline-openai-compatible-api-setup',
        'continue-dev-openai-compatible-api-setup',
        'openai-compatible-api-credits-guide',
      ],
    },
    {
      id: 'clients',
      title: 'AI 客户端与自定义服务商',
      description: 'Chatbox、Cherry Studio、NextChat 这类客户端如何接入 OpenAI 兼容 API。',
      slugs: [
        'chatbox-custom-api-host-setup',
        'cherry-studio-custom-provider-setup',
        'nextchat-custom-api-base-url',
        'openai-compatible-api-key-guide',
      ],
    },
    {
      id: 'troubleshooting',
      title: 'API 报错与额度排查',
      description: 'Base URL、模型不存在、429、quota、rate limit 等高意图问题的排查入口。',
      slugs: [
        'api-base-url-troubleshooting',
        'api-429-quota-rate-limit-guide',
      ],
    },
  ],
  en: [
    {
      id: 'accounts',
      title: 'AI Account Buying and Renewal',
      description: 'Buying, renewing, and comparing ChatGPT Plus, ChatGPT Pro, ready accounts, and Gemini AI Pro subscriptions.',
      slugs: [
        'buy-chatgpt-plus-account-guide',
        'chatgpt-plus-ready-account-vs-renewal',
        'chatgpt-plus-no-vpn-guide',
        'chatgpt-pro-vs-plus-guide',
        'gemini-ai-pro-year-subscription-guide',
      ],
    },
    {
      id: 'ai-coding',
      title: 'AI Coding Tool Setup',
      description: 'API Base URL and key setup for Cursor, Claude Code, Cline, Continue.dev, and similar tools.',
      slugs: [
        'cursor-api-base-url-setup',
        'claude-code-base-url-setup',
        'cline-openai-compatible-api-setup',
        'continue-dev-openai-compatible-api-setup',
        'openai-compatible-api-credits-guide',
      ],
    },
    {
      id: 'clients',
      title: 'AI Clients and Custom Providers',
      description: 'How to connect Chatbox, Cherry Studio, NextChat, and other clients to OpenAI-compatible APIs.',
      slugs: [
        'chatbox-custom-api-host-setup',
        'cherry-studio-custom-provider-setup',
        'nextchat-custom-api-base-url',
        'openai-compatible-api-key-guide',
      ],
    },
    {
      id: 'troubleshooting',
      title: 'API Errors and Quota Troubleshooting',
      description: 'Fix high-intent setup issues such as Base URL errors, missing models, 429, quota, and rate limits.',
      slugs: [
        'api-base-url-troubleshooting',
        'api-429-quota-rate-limit-guide',
      ],
    },
  ],
}

const pageCopy = {
  zh: {
    title: 'AI 工具与 API 实用教程索引',
    description:
      '面向 OpenAI 兼容 API、Base URL、AI Coding 工具和常见报错的教程集合。首页只放精选入口，这里承载全部可抓取教程。',
    kicker: '持续更新',
    home: '返回首页',
    apiService: '查看 API 服务',
    allGuides: '全部教程',
    totalLabel: '篇教程',
    otherTitle: '其他教程',
    otherDescription: '暂未归类的新教程会先放在这里。',
    updated: '更新',
  },
  en: {
    title: 'Practical Guides Index',
    description:
      'Guides for OpenAI-compatible APIs, Base URLs, AI coding tools, and common API errors. Browse every crawlable setup and troubleshooting guide.',
    kicker: 'Updated regularly',
    home: 'Back home',
    apiService: 'View API service',
    allGuides: 'All guides',
    totalLabel: 'guides',
    otherTitle: 'Other guides',
    otherDescription: 'New guides that are not categorized yet appear here first.',
    updated: 'Updated',
  },
} satisfies Record<GuideLanguage, {
  title: string
  description: string
  kicker: string
  home: string
  apiService: string
  allGuides: string
  totalLabel: string
  otherTitle: string
  otherDescription: string
  updated: string
}>

export const dynamicParams = false

export function generateStaticParams() {
  return languages.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: GuidesIndexPageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const copy = pageCopy[lang]
  const url = `/${lang}/guides`

  return {
    metadataBase: new URL(siteUrl),
    title: `${copy.title} | ${dict.header.title}`,
    description: copy.description,
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName: dict.header.title,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: ['/opengraph-image.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': '/zh/guides',
        'en-US': '/en/guides',
      },
    },
  }
}

function groupGuides(lang: GuideLanguage, guides: GuideSummary[]): GuideCategoryGroup[] {
  const guideBySlug = new Map(guides.map(guide => [guide.slug, guide]))
  const usedSlugs = new Set<string>()

  const categoryGroups = categoriesByLanguage[lang]
    .map(category => {
      const categoryGuides = category.slugs
        .map(slug => guideBySlug.get(slug))
        .filter((guide): guide is GuideSummary => Boolean(guide))

      categoryGuides.forEach(guide => usedSlugs.add(guide.slug))

      return {
        id: category.id,
        title: category.title,
        description: category.description,
        guides: categoryGuides,
      }
    })
    .filter(group => group.guides.length > 0)

  const uncategorizedGuides = guides.filter(guide => !usedSlugs.has(guide.slug))
  if (uncategorizedGuides.length > 0) {
    const copy = pageCopy[lang]
    categoryGroups.push({
      id: 'other',
      title: copy.otherTitle,
      description: copy.otherDescription,
      guides: uncategorizedGuides,
    })
  }

  return categoryGroups
}

export default async function GuidesIndexPage({ params }: GuidesIndexPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const guides = getGuides(lang)
  const copy = pageCopy[lang]
  const groupedGuides = groupGuides(lang, guides)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.description,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    url: `${siteUrl}/${lang}/guides`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.title,
        url: `${siteUrl}/${lang}/guides/${guide.slug}`,
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
        name: copy.title,
        item: `${siteUrl}/${lang}/guides`,
      },
    ],
  }

  return (
    <main className="cz-guides-index">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <style>{`
        .cz-guides-index {
          min-height: 100vh;
          background: #fafafa;
          color: #111827;
          padding: 24px 14px 58px;
        }
        .cz-guides-shell {
          max-width: 980px;
          margin: 0 auto;
        }
        .cz-guides-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 26px;
        }
        .cz-guides-nav a {
          display: inline-flex;
          align-items: center;
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
        .cz-guides-hero {
          padding: clamp(24px, 5vw, 42px);
          border: 1px solid #eaeaea;
          border-radius: 16px;
          background: #ffffff;
          margin-bottom: 18px;
        }
        .cz-guides-kicker {
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
        .cz-guides-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.1;
          letter-spacing: 0;
        }
        .cz-guides-hero p {
          max-width: 760px;
          margin: 0;
          color: #555;
          font-size: 16px;
          line-height: 1.75;
        }
        .cz-guides-count {
          margin-top: 18px;
          color: #111827;
          font-size: 14px;
          font-weight: 850;
        }
        .cz-guides-list {
          display: grid;
          gap: 14px;
        }
        .cz-guide-category {
          border: 1px solid #eaeaea;
          border-radius: 14px;
          background: #ffffff;
          overflow: hidden;
        }
        .cz-guide-category-head {
          padding: 20px 22px 16px;
          border-bottom: 1px solid #eaeaea;
        }
        .cz-guide-category h2 {
          margin: 0 0 8px;
          font-size: 20px;
          line-height: 1.3;
          letter-spacing: 0;
        }
        .cz-guide-category p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.65;
        }
        .cz-guide-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .cz-guide-links li + li {
          border-top: 1px solid #f1f1f1;
        }
        .cz-guide-links a {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          padding: 18px 22px;
          color: #111827;
          text-decoration: none;
        }
        .cz-guide-link-title {
          display: block;
          margin-bottom: 6px;
          font-size: 16px;
          font-weight: 850;
          line-height: 1.35;
        }
        .cz-guide-link-desc {
          display: block;
          color: #666;
          font-size: 13px;
          line-height: 1.6;
        }
        .cz-guide-link-date {
          color: #777;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 800;
          padding-top: 2px;
        }
        .cz-guide-links a:hover,
        .cz-guide-links a:focus-visible,
        .cz-guides-nav a:hover,
        .cz-guides-nav a:focus-visible {
          color: #ff6a00;
          border-color: #ff6a00;
          outline: none;
        }
        @media (max-width: 640px) {
          .cz-guides-nav {
            align-items: stretch;
          }
          .cz-guides-nav a {
            flex: 1 1 auto;
            justify-content: center;
          }
          .cz-guide-links a {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>

      <div className="cz-guides-shell">
        <nav className="cz-guides-nav" aria-label={copy.allGuides}>
          <Link href={`/${lang}`}>{copy.home}</Link>
          <Link href={`/${lang}/api-service`}>{copy.apiService}</Link>
        </nav>

        <header className="cz-guides-hero">
          <div className="cz-guides-kicker">{copy.kicker}</div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="cz-guides-count">
            {guides.length} {copy.totalLabel}
          </div>
        </header>

        <div className="cz-guides-list">
          {groupedGuides.map(group => (
            <section key={group.id} className="cz-guide-category" aria-labelledby={`guides-${group.id}`}>
              <div className="cz-guide-category-head">
                <h2 id={`guides-${group.id}`}>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <ul className="cz-guide-links">
                {group.guides.map(guide => (
                  <li key={guide.slug}>
                    <Link href={`/${lang}/guides/${guide.slug}`}>
                      <span>
                        <span className="cz-guide-link-title">{guide.title}</span>
                        <span className="cz-guide-link-desc">{guide.description}</span>
                      </span>
                      <span className="cz-guide-link-date">
                        {copy.updated} {guide.date}
                      </span>
                    </Link>
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
