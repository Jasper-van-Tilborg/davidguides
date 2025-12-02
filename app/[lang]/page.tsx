import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../translations'
import HomeContent from '@/components/HomeContent'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: t.common.appName,
    description: 'Track your daily habits in an adventure game format',
  }
}

export default async function HomePage({ params }: Props) {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)

  return <HomeContent lang={lang} />
}

