// Utility functions

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function isTomorrow(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  )
}

export function isYesterday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  )
}

export function getDateDisplayText(date: Date | string, t?: (key: string) => string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(d)) {
    return t ? t('calendar.today') || 'Today' : 'Today'
  }
  if (isTomorrow(d)) {
    return t ? t('calendar.tomorrow') || 'Tomorrow' : 'Tomorrow'
  }
  if (isYesterday(d)) {
    return t ? t('calendar.yesterday') || 'Yesterday' : 'Yesterday'
  }
  
  return formatDate(d)
}

// Progressive leveling system constants
export const MAX_LEVEL = 50
export const MAX_WORLD = 10
const BASE_XP = 50 // XP needed for level 2
const XP_MULTIPLIER = 1.15 // Each level requires 15% more XP than previous
const WORLD_LEVEL_INTERVAL = 5 // New world every 5 levels

/**
 * Calculate XP required for a specific level
 * Uses exponential growth: base * (multiplier ^ (level - 1))
 * Level 1: 0 XP (starting level)
 * Level 2: 50 XP
 * Level 3: 57.5 XP (50 * 1.15)
 * Level 4: 66.1 XP (57.5 * 1.15)
 * etc.
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  if (level > MAX_LEVEL) return getXPRequiredForLevel(MAX_LEVEL)
  
  // Calculate cumulative XP needed for this level
  let totalXP = 0
  for (let i = 2; i <= level; i++) {
    const xpForThisLevel = BASE_XP * Math.pow(XP_MULTIPLIER, i - 2)
    totalXP += Math.round(xpForThisLevel)
  }
  return totalXP
}

/**
 * Calculate current level based on total XP
 * Uses binary search for efficiency
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) return 1
  
  // Binary search for the correct level
  let low = 1
  let high = MAX_LEVEL
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const xpForMid = getXPRequiredForLevel(mid)
    const xpForNext = getXPRequiredForLevel(mid + 1)
    
    if (totalXP >= xpForMid && totalXP < xpForNext) {
      return mid
    } else if (totalXP < xpForMid) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  
  // If XP exceeds max level, return max level
  return MAX_LEVEL
}

/**
 * Get XP needed for the next level
 */
export function getXPForNextLevel(currentTotalXP: number): number {
  const currentLevel = calculateLevel(currentTotalXP)
  
  if (currentLevel >= MAX_LEVEL) {
    return 0 // Already at max level
  }
  
  const xpForCurrentLevel = getXPRequiredForLevel(currentLevel)
  const xpForNextLevel = getXPRequiredForLevel(currentLevel + 1)
  const xpNeeded = xpForNextLevel - currentTotalXP
  
  return Math.max(0, xpNeeded)
}

/**
 * Get progress percentage to next level
 */
export function getProgressPercentage(currentTotalXP: number): number {
  const currentLevel = calculateLevel(currentTotalXP)
  
  if (currentLevel >= MAX_LEVEL) {
    return 100 // At max level
  }
  
  const xpForCurrentLevel = getXPRequiredForLevel(currentLevel)
  const xpForNextLevel = getXPRequiredForLevel(currentLevel + 1)
  const progress = currentTotalXP - xpForCurrentLevel
  const total = xpForNextLevel - xpForCurrentLevel
  
  if (total === 0) return 100
  return Math.round((progress / total) * 100)
}

/**
 * Calculate world number based on level
 * New world every 5 levels, capped at MAX_WORLD
 */
export function calculateWorld(level: number): number {
  const world = Math.floor((level - 1) / WORLD_LEVEL_INTERVAL) + 1
  return Math.min(world, MAX_WORLD)
}

/**
 * Get level required for a specific world
 */
export function getLevelRequiredForWorld(world: number): number {
  if (world <= 1) return 1
  if (world > MAX_WORLD) return getLevelRequiredForWorld(MAX_WORLD)
  return (world - 1) * WORLD_LEVEL_INTERVAL + 1
}

