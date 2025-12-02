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

export function calculateLevel(xp: number): number {
  // Simple level calculation: 100 XP per level
  return Math.floor(xp / 100) + 1
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const xpForNextLevel = currentLevel * 100
  return xpForNextLevel - currentXP
}

export function getProgressPercentage(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const xpForCurrentLevel = (currentLevel - 1) * 100
  const xpForNextLevel = currentLevel * 100
  const progress = currentXP - xpForCurrentLevel
  const total = xpForNextLevel - xpForCurrentLevel
  return Math.round((progress / total) * 100)
}

