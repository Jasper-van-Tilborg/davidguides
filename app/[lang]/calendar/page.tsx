import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../translations'
import CalendarContent from '@/components/CalendarContent'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.calendar?.title || 'Calendar'} - ${t.common.appName}`,
    description: 'View your habits and progress by day in the calendar',
  }
}

export default async function CalendarPage({ params }: Props) {
  return <CalendarContent />
}

