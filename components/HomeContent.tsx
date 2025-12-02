'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Language } from '@/app/translations'
import LanguageSwitcher from '@/components/LanguageSwitcher'

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-adventure-purple to-adventure-pink bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <LanguageSwitcher />
          </div>
        </header>

        {/* Hero Section - Mobile optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 px-4">
            Start Your Adventure
          </h2>
          <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 text-sm sm:text-base leading-relaxed">
            Transform your daily habits into an epic adventure. Complete habits, earn XP, level up, and explore new worlds!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href={`/${lang}/auth/signin`}
              className="px-6 py-3.5 bg-adventure-purple hover:bg-adventure-purple/80 active:bg-adventure-purple/70 rounded-lg font-semibold transition-colors text-center touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('auth.signIn')}
            </Link>
            <Link
              href={`/${lang}/auth/signup`}
              className="px-6 py-3.5 bg-adventure-cyan hover:bg-adventure-cyan/80 active:bg-adventure-cyan/70 rounded-lg font-semibold transition-colors text-center touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('auth.signUp')}
            </Link>
          </div>
        </div>

        {/* Features Grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <div className="bg-adventure-dark/50 p-5 sm:p-6 rounded-lg border border-adventure-purple/20 hover:border-adventure-purple/40 transition-colors">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-adventure-purple">
              🎮 Gamified
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Earn XP and level up as you complete your daily habits
            </p>
          </div>
          <div className="bg-adventure-dark/50 p-5 sm:p-6 rounded-lg border border-adventure-cyan/20 hover:border-adventure-cyan/40 transition-colors">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-adventure-cyan">
              🌍 Adventure
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Explore new worlds and unlock achievements
            </p>
          </div>
          <div className="bg-adventure-dark/50 p-5 sm:p-6 rounded-lg border border-adventure-pink/20 hover:border-adventure-pink/40 transition-colors sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-adventure-pink">
              📱 PWA
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Install as an app and use it offline
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

