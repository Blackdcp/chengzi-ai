import { NextResponse, type NextRequest } from 'next/server'

const retiredProductSlugs = new Set([
  'marketing-douyin',
  'marketing-wechat',
  'marketing-xiaohongshu',
])

function goneResponse() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  })
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()

  if (/^\/(?:zh|en)?\/?blog(?:\/|$)/.test(pathname)) {
    return goneResponse()
  }

  const productMatch = pathname.match(/^\/(?:zh|en)\/products\/([^/]+)\/?$/)
  if (productMatch && retiredProductSlugs.has(productMatch[1])) {
    return goneResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/blog/:path*',
    '/:lang(zh|en)/blog/:path*',
    '/:lang(zh|en)/products/:slug',
  ],
}
