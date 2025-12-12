'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Achievement } from '@/types'
import { Trophy, X } from 'lucide-react'
import { getIconComponent } from '@/lib/iconHelper'

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-adventure-dark border-2 border-adventure-main rounded-lg p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 animate-bounce">
            {(() => {
              const IconComponent = getIconComponent(achievement.icon || 'trophy')
              return IconComponent ? (
                <IconComponent className="w-10 h-10 text-adventure-text" />
              ) : null
            })()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-adventure-main flex-shrink-0" />
              <h3 className="text-lg font-bold text-adventure-main">
                {t('common.achievementUnlocked') || 'Achievement Unlocked!'}
              </h3>
            </div>
            
            <p className="text-base font-semibold text-adventure-light mb-1">
              {achievement.name}
            </p>
            
            <p className="text-sm text-adventure-light/70 mb-2">
              {achievement.description}
            </p>
            
            <div className="text-sm text-adventure-secondary font-semibold">
              +{achievement.xp_reward} {t('adventure.xp')} {t('common.earned') || 'earned!'}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-adventure-light/70 hover:text-adventure-light transition-colors p-1 rounded-lg touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}


