import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '../../../../lib/api'
import { getDictionary } from '../../../../lib/dictionaries'
import type { Product } from '../../../../types/product'

import { Metadata } from 'next'

type ProductDetailSection = NonNullable<NonNullable<Product["detail"]>["sections"]>[number];
type ProductFaq = {
  question: string
  answer: string
}

function getProductFaqs(product: Product, lang: 'en' | 'zh'): ProductFaq[] {
  if (lang === 'en') {
    const common: ProductFaq[] = [
      {
        question: `Is ${product.title} an official OpenAI or Google service?`,
        answer:
          'No. ChengZi AI is a third-party service platform. Product names and model names belong to their respective rights holders.',
      },
      {
        question: 'How is the product delivered?',
        answer:
          'After payment, delivery is handled according to the product type. The page and order email will show the account, code, top-up instruction, or setup guide you need.',
      },
      {
        question: 'What should I do if I enter the wrong email?',
        answer:
          'Contact support as soon as possible with your order information. Delivery depends on the email or contact detail submitted during checkout.',
      },
    ]

    const byProduct: Record<string, ProductFaq[]> = {
      'chatgpt-plus-monthly-code': [
        {
          question: 'Who is the ChatGPT Plus monthly pass for?',
          answer:
            'It is for users who want a low-cost ChatGPT Plus experience for writing, office work, study, coding, or temporary Plus usage.',
        },
        {
          question: 'Do I need to handle overseas payment myself?',
          answer:
            'No. This product is designed for users who do not want to manage overseas payment steps themselves.',
        },
      ],
      'chatgpt-plus-renewal': [
        {
          question: 'Do I need my own ChatGPT account for renewal?',
          answer:
            'Yes. Renewal is meant for users who already have their own ChatGPT account and want to continue using Plus on that account.',
        },
        {
          question: 'Can I order renewal if my account is restricted?',
          answer:
            'You should not order renewal for an account that is restricted, unavailable, or unable to receive normal subscription changes.',
        },
      ],
      'chatgpt-plus-ready-account': [
        {
          question: 'What is a ready-to-use account?',
          answer:
            'It is an account prepared for immediate use after delivery, suitable for users who do not want to register or configure an account themselves.',
        },
        {
          question: 'Is it suitable as a backup account?',
          answer:
            'Yes. Many users choose a ready-to-use account as a temporary or backup ChatGPT Plus option.',
        },
      ],
      'chatgpt-pro-20x-fast': [
        {
          question: 'How is ChatGPT Pro different from Plus?',
          answer:
            'Pro is intended for heavier usage such as AI coding, frequent chat, file analysis, deep research, and project sprints. It is not the same as standard Plus.',
        },
        {
          question: 'Who should not buy this product?',
          answer:
            'Users who only chat occasionally may be better served by a Plus-level product instead of the Pro option.',
        },
      ],
      'gemini-pro-year-account': [
        {
          question: 'Is this a Gemini family group subscription?',
          answer:
            'No. This is for subscribing an individual Google or Gemini account to Google AI Pro for one year.',
        },
        {
          question: 'Will ChengZi AI keep my account information?',
          answer:
            'No. Account information is only used temporarily for activation when required and is not kept after completion.',
        },
      ],
    }

    return [...(byProduct[product.id] || []), ...common]
  }

  const common: ProductFaq[] = [
    {
      question: `${product.title} 是官方服务吗？`,
      answer:
        '不是。橙子 AI 是第三方服务平台，不是 OpenAI、Anthropic 或 Google 官方服务，也不是其授权代理。相关名称和商标归对应权利方所有。',
    },
    {
      question: '下单后怎么交付？',
      answer:
        '交付方式按商品类型处理，可能是账号、卡密、充值说明或配置说明。请使用正确邮箱下单，以便接收交付信息。',
    },
    {
      question: '邮箱填错了怎么办？',
      answer:
        '请尽快带订单信息联系客服。商品交付会依赖下单时填写的邮箱或联系方式。',
    },
  ]

  const byProduct: Record<string, ProductFaq[]> = {
    'chatgpt-plus-monthly-code': [
      {
        question: 'ChatGPT Plus 国内直连月卡适合谁？',
        answer:
          '适合想低价体验 ChatGPT Plus，或临时需要 Plus 能力用于写作、办公、学习和编程的用户。',
      },
      {
        question: '需要自己处理海外支付吗？',
        answer:
          '不需要。这个商品面向不想自己处理海外支付流程的用户，网页下单后按说明接收交付。',
      },
    ],
    'chatgpt-plus-renewal': [
      {
        question: 'ChatGPT Plus 续费需要自己的账号吗？',
        answer:
          '需要。续费适合已经有自用 ChatGPT 账号，并希望继续在该账号上使用 Plus 的用户。',
      },
      {
        question: '账号异常还能续费吗？',
        answer:
          '如果账号受限、不可用或无法正常变更订阅，不建议下单续费。',
      },
    ],
    'chatgpt-plus-ready-account': [
      {
        question: '成品号是什么意思？',
        answer:
          '成品号是交付后可按说明登录使用的账号，适合不想注册或配置账号流程的用户。',
      },
      {
        question: '可以作为备用账号吗？',
        answer:
          '可以。很多用户会把成品号作为临时使用或备用的 ChatGPT Plus 方案。',
      },
    ],
    'chatgpt-pro-20x-fast': [
      {
        question: 'ChatGPT Pro 和 Plus 有什么区别？',
        answer:
          'Pro 面向更高强度使用场景，例如 AI Coding、高频对话、文件分析、深度研究和项目冲刺，不是普通 Plus。',
      },
      {
        question: '什么人不适合买 Pro？',
        answer:
          '如果只是偶尔聊天或轻量使用，通常 Plus 级别商品更合适。',
      },
    ],
    'gemini-pro-year-account': [
      {
        question: '这是 Gemini 家庭组吗？',
        answer:
          '不是。这是给你自己的 Google / Gemini 账号订阅一年 Google AI Pro，属于个人账号单独订阅。',
      },
      {
        question: '平台会保存我的账号信息吗？',
        answer:
          '不会。需要提交的信息仅用于订阅临时处理，完成后不保留。',
      },
    ],
  }

  return [...(byProduct[product.id] || []), ...common]
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
          url: "/images/new-api-doc-logo.png",
          width: 335,
          height: 329,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/new-api-doc-logo.png"],
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
      "priceCurrency": resolvedParams.lang === 'en' ? "USD" : "CNY",
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

        <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline" }}>
          {product.price > 0 ? (
             <>
               <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.currency}{product.price}</span>
             </>
          ) : (
             <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.free}</span>
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
