import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "橙子AI — ChatGPT Plus 成品号 & 直充",
  description: "ChatGPT Plus 成品号、直充代开通。人工交付，付款后 24h 内处理。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}