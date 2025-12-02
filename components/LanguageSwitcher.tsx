'use client'

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lng)
    }
  }

  // Load saved language preference
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language')
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-gray-400" />
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'en'
            ? 'bg-adventure-purple text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('nl')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'nl'
            ? 'bg-adventure-purple text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        NL
      </button>
    </div>
  )
}

