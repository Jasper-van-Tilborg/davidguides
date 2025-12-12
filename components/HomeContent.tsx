'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Language } from '@/app/translations'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Gamepad2, Globe, Smartphone } from 'lucide-react'

interface HomeContentProps {
  lang: Language
}

export default function HomeContent({ lang }: HomeContentProps) {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile optimized */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-adventure-text">
            {t('common.appName')}
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <LanguageSwitcher />
          </div>
        </header>

        {/* Hero Section - Mobile optimized */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4 text-adventure-text">
            Start Your Adventure
          </h2>
          <p className="text-adventure-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-4 text-sm sm:text-base leading-relaxed">
            Transform your daily habits into an epic adventure. Complete habits, earn XP, level up, and explore new worlds!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href={`/${lang}/auth/signin`}
              className="px-6 py-3.5 rounded-lg bg-adventure-text hover:opacity-80 font-medium transition-opacity text-center touch-manipulation min-h-[44px] flex items-center justify-center text-adventure-dark"
            >
              {t('auth.signIn')}
            </Link>
            <Link
              href={`/${lang}/auth/signup`}
              className="px-6 py-3.5 rounded-lg bg-adventure-main border border-adventure-text hover:bg-adventure-text hover:text-adventure-dark font-medium transition-all text-center touch-manipulation min-h-[44px] flex items-center justify-center text-adventure-text"
            >
              {t('auth.signUp')}
            </Link>
          </div>
        </div>

        {/* Features Grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <div className="rounded-xl bg-adventure-main border border-adventure-border p-5 sm:p-6 transition-opacity hover:opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-5 h-5 text-adventure-text" />
              <h3 className="text-lg sm:text-xl font-medium text-adventure-text">
                Gamified
              </h3>
            </div>
            <p className="text-adventure-text-secondary text-sm sm:text-base leading-relaxed">
              Earn XP and level up as you complete your daily habits
            </p>
          </div>
          <div className="rounded-xl bg-adventure-main border border-adventure-border p-5 sm:p-6 transition-opacity hover:opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-adventure-text" />
              <h3 className="text-lg sm:text-xl font-medium text-adventure-text">
                Adventure
              </h3>
            </div>
            <p className="text-adventure-text-secondary text-sm sm:text-base leading-relaxed">
              Explore new worlds and unlock achievements
            </p>
          </div>
          <div className="rounded-xl bg-adventure-main border border-adventure-border p-5 sm:p-6 transition-opacity hover:opacity-90 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-adventure-text" />
              <h3 className="text-lg sm:text-xl font-medium text-adventure-text">
                PWA
              </h3>
            </div>
            <p className="text-adventure-text-secondary text-sm sm:text-base leading-relaxed">
              Install as an app and use it offline
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

