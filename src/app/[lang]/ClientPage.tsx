"use client";

import { useState } from "react";
import type { Product } from "../../types/product";
import { categories } from "../../lib/categories";

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
    <div style={{ minHeight: "100vh", lineHeight: 1.5, background: "#ffffff" }}>

      {/* ═══ Header (YC Hacker News Style) ═══ */}
      <header style={{ background: "#f6f6ef", borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 20, height: 20, background: "#ff6600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>
              橙
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {dict.header.title}
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500 }}>
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
            <div key={category.id} id={category.id} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16, paddingBottom: 8, borderBottom: "2px solid #111827", letterSpacing: "-0.01em" }}>
                {category.name}
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {categoryProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="yc-card" 
                    style={{ display: "flex", flexDirection: "column", padding: "24px", position: "relative" }}
                  >
                    
                    {product.isHot && (
                      <div style={{ position: "absolute", top: 12, right: 12, background: "#ff6600", color: "#ffffff", padding: "2px 6px", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                        热卖
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.3, paddingRight: product.isHot ? 40 : 0 }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline" }}>
                      {product.price > 0 ? (
                        <>
                          <span style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>¥{product.price}</span>
                          <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>/ 年</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>免费</span>
                      )}
                    </div>

                    <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 20px", flexGrow: 1, lineHeight: 1.6 }}>{product.subtitle}</p>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                      {product.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ padding: "2px 8px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: 11, color: "#374151", fontWeight: 500 }}>{t}</span>
                      ))}
                      {product.tags.length > 3 && <span style={{ padding: "2px 8px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: 11, color: "#374151", fontWeight: 500 }}>...</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: "auto" }}>
                       {product.inStock ? (
                          <button 
                            onClick={() => buy(product.orderName, product.price)} 
                            className="yc-button" 
                            style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                          >
                            {product.buyButtonText}
                          </button>
                       ) : (
                          <div style={{ flex: 1, padding: "10px 0", background: "#f3f4f6", color: "#9ca3af", textAlign: "center", fontSize: 13, fontWeight: 600, border: "1px solid #e5e7eb" }}>已售罄</div>
                       )}
                       <a href={`/zh/products/${product.id}`} className="yc-button-secondary" style={{ padding: "10px 24px", textAlign: "center", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
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

      {/* Modal - YC Brutalist Style */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 400, background: "#ffffff", border: "2px solid #111827", boxShadow: "8px 8px 0 rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "24px" }}>
               <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#111827", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>确认订单</h3>
               <p style={{ margin: "0 0 16px", color: "#374151", fontSize: 14 }}>
                 <strong>商品：</strong> {modal.name}
               </p>
               
               <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 24 }}>¥{modal.price}</div>
               
               {step === "email" ? (
                 <>
                   <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>接收邮箱 (必填)</label>
                   <input 
                     type="email" 
                     placeholder="you@example.com" 
                     value={email} 
                     onChange={e => setEmail(e.target.value)} 
                     style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", marginBottom: 8, fontSize: 14, outline: "none" }} 
                     onFocus={(e) => e.target.style.borderColor = "#ff6600"} 
                     onBlur={(e) => e.target.style.borderColor = "#d1d5db"} 
                   />
                   {emailErr && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{emailErr}</div>}
                   <button onClick={goPay} className="yc-button" style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>下一步，去支付</button>
                 </>
               ) : (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ width: 200, height: 200, margin: "0 auto 20px", background: "#f9fafb", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                      [支付二维码]
                    </div>
                    <p style={{ fontSize: 12, color: "#4b5563" }}>付款后卡密将发送至 <strong>{email}</strong></p>
                 </div>
               )}
            </div>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}