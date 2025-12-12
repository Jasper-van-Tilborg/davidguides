'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { checkAchievements, initializeAchievements } from '@/lib/achievements'
import type { Achievement, UserAchievement } from '@/types'

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = () => {
    initializeAchievements()
    const allAchievements = storage.getAchievements()
    const user = storage.getCurrentUser()
    
    if (user) {
      const unlocked = storage.getUserAchievements().filter(ua => ua.user_id === user.id)
      setUserAchievements(unlocked)
    } else {
      setUserAchievements([])
    }
    
    setAchievements(allAchievements)
    setLoading(false)
  }

  const checkForNewAchievements = (): string[] => {
    const unlockedIds = checkAchievements()
    if (unlockedIds.length > 0) {
      setNewlyUnlocked(unlockedIds)
      loadAchievements() // Reload to get updated list
      // Clear after 5 seconds
      setTimeout(() => setNewlyUnlocked([]), 5000)
    }
    return unlockedIds
  }

  const getUnlockedAchievement = (achievementId: string): UserAchievement | null => {
    return userAchievements.find(ua => ua.achievement_id === achievementId) || null
  }

  const isUnlocked = (achievementId: string): boolean => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  const getAchievementProgress = (achievement: Achievement): number => {
    const user = storage.getCurrentUser()
    if (!user) return 0

    const progress = storage.getProgress()
    const habits = storage.getHabits()
    const checkIns = storage.getCheckIns()

    if (!progress) return 0

    switch (achievement.type) {
      case 'level':
        return Math.min(progress.level / achievement.requirement, 1) * 100
      case 'world':
        return Math.min(progress.current_world / achievement.requirement, 1) * 100
      case 'streak': {
        let maxStreak = 0
        for (const habit of habits) {
          const habitCheckIns = checkIns
            .filter(ci => ci.habit_id === habit.id && ci.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          let streak = 0
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          for (let i = 0; i < habitCheckIns.length; i++) {
            const checkInDate = new Date(habitCheckIns[i].date)
            checkInDate.setHours(0, 0, 0, 0)
            const expectedDate = new Date(today)
            expectedDate.setDate(today.getDate() - i)

            if (checkInDate.getTime() === expectedDate.getTime()) {
              streak++
            } else {
              break
            }
          }
          maxStreak = Math.max(maxStreak, streak)
        }
        return Math.min(maxStreak / achievement.requirement, 1) * 100
      }
      case 'total_completions': {
        const totalCompletions = checkIns.filter(ci => ci.completed).length
        return Math.min(totalCompletions / achievement.requirement, 1) * 100
      }
      case 'custom':
        if (achievement.id === 'first-habit') {
          return Math.min(habits.length / achievement.requirement, 1) * 100
        } else if (achievement.id === 'all-habits-day') {
          const today = new Date().toISOString().split('T')[0]
          const todayCheckIns = checkIns.filter(ci => ci.date === today && ci.completed)
          const completedHabits = new Set(todayCheckIns.map(ci => ci.habit_id))
          return completedHabits.size === habits.length && habits.length > 0 ? 100 : 0
        }
        return 0
      default:
        return 0
    }
  }

  return {
    achievements,
    userAchievements,
    loading,
    newlyUnlocked,
    checkForNewAchievements,
    getUnlockedAchievement,
    isUnlocked,
    getAchievementProgress,
    refresh: loadAchievements,
  }
}





