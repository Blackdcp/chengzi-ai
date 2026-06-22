"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const CONSOLE_URL = "http://149.71.241.139:3001";

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

const MODEL_METADATA: Record<string, { tag: Record<string, string>; desc: Record<string, string> }> = {
  "gpt-5.5": {
    tag: { zh: "推理旗舰", en: "Next-Gen Reasoner" },
    desc: { zh: "最强逻辑与数学推理，复杂问题克星", en: "Strongest logic & math reasoning, solver of complex problems" }
  },
  "gpt-5.4": {
    tag: { zh: "通用旗舰", en: "Flagship" },
    desc: { zh: "顶尖多模态理解与日常对话旗舰模型", en: "Top-tier multimodal understanding & daily chat flagship" }
  },
  "gpt-5.4-mini": {
    tag: { zh: "高性价比", en: "Cost-Effective" },
    desc: { zh: "极速轻量旗舰，适合高频对话与日常问答", en: "Fast & lightweight flagship for high-frequency chat" }
  },
  "codex-auto-review": {
    tag: { zh: "智能审查", en: "Code Review" },
    desc: { zh: "自动审查代码、Debug 与优化建议", en: "Automated code review, debug, and optimization suggestions" }
  },
  "gpt-5.3-codex": {
    tag: { zh: "编程专家", en: "Coding Expert" },
    desc: { zh: "深度优化编程、上下文代码分析与生成", en: "Deeply optimized for programming, context analysis & generation" }
  },
  "gpt-image-2": {
    tag: { zh: "AI 生图", en: "AI Image" },
    desc: { zh: "高精度图像创作，完美解析复杂提示词", en: "High-precision image creation, perfectly parses complex prompts" }
  },
  "claude-opus-4-8": {
    tag: { zh: "终极学术", en: "Ultimate Logic" },
    desc: { zh: "克劳德家族最高逻辑能力，适合学术与论文分析", en: "Highest logic in Claude family, ideal for academic & essay analysis" }
  },
  "claude-opus-4-7": {
    tag: { zh: "强力逻辑", en: "Advanced Logic" },
    desc: { zh: "超强逻辑处理，支持超长文本分析", en: "Advanced reasoning with support for extra-long text analysis" }
  },
  "claude-opus-4-6": {
    tag: { zh: "深度分析", en: "Deep Analysis" },
    desc: { zh: "针对企业级复杂文档分析与长文本理解", en: "Tailored for enterprise document analysis & long-text comprehension" }
  },
  "claude-sonnet-4-6": {
    tag: { zh: "代码开发", en: "Coding Leader" },
    desc: { zh: "最受全球开发者推崇的日常代码编写与Debug模型", en: "Highly praised by global developers for daily coding & debug" }
  },
  "claude-haiku-4-5-20251001": {
    tag: { zh: "极速轻量", en: "Fast & Smart" },
    desc: { zh: "极速响应，支持海量文本过滤与基础问答", en: "Fastest response time, ideal for text filtering & basic chat" }
  },
  "gemini-3.1-pro-high": {
    tag: { zh: "多模态旗舰", en: "Multimodal Pro" },
    desc: { zh: "多模态与长文本处理（高优先级通道）", en: "Top-tier multimodal & long-context (High priority channel)" }
  },
  "gemini-3.1-pro-low": {
    tag: { zh: "通用分析", en: "General Pro" },
    desc: { zh: "多模态通用理解与长文本处理", en: "General multimodal understanding & long-context analysis" }
  },
  "gemini-3.5-flash": {
    tag: { zh: "极速响应", en: "Flash Speed" },
    desc: { zh: "谷歌最新极速模型，超低延迟（高优先级通道）", en: "Google's latest ultra-fast model with minimal latency (High priority)" }
  },
  "gemini-3.5-flash-low": {
    tag: { zh: "轻量分析", en: "Flash Lite" },
    desc: { zh: "谷歌轻量级极速响应模型，日常任务首选", en: "Google's lightweight ultra-fast model, best for daily tasks" }
  }
};

export default function ApiServiceClientPage({ dict, lang }: { dict: any; lang: string }) {
  const t = dict.apiService;
  const router = useRouter();
  const pathname = usePathname();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"clients" | "code">("clients");

  const switchLang = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", lineHeight: 1.5, background: "#fafafa" }}>
      {/* ───── Compliance Banner ───── */}
      <div
        style={{
          background: "#fff5f5",
          borderBottom: "1px solid #fee2e2",
          color: "#991b1b",
          fontSize: 12,
          fontWeight: 500,
          textAlign: "center",
          padding: "10px 24px",
          lineHeight: 1.4,
        }}
      >
        ⚠️ {t.footer.disclaimer}
      </div>

      {/* ───── Sticky Header ───── */}
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

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14, fontWeight: 500 }}>
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
              href="#tutorial"
              className="nav-link"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("tutorial");
              }}
            >
              {t.nav.tutorial}
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
            ✅ {t.hero.compatibilityBadge}
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
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
              fontSize: "clamp(16px, 2.5vw, 20px)",
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
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 560,
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            {t.hero.description}
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                background: "#ffffff",
                color: "#0a0a0a",
                borderRadius: "8px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
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
              {t.hero.ctaConsole}
              <span style={{ fontSize: 18 }}>→</span>
            </a>
            <button
              onClick={() => scrollTo("pricing")}
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
              {t.hero.ctaPricing}
            </button>
          </div>
        </div>
      </section>

      {/* ───── Models Section ───── */}
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {["openai", "claude", "gemini"].map(provider => {
            const providerModels = MODELS.filter(m => m.provider === provider);
            const pc = PROVIDER_COLORS[provider];
            const providerName = provider === "openai" ? "OpenAI 接口服务" : provider === "claude" ? "Claude 智能中转" : "Gemini 极速节点";
            const providerDesc = provider === "openai" 
              ? (lang === "zh" ? "全面支持 gpt-5.5、gpt-5.4 及其生图通道，完全兼容官方格式，响应毫秒级。" : "Supports gpt-5.5, gpt-5.4, and image generation, fully compatible with official formats.")
              : provider === "claude"
              ? (lang === "zh" ? "集成 claude-opus-4、claude-sonnet-4 等全系逻辑模型，学术与开发首选。" : "Includes claude-opus-4, claude-sonnet-4, and full models family, ideal for coding.")
              : (lang === "zh" ? "接入 gemini-3.5-flash、gemini-3.1-pro 极速通道，多模态与长文本首选。" : "Provides gemini-3.5-flash, gemini-3.1-pro, optimal choice for long context.");

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
                {/* Availability status styled exactly like product hot badge */}
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
                    fontSize: 20,
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
                  }}
                >
                  {providerDesc}
                </p>

                {/* Tags styled exactly like main site card tags */}
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
      </section>

      {/* ───── Pricing Section ───── */}
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
              {t.pricing.title}
            </h2>
            <p style={{ fontSize: 16, color: "#666666", margin: 0 }}>{t.pricing.subtitle}</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {(["starter", "standard", "premium"] as const).map((tier) => {
              const plan = t.pricing[tier];
              const isHighlighted = tier === "standard";
              return (
                <div
                  key={tier}
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
                  {/* Badge */}
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
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#111827",
                        margin: "0 0 16px",
                      }}
                    >
                      {plan.name}
                    </h3>

                    <div style={{ marginBottom: 24 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                        {plan.price}
                      </span>
                      <span style={{ fontSize: 14, color: "#999", marginLeft: 4 }}>{plan.unit}</span>
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
                            fontSize: 14,
                            color: "#444",
                            borderBottom: i < plan.features.length - 1 ? "1px solid #f5f5f5" : "none",
                          }}
                        >
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: isHighlighted ? "#0a0a0a" : "#f5f5f5",
                              color: isHighlighted ? "#fff" : "#22c55e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
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

                    <a
                      href={CONSOLE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={isHighlighted ? "vercel-button" : "vercel-button-secondary"}
                      style={{
                        display: "block",
                        padding: "12px 0",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        borderRadius: "6px",
                      }}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Ecosystem & Client Support Section ───── */}
      <section id="tutorial" style={{ padding: "80px 24px", maxWidth: 1080, margin: "0 auto" }}>
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
            {t.ecosystem.title}
          </h2>
          <p style={{ fontSize: 16, color: "#666666", margin: 0 }}>{t.ecosystem.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
          {/* Integration details */}
          <div className="vercel-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                1. 接口地址 (Base URL)
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #eaeaea", borderRadius: "6px", padding: "10px 14px", fontFamily: "monospace", fontSize: 13, color: "#0f172a", wordBreak: "break-all" }}>
                {CONSOLE_URL}/v1
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                2. 接口密钥 (API Key)
              </div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>
                {lang === "zh" ? "登录控制台在" : "Log in to the console, go to the " }<strong>{lang === "zh" ? "“令牌”" : "\"Tokens\"" }</strong>{lang === "zh" ? "菜单中创建并复制，格式为 " : " menu to create and copy, formatted as " }<code>sk-xxxxxx</code>。
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                3. 100% 官方接口兼容
              </div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>
                {lang === "zh" ? "可直接配置于 Cursor, NextChat, Cline, ChatBox 等任意支持自定义中转的开发工具或第三方应用中。" : "Compatible with Cursor, NextChat, Cline, ChatBox, or any third-party developer tool supporting custom API endpoints."}
              </div>
            </div>
          </div>

          {/* Code example */}
          <div className="vercel-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "12px 20px",
                background: "#fafafa",
                borderBottom: "1px solid #eaeaea",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
              <span style={{ marginLeft: 12, fontSize: 13, color: "#999", fontWeight: 500 }}>
                {t.ecosystem.codeTitle}
              </span>
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
                <span style={{ color: "#6b7280" }}>{t.ecosystem.codeComment1}</span>
                {"\n\n"}
                <span style={{ color: "#c084fc" }}>curl</span>
                {" "}
                <span style={{ color: "#a78bfa" }}>-X POST</span>
                {" "}
                <span style={{ color: "#34d399" }}>&quot;{CONSOLE_URL}/v1/chat/completions&quot;</span>
                {" \\\n  "}
                <span style={{ color: "#a78bfa" }}>-H</span>
                {" "}
                <span style={{ color: "#34d399" }}>&quot;Content-Type: application/json&quot;</span>
                {" \\\n  "}
                <span style={{ color: "#a78bfa" }}>-H</span>
                {" "}
                <span style={{ color: "#34d399" }}>&quot;Authorization: Bearer sk-your-api-key&quot;</span>
                {"  "}
                <span style={{ color: "#6b7280" }}>{t.ecosystem.codeComment2}</span>
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
      </section>

      {/* ───── FAQ Section ───── */}
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
              {t.faq.title}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {t.faq.items.map((item: any, i: number) => {
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
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{item.question}</span>
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
                  <div
                    style={{
                      maxHeight: isOpen ? 200 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.3s ease",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        color: "#666",
                        lineHeight: 1.8,
                        margin: 0,
                        paddingBottom: 20,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer style={{ borderTop: "1px solid #eaeaea", padding: "40px 24px", textAlign: "center", color: "#666", fontSize: 14 }}>
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
          <div>
            {t.footer.contact}:{" "}
            <a href="mailto:chengziai2026@163.com" style={{ color: "#111827", textDecoration: "none", fontWeight: 500 }}>
              chengziai2026@163.com
            </a>
          </div>
          <div style={{ maxWidth: 800, margin: "12px auto 0", fontSize: 12, color: "#999", lineHeight: 1.6 }}>
            {t.footer.disclaimer}
          </div>
          <div style={{ marginTop: 8 }}>© {new Date().getFullYear()} {t.footer.copyright}</div>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .step-arrow { display: none !important; }
        }
      `}</style>
    </div>
  );
}
