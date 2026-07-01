"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const CONSOLE_URL = "https://api.cheng-zi-ai.com";

const normalizeReferralCode = (value?: string | null) => {
  const code = (value || "").trim();
  if (!code) return "";
  return /^[a-zA-Z0-9_-]{2,80}$/.test(code) ? code : "";
};

const MODELS = [
  { name: "gpt-5.5", provider: "openai" },
  { name: "gpt-image-2", provider: "openai" },
  { name: "gpt-5.4", provider: "openai" },
  { name: "gpt-5.4-mini", provider: "openai" },
  { name: "gpt-5.3-codex", provider: "openai" },
  { name: "codex-auto-review", provider: "openai" },
  { name: "claude-opus-4-8", provider: "claude" },
  { name: "claude-sonnet-4-6", provider: "claude" },
  { name: "claude-opus-4-7", provider: "claude" },
  { name: "claude-opus-4-6", provider: "claude" },
  { name: "claude-haiku-4-5-20251001", provider: "claude" },
  { name: "gemini-3.1-pro-high", provider: "gemini" },
  { name: "gemini-3.1-pro-low", provider: "gemini" },
  { name: "gemini-3.1-pro-preview-customtools", provider: "gemini" },
  { name: "gemini-3.5-flash", provider: "gemini" },
  { name: "gemini-3.5-flash-low", provider: "gemini" },
];

const PROVIDER_META: Record<string, { mark: string; logo: string; featured: string[] }> = {
  openai: { mark: "AI", logo: "OpenAI", featured: ["gpt-5.5", "gpt-image-2"] },
  claude: { mark: "C", logo: "Claude", featured: ["claude-opus-4-8"] },
  gemini: { mark: "G", logo: "Gemini", featured: ["gemini-3.1-pro-high"] },
};

const getPlans = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      id: "plan_100",
      name: isEn ? "Basic Credit Code" : "基础充值码",
      priceText: isEn ? "$14" : "¥100",
      priceValue: 100,
      priceUsd: 14,
      credit: isEn ? "Get $100 platform credit" : "$100 平台计价额度",
      badge: isEn ? "Recommended" : "推荐",
      bestFor: isEn ? "For individual developers, AI client testing, and lightweight usage." : "适合：个人开发者、AI 客户端测试、Cursor / Cline / ChatBox 轻量使用",
      features: isEn
        ? ["Mainstream models available", "Self-service top-up in console", "Usage logs view", "Basic community support"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量记录查看", "社群基础支持"],
      buttonText: isEn ? "Pay $14 · Get $100 Credit" : "购买 ¥100 充值码",
    },
    {
      id: "plan_300",
      name: isEn ? "Pro Credit Code" : "大额充值码",
      priceText: isEn ? "$42" : "¥300",
      priceValue: 300,
      priceUsd: 42,
      credit: isEn ? "Get $300 platform credit" : "$300 平台计价额度",
      badge: "",
      bestFor: isEn ? "For frequent usage, AI coding, multi-model testing, and small team usage." : "适合：高频使用、AI Coding、多模型测试、小团队轻量共用",
      features: isEn
        ? ["Mainstream models available", "Self-service top-up in console", "Usage statistics dashboard", "Peak-time priority routing", "1v1 Setup assistance"]
        : ["主流模型可用", "支持控制台自助兑换", "支持用量统计", "高峰期优先处理", "1v1 配置协助"],
      buttonText: isEn ? "Pay $42 · Get $300 Credit" : "购买 ¥300 充值码",
    },
    {
      id: "plan_bulk",
      name: isEn ? "Bulk Subscription" : "大额订阅",
      priceText: isEn ? "Custom" : "定制折扣",
      priceValue: 0,
      priceUsd: 0,
      credit: isEn ? "Bulk credit / recurring usage" : "大额额度 / 长期订阅",
      badge: isEn ? "Lower discount available" : "可谈更低折扣",
      bestFor: isEn ? "For stable monthly usage, team usage, or larger Claude / Codex consumption." : "适合：稳定月用量、团队共用、Claude / Codex 大额消耗",
      features: isEn
        ? ["Lower rate for larger usage", "Monthly or one-time bulk credit", "Model and client setup assistance", "Manual quote based on usage"]
        : ["大额用量可谈更低折扣", "支持月度订阅或一次性大额", "协助确认模型和客户端配置", "按实际用量人工报价"],
      buttonText: isEn ? "Talk to Support" : "联系客服谈折扣",
      contactOnly: true,
    },
  ];
};

type ApiPlan = ReturnType<typeof getPlans>[number];

type ApiServiceDictionary = {
  header: { title: string };
  apiService: {
    nav: Record<"home" | "pricing" | "models" | "tutorial" | "faq" | "console", string>;
    hero: Record<"title" | "subtitle" | "description" | "ctaBuy" | "ctaTutorial", string>;
    models: Record<"title" | "subtitle" | "available", string>;
    footer: Record<"backToHome" | "disclaimer" | "copyright", string>;
  };
};

const getModelGroups = (lang: string) => {
  const isEn = lang === "en";
  return ["openai", "claude", "gemini"].map((provider) => {
    const meta = PROVIDER_META[provider];
    const title =
      provider === "openai"
        ? isEn ? "OpenAI-format models" : "OpenAI 格式模型"
        : provider === "claude"
          ? isEn ? "Claude series models" : "Claude 系列模型"
          : isEn ? "Gemini series models" : "Gemini 系列模型";

    const desc =
      provider === "openai"
        ? isEn
          ? "For text, coding, image generation, and OpenAI-compatible clients."
          : "支持文本、代码、图像生成和 OpenAI 兼容客户端。"
        : provider === "claude"
          ? isEn
            ? "For Claude Code, advanced coding, writing, and long-document analysis."
            : "支持 Claude Code、高阶代码、写作和长文档分析。"
          : isEn
            ? "For long context, multimodal work, and cost-sensitive calls."
            : "适合长上下文、多模态和成本敏感调用场景。";

    return {
      provider,
      logoMark: meta.mark,
      logoText: meta.logo,
      title,
      desc,
      featuredModels: meta.featured,
      models: MODELS.filter((model) => model.provider === provider).map((model) => model.name),
    };
  });
};

const getSetupFlow = (lang: string) => {
  const isEn = lang === "en";
  return [
    {
      title: isEn ? "Buy credit" : "购买额度",
      desc: isEn ? "Choose a credit code or contact support for bulk discounts." : "选择充值码；大额长期用量可以联系客服谈折扣。",
    },
    {
      title: isEn ? "Redeem in console" : "控制台兑换",
      desc: isEn ? "Redeem the code to platform credit inside the console." : "在控制台兑换为平台额度，余额和日志都能查看。",
    },
    {
      title: isEn ? "Create API Key" : "创建 API Key",
      desc: isEn ? "Create a key and select the models you want to allow." : "创建 Key 时勾选需要开放的模型。",
    },
    {
      title: isEn ? "Fill into client" : "填入客户端",
      desc: isEn ? "Use /v1 for OpenAI-compatible clients; Claude Code uses a different base URL." : "OpenAI 兼容客户端用 /v1；Claude Code 走单独配置。",
    },
  ];
};


const getClientGuideData = (lang: string) => {
  const isEn = lang === "en";
  const keyPlaceholder = isEn ? "sk-your-api-key" : "sk-你的API_KEY";
  const claudePowerShell = `$env:ANTHROPIC_AUTH_TOKEN="${keyPlaceholder}"
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
$env:ANTHROPIC_BASE_URL="https://api.cheng-zi-ai.com"
$env:ANTHROPIC_MODEL="claude-opus-4-8"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5-20251001"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-6"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-8"
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"

claude -p "Reply with exactly: OK" --model claude-opus-4-8`;
  const claudeSettings = `{
  "model": "claude-opus-4-8",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.cheng-zi-ai.com",
    "ANTHROPIC_AUTH_TOKEN": "${keyPlaceholder}",
    "ANTHROPIC_MODEL": "claude-opus-4-8",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5-20251001",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-8",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}`;
  const codexPowerShell = `$env:OPENAI_API_KEY="${keyPlaceholder}"`;
  const codexConfig = `model = "gpt-5.3-codex"
openai_base_url = "https://api.cheng-zi-ai.com/v1"`;

  return {
    cards: [
      {
        label: "Claude Code",
        title: isEn ? "Claude Code configuration" : "Claude Code 配置",
        endpoint: "https://api.cheng-zi-ai.com",
        note: isEn
          ? "Critical: Base URL has no /v1, use ANTHROPIC_AUTH_TOKEN, and remove ANTHROPIC_API_KEY if it was set before."
          : "关键：Base URL 不加 /v1；密钥用 ANTHROPIC_AUTH_TOKEN；如果以前设置过 ANTHROPIC_API_KEY，要先删掉。",
        steps: [
          ["Base URL", "https://api.cheng-zi-ai.com"],
          [isEn ? "Token variable" : "密钥变量", "ANTHROPIC_AUTH_TOKEN"],
          [isEn ? "Recommended model" : "推荐模型", "claude-opus-4-8"],
        ],
        blocks: [
          { title: isEn ? "PowerShell temporary setup" : "PowerShell 临时配置", code: claudePowerShell },
          { title: "%USERPROFILE%\\.claude\\settings.json", code: claudeSettings },
        ],
      },
      {
        label: "Codex",
        title: isEn ? "Codex configuration" : "Codex 配置",
        endpoint: "https://api.cheng-zi-ai.com/v1",
        note: isEn
          ? "Critical: Codex uses OpenAI-compatible routing, so the Base URL must include /v1."
          : "关键：Codex 走 OpenAI 兼容路由，所以 Base URL 必须带 /v1。",
        steps: [
          ["Base URL", "https://api.cheng-zi-ai.com/v1"],
          [isEn ? "Key variable" : "密钥变量", "OPENAI_API_KEY"],
          [isEn ? "Recommended model" : "推荐模型", "gpt-5.3-codex / codex-auto-review"],
        ],
        blocks: [
          { title: isEn ? "PowerShell environment" : "PowerShell 环境变量", code: codexPowerShell },
          { title: isEn ? "%USERPROFILE%\\.codex\\config.toml" : "%USERPROFILE%\\.codex\\config.toml", code: codexConfig },
        ],
      },
    ],
  };
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
        : "更适合个人开发者、小团队测试、AI 客户端配置和轻量使用。不建议用于企业正式生产、高并发核心业务、医疗、金融、法律等高风险场景。"
    }
  ];
};

export default function ApiServiceClientPage({ dict, lang }: { dict: ApiServiceDictionary; lang: string }) {
  const t = dict.apiService;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEn = lang === "en";

  const plans = getPlans(lang);
  const modelGroups = getModelGroups(lang);
  const clientGuideData = getClientGuideData(lang);
  const setupFlow = getSetupFlow(lang);
  const faqItems = getFaqItems(lang);

  // UI States
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<"confirm" | "pay" | "success">("confirm");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [activeInviteCode, setActiveInviteCode] = useState("");
  const [isReferralCardClosed, setIsReferralCardClosed] = useState(false);

  useEffect(() => {
    const incomingCode = normalizeReferralCode(
      searchParams.get("aff") || searchParams.get("ref") || searchParams.get("refCode")
    );

    if (incomingCode) {
      queueMicrotask(() => {
        setReferralCode(incomingCode);
        setActiveInviteCode(incomingCode);
      });
      return;
    }

    queueMicrotask(() => {
      setReferralCode("");
      setActiveInviteCode("");
    });
  }, [searchParams]);

  const registerUrl = activeInviteCode
    ? `${CONSOLE_URL}/register?aff=${encodeURIComponent(activeInviteCode)}`
    : `${CONSOLE_URL}/register`;

  const referralCardUrl = `/${lang}/referral-card`;

  const switchLang = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(activeInviteCode ? `${newPath}?aff=${encodeURIComponent(activeInviteCode)}` : newPath);
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

  const handleBuy = (plan: ApiPlan) => {
    setSelectedPlan(plan);
    setEmail("");
    setEmailErr("");
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
          refCode: referralCode || undefined,
          refSource: referralCode ? "api-invite" : undefined
        })
      });
      if (res.ok) {
        setPurchaseStep("success");
      } else {
        alert(isEn ? "Submission failed, please try again." : "提交订单失败，请稍后重试");
      }
    } catch {
      alert(isEn ? "Submission failed, please try again." : "提交订单失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            height: "60px",
          }}
        >
          {/* Logo & Brand */}
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
            <Image
              src={lang === 'zh' ? '/images/logo-zh.png' : '/images/logo-en.png'}
              alt={dict.header.title}
              width={lang === 'zh' ? 1309 : 1392}
              height={lang === 'zh' ? 329 : 283}
              style={{ height: 27, width: 'auto', display: "block" }}
            />
          </Link>

          {/* Desktop Nav Items */}
          <div className="desktop-flex" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontWeight: 500, minWidth: 0, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 2, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <Link href={`/${lang}`} className="nav-link" style={{ textDecoration: "none" }}>
              {t.nav.home}
            </Link>
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
        className="api-hero-section"
        style={{
          background: "#fafafa",
          color: "#111827",
          padding: "max(22px, 4vw) 18px max(44px, 7vw)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "none",
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
            background: "transparent",
            pointerEvents: "none",
          }}
        />

        <div className="api-hero-shell" style={{ maxWidth: 1120, margin: "0 auto", textAlign: "left", position: "relative", zIndex: 1, background: "#ffffff", border: "1px solid #eaeaea", borderRadius: 28, padding: "clamp(34px, 5vw, 56px)", boxShadow: "0 18px 60px rgba(0,0,0,0.05)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              border: "1px solid #eaeaea",
              borderRadius: "999px",
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 16,
              background: "#ffffff",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff6a00", display: "inline-block" }} />
            OpenAI / Claude / Gemini
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              border: "1px solid #eaeaea",
              borderRadius: "999px",
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 32,
              marginLeft: 12,
              background: "#ffffff",
            }}
          >
            OpenAI {isEn ? "Compatible" : "格式兼容"}
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 54px)",
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
              color: "#333333",
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
              color: "#666666",
              maxWidth: 680,
              margin: "0 0 40px",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {t.hero.description}
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "flex-start", flexWrap: "wrap", marginBottom: 32 }}>
            <button
              onClick={() => scrollTo("pricing")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 22px rgba(255,106,0,0.18)";
                e.currentTarget.style.background = "#ff6a00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.background = "#111827";
              }}
            >
              {t.hero.ctaBuy}
              <span style={{ fontSize: 18 }}>→</span>
            </button>
            <button
              onClick={() => scrollTo("client-guides")}
              style={{
                padding: "14px 32px",
                background: "transparent",
                color: "#111827",
                border: "1px solid #eaeaea",
                borderRadius: "8px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "#ff6a00";
                e.currentTarget.style.color = "#ff6a00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#eaeaea";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#111827";
              }}
            >
              {t.hero.ctaTutorial}
            </button>
          </div>

          {/* Small Trust Badges */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-start", flexWrap: "wrap" }}>
            {["¥100 起试用", "Claude Code 可用", "大额订阅可谈"].map((tagZh, i) => {
              const tagEn = ["From $14", "Claude Code ready", "Bulk discount available"][i];
              return (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "#666666",
                    background: "#fafafa",
                    border: "1px solid #eaeaea",
                    padding: "6px 14px",
                    borderRadius: "999px",
                  }}
                >
                  {isEn ? tagEn : tagZh}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="mobile-only"
        style={{
          display: "none",
          padding: "0 12px 28px",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#111827",
            color: "#ffffff",
            borderRadius: 18,
            padding: "18px 16px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginBottom: 6, fontWeight: 700 }}>
            {activeInviteCode
              ? isEn ? "Invite offer locked" : "邀请福利已锁定"
              : isEn ? "Referral rewards" : "邀请好友赚奖励"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.35, marginBottom: 12 }}>
            {activeInviteCode
              ? isEn ? "New users can claim $10 API credit." : "新用户通过邀请注册，可领取 $10 API 体验额度。"
              : isEn ? "Invite friends: they get $10, you get $3." : "邀请好友注册，好友得 $10，你最高得 ¥20。"}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, marginBottom: 16 }}>
            {activeInviteCode
              ? isEn ? `Invite code: ${activeInviteCode}. After the first $100 top-up, the inviter gets a $3 reward.` : `邀请码：${activeInviteCode}。首充满 ¥100 后，邀请人获得 ¥20 奖励。`
              : isEn ? "Log in to the console, copy your invite link from Wallet, then make a share card." : "登录控制台，在钱包管理复制邀请链接，再生成推广卡片分享。"}
          </div>
          {activeInviteCode ? (
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "#ffffff",
                color: "#111827",
                textDecoration: "none",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {isEn ? "New user: claim $10" : "新用户领取 $10"}
            </a>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <a
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "#111827",
                  textDecoration: "none",
                  borderRadius: 12,
                  padding: "12px 10px",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                {isEn ? "Open console" : "去后台复制"}
              </a>
              <Link
                href={referralCardUrl}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.18)",
                  textDecoration: "none",
                  borderRadius: 12,
                  padding: "12px 10px",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                {isEn ? "Make card" : "生成卡片"}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───── Pricing Section (Section 5) ───── */}
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
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              {isEn ? "Credit Codes & Bulk Discounts" : "兑换码与大额折扣"}
            </h2>
            <p style={{ fontSize: 16, color: "#666666", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              {isEn
                ? "Buy a credit code for quick top-up, or contact support for a lower rate when you have larger recurring usage."
                : "轻量使用直接购买兑换码；如果是长期稳定用量或团队用量，可以联系客服聊更低的大额折扣。"}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {plans.map((plan) => {
              const isHighlighted = plan.id === "plan_100";
              const isContactOnly = "contactOnly" in plan && plan.contactOnly;
              return (
                <div
                  key={plan.id}
                  className="vercel-card"
                  style={{
                    padding: 0,
                    position: "relative",
                    border: isHighlighted ? "1px solid #111827" : isContactOnly ? "1px solid #d4d4d8" : "1px solid #eaeaea",
                    background: isContactOnly ? "#fafafa" : "#ffffff",
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
                  {isHighlighted && plan.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)",
                        background: "#111827",
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
                    <div style={{ minHeight: 54, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
                        {plan.name}
                      </h3>
                      {!isHighlighted && plan.badge && (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#ffffff", color: "#111827", fontSize: 12, fontWeight: 700 }}>
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                        {plan.priceText}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: "#111827", fontWeight: 700, marginBottom: 16 }}>
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
                              background: isHighlighted ? "#111827" : isContactOnly ? "#ffffff" : "#f5f5f5",
                              color: isHighlighted ? "#fff" : "#111827",
                              border: isContactOnly ? "1px solid #d4d4d8" : "none",
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
                      onClick={() => {
                        if (isContactOnly) {
                          setIsSupportModalOpen(true);
                          return;
                        }
                        handleBuy(plan);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "12px 0",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: isHighlighted ? "none" : "1px solid #d4d4d8",
                        background: isHighlighted ? "#111827" : "transparent",
                        color: isHighlighted ? "#ffffff" : "#111827",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isHighlighted) {
                          e.currentTarget.style.borderColor = "#ff6a00";
                          e.currentTarget.style.color = "#ff6a00";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isHighlighted) {
                          e.currentTarget.style.borderColor = "#d4d4d8";
                          e.currentTarget.style.color = "#111827";
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

      {/* ───── Available Models (Section 5) ───── */}
      <section id="models" style={{ padding: "80px 24px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
            }}
          >
            {t.models.title}
          </h2>
          <p style={{ fontSize: 16, color: "#666666", margin: 0, lineHeight: 1.7 }}>
            {t.models.subtitle}
          </p>
        </div>

        <div className="featured-model-grid">
          {modelGroups.map((group) => (
            <div
              key={group.provider}
              className="vercel-card featured-model-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 28,
                position: "relative",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  border: "1px solid #22c55e",
                  color: "#16a34a",
                  padding: "3px 9px",
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#ffffff",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                {t.models.available}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingRight: 76 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #eaeaea",
                    background: "#fafafa",
                    color: "#111827",
                    fontSize: 13,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {group.logoMark}
                </span>
                <span style={{ color: "#111827", fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em" }}>
                  {group.logoText}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 12px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.025em",
                }}
              >
                {group.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#666666",
                  margin: "0 0 22px",
                  lineHeight: 1.65,
                  minHeight: 68,
                }}
              >
                {group.desc}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignContent: "flex-start" }}>
                {group.models.map((modelName) => {
                  const isFeatured = group.featuredModels.includes(modelName);
                  return (
                    <span
                      key={modelName}
                      style={{
                        padding: isFeatured ? "6px 11px" : "5px 10px",
                        background: isFeatured ? "#111827" : "#fafafa",
                        border: isFeatured ? "1px solid #111827" : "1px solid #eaeaea",
                        borderRadius: "999px",
                        fontSize: 12,
                        color: isFeatured ? "#ffffff" : "#666666",
                        fontWeight: isFeatured ? 850 : 550,
                        fontFamily: "monospace",
                        cursor: "default",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {isFeatured && (
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
                      )}
                      {modelName}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "#999999" }}>
          {isEn ? "* The model list and availability can adjust dynamically based on upstream status and cost factors." : "* 模型列表可能随上游状态和成本变化调整。"}
        </div>
      </section>

      {/* ───── 3-Minute Quick Start (Section 9) ───── */}
      <section
        id="quick-start"
        style={{
          padding: "80px 24px",
          background: "#ffffff",
          borderTop: "1px solid #eaeaea",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 36, alignItems: "end", marginBottom: 36 }}>
            <div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.04em",
                  margin: "0 0 12px",
                }}
              >
                {isEn ? "3-minute setup, no detours" : "3 分钟接入，不绕路"}
              </h2>
              <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.7, margin: 0 }}>
                {isEn
                  ? "Buy credit, redeem it, create a key, then fill the right Base URL into your client."
                  : "买额度、兑换、创建 Key、填入客户端。真正要做的事情就这四步。"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <a
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vercel-button"
                style={{ padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none" }}
              >
                {isEn ? "Open Console" : "打开控制台"}
              </a>
              <button
                onClick={() => scrollTo("client-guides")}
                style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #d4d4d8", background: "#ffffff", color: "#111827", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
              >
                {isEn ? "Client details" : "看客户端配置"}
              </button>
            </div>
          </div>

          <div className="setup-flow-grid">
            {setupFlow.map((step, idx) => (
              <div key={step.title} className="vercel-card setup-step-card" style={{ padding: 22, background: idx === 0 ? "#111827" : "#ffffff", borderColor: idx === 0 ? "#111827" : "#eaeaea" }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: idx === 0 ? "rgba(255,255,255,0.55)" : "#9ca3af", marginBottom: 28 }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 850, color: idx === 0 ? "#ffffff" : "#111827", letterSpacing: "-0.03em", margin: "0 0 10px" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: idx === 0 ? "rgba(255,255,255,0.7)" : "#64748b", lineHeight: 1.7, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "18px 20px", border: "1px solid #eaeaea", borderRadius: 16, background: "#fafafa", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#111827", marginBottom: 4 }}>
                {isEn ? "Most clients use one Base URL" : "大多数客户端只需要一个地址"}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: "#475569", wordBreak: "break-all" }}>
                https://api.cheng-zi-ai.com/v1
              </div>
            </div>
            <button
              onClick={() => copyText("https://api.cheng-zi-ai.com/v1", "base_url")}
              style={{ background: "#111827", color: "#ffffff", border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 850, cursor: "pointer" }}
            >
              {copiedStates["base_url"] ? (isEn ? "Copied" : "已复制") : (isEn ? "Copy" : "复制")}
            </button>
          </div>
        </div>
      </section>


      {/* ───── Client Guides (Section 11) ───── */}
      <section
        id="client-guides"
        style={{
          padding: "80px 24px",
          background: "#fafafa",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 850, color: "#111827", letterSpacing: "-0.04em", margin: "0 0 12px" }}>
              {isEn ? "Claude Code / Codex setup" : "Claude Code / Codex 接入配置"}
            </h2>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.7, margin: "0 auto", maxWidth: 620 }}>
              {isEn
                ? "Different clients use different base URLs. Copy the matching setup below."
                : "不同客户端的 Base URL 不一样。按下面对应工具复制配置即可。"}
            </p>
          </div>

          <div className="integration-guide-grid compact-guide-grid">
            {clientGuideData.cards.map((card, i) => (
              <div key={card.label} className="vercel-card" style={{ padding: 26, background: "#ffffff", borderColor: "#eaeaea" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: 999, background: i === 0 ? "#111827" : "#fafafa", color: i === 0 ? "#ffffff" : "#111827", border: i === 0 ? "1px solid #111827" : "1px solid #eaeaea", fontSize: 12, fontWeight: 900 }}>
                    {card.label}
                  </span>
                  <button
                    onClick={() => copyText(card.endpoint, `guide_endpoint_${i}`)}
                    style={{
                      background: "transparent",
                      color: "#111827",
                      border: "1px solid #eaeaea",
                      borderRadius: 8,
                      padding: "7px 10px",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {copiedStates[`guide_endpoint_${i}`] ? (isEn ? "Copied" : "已复制") : (isEn ? "Copy URL" : "复制地址")}
                  </button>
                </div>

                <h3 style={{ fontSize: 21, fontWeight: 850, color: "#111827", letterSpacing: "-0.04em", margin: "0 0 18px" }}>
                    {card.title}
                </h3>

                <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                  {card.steps.map(([label, value]) => (
                    <div key={label} style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: 12, alignItems: "baseline" }}>
                      <div style={{ fontSize: 12, fontWeight: 850, color: "#64748b" }}>
                        {label}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 13, color: "#111827", wordBreak: "break-all", fontWeight: 750 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 13, color: "#111827", lineHeight: 1.65, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "10px 12px", marginBottom: 16 }}>
                  {card.note}
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {card.blocks.map((block, blockIndex) => (
                    <div key={block.title} style={{ border: "1px solid #eaeaea", borderRadius: 14, overflow: "hidden", background: "#0b1020" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#111827" }}>
                        <span style={{ color: "rgba(255,255,255,0.76)", fontSize: 12, fontWeight: 850 }}>
                          {block.title}
                        </span>
                        <button
                          onClick={() => copyText(block.code, `guide_block_${i}_${blockIndex}`)}
                          style={{ background: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 9px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                        >
                          {copiedStates[`guide_block_${i}_${blockIndex}`] ? (isEn ? "Copied" : "已复制") : (isEn ? "Copy" : "复制")}
                        </button>
                      </div>
                      <pre style={{ margin: 0, padding: 14, color: "#e5e7eb", fontSize: 12, lineHeight: 1.65, overflowX: "auto", whiteSpace: "pre-wrap", fontFamily: "'SF Mono', 'Fira Code', Menlo, Consolas, monospace" }}>
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
            {isEn
              ? "Tip: Claude Code uses Anthropic-compatible environment variables. Codex uses OpenAI-compatible routing."
              : "提示：Claude Code 走 Anthropic 兼容环境变量；Codex 走 OpenAI 兼容路由。"}
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
                fontSize: "clamp(22px, 3.5vw, 32px)",
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
      <footer className="api-footer" style={{ borderTop: "1px solid #eaeaea", padding: "40px 24px 100px", textAlign: "center", color: "#666", fontSize: 14 }}>
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
            <button onClick={() => setIsPurchaseModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#999999", fontSize: "clamp(18px, 2.5vw, 24px)", cursor: "pointer", lineHeight: 1 }}>×</button>
            
            {/* Step 1: Confirmation Screen */}
            {purchaseStep === "confirm" && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111827" }}>
                  {isEn ? "You are purchasing:" : "你将购买："} {selectedPlan.name}
                </h3>
                <div style={{ background: "#f9fafb", padding: "16px 20px", borderRadius: "8px", border: "1px solid #eaeaea", marginBottom: 24 }}>
                  <div style={{ color: "#111827", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
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
                      <Image
                        src="/images/alipay.jpg"
                        alt="Alipay QR Code"
                        width={554}
                        height={554}
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
                <div style={{ width: 54, height: 54, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "clamp(18px, 2.5vw, 24px)", margin: "0 auto 16px" }}>
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
            <button onClick={() => setIsSupportModalOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#999999", fontSize: "clamp(18px, 2.5vw, 24px)", cursor: "pointer", lineHeight: 1 }}>×</button>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#111827", textAlign: "center" }}>
              {isEn ? "Need Help?" : "需要协助？"}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", color: "#4b5563", fontSize: 13, textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>• {isEn ? "Pre-purchase consulting" : "购买前咨询"}</li>
              <li>• {isEn ? "Bulk subscription / discount quote" : "大额订阅 / 折扣报价"}</li>
              <li>• {isEn ? "CDK redemption assistance" : "兑换码不会使用"}</li>
              <li>• {isEn ? "Cursor / Cline configuration failure" : "Cursor / Cline 配置失败"}</li>
              <li>• {isEn ? "API exceptions or deduction errors" : "调用异常或扣费问题"}</li>
            </ul>
            <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #eaeaea", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "#666" }}>{isEn ? "Support Email" : "客服邮箱"}</span>
              <a href="mailto:chengziai2026@163.com" style={{ display: "block", color: "#111827", fontWeight: 700, fontSize: 15, marginTop: 6, textDecoration: "none" }}>
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
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          zIndex: 70,
        }}
      >
        <div style={{ color: "#111827", fontWeight: 700 }}>
          {isEn ? (
            <span style={{ fontSize: 13, color: "#111827", fontWeight: 700 }}>
              $14 → $100 credit
            </span>
          ) : (
            <>
              ¥100 <span style={{ fontSize: 11, color: "#666", fontWeight: 400, marginLeft: 2 }}>起</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => scrollTo("quick-start")}
            style={{
              background: "transparent",
              color: "#333333",
              border: "1px solid #eaeaea",
              padding: "9px 10px",
              borderRadius: "6px",
              fontSize: 12,
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
              padding: "9px 12px",
              borderRadius: "6px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEn ? "Buy Credit Code" : "购买充值码"}
          </button>
        </div>
      </div>

      {/* ───── Referral Promo Card (Desktop & Mobile) ───── */}
      {!isReferralCardClosed && (
        <>
          <div
            className="hide-on-mobile"
            style={{
              position: "fixed",
              right: 24,
              bottom: 82,
              width: 318,
              background: "#ffffff",
              border: "1px solid #eaeaea",
              borderRadius: 18,
              boxShadow: "0 18px 50px rgba(0,0,0,0.13)",
              padding: 18,
              zIndex: 41,
            }}
          >
            <button
              aria-label={isEn ? "Close referral card" : "关闭推广卡片"}
              onClick={() => setIsReferralCardClosed(true)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 26,
                height: 26,
                border: "none",
                borderRadius: 999,
                background: "#f5f5f5",
                color: "#666",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "26px",
              }}
            >
              ×
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingRight: 24 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  background: "#111827",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                }}
              >
                {activeInviteCode ? "$" : "↗"}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                  {activeInviteCode
                    ? isEn ? "Invite offer locked" : "邀请福利已锁定"
                    : isEn ? "Referral rewards" : "邀请好友赚奖励"}
                </div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  {activeInviteCode
                    ? isEn ? `Invite code: ${activeInviteCode}` : `邀请码：${activeInviteCode}`
                    : isEn ? "Invitee gets $10, inviter gets $3" : "好友得 $10，你得 ¥20"}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#333", lineHeight: 1.55, marginBottom: 14, display: "grid", gap: 8 }}>
              {activeInviteCode ? (
                <>
                  <div>{isEn ? <>New users who register via this invite link can get <strong>$10 API credit</strong>.</> : <>新用户通过此邀请链接首次注册，可领取 <strong>$10 API 体验额度</strong>。</>}</div>
                  <div style={{ color: "#666" }}>{isEn ? "After the first $100 top-up, the inviter gets a $3 reward." : "首充满 ¥100 后，邀请人获得 ¥20 奖励。"}</div>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 5 }}>
                    <div><strong>{isEn ? "1." : "1."}</strong> {isEn ? "Log in to console → Wallet." : "登录控制台 → 钱包管理"}</div>
                    <div><strong>{isEn ? "2." : "2."}</strong> {isEn ? "Copy invite link and share." : "复制邀请链接后分享"}</div>
                  </div>
                  <div style={{ color: "#666" }}>
                    {isEn ? <>New invited users get <strong>$10 credit</strong>; you get <strong>$3</strong> after their first $100 top-up.</> : <>被邀请的新用户得 <strong>$10 额度</strong>；好友首充满 ¥100 后，你得 <strong>¥20</strong>。</>}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: activeInviteCode ? "1fr" : "1fr 1fr", gap: 10 }}>
              {activeInviteCode ? (
                <a
                  href={registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textAlign: "center",
                    background: "#111827",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {isEn ? "New user: claim $10" : "新用户领取 $10"}
                </a>
              ) : (
                <>
                  <a
                    href={CONSOLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textAlign: "center",
                      background: "#111827",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {isEn ? "Open console" : "去后台复制链接"}
                  </a>
                  <Link
                    href={referralCardUrl}
                    style={{
                      textAlign: "center",
                      background: "#fff",
                      color: "#111827",
                      border: "1px solid #eaeaea",
                      textDecoration: "none",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {isEn ? "Make card" : "生成卡片"}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div
            className="api-referral-mobile-disabled"
            style={{
              position: "fixed",
              left: 12,
              right: 12,
              bottom: 72,
              background: "#ffffff",
              border: "1px solid #eaeaea",
              borderRadius: 14,
              boxShadow: "0 14px 40px rgba(0,0,0,0.14)",
              padding: "12px 12px",
              zIndex: 42,
              display: "none",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>
                {activeInviteCode
                  ? isEn ? "Invite offer locked" : "邀请福利已锁定"
                  : isEn ? "Referral rewards" : "邀请好友赚奖励"}
              </div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.35, whiteSpace: "normal" }}>
                {activeInviteCode
                  ? isEn ? "$10 credit for new invite registration" : "新用户通过邀请注册送 $10 体验额度"
                  : isEn ? "Log in → copy link → share" : "后台复制链接 → 分享好友"}
              </div>
            </div>
            {activeInviteCode ? (
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontSize: 12,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {isEn ? "Claim" : "新用户领取"}
              </a>
            ) : (
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <a
                  href={CONSOLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#111827",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 10,
                    padding: "9px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isEn ? "Console" : "后台"}
                </a>
                <Link
                  href={referralCardUrl}
                  style={{
                    background: "#fff",
                    color: "#111827",
                    border: "1px solid #eaeaea",
                    textDecoration: "none",
                    borderRadius: 10,
                    padding: "9px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isEn ? "Have link?" : "已有链接"}
                </Link>
              </div>
            )}
            <button
              aria-label={isEn ? "Close referral card" : "关闭推广卡片"}
              onClick={() => setIsReferralCardClosed(true)}
              style={{
                border: "none",
                background: "#f5f5f5",
                color: "#666",
                width: 28,
                height: 28,
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </>
      )}

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
        {isEn ? "Support" : "联系客服"}
      </button>

      {/* Responsive adjustments (Section 18) */}
      <style>{`
        :root {
          --cz-accent: #ff6a00;
        }
        .nav-link {
          color: #666666;
          transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
        }
        .nav-link:hover,
        .nav-link:focus-visible {
          color: var(--cz-accent) !important;
        }
        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }
        .desktop-flex { display: flex !important; }
        .desktop-only { display: block !important; }
        .hide-on-mobile { display: block !important; }
        .mobile-only { display: none !important; }
        .mobile-flex { display: none !important; }
        .featured-model-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
        .setup-flow-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .integration-guide-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }

        @media (max-width: 768px) {
          .api-hero-section {
            padding: 16px 12px 34px !important;
          }
          .api-hero-shell {
            padding: 24px 18px !important;
            border-radius: 20px !important;
          }
          .desktop-flex { display: none !important; }
          .desktop-only { display: none !important; }
          .hide-on-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
          .mobile-flex { display: flex !important; }
          .featured-model-grid,
          .setup-flow-grid,
          .integration-guide-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 14px !important;
          }
          .featured-model-card {
            min-height: auto !important;
          }
          .api-footer {
            padding-bottom: calc(128px + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </div>
  );
}
