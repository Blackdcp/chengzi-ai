import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { getDictionary } from "../../lib/dictionaries";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });

export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);
  const lang = resolvedParams.lang;
  const canonicalPath = `/${lang}`;
  
  return {
    metadataBase: new URL("https://cheng-zi-ai.com"),
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: canonicalPath,
      siteName: dict.header.title,
      locale: lang === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/new-api-doc-logo.png",
          width: 335,
          height: 329,
          alt: dict.meta.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/new-api-doc-logo.png"],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        "zh-CN": "/zh",
        "en-US": "/en",
      },
    },
  };
}

export default async function RootLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.variable}>
      <body className={lang === 'en' ? 'font-en tracking-tight' : 'font-zh tracking-tight'}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
