import { getDictionary } from '../../../lib/dictionaries'
import ApiServiceClientPage from './ApiServiceClientPage'

export default async function ApiServicePage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ApiServiceClientPage dict={dict} lang={lang} />;
}
