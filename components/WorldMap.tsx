'use client'

import { useTranslation } from 'react-i18next'
import { useProgress } from '@/hooks/useProgress'
import { getLevelRequiredForWorld, MAX_WORLD } from '@/lib/utils'
import Card from '@/components/ui/Card'
import { Map, Lock, CheckCircle2, Sparkles, Globe, Globe2, GlobeAmericas, Waves, Mountain, Volcano, PalmTree, Snowflake, Sparkles as SparklesIcon, Star } from 'lucide-react'
import { getIconComponent } from '@/lib/iconHelper'

interface WorldMapProps {
  className?: string
}

// World themes with names and descriptions
const WORLD_THEMES = [
  { icon: 'globe', name: 'Starter World', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-400/50', description: 'Your journey begins here' },
  { icon: 'globe2', name: 'Forest Realm', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/50', description: 'Nature\'s embrace' },
  { icon: 'globeAmericas', name: 'Ocean Depths', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-400/50', description: 'Dive into the unknown' },
  { icon: 'waves', name: 'Waterfall Valley', bgColor: 'bg-teal-500/20', borderColor: 'border-teal-400/50', description: 'Flowing with purpose' },
  { icon: 'mountain', name: 'Mountain Peak', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-400/50', description: 'Reach new heights' },
  { icon: 'volcano', name: 'Volcanic Lands', bgColor: 'bg-red-500/20', borderColor: 'border-red-400/50', description: 'Fire and determination' },
  { icon: 'palmTree', name: 'Tropical Paradise', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/50', description: 'Sunshine and growth' },
  { icon: 'snowflake', name: 'Frozen Tundra', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-400/50', description: 'Cool and collected' },
  { icon: 'cosmic', name: 'Cosmic Realm', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-400/50', description: 'Beyond the stars' },
  { icon: 'legendary', name: 'Legendary World', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/50', description: 'The ultimate challenge' },
]

export default function WorldMap({ className = '' }: WorldMapProps) {
  const { t } = useTranslation()
  const { progress } = useProgress()

  if (!progress) {
    return null
  }

  // Show worlds up to MAX_WORLD, plus a few locked ones
  const maxWorldsToShow = Math.min(MAX_WORLD, Math.max(5, progress.current_world + 2))
  const worlds = Array.from({ length: maxWorldsToShow }, (_, i) => i + 1)

  return (
    <Card className={className}>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
          <Map className="w-5 h-5 text-adventure-secondary" />
          {t('adventure.worldMap')}
        </h2>
        <p className="text-sm text-adventure-light/70">
          {t('adventure.worldMapDescription') || 'Explore unlocked worlds and track your progress'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {worlds.map((world) => {
          const isUnlocked = world <= progress.current_world
          const isCurrent = world === progress.current_world
          const requiredLevel = getLevelRequiredForWorld(world)
          const isNext = world === progress.current_world + 1
          const theme = WORLD_THEMES[(world - 1) % WORLD_THEMES.length]

          return (
            <div
              key={world}
              className={`relative group rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                isCurrent
                  ? 'border-adventure-main bg-adventure-main/30 shadow-2xl shadow-adventure-main/50 scale-105 z-10'
                  : isUnlocked
                  ? `border-adventure-secondary/50 ${theme.bgColor} hover:border-adventure-secondary hover:scale-105 hover:shadow-lg`
                  : isNext
                  ? 'border-adventure-light/20 bg-adventure-dark/40 opacity-75 hover:opacity-90'
                  : 'border-adventure-light/10 bg-adventure-dark/50 opacity-50'
              }`}
            >
              {/* Subtle background effect for current world */}
              {isCurrent && (
                <div className="absolute inset-0 bg-adventure-main/20 animate-pulse-slow" />
              )}

              {/* Subtle glow effect */}
              {isCurrent && (
                <div className="absolute -inset-1 bg-adventure-main/30 rounded-xl blur opacity-40 animate-pulse" />
              )}

              <div className="relative z-10 p-4 sm:p-6">
                {/* World Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`transition-transform ${
                    isCurrent ? 'animate-bounce' : isUnlocked ? 'group-hover:scale-110' : 'grayscale opacity-50'
                  }`}>
                    {(() => {
                      if (!isUnlocked) {
                        const LockIcon = Lock
                        return <LockIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-adventure-text opacity-50" />
                      }
                      const IconComponent = getIconComponent(theme.icon)
                      return IconComponent ? (
                        <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-adventure-text" />
                      ) : null
                    })()}
                  </div>
                  
                  {isUnlocked && !isCurrent && (
                    <CheckCircle2 className="w-5 h-5 text-adventure-secondary" />
                  )}
                  
                  {isCurrent && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-adventure-main/30 rounded-full">
                      <Sparkles className="w-4 h-4 text-adventure-text animate-pulse" />
                      <span className="text-xs font-semibold text-adventure-text">
                        {t('adventure.current') || 'Current'}
                      </span>
                    </div>
                  )}
                </div>

                {/* World Info */}
                <div className="space-y-2">
                  <div>
                    <h3 className={`font-bold text-base sm:text-lg mb-1 ${
                      isCurrent ? 'text-adventure-text' : isUnlocked ? 'text-adventure-secondary' : 'text-adventure-light/50'
                    }`}>
                      {t('adventure.currentWorld')} {world}
                    </h3>
                    {isUnlocked && (
                      <p className="text-xs text-adventure-light/70">{theme.name}</p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {isCurrent && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-adventure-main/20 rounded-full text-xs text-adventure-text font-medium">
                      <span className="w-2 h-2 bg-adventure-main rounded-full animate-pulse" />
                      {theme.description}
                    </div>
                  )}

                  {/* Locked World Info */}
                  {!isUnlocked && (
                    <div className="space-y-2 pt-2 border-t border-adventure-light/10">
                      <div className="flex items-center gap-2 text-xs text-adventure-light/70">
                        <Lock className="w-4 h-4" />
                        <span>
                          {t('adventure.level')} {requiredLevel} {t('adventure.required') || 'required'}
                        </span>
                      </div>
                      
                      {isNext && progress.level >= requiredLevel - 2 && (
                        <div className="text-xs text-adventure-secondary font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {t('adventure.almostThere') || 'Almost there!'}
                        </div>
                      )}

                      {/* Progress bar for next world */}
                      {isNext && (
                        <div className="w-full rounded-full h-1.5 bg-adventure-dark overflow-hidden">
                          <div
                            className="h-full rounded-full bg-adventure-main transition-all duration-500"
                            style={{ width: `${Math.min((progress.level / requiredLevel) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completed World Badge */}
                  {isUnlocked && !isCurrent && (
                    <div className="text-xs text-adventure-secondary/70 flex items-center gap-1 pt-2 border-t border-adventure-secondary/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('adventure.completed') || 'Completed'}
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative corner accent */}
              {isCurrent && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-adventure-main/15 rounded-bl-full" />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-adventure-main/20 flex flex-wrap gap-4 text-xs sm:text-sm text-adventure-light/70">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg border-2 border-adventure-main bg-adventure-main/30" />
          <span>{t('adventure.current') || 'Current World'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg border-2 border-adventure-secondary/50 bg-adventure-secondary/20" />
          <span>{t('adventure.completed') || 'Unlocked'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg border-2 border-adventure-light/20 bg-adventure-dark/40 opacity-75" />
          <span>{t('adventure.locked') || 'Locked'}</span>
        </div>
      </div>
    </Card>
  )
}

