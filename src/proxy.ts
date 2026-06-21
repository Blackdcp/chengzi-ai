import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']

// Extremely robust and lightweight language detector
function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') || ''
  const lowerLang = acceptLang.toLowerCase()
  
  // Directly check for Chinese markers
  if (lowerLang.includes('zh') || lowerLang.includes('cn')) {
    return 'zh'
  }
  // Check for English markers
  if (lowerLang.includes('en')) {
    return 'en'
  }
  
  return '' // Unknown
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, Next.js internals, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy-html') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 1. Try to get locale from Accept-Language
  let locale = getLocale(request)

  // 2. If browser language is completely missing or stripped by CDN
  if (!locale) {
    // We check the Vercel GEO header as a fallback
    const country = request.headers.get('x-vercel-ip-country')
    if (country) {
      // If the request comes from Qiniu CDN, the country might be SG, JP, or US depending on their back-to-origin routing.
      // So if it's ANY of the typical Asian proxy nodes, default to zh.
      const chineseProxyRegions = ['CN', 'HK', 'TW', 'MO', 'SG', 'JP', 'KR']
      if (chineseProxyRegions.includes(country)) {
        locale = 'zh'
      } else {
        // If it's explicitly US or Europe, maybe it's a real foreigner.
        locale = 'en'
      }
    } else {
      // Absolute ultimate fallback is zh, because this is a Chinese-owned product.
      locale = 'zh'
    }
  }

  // Rewrite URL and redirect
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  
  // Prevent CDN from caching this redirect
  const response = NextResponse.redirect(request.nextUrl)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next|api|proxy-html|favicon.ico).*)',
  ],
}
