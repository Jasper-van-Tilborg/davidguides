'use client'

import { useTranslation } from 'react-i18next'
import type { Achievement } from '@/types'
import Card from '@/components/ui/Card'
import { Trophy, Lock } from 'lucide-react'
import { getIconComponent } from '@/lib/iconHelper'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress: number
}

export default function AchievementCard({ achievement, isUnlocked, progress }: AchievementCardProps) {
  const { t } = useTranslation()

  return (
    <Card className={`relative overflow-hidden hover-lift ${isUnlocked ? 'border-adventure-secondary/40' : 'opacity-75'}`}>
      {isUnlocked && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-adventure-main to-adventure-secondary text-adventure-light px-3 py-1.5 text-xs font-bold rounded-bl-lg shadow-lg animate-pulse-slow">
          {t('common.completed') || 'Unlocked'}
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`
          flex-shrink-0 
          transition-all duration-300
          ${isUnlocked ? 'drop-shadow-lg scale-110' : 'grayscale opacity-60'}
        `}>
          {(() => {
            const IconComponent = getIconComponent(achievement.icon || 'trophy')
            return IconComponent ? (
              <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 text-adventure-text" />
            ) : null
          })()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`
              text-lg sm:text-xl font-bold 
              ${isUnlocked ? 'text-adventure-text' : 'text-adventure-light/80'}
            `}>
              {achievement.name}
            </h3>
            {!isUnlocked && (
              <Lock className="w-4 h-4 text-adventure-light/70 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm sm:text-base text-adventure-light/90 mb-4 leading-relaxed">
            {achievement.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-adventure-light/90 font-semibold">
                {achievement.type === 'streak' && t('habits.streak')}
                {achievement.type === 'total_completions' && 'Completions'}
                {achievement.type === 'level' && t('adventure.level')}
                {achievement.type === 'world' && t('adventure.currentWorld')}
              </span>
              <span className="px-3 py-1.5 bg-adventure-secondary/25 rounded-lg border-2 border-adventure-secondary/50 font-bold text-adventure-secondary shadow-sm">
                +{achievement.xp_reward} {t('adventure.xp')}
              </span>
            </div>
            
            {!isUnlocked && (
              <div className="space-y-1">
                <div className="w-full rounded-full bg-adventure-dark h-2.5 overflow-hidden border-2 border-adventure-main/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-adventure-main to-adventure-secondary transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-adventure-light/90 text-right font-semibold">
                  {Math.round(progress)}%
                </div>
              </div>
            )}
            
            {isUnlocked && (
              <div className="flex items-center gap-2 px-3 py-2 bg-adventure-main/20 rounded-lg border-2 border-adventure-main/40">
                <span className="text-adventure-main text-lg">✓</span>
                <span className="text-sm text-adventure-main font-bold">
                  {t('common.completed') || 'Achievement Unlocked!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


