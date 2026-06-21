"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
import { categories } from "../../lib/categories";

type PaymentMethod = "alipay" | "wechat";

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function genOrderId() {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  const t = `${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}`;
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CZ${d}${t}${r}`;
}

export default function HomePage({ dict, products }: { dict: any, products: Product[] }) {
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string; actionType?: string } | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [requirement, setRequirement] = useState("");
  const [requirementErr, setRequirementErr] = useState("");
  const [step, setStep] = useState<"pay" | "consult" | "success">("pay");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buy = (product: Product) => {
    if (product.actionType === "link" && product.linkUrl) {
      window.open(product.linkUrl, "_blank");
      return;
    }
    setModal({ name: product.orderName, price: product.price, orderId: genOrderId(), actionType: product.actionType || "buy" });
    setEmail("");
    setEmailErr("");
    setRequirement("");
    setRequirementErr("");
    setStep(product.actionType === "consult" ? "consult" : "pay");
  };

  const submitOrder = async () => {
    if (!em(email)) { setEmailErr("请输入有效的接收邮箱"); return; }
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
          payMethod: payMethod
        })
      });
      if (res.ok) {
        setStep("success");
      } else {
        alert("提交失败，请重试或联系客服。");
      }
    } catch (e) {
      alert("提交失败，请重试或联系客服。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitConsult = async () => {
    if (!em(email)) { setEmailErr("请输入有效的接收邮箱"); return; }
    setEmailErr("");
    if (!requirement.trim()) { setRequirementErr("请简要描述您的需求或提供相关链接"); return; }
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
        })
      });
      if (res.ok) {
        setStep("success");
      } else {
        alert("提交失败，请重试或联系客服。");
      }
    } catch (e) {
      alert("提交失败，请重试或联系客服。");
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

      {/* ═══ Header (Vercel Style) ═══ */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "8px solid #ffffff", marginTop: "-2px" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {dict.header.title.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2").replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2")}
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500 }}>
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="nav-link" style={{ textDecoration: "none" }}>
                {cat.name.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2").replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2")}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 80px" }}>
        
        {/* ═══ Shelves By Category ═══ */}
        {categories.map(category => {
          const categoryProducts = productsByCategory[category.id];
          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <div key={category.id} id={category.id} style={{ marginBottom: 64 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 20, letterSpacing: "-0.01em" }}>
                {category.name.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2").replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2")}
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
                        热卖
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "-0.02em", paddingRight: product.isHot ? 50 : 0 }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline" }}>
                      {product.price > 0 ? (
                        <>
                          <span style={{ fontSize: 32, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>¥ {product.price}</span>
                          <span style={{ fontSize: 14, color: "#666666", marginLeft: 6 }}>/ 年</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 32, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>免费</span>
                      )}
                    </div>

                    <p style={{ fontSize: 14, color: "#666666", margin: "0 0 24px", flexGrow: 1, lineHeight: 1.6 }}>{product.subtitle}</p>

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
                          <div style={{ flex: 1, padding: "12px 0", background: "#fafafa", color: "#999999", textAlign: "center", fontSize: 14, fontWeight: 500, border: "1px solid #eaeaea", borderRadius: "6px" }}>已售罄</div>
                       )}
                       <a href={`/zh/products/${product.id}`} className="vercel-button-secondary" style={{ padding: "12px 24px", textAlign: "center", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                         详情
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Vercel Style */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#ffffff", border: "1px solid #eaeaea", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
            <div style={{ padding: "32px" }}>
               <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                 {step === "consult" ? "提交需求" : "确认订单"}
               </h3>
               <p style={{ margin: "0 0 16px", color: "#666666", fontSize: 14 }}>
                 商品/业务：<span style={{ color: "#111827", fontWeight: 500 }}>{modal.name}</span>
               </p>
               
               {step !== "consult" && (
                 <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>¥ {modal.price}</div>
               )}
               
               {step === "consult" ? (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>第一步：您的接收邮箱</div>
                    <input 
                      type="email" 
                      placeholder="you@example.com (客服将通过此邮箱联系您)" 
                      value={email} 
                      onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                      style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginBottom: 20 }} 
                      onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                      onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                    />
                    {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: -16, marginBottom: 20, textAlign: "left" }}>{emailErr}</div>}

                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>第二步：具体需求 / 链接</div>
                    <textarea 
                      placeholder="请描述您的具体要求，或粘贴相关的目标链接..." 
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
                      {isSubmitting ? "正在提交..." : "提交需求并联系客服"}
                    </button>
                 </div>
               ) : step === "pay" ? (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>第一步：扫码支付</div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      <button 
                        onClick={() => setPayMethod("alipay")}
                        style={{ flex: 1, padding: "8px", borderRadius: "6px", border: payMethod === "alipay" ? "2px solid #1677ff" : "1px solid #eaeaea", background: payMethod === "alipay" ? "#f0f5ff" : "#fff", color: payMethod === "alipay" ? "#1677ff" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontSize: 13 }}
                      >
                        支付宝
                      </button>
                      <button 
                        onClick={() => setPayMethod("wechat")}
                        style={{ flex: 1, padding: "8px", borderRadius: "6px", border: payMethod === "wechat" ? "2px solid #07c160" : "1px solid #eaeaea", background: payMethod === "wechat" ? "#f0fdf4" : "#fff", color: payMethod === "wechat" ? "#07c160" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontSize: 13 }}
                      >
                        微信支付
                      </button>
                    </div>

                    <div style={{ width: 180, height: 180, margin: "0 auto 24px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", flexDirection: "column", overflow: "hidden" }}>
                      <img 
                        src={payMethod === "alipay" ? "/images/alipay.jpg" : "/images/wechat.jpg"} 
                        alt="QR Code" 
                        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling as HTMLElement).style.setProperty('display', 'block') }}
                      />
                      <div style={{ fontSize: 13, color: "#ccc", display: "none" }}>请确保已将二维码保存至<br/>public/images/{payMethod}.jpg</div>
                    </div>

                    <div style={{ borderTop: "1px dashed #eaeaea", paddingTop: 20, marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>第二步：输入邮箱接收商品</div>
                      <input 
                        type="email" 
                        placeholder="you@example.com (支付后用于接收卡密)" 
                        value={email} 
                        onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                        style={{ width: "100%", padding: "12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} 
                        onFocus={(e) => { if (!emailErr) e.target.style.borderColor = "#0a0a0a" }} 
                        onBlur={(e) => { if (!emailErr) e.target.style.borderColor = "#eaeaea" }} 
                      />
                      {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: 8, textAlign: "left" }}>{emailErr}</div>}
                    </div>

                    <button 
                      onClick={submitOrder} 
                      disabled={isSubmitting}
                      className="vercel-button" 
                      style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                    >
                      {isSubmitting ? "正在提交..." : "我已经付完款，通知客服发货"}
                    </button>
                 </div>
               ) : (
                 <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ width: 64, height: 64, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, margin: "0 auto 20px" }}>
                      ✓
                    </div>
                    <h4 style={{ fontSize: 18, color: "#111827", margin: "0 0 12px" }}>提交成功</h4>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                      {modal.actionType === 'consult' ? "您的需求已发送给客服。" : "您的订单通知已发给客服。"}<br/>
                      {modal.actionType === 'consult' ? "我们将尽快通过邮件联系您：" : "核对收款后，商品将发送至邮箱："}<br/>
                      <strong style={{ color: "#111827" }}>{email}</strong>
                    </p>
                 </div>
               )}
            </div>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999999", lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}