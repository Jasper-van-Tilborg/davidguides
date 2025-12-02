import { Metadata } from 'next'
import { getTranslations, validateLanguage } from '../../translations'
import AdminContent from '@/components/AdminContent'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return {
    title: `${t.admin.title} - ${t.common.appName}`,
    description: 'Admin dashboard for managing templates, achievements, and translations',
  }
}

export default async function AdminPage({ params }: Props) {
  return <AdminContent />
}

