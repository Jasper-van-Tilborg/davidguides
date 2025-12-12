import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../translations'
import AchievementsContent from '@/components/AchievementsContent'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.achievements?.title || 'Achievements'} - ${t.common.appName}`,
    description: 'View your unlocked achievements and track your progress',
  }
}

export default async function AchievementsPage({ params }: Props) {
  return <AchievementsContent />
}





