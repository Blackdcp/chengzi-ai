'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'

type GuideCtaLinkProps = {
  href: string
  lang: string
  slug: string
  children: React.ReactNode
}

export default function GuideCtaLink({ href, lang, slug, children }: GuideCtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        track('guide_cta_click', {
          href,
          lang,
          slug,
        })
      }}
    >
      {children}
    </Link>
  )
}
