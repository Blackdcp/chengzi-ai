"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const CONSOLE_URL = "http://149.71.241.139:3001";

const MODELS = [
  { name: "gpt-4.1", provider: "openai" },
  { name: "gpt-4.1-mini", provider: "openai" },
  { name: "gpt-4.1-nano", provider: "openai" },
  { name: "gpt-4o", provider: "openai" },
  { name: "o3", provider: "openai" },
  { name: "o4-mini", provider: "openai" },
  { name: "gpt-image-1", provider: "openai" },
  { name: "codex-mini", provider: "openai" },
  { name: "claude-opus-4", provider: "claude" },
  { name: "claude-sonnet-4", provider: "claude" },
  { name: "claude-haiku-3.5", provider: "claude" },
  { name: "gemini-2.5-flash", provider: "gemini" },
  { name: "gemini-2.5-pro", provider: "gemini" },
];

const PROVIDER_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  openai: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  claude: { bg: "#fef3e2", color: "#d97706", border: "#fde68a" },
  gemini: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
};

export default function ApiServiceClientPage({ dict, lang }: { dict: any; lang: string }) {
  const t = dict.apiService;
  const router = useRouter();
  const pathname = usePathname();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              marginBottom: 32,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            🚀 OpenAI / Claude / Gemini
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

        <div
          className="vercel-card"
          style={{ overflow: "hidden", padding: 0 }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 100px",
              padding: "14px 24px",
              background: "#fafafa",
              borderBottom: "1px solid #eaeaea",
              fontSize: 12,
              fontWeight: 600,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <span>{t.models.model}</span>
            <span>{t.models.provider}</span>
            <span style={{ textAlign: "right" }}>{t.models.status}</span>
          </div>

          {/* Model rows */}
          {MODELS.map((model, i) => {
            const pc = PROVIDER_COLORS[model.provider];
            return (
              <div
                key={model.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 100px",
                  padding: "14px 24px",
                  borderBottom: i < MODELS.length - 1 ? "1px solid #f3f4f6" : "none",
                  alignItems: "center",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: "#111827", fontFamily: "monospace" }}>
                  {model.name}
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 600,
                      background: pc.bg,
                      color: pc.color,
                      border: `1px solid ${pc.border}`,
                    }}
                  >
                    {t.models[model.provider]}
                  </span>
                </span>
                <span style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "inline-block",
                      boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 500 }}>{t.models.available}</span>
                </span>
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

      {/* ───── Tutorial Section ───── */}
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
            {t.tutorial.title}
          </h2>
          <p style={{ fontSize: 16, color: "#666666", margin: 0 }}>{t.tutorial.subtitle}</p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {t.tutorial.steps.map((step: any, i: number) => (
            <div
              key={i}
              className="vercel-card"
              style={{
                padding: "32px 28px",
                position: "relative",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#f0f0f0",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {step.number}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: "#666", margin: 0, lineHeight: 1.6 }}>
                {step.description}
              </p>

              {/* Arrow connector (visible between steps) */}
              {i < t.tutorial.steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#d1d5db",
                    zIndex: 1,
                  }}
                  className="step-arrow"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Code Snippet */}
        <div
          className="vercel-card"
          style={{ overflow: "hidden", padding: 0 }}
        >
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
              {t.tutorial.codeTitle}
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
            }}
          >
            <code>
              <span style={{ color: "#6b7280" }}>{t.tutorial.codeComment1}</span>
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
              <span style={{ color: "#6b7280" }}>{t.tutorial.codeComment2}</span>
              {" \\\n  "}
              <span style={{ color: "#a78bfa" }}>-d</span>
              {" "}
              <span style={{ color: "#34d399" }}>&apos;{"{"}</span>
              {"\n    "}
              <span style={{ color: "#93c5fd" }}>&quot;model&quot;</span>
              <span style={{ color: "#e5e5e5" }}>: </span>
              <span style={{ color: "#34d399" }}>&quot;gpt-4.1&quot;</span>
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
          <div>© {new Date().getFullYear()} {t.footer.copyright}</div>
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
