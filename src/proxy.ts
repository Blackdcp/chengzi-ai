import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') || ''
  const lowerLang = acceptLang.toLowerCase()
  
  // Only return English if they EXPLICITLY ask for English and DO NOT ask for Chinese
  if (lowerLang.includes('en') && !lowerLang.includes('zh')) {
    return 'en'
  }
  
  // Otherwise, if they ask for Chinese, return Chinese
  if (lowerLang.includes('zh') || lowerLang.includes('cn')) {
    return 'zh'
  }
  
  return ''
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/proxy-html') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  let locale = getLocale(request)

  // CRITICAL FIX: Qiniu CDN's origin-pull servers are located in the US/Europe!
  // This means x-vercel-ip-country will evaluate to "US".
  // Furthermore, CDNs often strip Accept-Language headers.
  // Therefore, if locale is unknown (stripped), we MUST default to 'zh'.
  if (!locale) {
    locale = 'zh'
  }

  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  
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
