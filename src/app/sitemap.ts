import { MetadataRoute } from 'next'
import { getProducts } from '../lib/api'
import { getGuides } from '../lib/guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cheng-zi-ai.com'
  const products = getProducts('zh')

  // Only index real product detail pages
  const validProducts = products.filter(p => p.actionType !== 'link')

  const productIndexUrls = (['zh', 'en'] as const).map(lang => ({
    url: `${baseUrl}/${lang}/products`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.84,
  }))

  const productUrls = validProducts.flatMap(p => [
    {
      url: `${baseUrl}/zh/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ])

  const serviceUrls = (['zh', 'en'] as const).map(lang => ({
    url: `${baseUrl}/${lang}/api-service`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const guideIndexUrls = (['zh', 'en'] as const).map(lang => ({
    url: `${baseUrl}/${lang}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }))

  const guideUrls = (['zh', 'en'] as const).flatMap(lang =>
    getGuides(lang).map(guide => ({
      url: `${baseUrl}/${lang}/guides/${encodeURIComponent(guide.slug)}`,
      lastModified: new Date(guide.lastModified),
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }))
  )

  return [
    {
      url: `${baseUrl}/zh`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...serviceUrls,
    ...productIndexUrls,
    ...productUrls,
    ...guideIndexUrls,
    ...guideUrls
  ]
}
