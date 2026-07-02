import type { Metadata } from "next";
import RootRedirectClient from "./RootRedirectClient";

const title = "橙子 AI — 主流 AI 账号和低价 API 资源，一站下单";
const description = "买 AI 账号、买 API 额度、做内容推广。网页直接下单，按商品类型交付账号、卡密、充值说明或额度码。";

export const metadata: Metadata = {
  metadataBase: new URL("https://cheng-zi-ai.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "橙子 AI",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/images/new-api-doc-logo.png",
        width: 335,
        height: 329,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/new-api-doc-logo.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/zh",
      "en-US": "/en",
    },
  },
};

export default function Root() {
  return <RootRedirectClient />;
}
