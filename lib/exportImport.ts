// Export/Import functionality for user data

import { storage } from './storage'
import type { Habit, HabitCheckIn, UserProgress, UserAchievement } from '@/types'

export interface ExportData {
  version: string
  exportDate: string
  user: {
    email: string
    name?: string
  }
  habits: Habit[]
  checkIns: HabitCheckIn[]
  progress: UserProgress | null
  achievements: UserAchievement[]
}

// Export all user data to JSON
export function exportUserData(): string {
  const user = storage.getCurrentUser()
  if (!user) {
    throw new Error('No user logged in')
  }

  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    user: {
      email: user.email,
      name: user.name,
    },
    habits: storage.getHabits().filter(h => h.user_id === user.id),
    checkIns: storage.getCheckIns().filter(ci => ci.user_id === user.id),
    progress: storage.getProgress(),
    achievements: storage.getUserAchievements().filter(ua => ua.user_id === user.id),
  }

  return JSON.stringify(data, null, 2)
}

// Download export as file
export function downloadExport(): void {
  try {
    const jsonData = exportUserData()
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-adventure-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}

// Import user data from JSON
export function importUserData(jsonData: string, options?: { merge?: boolean }): {
  success: boolean
  imported: {
    habits: number
    checkIns: number
    achievements: number
  }
  errors: string[]
} {
  const errors: string[] = []
  const imported = {
    habits: 0,
    checkIns: 0,
    achievements: 0,
  }

  try {
    const data: ExportData = JSON.parse(jsonData)

    // Validate data structure
    if (!data.version || !data.exportDate) {
      throw new Error('Invalid export file format')
    }

    const currentUser = storage.getCurrentUser()
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    // Import habits
    if (data.habits && Array.isArray(data.habits)) {
      const existingHabits = options?.merge ? storage.getHabits() : []
      const existingHabitIds = new Set(existingHabits.map(h => h.id))
      
      const newHabits = data.habits
        .filter(h => h.user_id === data.user.email || !h.user_id) // Match by email or allow any
        .map(habit => ({
          ...habit,
          user_id: currentUser.id, // Update to current user ID
          id: existingHabitIds.has(habit.id) ? crypto.randomUUID() : habit.id, // New ID if duplicate
        }))

      if (options?.merge) {
        storage.saveHabits([...existingHabits, ...newHabits])
      } else {
        storage.saveHabits(newHabits)
      }
      imported.habits = newHabits.length
    }

    // Import check-ins
    if (data.checkIns && Array.isArray(data.checkIns)) {
      const existingCheckIns = options?.merge ? storage.getCheckIns() : []
      const existingCheckInKeys = new Set(
        existingCheckIns.map(ci => `${ci.habit_id}-${ci.date}`)
      )

      const newCheckIns = data.checkIns
        .filter(ci => {
          const key = `${ci.habit_id}-${ci.date}`
          return !existingCheckInKeys.has(key)
        })
        .map(checkIn => ({
          ...checkIn,
          user_id: currentUser.id,
          id: crypto.randomUUID(), // Always new ID for check-ins
        }))

      if (options?.merge) {
        storage.saveCheckIns([...existingCheckIns, ...newCheckIns])
      } else {
        storage.saveCheckIns(newCheckIns)
      }
      imported.checkIns = newCheckIns.length
    }

    // Import progress (only if no existing progress or not merging)
    if (data.progress) {
      const existingProgress = storage.getProgress()
      if (!existingProgress || !options?.merge) {
        const newProgress: UserProgress = {
          ...data.progress,
          user_id: currentUser.id,
          id: existingProgress?.id || crypto.randomUUID(),
        }
        storage.saveProgress(newProgress)
      }
    }

    // Import achievements
    if (data.achievements && Array.isArray(data.achievements)) {
      const existingAchievements = options?.merge ? storage.getUserAchievements() : []
      const existingAchievementIds = new Set(
        existingAchievements.map(ua => ua.achievement_id)
      )

      const newAchievements = data.achievements
        .filter(ua => !existingAchievementIds.has(ua.achievement_id))
        .map(achievement => ({
          ...achievement,
          user_id: currentUser.id,
          id: crypto.randomUUID(),
        }))

      if (options?.merge) {
        storage.saveUserAchievements([...existingAchievements, ...newAchievements])
      } else {
        storage.saveUserAchievements(newAchievements)
      }
      imported.achievements = newAchievements.length
    }

    return {
      success: true,
      imported,
      errors,
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    return {
      success: false,
      imported,
      errors,
    }
  }
}

// Validate import file
export function validateImportFile(jsonData: string): { valid: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonData)
    if (!data.version || !data.exportDate) {
      return { valid: false, error: 'Invalid file format' }
    }
    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid JSON' }
  }
}





