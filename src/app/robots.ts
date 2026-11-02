import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const disallowPaths = ['/api/', '/proxy-html', '/zh/activate', '/en/activate']
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt'],
        disallow: disallowPaths,
      },
      {
        userAgent: [
          'OAI-SearchBot',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'Bytespider',
        ],
        allow: ['/', '/llms.txt'],
        disallow: disallowPaths,
      },
    ],
    sitemap: 'https://cheng-zi-ai.com/sitemap.xml',
  }
}
