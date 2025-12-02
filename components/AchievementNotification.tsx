'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Achievement } from '@/types'
import { Trophy, X } from 'lucide-react'

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
      <div className="bg-adventure-dark border-2 border-adventure-purple rounded-lg p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0 animate-bounce">
            {achievement.icon || '🏆'}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-adventure-purple flex-shrink-0" />
              <h3 className="text-lg font-bold text-adventure-purple">
                {t('common.achievementUnlocked') || 'Achievement Unlocked!'}
              </h3>
            </div>
            
            <p className="text-base font-semibold text-white mb-1">
              {achievement.name}
            </p>
            
            <p className="text-sm text-gray-300 mb-2">
              {achievement.description}
            </p>
            
            <div className="text-sm text-adventure-cyan font-semibold">
              +{achievement.xp_reward} {t('adventure.xp')} {t('common.earned') || 'earned!'}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

