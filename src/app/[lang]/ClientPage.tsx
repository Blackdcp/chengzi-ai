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
    setStep(product.categoryId === "marketing" ? "consult" : (product.actionType === "consult" ? "consult" : "pay"));
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
          payMethod: lang === 'en' ? "paypal" : (modal.categoryId === "marketing" ? "alipay" : payMethod),
          refCode: refCode,
          workLink: modal.categoryId === "marketing" ? workLink : undefined,
          requirement: modal.categoryId === "marketing" ? requirement : undefined
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

      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "8px solid #ffffff", marginTop: "-2px" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {dict.header.title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, fontWeight: 500 }}>
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="nav-link" style={{ textDecoration: "none" }}>
                {dict.header.nav[cat.id] || cat.name}
              </a>
            ))}
            <Link href={`/${lang}/api-service`} className="nav-link" style={{ textDecoration: "none" }}>
              {dict.header.nav['api-service'] || 'API Service'}
            </Link>
            <button onClick={switchLang} style={{ background: "none", border: "1px solid #eaeaea", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#666" }}>
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 80px" }}>
        
        {categories.map(category => {
          const categoryProducts = productsByCategory[category.id];
          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <div key={category.id} id={category.id} style={{ marginBottom: 64 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 20, letterSpacing: "-0.01em" }}>
                {dict.header.nav[category.id] || category.name}
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                {categoryProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="vercel-card" 
                    style={{ display: "flex", flexDirection: "column", padding: "32px", position: "relative" }}
                  >
                    
                    {product.isHot && (
                      <div style={{ position: "absolute", top: 16, right: 16, border: "1px solid #ff6600", color: "#ff6600", padding: "2px 8px", fontSize: 11, fontWeight: 600, borderRadius: "999px" }}>
                        {dict.common.hot}
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "-0.02em", paddingRight: product.isHot ? 50 : 0 }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
                      {product.price > 0 ? (
                        <>
                          <span style={{ fontSize: 32, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.currency}{product.price}</span>
                          {product.originalPriceText && (
                            <span style={{ fontSize: 16, color: "#999", textDecoration: "line-through", marginLeft: 8 }}>{product.originalPriceText}</span>
                          )}
                        </>
                      ) : (
                        <span style={{ fontSize: 32, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.free}</span>
                      )}
                    </div>

                    <p style={{ fontSize: 14, color: "#666666", margin: "0 0 24px", flexGrow: 1, lineHeight: 1.6 }} dangerouslySetInnerHTML={{__html: product.subtitle}}></p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                      {product.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ padding: "4px 10px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "999px", fontSize: 12, color: "#666666", fontWeight: 500 }}>{t}</span>
                      ))}
                      {product.tags.length > 3 && <span style={{ padding: "4px 10px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "999px", fontSize: 12, color: "#666666", fontWeight: 500 }}>...</span>}
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
      </div>
        {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#ffffff", border: "1px solid #eaeaea", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
            <div style={{ padding: "32px" }}>
               <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                 {step === "consult" ? (modal.categoryId === "marketing" ? (lang === 'zh' ? "提交推广需求" : "Submit Promotion Details") : dict.modal.submitRequest) : dict.modal.confirmOrder}
               </h3>
               <p style={{ margin: "0 0 16px", color: "#666666", fontSize: 14 }}>
                 {dict.modal.product}<span style={{ color: "#111827", fontWeight: 500 }}>{modal.name}</span>
               </p>
               
               {step !== "consult" && modal.categoryId !== "marketing" && (
                 <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>{dict.common.currency}{modal.price}</div>
               )}
               
               {step === "consult" ? (
                 <div style={{ textAlign: "center" }}>
                   {modal.categoryId === "marketing" ? (
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
                   {modal.categoryId === "marketing" ? (
                     <>
                       {lang === 'en' ? (
                         <>
                           <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>
                             Step 4: Send Payment via PayPal
                           </div>
                           <div style={{ background: "#f0f5ff", border: "1px solid #1677ff", borderRadius: "8px", padding: "20px", marginBottom: 24 }}>
                             <p style={{ margin: "0 0 12px", fontSize: 14, color: "#111827" }}>
                               Please send the calculated price based on your requirements to our PayPal account:
                             </p>
                             <div style={{ fontSize: 18, fontWeight: 700, color: "#1677ff", wordBreak: "break-all", userSelect: "all" }}>
                               CHENGZIAI2026@163.COM
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
                    <div style={{ width: 64, height: 64, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, margin: "0 auto 20px" }}>
                      ✓
                    </div>
                    <h4 style={{ fontSize: 18, color: "#111827", margin: "0 0 12px" }}>{dict.modal.success}</h4>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                      {modal.actionType === 'consult' ? dict.modal.consultSuccessMsg : (modal.categoryId === "marketing" ? (lang === 'zh' ? "您的推广需求已通知客服。\n核对收款后，客服将尽快开始发货推广！" : "Your order notification has been sent.\nSupport will start the delivery once payment is verified!") : dict.modal.paySuccessMsg)}
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
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999999", lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #eaeaea", padding: "40px 24px", textAlign: "center", color: "#666", fontSize: 14 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>© {new Date().getFullYear()} {dict.header.title}. All rights reserved.</div>
          <div>
            {lang === 'zh' ? '联系客服：' : 'Contact Support: '} 
            <a href="mailto:chengziai2026@163.com" style={{ color: "#111827", textDecoration: "none", fontWeight: 500 }}>chengziai2026@163.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}