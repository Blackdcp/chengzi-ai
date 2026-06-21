import { getDictionary } from '../../lib/dictionaries'
import ClientPage from './ClientPage'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)
  
  return <ClientPage dict={dict} />
}
