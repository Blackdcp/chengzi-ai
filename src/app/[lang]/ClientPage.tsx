"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
import type { GuideSummary } from "../../lib/guides";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type PaymentMethod = "alipay" | "wechat";
type HomeDictionary = {
  header: { title: string };
  common: {
    currency: string;
    soldOut: string;
    details: string;
    free: string;
  };
  modal: Record<string, string>;
};

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function genOrderId() {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  const t = `${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}`;
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CZ${d}${t}${r}`;
}

export default function HomePage({ dict, products, guides, lang, refCode }: { dict: HomeDictionary, products: Product[], guides: GuideSummary[], lang: string, refCode?: string }) {
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string; actionType?: string; categoryId?: string } | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [requirement, setRequirement] = useState("");
  const [requirementErr, setRequirementErr] = useState("");
  const [step, setStep] = useState<"pay" | "consult" | "success">("pay");
  const payMethod: PaymentMethod = "alipay";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const switchLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const buy = (product: Product) => {
    if (product.actionType === "link" && product.linkUrl) {
      window.open(product.linkUrl, "_blank");
      return;
    }
    setModal({ 
      name: product.orderName, 
      price: product.price, 
      orderId: genOrderId(), 
      actionType: product.actionType || "buy",
      categoryId: product.categoryId
    });
    setEmail("");
    setEmailErr("");
    setRequirement("");
    setRequirementErr("");
    setStep(product.actionType === "consult" ? "consult" : "pay");
  };

  const submitOrder = async () => {
    if (!em(email)) { setEmailErr(dict.modal.emailErr || "Invalid email"); return; }
    setEmailErr("");
    if (!modal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: modal.orderId,
          email: email,
          productName: modal.name,
          price: modal.price,
          payMethod: lang === 'en' ? "paypal" : payMethod,
          refCode: refCode,
          refSource: refCode ? "homepage" : undefined
        })
      });
      if (res.ok) {
        setStep("success");
      } else {
        alert("提交失败，请稍后重试 (Submit failed)");
      }
    } catch {
      alert("提交失败，请稍后重试 (Submit failed)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitConsult = async () => {
    if (!em(email)) { setEmailErr(dict.modal.emailErr || "Invalid email"); return; }
    setEmailErr("");
    if (!requirement.trim()) { setRequirementErr("Require details"); return; }
    setRequirementErr("");
    
    if (!modal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          requirement: requirement,
          productName: modal.name,
          refCode: refCode
        })
      });
      if (res.ok) {
        setStep("success");
      } else {
        alert("提交失败，请稍后重试 (Submit failed)");
      }
    } catch {
      alert("提交失败，请稍后重试 (Submit failed)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"all" | "chatgpt" | "claude" | "grok" | "gemini">("all");

  const activeProducts = products.filter(p => p.inStock);

  const productsByCategory: Record<string, Product[]> = {
    chatgpt: activeProducts.filter(p => p.categoryId === "chatgpt"),
    claude: activeProducts.filter(p => p.categoryId === "claude"),
    grok: activeProducts.filter(p => p.categoryId === "grok"),
    gemini: activeProducts.filter(p => p.categoryId === "gemini")
  };

  const pageNavItems = [
    { href: "#accounts", label: lang === 'zh' ? 'AI 账号' : 'AI Accounts' },
    { href: "#guides", label: lang === 'zh' ? '教程' : 'Guides' },
    { href: "#flow", label: lang === 'zh' ? '购买流程' : 'Order Flow' }
  ];

  const filteredProducts = activeTab === "all" 
    ? activeProducts 
    : (productsByCategory[activeTab] || []);

  const productHints: Record<string, string> = {
    "chatgpt-plus-ph-account": lang === 'zh' ? "超值引流爆款！独享 Plus 成品号，带完整密码与 2FA，可自行换绑邮箱。" : "Best-value dedicated Plus ready account with 2FA included, email rebind supported.",
    "chatgpt-plus-ph": lang === 'zh' ? "低于官方 $20 美元原价！官方正规卡充，卡密提取后 5 天内有效，24 小时自助兑换。" : "Cheaper than official $20 USD! Official card top-up, valid for 5 days, 24/7 self-service.",
    "chatgpt-plus-ios": lang === 'zh' ? "iOS 官方正规通道充值，无需账号密码，卡密可囤 3 天，1-3 分钟极速秒充。" : "Official iOS in-app top-up, no password needed, 3-day stockable key, 1-3 mins delivery.",
    "chatgpt-plus-ready": lang === 'zh' ? "注册满一周以上纯净老号 + 顶级 IP 订阅，含完整 2FA 资料，独享开箱即用。" : "Dedicated aged account with 1-month Plus and full 2FA access included.",
    "chatgpt-pro-10x-ready": lang === 'zh' ? "高权重满周老号 + 官方 Pro 10X ($100档) 1个月订阅，含完整 2FA，开箱即用。" : "1+ week aged account pre-loaded with official Pro 10X ($100 tier) & 2FA.",
    "chatgpt-pro-20x-ready": lang === 'zh' ? "比官方 $200 美元直充立省 ¥200！满周高权重老号 + Pro 20X 1个月订阅，含 2FA。" : "Save ¥200 vs official $200 rate! Aged ready account with Pro 20X & 2FA.",
    "chatgpt-sms-verify": lang === 'zh' ? "美国真实实体手机卡接码，有效期约 25 天，专为 OpenAI / ChatGPT 注册与验证打造。" : "Real US physical SIM verification (~25 days valid), dedicated to OpenAI / ChatGPT.",
    "chatgpt-pro-5x-card": lang === 'zh' ? "低于官方 $100 汇率价！升级 10X 官方正规卡充，卡密可囤 5 天，享 30 天质保。" : "Below official $100 USD rate! Upgraded 10X official card top-up, 5-day stockable key.",
    "chatgpt-pro-5x-ios": lang === 'zh' ? "iOS 官方内购直充 Pro 10X ($100档)，无需账号密码，秒级到账，享 30 天质保。" : "Official iOS top-up for Pro 10X ($100 tier), passwordless instant delivery with 30-day warranty.",
    "chatgpt-pro-20x-renew": lang === 'zh' ? "立省 ¥150+！20X-200刀款官方卡充直充自己账号，卡密可囤 5 天，自助秒充。" : "Save ¥150+! 20X ($200 tier) official card top-up to your own account, 5-day stockable key.",
    "chatgpt-pro-20x-ios": lang === 'zh' ? "20X-200刀款 iOS 官方正规内购直充，低于官方美元直充价，秒充秒到账，质保 30 天。" : "Official iOS in-app top-up for Pro 20X ($200 tier), instant activation with 30-day warranty.",
    "chatgpt-pro-25x-500": lang === 'zh' ? "立省 ¥175+！全新升级 50X-500刀顶配官方卡充，直充自己账号，享 30 天全程质保。" : "Save ¥175+! Upgraded 50X ($500 tier) official card top-up with 30-day full warranty.",
    "chatgpt-pro-50x-ios": lang === 'zh' ? "50X-500刀顶配 iOS 官方正规内购直充，免海外信用卡风控，秒充到账，质保 30 天。" : "Official iOS top-up for flagship 50X ($500 tier), instant delivery with 30-day warranty.",
    "codex-credits-250": lang === 'zh' ? "直充 250 点数额度到自己账号（非 API 余额），充值立即到账，需账号已有有效付费订阅。" : "Adds 250 Codex credits instantly (not API balance). Active paid subscription required.",
    "codex-credits-500": lang === 'zh' ? "直充 500 点数额度到自己账号，突破周限额首选加餐包，充值立即到账（需有效订阅）。" : "Adds 500 Codex credits instantly to extend coding limits (active paid subscription required).",
    "codex-credits-1000": lang === 'zh' ? "直充 1000 点数额度到自己账号，重度 Codex CLI / IDE 开发者必备，立即到账（需有效订阅）。" : "Adds 1000 Codex credits instantly for heavy CLI/IDE coding (active paid subscription required).",
    "codex-credits-2500": lang === 'zh' ? "直充 2500 大额点数到自己账号，超高单价性价比，立即到账（需有效付费订阅）。" : "Adds 2500 Codex credits instantly with best per-credit value (active paid subscription required).",
    "claude-ultra-ready": lang === 'zh' ? "Claude Ultra ($200档，原 MAX 20X) 已过 KYC 成品号！下单 1-2 天交付，保障首登及 30 天订阅。" : "KYC-verified Claude Ultra ($200/mo tier) ready account! Delivered in 1–2 days with first-login guarantee.",
    "claude-kyc-verify": lang === 'zh' ? "Claude 官方 KYC 验证协助，UU 远程一对一操作（10-30分钟），失败或过程中封号全额退款。" : "1-on-1 Claude KYC verification via UU Remote (10–30 mins). Full refund on failure or mid-process ban.",
    "claude-portal-verify": lang === 'zh' ? "Claude 门户验证专业协助，UU 远程一对一指导（10-30分钟），失败或过程中封号全额退款。" : "1-on-1 Claude Portal verification via UU Remote (10–30 mins). Full refund on failure or mid-process ban.",
    "grok-plus": lang === 'zh' ? "新版多合一官方卡充，支持 Web / iOS / Android 全端通用，需无订阅状态充值。" : "New all-in-one official card top-up for Web, iOS, and Android (free tier required).",
    "gemini-pro-18m": lang === 'zh' ? "🔥 Gemini Pro 3个月会员 + 5TB 云存储（xiaomi版），支持反重力4，代开充自己账户！" : "🔥 Gemini Pro 3-Month + 5TB Cloud Storage (xiaomi edition), supports Antigravity 4, direct top-up to your account!",
    "gemini-ultra-5x-ios": lang === 'zh' ? "Google AI Ultra 5X ($99.99/月档) iOS 官方直充，低于官价，享 5 倍 Pro 算力与订阅质保。" : "Official iOS top-up for Google AI Ultra 5X ($99.99/mo tier), below USD rate with subscription warranty.",
    "gemini-ultra-20x-ios": lang === 'zh' ? "立省 ¥270！Google AI Ultra 20X ($199.99/月顶配) iOS 官方直充，20 倍算力 + 30TB 云存。" : "Save ¥270! Official iOS top-up for Google AI Ultra 20X ($199.99/mo flagship), 20x quota + 30TB storage."
  };

  const getProductBadge = (product: Product) => {
    if (product.id.includes("pro-20x") || product.id.includes("25x") || product.id.includes("50x") || product.id === "claude-ultra-ready" || product.id === "gemini-ultra-20x-ios") return lang === 'zh' ? "旗舰顶配" : "Flagship";
    if (product.id === "chatgpt-plus-ph-account" || product.id === "gemini-pro-18m") return lang === 'zh' ? "超值爆款" : "Best Value";
    if (product.id.includes("plus") || product.id === "claude-kyc-verify" || product.id === "gemini-ultra-5x-ios") return lang === 'zh' ? "高性价比" : "Popular";
    if (product.isHot) return lang === 'zh' ? "热门" : "Hot";
    return "";
  };

  const renderProductRow = (product: Product, label?: string) => {
    const badge = getProductBadge(product);

    return (
    <div
      key={product.id}
      className={`vercel-card cz-product-row${badge ? " cz-product-featured" : ""}`}
      style={{
        background: "#ffffff",
        border: "1px solid #eaeaea",
        boxShadow: badge ? "0 10px 26px rgba(0,0,0,0.045)" : undefined,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div className="cz-product-main">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            padding: "3px 9px", 
            background: "#f3f4f6", 
            borderRadius: "6px", 
            color: "#374151", 
            fontSize: 12, 
            fontWeight: 700 
          }}>
            {label || product.categoryName}
          </span>
          <h3 className="cz-product-title" style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>{product.title}</h3>
          {badge && (
            <span className="cz-product-badge" style={{ border: "1px solid #111827", color: "#ffffff", padding: "2px 8px", fontSize: 11, fontWeight: 700, borderRadius: "999px", background: "#111827" }}>
              {badge}
            </span>
          )}
        </div>
        <p className="cz-product-subtitle" style={{ color: "#666", fontSize: 14, lineHeight: 1.6, margin: "0 0 10px" }} dangerouslySetInnerHTML={{ __html: product.subtitle }} />
        {productHints[product.id] && (
          <div className="cz-product-hint" style={{ fontSize: 13, color: "#111827", marginBottom: 10, lineHeight: 1.5 }}>{productHints[product.id]}</div>
        )}
        <div className="cz-product-tags" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {product.tags.map(tag => (
            <span key={tag} className="cz-product-tag" style={{ padding: "4px 10px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: 999, color: "#666", fontSize: 12 }}>{tag}</span>
          ))}
        </div>
        {product.actionType !== "link" && (
          <Link
            href={`/${lang}/products/${product.id}`}
            className="cz-inline-link"
            style={{ display: "inline-flex", marginTop: 10, color: "#111827", fontSize: 13, fontWeight: 800, textDecoration: "none" }}
          >
            {lang === 'zh' ? '产品详情页 →' : 'Product details →'}
          </Link>
        )}
      </div>

      <div className="cz-product-action">
        <div className="cz-product-price" style={{ fontSize: 30 }}>
          {product.actionType !== 'consult' ? `${dict.common.currency}${product.price}` : (lang === 'zh' ? '咨询报价' : 'Consulting')}
        </div>
        <div className="cz-product-buttons">
          {product.inStock ? (
            <button onClick={() => buy(product)} className="vercel-button" style={{ padding: "11px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {product.buyButtonText}
            </button>
          ) : (
            <div style={{ padding: "11px 18px", background: "#fafafa", color: "#999999", textAlign: "center", fontSize: 14, fontWeight: 500, border: "1px solid #eaeaea", borderRadius: "6px" }}>{dict.common.soldOut}</div>
          )}
          {product.detail && (
            <button onClick={() => setDetailProduct(product)} className="vercel-button-secondary" style={{ padding: "11px 14px", textAlign: "center", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              {dict.common.details}
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };

  const renderSectionHeader = (index: string, title: string, desc: string) => (
    <div className="cz-section-head">
      <div className="cz-section-index">{index}</div>
      <div>
        <h2 style={{ fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#111827", margin: "0 0 10px", letterSpacing: "-0.04em", lineHeight: 1.12 }}>
          {title}
        </h2>
        <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 760 }}>
          {desc}
        </p>
      </div>
    </div>
  );

  return (
    <div className="cz-home" style={{ minHeight: "100vh", lineHeight: 1.5, background: "#fafafa" }}>
      <style>{`
        .cz-home {
          --cz-accent: #ff6a00;
        }
        .cz-header {
          padding: 10px 0 !important;
        }
        .cz-header-inner {
          height: auto !important;
          min-height: 48px;
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          padding: 0 12px !important;
          gap: 8px !important;
        }
        .cz-header-nav {
          grid-column: 1 / -1;
          gap: 14px !important;
          font-size: 13px !important;
          overflow-x: auto;
          padding: 2px 0 0 !important;
          -webkit-overflow-scrolling: touch;
        }
        .cz-page {
          max-width: 1120px;
          margin: 0 auto;
          padding: 16px 12px 42px;
        }
        .cz-hero {
          padding: 28px 0 26px !important;
          text-align: left !important;
        }
        .cz-hero-title {
          font-size: clamp(34px, 11vw, 52px) !important;
          max-width: 620px !important;
          margin: 0 0 14px !important;
        }
        .cz-hero-copy {
          font-size: 16px !important;
          max-width: 620px !important;
          margin: 0 0 22px !important;
          line-height: 1.65 !important;
        }
        .cz-hero-shell {
          display: block;
        }
        .cz-hero-panel {
          display: none;
        }
        .cz-hero-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          width: 100%;
        }
        .cz-hero-actions a {
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          border-radius: 12px;
          padding: 14px 16px !important;
        }
        .cz-hero-primary {
          background: #111827 !important;
          border-color: #111827 !important;
          color: #ffffff !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        }
        .cz-hero-actions a,
        .cz-product-buttons button,
        .cz-product-buttons a,
        .nav-link,
        .cz-inline-link {
          transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .cz-hero-actions a:hover,
        .cz-hero-actions a:focus-visible,
        .cz-product-buttons .vercel-button:hover,
        .cz-product-buttons .vercel-button:focus-visible {
          background: var(--cz-accent) !important;
          border-color: var(--cz-accent) !important;
          color: #ffffff !important;
          box-shadow: 0 10px 22px rgba(255, 106, 0, 0.18);
        }
        .cz-product-buttons .vercel-button-secondary:hover,
        .cz-product-buttons .vercel-button-secondary:focus-visible,
        .nav-link:hover,
        .nav-link:focus-visible,
        .cz-inline-link:hover,
        .cz-inline-link:focus-visible {
          color: var(--cz-accent) !important;
          border-color: var(--cz-accent) !important;
        }
        .cz-hero-note {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          max-width: 100%;
          padding: 7px 10px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #ffffff;
          color: #111827;
          font-size: 12px;
          font-weight: 700;
        }
        .cz-section {
          margin-bottom: 52px;
          scroll-margin-top: 112px;
        }
        .cz-section-head {
          display: block;
          margin-bottom: 18px;
        }
        .cz-section-index {
          color: #111827;
          border: 1px solid #111827;
          border-radius: 999px;
          width: 46px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: #ffffff;
          margin-bottom: 12px;
        }
        .cz-product-row {
          display: block;
          padding: 16px;
          border-radius: 16px;
        }
        .cz-product-featured::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #111827;
        }
        .cz-product-label {
          display: inline-flex;
          align-items: center;
          width: auto;
          margin-bottom: 12px;
          padding: 4px 10px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #fafafa;
          color: #111827;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.25;
        }
        .cz-product-main {
          flex: 1 1 360px;
          min-width: 0;
        }
        .cz-product-action {
          margin-top: 16px;
          text-align: left;
        }
        .cz-product-price {
          color: #111827;
          font-weight: 850;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 12px;
          font-size: 28px !important;
        }
        .cz-product-buttons {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          justify-content: stretch;
        }
        .cz-product-buttons button,
        .cz-product-buttons a {
          border-radius: 10px;
          width: 100%;
          min-height: 44px;
        }
        .cz-product-title {
          font-size: 17px !important;
          line-height: 1.28 !important;
        }
        .cz-product-subtitle {
          font-size: 13px !important;
          line-height: 1.55 !important;
          margin-bottom: 8px !important;
        }
        .cz-product-hint {
          margin: 10px 0 !important;
          padding: 9px 10px;
          border-left: 2px solid #111827;
          border-radius: 8px;
          background: #fafafa;
        }
        .cz-product-tags {
          flex-wrap: nowrap !important;
          overflow-x: auto;
          margin: 0 -16px;
          padding: 0 16px 2px;
          -webkit-overflow-scrolling: touch;
        }
        .cz-product-tag {
          white-space: nowrap;
          font-size: 11px !important;
        }
        .cz-featured-guides {
          grid-template-columns: 1fr;
        }
        .cz-featured-guide-card:nth-of-type(n+3) {
          display: none !important;
        }
        .cz-detail-list {
          display: grid;
          gap: 14px;
        }
        .cz-detail-section {
          padding-top: 18px;
          border-top: 1px solid #eaeaea;
        }
        .cz-detail-overlay {
          align-items: flex-end !important;
          padding: 0 !important;
        }
        .cz-detail-panel {
          max-width: 100% !important;
          max-height: 88vh !important;
          border-radius: 20px 20px 0 0 !important;
        }
        .cz-api-float {
          position: fixed;
          left: 12px;
          right: 12px;
          bottom: calc(12px + env(safe-area-inset-bottom));
          z-index: 70;
          display: flex;
          gap: 8px;
          align-items: center;
          pointer-events: none;
        }
        .cz-api-float-link {
          pointer-events: auto;
          flex: 1;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          min-height: 52px;
          padding: 10px 12px;
          background: #111827;
          border: 1px solid #111827;
          border-radius: 16px;
          color: #ffffff;
          text-decoration: none;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.2);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .cz-api-float-link:hover,
        .cz-api-float-link:focus-visible {
          transform: translateY(-2px);
          border-color: var(--cz-accent);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
        }
        .cz-api-float-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--cz-accent);
        }
        .cz-api-float-title {
          font-size: 14px;
          font-weight: 850;
          line-height: 1.1;
          margin-bottom: 3px;
        }
        .cz-api-float-desc {
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          line-height: 1.2;
        }
        .cz-api-float-arrow {
          font-size: 18px;
          font-weight: 800;
          opacity: 0.9;
        }
        .cz-api-float-close {
          pointer-events: auto;
          width: 34px;
          height: 34px;
          border: 1px solid #eaeaea;
          border-radius: 999px;
          background: #ffffff;
          color: #666;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
        }
        @media (min-width: 721px) {
          .cz-header {
            padding: 16px 0 !important;
          }
          .cz-header-inner {
            height: 60px !important;
            display: flex !important;
            padding: 0 16px !important;
            gap: 16px !important;
          }
          .cz-header-nav {
            grid-column: auto;
            gap: 16px !important;
            font-size: 14px !important;
            padding-bottom: 2px !important;
          }
          .cz-page {
            max-width: 1120px;
            padding: max(22px, 4vw) 18px max(44px, 8vw);
          }
          .cz-hero {
            padding: max(28px, 5vw) 0 max(42px, 6vw) !important;
            text-align: left !important;
          }
          .cz-hero-shell {
            display: grid;
            grid-template-columns: minmax(0, 1.18fr) minmax(320px, 0.82fr);
            gap: clamp(28px, 4vw, 56px);
            align-items: center;
            padding: clamp(34px, 5vw, 56px);
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 28px;
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.05);
          }
          .cz-hero-title {
            font-size: clamp(30px, 5vw, 52px) !important;
            max-width: 680px !important;
            margin: 0 0 18px !important;
          }
          .cz-hero-copy {
            font-size: clamp(16px, 2vw, 19px) !important;
            max-width: 660px !important;
            margin: 0 0 28px !important;
          }
          .cz-hero-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-start;
            flex-wrap: wrap;
            width: auto;
          }
          .cz-hero-actions a {
            width: auto;
            padding: 12px 24px !important;
          }
          .cz-hero-note {
            margin-top: 18px;
            font-size: 13px;
          }
          .cz-hero-panel {
            display: block;
            padding: 24px;
            background: #fafafa;
            border: 1px solid #eaeaea;
            border-radius: 22px;
          }
          .cz-hero-panel-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            color: #111827;
            font-size: 13px;
            font-weight: 800;
          }
          .cz-accent-dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: var(--cz-accent);
          }
          .cz-hero-panel-list {
            display: grid;
            gap: 10px;
          }
          .cz-hero-panel-item {
            display: grid;
            grid-template-columns: 34px minmax(0, 1fr);
            gap: 12px;
            padding: 14px;
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 16px;
          }
          .cz-hero-panel-num {
            color: #666;
            font-size: 12px;
            font-weight: 800;
          }
          .cz-hero-panel-title {
            color: #111827;
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 3px;
          }
          .cz-hero-panel-desc {
            color: #666;
            font-size: 13px;
            line-height: 1.45;
          }
          .cz-section {
            margin-bottom: 72px;
            scroll-margin-top: 110px;
          }
          .cz-section-head {
            display: grid;
            grid-template-columns: 56px minmax(0, 1fr);
            gap: 18px;
            align-items: start;
            margin-bottom: 24px;
          }
          .cz-section-index {
            width: auto;
            height: 36px;
            display: flex;
            font-size: 13px;
            margin-bottom: 0;
          }
          .cz-product-row {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 24px;
            border-radius: 18px;
          }
          .cz-product-featured::before {
            width: 4px;
          }
          .cz-product-label {
            display: none;
          }
          .cz-product-action {
            flex: 0 0 180px;
            margin-top: 0;
            text-align: right;
          }
          .cz-product-price {
            font-size: 30px !important;
            margin-bottom: 14px;
          }
          .cz-product-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            flex-wrap: wrap;
          }
          .cz-product-buttons button,
          .cz-product-buttons a {
            width: auto;
            min-height: auto;
          }
          .cz-product-title {
            font-size: 20px !important;
          }
          .cz-product-subtitle {
            font-size: 14px !important;
          }
          .cz-product-hint {
            padding: 8px 10px;
            border-left: 2px solid #111827;
            border-radius: 8px;
            background: #fafafa;
          }
          .cz-product-tags {
            flex-wrap: wrap !important;
            overflow: visible;
            margin: 0;
            padding: 0;
          }
          .cz-product-tag {
            font-size: 12px !important;
          }
          .cz-featured-guides {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .cz-featured-guide-card:nth-of-type(n+3) {
            display: block !important;
          }
          .cz-detail-overlay {
            align-items: center !important;
            padding: 20px !important;
          }
          .cz-detail-panel {
            max-width: 560px !important;
            max-height: 86vh !important;
            border-radius: 18px !important;
          }
          .cz-api-float {
            left: auto;
            right: 24px;
            bottom: 24px;
            width: 268px;
          }
          .cz-api-float-link {
            min-height: 68px;
            padding: 14px 16px;
            border-radius: 20px;
            background: #ffffff;
            color: #111827;
            border-color: #eaeaea;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.14);
          }
          .cz-api-float-link:hover,
          .cz-api-float-link:focus-visible {
            border-color: var(--cz-accent);
          }
          .cz-api-float-desc {
            color: #666;
          }
          .cz-api-float-arrow {
            color: #111827;
          }
        }
        @media (min-width: 960px) {
          .cz-featured-guides {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>

      <header className="cz-header" style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "16px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="cz-header-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", gap: 16 }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
            <Image
              src={lang === 'zh' ? '/images/logo-zh.png' : '/images/logo-en.png'}
              alt={dict.header.title}
              width={lang === 'zh' ? 1309 : 1392}
              height={lang === 'zh' ? 329 : 283}
              style={{ height: 27, width: 'auto', display: "block" }}
            />
          </Link>
          <div className="cz-header-nav" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontWeight: 500, minWidth: 0, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 2, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {pageNavItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{ textDecoration: "none", color: "#666666", transition: "color 0.2s ease", flexShrink: 0 }}
              >
                {item.label}
              </a>
            ))}
            <button onClick={switchLang} style={{ background: "none", border: "1px solid #eaeaea", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#666", flexShrink: 0 }}>
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </header>

      <div className="cz-page" style={{ maxWidth: 1120, margin: "0 auto", padding: "max(20px, 4vw) 16px max(40px, 8vw)" }}>
        <section className="cz-hero" style={{ padding: "max(42px, 8vw) 0 max(34px, 6vw)", textAlign: "center" }}>
          <div className="cz-hero-shell">
            <div className="cz-hero-main">
              <h1 className="cz-hero-title" style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.05em", lineHeight: 1.08, margin: "0 auto 18px", maxWidth: 860 }}>
                {lang === 'zh' ? '主流 AI 官方正规账号与会员直充，一站下单' : 'Official AI Accounts & Subscriptions, Fast Delivery'}
              </h1>
              <p className="cz-hero-copy" style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#666666", maxWidth: 720, margin: "0 auto 28px", lineHeight: 1.7 }}>
                {lang === 'zh'
                  ? '专注 ChatGPT、Claude、Grok、Gemini 等官方正规会员直充与成品号。网页直接下单，自动安全交付。'
                  : 'Official subscriptions and accounts for ChatGPT, Claude, Grok, and Gemini. Fast, reliable, and secure delivery.'}
              </p>
              <div className="cz-hero-actions">
                <a href="#accounts" className="vercel-button cz-hero-primary" style={{ padding: "12px 28px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>{lang === 'zh' ? '立即选购 AI 账号' : 'Explore AI Accounts'}</a>
              </div>
              <div className="cz-hero-note">
                {lang === 'zh' ? 'ChatGPT Plus/Pro/Codex · Claude Ultra/KYC · Grok · Gemini Pro/Ultra' : 'ChatGPT Plus/Pro/Codex · Claude Ultra/KYC · Grok · Gemini Pro/Ultra'}
              </div>
            </div>

            <div className="cz-hero-panel" aria-label={lang === 'zh' ? '服务类型概览' : 'Service overview'}>
              <div className="cz-hero-panel-label">
                <span className="cz-accent-dot" />
                {lang === 'zh' ? '官方正规保障' : 'Official Verified'}
              </div>
              <div className="cz-hero-panel-list">
                {[
                  {
                    num: '01',
                    title: lang === 'zh' ? '四大前沿生态' : 'Top 4 Frontier AI',
                    desc: lang === 'zh' ? 'ChatGPT · Claude · Grok · Gemini' : 'ChatGPT, Claude, Grok & Gemini'
                  },
                  {
                    num: '02',
                    title: lang === 'zh' ? '全额质保与秒充' : 'Full Warranty & Instant',
                    desc: lang === 'zh' ? '30天订阅保障 · 24h自助' : '30-Day warranty · 24/7 self-service'
                  }
                ].map(item => (
                  <div className="cz-hero-panel-item" key={item.num}>
                    <div className="cz-hero-panel-num">{item.num}</div>
                    <div>
                      <div className="cz-hero-panel-title">{item.title}</div>
                      <div className="cz-hero-panel-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="accounts" className="cz-section">
          {renderSectionHeader(
            "01",
            lang === 'zh' ? 'AI 会员与账号专区' : 'AI Subscriptions & Accounts',
            lang === 'zh'
              ? '支持 ChatGPT、Claude、Grok 与 Gemini 全系列正规官方充值、高阶算力与成品号，官方通道极速交付，全额质保。'
              : 'Official subscriptions, compute tiers, and ready accounts for ChatGPT, Claude, Grok, and Gemini with instant delivery.'
          )}

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            {[
              { key: "all", label: lang === 'zh' ? "全部产品" : "All Products", count: activeProducts.length },
              { key: "chatgpt", label: "ChatGPT", count: productsByCategory.chatgpt?.length || 0 },
              { key: "claude", label: "Claude", count: productsByCategory.claude?.length || 0 },
              { key: "grok", label: "Grok", count: productsByCategory.grok?.length || 0 },
              { key: "gemini", label: "Gemini", count: productsByCategory.gemini?.length || 0 }
            ].map(tab => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "999px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: isSelected ? "1px solid #111827" : "1px solid #e5e7eb",
                    background: isSelected ? "#111827" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#4b5563",
                    boxShadow: isSelected ? "0 4px 12px rgba(17, 24, 39, 0.15)" : "none",
                    transition: "all 0.18s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "999px",
                    background: isSelected ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                    color: isSelected ? "#ffffff" : "#6b7280"
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {filteredProducts.map(product => renderProductRow(product, product.categoryName))}
          </div>
        </section>

        {guides.length > 0 && (
          <section id="guides" className="cz-section" style={{ paddingTop: 40, borderTop: "1px solid #eaeaea" }}>
            {renderSectionHeader(
              "02",
              lang === 'zh' ? '实用教程：快速上手主流 AI 与前沿模型' : 'Practical guides: mastering frontier AI',
              lang === 'zh'
                ? '整理最新大模型实测、提示词调优与高效开发工作流。少走弯路，快速进阶。'
                : 'Setup notes, model benchmarks, and productivity workflows.'
            )}
            <div className="cz-featured-guides" style={{ display: "grid", gap: 14 }}>
              {guides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/${lang}/guides/${guide.slug}`}
                  className="vercel-card cz-inline-link cz-featured-guide-card"
                  style={{ display: "block", padding: 20, background: "#ffffff", color: "#111827", textDecoration: "none", minHeight: 176 }}
                >
                  <div style={{ fontSize: 12, color: "#666", fontWeight: 800, marginBottom: 12 }}>{guide.date}</div>
                  <h3 style={{ fontSize: 17, lineHeight: 1.35, letterSpacing: 0, margin: "0 0 10px", color: "#111827" }}>{guide.title}</h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{guide.description}</p>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <Link
                href={`/${lang}/guides`}
                className="vercel-button-secondary cz-inline-link"
                style={{ padding: "12px 18px", fontSize: 14, fontWeight: 800, color: "#111827", textDecoration: "none" }}
              >
                {lang === 'zh' ? '查看全部教程 →' : 'View all guides →'}
              </Link>
            </div>
          </section>
        )}

        <section id="flow" className="cz-section" style={{ paddingTop: 40, borderTop: "1px solid #eaeaea" }}>
          {renderSectionHeader(
            "03",
            lang === 'zh' ? '购买流程：从选择到交付' : 'Purchase flow: from choice to delivery',
            lang === 'zh'
              ? '流程尽量短：选商品、下单、按类型交付，有问题直接邮件联系。'
              : 'A short flow: choose, order, receive delivery, and contact support by email if needed.'
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { step: "1", title: lang === 'zh' ? "选择商品" : "Choose", desc: lang === 'zh' ? "按需选择 ChatGPT、Claude、Grok 或 Gemini。" : "Pick ChatGPT, Claude, Grok, or Gemini." },
              { step: "2", title: lang === 'zh' ? "网页下单" : "Order", desc: lang === 'zh' ? "直接扫码支付或提交邮箱接收卡密/账号。" : "Pay or submit details online." },
              { step: "3", title: lang === 'zh' ? "极速交付" : "Delivery", desc: lang === 'zh' ? "24小时自动发货卡密、成品号或免密直充说明。" : "Receive account, code, or top-up instructions." },
              { step: "4", title: lang === 'zh' ? "无忧售后" : "Support", desc: lang === 'zh' ? "质保期内任何问题联系 chengziai2026@163.com。" : "Contact chengziai2026@163.com for order issues." }
            ].map(item => (
              <div key={item.step} className="vercel-card" style={{ padding: 22, background: "#ffffff" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#111827", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 14 }}>{item.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="cz-section" style={{ paddingTop: 40, borderTop: "1px solid #eaeaea" }}>
          {renderSectionHeader(
            "04",
            lang === 'zh' ? '选品指南与常见问题' : 'Buyer Guide & FAQ',
            lang === 'zh'
              ? '针对不同预算、算力档位与防风控要求的核心解答，帮您 1 分钟选对方案。'
              : 'Quick answers on pricing tiers, passwordless recharge, and account safety rules.'
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {(lang === 'zh'
              ? [
                  {
                    q: "ChatGPT Plus 的 ¥85、¥129、¥149、¥169 四款怎么选？",
                    a: "追求极致性价比或备用号选【¥85 菲区半价成品号】；已有 Gmail 个人免费号想充自己号选【¥129 菲区官方卡充】（可囤5天，低于官方 $20 原价）；需要 iOS 通道选【¥149 iOS 官方秒充】（可囤3天）；想要高权重满周老号开箱即用选【¥169 独享老号成品号】。"
                  },
                  {
                    q: "ChatGPT Pro 10X / 20X / 50X 和 Codex 点数怎么选？",
                    a: "【Pro 10X (¥715卡充 / ¥725 iOS / ¥799成品号)】对应官方 $100 档；【Pro 20X (¥1300卡充 / ¥1420 iOS / ¥1250成品号)】对应官方 $200 档，比官价省 ¥150~¥200；【Pro 50X (¥3450卡充 / ¥3580 iOS)】对应官方 $500 顶配档；已订阅用户若触发 Codex 周限额，可直接选购【Codex 250/500/1000/2500 点数包】立即到账加餐。"
                  },
                  {
                    q: "Claude Ultra 过 K 成品号 (¥2250) 和 KYC / 门户验证服务怎么选？",
                    a: "需要直接上车顶配 $200 档选【Claude Ultra 过 K 成品号 (¥2250)】，1-2 天交付且保障首登与 30 天订阅；已有自己的 Claude 账号触发验证选【KYC 验证 (¥125)】或【门户验证 (¥329)】，UU 远程一对一协助，验证失败或过程中封号全额退款。"
                  },
                  {
                    q: "Gemini Pro 3个月代开 (¥45) 与 Gemini Ultra 5X (¥699) / 20X (¥1180) 怎么选？",
                    a: "尝鲜或轻中度使用选【¥45 Gemini Pro 3个月代开】（含 5TB 云存、支持反重力4，注意此款无质保不退款，建议老号且退出家庭组）；重度科研与高并发 Agent 用户选【Gemini Ultra 5X (¥699)】或【20X (¥1180，比官价 $199.99 立省 ¥270)】，iOS 官方直充享订阅质保。"
                  }
                ]
              : [
                  {
                    q: "How to choose between ChatGPT Plus ¥85, ¥129, ¥149, and ¥169?",
                    a: "Pick ¥85 (PH Ready Account) for the lowest-cost turnkey access; ¥129 (PH Card Top-up, 5-day stockable) to recharge your own Gmail below $20 USD; ¥149 (iOS Top-up, 3-day stockable); or ¥169 for a 1+ week aged ready account."
                  },
                  {
                    q: "How do ChatGPT Pro 10X, 20X, 50X, and Codex Credits compare?",
                    a: "Pro 10X (¥715 card / ¥725 iOS / ¥799 ready) is the $100 tier; Pro 20X (¥1300 card / ¥1420 iOS / ¥1250 ready) is the $200 tier saving ¥150–¥200; Pro 50X (¥3450 card / ¥3580 iOS) is the $500 flagship. Paid subscribers hitting coding caps can add Codex 250–2500 credit packs instantly."
                  },
                  {
                    q: "How do Claude Ultra Ready Account (¥2250) and KYC/Portal Verification work?",
                    a: "Claude Ultra Ready Account (¥2250) delivers a KYC-verified $200/mo flagship account in 1–2 days with first-login + 30-day sub warranty. For existing accounts needing verification, choose KYC (¥125) or Portal (¥329) via UU Remote with full refund on failure."
                  },
                  {
                    q: "Gemini Pro 3-Month (¥45) vs Gemini Ultra 5X (¥699) / 20X (¥1180)?",
                    a: "Gemini Pro 3-Month (¥45) includes 5TB storage & Antigravity 4 (as-is, no warranty, aged account recommended). For flagship compute with subscription warranty, pick Gemini Ultra 5X (¥699) or 20X (¥1180, saving ¥270 vs $199.99 USD) via official iOS top-up."
                  }
                ]
            ).map(faq => (
              <div key={faq.q} className="vercel-card" style={{ padding: 22, background: "#ffffff" }}>
                <h3 style={{ fontSize: 16, fontWeight: 750, color: "#111827", margin: "0 0 10px", lineHeight: 1.4 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      
      <footer style={{ textAlign: "center", padding: "max(20px, 4vw) 0", borderTop: "1px solid #eaeaea", color: "#666", fontSize: 14 }}>
        © {new Date().getFullYear()} {dict.header.title}. All rights reserved.<br/>
        {lang === 'zh' ? '客服邮箱：' : 'Support Email: '}
        <a href="mailto:chengziai2026@163.com" style={{ color: "#666", textDecoration: "none" }}>chengziai2026@163.com</a>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href={`/${lang}/products`} className="cz-inline-link" style={{ color: "#666", textDecoration: "none", fontWeight: 700 }}>
            {lang === 'zh' ? '产品索引' : 'Products'}
          </Link>
          <Link href={`/${lang}/guides`} className="cz-inline-link" style={{ color: "#666", textDecoration: "none", fontWeight: 700 }}>
            {lang === 'zh' ? '教程索引' : 'Guides'}
          </Link>
        </div>
      </footer>

      {detailProduct && (
        <div className="cz-detail-overlay" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.48)" }} onClick={() => setDetailProduct(null)} />
          <div className="cz-detail-panel" style={{ position: "relative", width: "100%", maxWidth: 560, maxHeight: "86vh", overflow: "auto", background: "#ffffff", border: "1px solid #eaeaea", borderRadius: 18, boxShadow: "0 24px 80px rgba(0,0,0,0.22)" }}>
            <div style={{ padding: "28px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#666", marginBottom: 10 }}>
                {detailProduct.categoryName}
              </div>
              <h3 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 850, letterSpacing: "-0.04em", lineHeight: 1.12, color: "#111827", margin: "0 32px 12px 0" }}>
                {detailProduct.detail?.title || detailProduct.title}
              </h3>
              <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
                {detailProduct.detail?.subtitle || detailProduct.subtitle}
              </p>

              <div className="cz-detail-list">
                {(detailProduct.detail?.sections || []).map(section => (
                  <div key={section.title} className="cz-detail-section">
                    <h4 style={{ color: "#111827", fontSize: 15, fontWeight: 800, margin: "0 0 10px" }}>{section.title}</h4>
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#666", fontSize: 14, lineHeight: 1.75 }}>
                      {section.items.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    setDetailProduct(null);
                    buy(detailProduct);
                  }}
                  className="vercel-button"
                  style={{ flex: "1 1 180px", padding: "12px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  {detailProduct.actionType === "link" ? (lang === 'zh' ? "去购买 / 兑换" : "Buy / redeem") : detailProduct.buyButtonText}
                </button>
                <button onClick={() => setDetailProduct(null)} className="vercel-button-secondary" style={{ flex: "1 1 120px", padding: "12px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {lang === 'zh' ? "先不买" : "Not now"}
                </button>
              </div>
            </div>
            <button onClick={() => setDetailProduct(null)} aria-label={lang === 'zh' ? "关闭详情" : "Close details"} style={{ position: "absolute", top: 16, right: 16, background: "#ffffff", border: "1px solid #eaeaea", borderRadius: "999px", width: 32, height: 32, fontSize: 20, cursor: "pointer", color: "#666", lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#ffffff", border: "1px solid #eaeaea", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
            <div style={{ padding: "32px" }}>
               <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                 {step === "consult" ? dict.modal.submitRequest : dict.modal.confirmOrder}
               </h3>
               <p style={{ margin: "0 0 16px", color: "#666666", fontSize: 14 }}>
                 {dict.modal.product}<span style={{ color: "#111827", fontWeight: 500 }}>{modal.name}</span>
               </p>
               
               {step !== "consult" && (
                 <div style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>{dict.common.currency}{modal.price}</div>
               )}
               
               {step === "consult" ? (
                 <div style={{ textAlign: "center" }}>
                   <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>{dict.modal.emailStep}</div>
                   <input 
                     type="email" 
                     placeholder={dict.modal.emailPlaceholder} 
                     value={email} 
                     onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                     style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginBottom: 20 }} 
                     onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                     onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                   />
                   {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{emailErr}</div>}

                   <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>{dict.modal.reqStep}</div>
                   <textarea 
                     placeholder={dict.modal.reqPlaceholder} 
                     value={requirement} 
                     onChange={e => { setRequirement(e.target.value); if(requirementErr) setRequirementErr(""); }} 
                     rows={4}
                     style={{ width: "100%", padding: "12px", border: requirementErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", resize: "none", marginBottom: 20 }} 
                     onFocus={(e) => { if (!requirementErr) e.target.style.borderColor = "#0a0a0a" }} 
                     onBlur={(e) => { if (!requirementErr) e.target.style.borderColor = "#eaeaea" }} 
                   />
                   {requirementErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{requirementErr}</div>}

                   <button 
                     onClick={submitConsult} 
                     disabled={isSubmitting}
                     className="vercel-button" 
                     style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                   >
                     {isSubmitting ? dict.modal.submitting : dict.modal.submitBtnConsult}
                   </button>
                 </div>
               ) : step === "pay" ? (
                 <div style={{ textAlign: "center" }}>
                   <>
                       {lang === 'en' ? (
                         <>
                           <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>1. Send Payment via PayPal</div>
                           <div style={{ background: "#f0f5ff", border: "1px solid #1677ff", borderRadius: "8px", padding: "20px", marginBottom: 24 }}>
                             <p style={{ margin: "0 0 12px", fontSize: 14, color: "#111827" }}>Please send <strong style={{color:"#1677ff"}}>{dict.common.currency}{modal.price}</strong> to our PayPal account:</p>
                             <div style={{ fontSize: 18, fontWeight: 700, color: "#1677ff", wordBreak: "break-all", userSelect: "all" }}>CHENGZIAI2026@163.COM</div>
                           </div>
                           <div style={{ borderTop: "1px dashed #eaeaea", paddingTop: 20, marginBottom: 20 }}>
                             <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>2. Confirm Your Email</div>
                             <input 
                               type="email" 
                               placeholder={dict.modal.payEmailPlaceholder} 
                               value={email} 
                               onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                               style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} 
                               onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                               onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                             />
                             {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: 8, textAlign: "left" }}>{emailErr}</div>}
                           </div>
                         </>
                       ) : (
                         <>
                           <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>第一步：请使用支付宝扫码支付对应金额</div>
                           <div style={{ width: 180, height: 180, margin: "0 auto 12px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", flexDirection: "column", overflow: "hidden" }}>
                              <Image
                                src="/images/alipay.jpg"
                                alt="Alipay QR Code"
                                width={554}
                                height={554}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                           </div>
                           <div style={{ fontSize: 12, color: "#666", marginBottom: 24, textAlign: "center" }}>
                             使用支付宝扫一扫支付 <strong style={{ color: "#111827" }}>¥{modal.price}</strong> 元
                           </div>

                           <div style={{ borderTop: "1px dashed #eaeaea", paddingTop: 20, marginBottom: 20 }}>
                             <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>{dict.modal.payStep2}</div>
                             <input 
                               type="email" 
                               placeholder={dict.modal.payEmailPlaceholder} 
                               value={email} 
                               onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                               style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} 
                               onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                               onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                             />
                             {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: 8, textAlign: "left" }}>{emailErr}</div>}
                           </div>
                         </>
                       )}
                       <button 
                         onClick={submitOrder} 
                         disabled={isSubmitting}
                         className="vercel-button" 
                         style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                       >
                         {isSubmitting ? dict.modal.submitting : dict.modal.submitBtnPay}
                       </button>
                   </>
                 </div>
               ) : (
                 <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ width: 64, height: 64, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "clamp(22px, 3.5vw, 32px)", margin: "0 auto 20px" }}>
                      ✓
                    </div>
                    <h4 style={{ fontSize: 18, color: "#111827", margin: "0 0 12px" }}>{dict.modal.success}</h4>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                      {modal.actionType === 'consult' ? dict.modal.consultSuccessMsg : dict.modal.paySuccessMsg}
                      <br/>
                      <strong style={{ color: "#111827" }}>{email}</strong>
                    </p>
                    <div style={{ background: "#fafafa", padding: "12px", borderRadius: "8px", fontSize: 13, color: "#666" }}>
                      {lang === 'zh' ? '如有任何问题，请联系客服：' : 'If you have any questions, contact: '}
                      <a href="mailto:chengziai2026@163.com" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>chengziai2026@163.com</a>
                    </div>
                 </div>
               )}
            </div>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: "clamp(18px, 2.5vw, 24px)", cursor: "pointer", color: "#999999", lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

    </div>
  );
}
