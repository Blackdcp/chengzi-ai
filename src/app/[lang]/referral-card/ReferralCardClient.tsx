"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

const SITE_URL = "https://cheng-zi-ai.com";
const CONSOLE_URL = "https://api.cheng-zi-ai.com";
const STORAGE_KEY = "chengzi_ai_own_invite_code";

const normalizeReferralCode = (value?: string | null) => {
  const code = (value || "").trim();
  if (!code) return "";
  return /^[a-zA-Z0-9_-]{2,80}$/.test(code) ? code : "";
};

const extractReferralCode = (value: string) => {
  const raw = value.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    return normalizeReferralCode(
      url.searchParams.get("aff") || url.searchParams.get("ref") || url.searchParams.get("refCode")
    );
  } catch {
    const match = raw.match(/[?&](?:aff|ref|refCode)=([a-zA-Z0-9_-]{2,80})/);
    if (match?.[1]) return normalizeReferralCode(match[1]);
    return normalizeReferralCode(raw);
  }
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

type ReferralCardClientProps = {
  lang: "zh" | "en";
};

export default function ReferralCardClient({ lang }: ReferralCardClientProps) {
  const isEn = lang === "en";
  const [input, setInput] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [cardDataUrl, setCardDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCode = normalizeReferralCode(params.get("aff") || params.get("ref") || params.get("refCode"));
    const initialUrl = params.get("url") || "";
    const storedCode = normalizeReferralCode(window.localStorage.getItem(STORAGE_KEY));

    if (initialUrl) {
      const code = extractReferralCode(initialUrl);
      queueMicrotask(() => {
        setInput(initialUrl);
        if (code) setReferralCode(code);
      });
      return;
    }

    if (initialCode) {
      queueMicrotask(() => {
        setInput(`${CONSOLE_URL}/register?aff=${initialCode}`);
        setReferralCode(initialCode);
      });
      return;
    }

    if (storedCode) {
      queueMicrotask(() => {
        setInput(`${CONSOLE_URL}/register?aff=${storedCode}`);
        setReferralCode(storedCode);
      });
    }
  }, []);

  const landingUrl = useMemo(() => {
    if (!referralCode) return "";
    return `${SITE_URL}/${lang}/api-service?aff=${encodeURIComponent(referralCode)}`;
  }, [lang, referralCode]);

  const registerUrl = useMemo(() => {
    if (!referralCode) return "";
    return `${CONSOLE_URL}/register?aff=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  useEffect(() => {
    if (!referralCode || !landingUrl) {
      return;
    }

    let cancelled = false;

    async function generateCard() {
      const qrDataUrl = await QRCode.toDataURL(landingUrl, {
        width: 420,
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#111827",
          light: "#ffffff",
        },
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const logoImage = await loadImage(isEn ? "/images/logo-en.png" : "/images/logo-zh.png");

      ctx.fillStyle = "#f6f6f4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = "rgba(0, 0, 0, 0.055)";
      ctx.shadowBlur = 44;
      ctx.shadowOffsetY = 16;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 78, 64, 924, 1312, 56);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      const logoMaxWidth = isEn ? 300 : 330;
      const logoMaxHeight = 76;
      const logoScale = Math.min(logoMaxWidth / logoImage.width, logoMaxHeight / logoImage.height);
      const logoWidth = logoImage.width * logoScale;
      const logoHeight = logoImage.height * logoScale;
      ctx.drawImage(logoImage, 150, 122, logoWidth, logoHeight);

      ctx.textAlign = "left";
      ctx.fillStyle = "#6b7280";
      ctx.font = "800 23px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "Low-cost API relay service" : "低价 API 中转服务", 150, 270);

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 62px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText("Claude 4.8 Opus", 150, 372);
      ctx.font = "900 134px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "40–50% off" : "约 5–6 折", 150, 526);

      ctx.fillStyle = "#6b7280";
      ctx.font = "600 26px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(
        isEn ? "A lower-cost entry for AI coding workflows." : "让 Claude Code / Codex 的试用成本先降下来。",
        150,
        582
      );

      ctx.fillStyle = "#f5f5f7";
      roundRect(ctx, 150, 654, 780, 178, 34);
      ctx.fill();

      ctx.fillStyle = "#111827";
      ctx.font = "850 31px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "Flagship models available" : "三大旗舰模型可试", 194, 714);

      ctx.fillStyle = "#4b5563";
      ctx.font = "800 26px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText("GPT-5.5  ·  Claude 4.8  ·  Gemini 3.1 Pro", 194, 774);

      ctx.fillStyle = "#111827";
      roundRect(ctx, 150, 870, 470, 62, 999);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 24px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "Claude Code / Codex ready" : "Claude Code / Codex 直接接入", 182, 910);

      ctx.fillStyle = "#111827";
      roundRect(ctx, 150, 990, 780, 286, 42);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 50px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "New users get $10" : "新用户领 $10 额度", 196, 1082);
      ctx.fillStyle = "#d1d5db";
      ctx.font = "600 22px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "Register via invite link" : "通过邀请链接注册", 196, 1130);
      ctx.fillText(isEn ? "First registration only" : "仅限首次注册领取", 196, 1164);

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      roundRect(ctx, 196, 1210, 260, 36, 999);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 18px Arial, 'Microsoft YaHei', sans-serif";
      ctx.fillText(isEn ? "Setup guide included" : "含接入配置说明", 226, 1234);

      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 636, 1028, 238, 238, 32);
      ctx.fill();

      const qrImage = await loadImage(qrDataUrl);
      ctx.drawImage(qrImage, 658, 1050, 194, 194);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "500 19px Arial, 'Microsoft YaHei', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        isEn
          ? "Third-party API relay · final pricing shown in console"
          : "第三方 API 中转服务 · 价格以控制台为准",
        540,
        1348
      );
      ctx.textAlign = "left";

      if (!cancelled) setCardDataUrl(canvas.toDataURL("image/png"));
    }

    generateCard().catch(() => {
      if (!cancelled) setError(isEn ? "Failed to generate card." : "卡片生成失败，请稍后重试。");
    });

    return () => {
      cancelled = true;
    };
  }, [isEn, landingUrl, referralCode]);

  const handleGenerate = () => {
    const code = extractReferralCode(input);
    if (!code) {
      setError(isEn ? "Please enter a valid invitation link or invite code." : "请输入有效的邀请码或邀请链接。");
      return;
    }

    setError("");
    setReferralCode(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  };

  const copyLandingUrl = async () => {
    if (!landingUrl) return;
    await navigator.clipboard.writeText(landingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", color: "#111827", padding: "24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
          <Link href={`/${lang}`} style={{ color: "#111827", textDecoration: "none", fontWeight: 800, fontSize: 18 }}>
            {isEn ? "ChengZi AI" : "橙子 AI"}
          </Link>
          <Link href={`/${lang}/api-service`} style={{ color: "#666", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            {isEn ? "Back to API Service" : "返回 API 服务页"}
          </Link>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(320px, 0.75fr)",
            gap: 24,
            alignItems: "start",
          }}
          className="referral-card-shell"
        >
          <div style={{ background: "#ffffff", border: "1px solid #eaeaea", borderRadius: 24, padding: "clamp(24px, 4vw, 44px)", boxShadow: "0 18px 60px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #eaeaea", borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 800, marginBottom: 18 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#111827" }} />
              {isEn ? "For registered users" : "已注册用户专用"}
            </div>

            <h1 style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.04em", margin: "0 0 16px", fontWeight: 900 }}>
              {isEn ? "Turn your invite link into a share card." : "已注册用户，把邀请链接变成推广卡片。"}
            </h1>

            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.75, maxWidth: 680, margin: "0 0 30px" }}>
              {isEn
                ? "This tool is for users who already have a console account. Copy your invite link from Wallet Management and paste it here to generate a share card."
                : "这个功能只给已经注册过控制台的用户使用。请先到控制台「钱包管理」复制你的邀请链接，再粘贴到这里生成推广卡片。"}
            </p>

            <div style={{ border: "1px solid #e5e7eb", background: "#f5f5f7", borderRadius: 18, padding: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#111827", marginBottom: 10 }}>
                {isEn ? "Referral reward" : "邀请奖励规则"}
              </div>
              <div style={{ display: "grid", gap: 8, fontSize: 14, color: "#4b5563", lineHeight: 1.65 }}>
                <div>
                  {isEn
                    ? "1. New users who register through your invite link receive $10 API trial credit."
                    : "1. 新用户通过你的邀请链接首次注册，可获得 $10 API 体验额度。"}
                </div>
                <div>
                  {isEn
                    ? "2. After your friend’s first top-up reaches ¥100, you can receive a ¥20 cash reward."
                    : "2. 好友首充满 ¥100 后，你可获得 ¥20 现金奖励。"}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>
                {isEn ? "Your invitation link or code" : "你的邀请链接或邀请码"}
              </label>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={`${CONSOLE_URL}/register?aff=kOwU`}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "14px 16px",
                  fontSize: 15,
                  outline: "none",
                  background: "#fafafa",
                }}
              />
              {error && <div style={{ fontSize: 13, color: "#dc2626" }}>{error}</div>}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <button
                onClick={handleGenerate}
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px 20px",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isEn ? "Generate card" : "生成推广卡片"}
              </button>
              {landingUrl && (
                <button
                  onClick={copyLandingUrl}
                  style={{
                    background: "#ffffff",
                    color: "#111827",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "13px 20px",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {copied ? (isEn ? "Copied" : "已复制") : isEn ? "Copy landing link" : "复制落地页链接"}
                </button>
              )}
            </div>

            {landingUrl && (
              <div style={{ border: "1px solid #eaeaea", background: "#fafafa", borderRadius: 16, padding: 16, display: "grid", gap: 10, fontSize: 13, color: "#4b5563" }}>
                <div>
                  <strong style={{ color: "#111827" }}>{isEn ? "Landing page:" : "推广落地页："}</strong>{" "}
                  <span style={{ wordBreak: "break-all" }}>{landingUrl}</span>
                </div>
                <div>
                  <strong style={{ color: "#111827" }}>{isEn ? "Direct registration:" : "直接注册页："}</strong>{" "}
                  <span style={{ wordBreak: "break-all" }}>{registerUrl}</span>
                </div>
              </div>
            )}
          </div>

          <aside style={{ background: "#ffffff", border: "1px solid #eaeaea", borderRadius: 24, padding: 18, boxShadow: "0 18px 60px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>
              {isEn ? "Card preview" : "卡片预览"}
            </div>
            <div style={{ background: "#f4f4f2", borderRadius: 18, padding: 12, minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cardDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cardDataUrl} alt={isEn ? "Referral card preview" : "推广卡片预览"} style={{ width: "100%", height: "auto", borderRadius: 14, display: "block" }} />
              ) : (
                <div style={{ textAlign: "center", color: "#777", fontSize: 14, lineHeight: 1.7, padding: 24 }}>
                  {isEn ? "Enter an invitation link to generate the card." : "输入邀请链接后，这里会生成可下载的推广卡片。"}
                </div>
              )}
            </div>

            {cardDataUrl && (
              <a
                href={cardDataUrl}
                download={`chengzi-ai-referral-${referralCode}.png`}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#111827",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: 12,
                  padding: "13px 16px",
                  fontSize: 14,
                  fontWeight: 900,
                  marginTop: 14,
                }}
              >
                {isEn ? "Download PNG" : "下载 PNG 卡片"}
              </a>
            )}

            <p style={{ color: "#777", fontSize: 12, lineHeight: 1.6, margin: "14px 2px 0" }}>
              {isEn
                ? "Tip: The QR code points to the API service landing page with your invite code, not directly to the console."
                : "提示：二维码会先进入带邀请码的 API 服务页，不是直接跳控制台注册页，方便新用户先看到福利。"}
            </p>
          </aside>
        </section>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .referral-card-shell {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}
