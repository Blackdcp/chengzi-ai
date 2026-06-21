"use client";

import { useState } from "react";
import type { Product } from "../../types/product";

type PaymentMethod = "alipay" | "wechat";

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }}>
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
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay");

  const buy = (name: string, price: number) => {
    setModal({ name, price, orderId: genOrderId() });
    setEmail("");
    setEmailErr("");
    setStep("email");
    setPayMethod("alipay");
  };

  const goPay = () => {
    if (!em(email)) { setEmailErr("请输入有效的接收邮箱"); return; }
    setEmailErr("");
    setStep("pay");
  };

  const btnStyle: React.CSSProperties = {
    width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg,#f27a1a,#e84d5b)", color: "#fff",
    fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(242,122,26,0.2)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7", fontFamily: '"Inter",-apple-system,"PingFang SC","Microsoft YaHei",sans-serif', color: "#1a1a1a", lineHeight: 1.6 }}>

      {/* ═══ Header ═══ */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,249,247,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e7e4df" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#f27a1a" }}>{dict.header.title}</span>
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#6b6b6b", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {products.map(p => (
              <a key={p.id} href={`#${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>{p.title.split(' ')[0]}</a>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px 56px" }}>
        <div style={{ textAlign: "right", marginBottom: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#16a34a" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
            接单中
          </span>
        </div>

        {/* ═══ Dynamic Product List ═══ */}
        {products.map(product => (
          <section key={product.id} id={product.id} style={{ background: "#fff", border: "1px solid #e7e4df", borderRadius: 14, padding: "24px 28px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
            {product.isHot && (
              <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg,#1a73e8,#4285f4)", color: "#fff", padding: "6px 20px", fontSize: 12, fontWeight: 700, borderRadius: "0 14px 0 14px", letterSpacing: "0.04em" }}>🔥 热卖</div>
            )}

            <div style={{ fontSize: 12, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{product.categoryName}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{product.title}</h2>
            
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>¥{product.price}</span>
              <span style={{ fontSize: 13, color: "#6b6b6b", marginLeft: 4 }}>元</span>
            </div>

            {product.originalPriceText && (
               <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 4px" }}>
                 官方定价 <span style={{ textDecoration: "line-through" }}>{product.originalPriceText}</span>（{product.originalPriceNote}），我们仅需 ¥{product.price}/年。
               </p>
            )}

            <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 12px" }}>{product.subtitle}</p>

            {product.warnings && product.warnings.length > 0 && (
              <div style={{ marginTop: 8, marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                {product.warnings.map((w, i) => (
                   <p key={i} style={{ fontSize: 12, color: i === 0 ? "#dc2626" : "#b45309", margin: 0, background: i === 0 ? "#fef2f2" : "#fffbeb", display: "inline-block", padding: "4px 10px", borderRadius: 6, border: i === 0 ? "1px solid #fecaca" : "none" }}>
                     {w}
                   </p>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {product.tags.map(t => (
                <span key={t} style={{ padding: "3px 10px", borderRadius: 20, background: "#f5f3f0", border: "1px solid #f0ede8", fontSize: 12, color: "#6b6b6b" }}>{t}</span>
              ))}
            </div>

            {product.deliveryNotice && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0f7ff", fontSize: 12, color: "#1677ff", marginBottom: 16, lineHeight: 1.6 }}>
                {product.deliveryNotice}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
               {product.inStock ? (
                  <button onClick={() => buy(product.orderName, product.price)} style={{...btnStyle, flex: 2}}>
                    {product.buyButtonText}
                  </button>
               ) : (
                  <div style={{ flex: 2, padding: "13px 0", borderRadius: 10, background: "#e5e2dc", color: "#b0ada6", textAlign: "center", fontSize: 15, fontWeight: 600 }}>已售罄</div>
               )}
               <a href={`/zh/products/${product.id}`} style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: "1px solid #e7e4df", background: "#fff", color: "#1a1a1a", textAlign: "center", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                 详细介绍
               </a>
            </div>

            {product.features && product.features.length > 0 && (
              <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 10, background: "#f5f3f0" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>套餐说明及注意事项</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#6b6b6b", padding: "3px 0" }}><CheckIcon />{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Modal 弹窗逻辑 (保留原有逻辑) */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={() => setModal(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 400, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            {/* Modal 内容省略大量原有静态代码，这里直接复用原有购买逻辑 */}
            <div style={{ padding: "24px 28px" }}>
               <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700 }}>确认订单</h3>
               <div style={{ marginBottom: 16 }}>商品：{modal.name}</div>
               <div style={{ marginBottom: 16 }}>金额：¥{modal.price}</div>
               
               {step === "email" ? (
                 <>
                   <input type="email" placeholder="请输入用于接收 CDK 的邮箱" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", marginBottom: 8 }} />
                   {emailErr && <div style={{ color: "red", fontSize: 12, marginBottom: 8 }}>{emailErr}</div>}
                   <button onClick={goPay} style={btnStyle}>下一步去付款</button>
                 </>
               ) : (
                 <div style={{ textAlign: "center" }}>
                    <div style={{ width: 200, height: 200, margin: "0 auto 16px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      [支付二维码占位]
                    </div>
                    <p style={{ fontSize: 12, color: "#666" }}>付款后请查收邮件 {email}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}