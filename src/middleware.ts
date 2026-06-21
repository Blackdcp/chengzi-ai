import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

// Helper to get locale from Accept-Language header
function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language')
  if (!acceptLang) return ''
  const headers = { 'accept-language': acceptLang }
  try {
    const languages = new Negotiator({ headers }).languages()
    return match(languages, locales, defaultLocale)
  } catch (e) {
    return ''
  }
}

export default function middleware(request: NextRequest) {
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

  // 1. Prioritize browser language (Accept-Language) because CDN/VPNs mask real IP
  let locale = getLocale(request)

  // 2. Fallback to Vercel GEO header if Accept-Language is missing
  if (!locale) {
    const country = request.headers.get('x-vercel-ip-country')
    if (country) {
      const chineseRegions = ['CN', 'HK', 'TW', 'MO']
      locale = chineseRegions.includes(country) ? 'zh' : 'en'
    } else {
      locale = 'en' // Ultimate fallback
    }
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
