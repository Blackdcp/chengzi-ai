import { getDictionary } from '../../../lib/dictionaries'
import ApiServiceClientPage from './ApiServiceClientPage'
import type { Metadata } from 'next'

function getApiServiceFaqItems(lang: 'zh' | 'en') {
  const isEn = lang === 'en'
  return [
    {
      question: isEn ? 'Is this an official service?' : '这是官方服务吗？',
      answer: isEn
        ? 'No. ChengZi AI is a third-party API relay and platform credit service, not affiliated with or authorized by OpenAI, Anthropic, or Google.'
        : '不是。橙子 AI 是第三方 API 中转与平台计价额度服务，不是 OpenAI、Anthropic、Google 官方服务，也不是官方授权代理。',
    },
    {
      question: isEn ? 'What am I buying?' : '购买的是什么？',
      answer: isEn
        ? 'You are purchasing a redemption code for ChengZi AI platform credit. After redemption, you can view balance and usage logs in the console.'
        : '购买的是橙子 AI 平台计价额度兑换码。兑换后可在控制台查看余额、调用记录和消耗情况。',
    },
    {
      question: isEn ? 'Which clients can use this API?' : '哪些客户端可以使用这个 API？',
      answer: isEn
        ? 'OpenAI-compatible clients such as Cursor, Cline, ChatBox, and NextChat can usually use the /v1 endpoint. Claude Code uses a separate Base URL without /v1.'
        : 'Cursor、Cline、ChatBox、NextChat 等 OpenAI 兼容客户端通常使用 /v1 地址。Claude Code 使用不带 /v1 的单独 Base URL。',
    },
    {
      question: isEn ? 'Are model fees different?' : '不同模型扣费一样吗？',
      answer: isEn
        ? 'Yes. Different models and endpoints consume credit at different rates. The actual deduction is based on console usage logs.'
        : '不一样。不同模型和线路会按不同倍率消耗额度，实际扣费以控制台调用日志为准。',
    },
    {
      question: isEn ? 'Is it suitable for production?' : '适合生产环境吗？',
      answer: isEn
        ? 'It is best suited for individual developers, small team testing, AI client integration, and lightweight usage. It is not recommended for high-risk or core enterprise production scenarios.'
        : '更适合个人开发者、小团队测试、AI 客户端配置和轻量使用。不建议用于企业核心生产、高并发核心业务或医疗、金融、法律等高风险场景。',
    },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  
  const title = isEn 
    ? "ChengZi AI API Gateway | OpenAI-Compatible API"
    : "橙子 AI API 中转服务 | OpenAI 兼容接口";
    
  const description = isEn
    ? "Buy ChengZi AI API credits for OpenAI-compatible access in Cursor, Claude Code, Cline, ChatBox, and NextChat."
    : "购买橙子 AI API 额度，支持 OpenAI 兼容接口，可用于 Cursor、Claude Code、Cline、ChatBox 和 NextChat。";

  return {
    metadataBase: new URL("https://cheng-zi-ai.com"),
    title,
    description,
    keywords: isEn
      ? [
          'AI API service',
          'OpenAI compatible API',
          'Cursor API Base URL',
          'Claude Code API',
          'Cline API',
          'ChatBox API',
          'AI coding API',
        ]
      : [
          'AI API 中转',
          'OpenAI 兼容 API',
          'Cursor API 配置',
          'Claude Code API',
          'Cline API',
          'ChatBox API',
          '低价 AI API',
          'AI Coding API',
        ],
    openGraph: {
      title,
      description,
      url: `/${lang}/api-service`,
      siteName: isEn ? "ChengZi AI" : "橙子 AI",
      locale: isEn ? "en_US" : "zh_CN",
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
      canonical: `/${lang}/api-service`,
      languages: {
        "zh-CN": "/zh/api-service",
        "en-US": "/en/api-service",
      },
    },
  };
}

export default async function ApiServicePage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const dict = await getDictionary(lang);
  const title = isEn
    ? 'ChengZi AI API Service'
    : '橙子 AI API 中转服务'
  const description = isEn
    ? 'OpenAI-compatible API access for Cursor, Claude Code, Cline, ChatBox, and NextChat.'
    : '面向 Cursor、Claude Code、Cline、ChatBox、NextChat 的 OpenAI 兼容 API 中转服务。'
  const faqItems = getApiServiceFaqItems(lang)
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    serviceType: isEn ? 'AI API relay and platform credit service' : 'AI API 中转与平台计价额度服务',
    provider: {
      '@type': 'Organization',
      name: dict.header.title,
      url: 'https://cheng-zi-ai.com',
      email: 'chengziai2026@163.com',
    },
    areaServed: 'Worldwide',
    offers: [
      {
        '@type': 'Offer',
        name: isEn ? '$100 platform credit code' : '$100 平台计价额度兑换码',
        price: isEn ? '14' : '100',
        priceCurrency: isEn ? 'USD' : 'CNY',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: isEn ? '$300 platform credit code' : '$300 平台计价额度兑换码',
        price: isEn ? '42' : '300',
        priceCurrency: isEn ? 'USD' : 'CNY',
        availability: 'https://schema.org/InStock',
      },
    ],
    url: `https://cheng-zi-ai.com/${lang}/api-service`,
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
        name: title,
        item: `https://cheng-zi-ai.com/${lang}/api-service`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ApiServiceClientPage dict={dict} lang={lang} />
    </>
  );
}
