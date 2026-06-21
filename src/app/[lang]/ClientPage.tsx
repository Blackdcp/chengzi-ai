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
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string } | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [step, setStep] = useState<"email" | "pay">("email");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay");

  const buy = (name: string, price: number) => {
    setModal({ name, price, orderId: genOrderId() });
    setEmail("");
    setEmailErr("");
    setStep("email");
  };

  const goPay = () => {
    if (!em(email)) { setEmailErr("请输入有效的接收邮箱"); return; }
    setEmailErr("");
    setStep("pay");
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
                            onClick={() => buy(product.orderName, product.price)} 
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
               <h3 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>确认订单</h3>
               <p style={{ margin: "0 0 16px", color: "#666666", fontSize: 14 }}>
                 商品：<span style={{ color: "#111827", fontWeight: 500 }}>{modal.name}</span>
               </p>
               
               <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>¥ {modal.price}</div>
               
               {step === "email" ? (
                 <>
                   <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#444444", marginBottom: 8 }}>接收邮箱 (必填)</label>
                   <input 
                     type="email" 
                     placeholder="you@example.com" 
                     value={email} 
                     onChange={e => setEmail(e.target.value)} 
                     style={{ width: "100%", padding: "12px", border: "1px solid #eaeaea", borderRadius: "6px", marginBottom: 8, fontSize: 14, outline: "none", transition: "border-color 0.2s" }} 
                     onFocus={(e) => e.target.style.borderColor = "#0a0a0a"} 
                     onBlur={(e) => e.target.style.borderColor = "#eaeaea"} 
                   />
                   {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginBottom: 12 }}>{emailErr}</div>}
                   <button onClick={goPay} className="vercel-button" style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 12 }}>下一步，去支付</button>
                 </>
               ) : (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                      <button 
                        onClick={() => setPayMethod("alipay")}
                        style={{ flex: 1, padding: "10px", borderRadius: "6px", border: payMethod === "alipay" ? "2px solid #1677ff" : "1px solid #eaeaea", background: payMethod === "alipay" ? "#f0f5ff" : "#fff", color: payMethod === "alipay" ? "#1677ff" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                      >
                        支付宝
                      </button>
                      <button 
                        onClick={() => setPayMethod("wechat")}
                        style={{ flex: 1, padding: "10px", borderRadius: "6px", border: payMethod === "wechat" ? "2px solid #07c160" : "1px solid #eaeaea", background: payMethod === "wechat" ? "#f0fdf4" : "#fff", color: payMethod === "wechat" ? "#07c160" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                      >
                        微信支付
                      </button>
                    </div>

                    <div style={{ width: 200, height: 200, margin: "0 auto 20px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 14 }}>
                        {payMethod === "alipay" ? "支付宝收款码" : "微信收款码"}
                      </div>
                      <div style={{ fontSize: 12, color: "#ccc" }}>[待上传二维码]</div>
                    </div>
                    <p style={{ fontSize: 13, color: "#666666" }}>付款后卡密将发送至 <strong style={{ color: "#111827" }}>{email}</strong></p>
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