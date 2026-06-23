"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const CONSOLE_URL = "https://api.cheng-zi-ai.com";

const MODELS = [
  { name: "gpt-5.5", provider: "openai" },
  { name: "gpt-5.4", provider: "openai" },
  { name: "gpt-5.4-mini", provider: "openai" },
  { name: "codex-auto-review", provider: "openai" },
  { name: "gpt-5.3-codex", provider: "openai" },
  { name: "gpt-image-2", provider: "openai" },
  { name: "claude-opus-4-8", provider: "claude" },
  { name: "claude-haiku-4-5-20251001", provider: "claude" },
  { name: "claude-opus-4-6", provider: "claude" },
  { name: "claude-opus-4-7", provider: "claude" },
  { name: "claude-sonnet-4-6", provider: "claude" },
  { name: "gemini-3.1-pro-high", provider: "gemini" },
  { name: "gemini-3.1-pro-low", provider: "gemini" },
  { name: "gemini-3.5-flash", provider: "gemini" },
  { name: "gemini-3.5-flash-low", provider: "gemini" },
];

const PROVIDER_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  openai: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  claude: { bg: "#fef3e2", color: "#d97706", border: "#fde68a" },
  gemini: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
};

const getPlans = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      id: "starter",
      name: isEn ? "Starter Code" : "体验兑换码",
      price: isEn ? "$4.29" : "¥29.9",
      credit: isEn ? "$5 Platform Quota" : "$5 平台等价调用额度",
      badge: "",
      bestFor: isEn ? "Good for initial testing & setup" : "适合先测试接口、跑通客户端配置",
      buttonText: isEn ? "Buy Starter Code" : "购买体验码",
      buyUrl: "#",
      features: isEn
        ? ["All models available", "Self-service top-up", "Usage records", "Community support"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量记录查看", "社群基础支持"],
    },
    {
      id: "standard",
      name: isEn ? "Standard Code" : "标准兑换码",
      price: isEn ? "$11.49" : "¥79.9",
      credit: isEn ? "$15 Platform Quota" : "$15 平台等价调用额度",
      badge: isEn ? "Recommended" : "推荐",
      bestFor: isEn ? "Good for daily use with Cursor/ChatBox" : "适合 Cursor / Cline / ChatBox 日常轻量使用",
      buttonText: isEn ? "Buy Standard Code" : "购买标准码",
      buyUrl: "#",
      features: isEn
        ? ["All models available", "Self-service top-up", "Usage analytics", "Priority support"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量统计", "优先问题处理"],
    },
    {
      id: "pro",
      name: isEn ? "Pro Code" : "尊享兑换码",
      price: isEn ? "$18.49" : "¥129",
      credit: isEn ? "$30 Platform Quota" : "$30 平台等价调用额度",
      badge: "",
      bestFor: isEn ? "Good for multi-tool heavy testing" : "适合多工具、多模型测试和更高额度使用",
      buttonText: isEn ? "Buy Pro Code" : "购买尊享码",
      buyUrl: "#",
      features: isEn
        ? ["All models available", "Self-service top-up", "Usage analytics", "Priority routing", "1v1 Setup assist"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量统计", "高峰期优先处理", "1v1 配置协助"],
    },
  ];
};

const getFaqItems = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      question: isEn ? "Which models are supported?" : "支持哪些模型？",
      answer: isEn
        ? "We support OpenAI format, Claude, and Gemini models. Check the console for exact lists, multipliers, and statuses. Models adjust dynamically based on upstream costs."
        : "支持 OpenAI 格式、Claude、Gemini 等主流模型中转。具体可用模型、价格倍率和状态以控制台显示为准。模型可能会根据上游状态和成本变化动态调整。",
    },
    {
      question: isEn ? "How do I top up?" : "如何充值？",
      answer: isEn
        ? "Purchase a redeem code, then enter it in the console to exchange it for platform quota."
        : "购买兑换码后，在控制台输入兑换码，即可兑换为平台调用额度。额度到账后可创建 API Key 并开始调用。",
    },
    {
      question: isEn ? "Can I get a refund?" : "可以退款吗？",
      answer: isEn
        ? "Unused codes can be refunded. Redeemed or partially consumed quotas cannot be refunded without cause."
        : "兑换码未使用可申请退款；已兑换或已产生调用消耗的额度不支持无理由退款。若出现扣费异常或调用失败扣费，可联系客服核查处理。",
    },
    {
      question: isEn ? "Is this the official API?" : "和官方 API 有什么区别？",
      answer: isEn
        ? "We are a third-party relay. We offer lower prices, easy access, and unified model management."
        : "本站不是 OpenAI、Anthropic、Google 官方服务，也不是官方授权代理。我们提供第三方 API 中转、统一充值、统一 Key、用量统计和客户端适配。优势是低价、接入简单、多模型统一管理。",
    },
    {
      question: isEn ? "Are there rate limits?" : "调用会限速吗？",
      answer: isEn
        ? "Normal usage is unaffected. High-frequency or abnormal usage may result in temporary limits or queues."
        : "不同模型和套餐会有不同并发与高峰期策略。正常轻量使用不受影响；如出现高频、大批量或异常调用，系统可能临时限制或排队。",
    },
    {
      question: isEn ? "Is it suitable for production?" : "适合生产环境吗？",
      answer: isEn
        ? "Best for individuals and prototype testing. Not recommended for high-risk domains like medical, financial, or legal systems."
        : "更适合个人开发者、小团队测试、AI 客户端接入和原型验证。不建议直接用于医疗、金融、法律等高风险正式生产场景。",
    },
    {
      question: isEn ? "Can I submit sensitive info?" : "可以提交敏感信息吗？",
      answer: isEn
        ? "We advise against submitting passwords, ID cards, trade secrets, or unreleased code."
        : "不建议提交密码、密钥、身份证、商业机密、未公开代码等敏感内容。请在使用前自行判断数据风险。",
    },
  ];
};

const getClientTabs = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      id: "cursor",
      name: "Cursor",
      content: isEn
        ? "1. Open Cursor settings -> Models.\n2. Set Base URL to: https://api.cheng-zi-ai.com/v1\n3. Enter your generated API Key.\n4. Select a model and test."
        : "### Cursor\n\n1. 打开 Cursor 设置，找到模型或 API 配置区域。\n2. 将 Base URL 填为：\n\n`https://api.cheng-zi-ai.com/v1`\n\n3. 将 API Key 填为你在控制台创建的 Key。\n4. 选择可用模型，发送一条测试消息。",
    },
    {
      id: "cline",
      name: "Cline",
      content: isEn
        ? "1. Open Cline settings.\n2. Select 'OpenAI Compatible' provider.\n3. Base URL: https://api.cheng-zi-ai.com/v1\n4. Enter your generated API Key.\n5. Select a model and test."
        : "### Cline\n\n1. 打开 Cline 插件设置。\n2. Provider 选择 OpenAI Compatible 或自定义 OpenAI 接口。\n3. Base URL 填写：\n\n`https://api.cheng-zi-ai.com/v1`\n\n4. API Key 填写控制台生成的 Key。\n5. 选择模型后测试调用。",
    },
    {
      id: "chatbox",
      name: "ChatBox",
      content: isEn
        ? "1. Open Settings -> Model Provider.\n2. Choose OpenAI API / Custom.\n3. Enter Base URL and API Key.\n4. Save and test."
        : "### ChatBox\n\n1. 打开设置，选择模型服务。\n2. 选择 OpenAI API 或自定义接口。\n3. 填写 Base URL 和 API Key。\n4. 保存后发送一条测试消息。",
    },
    {
      id: "nextchat",
      name: "NextChat",
      content: isEn
        ? "1. Open Settings.\n2. Enter Base URL: https://api.cheng-zi-ai.com/v1\n3. Enter API Key.\n4. Test."
        : "### NextChat\n\n1. 打开设置页面。\n2. 填写接口地址：\n\n`https://api.cheng-zi-ai.com/v1`\n\n3. 填写 API Key。\n4. 选择模型并测试。",
    },
  ];
};

export default function ApiServiceClientPage({ dict, lang }: { dict: any; lang: string }) {
  const t = dict.apiService;
  const router = useRouter();
  const pathname = usePathname();

  const plans = getPlans(lang);
  const faqItems = getFaqItems(lang);
  const clientTabs = getClientTabs(lang);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [activeClientTab, setActiveClientTab] = useState<string>("cursor");
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const switchLang = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/\${lang}`, `/\${newLang}`);
    router.push(newPath);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBuy = (plan: any) => {
    setSelectedPlan(plan);
    setIsPurchaseModalOpen(true);
  };

  const confirmBuy = () => {
    if (!selectedPlan) return;
    window.location.href = selectedPlan.buyUrl;
  };

  const copyText = async (text: string, setter: any) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error(err);
      alert(lang === "zh" ? "复制失败，请手动复制" : "Copy failed, please copy manually");
    }
  };

  return (
    <div style={{ minHeight: "100vh", lineHeight: 1.5, background: "#0a0a0a", color: "#f3f4f6", paddingBottom: "80px" }}>
      {/* ───── Compliance Banner ───── */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "#9ca3af",
          fontSize: 12,
          fontWeight: 400,
          textAlign: "center",
          padding: "8px 16px",
          lineHeight: 1.4,
        }}
      >
        {t.footer.disclaimer}
      </div>

      {/* ───── Sticky Header ───── */}
      <header
        style={{
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "12px 0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "48px",
          }}
        >
          <Link href={`/\${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: "#ffffff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderBottom: "8px solid #0a0a0a",
                  marginTop: "-2px",
                }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
              {dict.header.title}
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14, fontWeight: 500 }}>
            <span className="hide-on-mobile" style={{ display: "flex", gap: 20 }}>
              <Link href={`/\${lang}`} style={{ textDecoration: "none", color: "#d1d5db" }}>
                {t.nav.home}
              </Link>
              <a href="#models" onClick={(e) => { e.preventDefault(); scrollTo("models"); }} style={{ textDecoration: "none", color: "#d1d5db", cursor: "pointer" }}>
                {t.nav.models}
              </a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }} style={{ textDecoration: "none", color: "#d1d5db", cursor: "pointer" }}>
                {t.nav.pricing}
              </a>
              <a href="#quick-start" onClick={(e) => { e.preventDefault(); scrollTo("quick-start"); }} style={{ textDecoration: "none", color: "#d1d5db", cursor: "pointer" }}>
                {t.nav.tutorial}
              </a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }} style={{ textDecoration: "none", color: "#d1d5db", cursor: "pointer" }}>
                {t.nav.faq}
              </a>
            </span>
            
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#d1d5db" }}
            >
              {t.nav.console}
            </a>
            
            <button
              className="hide-on-mobile"
              onClick={() => scrollTo("pricing")}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {lang === "zh" ? "购买兑换码" : "Buy Redeem Code"}
            </button>

            <button
              onClick={switchLang}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "#d1d5db",
              }}
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
          color: "#ffffff",
          padding: "100px 24px 120px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center"
        }}
      >
        {/* Decorative grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 24, background: "rgba(255,255,255,0.05)" }}>
            OpenAI / Claude / Gemini
          </div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            {t.hero.title}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#d1d5db", fontWeight: 500, marginBottom: 16 }}>
            {t.hero.subtitle}
          </p>
          <p style={{ fontSize: 16, color: "#9ca3af", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            {t.hero.description}
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <button
              onClick={() => scrollTo("pricing")}
              style={{
                padding: "14px 32px",
                background: "#ffffff",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "8px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
              }}
            >
              {t.hero.ctaBuy}
            </button>
            <button
              onClick={() => scrollTo("quick-start")}
              style={{
                padding: "14px 32px",
                background: "transparent",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "8px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {t.hero.ctaTutorial}
            </button>
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: "#6b7280" }}>
            <span>✓ {lang === "zh" ? "OpenAI 格式兼容" : "OpenAI Format"}</span>
            <span>✓ {lang === "zh" ? "支持多客户端" : "Multi-Client"}</span>
            <span>✓ {lang === "zh" ? "统一额度管理" : "Unified Quota"}</span>
          </div>
        </div>
      </section>

      {/* ───── Models ───── */}
      <section id="models" style={{ padding: "60px 24px", background: "#111827" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{t.models.title}</h2>
          <p style={{ color: "#9ca3af", marginBottom: 40 }}>{t.models.subtitle}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {MODELS.map((m) => (
              <div key={m.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 500, color: "#f3f4f6" }}>{m.name}</span>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: "4px", background: PROVIDER_COLORS[m.provider].bg, color: PROVIDER_COLORS[m.provider].color }}>
                  {m.provider.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 24 }}>* {t.models.disclaimer}</p>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>
            {lang === "zh" ? "低价兑换码" : "Low-cost Redeem Codes"}
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: 60, textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
            {lang === "zh" ? "购买兑换码后，可在控制台兑换为平台调用额度。不同模型会按不同价格倍率消耗，具体以控制台显示为准。" : "Exchange redeem codes for platform quota in the console. Different models consume at different rates."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: plan.badge ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "32px 24px",
                position: "relative",
                display: "flex",
                flexDirection: "column"
              }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: "999px" }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{plan.price}</div>
                <div style={{ fontSize: 14, color: "#10b981", fontWeight: 600, marginBottom: 16 }}>{plan.credit}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24, minHeight: 40 }}>{plan.bestFor}</div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flexGrow: 1 }}>
                  {plan.features.map((feat: string, i: number) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db", marginBottom: 12 }}>
                      <span style={{ color: "#3b82f6" }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(plan)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: plan.badge ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── After Purchase Flow ───── */}
      <section id="after-purchase" style={{ padding: "40px 24px 80px", background: "#111827" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
            {lang === "zh" ? "购买后发生什么？" : "What happens after purchase?"}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>1</div>
              {lang === "zh" ? "购买套餐" : "Buy Plan"}
            </div>
            <span className="hide-on-mobile">→</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>2</div>
              {lang === "zh" ? "获得兑换码" : "Get Code"}
            </div>
            <span className="hide-on-mobile">→</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>3</div>
              {lang === "zh" ? "控制台兑换" : "Redeem Console"}
            </div>
            <span className="hide-on-mobile">→</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>4</div>
              {lang === "zh" ? "创建 API Key" : "Create API Key"}
            </div>
            <span className="hide-on-mobile">→</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>5</div>
              <span style={{ color: "#d1d5db" }}>{lang === "zh" ? "开始调用" : "Start Calling!"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Quick Start ───── */}
      <section id="quick-start" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>{lang === "zh" ? "3 分钟接入流程" : "3-Minute Quick Start"}</h2>
          <p style={{ color: "#9ca3af", marginBottom: 40 }}>{lang === "zh" ? "买完兑换码后，按下面步骤即可完成接入。" : "Follow these steps after purchasing a redeem code."}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>1. {lang === "zh" ? "控制台兑换与创建 Key" : "Redeem and Create Key"}</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>
                {lang === "zh" ? "登录控制台，在「兑换码」页面输入兑换码。然后进入「令牌」页面创建你的 API Key。" : "Log into console, redeem your code, and create an API Key in the Tokens page."}
              </p>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>API Key</div>
                  <div style={{ fontSize: 14, fontFamily: "monospace", overflowWrap: "anywhere", wordBreak: "break-all", maxWidth: "200px" }}>sk-your-generated-api-key...</div>
                </div>
                <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer" style={{ background: "#374151", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: 12, textDecoration: "none" }}>
                  {lang === "zh" ? "前往控制台创建" : "Go to Console"}
                </a>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>2. {lang === "zh" ? "获取 Base URL" : "Get Base URL"}</h3>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Base URL</div>
                  <div style={{ fontSize: 16, fontFamily: "monospace", color: "#60a5fa" }}>https://api.cheng-zi-ai.com/v1</div>
                </div>
                <button onClick={() => copyText("https://api.cheng-zi-ai.com/v1", setCopiedBaseUrl)} style={{ background: copiedBaseUrl ? "#10b981" : "#374151", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: 12, border: "none", cursor: "pointer" }}>
                  {copiedBaseUrl ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "复制" : "Copy")}
                </button>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>3. {lang === "zh" ? "发送测试请求" : "Send Test Request"}</h3>
              <div style={{ position: "relative" }}>
                <pre style={{ background: "#111827", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: 13, color: "#d1d5db", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <code style={{ fontFamily: "monospace" }}>
{`curl -X POST "https://api.cheng-zi-ai.com/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -d '{
    "model": "gpt-5.5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                  </code>
                </pre>
                <button 
                  onClick={() => copyText(`curl -X POST "https://api.cheng-zi-ai.com/v1/chat/completions" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer sk-your-api-key" \\\n  -d '{\n    "model": "gpt-5.5",\n    "messages": [{"role": "user", "content": "Hello!"}]\n  }'`, setCopiedCurl)}
                  style={{ position: "absolute", top: 12, right: 12, background: copiedCurl ? "#10b981" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: 12, cursor: "pointer" }}
                >
                  {copiedCurl ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "复制代码" : "Copy")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Client Tabs ───── */}
      <section id="clients" style={{ padding: "40px 24px", background: "#111827" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{lang === "zh" ? "常用客户端怎么填？" : "Client Tutorials"}</h2>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {clientTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveClientTab(tab.id)}
                style={{
                  background: activeClientTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
                  color: activeClientTab === tab.id ? "#fff" : "#9ca3af",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div style={{ padding: "24px 0", color: "#d1d5db", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
            {clientTabs.find(t => t.id === activeClientTab)?.content}
          </div>
        </div>
      </section>

      {/* ───── Fit / Unfit ───── */}
      <section id="fit" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>{lang === "zh" ? "适合谁使用？" : "Who is this for?"}</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "#10b981", fontSize: 18, marginBottom: 16 }}>✓ {lang === "zh" ? "适合" : "Good Fit"}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#d1d5db", fontSize: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <li>{lang === "zh" ? "- 个人开发者" : "- Indie Hackers"}</li>
                <li>{lang === "zh" ? "- Cursor / Cline / ChatBox 用户" : "- Cursor/Cline/ChatBox Users"}</li>
                <li>{lang === "zh" ? "- AI 工具测试用户" : "- AI Tool Testers"}</li>
                <li>{lang === "zh" ? "- 小团队原型验证" : "- Small team prototyping"}</li>
                <li>{lang === "zh" ? "- 想低成本体验多模型的人" : "- Low-cost multi-model testers"}</li>
              </ul>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "#9ca3af", fontSize: 18, marginBottom: 16 }}>✗ {lang === "zh" ? "不适合" : "Not a Good Fit"}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#9ca3af", fontSize: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <li>{lang === "zh" ? "- 企业正式生产系统" : "- Enterprise Production Systems"}</li>
                <li>{lang === "zh" ? "- 高并发核心业务" : "- High-concurrency core business"}</li>
                <li>{lang === "zh" ? "- 医疗、金融、法律等高风险场景" : "- Medical, Legal, Financial sectors"}</li>
                <li>{lang === "zh" ? "- 对官方合同、发票有要求的客户" : "- Needs official DPA / invoices"}</li>
                <li>{lang === "zh" ? "- 不能接受模型临时调整的人" : "- Intolerant to model availability shifts"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" style={{ padding: "40px 24px 80px", background: "#111827" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqItems.map((item, index) => (
              <div key={index} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden" }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{ width: "100%", textAlign: "left", padding: "16px 20px", background: "rgba(255,255,255,0.02)", color: "#fff", border: "none", fontSize: 16, fontWeight: 500, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {item.question}
                  <span style={{ fontSize: 20, color: "#6b7280" }}>{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div style={{ padding: "0 20px 20px", color: "#9ca3af", fontSize: 14, lineHeight: 1.6, background: "rgba(255,255,255,0.02)" }}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40, color: "#9ca3af", fontSize: 14 }}>
            {lang === "zh" ? "还有问题？联系客服协助配置。" : "Still have questions? Contact support."} <br/>
            <button onClick={() => setIsSupportModalOpen(true)} style={{ marginTop: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
              {lang === "zh" ? "联系客服" : "Contact Support"}
            </button>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer style={{ padding: "40px 24px", textAlign: "center", color: "#6b7280", fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ maxWidth: 800, margin: "0 auto 16px" }}>{t.footer.disclaimer}</p>
        <p>{t.footer.copyright}</p>
        <p style={{ marginTop: 8 }}>{t.footer.contact}: chengziai2026@163.com</p>
      </footer>

      {/* ───── Purchase Modal ───── */}
      {isPurchaseModalOpen && selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#1f2937", width: "100%", maxWidth: 480, borderRadius: "16px", padding: 32, position: "relative" }}>
            <button onClick={() => setIsPurchaseModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 24, cursor: "pointer" }}>×</button>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
              {lang === "zh" ? "你将购买：" : "You are purchasing:"} {selectedPlan.name}
            </h3>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: "8px", marginBottom: 24 }}>
              <div style={{ color: "#10b981", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{lang === "zh" ? "到手额度：" : "Quota: "} {selectedPlan.credit}</div>
              <div style={{ fontSize: 13, color: "#d1d5db", marginBottom: 8 }}>
                <strong>{lang === "zh" ? "使用方式：" : "Usage: "}</strong>
                {lang === "zh" ? "付款后获得兑换码，在控制台兑换为平台调用额度。" : "Get redeem code after payment, redeem in console."}
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                <strong>{lang === "zh" ? "退款提示：" : "Refund: "}</strong>
                {lang === "zh" ? "兑换码未使用可申请退款；已兑换或已产生调用消耗的额度不支持无理由退款。" : "Unused codes can be refunded. Redeemed quota cannot be refunded."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
              <button onClick={confirmBuy} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: 16 }}>
                {lang === "zh" ? "确认购买" : "Confirm Purchase"}
              </button>
              <button 
                onClick={() => { setIsPurchaseModalOpen(false); scrollTo("quick-start"); }}
                style={{ background: "transparent", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.2)", padding: "14px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: 16 }}
              >
                {lang === "zh" ? "先看接入流程" : "Read Tutorial First"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Support Modal ───── */}
      {isSupportModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#1f2937", width: "100%", maxWidth: 400, borderRadius: "16px", padding: 32, position: "relative", textAlign: "center" }}>
            <button onClick={() => setIsSupportModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#9ca3af", fontSize: 24, cursor: "pointer" }}>×</button>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#fff" }}>{lang === "zh" ? "需要协助？" : "Need Help?"}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", color: "#d1d5db", fontSize: 14, textAlign: "left", display: "inline-block" }}>
              <li>- {lang === "zh" ? "购买前咨询" : "Pre-purchase questions"}</li>
              <li>- {lang === "zh" ? "兑换码不会用" : "Redeem code issues"}</li>
              <li>- {lang === "zh" ? "Cursor / Cline 配置失败" : "Client setup failed"}</li>
              <li>- {lang === "zh" ? "调用异常或扣费问题" : "API or billing errors"}</li>
            </ul>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", color: "#fff", fontWeight: 600 }}>
              {lang === "zh" ? "客服邮箱：" : "Support Email: "}<br/>
              <span style={{ color: "#60a5fa", marginTop: 8, display: "inline-block" }}>chengziai2026@163.com</span>
            </div>
          </div>
        </div>
      )}

      {/* ───── Mobile Sticky CTA ───── */}
      <div className="mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(17,24,39,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 40 }}>
        <div style={{ color: "#fff", fontWeight: 700 }}>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400, marginRight: 4 }}>{lang === "zh" ? "起" : "From"}</span>
          ¥29.9
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => scrollTo("quick-start")} style={{ background: "transparent", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 12px", borderRadius: "6px", fontSize: 13, fontWeight: 600 }}>
            {lang === "zh" ? "接入教程" : "Tutorial"}
          </button>
          <button onClick={() => scrollTo("pricing")} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: 13, fontWeight: 600 }}>
            {lang === "zh" ? "购买兑换码" : "Buy Code"}
          </button>
        </div>
      </div>

      {/* ───── Floating Support (Desktop) ───── */}
      <button 
        className="hide-on-mobile"
        onClick={() => setIsSupportModalOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#374151",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "12px 20px",
          borderRadius: "999px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 40,
        }}
      >
        💬 {lang === "zh" ? "联系客服" : "Support"}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .mobile-vertical-flow { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}} />
    </div>
  );
}
