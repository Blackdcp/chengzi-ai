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
    {
      url: `${baseUrl}/zh/tools/ppt2pdf`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/tools/ppt2pdf`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/zh/tools/chat-exporter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/tools/chat-exporter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productUrls
  ]
}
