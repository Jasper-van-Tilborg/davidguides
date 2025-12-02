'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { validateLanguage } from '@/app/translations'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Sync i18n language with URL
  useEffect(() => {
    if (pathname) {
      const lang = pathname.split('/')[1] || 'nl'
      const validLang = validateLanguage(lang)
      if (i18n.language !== validLang) {
        i18n.changeLanguage(validLang)
      }
    }
  }, [pathname])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

