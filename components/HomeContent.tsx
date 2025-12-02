'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function HomeContent() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-adventure-purple to-adventure-pink bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <LanguageSwitcher />
        </header>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Start Your Adventure
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your daily habits into an epic adventure. Complete habits, earn XP, level up, and explore new worlds!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-adventure-purple hover:bg-adventure-purple/80 rounded-lg font-semibold transition-colors"
            >
              {t('auth.signIn')}
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-adventure-cyan hover:bg-adventure-cyan/80 rounded-lg font-semibold transition-colors"
            >
              {t('auth.signUp')}
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-adventure-dark/50 p-6 rounded-lg border border-adventure-purple/20">
            <h3 className="text-xl font-semibold mb-2 text-adventure-purple">
              🎮 Gamified
            </h3>
            <p className="text-gray-300">
              Earn XP and level up as you complete your daily habits
            </p>
          </div>
          <div className="bg-adventure-dark/50 p-6 rounded-lg border border-adventure-cyan/20">
            <h3 className="text-xl font-semibold mb-2 text-adventure-cyan">
              🌍 Adventure
            </h3>
            <p className="text-gray-300">
              Explore new worlds and unlock achievements
            </p>
          </div>
          <div className="bg-adventure-dark/50 p-6 rounded-lg border border-adventure-pink/20">
            <h3 className="text-xl font-semibold mb-2 text-adventure-pink">
              📱 PWA
            </h3>
            <p className="text-gray-300">
              Install as an app and use it offline
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

