import type { Metadata } from "next";
import ReferralCardClient from "./ReferralCardClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: "zh" | "en" }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const title = isEn
    ? "Referral Card Generator | ChengZi AI"
    : "推广卡片生成器 | 橙子 AI";
  const description = isEn
    ? "Generate a shareable referral card for ChengZi AI API credits."
    : "把橙子 AI 邀请链接生成可下载的推广卡片。";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReferralCardPage({ params }: { params: Promise<{ lang: "zh" | "en" }> }) {
  const { lang } = await params;
  return <ReferralCardClient lang={lang} />;
}
