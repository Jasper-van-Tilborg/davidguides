import { getTranslations, validateLanguage } from '../translations'
import Navigation from '@/components/Navigation'
import { CalendarProvider } from '@/contexts/CalendarContext'

export async function generateStaticParams() {
  return [{ lang: 'nl' }, { lang: 'en' }]
}

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang = validateLanguage(langParam)
  const t = getTranslations(lang)

  return (
    <CalendarProvider>
      <div className="min-h-screen">
        <Navigation lang={lang} />
        <main>{children}</main>
      </div>
    </CalendarProvider>
  )
}

