import { MetadataRoute } from 'next'
import { getProducts } from '../lib/api'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cheng-zi-ai.com'
  const products = getProducts('zh')

  // Only index real product detail pages
  const validProducts = products.filter(p => p.actionType !== 'link')

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

  // Blog posts and tools removed per requirements

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
    ...productUrls
  ]
}
