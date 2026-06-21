import { notFound } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { getProductBySlug } from '../../../../lib/api'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh'; slug: string }>
}) {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.lang, resolvedParams.slug)

  if (!product) {
    notFound()
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fbfbfa", fontFamily: '"Inter",-apple-system,sans-serif', color: "#111827", padding: "64px 24px" }}>
      <div className="stripe-shadow" style={{ maxWidth: 780, margin: "0 auto", background: "#fff", borderRadius: 24, padding: "48px" }}>
        
        <div style={{ marginBottom: 32 }}>
          <a href={`/${resolvedParams.lang}`} style={{ color: "#f97316", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>&larr;</span> 返回首页
          </a>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          {product.categoryName}
        </div>
        
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 20px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {product.title}
        </h1>

        <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline" }}>
          {product.price > 0 ? (
             <>
               <span style={{ fontSize: 48, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>¥{product.price}</span>
               <span style={{ fontSize: 16, color: "#6b7280", marginLeft: 6, fontWeight: 500 }}>/ 年</span>
             </>
          ) : (
             <span style={{ fontSize: 48, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>免费</span>
          )}
        </div>

        <p style={{ fontSize: 18, color: "#4b5563", lineHeight: 1.6, marginBottom: 40 }}>
          {product.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: "6px 14px", borderRadius: 8, background: "#f3f4f6", fontSize: 13, color: "#374151", fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 20px", letterSpacing: "-0.01em" }}>功能特性</h2>
          <ul style={{ paddingLeft: 0, margin: 0, color: "#4b5563", lineHeight: 1.8, fontSize: 16, listStyle: "none" }}>
            {product.features.map((f, i) => (
              <li key={i} style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#10b981", marginTop: 2 }}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {product.warnings && product.warnings.length > 0 && (
          <div style={{ marginTop: 40, padding: "20px 24px", background: "#fef2f2", borderRadius: 12 }}>
            <h3 style={{ margin: "0 0 12px", color: "#b91c1c", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18} /> 购买必读
            </h3>
            <ul style={{ paddingLeft: 24, margin: 0, color: "#b91c1c", fontSize: 14, lineHeight: 1.6 }}>
              {product.warnings.map((w, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{w}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}
