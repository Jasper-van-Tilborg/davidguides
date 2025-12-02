'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useAchievements } from '@/hooks/useAchievements'
import { validateLanguage } from '@/app/translations'
import { useRouter } from 'next/navigation'
import AchievementCard from '@/components/AchievementCard'
import AchievementNotification from '@/components/AchievementNotification'
import { Trophy } from 'lucide-react'

export default function AchievementsContent() {
  const { t } = useTranslation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { achievements, userAchievements, loading, newlyUnlocked, checkForNewAchievements, isUnlocked, getAchievementProgress } = useAchievements()
  const router = useRouter()
  const pathname = usePathname()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [notificationAchievement, setNotificationAchievement] = useState<typeof achievements[0] | null>(null)

  const lang = pathname.split('/')[1] || 'nl'
  const validLang = validateLanguage(lang)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${validLang}/auth/signin`)
    }
  }, [isAuthenticated, authLoading, router, validLang])

  useEffect(() => {
    // Check for achievements on mount
    if (isAuthenticated) {
      checkForNewAchievements()
    }
  }, [isAuthenticated, checkForNewAchievements])

  useEffect(() => {
    // Show notification for newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const achievement = achievements.find(a => a.id === newlyUnlocked[0])
      if (achievement) {
        setNotificationAchievement(achievement)
      }
    }
  }, [newlyUnlocked, achievements])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const categories = ['all', 'habits', 'progress', 'streaks', 'special'] as const
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = userAchievements.length
  const totalCount = achievements.length

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-adventure-purple" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              {t('achievements.title') || 'Achievements'}
            </h1>
          </div>
          
          <div className="text-sm sm:text-base text-gray-300">
            {unlockedCount} / {totalCount} {t('achievements.unlocked') || 'unlocked'}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-adventure-purple text-white'
                  : 'bg-adventure-dark/50 text-gray-300 hover:bg-adventure-dark/70'
              }`}
            >
              {t(`achievements.categories.${category}`) || category}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {t('achievements.noAchievements') || 'No achievements found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked(achievement.id)}
                progress={getAchievementProgress(achievement)}
              />
            ))}
          </div>
        )}

        {/* Achievement Notification */}
        {notificationAchievement && (
          <AchievementNotification
            achievement={notificationAchievement}
            onClose={() => setNotificationAchievement(null)}
          />
        )}
      </main>
    </div>
  )
}

