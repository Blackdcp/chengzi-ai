import { getDictionary } from '../../../lib/dictionaries'
import ApiServiceClientPage from './ApiServiceClientPage'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  
  const title = isEn 
    ? "ChengZi AI — Low-cost AI API Service | OpenAI, Claude, Gemini Compatible"
    : "橙子AI — 低价 AI API 中转服务 | OpenAI / Claude / Gemini 兼容";
    
  const description = isEn
    ? "Buy platform credit codes for low-cost AI API access. Compatible with OpenAI-style API clients such as Cursor, Cline, ChatBox, and NextChat. Third-party service for developers and lightweight testing."
    : "购买 AI API 平台计价额度兑换码，支持 OpenAI 兼容格式，可用于 Cursor、Cline、ChatBox、NextChat 等支持自定义 Base URL 的客户端。非官方服务，适合个人开发者和小团队测试使用。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function ApiServicePage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ApiServiceClientPage dict={dict} lang={lang} />;
}
