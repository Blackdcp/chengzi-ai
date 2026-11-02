import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getProducts } from '../../../../lib/api'
import { getDictionary } from '../../../../lib/dictionaries'
import type { Product } from '../../../../types/product'

import { Metadata } from 'next'

type ProductDetailSection = NonNullable<NonNullable<Product["detail"]>["sections"]>[number];
type ProductFaq = {
  question: string
  answer: string
}

const languages = ['zh', 'en'] as const

export const dynamicParams = false

export function generateStaticParams() {
  return languages.flatMap(lang =>
    getProducts(lang).map(product => ({
      lang,
      slug: product.id,
    }))
  )
}

function getProductFaqs(product: Product, lang: 'en' | 'zh'): ProductFaq[] {
  if (lang === 'en') {
    const specific: ProductFaq[] = []
    if (product.deliveryNotice) {
      specific.push({
        question: `What is the delivery time and format for ${product.title}?`,
        answer: `${product.deliveryNotice}. ${product.subtitle}`,
      })
    }
    if (product.warnings && product.warnings.length > 0) {
      specific.push({
        question: `What are the important requirements before ordering ${product.title}?`,
        answer: product.warnings.join(' '),
      })
    }
    const common: ProductFaq[] = [
      {
        question: `Is ${product.title} an official service?`,
        answer:
          'ChengZi AI is an independent third-party service platform providing official channel top-ups and verified ready accounts. All trademarks belong to their respective owners.',
      },
      {
        question: 'How is the warranty handled?',
        answer:
          'All subscriptions and accounts carry the warranty specified in the product description (typically 30-day pro-rated subscription warranty or first-login guarantee). Contact chengziai2026@163.com with your order ID for support.',
      },
    ]
    return [...specific, ...common]
  }

  const specificZh: ProductFaq[] = []
  if (product.deliveryNotice) {
    specificZh.push({
      question: `这款商品下单后多久发货？如何交付？`,
      answer: `${product.deliveryNotice}。${product.subtitle}`,
    })
  }
  if (product.warnings && product.warnings.length > 0) {
    specificZh.push({
      question: `购买与充值前有哪些必须注意的事项？`,
      answer: product.warnings.join(' '),
    })
  }

  const common: ProductFaq[] = [
    {
      question: `${product.title} 是官方正规渠道吗？`,
      answer:
        '橙子 AI 是独立的第三方服务平台，所有代充卡密与成品号均采用官方正规支付通道开通，绝非黑卡或零元购。相关品牌与模型商标归对应权利方所有。',
    },
    {
      question: '遇到充值疑问或售后问题如何联系客服？',
      answer:
        '请保留您的订单号与下单邮箱，直接发送邮件至官方售后邮箱 chengziai2026@163.com，客服将第一时间为您核实处理。',
    },
  ]

  return [...specificZh, ...common]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh'; slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.lang, resolvedParams.slug)
  const dict = await getDictionary(resolvedParams.lang)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const title = `${product.title} | ${dict.header.title}`
  const description = product.subtitle.replace(/<[^>]*>?/gm, '') // Remove HTML tags
  const keywords = product.tags

  return {
    metadataBase: new URL("https://cheng-zi-ai.com"),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `/${resolvedParams.lang}/products/${resolvedParams.slug}`,
      siteName: dict.header.title,
      locale: resolvedParams.lang === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.png"],
    },
    alternates: {
      canonical: `/${resolvedParams.lang}/products/${resolvedParams.slug}`,
      languages: {
        "zh-CN": `/zh/products/${resolvedParams.slug}`,
        "en-US": `/en/products/${resolvedParams.slug}`,
      },
    },
  }
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh'; slug: string }>
}) {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.lang, resolvedParams.slug)
  const dict = await getDictionary(resolvedParams.lang)
  const productDescription = product?.subtitle.replace(/<[^>]*>?/gm, '') || ''

  if (!product) {
    notFound()
  }

  const faqs = getProductFaqs(product, resolvedParams.lang)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": productDescription,
    "url": `https://cheng-zi-ai.com/${resolvedParams.lang}/products/${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": dict.header.title
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "CNY",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": dict.header.title,
        "item": `https://cheng-zi-ai.com/${resolvedParams.lang}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": resolvedParams.lang === 'zh' ? '产品索引' : 'Products',
        "item": `https://cheng-zi-ai.com/${resolvedParams.lang}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://cheng-zi-ai.com/${resolvedParams.lang}/products/${product.id}`
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };


  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#111827", padding: "40px 24px", lineHeight: 1.6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      {/* Header bar */}
      <div style={{ background: "#ffffff", padding: "16px 24px", borderBottom: "1px solid #eaeaea", marginBottom: 40, marginLeft: -24, marginRight: -24, marginTop: -40 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href={`/${resolvedParams.lang}`} style={{ color: "#666666", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            &larr; {dict.product.back}
          </Link>
          <Link href={`/${resolvedParams.lang}/products`} style={{ color: "#111827", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            {resolvedParams.lang === 'zh' ? '产品索引' : 'Products index'}
          </Link>
        </div>
      </div>

      <div className="vercel-card" style={{ maxWidth: 780, margin: "0 auto", padding: "48px" }}>
        
        <div style={{ fontSize: 12, fontWeight: 500, color: "#666666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          {product.categoryName}
        </div>
        
        <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {product.title}
        </h1>

        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            {product.price > 0 ? (
               <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>¥ {product.price}</span>
            ) : (
               <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.free}</span>
            )}
          </div>
          {product.inStock && (
            <Link
              href={`/${resolvedParams.lang}#accounts`}
              className="vercel-button"
              style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", borderRadius: 10 }}
            >
              {product.buyButtonText}
            </Link>
          )}
        </div>

        <p style={{ fontSize: 16, color: "#444444", lineHeight: 1.6, marginBottom: 40 }}>
          {product.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: "4px 12px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "999px", fontSize: 13, color: "#444444", fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>

        {product.detail?.sections ? (
          <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>
            {product.detail.sections.map((section: ProductDetailSection, idx: number) => (
              <div key={idx}>
                <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 16px", color: "#111827", letterSpacing: "-0.01em" }}>{section.title}</h2>
                <ul style={{ paddingLeft: 0, margin: 0, color: "#444444", lineHeight: 1.8, fontSize: 15, listStyle: "none" }}>
                  {section.items.map((item: string, i: number) => (
                    <li key={i} style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: "#0a0a0a", marginTop: 2 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 24px", letterSpacing: "-0.01em" }}>{dict.product.features}</h2>
            <ul style={{ paddingLeft: 0, margin: 0, color: "#444444", lineHeight: 1.8, fontSize: 15, listStyle: "none" }}>
              {product.features?.map((f: string, i: number) => (
                <li key={i} style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#0a0a0a", marginTop: 2 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.warnings && product.warnings.length > 0 && (
          <div style={{ marginTop: 48, padding: "24px", border: "1px solid #eaeaea", borderRadius: "8px", background: "#fafafa" }}>
            <h3 style={{ margin: "0 0 16px", color: "#111827", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              {dict.product.warnings}
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, color: "#444444", fontSize: 14, lineHeight: 1.6 }}>
              {product.warnings.map((w: string, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 48, borderTop: "1px solid #eaeaea", paddingTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px", color: "#111827", letterSpacing: "-0.01em" }}>
            {resolvedParams.lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <div style={{ display: "grid", gap: 18 }}>
            {faqs.map(faq => (
              <section key={faq.question} style={{ padding: "18px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: 12 }}>
                <h3 style={{ margin: "0 0 8px", color: "#111827", fontSize: 16, fontWeight: 700, lineHeight: 1.45 }}>
                  {faq.question}
                </h3>
                <p style={{ margin: 0, color: "#444444", fontSize: 14, lineHeight: 1.7 }}>
                  {faq.answer}
                </p>
              </section>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
