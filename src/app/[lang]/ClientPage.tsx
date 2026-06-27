"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
import { categories } from "../../lib/categories";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type PaymentMethod = "alipay" | "wechat";

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function genOrderId() {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  const t = `${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}`;
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CZ${d}${t}${r}`;
}

export default function HomePage({ dict, products, lang, refCode }: { dict: any, products: Product[], lang: string, refCode?: string }) {
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string; actionType?: string; categoryId?: string } | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [requirement, setRequirement] = useState("");
  const [requirementErr, setRequirementErr] = useState("");
  const [workLink, setWorkLink] = useState("");
  const [workLinkErr, setWorkLinkErr] = useState("");
  const [step, setStep] = useState<"pay" | "consult" | "success">("pay");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay");
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
          workLink: modal.categoryId === "growth" ? workLink : undefined,
          requirement: modal.categoryId === "growth" ? requirement : undefined
        })
      });
      if (res.ok) {
        setStep("success");
      } else {
        alert("提交失败，请稍后重试 (Submit failed)");
      }
    } catch (e) {
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
    } catch (e) {
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

  return (
    <div style={{ minHeight: "100vh", lineHeight: 1.5, background: "#fafafa" }}>

      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "16px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", gap: 16 }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
            <img 
              src={lang === 'zh' ? '/images/logo-zh.png' : '/images/logo-en.png'} 
              alt={dict.header.title} 
              style={{ height: 27, width: 'auto', display: "block" }} 
            />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontWeight: 500, minWidth: 0, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 2, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {categories.map(category => (
              <a 
                key={category.id} 
                href={`#${category.id}`} 
                className="nav-link"
                style={{ textDecoration: "none", color: "#666666", transition: "color 0.2s ease", flexShrink: 0 }}
              >
                {dict.header.nav[category.id as keyof typeof dict.header.nav]}
              </a>
            ))}
            <Link href={`/${lang}/api-service`} className="nav-link" style={{ textDecoration: "none", color: "#666666", transition: "color 0.2s ease", flexShrink: 0 }}>
              {dict.header.nav['api-service']}
            </Link>
            <a 
              href="#flow" 
              className="nav-link"
              style={{ textDecoration: "none", color: "#666666", transition: "color 0.2s ease", flexShrink: 0 }}
            >
              {dict.header.nav.flow}
            </a>
            <button onClick={switchLang} style={{ background: "none", border: "1px solid #eaeaea", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#666", flexShrink: 0 }}>
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "max(20px, 4vw) 16px max(40px, 8vw)" }}>
        
        <div style={{ padding: "max(32px, 6vw) 0 max(40px, 8vw)", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.04em", marginBottom: 24 }}>
            {lang === 'zh' ? '主流 AI 账号和低价 API 资源，一站下单' : 'Mainstream AI Accounts & Low-Cost API Resources'}
          </h1>
          <p style={{ fontSize: 18, color: "#666666", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.6 }}>
            {lang === 'zh' ? 'GPT Plus / Pro、Gemini 年卡、API 中转额度、抖音 / 公众号 / 小红书营销资源都在这里。适合高频 AI 用户、开发者和内容从业者，网页直接下单，按商品类型交付账号、卡密、充值说明或额度码。' : 'GPT Plus / Pro, Gemini Annual Pass, API Relay Credits, and Marketing Resources all in one place. Perfect for heavy AI users, developers, and creators. Order directly online and receive accounts, keys, or credits instantly.'}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <span style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: "999px", fontSize: 14, color: "#4b5563" }}>GPT Plus / Pro</span>
            <span style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: "999px", fontSize: 14, color: "#4b5563" }}>{lang === 'zh' ? 'Gemini 年卡' : 'Gemini Annual Pass'}</span>
            <span style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: "999px", fontSize: 14, color: "#4b5563" }}>Claude / Codex API</span>
            <span style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: "999px", fontSize: 14, color: "#4b5563" }}>{lang === 'zh' ? '营销资源' : 'Marketing Resources'}</span>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#gpt" className="vercel-button" style={{ padding: "12px 32px", fontSize: 16, textDecoration: "none" }}>{lang === 'zh' ? '购买 GPT 会员' : 'Buy GPT Membership'}</a>
            <a href="#api" className="vercel-button-secondary" style={{ padding: "12px 32px", fontSize: 16, textDecoration: "none" }}>{lang === 'zh' ? '购买 API 额度' : 'Buy API Credits'}</a>
          </div>
        </div>

        {categories.map(category => {
          const categoryProducts = productsByCategory[category.id];
          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <div key={category.id} id={category.id} style={{ marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
                {dict.header.nav[category.id] || category.name}
              </h2>
              <p style={{ fontSize: 16, color: "#666", marginBottom: 24 }}>
                {category.id === 'gpt' && (lang === 'zh' ? '从不用翻墙的直连月卡，到自用续费、成品账号，再到 Pro 20X 高阶月卡，按需求直接下单。' : 'From direct-connect monthly passes to renewals, ready-to-use accounts, and Pro 20X high-tier passes. Order exactly what you need.')}
                {category.id === 'gemini' && (lang === 'zh' ? '适合长上下文、资料整理、写作和备用 AI 会员场景。' : 'Perfect for long-context tasks, data organization, writing, and as a backup AI membership.')}
                {category.id === 'api' && (lang === 'zh' ? '低价 API 中转额度，适合 Claude Code、Codex、Cursor 等高频 AI Coding 场景，OpenAI 兼容格式，拿到额度即可接入。' : 'Low-cost API relay credits. Perfect for Claude Code, Codex, and Cursor AI Coding. Fully OpenAI-compatible.')}
                {category.id === 'growth' && (lang === 'zh' ? '低价稳定、优先安全的抖音、公众号、小红书推广资源，适合内容冷启动和基础曝光。' : 'Low-cost, stable, and safe promotion resources for TikTok, WeChat, and Xiaohongshu. Great for cold starts and basic exposure.')}
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                {categoryProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="vercel-card" 
                    style={{ 
                      display: "flex", flexDirection: "column", padding: "32px", position: "relative",
                      ...(product.id === 'chatgpt-pro-20x-fast' ? {
                         background: "linear-gradient(to bottom right, #ffffff, #fff9f0)",
                         border: "2px solid #ff9900",
                         boxShadow: "0 8px 30px rgba(255, 153, 0, 0.15)"
                      } : product.id === 'chatgpt-plus-monthly-code' ? {
                         background: "linear-gradient(to bottom right, #ffffff, #fafafa)",
                         border: "1px solid #ff9900",
                         boxShadow: "0 4px 14px rgba(255, 153, 0, 0.08)"
                      } : {})
                    }}
                  >
                    
                    {product.isHot && (
                      <div style={{ position: "absolute", top: 16, right: 16, border: "1px solid #ff6600", color: "#ff6600", padding: "2px 8px", fontSize: 11, fontWeight: 600, borderRadius: "999px" }}>
                        {product.id === 'chatgpt-pro-20x-fast' ? (lang === 'zh' ? '高阶主推' : 'Premium Pick') : product.id === 'chatgpt-plus-monthly-code' ? (lang === 'zh' ? '入门主推' : 'Starter Pick') : dict.common.hot}
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "-0.02em", paddingRight: product.isHot ? 50 : 0 }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
                      {product.actionType !== 'consult' ? (
                        <>
                          <span style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                            {dict.common.currency}{product.price}{category.id === 'growth' && (lang === 'zh' ? ' 起' : '+')}
                          </span>
                          {product.originalPriceText && (
                            <span style={{ fontSize: 13, color: "#888", textDecoration: "none", fontWeight: 500, background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, marginLeft: 8 }}>
                              {product.originalPriceText}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>{lang === 'zh' ? '咨询报价' : 'Consulting'}</span>
                      )}
                    </div>

                    <p style={{ fontSize: 14, color: "#666666", margin: "0 0 24px", flexGrow: 1, lineHeight: 1.6 }} dangerouslySetInnerHTML={{__html: product.subtitle}}></p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                      {product.tags.map(t => (
                        <span key={t} style={{ padding: "4px 10px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "999px", fontSize: 12, color: "#666666", fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: "auto" }}>
                       {product.inStock ? (
                          <button 
                            onClick={() => buy(product)} 
                            className="vercel-button" 
                            style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                          >
                            {product.buyButtonText}
                          </button>
                       ) : (
                          <div style={{ flex: 1, padding: "12px 0", background: "#fafafa", color: "#999999", textAlign: "center", fontSize: 14, fontWeight: 500, border: "1px solid #eaeaea", borderRadius: "6px" }}>{dict.common.soldOut}</div>
                       )}
                       {product.actionType !== "link" && (
                         <Link href={`/${lang}/products/${product.id}`} className="vercel-button-secondary" style={{ padding: "12px 24px", textAlign: "center", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                           {dict.common.details}
                         </Link>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <section id="flow" style={{ marginBottom: 64, paddingTop: 40, borderTop: "1px solid #eaeaea" }}>
          <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>
            {lang === 'zh' ? '购买流程' : 'Purchase Flow'}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { step: 1, title: lang === 'zh' ? "选择商品" : "Select Product", desc: lang === 'zh' ? "选择需要的 GPT 会员、Gemini 年卡、API 额度或营销资源。" : "Choose from GPT, Gemini, API credits, or Marketing resources." },
              { step: 2, title: lang === 'zh' ? "网页下单" : "Order Online", desc: lang === 'zh' ? "在商品页直接完成下单和付款。" : "Complete your order and payment directly on the page." },
              { step: 3, title: lang === 'zh' ? "等待交付" : "Wait for Delivery", desc: lang === 'zh' ? "我们会按商品类型交付账号、卡密、充值说明、API 充值码或营销资源订单说明。" : "We will deliver the account, license key, or API credits based on the product type." },
              { step: 4, title: lang === 'zh' ? "邮件售后" : "Email Support", desc: lang === 'zh' ? "订单问题请邮件联系：chengziai2026@163.com" : "For order inquiries, email: chengziai2026@163.com" }
            ].map(f => (
              <div key={f.step} className="vercel-card" style={{ padding: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ff6600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 16 }}>{f.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#111827" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
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
                             <img 
                               src="/images/alipay.jpg" 
                               alt="Alipay QR Code" 
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
                             <img 
                               src="/images/alipay.jpg" 
                               alt="Alipay QR Code" 
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