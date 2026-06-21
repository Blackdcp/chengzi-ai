import { notFound } from 'next/navigation'
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
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#111827", padding: "40px 24px", lineHeight: 1.6 }}>
      
      {/* Header bar */}
      <div style={{ background: "#f6f6ef", padding: "12px 24px", borderBottom: "1px solid #e5e7eb", marginBottom: 40, marginLeft: -24, marginRight: -24, marginTop: -40 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center" }}>
          <a href={`/${resolvedParams.lang}`} style={{ color: "#111827", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            &larr; 返回首页
          </a>
        </div>
      </div>

      <div className="yc-card" style={{ maxWidth: 780, margin: "0 auto", padding: "40px" }}>
        
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          {product.categoryName}
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          {product.title}
        </h1>

        <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline" }}>
          {product.price > 0 ? (
             <>
               <span style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>¥{product.price}</span>
               <span style={{ fontSize: 14, color: "#6b7280", marginLeft: 6 }}>/ 年</span>
             </>
          ) : (
             <span style={{ fontSize: 36, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>免费</span>
          )}
        </div>

        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.6, marginBottom: 32 }}>
          {product.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: "4px 10px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: 12, color: "#374151", fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ borderTop: "2px solid #111827", paddingTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px" }}>功能特性</h2>
          <ul style={{ paddingLeft: 0, margin: 0, color: "#374151", lineHeight: 1.8, fontSize: 15, listStyle: "none" }}>
            {product.features.map((f, i) => (
              <li key={i} style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#ff6600", fontWeight: "bold" }}>+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {product.warnings && product.warnings.length > 0 && (
          <div style={{ marginTop: 40, padding: "20px", border: "1px solid #ff6600", background: "#fff5f0" }}>
            <h3 style={{ margin: "0 0 12px", color: "#b91c1c", fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>
              购买必读
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, color: "#b91c1c", fontSize: 13, lineHeight: 1.6 }}>
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
