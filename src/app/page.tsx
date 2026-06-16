"use client";

import { useState } from "react";
import Image from "next/image";

type AccountVariant = "nowarranty" | "warranty";
type PaymentMethod = "alipay" | "wechat";

/* ═══════════════════════════════════════════
   库存控制 — 改这里就能开关产品
   ═══════════════════════════════════════════ */
const STOCK: Record<string, boolean> = {
  "account-nowarranty": true,   // 成品号 无质保 ¥66.66
  "account-warranty":   true,   // 成品号 附带质保 ¥122
  "plus-direct":        true,   // Plus 直充 ¥168.88
};

const em = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0ede8" }}>
      <div onClick={() => setOpen(!open)}
        style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
        {q}
        <span style={{ fontSize: 18, color: "#9e9e9e", flexShrink: 0, marginLeft: 12 }}>{open ? "−" : "+"}</span>
      </div>
      {open && <p style={{ fontSize: 13, color: "#6b6b6b", padding: "0 16px 12px", margin: 0, lineHeight: 1.6 }}>{a}</p>}
    </div>
  );
}

function genOrderId() {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  const t = `${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}`;
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CZ${d}${t}${r}`;
}

export default function HomePage() {
  const [variant, setVariant] = useState<AccountVariant>("nowarranty");
  const [modal, setModal] = useState<{ name: string; price: number; orderId: string } | null>(null);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [step, setStep] = useState<"email" | "pay">("email");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay");
  const isSold = variant === "nowarranty"
    ? !STOCK["account-nowarranty"]
    : !STOCK["account-warranty"];
  const plusSold = !STOCK["plus-direct"];
  const warrantyDate = (() => { const d = new Date(); d.setDate(d.getDate() + 30); return `${d.getMonth() + 1}月${d.getDate()}日`; })();

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
          <span style={{ fontSize: 20, fontWeight: 700, color: "#f27a1a" }}>橙子 AI</span>
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#6b6b6b" }}>
            <a href="#account" style={{ color: "inherit", textDecoration: "none" }}>成品号</a>
            <a href="#plus" style={{ color: "inherit", textDecoration: "none" }}>Plus 直充</a>
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

        {/* ═══════════════ 成品号 ═══════════════ */}
        <section id="account" style={{ background: "#fff", border: "1px solid #e7e4df", borderRadius: 14, padding: "24px 28px 28px", marginBottom: 20 }}>

          <div style={{ fontSize: 12, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>ChatGPT Plus 账号 · 人工交付</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>ChatGPT Plus 成品号</h2>
          <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 4px" }}>独立成品账号（含邮箱密码），登录即用。</p>
          <p style={{ fontSize: 12, color: "#b45309", margin: "0 0 16px", background: "#fffbeb", display: "inline-block", padding: "4px 10px", borderRadius: 6 }}>
            ⚠️ 非 OpenAI 官方渠道。存在风控风险，请使用小号登录。
          </p>

          {/* 版本选择 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div onClick={() => setVariant("nowarranty")}
              style={{ flex: 1, padding: 14, borderRadius: 10, border: variant === "nowarranty" ? "2px solid #f27a1a" : "1.5px solid #e7e4df", background: variant === "nowarranty" ? "#fff7ed" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>无质保</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: variant === "nowarranty" ? "#f27a1a" : "#1a1a1a" }}>¥66.66</span>
              </div>
              <div style={{ fontSize: 11, color: "#9e9e9e", marginTop: 2 }}>{!STOCK["account-nowarranty"] ? "已售罄" : "购买后不支持退款"}</div>
            </div>
            <div onClick={() => setVariant("warranty")}
              style={{ flex: 1, padding: 14, borderRadius: 10, border: variant === "warranty" ? "2px solid #f27a1a" : "1.5px solid #e7e4df", background: variant === "warranty" ? "#fff7ed" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>附带质保</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: variant === "warranty" ? "#f27a1a" : "#1a1a1a" }}>¥122</span>
              </div>
              <div style={{ fontSize: 11, color: "#9e9e9e", marginTop: 2 }}>质保至 {warrantyDate}，不可用免费换新</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {["📧 含邮箱密码", "🔒 可改密绑定", "⏱ 付款后 24h 内交付"].map(b => (
              <span key={b} style={{ padding: "3px 10px", borderRadius: 20, background: "#f5f3f0", border: "1px solid #f0ede8", fontSize: 12, color: "#6b6b6b" }}>{b}</span>
            ))}
          </div>

          {/* 交付说明 */}
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0f7ff", fontSize: 12, color: "#1677ff", marginBottom: 16, lineHeight: 1.6 }}>
            📋 <b>交付流程：</b>付款后人工处理，账号发送至你的邮箱。如开通失败，全额退款。
          </div>

          {isSold ? (
            <div style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#e5e2dc", color: "#b0ada6", textAlign: "center", fontSize: 15, fontWeight: 600 }}>已售罄</div>
          ) : (
            <button onClick={() => buy(
              variant === "warranty" ? "ChatGPT Plus 成品号（附带质保）" : "ChatGPT Plus 成品号（无质保）",
              variant === "warranty" ? 122 : 66.66
            )} style={btnStyle}>
              下单购买 — ¥{variant === "warranty" ? "122.00" : "66.66"}
            </button>
          )}
          {isSold && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "#fffbeb", fontSize: 12, color: "#b45309" }}>
              ⚠️ 当前暂无库存，如需购买请选择附带质保版本。
            </div>
          )}

          {/* 套餐内容 */}
          <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 10, background: "#f5f3f0" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>套餐内容</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "注册 ChatGPT 时间均为 24-25 年，存活至今更稳定",
                "账号开通 Plus 均已静置 3 天左右，降低被风控几率",
                "保证可登录，可改密，可绑定个人手机邮箱",
                "付款后人工处理，发送至你提供的接收邮箱",
                "Image2 绘图等专业功能支持",
                "保护隐私；数据不用于模型训练",
                "部署代理进行编码与深度研究",
              ].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#6b6b6b", padding: "3px 0" }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
          </div>

          {/* 三步 */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>三步下单</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { n: "1", t: "填写邮箱", d: "输入接收产品的邮箱" },
                { n: "2", t: "扫码付款", d: "备注订单号，保留截图" },
                { n: "3", t: "等待交付", d: "确认收款后处理，24h 内交付" },
              ].map(s => (
                <div key={s.n} style={{ padding: "16px 12px", borderRadius: 10, border: "1px solid #e7e4df", background: "#fff", textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f27a1a,#e84d5b)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 14, fontWeight: 700 }}>{s.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: "#6b6b6b" }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>常见问题</h3>
            <div style={{ border: "1px solid #e7e4df", borderRadius: 12, overflow: "hidden" }}>
              <FaqItem q="Plus 账号和 Plus 订阅有什么区别？" a="成品号是独立的新账号（含邮箱密码），买来直接登录使用。直充是在你自己现有的账号上开通 Plus 会员。" />
              <FaqItem q="账号会被多人使用吗？" a="每个账号仅交付给您一人，交付后请及时改密。请勿外泄账号信息。" />
              <FaqItem q="账号无法登录怎么办？" a={variant === "warranty" ? "质保期内如被封禁、风控无法登录、Plus 意外失效，可免费换新。请联系 chengziai2026@163.com 处理。" : "无质保版本购买后不支持退款或换货。下单即表示接受此条款。"} />
              <div style={{ borderBottom: "none" }}>
                <FaqItem q="会封号吗？" a="ChatGPT 存在 OpenAI 风控机制，任何非官方渠道获得的账号都有被封禁的风险。建议使用小号登录，不要在成品号上绑定重要信息。" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ Plus 直充 ═══════════════ */}
        <section id="plus" style={{ background: "#fff", border: "1px solid #e7e4df", borderRadius: 14, padding: "24px 28px 28px", marginBottom: 20 }}>

          <div style={{ fontSize: 12, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>ChatGPT Plus 订阅 · 人工代开通</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>ChatGPT Plus 直充</h2>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>¥168.88</span>
            <span style={{ fontSize: 13, color: "#6b6b6b", marginLeft: 4 }}>元</span>
          </div>
          <p style={{ fontSize: 13, color: "#6b6b6b", margin: "0 0 4px" }}>在你的个人账号上开通 Plus 会员。同一邮箱三十天内只可开通一次。</p>
          <p style={{ fontSize: 12, color: "#b45309", margin: "0 0 16px", background: "#fffbeb", display: "inline-block", padding: "4px 10px", borderRadius: 6 }}>
            ⚠️ 需要提供 Session 凭证。非官方渠道，存在账号风控风险，请使用小号操作。
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {["💰 人工代开通", "⏱ 付款后 24h 内完成", "💗 质保30天订阅在线"].map(b => (
              <span key={b} style={{ padding: "3px 10px", borderRadius: 20, background: "#f5f3f0", border: "1px solid #f0ede8", fontSize: 12, color: "#6b6b6b" }}>{b}</span>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <a href="#" style={{ fontSize: 13, color: "#6b6b6b", textDecoration: "underline", display: "inline-block", marginBottom: 8 }} onClick={e => e.preventDefault()}>
              Session 如何获取？
            </a>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#faf9f7", border: "1px solid #e7e4df", fontSize: 12, color: "#6b6b6b", lineHeight: 1.6 }}>
              登录 chatgpt.com → 访问 <code style={{ background: "#e7e4df", padding: "1px 4px", borderRadius: 3 }}>/api/auth/session</code> → 复制全部内容 → 付款后发送至 chengziai2026@163.com
            </div>
          </div>

          {/* 交付说明 */}
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0f7ff", fontSize: 12, color: "#1677ff", marginBottom: 16, lineHeight: 1.6 }}>
            📋 <b>开通流程：</b>付款后提供 Session，人工处理开通，完成后通知你。如开通失败，全额退款。
          </div>

          {plusSold ? (
            <div style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#e5e2dc", color: "#b0ada6", textAlign: "center", fontSize: 15, fontWeight: 600 }}>已售罄</div>
          ) : (
            <button onClick={() => buy("ChatGPT Plus 直充", 168.88)} style={btnStyle}>
              下单开通 — ¥168.88
            </button>
          )}
          {plusSold && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "#fffbeb", fontSize: 12, color: "#b45309" }}>
              ⚠️ 当前暂无库存，暂时无货，请稍后再来。
            </div>
          )}

          <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 10, background: "#f5f3f0" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>套餐内容</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "个人账号直升 Plus，无需更换账号",
                "提供 Session 凭证，人工处理开通",
                "Image2 绘图等专业功能支持",
                "网页对话 GPT-5.5 基础模型权限",
                "生成图片、视频、幻灯片等",
                "DALL·E 绘图、高级语音对话",
                "保护隐私；数据不用于模型训练",
                "部署代理进行编码与深度研究",
              ].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#6b6b6b", padding: "3px 0" }}><CheckIcon />{f}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>三步开通</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { n: "1", t: "获取 Session", d: "登录 ChatGPT 复制凭证" },
                { n: "2", t: "下单付款", d: "备注订单号，保留截图" },
                { n: "3", t: "等待开通", d: "确认收款后处理，24h 内完成" },
              ].map(s => (
                <div key={s.n} style={{ padding: "16px 12px", borderRadius: 10, border: "1px solid #e7e4df", background: "#fff", textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f27a1a,#e84d5b)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 14, fontWeight: 700 }}>{s.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: "#6b6b6b" }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>常见问题</h3>
            <div style={{ border: "1px solid #e7e4df", borderRadius: 12, overflow: "hidden" }}>
              <FaqItem q="开通后如何使用？" a="开通后直接登录 chatgpt.com 即可使用全部 Plus 功能，无需额外操作。" />
              <FaqItem q="支持哪些邮箱？" a="支持 Google、微软等授权登录的邮箱。苹果授权登录暂不支持。" />
              <FaqItem q="已有 Plus 怎么办？" a="同一邮箱三十天内只可开通一次。如账号还有 Plus 未过期，请等待过期后再开通。" />
              <div style={{ borderBottom: "none" }}>
                <FaqItem q="Session 凭证安全吗？" a="Session 仅用于本次开通操作，完成后请自行刷新 Session 使其失效。建议使用小号操作，不要在主力账号上使用此服务。" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ height: 1, background: "#e7e4df", marginBottom: 20 }} />
        <footer style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#9e9e9e", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            本站为第三方代下单服务，非 OpenAI 官方渠道。<br />
            ChatGPT 账号存在风控、封禁、不可用等风险，请使用小号操作。<br />
            下单前请确认接受相关风险。如无法交付，将全额退款。
          </p>
          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 12 }}>© {new Date().getFullYear()} 橙子AI · chengziai2026@163.com</p>
        </footer>
      </div>

      {/* ═══ 下单弹窗 — 带订单号 ═══ */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setModal(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", maxHeight: "90vh", overflow: "auto" }}
            onClick={e => e.stopPropagation()}>

            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f5f3f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div style={{ height: 80, borderRadius: 10, marginBottom: 14, background: "linear-gradient(135deg,#f27a1a,#e84d5b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🤖</div>

            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{modal.name}</h2>
            <div style={{ margin: "4px 0 4px" }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>¥{modal.price}</span>
              <span style={{ fontSize: 13, color: "#6b6b6b", marginLeft: 4 }}>元</span>
            </div>

            {/* 订单号 */}
            <div style={{ marginBottom: 18, padding: "8px 12px", borderRadius: 8, background: "#f5f3f0", fontSize: 12, color: "#6b6b6b", fontFamily: "monospace" }}>
              订单号：<b style={{ color: "#1a1a1a", letterSpacing: 1 }}>{modal.orderId}</b>
              <span style={{ marginLeft: 8, color: "#f27a1a", fontWeight: 600 }}>请保存此编号</span>
            </div>

            {step === "email" ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>接收邮箱</div>
                  <input type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setEmailErr(""); }}
                    onKeyDown={e => { if (e.key === "Enter") goPay(); }}
                    placeholder="请输入接收产品的邮箱" autoFocus
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: emailErr ? "1.5px solid #ef4444" : "1px solid #e7e4df", background: "#faf9f7", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  {emailErr && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{emailErr}</div>}
                </div>
                <button onClick={goPay} style={btnStyle}>下一步</button>
              </>
            ) : (
              <>
                {/* 收款方式切换 */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <button onClick={() => setPayMethod("alipay")}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: payMethod === "alipay" ? "2px solid #1677ff" : "1px solid #e7e4df", background: payMethod === "alipay" ? "#f0f7ff" : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: payMethod === "alipay" ? "#1677ff" : "#6b6b6b" }}>
                    💙 支付宝
                  </button>
                  <button onClick={() => setPayMethod("wechat")}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: payMethod === "wechat" ? "2px solid #07c160" : "1px solid #e7e4df", background: payMethod === "wechat" ? "#f0fff4" : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: payMethod === "wechat" ? "#07c160" : "#6b6b6b" }}>
                    💚 微信
                  </button>
                </div>

                {/* 付款指引 */}
                <div style={{ padding: 14, borderRadius: 10, background: "#f5f3f0", fontSize: 13, marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, marginBottom: 10 }}>付款步骤</div>
                  {[
                    `扫描下方${payMethod === "alipay" ? "支付宝" : "微信"}码，支付 ¥${modal.price}`,
                    <span key="note"><b>重要：</b>转账<em>备注栏</em>填写订单号 <b style={{ fontFamily: "monospace", letterSpacing: 1 }}>{modal.orderId}</b></span>,
                    `付款后保留截图，发送至 chengziai2026@163.com 确认`,
                    `确认收款后处理，产品 24h 内发送至 ${email || "你的邮箱"}`,
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 3 ? 8 : 0, color: "#6b6b6b" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#f27a1a,#e84d5b)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                {/* 收款码 */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Image
                    src={payMethod === "alipay" ? "/alipay-qr.jpg" : "/wechat-qr.jpg"}
                    alt="收款码"
                    width={200}
                    height={200}
                    style={{ borderRadius: 10, objectFit: "contain", background: "#fff" }}
                    priority
                  />
                </div>

                <button onClick={() => setStep("email")} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid #e7e4df", background: "#fff", color: "#6b6b6b", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  ← 返回修改邮箱
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}