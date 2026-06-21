import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "橙子AI — Gemini Pro ¥100/年 | ChatGPT Plus 成品号 & 直充",
  description: "Gemini Pro 1年订阅 ¥100（官方¥1,740+），含绑卡 CDK 自助激活。ChatGPT Plus 成品号 ¥66.66 起，直充 ¥168.88。人工交付，24h 内处理。",
};

export default async function RootLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}