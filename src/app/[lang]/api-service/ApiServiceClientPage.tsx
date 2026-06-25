"use client";

import { useState } from "react";
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
      id: "plan_100",
      name: isEn ? "Basic Credit Code" : "基础充值码",
      priceText: isEn ? "$100" : "¥100",
      priceValue: 100,
      priceUsd: 100,
      credit: isEn ? "$100 platform credit" : "$100 平台计价额度",
      badge: "",
      bestFor: isEn ? "For individual developers, AI client testing, and lightweight usage." : "适合：个人开发者、AI 客户端测试、Cursor / Cline / ChatBox 轻量使用",
      features: isEn
        ? ["Mainstream models available", "Self-service top-up in console", "Usage logs view", "Basic community support"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量记录查看", "社群基础支持"],
      buttonText: isEn ? "Buy $100 Credit Code" : "购买 ¥100 充值码",
    },
    {
      id: "plan_300",
      name: isEn ? "Pro Credit Code" : "大额充值码",
      priceText: isEn ? "$300" : "¥300",
      priceValue: 300,
      priceUsd: 300,
      credit: isEn ? "$300 platform credit" : "$300 平台计价额度",
      badge: isEn ? "Recommended" : "推荐",
      bestFor: isEn ? "For frequent usage, AI coding, multi-model testing, and small team usage." : "适合：高频使用、AI Coding、多模型测试、小团队轻量共用",
      features: isEn
        ? ["Mainstream models available", "Self-service top-up in console", "Usage statistics dashboard", "Peak-time priority routing", "1v1 Setup assistance"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量统计", "高峰期优先处理", "1v1 配置协助"],
      buttonText: isEn ? "Buy $300 Credit Code" : "购买 ¥300 充值码",
    },
  ];
};


const getFitData = (lang: string) => {
  const isEn = lang === "en";
  return {
    suitable: {
      title: isEn ? "Who Is This For?" : "适合谁",
      items: isEn
        ? [
            "Individual Developers & Hobbyists",
            "Cursor / Cline / ChatBox / NextChat users",
            "AI application sandbox testers",
            "Small teams building rapid MVP prototypes",
            "Users wanting low-cost trials of multiple LLM providers"
          ]
        : [
            "个人开发者",
            "Cursor / Cline / ChatBox 用户",
            "AI 工具测试用户",
            "小团队原型验证",
            "想低成本体验多模型的人"
          ]
    },
    unsuitable: {
      title: isEn ? "Who Is This NOT For?" : "不适合谁",
      items: isEn
        ? [
            "Enterprise formal production deployments",
            "High-concurrency mission-critical operations",
            "High-risk sectors (medical, financial, legal domains)",
            "Customers requiring official contracts, VAT invoices, DPA, or custom SLAs",
            "Users who cannot tolerate temporary upstream model adjustments"
          ]
        : [
            "企业正式生产系统",
            "高并发核心业务",
            "医疗、金融、法律等高风险场景",
            "对官方合同、发票、DPA、SLA 有要求的客户",
            "不能接受模型临时调整的人"
          ]
    }
  };
};


const getQuickStartSteps = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      title: isEn ? "1. Buy Credit Code" : "1. 购买充值码",
      desc: isEn 
        ? "Select $100 / $300 credit code, complete payment via PayPal, and submit your email." 
        : "选择 ¥100 / ¥300 充值码，完成支付宝付款，并提交邮箱。"
    },
    {
      title: isEn ? "2. Manual Verification & Delivery" : "2. 人工核款发码",
      desc: isEn 
        ? "We will send the redemption code to your email after manually confirming the payment." 
        : "我们会在核对收款后，将兑换码发送到你的邮箱。"
    },
    {
      title: isEn ? "3. Redeem in Console" : "3. 控制台兑换额度",
      desc: isEn 
        ? "Log in to https://api.cheng-zi-ai.com, and redeem the code in the redeem page." 
        : "登录 https://api.cheng-zi-ai.com，在「兑换」页面输入兑换码。"
    },
    {
      title: isEn ? "4. Create API Key" : "4. 创建 API Key",
      desc: isEn 
        ? "Navigate to the Token page inside the console, generate your API Key." 
        : "进入「令牌」页面创建你的 API Key。"
    },
    {
      title: isEn ? "5. Configure Client" : "5. 填入客户端",
      desc: isEn 
        ? "Base URL is https://api.cheng-zi-ai.com/v1, and API Key is your created token." 
        : "Base URL 填写 https://api.cheng-zi-ai.com/v1，API Key 填写你创建的令牌。"
    }
  ];
};

const getFaqItems = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      question: isEn ? "Is this an official service?" : "这是官方服务吗？",
      answer: isEn
        ? "No. This site is a third-party API relay and platform credit service, not affiliated with or authorized by OpenAI, Anthropic, or Google."
        : "不是。本站为第三方 API 中转与平台计价额度服务，不是 OpenAI、Anthropic、Google 官方服务，也不是官方授权代理。"
    },
    {
      question: isEn ? "What am I buying?" : "购买的是什么？",
      answer: isEn
        ? "You are purchasing a redemption code for platform credit, not official account balances or official USD top-ups. You can view your balance and call logs in the console after redemption."
        : "购买的是本站平台计价额度兑换码，不是官方账户余额或官方美元充值。兑换码兑换后可在控制台中查看余额和调用记录。"
    },
    {
      question: isEn ? "Are fees different for different models?" : "不同模型扣费一样吗？",
      answer: isEn
        ? "Yes, they differ. Different models and endpoints consume credit at different rates. The actual deduction is based on console usage logs."
        : "不一样。不同模型、不同线路会按不同倍率消耗额度，实际扣费以控制台调用日志为准。"
    },
    {
      question: isEn ? "How long to receive the code after payment?" : "付款后多久收到兑换码？",
      answer: isEn
        ? "After PayPal payment, please submit your email and order information. We will send the redemption code after manual confirmation."
        : "支付宝付款后，请提交邮箱和订单信息。我们会在人工核对收款后发送兑换码。"
    },
    {
      question: isEn ? "Can I get a refund?" : "可以退款吗？",
      answer: isEn
        ? "Unused redemption codes are eligible for refunds by contacting support. Once redeemed or consumed, codes are non-refundable. For abnormal billing, contact support to investigate."
        : "兑换码未使用前可以联系客服处理退款。兑换码一经兑换，或额度已经产生调用消耗，不支持无理由退款。异常扣费或调用失败扣费可以联系客服核查。"
    },
    {
      question: isEn ? "Is it suitable for production?" : "适合生产环境吗？",
      answer: isEn
        ? "It is best suited for individual developers, small team testing, AI client integration, and lightweight usage. We do not recommend it for enterprise production, high-concurrency core businesses, or high-risk scenarios such as medical, financial, or legal domains."
        : "更适合个人开发者、小团队测试、AI 客户端接入和轻量使用。不建议用于企业正式生产、高并发核心业务、医疗、金融、法律等高风险场景。"
    }
  ];
};

export default function ApiServiceClientPage({ dict, lang }: { dict: any; lang: string }) {
  const t = dict.apiService;
  const router = useRouter();
  const pathname = usePathname();
  const isEn = lang === "en";

  const plans = getPlans(lang);
  const fitData = getFitData(lang);
  const faqItems = getFaqItems(lang);
  const quickStartSteps = getQuickStartSteps(lang);

  // UI States
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<"confirm" | "pay" | "success">("confirm");
  const [payMethod, setPayMethod] = useState<"alipay" | "wechat">("alipay");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLang = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
      return true;
    } catch (e) {
      console.error(e);
      alert(isEn ? "Copy failed, please copy manually." : "复制失败，请手动复制");
      return false;
    }
  };

  const genOrderId = () => {
    const now = new Date();
    const ts = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `API-${ts}-${rand}`;
  };

  const handleBuy = (plan: any) => {
    setSelectedPlan(plan);
    setOrderId(genOrderId());
    setEmail("");
    setEmailErr("");
    setContact("");
    setPurchaseStep("confirm");
    setIsPurchaseModalOpen(true);
  };

  const confirmBuy = () => {
    setPurchaseStep("pay");
  };

  const submitOrder = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErr(isEn ? "Please enter a valid email address" : "请输入有效的邮箱地址");
      return;
    }
    setEmailErr("");
    if (!selectedPlan) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          email: email,
          lang: lang,
          contact: contact
        })
      });
      if (res.ok) {
        setPurchaseStep("success");
      } else {
        alert(isEn ? "Submission failed, please try again." : "提交订单失败，请稍后重试");
      }
    } catch (e) {
      alert(isEn ? "Submission failed, please try again." : "提交订单失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const curlExampleCode = `curl -X POST "https://api.cheng-zi-ai.com/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -d '{
    "model": "gpt-5.5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;

  const pythonExampleCode = `import openai

client = openai.OpenAI(
    base_url="https://api.cheng-zi-ai.com/v1",
    api_key="sk-your-api-key"
)

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`;

  return (
    <div style={{ minHeight: "100vh", lineHeight: 1.5, background: "#fafafa" }}>
      {/* ───── Compliance Banner (Section 2) ───── */}
      <div
        style={{
          background: "#fafafa",
          borderBottom: "1px solid #eaeaea",
          color: "#666666",
          fontSize: 12,
          textAlign: "center",
          padding: "10px 24px",
          lineHeight: 1.4,
        }}
      >
        {isEn
          ? "Service availability is subject to laws, policies, and upstream rules. Users must verify permission in their region."
          : "服务可用范围受相关法律法规、平台政策及上游服务规则影响。用户应自行确认其所在地区是否允许使用相关服务。"}
      </div>

      {/* ───── Sticky Header (Section 3) ───── */}
      <header
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #eaeaea",
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
          {/* Logo & Brand */}
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: "#0a0a0a",
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
                  borderBottom: "8px solid #ffffff",
                  marginTop: "-2px",
                }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {dict.header.title}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="desktop-flex" style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14, fontWeight: 500 }}>
            <Link href={`/${lang}`} className="nav-link" style={{ textDecoration: "none" }}>
              {t.nav.home}
            </Link>
            <a
              href="#models"
              className="nav-link"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("models");
              }}
            >
              {t.nav.models}
            </a>
            <a
              href="#pricing"
              className="nav-link"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("pricing");
              }}
            >
              {t.nav.pricing}
            </a>
            <a
              href="#quick-start"
              className="nav-link"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("quick-start");
              }}
            >
              {t.nav.tutorial}
            </a>
            <a
              href="#faq"
              className="nav-link"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("faq");
              }}
            >
              {t.nav.faq}
            </a>
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ textDecoration: "none" }}
            >
              {t.nav.console}
            </a>
            <button
              onClick={switchLang}
              style={{
                background: "none",
                border: "1px solid #eaeaea",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "#666",
              }}
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>

            {/* Nav Header CTAs */}
            <button
              onClick={() => scrollTo("pricing")}
              style={{
                background: "#0a0a0a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isEn ? "Buy Quota" : "购买兑换码"}
            </button>
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent",
                color: "#0a0a0a",
                border: "1px solid #eaeaea",
                borderRadius: "6px",
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {isEn ? "Enter Console" : "进入控制台"}
            </a>
          </div>

          {/* Mobile Menu Trigger & Buy Button */}
          <div className="mobile-flex" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => scrollTo("pricing")}
              style={{
                background: "#0a0a0a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isEn ? "Buy" : "购买"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "1px solid #eaeaea",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 14,
                color: "#333",
              }}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div style={{ background: "#ffffff", borderTop: "1px solid #eaeaea", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16, fontSize: 15, fontWeight: 500 }}>
            <Link href={`/${lang}`} style={{ textDecoration: "none", color: "#333" }} onClick={() => setMobileMenuOpen(false)}>
              {t.nav.home}
            </Link>
            <a
              href="#models"
              style={{ textDecoration: "none", color: "#333" }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo("models");
              }}
            >
              {t.nav.models}
            </a>
            <a
              href="#pricing"
              style={{ textDecoration: "none", color: "#333" }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo("pricing");
              }}
            >
              {t.nav.pricing}
            </a>
            <a
              href="#quick-start"
              style={{ textDecoration: "none", color: "#333" }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo("quick-start");
              }}
            >
              {t.nav.tutorial}
            </a>
            <a
              href="#faq"
              style={{ textDecoration: "none", color: "#333" }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo("faq");
              }}
            >
              {t.nav.faq}
            </a>
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#333" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.console}
            </a>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #f5f5f5" }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  switchLang();
                }}
                style={{
                  background: "none",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#666",
                }}
              >
                {lang === "zh" ? "EN" : "中文"}
              </button>
              <a
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "transparent",
                  color: "#0a0a0a",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {isEn ? "Console" : "进入控制台"}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ───── Hero (Section 4) ───── */}
      <section
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
          color: "#ffffff",
          padding: "80px 24px 100px",
          position: "relative",
          overflow: "hidden",
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

        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "999px",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 16,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            🚀 OpenAI / Claude / Gemini
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "999px",
              fontSize: 13,
              fontWeight: 600,
              color: "#4ade80",
              marginBottom: 32,
              marginLeft: 12,
              background: "rgba(34,197,94,0.1)",
            }}
          >
            ✅ OpenAI {isEn ? "Compatible" : "格式兼容"}
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}
          >
            {t.hero.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              margin: "0 0 12px",
              letterSpacing: "0.02em",
            }}
          >
            {t.hero.subtitle}
          </p>

          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 620,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {t.hero.description}
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <button
              onClick={() => scrollTo("pricing")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
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
              <span style={{ fontSize: 18 }}>→</span>
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

          {/* Small Trust Badges */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["OpenAI 格式兼容", "支持多客户端", "统一额度管理"].map((tagZh, i) => {
              const tagEn = ["OpenAI Compatible", "Multi-Client Support", "Unified Quota Console"][i];
              return (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.45)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "6px 14px",
                    borderRadius: "999px",
                  }}
                >
                  ✓ {isEn ? tagEn : tagZh}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Available Models (Section 5) ───── */}
      <section id="models" style={{ padding: "80px 24px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            {t.models.title}
          </h2>
          <p style={{ fontSize: 16, color: "#666666", margin: 0 }}>{t.models.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 32 }}>
          {["openai", "claude", "gemini"].map(provider => {
            const providerModels = MODELS.filter(m => m.provider === provider);
            const pc = PROVIDER_COLORS[provider];
            
            const providerName = provider === "openai" 
              ? (isEn ? "OpenAI Models" : "OpenAI 格式模型") 
              : provider === "claude" 
              ? (isEn ? "Claude Series Models" : "Claude 系列模型") 
              : (isEn ? "Gemini Series Models" : "Gemini 系列模型");

            const providerDesc = provider === "openai" 
              ? (isEn ? "Supports various OpenAI format models, ideal for text, coding, and image generation. Specific names in console." : "支持多种 OpenAI 格式模型，可用于文本、代码、部分多模态场景。具体模型名称和可用状态以控制台为准。")
              : provider === "claude"
              ? (isEn ? "Supports Claude series relay, ideal for writing, advanced coding, and long document analytics." : "支持 Claude 系列模型中转，适合写作、代码、长文本分析等场景。")
              : (isEn ? "Supports Gemini models, optimal choice for long-context windows and low-cost execution." : "支持 Gemini 系列模型，适合多模态、长文本和低成本调用场景。");

            return (
              <div
                key={provider}
                className="vercel-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "32px",
                  position: "relative",
                }}
              >
                {/* Availability status */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    border: "1px solid #22c55e",
                    color: "#22c55e",
                    padding: "2px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  {t.models.available}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#111827",
                    margin: "0 0 12px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                    paddingRight: 60,
                  }}
                >
                  {providerName}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    color: "#666666",
                    margin: "0 0 24px",
                    flexGrow: 1,
                    lineHeight: 1.6,
                    minHeight: "72px",
                  }}
                >
                  {providerDesc}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {providerModels.map(model => (
                    <span
                      key={model.name}
                      style={{
                        padding: "4px 10px",
                        background: "#fafafa",
                        border: "1px solid #eaeaea",
                        borderRadius: "999px",
                        fontSize: 12,
                        color: "#666666",
                        fontWeight: 500,
                        cursor: "default",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = pc.color;
                        e.currentTarget.style.color = pc.color;
                        e.currentTarget.style.background = pc.bg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#eaeaea";
                        e.currentTarget.style.color = "#666666";
                        e.currentTarget.style.background = "#fafafa";
                      }}
                    >
                      {model.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Card bottom disclaimer */}
        <div style={{ textAlign: "center", fontSize: 13, color: "#999999" }}>
          {isEn ? "* The model list and availability can adjust dynamically based on upstream status and cost factors." : "* 模型列表可能随上游状态和成本变化调整。"}
        </div>
      </section>

      {/* ───── Pricing Section (Section 6) ───── */}
      <section
        id="pricing"
        style={{
          padding: "80px 24px",
          background: "#ffffff",
          borderTop: "1px solid #eaeaea",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              {isEn ? "Low-cost CDK Packages" : "低价兑换码"}
            </h2>
            <p style={{ fontSize: 16, color: "#666666", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              {isEn
                ? "CDK purchases can be redeemed in the console for platform quota. Multi-model consumption rates are listed in the console."
                : "购买兑换码后，可在控制台兑换为平台调用额度。不同模型会按不同价格倍率消耗，具体以控制台显示为准。"}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {plans.map((plan) => {
              const isHighlighted = plan.id === "standard";
              return (
                <div
                  key={plan.id}
                  className="vercel-card"
                  style={{
                    padding: 0,
                    position: "relative",
                    border: isHighlighted ? "2px solid #0a0a0a" : undefined,
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {/* Recommended badge */}
                  {isHighlighted && plan.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)",
                        background: "#0a0a0a",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 16px",
                        borderRadius: "999px",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ padding: "40px 32px 32px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
                      {plan.name}
                    </h3>

                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                        {plan.priceText}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600, marginBottom: 16 }}>
                      {plan.credit}
                    </div>

                    <div style={{ fontSize: 13, color: "#666666", marginBottom: 24, minHeight: 36, lineHeight: 1.4 }}>
                      {plan.bestFor}
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flexGrow: 1 }}>
                      {plan.features.map((f: string, i: number) => (
                        <li
                           key={i}
                           style={{
                             display: "flex",
                             alignItems: "center",
                             gap: 10,
                             padding: "8px 0",
                             fontSize: 13,
                             color: "#444",
                             borderBottom: i < plan.features.length - 1 ? "1px solid #f5f5f5" : "none",
                           }}
                        >
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: isHighlighted ? "#0a0a0a" : "#f5f5f5",
                              color: isHighlighted ? "#fff" : "#22c55e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleBuy(plan)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "12px 0",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: isHighlighted ? "none" : "1px solid #eaeaea",
                        background: isHighlighted ? "#0a0a0a" : "transparent",
                        color: isHighlighted ? "#ffffff" : "#666666",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isHighlighted) {
                          e.currentTarget.style.borderColor = "#0a0a0a";
                          e.currentTarget.style.color = "#0a0a0a";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isHighlighted) {
                          e.currentTarget.style.borderColor = "#eaeaea";
                          e.currentTarget.style.color = "#666666";
                        }
                      }}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ───── 3-Minute Quick Start (Section 9) ───── */}
      <section
        id="quick-start"
        style={{
          padding: "80px 24px",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            {isEn ? "3-Minute Quick Start" : "3 分钟接入流程"}
          </h2>
          <p style={{ fontSize: 16, color: "#666666", margin: 0 }}>
            {isEn ? "Redeem your quota and start calling in minutes." : "买完兑换码后，按下面步骤即可完成接入。"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 32 }}>
          {/* Column 1: 5 Steps as individual cards with nice progress layout */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: 0 }}>
            {quickStartSteps.map((step, idx) => (
              <div
                key={idx}
                className="vercel-card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  margin: 0,
                  transition: "all 0.2s ease",
                  background: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0a0a0a";
                  e.currentTarget.style.transform = "translateX(6px)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#eaeaea";
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "#0a0a0a",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                    {step.title.replace(/^\d+\.\s*/, "")}
                  </h4>
                  <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Credentials and sample code */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Unified Configuration Card */}
            <div className="vercel-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Base URL Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Base URL
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #eaeaea", borderRadius: "6px", padding: "10px 14px", fontFamily: "monospace", fontSize: 13, color: "#0f172a", wordBreak: "break-all" }}>
                    https://api.cheng-zi-ai.com/v1
                  </div>
                  <button
                    onClick={() => copyText("https://api.cheng-zi-ai.com/v1", "base_url")}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "6px",
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "#333",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copiedStates["base_url"] ? (isEn ? "Copied" : "已复制") : (isEn ? "Copy" : "复制")}
                  </button>
                </div>
              </div>

              <div style={{ height: "1px", background: "#eaeaea" }} />

              {/* API Key Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  API Key
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                  {isEn ? "Create and copy your API Key inside the console." : "在控制台创建并复制你的 API Key"}
                </div>
                <div style={{ marginTop: 4 }}>
                  <a
                    href={CONSOLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vercel-button-secondary"
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      borderRadius: "6px",
                    }}
                  >
                    {isEn ? "Go to Console & Create Key" : "前往控制台创建 Key"}
                  </a>
                </div>
              </div>
            </div>

            {/* curl example block */}
            <div className="vercel-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  padding: "12px 20px",
                  background: "#fafafa",
                  borderBottom: "1px solid #eaeaea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
                  <span style={{ marginLeft: 12, fontSize: 13, color: "#999", fontWeight: 500 }}>
                    curl_test.sh
                  </span>
                </div>
                <button
                  onClick={() => copyText(curlExampleCode, "curl")}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  {copiedStates["curl"] ? (isEn ? "Copied" : "已复制") : (isEn ? "Copy Code" : "复制代码")}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "24px",
                  background: "#0a0a0a",
                  color: "#e5e5e5",
                  fontSize: 13,
                  lineHeight: 1.8,
                  overflowX: "auto",
                  fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
                  flex: 1,
                }}
              >
                <code>
                  <span style={{ color: "#6b7280" }}># Send a simple completion request</span>
                  {"\n\n"}
                  <span style={{ color: "#c084fc" }}>curl</span>
                  {" "}
                  <span style={{ color: "#a78bfa" }}>-X POST</span>
                  {" "}
                  <span style={{ color: "#34d399" }}>&quot;https://api.cheng-zi-ai.com/v1/chat/completions&quot;</span>
                  {" \\\n  "}
                  <span style={{ color: "#a78bfa" }}>-H</span>
                  {" "}
                  <span style={{ color: "#34d399" }}>&quot;Content-Type: application/json&quot;</span>
                  {" \\\n  "}
                  <span style={{ color: "#a78bfa" }}>-H</span>
                  {" "}
                  <span style={{ color: "#34d399" }}>&quot;Authorization: Bearer sk-your-api-key&quot;</span>
                  {" \\\n  "}
                  <span style={{ color: "#a78bfa" }}>-d</span>
                  {" "}
                  <span style={{ color: "#34d399" }}>&apos;{"{"}</span>
                  {"\n    "}
                  <span style={{ color: "#93c5fd" }}>&quot;model&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>: </span>
                  <span style={{ color: "#34d399" }}>&quot;gpt-5.5&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>,</span>
                  {"\n    "}
                  <span style={{ color: "#93c5fd" }}>&quot;messages&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>: [{"{"}</span>
                  <span style={{ color: "#93c5fd" }}>&quot;role&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>: </span>
                  <span style={{ color: "#34d399" }}>&quot;user&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>, </span>
                  <span style={{ color: "#93c5fd" }}>&quot;content&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>: </span>
                  <span style={{ color: "#34d399" }}>&quot;Hello!&quot;</span>
                  <span style={{ color: "#e5e5e5" }}>{"}"}]</span>
                  {"\n  "}
                  <span style={{ color: "#34d399" }}>{"}"}&apos;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>


      {/* ───── Suitable/Not Suitable (Section 11) ───── */}
      <section
        id="fit"
        style={{
          padding: "80px 24px",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
            {isEn ? "Is this service right for you?" : "适合谁使用？"}
          </h2>
        </div>

        <div className="fit-grid">
          {/* Suitable */}
          <div className="vercel-card" style={{ padding: "32px", borderColor: "#bbf7d0", background: "rgba(240, 253, 244, 0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#16a34a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              ✓ {fitData.suitable.title}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {fitData.suitable.items.map((item, i) => (
                <li key={i} style={{ fontSize: 14, color: "#374151", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Unsuitable */}
          <div className="vercel-card" style={{ padding: "32px", borderColor: "#e5e7eb", background: "#fafafa" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#6b7280", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              ✗ {fitData.unsuitable.title}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {fitData.unsuitable.items.map((item, i) => (
                <li key={i} style={{ fontSize: 14, color: "#6b7280", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "#9ca3af", fontWeight: "bold" }}>-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── FAQ Accordion (Section 12) ───── */}
      <section
        id="faq"
        style={{
          padding: "80px 24px",
          background: "#ffffff",
          borderTop: "1px solid #eaeaea",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {isEn ? "FAQ" : "常见问题"}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40 }}>
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "20px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#111827", paddingRight: 12 }}>
                      {item.question}
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        color: "#999",
                        transition: "transform 0.2s",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        paddingBottom: 20,
                        fontSize: 14,
                        color: "#666",
                        lineHeight: 1.8,
                      }}
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Footer (Section 15) ───── */}
      <footer style={{ borderTop: "1px solid #eaeaea", padding: "40px 24px 100px", textAlign: "center", color: "#666", fontSize: 14 }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <Link href={`/${lang}`} style={{ color: "#666", textDecoration: "none", fontWeight: 500 }}>
              {t.footer.backToHome}
            </Link>
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#666", textDecoration: "none", fontWeight: 500 }}
            >
              {t.nav.console}
            </a>
          </div>
          <div style={{ maxWidth: 800, margin: "12px auto 0", fontSize: 12, color: "#999", lineHeight: 1.6 }}>
            {t.footer.disclaimer}
          </div>
          <div style={{ marginTop: 8 }}>© {new Date().getFullYear()} {t.footer.copyright}</div>
        </div>
      </footer>

      {/* ───── Purchase & Checkout Modal (Section 7) ───── */}
      {isPurchaseModalOpen && selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: 460, borderRadius: "12px", padding: 28, position: "relative", border: "1px solid #eaeaea", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setIsPurchaseModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#999999", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            
            {/* Step 1: Confirmation Screen */}
            {purchaseStep === "confirm" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111827" }}>
                  {isEn ? "You are purchasing:" : "你将购买："} {selectedPlan.name}
                </h3>
                <div style={{ background: "#f9fafb", padding: "16px 20px", borderRadius: "8px", border: "1px solid #eaeaea", marginBottom: 24 }}>
                  <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                    {isEn ? "Quota: " : "到手额度："}{selectedPlan.credit}
                  </div>
                  <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 10, lineHeight: 1.5 }}>
                    <strong>{isEn ? "How to use: " : "使用方式："}</strong>
                    {isEn ? "Get redeem code after payment, redeem inside the console." : "付款后获得兑换码，在控制台兑换为平台调用额度。"}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>
                    <strong>{isEn ? "Refund policy: " : "退款提示："}</strong>
                    {isEn ? "Unused CDK is eligible for refund. Redeemed or consumed quota cannot be refunded." : "兑换码未使用可申请退款；已兑换或已产生调用消耗的额度不支持无理由退款。"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
                  <button onClick={confirmBuy} className="vercel-button" style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    {isEn ? "Confirm Purchase" : "确认购买"}
                  </button>
                  <button 
                    onClick={() => { setIsPurchaseModalOpen(false); scrollTo("quick-start"); }}
                    className="vercel-button-secondary"
                    style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  >
                    {isEn ? "Read Tutorial First" : "先看接入流程"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Screen */}
            {purchaseStep === "pay" && (
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111827", textAlign: "left" }}>
                  {isEn ? "PayPal Payment" : "支付宝付款"}
                </h3>
                
                {isEn ? (
                  <>
                    <div style={{ background: "#f0f5ff", border: "1px solid #1677ff", borderRadius: "8px", padding: "16px", marginBottom: 20 }}>
                      <p style={{ margin: "0 0 10px", fontSize: 14, color: "#111827", textAlign: "left" }}>
                        Please send <strong style={{ color: "#1677ff" }}>${selectedPlan.priceUsd}</strong> to PayPal account:
                      </p>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1677ff", wordBreak: "break-all", userSelect: "all", textAlign: "center" }}>
                        CHENGZIAI2026@163.COM
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 20, textAlign: "left", lineHeight: 1.5 }}>
                      Please complete the payment via PayPal. After payment, submit your email. We will send the redemption code after manually confirming the payment.
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12, textAlign: "left" }}>
                      请使用支付宝扫码支付（金额：<strong style={{ color: "#ff5a00" }}>{selectedPlan.priceText}</strong>）
                    </div>
                    <div style={{ width: 160, height: 160, margin: "0 auto 16px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img 
                        src="/images/alipay.jpg" 
                        alt="Alipay QR Code" 
                        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                      />
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 16, textAlign: "left", lineHeight: 1.5 }}>
                      付款后填写邮箱并提交订单信息，我们会在人工核对收款后发送兑换码。
                    </div>
                  </>
                )}

                <div style={{ borderTop: "1px dashed #eaeaea", paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, textAlign: "left" }}>
                    {isEn ? "Confirm Your Email Address" : "填写您的接收邮箱"}
                  </div>
                  <input 
                    type="email" 
                    placeholder={isEn ? "you@example.com (To receive code)" : "you@example.com (支付后用于收取兑换码)"} 
                    value={email} 
                    onChange={e => { setEmail(e.target.value); if(emailErr) setEmailErr(""); }} 
                    style={{ width: "100%", padding: "10px 12px", border: emailErr ? "1px solid #e00000" : "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} 
                  />
                  {emailErr && <div style={{ color: "#e00000", fontSize: 12, marginTop: 6, textAlign: "left" }}>{emailErr}</div>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, textAlign: "left" }}>
                    {isEn ? "Contact / Note (Optional)" : "联系方式 / 备注 (选填)"}
                  </div>
                  <input 
                    type="text" 
                    placeholder={isEn ? "WeChat, QQ, or note" : "如微信号、QQ或付款备注"} 
                    value={contact} 
                    onChange={e => setContact(e.target.value)} 
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }} 
                  />
                </div>

                <button 
                  onClick={submitOrder} 
                  disabled={isSubmitting}
                  className="vercel-button" 
                  style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (isEn ? "Notifying..." : "正在通知...") : (isEn ? "I have paid, notify support" : "已完成支付，通知客服")}
                </button>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {purchaseStep === "success" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ width: 54, height: 54, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, margin: "0 auto 16px" }}>
                  ✓
                </div>
                <h4 style={{ fontSize: 18, color: "#111827", margin: "0 0 12px", fontWeight: 700 }}>
                  {isEn ? "Order Submitted" : "订单提交成功"}
                </h4>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20, textAlign: "left" }}>
                  {isEn 
                    ? "Order submitted. We will send the redemption code to your email after manually confirming the payment." 
                    : "订单已提交。我们会在核对收款后，将兑换码发送到你的邮箱。"}
                  <br/>
                  {isEn ? "Email: " : "接收邮箱："}<strong>{email}</strong>
                </p>
                <div style={{ background: "#fafafa", padding: "12px", borderRadius: "8px", fontSize: 12, color: "#666", lineHeight: 1.4, textAlign: "left" }}>
                  {isEn 
                    ? "If you do not receive it within 30 minutes, please contact: " 
                    : "如果 30 分钟内未收到，请联系客服："}
                  <a href="mailto:chengziai2026@163.com" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>chengziai2026@163.com</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───── Support Modal (Section 14) ───── */}
      {isSupportModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: 380, borderRadius: "12px", padding: 28, position: "relative", border: "1px solid #eaeaea", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setIsSupportModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#999999", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111827", textAlign: "center" }}>
              {isEn ? "Need Help?" : "需要协助？"}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", color: "#4b5563", fontSize: 13, textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>• {isEn ? "Pre-purchase consulting" : "购买前咨询"}</li>
              <li>• {isEn ? "CDK redemption assistance" : "兑换码不会使用"}</li>
              <li>• {isEn ? "Cursor / Cline configuration failure" : "Cursor / Cline 配置失败"}</li>
              <li>• {isEn ? "API exceptions or deduction errors" : "调用异常或扣费问题"}</li>
            </ul>
            <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #eaeaea", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "#666" }}>{isEn ? "Support Email" : "客服邮箱"}</span>
              <a href="mailto:chengziai2026@163.com" style={{ display: "block", color: "#2563eb", fontWeight: 700, fontSize: 15, marginTop: 6, textDecoration: "none" }}>
                chengziai2026@163.com
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ───── Mobile Bottom Sticky CTA (Section 13) ───── */}
      <div
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #eaeaea",
          padding: "12px 24px",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 40,
        }}
      >
        <div style={{ color: "#111827", fontWeight: 700 }}>
          {isEn ? (
            <span style={{ fontSize: 13, color: "#111827", fontWeight: 700 }}>
              $100 credit
            </span>
          ) : (
            <>
              ¥100 <span style={{ fontSize: 11, color: "#666", fontWeight: 400, marginLeft: 2 }}>起</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => scrollTo("quick-start")}
            style={{
              background: "transparent",
              color: "#333333",
              border: "1px solid #eaeaea",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEn ? "Setup Guide" : "接入教程"}
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            style={{
              background: "#0a0a0a",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEn ? "Buy Credit Code" : "购买充值码"}
          </button>
        </div>
      </div>

      {/* ───── Floating Support (Desktop) (Section 14) ───── */}
      <button 
        className="hide-on-mobile"
        onClick={() => setIsSupportModalOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#ffffff",
          color: "#0a0a0a",
          border: "1px solid #eaeaea",
          padding: "12px 20px",
          borderRadius: "999px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 40,
        }}
      >
        💬 {isEn ? "Support" : "联系客服"}
      </button>

      {/* Responsive adjustments (Section 18) */}
      <style>{`
        .desktop-flex { display: flex !important; }
        .desktop-only { display: block !important; }
        .mobile-only { display: none !important; }
        .mobile-flex { display: none !important; }
        .fit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        @media (max-width: 768px) {
          .desktop-flex { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .mobile-flex { display: flex !important; }
          .fit-grid { grid-template-columns: 1fr !important; gap: 16px; }
        }
      `}</style>
    </div>
  );
}
