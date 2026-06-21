import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

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

export function middleware(request: NextRequest) {
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

  if (!locale) {
    const country = request.headers.get('x-vercel-ip-country')
    if (country) {
      const chineseRegions = ['CN', 'HK', 'TW', 'MO', 'SG'] // Added SG because of Qiniu node
      locale = chineseRegions.includes(country) ? 'zh' : 'en'
    } else {
      locale = 'zh' // Changed ultimate fallback to zh based on primary audience
    }
  }

  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  
  // Create redirect response and PREVENT CDN CACHING
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
