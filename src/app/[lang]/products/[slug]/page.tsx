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
    <div style={{ minHeight: "100vh", background: "#faf9f7", fontFamily: '"Inter",-apple-system,"PingFang SC","Microsoft YaHei",sans-serif', color: "#1a1a1a", padding: "40px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", background: "#fff", border: "1px solid #e7e4df", borderRadius: 14, padding: "32px 36px" }}>
        
        <div style={{ marginBottom: 24 }}>
          <a href={`/${resolvedParams.lang}`} style={{ color: "#f27a1a", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← 返回首页 / Back to Home</a>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: "#9e9e9e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          {product.categoryName}
        </div>
        
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>
          {product.title}
        </h1>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#f27a1a" }}>¥{product.price}</span>
        </div>

        <p style={{ fontSize: 16, color: "#4b4b4b", lineHeight: 1.6, marginBottom: 32 }}>
          {product.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: "6px 14px", borderRadius: 20, background: "#f5f3f0", border: "1px solid #f0ede8", fontSize: 13, color: "#4b4b4b", fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #e7e4df", paddingTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>详细特性 (Features)</h2>
          <ul style={{ paddingLeft: 20, margin: 0, color: "#4b4b4b", lineHeight: 1.8, fontSize: 15 }}>
            {product.features.map((f, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{f}</li>
            ))}
          </ul>
        </div>

        {product.warnings && product.warnings.length > 0 && (
          <div style={{ marginTop: 32, padding: "16px 20px", background: "#fef2f2", borderLeft: "4px solid #dc2626", borderRadius: "0 8px 8px 0" }}>
            <h3 style={{ margin: "0 0 8px", color: "#b91c1c", fontSize: 16, fontWeight: 700 }}>⚠️ 注意事项 (Warnings)</h3>
            <ul style={{ paddingLeft: 20, margin: 0, color: "#b91c1c", fontSize: 14, lineHeight: 1.6 }}>
              {product.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}
