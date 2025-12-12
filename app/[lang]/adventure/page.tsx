import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../translations'
import AdventureContent from '@/components/AdventureContent'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.adventure.title} - ${t.common.appName}`,
    description: 'Explore your adventure world and track your progress',
  }
}

export default async function AdventurePage({ params }: Props) {
  return <AdventureContent />
}





