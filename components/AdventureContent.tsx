'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { validateLanguage } from '@/app/translations'
import ProgressDisplay from '@/components/ProgressDisplay'
import Card from '@/components/ui/Card'
import { Map, Star, Trophy } from 'lucide-react'
import { getLevelRequiredForWorld, MAX_WORLD } from '@/lib/utils'

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

  // Show worlds up to MAX_WORLD, plus a few locked ones
  const maxWorldsToShow = Math.min(MAX_WORLD, Math.max(5, progress.current_world + 2))
  const worlds = Array.from({ length: maxWorldsToShow }, (_, i) => i + 1)

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t('adventure.worldMap')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <ProgressDisplay />
          
          <Card>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-adventure-purple" />
              {t('adventure.title')} Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm sm:text-base">{t('adventure.level')}</span>
                <span className="font-semibold text-lg">{progress.level}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm sm:text-base">Total {t('adventure.xp')}</span>
                <span className="font-semibold text-lg">{progress.total_xp}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm sm:text-base">{t('adventure.currentWorld')}</span>
                <span className="font-semibold text-lg">{progress.current_world}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-adventure-cyan" />
            {t('adventure.worldMap')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {worlds.map((world) => {
              const isUnlocked = world <= progress.current_world
              const isCurrent = world === progress.current_world
              const requiredLevel = getLevelRequiredForWorld(world)
              const isNext = world === progress.current_world + 1

              // Different world icons/themes
              const worldIcons = ['🌍', '🌎', '🌏', '🌊', '🏔️', '🌋', '🏝️', '❄️', '🌌', '⭐']
              const worldIcon = isUnlocked ? worldIcons[(world - 1) % worldIcons.length] : '🔒'

              return (
                <div
                  key={world}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 text-center transition-all touch-manipulation overflow-hidden ${
                    isCurrent
                      ? 'border-adventure-purple bg-gradient-to-br from-adventure-purple/30 to-adventure-pink/20 shadow-lg shadow-adventure-purple/50 scale-105'
                      : isUnlocked
                      ? 'border-adventure-cyan/50 bg-gradient-to-br from-adventure-cyan/10 to-adventure-cyan/5 hover:border-adventure-cyan hover:scale-105'
                      : isNext
                      ? 'border-gray-600 bg-adventure-dark/30 opacity-70 hover:opacity-90'
                      : 'border-gray-700 bg-adventure-dark/50 opacity-50'
                  }`}
                >
                  {/* Glow effect for current world */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-gradient-to-br from-adventure-purple/20 to-adventure-pink/20 animate-pulse-slow rounded-xl" />
                  )}
                  
                  <div className="relative z-10">
                    <div className={`text-3xl sm:text-4xl md:text-5xl mb-2 transition-transform ${
                      isCurrent ? 'animate-bounce' : isUnlocked ? 'hover:scale-110' : 'grayscale'
                    }`}>
                      {worldIcon}
                    </div>
                    
                    <div className={`font-bold text-sm sm:text-base mb-1 ${
                      isCurrent ? 'text-adventure-purple' : isUnlocked ? 'text-adventure-cyan' : 'text-gray-500'
                    }`}>
                      {t('adventure.currentWorld')} {world}
                    </div>
                    
                    {isCurrent && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-adventure-purple/20 rounded-full text-xs text-adventure-purple font-semibold mb-2">
                        <span className="w-2 h-2 bg-adventure-purple rounded-full animate-pulse" />
                        {t('adventure.current') || 'Current'}
                      </div>
                    )}
                    
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                          {t('adventure.level')} {requiredLevel} {t('adventure.required') || 'required'}
                        </div>
                        {isNext && progress.level >= requiredLevel - 2 && (
                          <div className="text-xs text-adventure-cyan font-medium">
                            {t('adventure.almostThere') || 'Almost there!'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isUnlocked && !isCurrent && (
                      <div className="text-xs text-adventure-cyan/70 mt-1">
                        ✓ {t('adventure.completed') || 'Completed'}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress indicator for next world */}
                  {isNext && !isUnlocked && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-adventure-dark">
                      <div
                        className="h-full bg-gradient-to-r from-adventure-purple to-adventure-pink transition-all duration-500"
                        style={{ width: `${Math.min((progress.level / requiredLevel) * 100, 100)}%` }}
                      />
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

