'use client'

import { useTranslation } from 'react-i18next'
import { useProgress } from '@/hooks/useProgress'
import { getXPForNextLevel, getProgressPercentage } from '@/lib/utils'
import { Trophy, Star } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function ProgressDisplay() {
  const { t } = useTranslation()
  const { progress } = useProgress()

  if (!progress) {
    return null
  }

  const xpForNextLevel = getXPForNextLevel(progress.total_xp)
  const progressPercentage = getProgressPercentage(progress.total_xp)

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('adventure.title')}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-adventure-purple flex-shrink-0" />
            <span className="text-base sm:text-lg font-semibold">
              {t('adventure.level')} {progress.level}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-adventure-cyan flex-shrink-0" />
            <span className="text-base sm:text-lg font-semibold">
              {progress.total_xp} {t('adventure.xp')}
            </span>
          </div>
          <div className="text-adventure-pink text-base sm:text-lg">
            🌍 {t('adventure.currentWorld')} {progress.current_world}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{t('adventure.progress')}</span>
          <span className="text-xs sm:text-sm">
            {xpForNextLevel} {t('adventure.xp')} {t('adventure.nextLevel')}
          </span>
        </div>
        <div className="w-full bg-adventure-dark rounded-full h-3 sm:h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-adventure-purple to-adventure-pink transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  )
}

