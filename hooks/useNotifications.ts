'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  showHabitReminder,
  showAchievementUnlocked,
  showLevelUp,
  showWorldUnlocked,
  showDailyReminder,
} from '@/lib/notifications'

export function useNotifications() {
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const supported = isNotificationSupported()
    setSupported(supported)

    if (supported) {
      const currentPermission = getNotificationPermission()
      setPermission(currentPermission)
      setEnabled(currentPermission === 'granted')
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) return false

    try {
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)
      setEnabled(newPermission === 'granted')
      return newPermission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }, [supported])

  const notify = useCallback((options: Parameters<typeof showNotification>[0]) => {
    if (!enabled) return null
    return showNotification(options)
  }, [enabled])

  const remindHabit = useCallback((habitName: string) => {
    if (!enabled) return null
    return showHabitReminder(habitName)
  }, [enabled])

  const notifyAchievement = useCallback((achievementName: string, xpReward: number) => {
    if (!enabled) return null
    return showAchievementUnlocked(achievementName, xpReward)
  }, [enabled])

  const notifyLevelUp = useCallback((newLevel: number) => {
    if (!enabled) return null
    return showLevelUp(newLevel)
  }, [enabled])

  const notifyWorldUnlocked = useCallback((worldNumber: number) => {
    if (!enabled) return null
    return showWorldUnlocked(worldNumber)
  }, [enabled])

  const remindDaily = useCallback((completedCount: number, totalCount: number) => {
    if (!enabled) return null
    return showDailyReminder(completedCount, totalCount)
  }, [enabled])

  return {
    supported,
    permission,
    enabled,
    requestPermission,
    notify,
    remindHabit,
    notifyAchievement,
    notifyLevelUp,
    notifyWorldUnlocked,
    remindDaily,
  }
}




