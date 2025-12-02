'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import Navigation from '@/components/Navigation'
import ProgressDisplay from '@/components/ProgressDisplay'
import Card from '@/components/ui/Card'
import { Map, Star, Trophy } from 'lucide-react'

export default function AdventureContent() {
  const { t } = useTranslation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { progress } = useProgress()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

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

  // Simple world visualization
  const worlds = Array.from({ length: Math.max(5, progress.current_world + 2) }, (_, i) => i + 1)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('adventure.worldMap')}</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ProgressDisplay />
          
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-adventure-purple" />
              {t('adventure.title')} Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('adventure.level')}</span>
                <span className="font-semibold">{progress.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total {t('adventure.xp')}</span>
                <span className="font-semibold">{progress.total_xp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('adventure.currentWorld')}</span>
                <span className="font-semibold">{progress.current_world}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-adventure-cyan" />
            {t('adventure.worldMap')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {worlds.map((world) => {
              const isUnlocked = world <= progress.current_world
              const isCurrent = world === progress.current_world

              return (
                <div
                  key={world}
                  className={`p-6 rounded-lg border-2 text-center transition-all ${
                    isUnlocked
                      ? isCurrent
                        ? 'border-adventure-purple bg-adventure-purple/20'
                        : 'border-adventure-cyan/50 bg-adventure-cyan/10'
                      : 'border-gray-700 bg-adventure-dark/50 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {isUnlocked ? '🌍' : '🔒'}
                  </div>
                  <div className="font-semibold">World {world}</div>
                  {isCurrent && (
                    <div className="text-xs text-adventure-purple mt-1">Current</div>
                  )}
                  {!isUnlocked && (
                    <div className="text-xs text-gray-500 mt-1">
                      Level {world * 5} required
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </main>
    </div>
  )
}

