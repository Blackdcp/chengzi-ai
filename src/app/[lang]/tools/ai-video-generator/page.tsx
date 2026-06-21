import { getDictionary } from '../../../../lib/dictionaries';
import AiVideoClient from './ClientPage';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  
  return {
    title: lang === 'en' ? 'Free AI Video Generator - Text to Video | ChengZi AI' : '免费 AI 视频生成器 - 文本生成视频 | 橙子 AI',
    description: lang === 'en' ? 'Generate stunning cinematic videos from text prompts for free using advanced AI models.' : '使用先进的 AI 模型免费将文本提示生成令人惊叹的电影级视频。',
  };
}

export default async function AiVideoGeneratorPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return <AiVideoClient dict={dict} lang={lang} />;
}
