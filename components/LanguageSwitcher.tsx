'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Globe } from 'lucide-react'
import { validateLanguage } from '@/app/translations'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  // Extract language from pathname
  const lang = pathname.split('/')[1] || 'nl'
  const currentLang = validateLanguage(lang)

  // Sync i18n with URL language
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang)
    }
  }, [currentLang, i18n])

  const changeLanguage = (newLang: string) => {
    // Extract current page path after language code
    const currentPage = pathname.split('/').slice(2).join('/') || ''
    const newPath = currentPage ? `/${newLang}/${currentPage}` : `/${newLang}`
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-adventure-light/70" />
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-lg ${
          currentLang === 'en'
            ? 'bg-adventure-main text-adventure-light'
            : 'text-adventure-light/70 hover:text-adventure-light'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('nl')}
        className={`px-3 py-1 rounded-lg ${
          currentLang === 'nl'
            ? 'bg-adventure-main text-adventure-light'
            : 'text-adventure-light/70 hover:text-adventure-light'
        }`}
      >
        NL
      </button>
    </div>
  )
}

