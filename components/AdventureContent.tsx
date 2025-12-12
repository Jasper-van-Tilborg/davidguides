'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { validateLanguage } from '@/app/translations'
import ProgressDisplay from '@/components/ProgressDisplay'
import WorldMap from '@/components/WorldMap'
import Card from '@/components/ui/Card'
import { Trophy } from 'lucide-react'

export default function AdventureContent() {
  const { t } = useTranslation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { progress } = useProgress()
  const router = useRouter()
  const pathname = usePathname()

  // Extract language from pathname
  const lang = pathname.split('/')[1] || 'nl'
  const validLang = validateLanguage(lang)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${validLang}/auth/signin`)
    }
  }, [isAuthenticated, authLoading, router, validLang])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!isAuthenticated || !progress) {
    return null
  }

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-medium mb-6 sm:mb-8 text-adventure-text">
          {t('adventure.worldMap')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <ProgressDisplay />
          
          <Card>
            <h2 className="text-lg sm:text-xl font-medium mb-4 flex items-center gap-2 text-adventure-text">
              <Trophy className="w-5 h-5 text-adventure-text" />
              {t('adventure.title')} Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-adventure-dark border border-adventure-border">
                <span className="text-adventure-text-secondary text-sm sm:text-base font-medium">{t('adventure.level')}</span>
                <span className="font-medium text-lg text-adventure-text">{progress.level}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-adventure-dark border border-adventure-border">
                <span className="text-adventure-text-secondary text-sm sm:text-base font-medium">Total {t('adventure.xp')}</span>
                <span className="font-medium text-lg text-adventure-text">{progress.total_xp}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-adventure-dark border border-adventure-border">
                <span className="text-adventure-text-secondary text-sm sm:text-base font-medium">{t('adventure.currentWorld')}</span>
                <span className="font-medium text-lg text-adventure-text">{progress.current_world}</span>
              </div>
            </div>
          </Card>
        </div>

        <WorldMap />
      </main>
    </div>
  )
}

