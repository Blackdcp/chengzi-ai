"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
import { categories } from "../../lib/categories";

type PaymentMethod = "alipay" | "wechat";

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

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

  // Group products by categoryId
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(p => {
    if (!productsByCategory[p.categoryId]) {
      productsByCategory[p.categoryId] = [];
    }
    productsByCategory[p.categoryId].push(p);
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: '"Inter",-apple-system,sans-serif', lineHeight: 1.6 }}>

      {/* ═══ Header ═══ */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(251,251,250,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{dict.header.title}</span>
          <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500 }}>
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="nav-link" style={{ textDecoration: "none" }}>
                {cat.name}
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
            <div key={category.id} id={category.id} style={{ paddingTop: 24, marginBottom: 64 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, display: "flex", alignItems: "center", gap: 10, letterSpacing: "-0.01em" }}>
                <span>{category.icon}</span> {category.name}
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
                {categoryProducts.map(product => (
                  <div key={product.id} className="stripe-shadow" style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: 16, padding: "32px 28px", position: "relative", cursor: "default" }}>
                    
                    {product.isHot && (
                      <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(234,88,12,0.1)", color: "#ea580c", padding: "4px 12px", fontSize: 11, fontWeight: 700, borderRadius: 20, letterSpacing: "0.02em" }}>🔥 热卖</div>
                    )}

                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{product.categoryName}</div>
                    
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 16px", lineHeight: 1.3, letterSpacing: "-0.01em", paddingRight: product.isHot ? 60 : 0 }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline" }}>
                      {product.price > 0 ? (
                        <>
                          <span style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>¥{product.price}</span>
                          <span style={{ fontSize: 14, color: "#6b7280", marginLeft: 4, fontWeight: 500 }}>/ 年</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>免费</span>
                      )}
                    </div>

                    <p style={{ fontSize: 14, color: "#4b5563", margin: "0 0 24px", flexGrow: 1, lineHeight: 1.6 }}>{product.subtitle}</p>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
                      {product.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ padding: "4px 10px", borderRadius: 6, background: "#f3f4f6", fontSize: 12, color: "#4b5563", fontWeight: 500 }}>{t}</span>
                      ))}
                      {product.tags.length > 3 && <span style={{ padding: "4px 10px", borderRadius: 6, background: "#f3f4f6", fontSize: 12, color: "#4b5563", fontWeight: 500 }}>...</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: "auto" }}>
                       {product.inStock ? (
                          <button onClick={() => buy(product.orderName, product.price)} className="stripe-button" style={{ flex: 3, padding: "12px 0", borderRadius: 8, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                            {product.buyButtonText}
                          </button>
                       ) : (
                          <div style={{ flex: 3, padding: "12px 0", borderRadius: 8, background: "#f3f4f6", color: "#9ca3af", textAlign: "center", fontSize: 14, fontWeight: 600 }}>已售罄</div>
                       )}
                       <a href={`/zh/products/${product.id}`} style={{ flex: 2, padding: "12px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#111827", textAlign: "center", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseOut={(e) => e.currentTarget.style.background = "#fff"}>
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

      {/* Modal 弹窗逻辑 (精简版 Stripe 风格) */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,24,39,0.3)", backdropFilter: "blur(4px)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div style={{ padding: "32px" }}>
               <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>确认订单</h3>
               <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: 14 }}>商品：{modal.name}</p>
               
               <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 32 }}>¥{modal.price}</div>
               
               {step === "email" ? (
                 <>
                   <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>接收邮箱 (必填)</label>
                   <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db", marginBottom: 8, fontSize: 15, outline: "none", transition: "border-color 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#fb923c"} onBlur={(e) => e.target.style.borderColor = "#d1d5db"} />
                   {emailErr && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{emailErr}</div>}
                   <button onClick={goPay} className="stripe-button" style={{ width: "100%", padding: "14px 0", borderRadius: 8, color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>下一步，去支付</button>
                 </>
               ) : (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ width: 220, height: 220, margin: "0 auto 24px", background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                      [支付二维码]
                    </div>
                    <p style={{ fontSize: 13, color: "#4b5563" }}>付款后卡密将自动发送至 <span style={{ fontWeight: 600, color: "#111827" }}>{email}</span></p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}