import type { Habit, HabitCheckIn, UserProgress, Achievement, UserAchievement, HabitTemplate } from '@/types'

// Storage keys
const STORAGE_KEYS = {
  USER: 'habit_adventure_user',
  HABITS: 'habit_adventure_habits',
  CHECK_INS: 'habit_adventure_check_ins',
  PROGRESS: 'habit_adventure_progress',
  ACHIEVEMENTS: 'habit_adventure_achievements',
  USER_ACHIEVEMENTS: 'habit_adventure_user_achievements',
  HABIT_TEMPLATES: 'habit_adventure_templates',
  SETTINGS: 'habit_adventure_settings',
} as const

// User type
export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  is_admin?: boolean
}

// Storage utilities
export const storage = {
  // User management
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },

  // Habits CRUD
  getHabits(): Habit[] {
    if (typeof window === 'undefined') return []
    const habitsStr = localStorage.getItem(STORAGE_KEYS.HABITS)
    return habitsStr ? JSON.parse(habitsStr) : []
  },

  saveHabits(habits: Habit[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
  },

  getHabitById(id: string): Habit | null {
    const habits = this.getHabits()
    return habits.find(h => h.id === id) || null
  },

  addHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Habit {
    const habits = this.getHabits()
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    habits.push(newHabit)
    this.saveHabits(habits)
    return newHabit
  },

  updateHabit(id: string, updates: Partial<Habit>): Habit | null {
    const habits = this.getHabits()
    const index = habits.findIndex(h => h.id === id)
    if (index === -1) return null

    habits[index] = {
      ...habits[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    this.saveHabits(habits)
    return habits[index]
  },

  deleteHabit(id: string): boolean {
    const habits = this.getHabits()
    const filtered = habits.filter(h => h.id !== id)
    if (filtered.length === habits.length) return false
    this.saveHabits(filtered)
    return true
  },

  // Check-ins
  getCheckIns(): HabitCheckIn[] {
    if (typeof window === 'undefined') return []
    const checkInsStr = localStorage.getItem(STORAGE_KEYS.CHECK_INS)
    return checkInsStr ? JSON.parse(checkInsStr) : []
  },

  saveCheckIns(checkIns: HabitCheckIn[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns))
  },

  getCheckIn(habitId: string, date: string): HabitCheckIn | null {
    const checkIns = this.getCheckIns()
    return checkIns.find(ci => ci.habit_id === habitId && ci.date === date) || null
  },

  getCheckInsForHabit(habitId: string): HabitCheckIn[] {
    const checkIns = this.getCheckIns()
    return checkIns.filter(ci => ci.habit_id === habitId)
  },

  getCheckInsForDate(date: string): HabitCheckIn[] {
    const checkIns = this.getCheckIns()
    return checkIns.filter(ci => ci.date === date)
  },

  addCheckIn(checkIn: Omit<HabitCheckIn, 'id' | 'created_at'>): HabitCheckIn {
    const checkIns = this.getCheckIns()
    const existingIndex = checkIns.findIndex(
      ci => ci.habit_id === checkIn.habit_id && ci.date === checkIn.date
    )

    const newCheckIn: HabitCheckIn = {
      ...checkIn,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    if (existingIndex !== -1) {
      checkIns[existingIndex] = newCheckIn
    } else {
      checkIns.push(newCheckIn)
    }

    this.saveCheckIns(checkIns)
    return newCheckIn
  },

  // User Progress
  getProgress(): UserProgress | null {
    if (typeof window === 'undefined') return null
    const progressStr = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    return progressStr ? JSON.parse(progressStr) : null
  },

  saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
  },

  initializeProgress(userId: string): UserProgress {
    const progress: UserProgress = {
      id: crypto.randomUUID(),
      user_id: userId,
      level: 1,
      xp: 0,
      total_xp: 0,
      current_world: 1,
      updated_at: new Date().toISOString(),
    }
    this.saveProgress(progress)
    return progress
  },

  addXP(amount: number): UserProgress {
    const progress = this.getProgress()
    if (!progress) {
      const user = this.getCurrentUser()
      if (!user) throw new Error('No user found')
      return this.initializeProgress(user.id)
    }

    // Add XP to total (xp field is kept for backwards compatibility but not used)
    progress.total_xp += amount
    progress.xp = progress.total_xp // Keep in sync
    progress.updated_at = new Date().toISOString()

    // Calculate new level using progressive system
    const { calculateLevel, calculateWorld, MAX_LEVEL } = require('@/lib/utils')
    const newLevel = calculateLevel(progress.total_xp)
    
    if (newLevel > progress.level) {
      progress.level = Math.min(newLevel, MAX_LEVEL) // Cap at MAX_LEVEL
      // Calculate world based on level (progressive with cap)
      progress.current_world = calculateWorld(progress.level)
    }

    this.saveProgress(progress)
    return progress
  },

  // Achievements (templates/definitions)
  getAchievements(): Achievement[] {
    if (typeof window === 'undefined') return []
    const achievementsStr = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
    return achievementsStr ? JSON.parse(achievementsStr) : []
  },

  saveAchievements(achievements: Achievement[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements))
  },

  // User Achievements (unlocked achievements)
  getUserAchievements(): UserAchievement[] {
    if (typeof window === 'undefined') return []
    const userAchievementsStr = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS)
    return userAchievementsStr ? JSON.parse(userAchievementsStr) : []
  },

  saveUserAchievements(userAchievements: UserAchievement[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(userAchievements))
  },

  getUserAchievement(achievementId: string): UserAchievement | null {
    const userAchievements = this.getUserAchievements()
    const user = this.getCurrentUser()
    if (!user) return null
    return userAchievements.find(ua => ua.achievement_id === achievementId && ua.user_id === user.id) || null
  },

  unlockAchievement(achievementId: string): UserAchievement | null {
    const user = this.getCurrentUser()
    if (!user) return null

    const userAchievements = this.getUserAchievements()
    const existing = userAchievements.find(ua => ua.achievement_id === achievementId && ua.user_id === user.id)
    if (existing) return existing // Already unlocked

    const achievement = this.getAchievements().find(a => a.id === achievementId)
    if (!achievement) return null

    const newUserAchievement: UserAchievement = {
      id: crypto.randomUUID(),
      achievement_id: achievementId,
      user_id: user.id,
      unlocked_at: new Date().toISOString(),
    }

    userAchievements.push(newUserAchievement)
    this.saveUserAchievements(userAchievements)

    // Award XP for achievement
    if (achievement.xp_reward > 0) {
      this.addXP(achievement.xp_reward)
    }

    return newUserAchievement
  },

  // Habit Templates
  getHabitTemplates(): HabitTemplate[] {
    if (typeof window === 'undefined') return []
    const templatesStr = localStorage.getItem(STORAGE_KEYS.HABIT_TEMPLATES)
    return templatesStr ? JSON.parse(templatesStr) : []
  },

  saveHabitTemplates(templates: HabitTemplate[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.HABIT_TEMPLATES, JSON.stringify(templates))
  },

  getHabitTemplateById(id: string): HabitTemplate | null {
    const templates = this.getHabitTemplates()
    return templates.find(t => t.id === id) || null
  },

  addHabitTemplate(template: Omit<HabitTemplate, 'id' | 'created_at' | 'updated_at'>): HabitTemplate {
    const templates = this.getHabitTemplates()
    const newTemplate: HabitTemplate = {
      ...template,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    templates.push(newTemplate)
    this.saveHabitTemplates(templates)
    return newTemplate
  },

  updateHabitTemplate(id: string, updates: Partial<HabitTemplate>): HabitTemplate | null {
    const templates = this.getHabitTemplates()
    const index = templates.findIndex(t => t.id === id)
    if (index === -1) return null

    templates[index] = {
      ...templates[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    this.saveHabitTemplates(templates)
    return templates[index]
  },

  deleteHabitTemplate(id: string): boolean {
    const templates = this.getHabitTemplates()
    const filtered = templates.filter(t => t.id !== id)
    if (filtered.length === templates.length) return false
    this.saveHabitTemplates(filtered)
    return true
  },

  // Settings
  getSettings(): Record<string, any> {
    if (typeof window === 'undefined') return {}
    const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return settingsStr ? JSON.parse(settingsStr) : {}
  },

  saveSettings(settings: Record<string, any>): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  },

  // Clear all data (for logout or reset)
  clearAll(): void {
    if (typeof window === 'undefined') return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },
}

// Auth utilities
export const auth = {
  signUp(email: string, password: string, name?: string): User {
    // Simple signup - in real app you'd hash the password
    // For this demo, we just store the user
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      created_at: new Date().toISOString(),
      is_admin: false,
    }
    storage.setCurrentUser(user)
    storage.initializeProgress(user.id)
    return user
  },

  signIn(email: string, password: string): User | null {
    // Simple signin - in real app you'd verify the password
    // For this demo, we check if user exists or create one
    const existingUser = storage.getCurrentUser()
    if (existingUser && existingUser.email === email) {
      return existingUser
    }
    // Auto-create user for demo purposes
    return this.signUp(email, password)
  },

  signOut(): void {
    storage.setCurrentUser(null)
  },

  getCurrentUser(): User | null {
    return storage.getCurrentUser()
  },

  isAuthenticated(): boolean {
    return storage.getCurrentUser() !== null
  },
}

// Re-export types
export type { Habit, HabitCheckIn, UserProgress, Achievement, UserAchievement, HabitTemplate }

