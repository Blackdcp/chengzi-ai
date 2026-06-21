import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

// Helper to get locale from Accept-Language header
function getLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, proxy routes, Next.js internals, and static files
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

  // Determine locale based on Vercel GEO header first, fallback to browser language
  let locale = 'zh'
  const country = request.headers.get('x-vercel-ip-country')

  if (country) {
    // If Vercel provides the country code
    const chineseRegions = ['CN', 'HK', 'TW', 'MO']
    locale = chineseRegions.includes(country) ? 'zh' : 'en'
  } else {
    // Localhost fallback
    locale = getLocale(request)
  }

  // Redirect to the locale-prefixed path
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|proxy-html|favicon.ico).*)',
  ],
}
