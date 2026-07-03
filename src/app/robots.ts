import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/proxy-html', '/zh/activate', '/en/activate'],
    },
    sitemap: 'https://cheng-zi-ai.com/sitemap.xml',
  }
}
