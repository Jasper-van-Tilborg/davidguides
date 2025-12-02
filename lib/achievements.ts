// Achievement definitions and checking logic

import type { Achievement } from '@/types'
import { storage } from './storage'

// Default achievement templates
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete a habit for 7 days in a row',
    icon: '🔥',
    xp_reward: 50,
    requirement: 7,
    type: 'streak',
    category: 'streaks',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Complete a habit for 30 days in a row',
    icon: '⭐',
    xp_reward: 200,
    requirement: 30,
    type: 'streak',
    category: 'streaks',
  },
  {
    id: 'streak-100',
    name: 'Century Champion',
    description: 'Complete a habit for 100 days in a row',
    icon: '👑',
    xp_reward: 500,
    requirement: 100,
    type: 'streak',
    category: 'streaks',
  },
  // Total completions
  {
    id: 'completions-10',
    name: 'Getting Started',
    description: 'Complete any habit 10 times',
    icon: '🌱',
    xp_reward: 25,
    requirement: 10,
    type: 'total_completions',
    category: 'habits',
  },
  {
    id: 'completions-50',
    name: 'Half Century',
    description: 'Complete any habit 50 times',
    icon: '🎯',
    xp_reward: 100,
    requirement: 50,
    type: 'total_completions',
    category: 'habits',
  },
  {
    id: 'completions-100',
    name: 'Century Club',
    description: 'Complete any habit 100 times',
    icon: '💯',
    xp_reward: 250,
    requirement: 100,
    type: 'total_completions',
    category: 'habits',
  },
  // Level achievements
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    xp_reward: 50,
    requirement: 5,
    type: 'level',
    category: 'progress',
  },
  {
    id: 'level-10',
    name: 'Veteran',
    description: 'Reach level 10',
    icon: '🏆',
    xp_reward: 150,
    requirement: 10,
    type: 'level',
    category: 'progress',
  },
  {
    id: 'level-25',
    name: 'Elite',
    description: 'Reach level 25',
    icon: '👑',
    xp_reward: 500,
    requirement: 25,
    type: 'level',
    category: 'progress',
  },
  // World achievements
  {
    id: 'world-2',
    name: 'Explorer',
    description: 'Unlock world 2',
    icon: '🌍',
    xp_reward: 100,
    requirement: 2,
    type: 'world',
    category: 'progress',
  },
  {
    id: 'world-5',
    name: 'World Traveler',
    description: 'Unlock world 5',
    icon: '🌎',
    xp_reward: 300,
    requirement: 5,
    type: 'world',
    category: 'progress',
  },
  // Special achievements
  {
    id: 'first-habit',
    name: 'First Steps',
    description: 'Create your first habit',
    icon: '🎯',
    xp_reward: 10,
    requirement: 1,
    type: 'custom',
    category: 'special',
  },
  {
    id: 'all-habits-day',
    name: 'Perfect Day',
    description: 'Complete all habits in one day',
    icon: '✨',
    xp_reward: 50,
    requirement: 1,
    type: 'custom',
    category: 'special',
  },
]

// Initialize default achievements if not present
export function initializeAchievements(): void {
  const existing = storage.getAchievements()
  if (existing.length === 0) {
    storage.saveAchievements(DEFAULT_ACHIEVEMENTS)
  }
}

// Check and unlock achievements based on current progress
export function checkAchievements(): string[] {
  const user = storage.getCurrentUser()
  if (!user) return []

  initializeAchievements()
  const achievements = storage.getAchievements()
  const userAchievements = storage.getUserAchievements()
  const progress = storage.getProgress()
  const habits = storage.getHabits()
  const checkIns = storage.getCheckIns()
  const unlockedIds: string[] = []

  if (!progress) return []

  // Get already unlocked achievement IDs for this user
  const unlockedAchievementIds = userAchievements
    .filter(ua => ua.user_id === user.id)
    .map(ua => ua.achievement_id)

  for (const achievement of achievements) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(achievement.id)) continue

    let shouldUnlock = false
    let progressValue = 0

    switch (achievement.type) {
      case 'level':
        progressValue = progress.level
        shouldUnlock = progress.level >= achievement.requirement
        break

      case 'world':
        progressValue = progress.current_world
        shouldUnlock = progress.current_world >= achievement.requirement
        break

      case 'streak': {
        // Check for longest streak across all habits
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
        progressValue = maxStreak
        shouldUnlock = maxStreak >= achievement.requirement
        break
      }

      case 'total_completions': {
        const totalCompletions = checkIns.filter(ci => ci.completed).length
        progressValue = totalCompletions
        shouldUnlock = totalCompletions >= achievement.requirement
        break
      }

      case 'custom':
        // Handle custom achievements
        if (achievement.id === 'first-habit') {
          progressValue = habits.length
          shouldUnlock = habits.length >= achievement.requirement
        } else if (achievement.id === 'all-habits-day') {
          const today = new Date().toISOString().split('T')[0]
          const todayCheckIns = checkIns.filter(ci => ci.date === today && ci.completed)
          const completedHabits = new Set(todayCheckIns.map(ci => ci.habit_id))
          progressValue = completedHabits.size === habits.length && habits.length > 0 ? 1 : 0
          shouldUnlock = completedHabits.size === habits.length && habits.length > 0
        }
        break
    }

    if (shouldUnlock) {
      const unlocked = storage.unlockAchievement(achievement.id)
      if (unlocked) {
        unlockedIds.push(achievement.id)
      }
    }
  }

  return unlockedIds
}

