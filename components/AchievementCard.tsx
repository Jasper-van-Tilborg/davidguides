'use client'

import { useTranslation } from 'react-i18next'
import type { Achievement } from '@/types'
import Card from '@/components/ui/Card'
import { Trophy, Lock } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress: number
}

export default function AchievementCard({ achievement, isUnlocked, progress }: AchievementCardProps) {
  const { t } = useTranslation()

  return (
    <Card className={`relative overflow-hidden ${isUnlocked ? '' : 'opacity-60'}`}>
      {isUnlocked && (
        <div className="absolute top-0 right-0 bg-adventure-purple text-white px-2 py-1 text-xs font-semibold rounded-bl-lg">
          {t('common.completed') || 'Unlocked'}
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`text-4xl sm:text-5xl flex-shrink-0 ${isUnlocked ? '' : 'grayscale'}`}>
          {achievement.icon || '🏆'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg sm:text-xl font-semibold ${isUnlocked ? 'text-adventure-purple' : 'text-gray-400'}`}>
              {achievement.name}
            </h3>
            {!isUnlocked && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          </div>
          
          <p className="text-sm sm:text-base text-gray-300 mb-3">
            {achievement.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-400">
                {achievement.type === 'streak' && t('habits.streak')}
                {achievement.type === 'total_completions' && 'Completions'}
                {achievement.type === 'level' && t('adventure.level')}
                {achievement.type === 'world' && t('adventure.currentWorld')}
              </span>
              <span className="font-semibold text-adventure-cyan">
                +{achievement.xp_reward} {t('adventure.xp')}
              </span>
            </div>
            
            {!isUnlocked && (
              <div className="w-full bg-adventure-dark rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-adventure-purple to-adventure-pink transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}
            
            {isUnlocked && (
              <div className="text-xs text-adventure-purple font-medium">
                ✓ {t('common.completed') || 'Achievement Unlocked!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

