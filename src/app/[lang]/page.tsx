import { getDictionary } from '../../lib/dictionaries'
import { getProducts } from '../../lib/api'
import ClientPage from './ClientPage'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const refCode = resolvedSearchParams.ref || ''
  const dict = await getDictionary(resolvedParams.lang)
  const products = getProducts(resolvedParams.lang)
  
  return <ClientPage dict={dict} products={products} lang={resolvedParams.lang} refCode={refCode as string} />
}
