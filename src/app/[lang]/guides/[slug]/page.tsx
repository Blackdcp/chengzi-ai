import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary } from '../../../../lib/dictionaries'
import { getGuideBySlug, getGuides, type GuideLanguage } from '../../../../lib/guides'
import GuideCtaLink from './GuideCtaLink'

type GuidePageProps = {
  params: Promise<{ lang: GuideLanguage; slug: string }>
}

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string }

export const dynamicParams = false

export function generateStaticParams() {
  return (['zh', 'en'] as const).flatMap(lang =>
    getGuides(lang).map(guide => ({
      lang,
      slug: guide.slug,
    }))
  )
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const guide = getGuideBySlug(lang, slug)
  const dict = await getDictionary(lang)

  if (!guide) {
    return {
      title: lang === 'zh' ? '教程不存在' : 'Guide not found',
    }
  }

  const url = `/${lang}/guides/${guide.slug}`

  return {
    metadataBase: new URL('https://cheng-zi-ai.com'),
    title: `${guide.title} | ${dict.header.title}`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: dict.header.title,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: guide.date,
      modifiedTime: guide.lastModified,
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: ['/opengraph-image.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': `/zh/guides/${guide.slug}`,
        'en-US': `/en/guides/${guide.slug}`,
      },
    },
  }
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    const codeFence = line.match(/^```(\w+)?$/)
    if (codeFence) {
      const codeLines: string[] = []
      const language = codeFence[1] || ''
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push({ type: 'code', language, code: codeLines.join('\n') })
      continue
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() })
      index += 1
      continue
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''))
        index += 1
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') })
      continue
    }

    const unordered = line.match(/^[-*]\s+(.+)$/)
    const ordered = line.match(/^\d+\.\s+(.+)$/)
    if (unordered || ordered) {
      const items: string[] = []
      const orderedList = Boolean(ordered)
      while (index < lines.length) {
        const current = lines[index].trim()
        const item = orderedList ? current.match(/^\d+\.\s+(.+)$/) : current.match(/^[-*]\s+(.+)$/)
        if (!item) break
        items.push(item[1].trim())
        index += 1
      }
      blocks.push({ type: 'list', ordered: orderedList, items })
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length) {
      const current = lines[index].trim()
      if (!current) break
      if (
        /^```/.test(current) ||
        /^(#{2,4})\s+/.test(current) ||
        current.startsWith('>') ||
        /^[-*]\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break
      }
      paragraphLines.push(current)
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return blocks
}

function renderInline(text: string) {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*.+?\*\*|`.+?`|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={nodes.length}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={nodes.length}>{token.slice(1, -1)}</code>)
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        nodes.push(
          <a
            key={nodes.length}
            href={link[2]}
            target={link[2].startsWith('http') ? '_blank' : undefined}
            rel={link[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {link[1]}
          </a>
        )
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function renderBlock(block: MarkdownBlock, index: number) {
  if (block.type === 'heading') {
    if (block.level === 2) return <h2 key={index}>{renderInline(block.text)}</h2>
    if (block.level === 3) return <h3 key={index}>{renderInline(block.text)}</h3>
    return <h4 key={index}>{renderInline(block.text)}</h4>
  }

  if (block.type === 'blockquote') {
    return <blockquote key={index}>{renderInline(block.text)}</blockquote>
  }

  if (block.type === 'code') {
    return (
      <pre key={index} data-language={block.language}>
        <code>{block.code}</code>
      </pre>
    )
  }

  if (block.type === 'list') {
    if (block.ordered) {
      return (
        <ol key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    }
    return (
      <ul key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
        ))}
      </ul>
    )
  }

  return <p key={index}>{renderInline(block.text)}</p>
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { lang, slug } = await params
  const guide = getGuideBySlug(lang, slug)
  const dict = await getDictionary(lang)

  if (!guide) {
    notFound()
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    datePublished: guide.date,
    dateModified: guide.lastModified,
    author: {
      '@type': 'Organization',
      name: dict.header.title,
    },
    publisher: {
      '@type': 'Organization',
      name: dict.header.title,
    },
    mainEntityOfPage: `https://cheng-zi-ai.com/${lang}/guides/${guide.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.header.title,
        item: `https://cheng-zi-ai.com/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'zh' ? '实用教程' : 'Guides',
        item: `https://cheng-zi-ai.com/${lang}/guides/${guide.slug}`,
      },
    ],
  }

  return (
    <main className="cz-guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <style>{`
        .cz-guide-page {
          min-height: 100vh;
          background: #fafafa;
          color: #111827;
          padding: 24px 14px 56px;
        }
        .cz-guide-shell {
          max-width: 820px;
          margin: 0 auto;
        }
        .cz-guide-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #666;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 26px;
        }
        .cz-guide-card {
          background: #ffffff;
          border: 1px solid #eaeaea;
          border-radius: 18px;
          padding: clamp(24px, 5vw, 48px);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.04);
        }
        .cz-guide-kicker {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #fafafa;
          color: #111827;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .cz-guide-card h1 {
          margin: 0 0 16px;
          font-size: clamp(30px, 5.6vw, 48px);
          line-height: 1.08;
          letter-spacing: 0;
          font-weight: 850;
        }
        .cz-guide-desc {
          margin: 0 0 14px;
          color: #555;
          font-size: 16px;
          line-height: 1.75;
        }
        .cz-guide-date {
          color: #888;
          font-size: 13px;
          margin-bottom: 32px;
        }
        .cz-guide-content {
          border-top: 1px solid #eaeaea;
          padding-top: 28px;
        }
        .cz-guide-content h2 {
          margin: 34px 0 14px;
          color: #111827;
          font-size: clamp(22px, 3vw, 28px);
          line-height: 1.25;
          letter-spacing: 0;
        }
        .cz-guide-content h3 {
          margin: 28px 0 12px;
          color: #111827;
          font-size: 19px;
          line-height: 1.35;
          letter-spacing: 0;
        }
        .cz-guide-content h4 {
          margin: 22px 0 10px;
          color: #111827;
          font-size: 16px;
          line-height: 1.4;
          letter-spacing: 0;
        }
        .cz-guide-content p,
        .cz-guide-content li,
        .cz-guide-content blockquote {
          color: #333;
          font-size: 16px;
          line-height: 1.85;
        }
        .cz-guide-content p {
          margin: 0 0 18px;
        }
        .cz-guide-content ul,
        .cz-guide-content ol {
          margin: 0 0 22px;
          padding-left: 22px;
        }
        .cz-guide-content li {
          margin-bottom: 8px;
        }
        .cz-guide-content blockquote {
          margin: 22px 0;
          padding: 14px 18px;
          border-left: 3px solid #111827;
          background: #fafafa;
          border-radius: 10px;
        }
        .cz-guide-content a {
          color: #111827;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .cz-guide-content code {
          padding: 2px 5px;
          border: 1px solid #eaeaea;
          border-radius: 6px;
          background: #fafafa;
          font-size: 0.92em;
        }
        .cz-guide-content pre {
          margin: 18px 0 24px;
          padding: 16px;
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #eaeaea;
          background: #111827;
          color: #ffffff;
          line-height: 1.65;
        }
        .cz-guide-content pre code {
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: inherit;
          font-size: 13px;
        }
        .cz-guide-cta {
          margin-top: 34px;
          padding: 18px;
          background: #111827;
          border-radius: 14px;
          color: #ffffff;
        }
        .cz-guide-cta-title {
          font-size: 16px;
          font-weight: 850;
          margin-bottom: 8px;
        }
        .cz-guide-cta-copy {
          color: rgba(255, 255, 255, 0.74);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .cz-guide-cta a {
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          background: #ffffff;
          color: #111827;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }
      `}</style>
      <div className="cz-guide-shell">
        <Link href={`/${lang}`} className="cz-guide-back">
          {lang === 'zh' ? '返回首页' : 'Back home'}
        </Link>
        <article className="cz-guide-card">
          <div className="cz-guide-kicker">
            {lang === 'zh' ? '实用教程' : 'Guide'}
          </div>
          <h1>{guide.title}</h1>
          <p className="cz-guide-desc">{guide.description}</p>
          <div className="cz-guide-date">{guide.date}</div>
          <div className="cz-guide-content">{parseMarkdown(guide.content).map(renderBlock)}</div>
          <div className="cz-guide-cta">
            <div className="cz-guide-cta-title">
              {lang === 'zh' ? '需要稳定的 AI API 额度？' : 'Need stable AI API credits?'}
            </div>
            <div className="cz-guide-cta-copy">
              {lang === 'zh'
                ? '教程看完后，可以回到 API 中转服务页选择额度包，再按说明创建 API Key。'
                : 'After reading the guide, choose an API credit pack and create your API key from the console.'}
            </div>
            <GuideCtaLink href={`/${lang}/api-service`} lang={lang} slug={guide.slug}>
              {lang === 'zh' ? '查看 API 服务' : 'View API service'}
            </GuideCtaLink>
          </div>
        </article>
      </div>
    </main>
  )
}
