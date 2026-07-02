"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
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

export default function HomePage({ dict, products, lang, refCode }: { dict: HomeDictionary, products: Product[], lang: string, refCode?: string }) {
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string; actionType?: string; categoryId?: string } | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [requirement, setRequirement] = useState("");
  const [requirementErr, setRequirementErr] = useState("");
  const [workLink, setWorkLink] = useState("");
  const [workLinkErr, setWorkLinkErr] = useState("");
  const [step, setStep] = useState<"pay" | "consult" | "success">("pay");
  const payMethod: PaymentMethod = "alipay";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiFloat, setShowApiFloat] = useState(true);

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
    setWorkLink("");
    setWorkLinkErr("");
    setStep(product.categoryId === "growth" ? "consult" : (product.actionType === "consult" ? "consult" : "pay"));
  };

  const handleMarketingNext = () => {
    let valid = true;
    if (!workLink.trim()) {
      setWorkLinkErr(lang === 'zh' ? "请输入作品链接或主页链接" : "Please enter the link");
      valid = false;
    } else {
      setWorkLinkErr("");
    }
    if (!requirement.trim()) {
      setRequirementErr(lang === 'zh' ? "请输入具体买量需求与数量" : "Please enter requirement and quantity");
      valid = false;
    } else {
      setRequirementErr("");
    }
    if (!em(email)) {
      setEmailErr(dict.modal.emailErr || "Invalid email");
      valid = false;
    } else {
      setEmailErr("");
    }
    if (valid) {
      setStep("pay");
    }
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
          payMethod: lang === 'en' ? "paypal" : (modal.categoryId === "growth" ? "alipay" : payMethod),
          refCode: refCode,
          refSource: refCode ? "homepage" : undefined,
          workLink: modal.categoryId === "growth" ? workLink : undefined,
          requirement: modal.categoryId === "growth" ? requirement : undefined
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

  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(p => {
    if (!productsByCategory[p.categoryId]) {
      productsByCategory[p.categoryId] = [];
    }
    productsByCategory[p.categoryId].push(p);
  });

  const pageNavItems = [
    { href: "#accounts", label: lang === 'zh' ? 'AI 账号' : 'AI Accounts' },
    { href: "#api", label: lang === 'zh' ? 'API 额度' : 'API Credits' },
    { href: "#growth", label: lang === 'zh' ? '内容推广' : 'Growth' },
    { href: "#flow", label: lang === 'zh' ? '购买流程' : 'Order Flow' }
  ];

  const productsById = products.reduce<Record<string, Product | undefined>>((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  const accountItems = [
    {
      label: lang === 'zh' ? "无需翻墙" : "No VPN needed",
      product: productsById["chatgpt-plus-monthly-code"]
    },
    {
      label: lang === 'zh' ? "即开即用" : "Ready account",
      product: productsById["chatgpt-plus-ready-account"]
    },
    {
      label: lang === 'zh' ? "谷歌福利" : "Google perks",
      product: productsById["gemini-pro-year-account"]
    },
    {
      label: lang === 'zh' ? "重度使用" : "Heavy use",
      product: productsById["chatgpt-pro-20x-fast"]
    },
    {
      label: lang === 'zh' ? "自用续费" : "Renewal",
      product: productsById["chatgpt-plus-renewal"]
    }
  ].filter((item): item is { label: string; product: Product } => Boolean(item.product));

  const apiProducts = productsByCategory.api || [];
  const growthProducts = productsByCategory.growth || [];

  const productHints: Record<string, string> = {
    "chatgpt-plus-monthly-code": lang === 'zh' ? "适合第一次购买、预算敏感、想马上用。" : "Good for first-time buyers and budget-conscious users.",
    "chatgpt-plus-ready-account": lang === 'zh' ? "适合不想注册、不想折腾账号流程。" : "Good when you want a ready-to-use account.",
    "gemini-pro-year-account": lang === 'zh' ? "给自己的 Google 账号直充一年 Google AI Pro，自动发 CDKey。" : "Top up your own Google account with a 1-year Google AI Pro subscription.",
    "chatgpt-pro-20x-fast": lang === 'zh' ? "适合 AI Coding、高频对话、项目冲刺。" : "Good for AI coding, heavy chat, and project sprints.",
    "chatgpt-plus-renewal": lang === 'zh' ? "适合已有自用账号，只想继续续费。" : "Good if you already have your own account.",
    "api-code-100": lang === 'zh' ? "适合个人测试、Claude Code 入门、轻量调用。" : "Good for testing, Claude Code starter use, and light calls.",
    "api-code-300": lang === 'zh' ? "适合高频 AI Coding、多客户端长期使用。" : "Good for frequent AI coding or long-term client use.",
    "marketing-xiaohongshu": lang === 'zh' ? "提交小红书作品链接和具体数量" : "Submit a Xiaohongshu post link and quantity",
    "marketing-douyin": lang === 'zh' ? "提交抖音视频链接和具体数量" : "Submit a Douyin video link and quantity",
    "marketing-wechat": lang === 'zh' ? "提交公众号文章链接和具体数量" : "Submit a WeChat article link and quantity"
  };

  const getProductBadge = (product: Product) => {
    if (product.id === "chatgpt-pro-20x-fast") return lang === 'zh' ? "主推" : "Pick";
    if (product.id === "chatgpt-plus-monthly-code" || product.id === "api-code-100") return lang === 'zh' ? "推荐" : "Recommended";
    if (product.isHot) return lang === 'zh' ? "热门" : "Popular";
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
      <div className="cz-product-label">
        {label || product.categoryName}
      </div>

      <div className="cz-product-main">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
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
      </div>

      <div className="cz-product-action">
        <div className="cz-product-price" style={{ fontSize: product.categoryId === 'growth' ? 24 : 30 }}>
          {product.actionType !== 'consult' ? `${dict.common.currency}${product.price}${product.categoryId === 'growth' ? (lang === 'zh' ? ' 起' : '+') : ''}` : (lang === 'zh' ? '咨询报价' : 'Consulting')}
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
            flex: 0 0 98px;
            display: block;
            margin-bottom: 0;
            padding: 0;
            border: 0;
            background: transparent;
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
                {lang === 'zh' ? '主流 AI 账号和低价 API 资源，一站下单' : 'Choose the AI service you need, then order.'}
              </h1>
              <p className="cz-hero-copy" style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#666666", maxWidth: 720, margin: "0 auto 28px", lineHeight: 1.7 }}>
                {lang === 'zh'
                  ? '买 AI 账号、买 API 额度、做内容推广。适合不同应用场景。网页直接下单，按商品类型交付账号、卡密、充值说明或额度码。'
                  : 'Buy AI accounts, API credits, or growth services on one page. Works cleanly on mobile too.'}
              </p>
              <div className="cz-hero-actions">
                <a href="#accounts" className="vercel-button-secondary" style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>{lang === 'zh' ? '买 AI 账号' : 'Buy AI accounts'}</a>
                <a href="#api" className="vercel-button cz-hero-primary" style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>{lang === 'zh' ? '买 API 额度' : 'Buy API credits'}</a>
                <a href="#growth" className="vercel-button-secondary" style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>{lang === 'zh' ? '做内容推广' : 'Run growth'}</a>
              </div>
              <div className="cz-hero-note">
                {lang === 'zh' ? 'GPT Plus / Pro 、Gemini 年卡、Claude / Codex API。' : 'Clear pricing · Mobile ordering · Email support'}
              </div>
            </div>

            <div className="cz-hero-panel" aria-label={lang === 'zh' ? '服务类型概览' : 'Service overview'}>
              <div className="cz-hero-panel-label">
                <span className="cz-accent-dot" />
                {lang === 'zh' ? '按需求选，不绕路' : 'Pick by need'}
              </div>
              <div className="cz-hero-panel-list">
                {[
                  {
                    num: '01',
                    title: lang === 'zh' ? 'AI 账号' : 'AI accounts',
                    desc: lang === 'zh' ? 'GPT Plus / Pro、Gemini 年卡' : 'GPT Plus / Pro, Gemini annual cards'
                  },
                  {
                    num: '02',
                    title: lang === 'zh' ? 'API 额度' : 'API credits',
                    desc: lang === 'zh' ? 'Claude / Codex / GPT / Gemini 多模型' : 'Claude / Codex / GPT / Gemini models'
                  },
                  {
                    num: '03',
                    title: lang === 'zh' ? '内容推广' : 'Growth services',
                    desc: lang === 'zh' ? '小红书、抖音、公众号基础曝光' : 'Basic exposure for social platforms'
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
            lang === 'zh' ? 'AI 账号：按使用强度选' : 'AI accounts: choose by usage',
            lang === 'zh'
              ? '不按“入门/高阶”绕路。直接看你要解决什么：体验、备用、长文档、重度使用、已有账号续费。'
              : 'Trial, ready account, long-context work, heavy Pro usage, or renewal. Pick by how you use it.'
          )}

          <div style={{ display: "grid", gap: 14 }}>
            {accountItems.map(item => renderProductRow(item.product, item.label))}
          </div>
        </section>

        <section id="api" className="cz-section">
          {renderSectionHeader(
            "02",
            lang === 'zh' ? 'API 额度：给 Claude Code / Codex / Cursor 用' : 'API credits: for Claude Code, Codex, and Cursor',
            lang === 'zh'
              ? '先买额度包，再到控制台创建 API Key。支持 Claude、GPT、Gemini、Codex 等模型；配置说明放在购买后。'
              : 'Buy a credit pack, then create a new API key in the console. Claude, GPT, Gemini, Codex, and more are supported.'
          )}
          <div style={{ display: "grid", gap: 14 }}>
            {apiProducts.map(product => renderProductRow(product, product.id === "api-code-300" ? (lang === 'zh' ? "$300 包" : "$300 pack") : (lang === 'zh' ? "$100 包" : "$100 pack")))}
          </div>
          <div style={{ marginTop: 14, padding: "14px 16px", background: "#ffffff", border: "1px solid #eaeaea", borderRadius: 12, color: "#333333", fontSize: 14, lineHeight: 1.6 }}>
            {lang === 'zh' ? '购买后配置：进入控制台创建 API Key，再把服务地址填到客户端。下单前不用先研究配置。' : 'After purchase: create an API key in the console and enter the service URL in your client.'}
            <Link href={`/${lang}/api-service`} className="cz-inline-link" style={{ color: "#111827", fontWeight: 800, textDecoration: "none", marginLeft: 8 }}>
              {lang === 'zh' ? '需要时查看说明 →' : 'Setup guide →'}
            </Link>
          </div>
        </section>

        <section id="growth" className="cz-section">
          {renderSectionHeader(
            "03",
            lang === 'zh' ? '内容推广：按平台提交链接和数量' : 'Growth services: submit links and quantity',
            lang === 'zh'
              ? '适合内容冷启动、素材测试和基础曝光。选平台，提交作品链接和数量，客服核对后执行。'
              : 'For content cold starts, creative testing, and basic exposure. Submit your link, requirement, and quantity.'
          )}
          <div style={{ display: "grid", gap: 14 }}>
            {growthProducts.map(product => renderProductRow(product, product.id.includes("xiaohongshu") ? (lang === 'zh' ? "小红书" : "Xiaohongshu") : product.id.includes("douyin") ? (lang === 'zh' ? "抖音" : "Douyin") : (lang === 'zh' ? "公众号" : "WeChat")))}
          </div>
        </section>

        <section id="flow" className="cz-section" style={{ paddingTop: 40, borderTop: "1px solid #eaeaea" }}>
          {renderSectionHeader(
            "04",
            lang === 'zh' ? '购买流程：从选择到交付' : 'Purchase flow: from choice to delivery',
            lang === 'zh'
              ? '流程尽量短：选商品、下单、按类型交付，有问题直接邮件联系。'
              : 'A short flow: choose, order, receive delivery, and contact support by email if needed.'
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { step: "1", title: lang === 'zh' ? "选择商品" : "Choose", desc: lang === 'zh' ? "按账号、API、营销三类选择。" : "Pick accounts, APIs, or growth." },
              { step: "2", title: lang === 'zh' ? "网页下单" : "Order", desc: lang === 'zh' ? "直接支付或提交需求。" : "Pay or submit details online." },
              { step: "3", title: lang === 'zh' ? "等待交付" : "Delivery", desc: lang === 'zh' ? "按商品类型交付账号、卡密、额度或推广说明。" : "Receive account, key, credits, or instructions." },
              { step: "4", title: lang === 'zh' ? "邮件售后" : "Support", desc: lang === 'zh' ? "订单问题联系 chengziai2026@163.com。" : "Contact chengziai2026@163.com for order issues." }
            ].map(item => (
              <div key={item.step} className="vercel-card" style={{ padding: 22, background: "#ffffff" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#111827", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 14 }}>{item.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      
      <footer style={{ textAlign: "center", padding: "max(20px, 4vw) 0", borderTop: "1px solid #eaeaea", color: "#666", fontSize: 14 }}>
        © {new Date().getFullYear()} {dict.header.title}. All rights reserved.<br/>
        {lang === 'zh' ? '客服邮箱：' : 'Support Email: '}
        <a href="mailto:chengziai2026@163.com" style={{ color: "#666", textDecoration: "none" }}>chengziai2026@163.com</a>
      </footer>

      {showApiFloat && !modal && !detailProduct && (
        <div className="cz-api-float" aria-label={lang === 'zh' ? "API 额度入口" : "API credits entry"}>
          <Link href={`/${lang}/api-service`} className="cz-api-float-link">
            <span className="cz-api-float-dot" aria-hidden="true" />
            <span>
              <span className="cz-api-float-title">
                {lang === 'zh' ? "API 额度" : "API credits"}
              </span>
              <span className="cz-api-float-desc">
                {lang === 'zh' ? "Claude Code / Codex 可用" : "For Claude Code / Codex"}
              </span>
            </span>
            <span className="cz-api-float-arrow" aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="cz-api-float-close"
            onClick={() => setShowApiFloat(false)}
            aria-label={lang === 'zh' ? "关闭 API 入口" : "Close API entry"}
          >
            ×
          </button>
        </div>
      )}

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
                 {step === "consult" ? (modal.categoryId === "growth" ? (lang === 'zh' ? "提交推广需求" : "Submit Promotion Details") : dict.modal.submitRequest) : dict.modal.confirmOrder}
               </h3>
               <p style={{ margin: "0 0 16px", color: "#666666", fontSize: 14 }}>
                 {dict.modal.product}<span style={{ color: "#111827", fontWeight: 500 }}>{modal.name}</span>
               </p>
               
               {step !== "consult" && modal.categoryId !== "growth" && (
                 <div style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>{dict.common.currency}{modal.price}</div>
               )}
               
               {step === "consult" ? (
                 <div style={{ textAlign: "center" }}>
                   {modal.categoryId === "growth" ? (
                     <>
                       <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, textAlign: "left" }}>
                         {lang === 'zh' ? "第一步：需要买量的作品链接 / 主页链接" : "Step 1: Link to work / homepage"}
                       </div>
                       <input 
                         type="text" 
                         placeholder={lang === 'zh' ? "请粘贴需要推广的作品或主页链接" : "Please paste target link..."} 
                         value={workLink} 
                         onChange={e => { setWorkLink(e.target.value); if(workLinkErr) setWorkLinkErr(""); }} 
                         style={{ width: "100%", padding: "12px", border: workLinkErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginBottom: 20 }} 
                         onFocus={(e) => { if (!workLinkErr) e.target.style.borderColor = "#0a0a0a" }} 
                         onBlur={(e) => { if (!workLinkErr) e.target.style.borderColor = "#eaeaea" }} 
                       />
                       {workLinkErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{workLinkErr}</div>}

                       <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, textAlign: "left" }}>
                         {lang === 'zh' ? "第二步：具体推广需求（买什么服务，多少量）" : "Step 2: Specific requirements (services & qty)"}
                       </div>
                       <textarea 
                         placeholder={lang === 'zh' ? "请写清楚具体的需求（买什么服务，多少量），例如：点赞 100 个" : "Please write details, e.g., 100 likes / 1000 views"} 
                         value={requirement} 
                         onChange={e => { setRequirement(e.target.value); if(requirementErr) setRequirementErr(""); }} 
                         rows={3}
                         style={{ width: "100%", padding: "12px", border: requirementErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", resize: "none", marginBottom: 20 }} 
                         onFocus={(e) => { if (!requirementErr) e.target.style.borderColor = "#0a0a0a" }} 
                         onBlur={(e) => { if (!requirementErr) e.target.style.borderColor = "#eaeaea" }} 
                       />
                       {requirementErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{requirementErr}</div>}

                       <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, textAlign: "left" }}>
                         {lang === 'zh' ? "第三步：您的联系邮箱" : "Step 3: Your email address"}
                       </div>
                       <input 
                         type="email" 
                         placeholder="you@example.com" 
                         value={email} 
                         onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                         style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginBottom: 20 }} 
                         onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                         onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                       />
                       {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{emailErr}</div>}

                       <button 
                         onClick={handleMarketingNext} 
                         className="vercel-button" 
                         style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                       >
                         {lang === 'zh' ? "下一步：扫码支付" : "Next: Scan & Pay"}
                       </button>
                     </>
                   ) : (
                     <>
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
                     </>
                   )}
                 </div>
               ) : step === "pay" ? (
                 <div style={{ textAlign: "center" }}>
                   {modal.categoryId === "growth" ? (
                     <>
                       {lang === 'en' ? (
                         <>
                           <div style={{ fontSize: 14, fontWeight: 500, color: "#666", marginBottom: 16 }}>
                             Payment Method
                           </div>
                           <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
                             <button style={{ padding: "8px 24px", border: "2px solid #003087", background: "#f0f5ff", borderRadius: 8, cursor: "default", color: "#003087", fontWeight: 600 }}>PayPal</button>
                           </div>
                           <div style={{ width: 240, height: 240, background: "#f5f5f5", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, border: "1px solid #eaeaea", textAlign: "center", padding: "0 20px" }}>
                             <div>
                               <div style={{ color: "#111827", fontWeight: 600, marginBottom: 8, wordBreak: "break-all" }}>Paypal Account:<br/>chengziai2026@163.com</div>
                               <div style={{ fontSize: 13, color: "#666" }}>Please transfer the exact USD amount and submit your email.</div>
                             </div>
                           </div>
                           <div style={{ fontSize: 13, color: "#666", marginBottom: 20, textAlign: "left", lineHeight: 1.5 }}>
                             Notification Email: <strong>{email}</strong>
                           </div>
                         </>
                       ) : (
                         <>
                           <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>
                             第四步：请用支付宝扫码支付对应款项
                           </div>
                           <div style={{ width: 180, height: 180, margin: "0 auto 24px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                              <Image
                                src="/images/alipay.jpg"
                                alt="Alipay QR Code"
                                width={554}
                                height={554}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                           </div>
                           <div style={{ fontSize: 13, color: "#666", marginBottom: 20, textAlign: "left", lineHeight: 1.5 }}>
                             请根据您的需求计算应付金额并扫码支付。<br/>
                             通知邮箱：<strong>{email}</strong>
                           </div>
                         </>
                       )}
                       <button 
                         onClick={submitOrder} 
                         disabled={isSubmitting}
                         className="vercel-button" 
                         style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                       >
                         {isSubmitting ? (lang === 'zh' ? "正在通知..." : "Notifying...") : (lang === 'zh' ? "我已经付完款，通知客服发货" : "I have paid, notify support")}
                       </button>
                     </>
                   ) : (
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
                   )}
                 </div>
               ) : (
                 <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ width: 64, height: 64, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "clamp(22px, 3.5vw, 32px)", margin: "0 auto 20px" }}>
                      ✓
                    </div>
                    <h4 style={{ fontSize: 18, color: "#111827", margin: "0 0 12px" }}>{dict.modal.success}</h4>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                      {modal.actionType === 'consult' ? dict.modal.consultSuccessMsg : (modal.categoryId === "growth" ? (lang === 'zh' ? "您的推广需求已通知客服。\n核对收款后，客服将尽快开始发货推广！" : "Your order notification has been sent.\nSupport will start the delivery once payment is verified!") : dict.modal.paySuccessMsg)}
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
