import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']

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

  // ULTIMATE FIX: Do not guess. Do not read headers. Do not read IP.
  // ALWAYS redirect naked URLs to /zh.
  // If users want English, they can click the English button in the navbar.
  const locale = 'zh'

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
