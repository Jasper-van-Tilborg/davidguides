'use client'

import { useTranslation } from 'react-i18next'
import { useProgress } from '@/hooks/useProgress'
import { getXPForNextLevel, getProgressPercentage } from '@/lib/utils'
import { Trophy, Star, Globe } from 'lucide-react'
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
    <Card className="hover-lift">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-adventure-text">
          {t('adventure.title')}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-adventure-main border border-adventure-border">
            <Trophy className="w-5 h-5 text-adventure-text flex-shrink-0" />
            <span className="text-base sm:text-lg font-medium text-adventure-light">
              {t('adventure.level')} {progress.level}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-adventure-main border border-adventure-border">
            <Star className="w-5 h-5 text-adventure-text flex-shrink-0" />
            <span className="text-base sm:text-lg font-medium text-adventure-light">
              {progress.total_xp} {t('adventure.xp')}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-adventure-main border border-adventure-border text-base sm:text-lg font-medium">
            <Globe className="w-5 h-5 text-adventure-text flex-shrink-0" />
            <span className="text-adventure-text">
              {t('adventure.currentWorld')} {progress.current_world}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-adventure-light">
          <span className="font-medium">{t('adventure.progress')}</span>
          <span className="text-xs sm:text-sm font-medium text-adventure-text">
            {xpForNextLevel} {t('adventure.xp')} {t('adventure.nextLevel')}
          </span>
        </div>
        <div className="w-full rounded-full bg-adventure-dark border border-adventure-border h-1">
          <div
            className="h-full rounded-full bg-adventure-text transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  )
}

